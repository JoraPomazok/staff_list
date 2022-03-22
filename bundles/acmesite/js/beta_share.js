$(document).ready(function(){
	if ($.browser.flash == true) {
		$("#copyButton").zclip({
			path: "/bundles/js_vendor/ZeroClipboard.swf",
			copy: function(){
				return $(this).text();
			}
		});
	}
	
	$('#invite_emailaddress').on('focus', changeEmailColor);
	$('#invite_emailaddress').on('keydown', changeEmailColor);
	$('#invite_emailaddress').on('change', changeEmailColor);
});

function changeEmailColor() {
	$('#invite_emailaddress').css('color', '#000');
}

function validateForm() {
	var emailaddress = $('#invite_emailaddress').val();
	if(validateEmail(emailaddress)) {
		return true;
	} else {
		$('#invite_emailaddress').css('color', 'red');
		return false;
	}
}