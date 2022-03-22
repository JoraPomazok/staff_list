var last_filter_nr = 1000;

$(document).ready(function(){
    // $('.mySelect_chosen').chosen();
    $('.time_settings .mySelect_chosen').on('change', function(){
        $('.empty, .empty .no_stat, .empty .no_info').hide();

        var f_period = $('#f_period').val();
        var f_filters = $('#f_filters').val();
        if(f_filters == 0 && client_filter_list[0])
        {
            f_filters = JSON.stringify(client_filter_list[0].filter_data)
        }

        if (this.id == 'f_filters')
        {
            $('.filter_btn_group div').hide();
            $('.create_filter_name').hide();
            $('#f_filters_chosen').show();
            $(this).parents('.fields').find('.choices').show()
            CloseFilterContainer()
            if(this.value > 0)
            {
                $('.filter_btn_group div').hide();
                $('.filter_btn_group div.filter_saved').show();
            }
            else if(this.value == 0 && client_filter_list[0])
            {
                $('.filter_btn_group div').hide();
                $('.filter_btn_group div.filter_saved').show();
            }

            else
            {
                $('.filter_btn_group div.filter_add').show();
            }



        }
        xajax_ChangeStatData(f_period, f_filters);
    });
    $('.ico_unload_export').on('click', function(e){
        if($(this).hasClass('disabled'))
        {
            return false;
        }

        var f_period = $('#f_period').val();
        var f_filters = $('#f_filters').val();

        window.location.href = '/admin/team/stat_stafffs_status/export/export_statuses_'+f_period+':'+f_filters+'.csv'
    })

    $('.js_update').on('click', function(e){
        e.preventDefault();

        var f_period = $('#f_period').val();
        var f_filters = getNewFilterForm();

        e.preventDefault();
        $('.filter_btn_item').hide();
        CloseFilterContainer();
        $('.filter_saved').show();

        if(client_filter_list[0])
        {
            client_filter_list[0].filter_data = f_filters
        }
        else
        {
            client_filter_list[0] = {
                filter_data : f_filters
            }
        }

        // choicesUpdate($('#f_filters'), 'setChoiceByValue','0');
        if(!$('#f_filters option[value=0]').length)
        {
            $('#f_filters').prepend('<option value="0">&ndash;</option>');
        }
        $('#f_filters').val(0).trigger("chosen:updated");
        xajax_ChangeStatData(f_period, f_filters);
    })
    $('.js_add').on('click', function(e){
        e.preventDefault();

        $('.js_update').show();
        $('.filter_btn_item').hide();
        OpenFilterContainer()
        $('.filter_not_saved').show();
        $('.filter_fields_block').html('')

        if(!$.trim($('.filter_fields_block').html()).length)
        {
            $('.filter_container a.js_add_param').trigger('click');
        }
    })
    $('.js_edit, .js_reset ').on('click', function(e){
        e.preventDefault();

        $('.filter_fields_block').html('')
        OpenFilterContainer()


        if($(this).hasClass('js_edit'))
        {
            $('.create_filter_name').val(client_filter_list[$('#f_filters').val()].title);
            $('.js_update').hide();
        }



        if(!$.trim($('.filter_fields_block').html()).length)
        {
            SetFilterForm(client_filter_list[$('#f_filters').val()]||[])

        }
        $('.filter_btn_group div').hide();
        $('.filter_btn_group').show();

        if($('#f_filters').val() == 0)
        {
            $('.filter_btn_item.filter_not_saved').show();
        }
        else
        {
            $('.filter_btn_item.filter_edit2').show();
        }

    })

    $('.js_rename').on('click', function(e){
        e.preventDefault();

        $('.filter_btn_item').hide();
        $('#f_filters_chosen').hide();
        $(this).parents('.fields').find('.choices').hide()
        $('.create_filter_name').show().focus();
        $('.create_filter_name').val(client_filter_list[$('#f_filters').val()].title);

        $('.filter_save2').show();
    })
    $('.js_save').on('click', function(e){
        let name = $('.create_filter_name').val();
        let filter = getNewFilterForm()

        let emptyField = CreateFldValid()
        if(emptyField) {
            return
        }

        xajax_UpdateFilter($('#f_filters').val(),name,filter,stat_page);
    })
    $('.js_delete').on('click', function(e){
        xajax_DeleteFilter($('#f_filters').val());
    })
    $('.js_cancel_edit').on('click', function(e){
        e.preventDefault();
        $(this).parent().hide();
        $('.filter_btn_item').hide();
        CloseFilterContainer();
        $('.filter_saved').show();
    })

    $('.js_cancel').on('click', function(e){
        e.preventDefault();
        $('.filter_btn_item').hide();
        CloseFilterContainer();
        $('.filter_add').show();
    })

    $(document).on('click', '.js_filter_row_delete', function(e){
        e.preventDefault();

        CheckEditFilter();
        $(this).parents('.filter_fields_row ').remove();
    })

    $('.js_create').on('click', function(e){
        e.preventDefault();
        $('.filter_btn_item').hide();
        $(this).parents('.fields').find('.choices').hide()
        $('#f_filters_chosen').hide();
        $('.create_filter_name').show().focus();
        $('.filter_save').show();
    });

    $('.js_create_name').on('click', function(e){
        let name = $('.create_filter_name').val();
        let filter = getNewFilterForm()

        let emptyField = CreateFldValid()
        if(emptyField) {
            return
        }

        xajax_UpdateFilter(0,name,filter,stat_page);
    });


    $('.js_cancel_name').on('click', function(e){
        e.preventDefault();
        $('.filter_btn_item').hide();
        $('.create_filter_name').hide();
        $('#f_filters_chosen').show();
        $(this).parents('.fields').find('.choices').show()
        CloseFilterContainer();
        if($('#f_filters').val() == 0)
        {
            $('.filter_btn_group div').hide();
            $('.filter_btn_group div.filter_saved').show();

            $('#f_filters').val(-1)
            $('#f_filters option[value=0]').remove();
            $('#f_filters').trigger("chosen:updated");
            $('.js_cancel_name').trigger('click');
            $('#f_filters').trigger("change");
        }
        // else
        // {
        if($('#f_filters').val() > 0) {
            $('.filter_saved').show();
        } else {
            $('.filter_add').show();
        }
        // }
    });

    // add Row
    $('.filter_container a.js_add_param').click(function(){
        CheckEditFilter();
        add_filter_row('.filter_fields_block', 'fdata', 'filter_default');
        return false;
    });

    $(document).on('keydown','input[maxlength]',function (e) {
        if($(this).val().match(/[,\.]/))
        {
            $(this).attr('maxlength',5)
        }
        else
        {
            $(this).attr('maxlength',4)
        }

    });
    $('.main-select').change(function() {
        CheckEditFilter($(this));
        change_main_select(this);
    });
    $('.frstItem:visible select').each(function() {
        change_main_select(this);
    });

    $('.scndItem:visible select').each(function() {
        CheckDisabledItems($(this));
    });


    $(document).on('change', '.scndItem select', function() {
        CheckEditFilter($(this));
        CheckDisabledItems($(this));

    });
    $(document).on('change', '.lstItem select', function() {
        CheckEditFilter($(this));
    });
    $('.select_category').change(function() {
        $(this).parent().parent().find('input').toggle($(this).val() == -1);
    });
//     $('.note_with_mentions').each(function() {
//         id = $(this).attr('id')
//         if(!id)
//         {
//             id = GenUid(32);
//             $(this).attr('id',id)
//         }
//         CreateHtmlEditor(id, 70,false,false,true,true);
// });
    $(document).on('click', '.span_set_reopen_1 a', function() {
        $(this).parent().find('a').removeClass('active');
        $(this).addClass('active');
        $(this).parent().find('input').val($(this).attr('rel'));
        return false;
    });

    // $(document).on('change', '.scndItem select', function() {
    // 	CheckDisabledItems($(this));
    // 	if($(this).attr('name').match(/case_change/))
    // 	{
    // 		var tmp_id = $(this).parent().find('span a.ui-selectmenu').attr('id').replace('button','menu');
    // 		if($(this).val() == 'update')
    // 		{
    // 			$(this).parent().parent().find('.lst-case_change').show();
    // 			$(this).parent().removeClass('lstItem');
    // 			$(this).parent().find('span a.ui-selectmenu').css('width','150px');
    // 			$('#'+tmp_id).css('width','150px');
    // 		}
    // 		else
    // 		{
    // 			$(this).parent().parent().find('.lst-case_change').hide();
    // 			$(this).parent().addClass('lstItem');
    // 			$(this).parent().find('span a.ui-selectmenu').css('width','363px');
    // 			$('#'+tmp_id).css('width','363px');
    // 		}
    // 	}
    // });

    function CheckDisabledItems(el)
    {
        var select_val = el.val();
    }

    $(document).on('click', '.text_type_content_select a', function(){
        var type = $(this).attr('rel');
        $(this).parent().find('a').removeClass('active');
        $(this).addClass('active');
        $(this).parent().parent().find('input.hidden_type_content_id').val(type);
        return false;
    });
    $(document).on('focus', '.text_type_content', function(){
        $(this).parent().find('div.text_type_content_select').addClass('focus');
        $(this).parent().addClass('focus');
    });
    $(document).on('focusout', '.text_type_content', function(){
        $(this).parent().find('div.text_type_content_select').removeClass('focus');
        $(this).parent().removeClass('focus');
    });

    $('#edit_filter_btn').click(function(e){
        e.preventDefault();

        var errors = [];
        var errors_fields = [];

        var subj = $('input[name=title]').val();
        if( subj == '' ){
            errors.push('EMPTY_TITLE');
            errors_fields.push('filter_title');
        }

        // $('.acrList li div.scndItem:visible').each(function(){
        //     var el_input = $(this).children('input');
        //     if( el_input.length && el_input.attr('rel') == 'email' ){
        //         var recipients_arr = el_input.val();
        //         recipients_arr = recipients_arr.split(',');
        //
        //         var b_error_email = false;
        //         for(i=0; i<recipients_arr.length; i++) {
        //             var check_recipient = $.trim(recipients_arr[i]);
        //             if( !validateEmail(check_recipient) )  {
        //                 b_error_email = true;
        //             }
        //         }
        //     }
        //
        //     if( b_error_email && $.inArray('ERROR_EMAIL', errors) == -1 ){
        //         errors.push('ERROR_EMAIL');
        //         errors_fields.push(el_input.attr('id'));
        //     }
        // });
        //
        if( errors.length > 0 ){
            ShowNotification(errors, errors_fields);
        }
        else{
            $('div:hidden input:hidden,div:hidden select:hidden,div:hidden textarea:hidden').each(function () {
                if(!$(this).parents('.letters_content:visible').length)
                {
                    $(this).remove();
                }
            });
            $('#form_edit_filter').submit();
        }
    });
    let timerFocus = 0;
    // if($('.filter_saved').is(':visible')) {
        $('#f_filters_chosen').hover(function() {
            $('.filter_saved a').addClass('visible').fadeIn()
            clearTimeout(timerFocus)
        }, function() {
            timerFocus = setTimeout(function() {
                $('.filter_saved a').removeClass('visible').fadeOut()
            }, 200)
        })
    // }


    $('.filter_saved a').hover(function() {
        $('.filter_saved a').addClass('visible').fadeIn()
        clearTimeout(timerFocus)
    }, function() {
        timerFocus = setTimeout(function() {
            $('.filter_saved a').removeClass('visible').fadeOut()
        }, 200)
    })

});

function add_filter_row(filter_row_class, filter_mod, default_id) {
    last_filter_nr++;

    var default_li = $('#'+default_id).clone();
    $(default_li).addClass('d-flex');
    $(default_li).removeClass('hidden');
    $(filter_row_class).append(default_li);

    var tmp_id = $(default_li).attr('id');
    tmp_id = tmp_id.replace('default', last_filter_nr);
    $(default_li).attr('id', tmp_id);

    $('#'+tmp_id+' .main-select').change(function() {
        change_main_select(this);
    });
    $('#'+tmp_id).children('.icon-remove').click(function() {
        $(this).closest('.acrItem').fadeOut();
        $(this).closest('.acrItem').remove();
    });

    $(default_li).find('input, select, textarea').each(function() {
        var tmp_name = $(this).attr('name');
        if(tmp_name)
        {
            tmp_name = tmp_name.replace('default', last_filter_nr);
            tmp_name = tmp_name.replace('filter_mod', filter_mod);
            $(this).attr('name', tmp_name);
        }
        var tmp_id = $(this).attr('id');
        if(tmp_id) {
            tmp_id = tmp_id.replace('default', last_filter_nr);
            tmp_id = tmp_id.replace('filter_mod', filter_mod);
            $(this).attr('id', tmp_id);
        }
    });


    $(default_li).find('.pp_list_item').each(function() {
        var tmp_rel = $(this).attr('rel');
        tmp_rel = tmp_rel.replace('default', last_filter_nr);
        tmp_rel = tmp_rel.replace('filter_mod', filter_mod);
        $(this).attr('rel', tmp_rel);
    });

    if(filter_mod=='every_conditions') {
        $('#'+tmp_id+' option[rel=just_for_all]').remove();
    }

    if(filter_mod=='') {
        labels_width = 363;
    } else {
        labels_width = 202;
    }

    //инициализируем поля ввода меток !!!!!!!!!!!
    // InitLabelsBoxes('#'+tmp_id+' input[rel=labels]');

    $('#'+tmp_id+' select').each(function() {
        if($(this).attr('multiple')) {
            $(this).addClass('mySelect_chosen');
        } else {
            $(this).addClass('mySelect_chosen');
        }
    });
    $('#'+tmp_id+' input[type="checkbox"]').removeClass('filter-default-action');
    init_nice_elements('#'+tmp_id);
}

function change_main_select(el) {
    var main_select_value = $(el).val();

    var closes_li = $(el).closest('div.filter_fields_row');
    var second_select_value = closes_li.find('.scnd-'+main_select_value);

    $(closes_li).find('.letters_content').hide();
    $(closes_li).find('.scndItem').hide();
    $(closes_li).find('.lstItem').hide();
    $(closes_li).find('.scndItem').addClass('hidden');
    $(closes_li).find('.lstItem').addClass('hidden');
    $(closes_li).find('.scnd-'+main_select_value).removeClass('hidden');
    $(closes_li).find('.scnd-'+main_select_value).show();
    if( second_select_value.attr('data-last') == 'multiple' ){
        var second_id = second_select_value.children('select').attr('id');
        var second_key = second_select_value.children('select').val();

        $(closes_li).find('.lst-'+main_select_value+'[data-scnd="'+second_key+'"]').removeClass('hidden');
        $(closes_li).find('.lst-'+main_select_value+'[data-scnd="'+second_key+'"]').show();

        second_select_value.children('select').change(function() {
            change_second_select(this, main_select_value,true);
        });
    }
    else{
        $(closes_li).find('.lst-'+main_select_value).removeClass('hidden');
        $(closes_li).find('.lst-'+main_select_value).show();

        var second_id = second_select_value.children('select').attr('id');
        $('#'+second_id).change(function() {
            change_second_select(this, main_select_value);
        });
    }
    init_nice_elements();

    if($(closes_li).find('div.lstItem:visible input.hidden_type_content_id').length
        &&	!$(closes_li).find('div.lstItem:visible input.hidden_type_content_id').val().length)
    {
        $(closes_li).find('div.lstItem:visible input.hidden_type_content_id').val('html');
        $(closes_li).find('div.lstItem:visible div.text_type_content_select a').removeClass('active');
        $(closes_li).find('div.lstItem:visible div.text_type_content_select a[rel=html]').addClass('active');

    }
    if($(closes_li).find('div.lstItem:visible input.hidden_type_hours_id').val()
        &&	$(closes_li).find('div.lstItem:visible input.hidden_type_hours_id').val().length)
    {

    }

    // InitCfDatepickers();

}
// var =
function change_second_select(el, main_select_value, b_multiple) {
    var closes_li = $(el).closest('div.filter_fields_row');
    var second_key = $(el).val();

    if(b_multiple)
    {
        $(closes_li).find('.lst-' + main_select_value + '[data-scnd]').hide();
        $(closes_li).find('.lst-' + main_select_value + '[data-scnd="' + second_key + '"]').show();
    }

    if(main_select_value == 'rating')
    {
        init_nice_elements()

    }
    else if(main_select_value == 'created_hour_type')
    {
        if(second_key == 'for')
        {
            $('.lst-'+main_select_value+' select option[value!=6]').hide();
            $('.lst-'+main_select_value+' select option[value=6]').show();
        }
        else if(second_key == 'in time')
        {
            $('.lst-'+main_select_value+' select option[value=6]').hide();
            $('.lst-'+main_select_value+' select option[value!=6]').show();
        }
        $('.lst-'+main_select_value+' select').selectmenu(  );

    }
}
function getNewFilterForm()
{
    let filter_data = [];
    $('.filter_fields_row').each(function(){
        if(!this.id.match(/[0-9]+$/)) { return; }
        let t  = $(this);
        let id = this.id.match(/[0-9]+$/).toString();

        if(t.find('.lstItem:not(.hidden) select').val() !== null)
        {
            t.find('.lstItem:not(.hidden) select').parents('.choices').removeClass('error')
            filter_data.push({
                'key': t.find('.frstItem select').val(),
                'condition': t.find('.scndItem:not(.hidden) select').val(),
                'value': t.find('.lstItem:not(.hidden) select').val(),
            });
        } else {
            t.find('.lstItem:not(.hidden) select').parents('.choices').addClass('error')

            AddNotification(
                Translate('statistics_filters_js/check_data'),'error'
            );
        }
    });
    return filter_data;
}
function SetFilterForm(filter)
{
    for (let i in filter.filter_data)
    {
        let f = filter.filter_data[i];
        $('.filter_container a.js_add_param').trigger('click');
        let t = $('.filter_fields_block .filter_fields_row:last:not(.hidden)');
        let frstItem = t.find('.frstItem select')
        let scndItem = t.find('.scndItem:not(.hidden) select')
        let lstItem = t.find('.lstItem:not(.hidden) select')

        // let f = filter.filter_data[i];
        t.find('.frstItem select').val(f['key']).trigger('change');
        t.find('.scndItem:not(.hidden) select').val(f['condition']).trigger('change');
        t.find('.lstItem:not(.hidden) select').val(f['value']).trigger('change');
        /**
         * Логика такая:
         * для любых операций, надо вызывать переменную которая хранит инит селекта(defaultChoiesInit)
         * и с ней уже работать(задавать методы, например), при этом надо сам селект всегда обновлять .trigger('change');
         * после любого изменения наполнения селекта
         * ??? после первой смены значения, остальные селекты обновляются и после, уже не меняются
         * ??? но тут все норм, https://jsfiddle.net/dgu40q3L/2/
         * ??? возможно проблема в джеквери или событиях ченж
         */

        // console.log(defaultChoiesInit , t.find('.frstItem select.target').attr('choices_uuid'))

        // defaultChoiesInit[t.find('.frstItem select').attr('choices_uuid')].setChoiceByValue(f['key']);
        // // t.find('.frstItem select.target').trigger('change');
        //
        //
        // defaultChoiesInit[t.find('.scndItem:not(.hidden) select').attr('choices_uuid')].setChoiceByValue(f['condition']);
        // // t.find('.scndItem:not(.hidden) select').trigger('change');
        //
        // defaultChoiesInit[t.find('.lstItem select').attr('choices_uuid')].setChoiceByValue(f['value']);
        // // t.find('.lstItem:not(.hidden) select').trigger('change');
        //
        init_nice_elements(t[0])

    }

}
function CreatedFilter(filter_id,b_edit)
{

    $('#f_filters').empty();
    $('#f_filters').append('<option value="0">&ndash;</option>');
    for (let i in client_filter_list)
    {
        $('#f_filters').append('<option value="'+client_filter_list[i].filter_id+'" '+(client_filter_list[i].filter_id == filter_id ? ' selected' : '')+'>'+client_filter_list[i].title+'</option>');
    }
    if(filter_id)
    {
        $('#f_filters option[value=0]').remove();
    }
    $('#f_filters').trigger("chosen:updated");
    $('.js_cancel_name').trigger('click');
    $('#f_filters').trigger("change");
}
function CheckEditFilter(target)
{
    if(target) {
        target.val() !== null ? target.parents('.choices').removeClass('error') : null
    }

    if($('.filter_btn_item.filter_edit2:visible').length)
    {
        $('.filter_btn_item.filter_edit2').hide()
        $('.filter_btn_item.filter_edit').show();
        $('.js_update').show();
    }

    if($('#f_filters').val() == 0 && $('.filter_btn_item.filter_not_saved').is(':visible'))
    {
        $('.js_update').show();
    }
}
function OpenFilterContainer ()
{
    // choicesUpdate($('#f_period'), 'disable');
    $('#f_period').attr('disabled','disabled').trigger("chosen:updated");
    $('.ico_unload_export').addClass('disabled')
    $('.time_settings .filter_container').slideDown(500);
}
function CloseFilterContainer ()
{
//    choicesUpdate($('#f_period'), 'enable');
    $('#f_period').removeAttr('disabled').trigger("chosen:updated");

    $('.ico_unload_export').removeClass('disabled')
    $('.time_settings .filter_container').slideUp(500);
}
function CreateFldValid() {
    let create_fld = $('.create_filter_name');
    if(create_fld.val().trim() == 0) {
        create_fld.addClass('error');
        return true
    } else {
        create_fld.removeClass('error');
    }
}
