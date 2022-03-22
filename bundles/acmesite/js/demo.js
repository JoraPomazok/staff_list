$(document).ready(function(){
    $("#demoForm input.txt-big-fld").on('focusin', function(){
		$(this).closest('.form-it').removeClass('error-fld').removeClass('success-fld');
		$(this).siblings('.tooltip-cont').hide();
    });

    $("#demoForm input.txt-big-fld").on('focusout', function(){
		var field_id = $(this).attr('id');
		var field_value = $(this).val();
		if(CheckDemoForm(field_id)) {
			if(field_value) {
				xajax_CheckDemo(field_id, field_value);
			}
		}
    });
	
	$('#demo_process').click(function() {
		if(CheckDemoForm()) {
			ShowSpinProcessing();
			var full_name = $('#full_name').val();
			var emailaddress = $('#emailaddress').val();
			var site = $('#site').val();
			var staff = $('#staff').val();
			xajax_ScheduleDemo(full_name, emailaddress, site, staff);
		}
		return false;
	});
});

function ShowSpinProcessing() {
	$('#demo_process').hide();
	$('.schedule-demo-processing').show();
}

function HideSpinProcessing() {
	$('#demo_process').show();
	$('.schedule-demo-processing').hide();
}


function CheckDemoForm(field) {
	var fields_arr = new Array;
	var errors_arr = new Array;
	if(field) {
		fields_arr.push(field);
	} else {
		fields_arr.push('full_name');
		fields_arr.push('emailaddress');
		fields_arr.push('site');
		fields_arr.push('staff');
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
			if(!validateEmail(check_value)) {
				form_correct = false;
				errors_arr.push('emailaddress_error');
			}
		} else if(check_field=='site') {
			if(!validateSite(check_value)) {
				form_correct = false;
				errors_arr.push('site_error');
			}
		} else if(check_field=='staff') {
			if(check_value.length==0) {
				form_correct = false;
				errors_arr.push('staff_error');
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
}

function MarkFieldError(field) {
	$('#'+field).show();
	$('#'+field).closest('.form-it').removeClass('success-fld').addClass('error-fld');
	HideSpinProcessing();
}