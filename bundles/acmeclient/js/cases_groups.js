var work_group_id = 0;

$(document).ready(function () {
  $(".sort-elements").sortable(
    { items: ".able_sort" },
    { handle: ".js-move-item" },
    { axis: "y" },
    {
      stop: function (event, ui) {
        SortElements(true);
      }
    }
  );
  $(document).on('click', '.change_form', function () {
    var lang_id = $(this).attr('data-lang_id');
    var record_id = $(this).attr('data-record_id');
    var parent = $(this).parents('.staff-signature');
    $(this).parent().find('a').removeClass('active');
    $(this).addClass('active');

    $(this).parents('label').find('input[id*=_' + record_id + '_]').hide();
    $(this).parents('label').find('input[id$=_' + record_id + '_' + lang_id + ']').show();

    if (parent.find('textarea[id^=signature_chat_' + record_id + ']').length) {
      $(this).parents('label').find('textarea[id^=signature_chat_' + record_id + ']').parent().hide();
      $(this).parents('label').find('textarea#signature_chat_' + record_id + '_' + lang_id).parent().show();
    } else {
      $(this).parents('label').find('textarea[id^=signature_' + record_id + ']').parent().hide();
      $(this).parents('label').find('textarea#signature_' + record_id + '_' + lang_id).parent().show();
    }

    const start = $(this)[0].closest("form").id;
    InitNanoScrolls(`#${start}`);

    return false;
  });

  $(document).on('click', '.change_form_chat', function () {
    var lang_id = $(this).attr('data-lang_id');
    var record_id = $(this).attr('data-record_id');
    var parent = $(this).parents('.staff-signature');
    $(this).parent().find('a').removeClass('active');
    $(this).addClass('active');

    $(this).parents('label').find('input[id*=_' + record_id + '_]').hide();
    $(this).parents('label').find('input[id$=_' + record_id + '_' + lang_id + ']').show();

    //if(parent.find('textarea[id^=signature_chat_'+record_id+']').length) {
    $(this).parents('label').find('textarea[id^=signature_chat_' + record_id + ']').hide();
    $(this).parents('label').find('textarea#signature_chat_' + record_id + '_' + lang_id).attr("style", "display:flex");

    InitNanoScrolls(`#${$(this)[0].closest("form").id}`);

    return false;
  });
  InitSignatureRedactor(0);
  $('form[id^=form_]').each(function () {
    var record_id = this.id.match(/[0-9]+$/).toString();
    InitSignatureRedactor(record_id);
  });
});

function SortElements(b_sort_db) {
  var start = 1;
  var sort_li_arr = Array();
  $('#record_list_enabled li').each(function () {
    if ($(this).hasClass('active')) {
      $(this).find('.span-sort').html(start);
      start++;
      sort_li_arr.push($(this).attr('id'));
    }
  });
  if (sort_li_arr.length > 0 && b_sort_db) {
    xajax_SortElements(sort_li_arr.join(':'));
  }
}

function init_create_record() {
  $('.create-record').off('click').on('click', function (e) {
    e.preventDefault();
    update_record('button_update_0');
  })
}

function init_update_record(start) {
  $(start + ' .update-record').off('click').on('click', function (e) {
    e.preventDefault();
    update_record($(this).attr('id'));
  })
}

function update_record(button_id) {
  if (request_sent) {
    return;
  }

  record_id = button_id.match(/button_update_(\d+)/)[1];

  var errors = [];
  var errors_fields = [];
  var data = {};

  $('input[id^=title_' + record_id + ']').each(function () {
    var lang_id = this.id.match(/\d+$/);
    var b_star = $(this).attr('data-star');
    var full_name = $.trim(this.value);
    if (!full_name.length && b_star == 1) {
      errors.push('EMPTY_TITLE');
      errors_fields.push('title_' + record_id);
    }
    data[lang_id] = { 'title': full_name, 'group_signature': '', 'group_full_name': '' };
  });

  $('textarea[id^=signature_' + record_id + ']').each(function () {
    var lang_id = this.id.match(/\d+$/);
    data[lang_id]['group_signature'] = $.trim(GetRedactorCode(this.id, true));
  });

  $('textarea[id^=signature_chat_' + record_id + ']').each(function () {
    var lang_id = this.id.match(/\d+$/);
    data[lang_id]['group_signature_chat'] = $(this).val();
  });

  $('input[id^=group_full_name_' + record_id + ']').each(function () {
    var lang_id = this.id.match(/\d+$/);
    data[lang_id]['group_full_name'] = $.trim($(this).val());
  });

  ShowNotification(errors, errors_fields);
  if (errors.length > 0) {
    return false;
  }

  var b_signature_chat_position = $('#b_signature_chat_position_' + record_id).val();
  var b_signature_chat_use = $('#b_signature_chat_use_' + record_id).val();

  // console.log(data);
  if (record_id == 0) {
    ShowSpinButton('button_create');
    xajax_CreateGroup(data, b_signature_chat_position, b_signature_chat_use);
  } else {
    ShowSpinButton('button_update_' + record_id);
    xajax_UpdateGroup(record_id, data, b_signature_chat_position, b_signature_chat_use);
  }
}

function AddNewGroup(record_html) {
  $('#record_list_enabled').append(record_html);
  $('.span_cnt').html((parseInt($('.span_cnt').html()) + 1));
  closeCreateBlock();
  ReloadRecord(0);
}

function OnOffExt(li_el, enable) {
  if (enable) {
    $('#record_list_enabled').append(li_el);
  }
  else {
    $('#record_list_disabled').append(li_el);
  }
  SortElements(true);
}

function onOff(el, enable) {
  IsUsed(el, function (is_used) {
    if (enable == 0 && is_used) {
      ShowPopup(el, 'disable');
    }
    else {
      enableRecord(el, enable);

      var li_el = $(el).closest('li');
      OnOffExt(li_el, enable);
    }
  }, enable);
}

//action - remove OR disable
function SwitchGroup(action, last_record) {
  if (last_record) {
    select_id = action + '_last_group_id';
    popup_id = action + '_last_group';
  } else {
    select_id = action + '_group_id';
    popup_id = action + '_group';
  }
  var new_group_id = $("." + select_id).first().val();

  if (action == 'remove') {
    //		HideRecordRow(work_group_id);
  } else {
    //		markOffOn($('#record_'+work_group_id).closest('.lw_item'), 0);
  }
  if (last_record) {
    //		markOffOn($('#record_'+new_group_id).closest('.lw_item'), 1);
  }

  $('#record_' + work_group_id).removeAttr('rel');
  $('#record_' + new_group_id).attr('rel', 'b_used');

  $('#' + popup_id).togglePopup();

  $.ajax({
    url: switch_record_url,
    type: 'POST',
    data: {
      disable_record_id: work_group_id,
      enable_record_id: new_group_id,
      last_record: last_record,
      action: action
    },
    cache: false
  }).done(function (r) {

    $('#record_li_' + work_group_id).addClass('b_row_disabled').addClass('b_appraise');
    $('#record_li_' + work_group_id + ' a.edit').addClass('f_disabled');
    $('#record_li_' + work_group_id + ' a.delete').addClass('f_disabled');

    ShowXajaxNotification(r);

    b_ajax_check_notifications = 1;
  });


}

function ClickDeleteRecord(el) {
  IsUsed(el, function (is_used) {
    if (is_used) {
      ShowPopup(el, 'remove');
    } else {
      StartDeleteRecord(el);
    }
  });
}

//action - disable OR remove
function ShowPopup(el, action) {
  var count_active = $('.lw_item.active').length;
  var group_id = 0;
  var title = '';
  var add_select = '';
  var select_id = '';
  var popup_id = '';
  //если общее количество больше 1 - значит можно отключать с заменой
  //иначе нужно отключать с включением другой группы
  if (count_active > 1) {
    add_select = '.active';
    select_id = action + '_group_id';
    popup_id = action + '_group';
  } else {
    add_select = '';
    select_id = action + '_last_group_id';
    popup_id = action + '_last_group';
  }
  work_group_id = get_closes_li_id(el);
  $("." + select_id).empty();
  $('.lw_item' + add_select).each(function () {
    title = $(this).find('.t1').html();
    li_id = $(this).attr('id');
    group_id = 0;
    if (li_id.match(/record_li_(\d+)/)) {
      group_id = li_id.match(/record_li_(\d+)/)[1];
    }
    if (group_id && group_id != work_group_id) {
      $("." + select_id).append($('<option value="' + group_id + '">' + title + '</option>'));
    }
  });
  $('#' + popup_id).togglePopup();


  const element = Array.from( document.querySelectorAll(`.${select_id}`) )

  choicesInit(element, {
    searchEnabled: false,
    itemSelectText: '',
    removeItemButton: false,
    shouldSort: false,
    addChoices: false
  })
}

function DeleteRecordExt() {
  SortElements(false);
}
function IsUsed(item, callback, skip_load) {
  if (skip_load) {
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
    success: function (response) {
      callback(response);
    },
    cache: false
  });

}
