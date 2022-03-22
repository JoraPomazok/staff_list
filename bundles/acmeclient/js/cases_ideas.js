$(document).ready(function(){
	$( ".records_sortable" ).sortable(
		{handle: ".js-move-item"},
		{axis: "y" },
		{stop: function( event, ui ) {
			SortRecords(true);
		}}
	);

});

function SortRecords(b_sort_db) {
	var start = 1;
	var sort_li_arr = Array();
	$('#record_list li').each(function() {
		if($(this).hasClass('active')) {
			$(this).find('.span-sort').html(start);
			start++;
			sort_li_arr.push($(this).attr('id'));
		}
	});
	if(sort_li_arr.length>0 && b_sort_db) {
		xajax_SortRecords(sort_li_arr.join(':'));
	}
}

function onOff(item, enable) {
	enableRecord(item, enable);
	var li_el = $(item).closest('li');
	if(enable) {
		$('#record_list').append(li_el);
	} else {
		$('#disabled_record_list').append(li_el);
	}
	SortRecords(false);
}

function ClickDeleteRecord(el) {
	if($(el).closest('.lw_item').find('.onOff').first().attr('rel')=='b_used') {
		$('#record_used').togglePopup();
	} else {
		StartDeleteRecord(el);
	}
}

function PostDeleteRecord() {
	SortRecords(false);
}

function init_create_record() {
	$('.create-record').off('click').on('click',function(e) {
		e.preventDefault();
		update_record('button_update_0');
	})
}

function init_update_record(start) {
	$(start + ' .update-record').off('click').on('click',function(e){
		e.preventDefault();
		update_record($(this).attr('id'));
	})
}

function update_record(button_id) {
	if(request_sent) {
		return;
	}
	var record_id = button_id.match(/button_update_(\d+)/)[1];
	var group_id = $.trim($('#group_id_'+record_id).val());

	var data = {};
	var errors = [];
	var errors_fields = [];

	$('input[id^=title_'+record_id+']').each(function(){
		var lang_id = this.id.substr(('title_'+record_id+'_').length);
		var b_star = $(this).attr('data-star');
		var title = $.trim(this.value);
		if(!title.length && b_star == 1)
		{
			errors.push('EMPTY_TITLE');
			errors_fields.push('title_'+record_id+'_'+lang_id);
		}
		data[lang_id] = title;
	});
	ShowNotification(errors, errors_fields);
	if(errors.length>0) {
		return false;
	}

	if(record_id==0) {
		ShowSpinButton('button_create');
		xajax_CreateRecord(data, group_id);
	} else {
		ShowSpinButton('button_update_'+record_id);
		xajax_UpdateRecord(record_id, data, group_id);
	}
}
