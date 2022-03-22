$(document).ready(function(){
	$('#button_update').click(function(e) {
		e.preventDefault();
		ShowSpinButton('button_update');
		
		var SecuritySettings = new Array;
		$('input.security').each(function() {
			var allowed_settings = $(this).attr('id')+'#'+$(this).val()
			SecuritySettings.push(allowed_settings);
		})
		var ResultSettings = SecuritySettings.join('|');
        var use_ssl = $('#use_ssl').prop('checked');
        var form_auto_logout = $('#form_auto_logout').val();

		xajax_UpdateSettings(ResultSettings, use_ssl,form_auto_logout);
	})
})