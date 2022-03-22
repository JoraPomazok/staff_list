$(document).ready(function(){
    $('#changePassBtn').click(function() {
		var reset_code = $('#reset_code').val();
		var password = $('#password').val();
		var password_rep = $('#password_rep').val();
		xajax_CheckNewPassword(reset_code, password, password_rep);
		return false;
	})
});

function ShowError() {
	$('#reset_error').show();
}

function SendForm() {
	$('#reset_error').hide();
	$('#changePassForm').submit();
}