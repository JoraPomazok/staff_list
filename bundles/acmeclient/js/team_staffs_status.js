let last_row_selected = 0;
$(document).ready(function(){
	$( ".records_sortable" ).sortable(
        {connectWith: ".records_sortable"},
		{handle: ".js-move-item"},
		{axis: "y" },
		{stop: function( event, ui ) {
			SortRecords(true);
        }},
        {receive: function( event, ui ) {
            section_id = $(this).attr('id');

            record_id = ui.item.attr('id');
            record_id = record_id.replace('record_li_','');

            //todo:dru Запрос на сохранение положения
            // xajax_UpdateSectionRecord(record_id, section_id);
            SortRecords(true);
        }}
	);
    $(document).on('click', '.text_type_hours_select a', function(){
        if ($(this).parent().hasClass('disabled'))
        {
            return false;
        }
        $(this).parent().find('a').removeClass('active');
        $(this).addClass('active');
        // console.log($(this).parents('label').find('input'));
        $(this).parents('label').find('input').trigger('change')
        return false;
    });
    $(document).on('input', 'input.js_valid_integer', function(){
        this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1');
    });
    // $(document).on('change', 'input.js_auto_set_time_status', function(){
    //     let auto_set_time_status = parseInt($(this).val())*$(this).parents('label').find('.text_type_hours_select a.active').attr('rel');
    //     let cid = $(this)[0].id.match(/[0-9]+$/).toString();
    //     let _self = this;
    //
    //     if(!auto_set_time_status)
    //     {
    //         return true;
    //     }
    //
    //     $('input.js_auto_set_time_status').each(function () {
    //         let _auto_set_time_status = parseInt($(this).val())*$(this).parents('label').find('.text_type_hours_select a.active').attr('rel');
    //         let _cid = $(this)[0].id.match(/[0-9]+$/).toString();
    //         if(_cid == cid)
    //         {
    //             return;
    //         }
    //         if(_auto_set_time_status == auto_set_time_status)
    //         {
    //             AddNotification(
    //                 'Уже есть статус с таким значением. Укажите другое значение.','error'
    //             );
    //             $(_self).val('')
    //             return;
    //         }
    //         else if ($(this).hasClass('js_offline')
    //             && _auto_set_time_status <= auto_set_time_status)
    //         {
    //             AddNotification(
    //                 'Нельзя задавать значение больше, чем у статуса «офлайн» ('+$(this).val()+' '+($(this).parents('label').find('.text_type_hours_select a.active').attr('rel') == 60 ? omniLang.getLangPhrase('time_min',$(this).val()) : omniLang.getLangPhrase('time_hour',$(this).val()))+'). Укажите меньшее значение.','error'
    //             );
    //             $(_self).val('')
    //             return;
    //         }
    //
    //
    //     })
    //
    // });

    $(document).on('change', '.js_status_check', function() {
        let target = $(this).hasClass('js_check_all_status') ? $('[name="status_item"]:not([disabled])') : $(this);
        let fn_btn = $('.fn_btn');

        if($(this).prop('checked'))
        {
            target.prop('checked', true);
            target.parents('.lw_item').addClass('selected');
            fn_btn.show();
            $('.addUser').hide();
        }
        else
        {
            target.prop('checked', false);
            target.parents('.lw_item').removeClass('selected');
            if($('.lw_item.selected').length < 1) {
                $('.js_check_all_status').attr('checked', false);
                fn_btn.hide();
                $('.addUser').show();
            }
        }
    });

    $(document).on('click', '.fn_cancel', function(e) {
        e.preventDefault()
        let target = $('.js_status_check:not([disabled])')
        let fn_btn = $('.fn_btn');

        target.prop('checked', false);
        target.parents('.lw_item').removeClass('selected');
        fn_btn.hide();
        $('.addUser').show();
    });

    $(document).on('click', '.js_fn_delete', function(e) {
        e.preventDefault()
        ClickDeleteRecord($('.lw_item.selected a.delete'));
    });

    $(document).on('click', '.js_fn_merge', function(e) {
        e.preventDefault()
        $('#record_used_merge').togglePopup();
    });

    InitColorPicker($(".addingBlock input.cch_colorpicker"));

		$(document).on('click', '.staffs_status_titles .change_form', function(e){
			e.preventDefault();
			$(this).parents('.staffs_status_titles').find('.change_form').removeClass('active');
			$(this).addClass('active');
			let lang_id  = $(this).data('lang_id');
			$(this).parents('.staffs_status_titles').find('.staffs_status_title').hide();
			$(this).parents('.staffs_status_titles').find('#title_'+lang_id).show();
		});
});

function SortRecords(b_sort_db) {
	var start = 1;
	var sort_li_arr = Array();
	$('#record_list li').each(function() {
		if($(this).hasClass('active')) {
			$(this).find('.span-sort').html(start);
			start++;
			sort_li_arr.push($(this).attr('id'));
		}
	});
    $('#record_list2 li').each(function() {
        if($(this).hasClass('active')) {
            $(this).find('.span-sort').html(start);
            start++;
            sort_li_arr.push($(this).attr('id'));
        }
    });

    if(sort_li_arr.length>0 && b_sort_db) {
		xajax_SortRecords(sort_li_arr.join(':'));
	}
}

function onOff(item, enable) {
	enableRecord(item, enable);
	var li_el = $(item).closest('li');
	if(enable) {
		$('#record_list').append(li_el);
	} else {
		$('#disabled_record_list').append(li_el);
	}
	SortRecords(false);
}


function PostDeleteRecord() {
	SortRecords(false);
}

function init_create_record() {
	$('.create-record').off('click').on('click',function(e) {
		e.preventDefault();
		update_record('button_update_0');
	})
}

function init_update_record(start) {
	$(start + ' .update-record').off('click').on('click',function(e){
		e.preventDefault();
		update_record($(this).attr('id'));
	})
}
function OnEdit(el)
{
    if(!$(el).parents('.lw_item').find('.color-box-wrap').length){
        InitColorPicker($(el).parents('.lw_item').find('input.cch_colorpicker'))
    }
}
function update_record(button_id) {
	if(request_sent) {
		return;
	}
	var record_id = button_id.match(/button_update_(\d+)/)[1];
	  var titles = {};
		$.each($('#form_'+record_id +' input.staffs_status_title'), function(i, input) {
		        if($(input).val())  titles[input.id.replace('title_', '')] = $(input).val().trim();
			    });
    var color    = $.trim($('#color_'+record_id).val());
    var stat_speed = 1;//$.trim($('#stat_speed_'+record_id).val());
    var access_ticket = $.trim($('#access_ticket_'+record_id).val());
    var access_chat = $.trim($('#access_chat_'+record_id).val());
    var max_time_status = $.trim($('#max_time_status_'+record_id).val())+'_'+$('#max_time_status_'+record_id).parent().find('.text_type_hours_select a.active').attr('rel');
    var auto_set_time_status = $.trim($('#auto_set_time_status_'+record_id).val())+'_'+$('#auto_set_time_status_'+record_id).parent().find('.text_type_hours_select a.active').attr('rel');
    var access_set_status = $.trim($('#access_set_status_'+record_id).val());
    var staff_access = $.trim($('select[name=staff_access_'+record_id+']').val());
    var access_notify_status = $.trim($('select[name=access_notify_status_'+record_id+']').val());
    var b_save_status = $('#b_save_status_'+record_id).prop('checked');

    let  auto_set_time_status_int = parseInt($('#auto_set_time_status_'+record_id).val())*$('#auto_set_time_status_'+record_id).parent().find('.text_type_hours_select a.active').attr('rel')
    if(isNaN(auto_set_time_status_int))
    {
        auto_set_time_status_int = 0;
    }
    let b_offline = $('#auto_set_time_status_'+record_id).hasClass('js_offline');
    var errors = [];
    var errors_fields = [];

    if(auto_set_time_status_int || b_offline)
    {
        $('input.js_auto_set_time_status').each(function () {
            let _auto_set_time_status = parseInt($(this).val()) * $(this).parents('label').find('.text_type_hours_select a.active').attr('rel');
            let _cid = $(this)[0].id.match(/[0-9]+$/).toString();
            if (_cid == record_id )// && !$(this).hasClass('js_offline'))
            {
                return;
            }
            // console.log($(this).hasClass('js_offline'),_auto_set_time_status,$(this).val(), $(this).parents('label').find('.text_type_hours_select a.active').attr('rel')   );
            if (_auto_set_time_status == auto_set_time_status_int)
            {
                AddNotification(
                    Translate('team_staffs_status_js/get_an_other_status'), 'error','ERR_TIME'
                );
                $('#auto_set_time_status_'+record_id).val('')
                errors.push('ERR_TIME');
                return;
            }
            else if (b_offline && (_auto_set_time_status >= auto_set_time_status_int || !auto_set_time_status_int) )
            {
                AddNotification(
                    Translate('team_staffs_status_js/offline_mast_be_longger'), 'error','ERR_TIME3'
                );
                errors.push('ERR_TIME3');
                $('#auto_set_time_status_'+record_id).val('')

                return;
            }
            else if (($(this).hasClass('js_offline') && _auto_set_time_status <= auto_set_time_status_int)
                || (b_offline && _auto_set_time_status >= auto_set_time_status_int)
            )
            {
                AddNotification(
                    Translate('team_staffs_status_js/cannot_set_to_logger_value') + ' (' + $(this).val() + ' ' + ($(this).parents('label').find('.text_type_hours_select a.active').attr('rel') == 60 ? omniLang.getLangPhrase('time_min', $(this).val()) : omniLang.getLangPhrase('time_hour', $(this).val())) + '). '+Translate('team_staffs_status_js/set_lower_value'), 'error','ERR_TIME2'
                );
                errors.push('ERR_TIME2');
                console.log(errors);
                $('#auto_set_time_status_'+record_id).val('')

                return;
            }
        })
    }

    if(!Object.keys(titles).length)
			{
				errors.push('EMPTY_TITLE');
				errors_fields.push('title_'+record_id);
			}
	ShowNotification(errors, errors_fields);
    console.log(errors);
    if(errors.length>0) {
		return false;
	}

	ShowSpinButton('button_update_'+record_id);
	xajax_UpdateRecord(record_id,titles, color,stat_speed,access_ticket,access_chat,max_time_status,auto_set_time_status,access_set_status,staff_access,access_notify_status,b_save_status);
}

function ClickDeleteRecord(el)
{
    if($(el).parents('li').hasClass('b_row_disabled'))
    {
        return false;
    }
    last_row_selected = get_closes_li_id(el);
    IsUsed(el, function (is_used) {
        if (is_used)
        {
            $('#record_used').togglePopup();
            setTimeout(function() {
                let select = $('.status_modal:visible').find(`.choices:visible:not(".-js-no-nano")`);
                let id = get_closes_li_id(el);

                select.find(`.choices__list.choices__list--dropdown .choices__item`).removeAttr('hidden');
                select.find(`.choices__list.choices__list--dropdown .choices__item[data-value=${id}]`).attr('hidden', 'true');
            }, 700)
        }
        else
        {
            StartDeleteRecord(el);
        }
    });

    // добавляем nanoScroller селекту в модалке
    setTimeout(function() {
        SelectNano(".status_modal")
        SelectNano(".status_modal .choices__list")
    }, 700)
}
function IsUsed( item,callback, skip_load )
{
    if(skip_load)
    {
        return callback(0);
    }
    var id = get_closes_li_id(item);
    $.ajax({
        url: is_used_record_url,
        type: 'POST',
        dataType: 'json',
        data: {
            record_id: id
        },
        success: function(response) {
            callback(response);
        },
        cache: false
    });
}

function SwitchStaff(button_name) {
    $('#'+button_name+'_button').hide();
    $('#'+button_name+'_button_spin').show();

    let ids = [];
    $('.js_status_check:checked').each(function(){ids.push(parseInt($(this).parents('li')[0].id.match(/[0-9]+$/).toString()))});
    if(!ids.length)
    {
        ids.push(last_row_selected)
    }

    var new_id = $(".remove_last_staff_id").val();


    $.ajax({
        url: switch_record_url,
        type: 'POST',
        data: {
            record_ids: ids,
            new_record_id: new_id,
        },
        cache: false
    }).done(function(r) {
        $('#'+button_name+'_button').show();
        $('#'+button_name+'_button_spin').hide();

        window.location.reload()
    });
}
