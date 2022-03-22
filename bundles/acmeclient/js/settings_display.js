$(document).ready(function(){

	$('#display_form').magnificPopup({
	delegate: '.image-gallery',
	type: 'image',
	tLoading: Translate('cases_custom_fields_js/loading_picture')+' #%curr%...',
	mainClass: 'mfp-img-mobile mfp-bg-gallery',
	tClose: Translate('cases_custom_fields_js/close'),
	closeMarkup: '<button title="%title%" type="button" class="mfp-close mfp-close-gallery">×</button>',
	gallery: {
		enabled: false,
		navigateByImgClick: false,
		preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
	},
	image: {
		tError: '<a href="%url%">'+Translate('cases_custom_fields_js/picture')+' #%curr%</a> '+Translate('cases_custom_fields_js/can_not_be_load'),
	}
});

	$(document).on('keyup', '#display_form', function () {
        checkForm();
    });

    $(document).on('click', '#settings_display:not([disabled])', function(){
        $('.notifications .n_close').click();
        // if(!validateDisplayForm()){
        //   ShowXajaxNotification('SETTINGS_UPDATE_ERROR',1);
        //   $('#settings_display').attr('disabled', true);
        //    return false;
        //  }

        ShowSpinButton('button_update');

        $.ajax({
          url: $('#display_form').attr('action'),
          type: 'POST',
          dataType: 'json',
          data: $('#display_form').serialize(),
          success: function(data){
            if(data.success){
							$('#display_form input[type="text"]').each(function(){
								$(this).attr('value', $(this).val());
							});
              ShowXajaxNotification('SETTINGS_UPDATED',1);
            } else {
              ShowXajaxNotification('SETTINGS_UPDATE_ERROR',1);
              if(data.errors)
              {
                $.each(data.errors, function(i, val){
                  $('#display_form input[name="'+val+'"]').css('border', '1px solid red');
                });
              }
            }
            HideSpinButton('button_update');
          }
        });
        $(this).attr('disabled', 'disabled')
  	});
})

function validateDisplayForm()
{
  var re = new RegExp("https?:\/\/[^\/]+\/?.*\/.*(\.js)$");
  var valid = false;
  $('#display_form input[type="text"]').each(function(){
    let value = $(this).val().trim();
    let validUrl = value.match(re);
    if(value.length)
    {
      if(validUrl)
      {
        $(this).css('border', '1px solid #E0E0E0');
        valid = true;
      } else {
        $(this).css('border', '1px solid red');
        valid = false;
      }
    }
  });

  return valid;
}

function checkForm(){
  var active = false;
  $('#display_form input[type="text"]').each(function(){
    $(this).css('border', '1px solid #E0E0E0');
    let value = $(this).val().trim();
    let prevValue = $(this)[0].defaultValue;
    if(value != prevValue){
      active = true;
    }
  });

 $('#settings_display').attr('disabled', !active);

}
