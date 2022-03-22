$().ready(function() {
    $('#mxp_track_link').click(function(){$(this).addClass('pp_open');$('.pp_help').togglePopup(); return false;});
    $('#mxp_track_link_list').click(function(){$(this).addClass('pp_open');$('.pp_help_list').togglePopup(); return false;});
    $(document).on('click', '#opaco, .popupClose', function(){$('#mxp_track_link, #mxp_track_link_list').removeClass('pp_open')});

    $(document).on('change, input, keyup', '.main-support-request', function() {
        var disable_button = false;
        $('#popup .main-support-request').each(function() {
            var tmp_val = $(this).val();
            if(!tmp_val) {
                disable_button = true;
            }
        });

        if( $('#popup input[name=support_request_email]').length ){
            if( validateEmail($('#popup input[name=support_request_email]').val()) ){
                $('#popup input[name=support_request_email]').removeClass('error');
            }
            else{
                $('#popup input[name=support_request_email]').addClass('error');
                disable_button = true;
            }
        }

        $('#send_main_request_button').attr('disabled', disable_button);
    });

    $(document).on('click', '#send_main_request_button', function(){
        ShowSpinButton('send_main_request_button');
        $('#spin_send_main_request_button').css('display', 'block');
    });
});