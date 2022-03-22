$(document).ready(function(){
//add api key
	$('.addRow a').on('click', function(){
			var default_li = $('#li_default').clone();
			// Навешиваем класс -js-not-remove-temporary, чтобы запретить всплытие popup-а с подтверждением удаления
			$(default_li).addClass("d-flex").removeClass("hidden").addClass("-js-not-remove-temporary")

			$('.lw_body').append(default_li);
			
			editApply('#li_default');
			editRowList(default_li);
			actionButton(default_li);
			deleteApi(default_li)
			
			return false;
		});
	
		editRowList();
		editApply();
})

function deleteApi(el) {
	$(el).find('.delete').each(function() {
		$(this).click(function(){
			if($(this).closest('li').attr('id')=='li_default') {
				$(this).closest('.lw_item').fadeOut();
				$(this).closest('.lw_item').remove();
			}
		})
	})
}

function editRowList(el){
	if(!el) { el = document; }
	$(el).find('.editRowList').each(function() {
		$(this).click(function(){
			$(this).closest('.lw_item').find(".fieldRow input").removeAttr("disabled");
		});
	});
}

function handleApiKeyRow(el) {
	// Удаляем класс -js-not-remove-temporary, чтобы разрешить всплытие popup-а с подтверждением удаления
	el.closest(".lw_item").classList.remove("-js-not-remove-temporary")
	var closest_li = $(el).closest('li');
	title = $(el).closest('.lw_item').find('.fieldRow input').val();
	
	if($(closest_li).attr('id')=='li_default') {
		$.ajax({
			url: add_api_key_url,
			type: 'POST',
			data: {title: title},
			dataType: 'json',
			cache: false
		}).done(function( response ) {
            $(closest_li).find('.keyApi').html(response.api_key);
            $(closest_li).find('.keyCch').html(' (sync: cch'+response.sync_id+'; async: cch'+response.async_id+')');
            $(closest_li).attr('id', 'record_li_'+response.api_key_id);
			init_start_settings('#record_li_'+response.api_key_id);
			offOn('#record_li_'+response.api_key_id);
		});
	} else {
		var api_key_id = get_closes_li_id(el);
		$.ajax({
			url: update_api_key_url,
			type: 'POST',
			data: {title: title, api_key_id: api_key_id},
			dataType: 'json',
			cache: false
		}).done(function( response ) {
		});
	
	}
}
