var captcha_from = 0;
$(document).ready(function(){
    $("#regForm input.txt-big-fld").on('focusin', function(){
		$(this).closest('.form-it').removeClass('error-fld').removeClass('success-fld');
		$(this).siblings('.tooltip-cont').hide();
		$(this).siblings('.tooltip-cont-viber').hide();
        //$(this).siblings('.tooltip-cont').fadeIn(150);
    });

	$("#regForm input.txt-big-fld").on('focusout', function(){
		var field_id = $(this).attr('id');
		var field_value = $(this).val();
		if(CheckRegistrationForm(field_id)) {
			if(field_value) {
				xajax_CheckRegistration(field_id, field_value);
			}
		}
	});
	$("#regForm input.txt-field-phone").on('change', function(){
		var field_id = $(this).attr('id');
		var field_value = $(this).val();
		if(ValidPhone(field_value)) {
			$(this).parent().find('.butt').removeAttr('disabled');
		}
		else
		{
			$(this).parent().find('.butt').attr('disabled','disabled');
		}
	});
	$("#phone-code").on('keyup', function(){
		var field_value = $(this).val();
		if(field_value.length) {
			$(this).parent().find('.butt').removeAttr('disabled');
		}
		else
		{
			$(this).parent().find('.butt').attr('disabled','disabled');
		}
	});
	$('#check_phone').on('click',function () {
		captcha_from = 1;
		$('.reg_captha').togglePopup();

/*
		xAjaxCall('SendSms',[$('#phone').val()],function (obj) {
			if(obj.error.length)
			{
				MarkFieldError(obj.error);
			}
			else
			{
				$('.form-field-check-phone').show();
				$('.form-field-phone').hide();
			}
		});
*/
	});
	$('#check_code').on('click',function () {
		xAjaxCall('CheckSmsCode',[$('#phone').val(),$('#phone-code').val()],function (obj) {
			if(obj.error.length)
			{
				MarkFieldError(obj.error);
			}
			else
			{
				$('.form-field-check-phone').hide();
				$('.form-field-phone').show();
				$('#phone').attr('readonly','readonly').removeClass('txt-field-phone');
				$('#check_phone').hide();
				$('#reg_process').removeAttr('disabled');
				$('.form-field-phone').removeClass('form-field-phone');
				MarkFieldSuccess('phone');

			}
		});
	});
	$('#send_code_delete').on('click',function () {
		$('#phone').val('');
		$('#phone-code').val('');
		$('#phone').parent().find('.butt').attr('disabled','disabled');
		$('.form-field-check-phone').hide();
		$('.form-field-phone').show();
	});

	$('#send_code_repeat').on('click',function () {
		if($(this).hasClass('disabled'))
		{
			return false;
		}
		$('#send_code_repeat').addClass('disabled')
		captcha_from = 2;
		$('.reg_captha').togglePopup();

/*
		xAjaxCall('SendSms',[$('#phone').val()],function (obj) {
			if(obj.error != 'phone_error_ban'){
				var tj = 60;
				$('#send_code_repeat').addClass('timer').html(tj)
				var ti = setInterval(function () {
					tj--
					if(tj<2)
					{
						$('#send_code_repeat').removeClass('disabled').html('<i class="fa fa-repeat"></i>')
						clearInterval(ti);
						return;
					}
					$('#send_code_repeat').html(tj)

				},1000);

			}
			if(obj.error.length)
			{
				MarkFieldError(obj.error);
			}
			else
			{
				$('.form-field-check-phone').show();
				$('.form-field-phone').hide();
			}
		});
*/
	});

	$(document).on('click','#popup input[type=button]',function () {
		captcha_from = 0;
		$('.reg_captha').togglePopup();
		$('#capcha_code').removeClass('error-fld');
		if(captcha_from  ==2)
		{
			xAjaxCall('SendSms',[$('#phone').val(),$('#capcha_code').val()],function (obj) {
				$('#capcha_code').val('');
				if(obj.error && obj.error.match('captcha'))
				{
					captcha_from = 2;
					$('.reg_captha').togglePopup();
					$('#capcha_code').addClass('error-fld')
				}
				if(obj.error != 'phone_error_ban'){
					var tj = 60;
					$('#send_code_repeat').addClass('timer').html(tj)
					var ti = setInterval(function () {
						tj--
						if(tj<2)
						{
							$('#send_code_repeat').removeClass('disabled').html('<i class="fa fa-repeat"></i>')
							clearInterval(ti);
							return;
						}
						$('#send_code_repeat').html(tj)

					},1000);

				}
				if(obj.error.length)
				{
					MarkFieldError(obj.error);
				}
				else
				{
					$('.form-field-check-phone').show();
					$('.form-field-phone').hide();
				}
			});
		}
		else
		{
			xAjaxCall('SendSms',[$('#phone').val(),$('#capcha_code').val()],function (obj) {
				$('#capcha_code').val('')
				if(obj.error.length)
				{
					if(obj.error && obj.error.match('captcha'))
					{
						captcha_from = 1;
						$('.reg_captha').togglePopup();
						$('#capcha_code').addClass('error-fld')
					}
					MarkFieldError(obj.error);
				}
				else
				{
					$('.form-field-check-phone').show();
					$('.form-field-phone').hide();
				}
			});
		}
	});



	$('#reg_process').click(function() {
		if(CheckRegistrationForm()) {
			var full_name = $('#full_name').val();
			var emailaddress = $('#emailaddress').val();
			var password = $('#password').val();
			var subdomain = $('#subdomain').val();
			var phone = $('#phone').val();
			var code = $('#phone-code').val();

      if($('#reg_spin_process').length) {
        $(this).hide();
        $('#reg_spin_process').show();
      }

			xajax_Registration(full_name, emailaddress, password, subdomain,phone,code);
		}
		return false;
	});
});


function CheckRegistrationForm(field) {
	var fields_arr = new Array;
	var errors_arr = new Array;
	if(field) {
		fields_arr.push(field);
	} else {
		fields_arr.push('full_name');
		fields_arr.push('emailaddress');
		fields_arr.push('password');
		fields_arr.push('subdomain');
        fields_arr.push('phone');
	}
	var form_correct = true;
	for(i=0;i<fields_arr.length;i++) {
		check_field = fields_arr[i];
		check_value = $('#'+check_field).val();
		if(check_field=='full_name') {
			if(check_value.length<3) {
				form_correct = false;
				errors_arr.push('full_name_error');
			}
		} else if(check_field=='emailaddress') {
			if(check_value.length==0) {
				form_correct = false;
				errors_arr.push('emailaddress_error_empty');
			} else if(!validateEmail(check_value)) {
				form_correct = false;
				errors_arr.push('emailaddress_error_incorrect');
			}
		} else if(check_field=='password') {
			if(check_value.length<6) {
				form_correct = false;
				errors_arr.push('password_error');
			}
		} else if(check_field=='subdomain') {
			if(check_value.length==0) {
				form_correct = false;
				errors_arr.push('subdomain_error_empty');
			}
		}
        else if(check_field=='phone') {
            if(!ValidPhone(check_value)) {
                form_correct = false;
                errors_arr.push('phone_error');
            }
        }
	}
	if(!form_correct) {
		for(i=0;i<errors_arr.length;i++) {
			error_id = errors_arr[i];
			MarkFieldError(error_id);
		}
	}

	return form_correct;
}

function MarkFieldSuccess(field) {
	$('#'+field).siblings('.tooltip-cont').hide();
	$('#'+field).closest('.form-it').removeClass('error-fld').addClass('success-fld');
	if(field == 'phone')
	{
		$('#'+field).parent().find('.butt').removeAttr('disabled');
	}
}

function MarkFieldError(field) {
	$('#'+field).show();
	$('#'+field).closest('.form-it').removeClass('success-fld').addClass('error-fld');
	if(field == 'phone_error')
	{
		$('#'+field).parent().find('.butt').attr('disabled','disabled');
	}
	if (field == 'phone_error_ban')
	{
		$('#send_code_repeat').addClass('disable')
	}
	if(field == 'phone_sms_error')
	{
		$('.form-field-check-phone').hide();
		$('.form-field-phone').show();
		$('#phone').removeAttr('readonly').addClass('txt-field-phone');
		$('#check_phone').show();
		$('#reg_process').attr('disabled','disabled');

	}
}
function ValidPhone(phone) {
	var re = /^\+?[\s0-9\(\)-]{5,}$/;
	var re_ = /^\+?[\s0-9\(\)-]{5,}\s*\/\s*[0-9]{3,}$/;

	return re.test(phone) || re_.test(phone);
}
$.fn.togglePopup = function(){
	//detect whether popup is visible or not
	if($('#popup').hasClass('hidden'))
	{
		$(this).find('.captcha_img')[0].src+=1
		//hidden - then display

		{
			$('#opaco').height($(document).height()).toggleClass('hidden').fadeTo('slow')
				.click(function(){captcha_from = 0;$(this).togglePopup();});
		}

		$('#popup')
			.html($(this).html())
			.alignCenter()
			.toggleClass('hidden');
		// setTimeout(function () {
		// 	$('#popup .captcha_img')[0].src+=1
		// },200);
	}
	else
	{
		//visible - then hide
		$('#opaco').toggleClass('hidden').removeAttr('style').unbind('click');
		$('#popup').toggleClass('hidden');
	}
	$('.popupClose').click(function(){captcha_from = 0; $.fn.togglePopup();});
};
$.fn.alignCenter = function() {
	//get margin left
	var marginLeft =  - $(this).width()/2 + 'px';
	//get margin top
	var marginTop =  $(document).scrollTop() - $(this).height()/2 + 'px';
	//return updated element
	return $(this).css({'margin-left':marginLeft, 'margin-top':marginTop});
};
