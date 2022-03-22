$(document).ready(function(){
	$(document).on('click', '.migration > div', function() {
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
		
		$('.tabs').hide();
		var tab_rel = $(this).attr('rel');
		$('.tab-'+tab_rel).show();
		
		return false;
	});
	
	$('#button_update').click(function() {
		UpdateAuthSettings();
	})
	
	if(!$("#sso_jwt_marker").val()) {
		GenerateNewJwtMarket();
	}
	
	$('#generate_new_jwt_market').click(function() {
		GenerateNewJwtMarket();
		return false;
	})
})

function GenerateNewJwtMarket() {
	$.ajax({
		url: '/php/fast.php',
		type: 'POST',
		dataType: 'json',
		data: {
			generate_jwt_token: 'true'
		},
		success: function(response) {
			//если был сгенерирован нормально токен
			if (response.token) {
				
				$("#sso_jwt_marker").val(response.token);
				$('#b_sso_jwt_market_changed').val('1');
				$('#help_marker_new').show();
				$('#help_marker_old').hide();
			}
		},
		cache: false
	});
	
}

function UpdateAuthSettings() {
	ShowSpinButton('button_update');
	var auth_active_rel = $('.auth-tabs .active').attr('rel');
	var auth_mode = auth_active_rel.replace('auth_', '');
	var b_native_just_auth = GetSwitcherBoolValue('b_native_just_auth_li');
	var sso_login_url = $('#sso_login_url').val();
	var sso_logout_url = $('#sso_logout_url').val();
	var b_sso_use_external_id = GetSwitcherBoolValue('b_sso_use_external_id_li');
	if($('#b_sso_jwt_market_changed').val()=='1') {
		var sso_jwt_marker = $('#sso_jwt_marker').val();
	} else {
		var sso_jwt_marker = '';
	}
	var b_sso_just_auth = GetSwitcherBoolValue('b_sso_just_auth_li');
	
	json_ar = { auth_mode : auth_mode,
				b_native_just_auth : b_native_just_auth,
				sso_login_url : sso_login_url,
				sso_logout_url : sso_logout_url,
				b_sso_use_external_id : b_sso_use_external_id,
				sso_jwt_marker : sso_jwt_marker,
				b_sso_just_auth : b_sso_just_auth
			};
	json_str = JSON.stringify( json_ar );
	xajax_UpdateAuthSettings(json_str);
}

function GetSwitcherBoolValue(element_id) {
	if($("#"+element_id).hasClass('active')) {
		return true;
	} else {
		return false;
	}
}

function UpdateJwtMarker(marker) {
	$('#sso_jwt_marker').val(marker);
	$('#b_sso_jwt_market_changed').val('0');
	$('#help_marker_new').hide();
	$('#help_marker_old').show();
}
