$(document).ready(function(){
        $('.upload-form').ajaxForm({
            complete: function(xhr) {
                response = xhr.responseText;
                if(response) {
                    response = JSON.parse(response);
                    img_id = response.img_id;

                    HideSpinButton('button_update');
                    if(response.message_code) {
                        ShowXajaxNotification(response.message_code);
                    }

                    if(response.status=='success') {
                        $('#'+img_id).each(function() {
                            $(this).attr('src', response.thumbnail);
                        })
                    }

                    $('#logo_pic').val('');
                    $('#favicon_pic').val('');
                }
            }
        });
        $('input[type=file]').change(function() {
            ShowSpinButton('button_update');
            $(this).closest('form').ajaxForm({
                complete: function(xhr) {
                    response = xhr.responseText;
                    if(response) {
                        response = JSON.parse(response);
                        img_id = response.img_id;

                        HideSpinButton('button_update');
                        if(response.message_code) {
                            ShowXajaxNotification(response.message_code);
                        }

                        if(response.status=='success') {
                            $('#'+img_id).each(function() {
                                $(this).attr('src', response.thumbnail);
                            })
                        }

                        $('#favicon_ak_pic').val('');
                        $('#favicon_ac_pic').val('');
                    }
                }
            });
            $(this).closest('form').trigger('submit');
            setTimeout(function () {
//                $(self).closest('form').removeClass('upload-form');
            },1000)
        });

        $('#button_update').click(function(e) {
		e.preventDefault();
		ShowSpinButton('button_update');

        var time_zone   = $('#form_tz_info').val();
        var terms_link  = $('#form_terms_link').val();
        var auto_close_chat = $('#auto_close_chat').val();
		var time_format = $('input:checked[type=radio][name=time_format]').val();
		var date_format = $('input:checked[type=radio][name=date_format]').val();
    var client_lang = $('#client_lang').val();
    var staff_lang = $('#staff_lang').val();
		var tmp_phrases = [];
		$('.replacesPhrases ul li:not(.default)').each(function ()
		{
			tmp_phrases.push({
				'f' : $(this).find('input:eq(0)').val(),
				't' : $(this).find('input:eq(1)').val(),
			});
		});
		xajax_UpdateSettings(time_zone, time_format, date_format,tmp_phrases,terms_link,auto_close_chat, client_lang, staff_lang);
	});
	$(document).on('click','.replacesPhrases .removePhrase',function ()
	{
		$(this).parent().remove();
		return false;
	});
 	$('.replacesPhrases .addRow').click(function ()
	{
		var el = $('.replacesPhrases ul li.default').clone();
		var l = $('.replacesPhrases ul li').length;
		el.find('input').each(function ()
		{
			$(this).attr('name',$(this).attr('name').replace('[0]','['+l+']'));
		});
		el.removeClass('hidden').removeClass('default');
		$('.replacesPhrases ul').append(el);
		return  false;
	});
    $('#auto_close_chat').change(function ()
    {
        var v = parseInt($(this).val());
        if (v<1)
            $(this).val(1);
        if (v>1440)
            $(this).val(1440);

        return  false;
    });


});

function onOff(el, enable) {
	var type = get_closes_li_id(el);

	if(type == 'comments' || type == 'mediana')
	{
		var check_el = false;
	}
	else if(type=='support') {
		var check_el = $('.b_support_zone')
	} else {
		var check_el = $(el).parents('.support-zone-div').next().find('#group_list_link')
	}

	if(enable && check_el) {
		check_el.show();
	} else if(check_el){
		check_el.hide();
	}

	enableRecord(el, enable);
}
