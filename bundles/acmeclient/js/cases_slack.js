$(document).ready(function(){
	init_create_record();
	init_update_record();
	$('a.link_manual').click(function ()
	{
		$('#showSlackBotManual').togglePopup();
		if($(document).nanoScroller)
		{
			$('.tg_bot_manual .nano').nanoScroller({alwaysVisible: true});
		}
	})
});

function hideTwin(){
	$('.twoBlock').slideUp();
	$('.cancelTop').fadeOut();
}

function init_create_record() {
	$('.es_button').click(function(){
		$('.e_standard').slideDown();
		$('#type_bot_0').val(1);
		$('#type_bot_-1').val(1);
		hideTwin();
		return false;
	});
	$('.eo_button').click(function(){
		$('.e_own').slideDown();
		$('#type_bot_0').val(2);
		$('#type_bot_-1').val(2);
		hideTwin();
		return false;
	});
}
function init_update_record(bot_id) {
	
}

function SaveBot(bot_id) {

	ShowSpinButton('button_local_'+bot_id);
	
	var group_id     = $('#group_id_'+bot_id).val();
	var token        = $('#app_id_'+bot_id).val();
    var password     = $('#password_'+bot_id).val();
    var secret_key   = $('#secret_key_'+bot_id).length ? $('#secret_key_'+bot_id).val() : '';

	xajax_SaveBot(bot_id, group_id,token,password,secret_key);

	return false;
}

function ReloadRecord(bot_id,html)
{
	if($('#record_li_'+bot_id).length)
	{
		$('#record_li_'+bot_id).html(html);
	}
	else
	{
		$('.span_cnt').html(parseInt($('.span_cnt').html())+1);
		$('<li>')
			.addClass('lw_item')
			.addClass('active')
			.addClass('clearfix')
			.attr('id','record_li_'+bot_id)
			.html(html)
			.appendTo('#record_list.botsList');
		$('div.addBot').slideUp();
		hideTwin();
		$('.addButton').removeClass('dsbld')
	}
	InitialSettings(bot_id);
}