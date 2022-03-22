var work_staff_id;
var staff_persmissions;
$(document).ready(function () {
    $(document).on('click', '.btn_form_user_pic', function () {
        $(this).parents('.button_file').find('.input_staff_thumbnail').click();
        return false
    })

    $(document).on('click', '.create-record', function (e) {
        e.preventDefault();
        update_staff('button_update_0');
    });

  $(document).on('change', 'input:checkbox', function (e) {
    if ($(this).attr('id') && $(this).attr('id').match(/^checkbox-17/)) {
      if (!$(this).prop('checked')) {
        $('#' + $(this).attr('id').replace('-17-', '-23-'))[0].disabled = true
      } else {
        $('#' + $(this).attr('id').replace('-17-', '-23-'))[0].disabled = false
      }
    }
  });

  $(document).on('click', '.update-record', function (e) {
    e.preventDefault();
    update_staff($(this).attr('id'));
  });

  $(document).on('click', 'a.third', function (e) {
    e.preventDefault();
    var a_rel = $(this).attr('rel');
    var curr_staff_id = parseInt(a_rel);
    if (curr_staff_id == 0) {
      var staff_access_level = a_rel.replace('0-', '');
      var new_staff_permissions = staff_persmissions[staff_access_level];
      $('#hidden_add_perm_title').show();
      $('#hidden_add_perm').show();

      $('#hidden_add_perm input:checkbox').each(function () {
        var this_checkbox = $(this);
        if (new_staff_permissions.indexOf(this_checkbox.val()) >= 0) {
          this_checkbox[0].checked = "checked"
        } else {
          this_checkbox[0].checked = ""
        }
      })
    }
    $('.access-' + curr_staff_id).hide();
    $('.access-' + a_rel).show();
  });

  $(document).on('change', '.input_staff_thumbnail', function () {
    var input_id = $(this).attr('id');
    var record_id = input_id.match(/thumbnail_(\d+)/)[1];
    ShowSpinButton('button_update_' + record_id);
    $(this).closest('form').submit();
  });
  $(document).on('click', '.change_form_fullname', function () {
    var lang_id = $(this).attr('data-lang_id');
    var record_id = $(this).attr('data-record_id');
    $(this).parent().find('a.change_form_fullname').removeClass('active');
    $(this).addClass('active');
    $(this).closest(".fields").find('input[id^=full_name_' + record_id + ']').hide();
    $(this).closest(".fields").find('input#full_name_' + record_id + '_' + lang_id).show();

    return false;
  });
  $(document).on('click', '.change_form_signature', function (event) {
    event.preventDefault();

    var lang_id = $(this).attr('data-lang_id');
    var record_id = $(this).attr('data-record_id');
    var parent = $(this).parents('.staff-signature');

    $(this).parent().find('a.change_form_signature').removeClass('active');
    $(this).addClass('active');

    if (parent.find('textarea[id^=signature_chat_' + record_id + ']').length) {
      //Для подписи чатов
      parent.find('textarea[id^=signature_chat_' + record_id + ']').hide();
      parent.find('textarea#signature_chat_' + record_id + '_' + lang_id).show();
    } else {
      //Для подписи email
      parent.find('textarea[id^=signature_' + record_id + ']').parent().hide();
      parent.find('textarea#signature_' + record_id + '_' + lang_id).parent().show();
      parent.find(".signature__wrapper").addClass("hidden")
      parent.find('textarea#signature_' + record_id + '_' + lang_id).closest(".signature__wrapper").removeClass("hidden")
    }

    InitNanoScrolls(`#${parent[0].closest("form").id}`);
    // return false;
  });
  staff_persmissions = {
    'f': ['case_spam', 'view_kb', 'edit_kb', 'case_trash', 'case_remove', 'user_trash', 'user_remove', 'company_trash', 'company_remove', 'edit_cases_messages', 'remove_cases_messages', 'export_users', 'export_cases', 'add_labels', 'remove_labels', 'view_list_users', 'view_list_companies'],
    'c': ['case_spam', 'view_kb', 'edit_kb', 'case_trash', 'user_trash', 'company_trash', 'edit_cases_messages', 'remove_cases_messages'],
    'l': ['case_spam', 'view_kb', 'edit_kb', 'case_trash', 'user_trash', 'company_trash'],
    'r': ['case_spam', 'view_kb', 'edit_kb', 'case_trash', 'user_trash', 'company_trash']
  };
});

function init_create_record() {
}

function init_update_record(start) {
  if (start) {
    start = start + ' ';
  } else {
    start = '';
  }

  $(start + '.staff_form').ajaxForm({
    complete: function (xhr) {
      response = xhr.responseText;
      if (response) {
        response = JSON.parse(response);
        staff_id = response.staff_id;

        HideSpinButton('button_update_' + staff_id);
        if (response.message_code) {
          ShowXajaxNotification(response.message_code);
        }

        if (response.status == 'success') {
          $('.staff_thumbnail_' + staff_id).each(function () {
            $(this).attr('src', response.thumbnail);
          })
        }
      }
    }
  });
}

function get_group_access_for_staff(staff_id, access_level, b_hidden) {
  var access_group_arr = [];
  var group_id = 0;
  if (access_level == 'f') {
    access_group_arr.push(0);
  } else if (access_level == 'c' || access_level == 'r') {
    var access_group_name = 'access_group_';
    if (b_hidden == 1) {
      access_group_name = 'h_access_group_';
    }
    $('input:checked[name=' + access_group_name + staff_id + ']').each(function () {
      access_group_val = $(this).val();
      group_id = $(this).val().match(/pstr_(\d+)_\d+/)[1];
      access_group_arr.push(group_id);
    });
  }
  return access_group_arr;
}

function get_access_for_staff(staff_id, access_group_arr, b_hidden) {
  var access_arr = [];
  if (access_group_arr.length > 0) {
    var access_name = 'access_';
    if (b_hidden == 1) {
      access_name = 'h_access_';
    }
    for (i = 0; i < access_group_arr.length; i++) {
      group_id = access_group_arr[i];
      $('input:checked[name=' + access_name + staff_id + '_' + group_id + ']').each(function () {
        access_arr.push(group_id + '_' + $(this).val());
      });
    }
  }
  return access_arr;
}

function get_add_access_for_staff(staff_id) {
  var add_access_arr = [];
  $('input:checked[name=add_permission_' + staff_id + ']').each(function () {
    add_access_arr.push($(this).val());
  });
  return add_access_arr;
}

function update_staff(staff_rel) {
  if (request_sent) {
    return;
  }

  staff_id = staff_rel.match(/button_update_(\d+)/)[1];

  var errors = [];
  var errors_fields = [];
  var data = {};
  $('input[id^=full_name_' + staff_id + ']').each(function () {
    var lang_id = this.id.match(/\d+$/);
    var b_star = $(this).attr('data-star');
    var full_name = $.trim(this.value);
    if (!full_name.length && b_star == 1) {
      errors.push('EMPTY_FULL_NAME');
      errors_fields.push('full_name_' + staff_id + '_' + lang_id);
    }
    data[lang_id] = {'full_name': full_name, 'signature': ''};
  });
  $('textarea[id^=signature_' + staff_id + ']').each(function () {
    var lang_id = this.id.match(/\d+$/);
    data[lang_id]['signature'] = $.trim(GetRedactorCode(this.id, true));
    if (!data[lang_id]['full_name'] && data[lang_id]['signature'].length) {
      $('#record_li_' + staff_id + ' a.change_form_fullname[data-lang_id=' + lang_id + ']').click();
      errors.push('EMPTY_FULL_NAME');
      errors_fields.push('full_name_' + staff_id + '_' + lang_id);
    }
  });

  $('textarea[id^=signature_chat_' + staff_id + ']').each(function () {
    var lang_id = this.id.match(/\d+$/);

    data[lang_id]['signature_chat'] = $(this).val();
  });

  var emailaddress = $.trim($('#emailaddress_' + staff_id).val());
  var deflang = $.trim($('#deflang_' + staff_id).val());
  var defemailaddress = $.trim($('#defemailaddress_' + staff_id).val());
  var password_first = $.trim($('#password_first_' + staff_id).val());
  var password_second = $.trim($('#password_second_' + staff_id).val());
  var b_staff_allow_all_groups = $('#staff_allow_all_groups_' + staff_id).is(':checked') ? 1 : 0;
  var access_level = $('a.active[name=access_level_' + staff_id + ']').attr('rel');

  access_level = access_level.replace(staff_id + '-', '');

  if (!emailaddress) {
    errors.push('EMPTY_EMAIL');
    errors_fields.push('emailaddress_' + staff_id);
  }
  if (emailaddress && !validateEmail(emailaddress)) {
    errors.push('INVALID_EMAIL');
    errors_fields.push('emailaddress_' + staff_id);
  }
  email_staff_id = $.inArray(emailaddress, StaffEmails);
  if (email_staff_id > 0 && email_staff_id != staff_id) {
    errors.push('EMAIL_TAKEN');
    errors_fields.push('emailaddress_' + staff_id);
  }

  if (access_level != 'f' && access_level != 'c' && access_level != 'l' && access_level != 'r') {
    alert('access_level = ' + access_level);
    errors.push('EMPTY_ACCESS_LEVEL');
  }

  if (staff_id > 0 && password_first != '' && password_first != password_second) {
    errors.push('PASSWORDS_DONT_MATCH');
    errors_fields.push('password_second_' + staff_id);
  }

  ShowNotification(errors, errors_fields);
  if (errors.length > 0) {
    return false;
  }

  var access_group_arr = get_group_access_for_staff(staff_id, access_level, 0);
  var access_arr = get_access_for_staff(staff_id, access_group_arr, 0);
  var add_access_arr = get_add_access_for_staff(staff_id);

  if (access_group_arr.length > 0) {
    access_group = access_group_arr.join('#');
  } else {
    access_group = '';
  }

  if (access_arr.length > 0) {
    access = access_arr.join('#');
  } else {
    access = '';
  }

  if (add_access_arr.length > 0) {
    add_access = add_access_arr.join('#');
  } else {
    add_access = '';
  }

  var signatureChatPosition = $('#b_signature_chat_position_' + staff_id).val();
  var signatureChatUse = $('#b_signature_chat_use_' + staff_id).val();

  if (staff_id == 0) {
    ShowSpinButton('button_create');
    xajax_CreateStaff(data, emailaddress, defemailaddress, access_level, access_group, access, add_access, signatureChatPosition, signatureChatUse, b_staff_allow_all_groups, deflang);
  } else {
    ShowSpinButton('button_update_' + staff_id);
    xajax_UpdateStaff(staff_id, data, emailaddress, defemailaddress, password_first, access_level, access_group, access, add_access, signatureChatPosition, signatureChatUse, b_staff_allow_all_groups, deflang);
  }
}

function onOff(el, enable) {
  IsUsed(el, function (data) {
    if (enable == 0 && data.b_used) {
      ShowPopup(el, 'disable', data.ActiveStaffList, data.AllStaffList, data.AllActiveStaffList);
    } else {
      //если это не бесплатный аккаунтв и если включаем - то вначале нужно проверить можно ли включить
      if (client_free_account && enable) {
        //вычисляем текущее количество активных сотрудников
        var active_staff_nr = $('.lw_item.active').length;
        //у бесплатного можно только 1 активный
        if (active_staff_nr > 0) {
          $('#activate_staff_denied').togglePopup();
          return;
        }
      }
      enableRecord(el, enable);
      //если это был добавлен новый сотрудник - сразу установить у него флаг "изпользуемый" потому что ему создались тестовые обращения
      if ($(el).attr('rel') == 'b_new') {
        $(el).attr('rel', 'b_used');
      }
    }
  }, enable);
}

function ClickDeleteRecord(el) {
  IsUsed(el, function (data) {
    if (data.b_used) {
      ShowPopup(el, 'remove', data.ActiveStaffList, data.AllStaffList, data.AllActiveStaffList);
    } else {
      StartDeleteRecord(el);
    }
  });
}

//action - disable OR remove
function ShowPopup(el, action, ActiveStaffList, AllStaffList, AllActiveStaffList) {
  work_staff_id = get_closes_li_id(el);
  if (!ActiveStaffList) {
    var ActiveStaffList = [];
    var AllStaffList = [];
    var AllActiveStaffList = [];
    var record_active = 0;
    $('.lw_item').each(function () {
      record_li_id = $(this).attr('id');
      staff_id = 0;
      if (record_li_id.match(/record_li_(\d+)/)) {
        staff_id = record_li_id.match(/record_li_(\d+)/)[1];
        record_active = 0;
        if ($('#record_li_' + staff_id).hasClass('active')) {
          record_active = 1;
          AllActiveStaffList.push(staff_id);
        }
        if (staff_id != work_staff_id) {
          if (StaffCanReplace(work_staff_id, staff_id)) {
            AllStaffList.push(staff_id);
            if (record_active) {
              ActiveStaffList.push(staff_id);
            }
          }
        }
      }
    });
  }
  if (ActiveStaffList.length) {
    //1. Отключение сотрудника при наличии другого активного сотрудника, которой может его заменить
    //1. Удаление сотрудника при наличии другого активного сотрудника, которой может его заменить
    select_id = action + '_staff_id';
    popup_id = action + '_staff';
    select_records = ActiveStaffList;
  } else if (AllStaffList.length) {
    //2. Отключение сотрудника при отсутствии другого активного сотрудника, который мог бы его заменить, но наличии другого неактивного сотрудника, который может его заменить
    //2. Удаление сотрудника при отсутствии другого активного сотрудника, который мог бы его заменить, но наличии другого неактивного сотрудника, который может его заменить
    select_id = action + '_last_staff_id';
    popup_id = action + '_last_staff';
    select_records = AllStaffList;
  } else if (AllActiveStaffList.length) {
    //3. Отключение сотрудника при наличии других активных сотрудникоа, но отсутствии сотрудника, который мог бы его заменить
    //3. Удаление сотрудника при наличии других активных сотрудникоа, но отсутствии сотрудника, который мог бы его заменить
    select_id = '';
    popup_id = action + '_staff_denied';
    select_records = '';
  } else {
    //4. Отключение сотрудника при отсутствии других активных сотрудников, а также отсутствии сотрудника, который мог бы его заменить
    //4. Удаление сотрудника при отсутствии других активных сотрудников, а также отсутствии сотрудника, который мог бы его заменить
    select_id = '';
    popup_id = action + '_last_staff_denied';
    select_records = '';
  }
  $('#' + popup_id).togglePopup();
  if (select_id) {
    $("." + select_id).empty();
    for (i = 0; i < select_records.length; i++) {
      staff_id = select_records[i];
      title = $('#record_li_' + staff_id).find('.t1').html();
      $("." + select_id).append($('<option value="' + staff_id + '">' + title + '</option>'));
    }
  }
}

function StaffCanReplace(initial_staff_id, replacement_staff_id) {
  var initial_access_level = $('#hidden_data_' + initial_staff_id + ' input[name=h_access_level]').val();
  var replacement_access_level = $('#hidden_data_' + replacement_staff_id + ' input[name=h_access_level]').val();

  if (initial_access_level == 'l') return true;
  if (replacement_access_level == 'l') return false;
  if (initial_access_level == 'f' && replacement_access_level != 'f') return false;

  var initial_access_group_arr = get_group_access_for_staff(initial_staff_id, initial_access_level, 1);
  var initial_access_arr = get_access_for_staff(initial_staff_id, initial_access_group_arr, 1);

  var replacement_access_group_arr = get_group_access_for_staff(replacement_staff_id, replacement_access_level, 1);
  var replacement_access_arr = get_access_for_staff(replacement_staff_id, replacement_access_group_arr, 1);

  var all_found = true;

  if ((initial_access_level == 'f' && replacement_access_level == 'f')
    || ((initial_access_level == 'c' || initial_access_level == 'r') && (replacement_access_level == 'c' || replacement_access_level == 'r'))) {
    for (i = 0; i < initial_access_arr.length; i++) {
      if ($.inArray(initial_access_arr[i], replacement_access_arr) == -1) {
        all_found = false;
        break;
      }
    }
  } else if ((initial_access_level == 'c' || initial_access_level == 'r') && replacement_access_level == 'f') {
    for (i = 0; i < initial_access_arr.length; i++) {
      tmp_access = initial_access_arr[i].match(/\d+_(.+)/);
      tmp_access_type = tmp_access[1];
      if ($.inArray('0_' + tmp_access_type, replacement_access_arr) == -1) {
        all_found = false;
        break;
      }
    }
  } else {
    all_found = false;
    //alert('Что-то не то');
  }

  return all_found;
}

//action - remove OR disable
function SwitchStaff(action, last_record, button_name) {
  $('#' + button_name + '_button').hide();
  $('#' + button_name + '_button_spin').show();

  if (last_record) {
    select_id = action + '_last_staff_id';
    popup_id = action + '_last_staff';
  } else {
    select_id = action + '_staff_id';
    popup_id = action + '_staff';
  }
  var new_staff_id = $("." + select_id).first().val();

  if (action == 'remove') {
//		HideRecordRow(work_staff_id);
  } else {
    markOffOn($('#record_' + work_staff_id).closest('.lw_item'), 0);
  }
  if (last_record) {
    markOffOn($('#record_' + new_staff_id).closest('.lw_item'), 1);
  }

  $('#record_' + work_staff_id).removeAttr('rel');
  $('#record_' + new_staff_id).attr('rel', 'b_used');

  $('#' + popup_id).togglePopup();

  $.ajax({
    url: switch_record_url,
    type: 'POST',
    data: {
      disable_record_id: work_staff_id,
      enable_record_id: new_staff_id,
      last_record: last_record,
      action: action
    },
    cache: false
  }).done(function (r) {
    $('#' + button_name + '_button').show();
    $('#' + button_name + '_button_spin').hide();
    $('#record_li_' + work_staff_id).addClass('b_row_disabled').addClass('b_appraise');
    $('#record_li_' + work_staff_id + ' a.edit').addClass('f_disabled');
    $('#record_li_' + work_staff_id + ' a.delete').addClass('f_disabled');
    ShowXajaxNotification(r);

    b_ajax_check_notifications = 1;

    $('.span_cnt').html((parseInt($('.span_cnt').html()) - 1));

  });
}

function ShowEditSpin(record_id) {
  $("#edit_btn_" + record_id).hide();
  $("#spin_edit_btn_" + record_id).show();
}

function HideEditSpin(record_id) {
  $("#spin_edit_btn_" + record_id).hide();
  $("#edit_btn_" + record_id).show();
}

function ShowSettings(record_id) {
  $("#record_li_" + record_id).find('.w_settings').slideDown('slow');
  InitNanoScrolls(`#record_li_${record_id}`);
  HideEditSpin(record_id);
  choicesInit(`#record_li_${record_id} select`, {searchEnabled: false, shouldSort: false, itemSelectText: ''})
}

function UploadSettingsData(el) {
  var record_id = $(el).closest('.lw_item').attr('id');
  record_id = record_id.replace('record_li_', '');

  ShowEditSpin(record_id);
  xajax_UploadRecord(record_id);
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

$(document).on('click', '.thirdBlock', function (e) {
  const button = e.target.closest("a.active")
  const create_labels = button.closest("form").querySelector(".additional-permissions input[value='create_labels']")
  const add_labels    = button.closest("form").querySelector(`.additional-permissions input[value="add_labels"]`)

  if (add_labels.checked) {
    create_labels.disabled = false
  } else {
    create_labels.disabled = true
  }
});
