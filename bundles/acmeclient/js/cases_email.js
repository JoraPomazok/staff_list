var DomainsEmailSettings = new Array;
var timeout_id;
var saving_email_id;
var old_domain = false;
var refresh_email_id = false;
DomainsEmailSettings.push(new Array('gmail.com',  'imap', 'imap.gmail.com',  '993', 'ssl', 'smtp.gmail.com',  '465', 'ssl'));
DomainsEmailSettings.push(new Array('yandex.ru',  'imap', 'imap.yandex.ru',  '993', 'ssl', 'smtp.yandex.ru',  '465', 'ssl'));
DomainsEmailSettings.push(new Array('rambler.ru', 'imap', 'imap.rambler.ru', '993', 'ssl', 'smtp.rambler.ru', '465', 'ssl'));
DomainsEmailSettings.push(new Array('mail.ru',    'imap', 'imap.mail.ru',    '993', 'ssl', 'smtp.mail.ru',    '465', 'ssl'));

$(document).ready(function(){
	init_create_record();
	init_update_record();
	
	$(document).on('click', '.google_aps', function() {
		var email_id = $(this).closest('form').attr('id').replace('form_li_', '');
		var closes_form = $("#form_li_"+email_id);
		closes_form.find('.regular-email').hide();
		closes_form.find('.google-email').show();
		return false;
	})

	$(document).on('click', '.regular_email', function() {
		var email_id = $(this).closest('form').attr('id').replace('form_li_', '');
		var closes_form = $("#form_li_"+email_id);
		//closes_form.find('.regular-email').show();
		closes_form.find('.regular-email').css('display', 'block');
		closes_form.find('.google-email').hide();
		return false;
	});

	$(document).on('click', '.title_select a', function() {
		$('.title_select a').removeClass('active');
		$(this).addClass('active');
		var rel = $(this).attr('rel');
		if(rel == 'imap')
		{
			$('#form_li_0').find('.regular-email').css('display', 'block');
			$('#form_li_0').find('.google-email').hide();
            $('#form_li_0').find('.oauth-email').hide();
		}
		else if(rel == 'oauth')
		{
			$('#form_li_0').find('.oauth-email').css('display', 'block');
			$('#form_li_0').find('.google-email').hide();
			$('#form_li_0').find('.regular-email').hide();
		}
		else
		{
			$('#form_li_0').find('.google-email').css('display', 'block');
			$('#form_li_0').find('.regular-email').hide();
			$('#form_li_0').find('.oauth-email').hide();
            $('#form_li_0').find('.b_free_acc').css('display', 'block');
		}
		return false;
	});

})

function hideTwin(){
	$('.twoBlock').slideUp();
	$('.cancelTop').fadeOut();
}

function init_create_record() {
	$('.es_button').click(function(){
		$('.e_standard').slideDown();
		hideTwin();
		init_nice_elements();
		InitNanoScrolls(".e_standard")
		return false;
	});
	$('.eo_button').click(function(){
		$('.e_own').slideDown();
		hideTwin();
		$('#gmail_token_0').val('');
		$('.google-aps-info.oauth-email .google-info-b2 a').show();
		$('.google-aps-info.oauth-email .google-info-b2 span').hide();
		init_nice_elements(".e_own");
		InitNanoScrolls(".e_own")

		return false;
	});
	
	$('#emailaddress_0').on('blur', function() {
		var check_emailaddress = $('#emailaddress_0').val();
		if(validateEmail(check_emailaddress)) {
			domain = check_emailaddress.split('@')[1];
			for(i=0;i<DomainsEmailSettings.length;i++) {
				var tmpSettings = DomainsEmailSettings[i];
				if(domain.toLowerCase() == tmpSettings[0]) {
					$('#email_protocol_0').val(tmpSettings[1]);
					$('#incoming_server_0').val(tmpSettings[2]);
					$('#incoming_port_0').val(tmpSettings[3]);
					$('input[name=incoming_encryption_0]').each(function() {
						if($(this).val()==tmpSettings[4]) {
							$(this).prop('checked', true);
						}
					})
					$('#outgoing_server_0').val(tmpSettings[5]);
					$('#outgoing_port_0').val(tmpSettings[6]);
					$('input[name=outgoing_encryption_0]').each(function() {
						if($(this).val()==tmpSettings[7]) {
							$(this).prop('checked', true);
						}
					})
					init_nice_elements('#form_li_0');
				}
			}
		}
	})
}
function init_update_record(email_id) {
	
}

function save_local_email(email_id) {
	if(request_sent) {
		return;
	}
	ShowSpinButton('button_local_'+email_id);
	
	var local_part = $('#local_part_'+email_id).val();
    var group_id = $('#local_group_id_'+email_id).val();
    var group_allows_id = $('#local_group_allows_id_'+email_id).val();
	var b_send_notifications = $('#b_send_notifications_'+email_id).prop('checked');

	xajax_save_local_email(email_id, local_part, group_id,b_send_notifications,group_allows_id);
}

function save_user_email(email_id) {
	if(request_sent) {
		return;
	}
	
	$('#spin_lazy_'+email_id).show();
	
	var group_id = $('#user_group_id_'+email_id).val();
    var group_allows_id = $('#user_group_allows_id_'+email_id).val();
    var email_protocol = $('#email_protocol_'+email_id).val();
	var emailaddress = $('#emailaddress_'+email_id).val();
	var password = $('#password_'+email_id).val();
	var incoming_server = $('#incoming_server_'+email_id).val();
	var incoming_port = $('#incoming_port_'+email_id).val();
	var outgoing_server = $('#outgoing_server_'+email_id).val();
	var outgoing_port = $('#outgoing_port_'+email_id).val();
	var gmail_token   = $('#gmail_token_'+email_id).val();
	var incoming_encryption = $('input:checked[name=incoming_encryption_'+email_id+']').val();
	var outgoing_encryption = $('input:checked[name=outgoing_encryption_'+email_id+']').val();
	var b_remove_emails = $('#b_remove_emails_'+email_id).prop('checked');
	var b_send_notifications = $('#b_send_notifications_'+email_id).prop('checked');
//	var b_forward = $('#form_li_'+email_id).find('.regular_email').is(':visible');
	if(email_id > 0)
	{
		var b_forward = $('#form_li_'+email_id).attr('data-b_forward');
	}
	else
	{
		var b_forward = $('#form_li_'+email_id).find('.regular_email').is(':visible');
	}
	if(b_forward && $('#login_'+email_id).length) {
		var login = $('#login_'+email_id).val();
	} else {
		var login = '';
	}
	var type = $('.title_select a.active').attr('rel');

	//JSON.stringify( data_arr )
	xajax_save_user_email(email_id, emailaddress, password, group_id, email_protocol, incoming_server, incoming_port, incoming_encryption, outgoing_server, outgoing_port, outgoing_encryption, b_remove_emails, b_send_notifications, b_forward, login, gmail_token, type,group_allows_id);
	
	saving_email_id = email_id;
	timeout_id = setTimeout(function() {
		saving_email_id = 0;
		hide_spin_button(email_id);
		$('#spin_lazy_'+email_id).hide();
		ShowXajaxNotification('INCORRECT_EMAIL_SETTINGS')
	}, 15000)
}

function ResetTimeout() {
	clearTimeout(timeout_id)
    $('#password_0').val('');
}

function ShowEmailErrors(error_email_id, errors) {
	if(saving_email_id==error_email_id) {
		ShowXajaxNotification(errors);
	}
}

function hide_spin_button(email_id) {
	$('#button_spin_'+email_id).hide();
	$('#button_'+email_id).show();
}

function OnEdit(el) {
	GoogApsClick(el, 'google_aps');
}

function OnCancel(el) {
	GoogApsClick(el, 'regular_email');
}

function GoogApsClick(el, google_class) {
	var email_id = get_closes_li_id(el);
	var closes_form = $('#form_li_'+email_id);
	//РµСЃР»Рё СЌС‚Рѕ РµС‰Рµ РЅРµ РїРѕРґРєР»СЋС‡РµРЅРЅС‹Р№ РґРѕ РєРѕРЅС†Р° РµРјСЌР№Р»
	if(closes_form.find('.google_aps').length) {
		var emailaddress = $('#emailaddress_'+email_id).val();
		//РµСЃР»Рё СЌС‚Рѕ РµРјСЌР№Р» РѕС‚ gmail
		if(emailaddress.indexOf('@gmail.com')>0) {
			closes_form.find('.'+google_class).trigger('click');
		}
	}
}
function GetGoogleToken(token,email,email_id)
{
	if(!email_id && refresh_email_id)
	{
		email_id = refresh_email_id;
	}
	refresh_email_id = false;

	if(email_id)
	{
		$('#record_li_'+email_id+' a.refresh span').removeClass('icon-refresh').addClass('icon-spin').addClass('icon-spinner');
		xajax_UpdateOauthToken(email_id,token,email);
//		xajax_ReloadRecord(email_id);
		return;
	}
	var email_id = 0;
	if(!$('#emailaddress_'+email_id).val().length)
	{
		$('#emailaddress_'+email_id).val(email)
	}

	if ($('#emailaddress_'+email_id).val().toLowerCase() != email.toLowerCase())
	{
		ShowXajaxNotification('NO_EQUAL_EMAILS');
		$('#gmail_token_'+email_id).val('');
	}
	else
	{
		$('#gmail_token_'+email_id).val(token);
		$('.google-aps-info.oauth-email .google-info-b2 a').hide();
		$('.google-aps-info.oauth-email .google-info-b2 span').show();


	}
}
function set_main_domain(domain_)
{
	if(domain_)
	{
		old_domain = document.domain;
		document.domain = domain_;
	}
	else if(old_domain)
	{
		document.domain = old_domain;
		old_domain = null;
	}
}
function ClickAddNewRecord(el)
{
    $('.twoBlock').show()
}