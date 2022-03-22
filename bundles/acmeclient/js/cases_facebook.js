var fb_pages = [];
$(document).ready(function(){
    if($('.fb_configure').length) {
        $('.fb_configure input[type="checkbox"]').removeClass('skip-icheck');
        $('.fb_configure').togglePopup();
        init_nice_elements('#popup');
        $('.nano').nanoScroller({alwaysVisible: true});


        $(document).on('click', '#popup .vk-select-all', function() {
            const fiedlsRow = this.closest('.fiedlsRow').querySelectorAll('input[type="checkbox"]');
            fiedlsRow.forEach(element => element.checked = true)
            CheckConfigureButton();
            return false;
        })

        $(document).on('click', '#popup .vk-unselect-all', function() {
            const fiedlsRow = this.closest('.fiedlsRow').querySelectorAll('input[type="checkbox"]');
            fiedlsRow.forEach(element => element.checked = false)
            CheckConfigureButton();
            return false;
        })

        $(document).on('click', '#popup input[type="checkbox"]', function() {
            setTimeout(CheckConfigureButton, 50);
        })

        $(document).on('click', '#popup .btn-add-vk:not(.spinner)', function() {
            $('#popup .btn-add-vk').hide();
            $('#popup button.spinner').show();
            $('#popup input[type="checkbox"]:checked').each(function() {
                fb_pages.push($(this).val());
            })
            // console.log(fb_pages);
            //если выбраны ВК страницы
            if(fb_pages.length) {
                //отправляем аяксом запрос на сервер для "опубликования" выбранных страниц
                $.ajax({
                    url: fb_publish_url,
                    type: 'POST',
                    data: {
                        fb_pages_ids: fb_pages.join(',')
                    },
                    cache: false,
                    success: function ()
                    {
                        location.reload();
                    }
                });
                // $('#popup .vk-page-select').hide();
                // $('#popup .vk-page-configure').show();
                //
                // //показываем визард настроек каждой страницы
                // ShowNextPageData();
            }
            return false;
        })
    }

});
function init_update_record(start) {
	if(start) {
		start = start + ' ';
	} else {
		start = '';
	}
	$(start + '.update-record').click(function(e){
		e.preventDefault();
		update_record($(this).attr('id'));
	})
}

function update_record(button_id) {
	if(request_sent) {
		return;
	}
	
	record_id = button_id.match(/button_update_(\d+)/)[1];
	
	var group_id = $('#group_id_'+record_id).val();
	var convert_user_posts = $('#convert_user_posts_'+record_id).prop('checked');
	var convert_company_posts = $('#convert_company_posts_'+record_id).prop('checked');
	var convert_direct_posts = $('#convert_direct_posts_'+record_id).prop('checked');
	
	ShowSpinButton('button_update_'+record_id);
	xajax_UpdateRecord(record_id, group_id, convert_user_posts, convert_company_posts, convert_direct_posts);
}

function onOff(el, enable) {
	if($(el).attr('rel')=='page_used' && enable==0) {
		ShowXajaxNotification('PAGE_USED');
	}
	enableRecord(el, enable);
}

function DeleteRecord(remove_id) {
	if($('#record_'+remove_id).attr('rel')=='page_used') {
		ShowXajaxNotification('PAGE_USED');
	}
	AjaxDeleteRecord(remove_id);
}
function CheckConfigureButton() {
    const vk_pages_cnt = document.querySelectorAll("#popup input:checked").length
    if(vk_pages_cnt) {
        $('#popup .btn-add-vk').removeAttr('disabled');
    }
    else {
        $('#popup .btn-add-vk').attr('disabled', 'disabled');
    }
}