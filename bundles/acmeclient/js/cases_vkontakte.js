var vk_pages = [];
var CurrentPageId = 0;
var ConfirmatinString = '';

$(document).ready(function(){
    $(document).on('click', '.vk-page-confirmation-link', function() {
        $('.vk_confirmation').togglePopup();
        return false;
    })

    $(document).on('click', '.vk-page-secret-link', function() {
        $('.vk_secret').togglePopup();
        return false;
    })
    if($('.vk_configure').length) {
        $('.vk_configure input[type="checkbox"]').removeClass('skip-icheck');
       $('.vk_configure').togglePopup();
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
                vk_pages.push($(this).val());
            })
            //если выбраны ВК страницы
            if(vk_pages.length) {
                //отправляем аяксом запрос на сервер для "опубликования" выбранных страниц
                $.ajax({
                    url: vk_publish_url,
                    type: 'POST',
                    data: {
                        vk_pages_ids: vk_pages.join(',')
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
        
        $(document).on('keyup, change, input', '#popup .vk-page-configure-input', function() {
            CheckNextPageButton();
        })
        
        $(document).on('click', '#popup .btn-vk-configure', function() {
            //показываем визард настроек каждой страницы
            ShowNextPageData();
        })
        
        setInterval(UpdateConfirmatinString, 500);
    }
})

function UpdateConfirmatinString() {
    var confirmation_string = $.trim($('#popup .vk-page-configure-input').val());
    if(confirmation_string!=ConfirmatinString) {
        ConfirmatinString = confirmation_string;
        //сохраняем данные отклика страницы
        if(CurrentPageId) {
            $.ajax({
                url: vk_connect_url,
                type: 'POST',
                data: {
                    vk_page_id: CurrentPageId,
                    confirmation_string: ConfirmatinString
                },
                cache: false
            });
        }
    }
}

function CheckNextPageButton() {
    var confirmation_string = $.trim($('#popup .vk-page-configure-input').val());
    if(confirmation_string) {
        $('#popup .btn-vk-configure').removeAttr('disabled');
    }
    else {
        $('#popup .btn-vk-configure').attr('disabled', 'disabled');
    }
}

function ShowNextPageData() {
    //если есть еще страницы - покажем данные новой страницы
    if(vk_pages.length) {
        CurrentPageId = parseInt(vk_pages[0]);
        vk_pages = vk_pages.slice(1);
        for(var i=0; i<vk_pages_data.length; i++) {
            if(vk_pages_data[i][0]==CurrentPageId) {
                var CurrentPageTitle = vk_pages_data[i][1];
                var CurrentPageSecret = vk_pages_data[i][2];
                
                $('#popup .vk-page-title').html(CurrentPageTitle);
                $('#popup .vk-page-configure-secret').html(CurrentPageSecret);
                $('#popup .vk-page-configure-input').val('');
                
                CheckNextPageButton();
                break;
            }
        }
    }
    //иначе заканчиваем
    else {
        $('.vk_configure').togglePopup();
        location.reload();
    }
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

    const w_settings = document.querySelector(`#${button_id}`).closest("form").getAttribute("id")

        record_id = button_id.match(/button_update_(\d+)/)[1];
	
	var group_id = $('#group_id_'+record_id).val();
    var convert_user_posts = $('#convert_user_posts_'+record_id).prop('checked');
    var convert_company_posts = $('#convert_company_posts_'+record_id).prop('checked');
    var convert_direct_posts = $('#convert_direct_posts_'+record_id).prop('checked');
	var confirmation_string = '';//$('#confirmation_string_'+record_id).val();
	
	ShowSpinButton('button_update_'+record_id);
	xajax_UpdateRecord(record_id, group_id, confirmation_string, convert_user_posts, convert_company_posts, convert_direct_posts);

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