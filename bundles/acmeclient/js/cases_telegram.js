var url_download_script = null;
let saveStr = ''; // при редактировании бота сюда пишется содержимое textarea "Фраза при первой активации бота"

$(document).ready(function () {
    init_create_record();
    init_update_record();
    $('.t_telegram_type a').click(function () {
        var rel = $(this).attr('rel');
        $(this).parent().find('a').removeClass('active');
        $(this).addClass('active');
        $(this).parent().parent().find('.google-aps-info').toggle(!(rel == 'have_bot'));
        $(this).parent().parent().find('.field_tg_str').toggle(!(rel == 'have_bot'));
        $('#have_bot_0').val((rel == 'have_bot' ? 1 : 0));
        $('#have_bot_-1').val((rel == 'have_bot' ? 1 : 0));
    });
    init_manual();
});

function init_manual() {
    $('a.link_manual').click(function () {
        var id = $(this).parents('li').attr('id').match(/[0-9]+$/).toString();
        var type = $(this).attr('data-type');
        if (!url_download_script) {
            url_download_script = $('#showTgBotManual .link_download').attr('href');
        }
        $('#showTgBotManual .link_download').attr('href', url_download_script.replace(999, id));

        if (type == 1) {
            $('#showTgBotManual #list_command').html('«'+Translate('common/get_help')+'»')
        } else {
            $('#showTgBotManual #list_command').html('«'+Translate('common/search')+'», «'+Translate('common/knowledge_base')+'», «'+Translate('common/get_help')+'»')
        }

        $('#showTgBotManual').togglePopup();
        if ($(document).nanoScroller) {
            $('.tg_bot_manual .nano').nanoScroller({alwaysVisible: true});
        }
    })
}

function hideTwin() {
    $('.twoBlock').slideUp();
    $('.cancelTop').fadeOut();
    InitNanoScrolls("")
}

function init_create_record() {
    $('.es_button').click(function () {
        $('.e_standard').slideDown();
        $('#type_bot_0').val(1);
        $('#type_bot_-1').val(1);
        hideTwin();
        return false;
    });
    $('.eo_button').click(function () {
        $('.e_own').slideDown();
        InitNanoScrolls(".e_own");
        $('#type_bot_0').val(2);
        $('#type_bot_-1').val(2);
        hideTwin();
        return false;
    });
}

function init_update_record(bot_id) {

}

function save_telegram(bot_id) {

    ShowSpinButton('button_local_' + bot_id);

    var token = $('#api_token_' + bot_id).val();
    var group_id = $('#group_id_' + bot_id).val();
    var type = $('#type_bot_' + bot_id).val();
    var b_client_bot = $('#have_bot_' + bot_id).val();
    var str = $('#hello_str_' + bot_id).val();

    var b_allow_all_message_group = $('#b_allow_all_message_group_' + bot_id)[0].checked;

    saveStr = str // дублируем в переменную, чтобы потом вставить в ф-ции ReloadRecord(bot_id, html)

    xajax_SaveBot(bot_id, type, b_client_bot, token, group_id,b_allow_all_message_group, str, secret_key);
}


function hide_spin_button(bot_id) {
    $('#button_spin_' + bot_id).hide();
    $('#button_' + bot_id).show();
}

function ReloadRecord(bot_id, html) {
    if ($('#record_li_' + bot_id).length) {
        $('#record_li_' + bot_id).html(html);

        /** После сохранения изменений в уже существующем боте в textarea "Фраза при первой активации бота" остаётся старый текст даже если мы его изменили. Строчка ниже это фиксит. При перезагрузке всё ок. */
        $('#hello_str_' + bot_id).text(saveStr)


    } else {
        $('.span_cnt').html(parseInt($('.span_cnt').html()) + 1);
        $('<li>')
            .addClass('lw_item')
            .addClass('active')
            .addClass('clearfix')
            .attr('id', 'record_li_' + bot_id)
            .html(html)
            .appendTo('#record_list.botsList');
        $('div.addBot').slideUp();
        hideTwin();
        $('.e_standard').slideUp();
        $('.e_own').slideUp();
        $('.twoBlock').show();

        $('.addButton').removeClass('dsbld')
    }

    InitialSettings(bot_id);
    init_manual();
}

function AddedBot(bot_id) {
    if (bot_id <= 0) {
        $('#api_token_' + bot_id).val('');
        $('#group_id_' + bot_id).val(0);
        $('#type_bot_' + bot_id).val(0);
        $('#have_bot_' + bot_id).val(0);
        $('#hello_str_' + bot_id).val(Translate('telegram_record/can_help'));
    }
}
