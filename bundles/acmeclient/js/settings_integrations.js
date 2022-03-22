$(document).ready(function () {
  let c = $(".js_chatra_select_group:last").clone()

  $(".sort-elements").sortable(
    {items: ".able_sort"},
    {handle: ".js-move-item"},
    {axis: "y"},
    {
      stop: function (event, ui) {
        SortElements(true);
      }
    }
  );

  $('.addingIntegrations').click(function () {
    if ($(this).hasClass('noJs')) {
      return true;
    }
    $(this).addClass('dsbld');
    $('.addingBlock').slideDown('slow');
    $('.cancelTop').fadeIn();
    gsimg();
    return false;
  });

  $('.integration_add_button').click(function () {
    type = $(this).attr('rel');
    $('.' + $(this).attr('rel') + '_integration').slideDown();
    let classElement = $('.' + $(this).attr('rel') + '_integration').attr("class")
    classElement = classElement.replace(/\s/ig, '.');

    if (type == 'gravitel') {
      ValidateItoolabsIntegration($('.' + $(this).attr('rel') + '_integration').find('form')[0]);
    } else if (type == 'chatapi') {
      ShowChatApiStaffs($('#form_li_local_chatapi')[0]['chatapi_group_id'].value, 0)
    } else if (type === "chatra") {
      choicesInit(`.${classElement} .-js-noMySelect`, {searchEnabled: false, shouldSort: false, itemSelectText: ''})
    }
    SelectNano(`.${classElement}`)
    hideChooseIntegrations();
    return false;
  });

  $('.addingCancel_integration').click(function () {
    $('.' + $(this).attr('rel') + '_integration').slideUp();
    $('.new_integration_block').slideDown();
    $('.cancelTop').fadeIn();
    return false;
  });

  // Help
  $('#wish_integrations').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/new_integration'));
  });
  $('#add_integrations_amocrm, #upd_integrations_amocrm').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/feedback_on_integration_with', {'integration_name': Translate('integrations_new_record/amocrm')}));
  });
  $('#add_integrations_getresponse, #upd_integrations_getresponse').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/feedback_on_integration_with', {'integration_name': Translate('integrations_new_record/getresponse')}));
  });
  $('#add_integrations_sendpulse, #upd_integrations_sendpulse').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/feedback_on_integration_with', {'integration_name': Translate('integrations_new_record/sendpulse')}));
  });
  $('#add_integrations_retailcrm, #upd_integrations_retailcrm').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/feedback_on_integration_with', {'integration_name': Translate('integrations_new_record/retailcrm')}));
  });
  $('#add_integrations_chatapi, #upd_integrations_chatapi').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/feedback_on_integration_with', {'integration_name': Translate('integrations_new_record/chatapi')}));
  });
  $('#add_integrations_pipedrive, #upd_integrations_pipedrive').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/feedback_on_integration_with', {'integration_name': Translate('integrations_new_record/pipedrive')}));
  });
  $('#add_integrations_mailchimp, #upd_integrations_mailchimp').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/feedback_on_integration_with', {'integration_name': Translate('integrations_new_record/mailchimp')}));
  });
  $('#add_integrations_campaignmonitor, #upd_integrations_campaignmonitor').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/feedback_on_integration_with', {'integration_name': Translate('integrations_new_record/campaignmonitor')}));
  });
  $('#add_integrations_chartmogul, #upd_integrations_chartmogul').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/feedback_on_integration_with', {'integration_name': Translate('integrations_new_record/chartmogul')}));
  });
  $('#add_integrations_unisender, #upd_integrations_unisender').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/feedback_on_integration_with', {'integration_name': Translate('integrations_new_record/unisender')}));
  });
  $('#add_integrations_megaplan, #upd_integrations_megaplan').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/feedback_on_integration_with', {'integration_name': Translate('integrations_new_record/megaplan')}));
  });
  $('#add_integrations_jira, #upd_integrations_jira').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/feedback_on_integration_with', {'integration_name': Translate('integrations_new_record/jira')}));
  });
  $('#add_integrations_chatra, #upd_integrations_chatra').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/feedback_on_integration_with', {'integration_name': Translate('integrations_new_record/chatra')}));
  });
  $('#add_integrations_gravitel, #upd_integrations_gravitel').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/feedback_on_integration_with', {'integration_name': Translate('integrations_c/gravitel_title')}));
  });
  $('#add_integrations_mango_office, #upd_integrations_mango_office').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/feedback_on_integration_with', {'integration_name': Translate('integrations_c/mangooffice_title')}));
  });
  $('#add_integrations_dropbox, #upd_integrations_dropbox').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/feedback_on_integration_with', {'integration_name': Translate('integrations_c/dropbox_title')}));
  });
  $('#add_integrations_yandexdisk, #upd_integrations_yandexdisk').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/feedback_on_integration_with', {'integration_name': Translate('integrations_c/yadisk_title')}));
  });
  $('#add_integrations_onedrive, #upd_integrations_onedrive').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/feedback_on_integration_with', {'integration_name': Translate('integrations_new_record/onedrive')}));
  });
  $('#add_integrations_googledrive, #upd_integrations_googledrive').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/feedback_on_integration_with', {'integration_name': Translate('integrations_new_record/googledrive')}));
  });
  $('#add_integrations_wazzup, #upd_integrations_wazzup').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/feedback_on_integration_with', {'integration_name': Translate('integrations_new_record/wazzup')}));
  });
  $('#add_integrations_acebot, #upd_integrations_acebot').click(function (e) {
    e.preventDefault();
    $('.pp_help').togglePopup();
    $('input[name=support_request_subject]').val(Translate('settings_integrations_js/feedback_on_integration_with', {'integration_name': Translate('integrations_new_record/acebot')}));
  });
  $(document).on('click', '.-js-chatra_add_row', function () {
    let element = c.clone()

    $(element).find('input').val('');
    $(element).find('select').val(0);

    $(this).closest("form").find('.js_chatra_select_group:last').after(element);
    choicesInit('.js_chatra_select_group select', {searchEnabled: false, shouldSort: false, itemSelectText: ''})
    InitNanoScrolls(".js_chatra_select_group");
    return false;
  });

  if ($('.integration-switch').length > 0) {
    $(document).on('click', '.integration-switch a', function (event) {
      var integrationNavigation = $(this).parents('.integration-switch');
      var integrationSwitches = integrationNavigation.find('a');
      var parent = $(this).parents('form');

      event.preventDefault();
      var linkElement = $(this);

      integrationSwitches.removeClass('active');
      linkElement.addClass('active');

      if (linkElement.data('value') == 0) {
        parent.removeClass('public');
      } else {
        parent.addClass('public');
      }
    });
  }


  if (window.location.href.match(/#chatra/)) {
    if ($('#upd_integrations_chatra').length) {
      $('#upd_integrations_chatra:first').closest("li").find('.w_settings').show();
      $('#upd_integrations_chatra:first').closest("li").find('.w_settings')[0].scrollIntoView({block: "center", behavior: "smooth"});
      const select = $('#upd_integrations_chatra:first').closest("li").find('select')
      choicesInit(select, {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        noResultsText: Translate('alpha20_js/no_results'),
        noChoicesText: Translate('alpha20_js/no_variants')
      })

      const id = $('#upd_integrations_chatra:first').closest("li")[0].id
      InitNanoScrolls(`#${id}`)
    } else {
      $('.addingIntegrations').addClass('dsbld');
      $('.addingBlock').slideDown('slow');
      $('.cancelTop').fadeIn();
      gsimg();
      $('.chatra_integration').slideDown();
      hideChooseIntegrations();

      choicesInit(".chatra_integration select", {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        noResultsText: Translate('alpha20_js/no_results'),
        noChoicesText: Translate('alpha20_js/no_variants')
      })

      InitNanoScrolls(".chatra_integration")
    }
    return false;
  } else if (window.location.href.match(/#chatapi/)) {

    if ($('#upd_integrations_chatapi').length) {
      $('#upd_integrations_chatapi:first').closest("li").find('.w_settings').show();
      $('#upd_integrations_chatapi:first').closest("li").find('.w_settings')[0].scrollIntoView({block: "center", behavior: "smooth"});
    } else {
      $('.addingIntegrations').addClass('dsbld');
      $('.addingBlock').slideDown('slow');
      $('.cancelTop').fadeIn();
      gsimg();

      $('.chatapi_integration').slideDown();
      hideChooseIntegrations();
    }
    init_nice_elements();
    InitNanoScrolls("")
    return false;
  }
  else if (window.location.href.match(/#phones/)) {

      const allPhones = Array.from(document.querySelector(`a[name="phones"]`).closest(".new_integration_block").querySelectorAll("a[rel]"))
      const allPhonesRel = allPhones.map(element => element.getAttribute("rel"))
      let numberIntegration = [] // порядковые номера интеграций

      allPhonesRel.filter(element => {
          const div = $(`#upd_integrations_${element}`)
          if (div[0]) {
          const position = div.closest("li").find(".span-sort").text()
          div.closest("li").attr("data-position", position)
          numberIntegration.push(position)
      }
  })

      const minNumberIntegration = Math.min.apply(null, numberIntegration)
      const li = $(`[data-position="${minNumberIntegration}"]`)

      if (li[0]) {
          li.find('.w_settings').show();
          li[0].scrollIntoView({block: "center", behavior: "smooth"});
      } else {
          $('.addingIntegrations').addClass('dsbld');
          $('.addingBlock').show();
          $('.cancelTop').fadeIn();
          gsimg();
          setTimeout(function () {
              window.location = '#phones';
          }, 500);
          init_nice_elements();
          InitNanoScrolls("")
          return false;
      }
  }
  else if (window.location.href.match(/#chats_wa/)) {

      const allPhones = Array.from(document.querySelector(`a[name="chats_wa"]`).closest(".new_integration_block").querySelectorAll("a[rel]"))
      const allPhonesRel = allPhones.map(element => element.getAttribute("rel"))
      let numberIntegration = [] // порядковые номера интеграций

      allPhonesRel.filter(element => {
          const div = $(`#upd_integrations_${element}`)
          if (div[0]) {
          const position = div.closest("li").find(".span-sort").text()
          div.closest("li").attr("data-position", position)
          let type = $(div.closest("li")).attr('data-type');
          if(type == 'acebot'
          || type == 'chatapi')
          {
              numberIntegration.push(position)
          }
      }
  })

      const minNumberIntegration = Math.min.apply(null, numberIntegration)
      const li = $(`[data-position="${minNumberIntegration}"]`)

      if (li[0]) {
          li.find('.w_settings').show();
          li[0].scrollIntoView({block: "center", behavior: "smooth"});
      } else {
          $('.addingIntegrations').addClass('dsbld');
          $('.addingBlock').show();
          $('.cancelTop').fadeIn();
          gsimg();
          setTimeout(function () {
              window.location = '#chats_wa';
          }, 500);
          init_nice_elements();
          InitNanoScrolls("")
          return false;
      }
  }  else if(window.location.href.match(/#avito/)) {
    if ($('#upd_integrations_avito').length) {
      $('#upd_integrations_avito:first').closest("li").find('.w_settings').show();
      $('#upd_integrations_avito:first').closest("li").find('.w_settings')[0].scrollIntoView({block: "center", behavior: "smooth"});
      const select = $('#upd_integrations_avito:first').closest("li").find('select')
      choicesInit(select, {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        noResultsText: Translate('alpha20_js/no_results'),
        noChoicesText: Translate('alpha20_js/no_variants')
      })

      const id = $('#upd_integrations_avito:first').closest("li")[0].id;

      InitNanoScrolls(`#${id}`);
      showIntegrations("form.edit_form_avito");
    } else {
      $('.addingIntegrations').addClass('dsbld');
      $('.addingBlock').slideDown('slow');
      $('.cancelTop').fadeIn();
      gsimg();
      $('.avito_integration').slideDown();
      hideChooseIntegrations();

      choicesInit(".avito_integration select", {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        noResultsText: Translate('alpha20_js/no_results'),
        noChoicesText: Translate('alpha20_js/no_variants')
      })
      InitNanoScrolls(".avito_integration");
      showIntegrations("form#form_li_local_avito");
    }
  }  else if(window.location.href.match(/#wazzup/)) {
    if ($('#upd_integrations_wazzup').length) {
      $('#upd_integrations_wazzup:first').closest("li").find('.w_settings').show();
      $('#upd_integrations_wazzup:first').closest("li").find('.w_settings')[0].scrollIntoView({block: "center", behavior: "smooth"});
      const select = $('#upd_integrations_wazzup:first').closest("li").find('select')
      choicesInit(select, {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        noResultsText: Translate('alpha20_js/no_results'),
        noChoicesText: Translate('alpha20_js/no_variants')
      })

      const id = $('#upd_integrations_wazzup:first').closest("li")[0].id;

      InitNanoScrolls(`#${id}`);
      showIntegrations("form.edit_form_wazzup");
    } else {
      $('.addingIntegrations').addClass('dsbld');
      $('.addingBlock').slideDown('slow');
      $('.cancelTop').fadeIn();
      gsimg();
      $('.wazzup_integration').slideDown();
      hideChooseIntegrations();

      choicesInit(".wazzup_integration select", {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        noResultsText: Translate('alpha20_js/no_results'),
        noChoicesText: Translate('alpha20_js/no_variants')
      })
      InitNanoScrolls(".wazzup_integration");
      showIntegrations("form#form_li_local_wazzup");
    }
  }
  $(document).on('change', 'form.edit_form_gravitel input, form.edit_form_gravitel select', function () {
    ValidateItoolabsIntegration($(this).parents('form')[0]);
  });


  $(document).on('change', 'form.edit_form_wazzup input[name="token"], form#form_li_local_wazzup input[name="token"]', function (e) {
    var token  = $(this).parents('form')[0]['token'].value;
    target_id = e.target.id;
    var temparr = target_id.split('_');
    var record_id = temparr.length == 3 ? temparr[2] : null;
    __self = this;
    if(token.length)
    {
      if (record_id) {
        ShowSpinButton('button_update_' + record_id);
      } else {
        ShowSpinButton('button_wazzup_link');
      }

      xAjaxCall('WazzupGetChannels', [token, target_id, record_id], function () {
        // setIntegration(e);
      });
    }
  });


  $(document).on('change', '.integrations_itoolabs:visible form#form_li_local input, .integrations_itoolabs:visible form#form_li_local select', function (e) {
    target_id = e.target.id;
    ValidateItoolabsIntegration($(this).parents('form')[0]);
    var url = $(this).parents('form')[0]['url'].value;
    var key = $(this).parents('form')[0]['key'].value;
    if (url.length && key.length && (target_id == 'gravitel_url' || target_id == 'gravitel_key')) {
      __self = this;
      xAjaxCall('ItoolabsGetAccounts', [url, key], function () {
        ValidateItoolabsIntegration($(__self).parents('form')[0]);
        setIntegration(e)
      });
    }

  });
  $(document).on('change', '.mango_office_integration form#form_li_local input, .mango_office_integration form#form_li_local select', function (e) {
    target_id = e.target.id;
    ValidateMangoIntegration($(this).parents('form')[0]);
    var key = $(this).parents('form')[0]['key'].value;
    var sign = $(this).parents('form')[0]['sign'].value;
    if (sign.length && key.length && (target_id == 'mango_key' || target_id == 'mango_sign')) {
      __self = this;
      xAjaxCall('MangoGetAccounts', [key, sign], function () {
        ValidateMangoIntegration($(__self).parents('form')[0]);
        setIntegration(e)
      });
      // xajax_MangoGetAccounts(key,sign);

    }

  });
  $(document).on('change', '.uiscom_integration form#form_li_local input, .uiscom_integration form#form_li_local select', function (e) {
    target_id = e.target.id;
    var key = $(this).parents('form')[0]['key'].value;
    if (key.length && (target_id == 'uiscom_key')) {
      __self = this;
      xAjaxCall('UisComGetAccounts', [key], function () {
        ValidateUiscomIntegration($(__self).parents('form')[0]);
      });
      // xajax_MangoGetAccounts(key,sign);
    }
  });
    $(document).on('change', '.asterisk_integration form input', function (e) {
        target_id = e.target.id;
        var login = $(this).parents('form')[0]['login'].value;
        var password = $(this).parents('form')[0]['passwd'].value;
        var url = $(this).parents('form')[0]['url'].value;
        var port = $(this).parents('form')[0]['port'].value;
        if (login.length
            && password.length
            && url.length
            && port.length
            && (['asterisk_login','asterisk_passwd','asterisk_url','asterisk_port'].indexOf(target_id) !== -1)
    ) {
            __self = this;
            xAjaxCall('CallGetAccounts', ['asterisk',login,password,url,port], function () {
                // ValidateUiscomIntegration($(__self).parents('form')[0]);
            });
            // xajax_MangoGetAccounts(key,sign);
        }
    });
  $(document).on('change', '.comagic_integration form#form_li_local input, .comagic_integration form#form_li_local select', function (e) {
    target_id = e.target.id;
    var key = $(this).parents('form')[0]['key'].value;
    if (key.length && (target_id == 'uiscom_key')) {
      __self = this;
      xAjaxCall('UisComGetAccounts', [key, 'comagic'], function () {
        ValidateUiscomIntegration($(__self).parents('form')[0]);
      });
      // xajax_MangoGetAccounts(key,sign);
    }

  });
  const select = Array.from(document.querySelectorAll(`[name*="staff_agent"]`))
  choicesInit(select, {
    searchEnabled: true,
    searchResultLimit: 9999,
    shouldSort: false,
    itemSelectText: '',
    noResultsText: Translate('alpha20_js/no_results'),
    noChoicesText: Translate('alpha20_js/no_variants')
  });
  init_nice_elements(); // инитим селекты
  InitNanoScrolls(""); // кастомный скролл
});

function hideChooseIntegrations() {
  $('.new_integration_block').slideUp();
  $('.cancelTop').fadeOut();
}

function AddNewIntegration(record_html, record_id, type) {
  if (type === 'dropbox' || type === 'yandexdisk' || type === 'onedrive' || type === 'googledrive') {
    $('#record_list_filestore_enabled').append(record_html);
  } else {
    $('#record_list_enabled').append(record_html);
  }
  $('.span_cnt').html((parseInt($('.span_cnt').html()) + 1));
  SortElements(false);

  $('.new_integration_block a[rel=' + type + ']').addClass('activated');

  $('.' + type + '_integration').slideUp();
  $('.new_integration_block').slideDown();
  $('.addGroup').slideUp();
  $('.cancelTop').fadeOut();
  $('.addingIntegrations').removeClass('dsbld');

  InitialSettings(record_id);
}

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

function onOff(el, enable) {
  enableRecord(el, enable);
  var li_el = $(el).closest('li');

  if (enable) {
    $('#record_list_enabled').append(li_el);
  } else {
    $('#record_list_disabled').append(li_el);
  }
  SortElements(true);
}

function HideEditableBlock(record_id) {
  $('#record_li_' + record_id + ' .w_settings').slideUp();
  $('#record_li_' + record_id + '').find('.edit').removeClass('active');
}

function OnEdit(el) {
  type = $(el).parents('.lw_item').attr('data-type');
  if (type == 'gravitel') {
    ValidateItoolabsIntegration($(el).parents('.lw_item').find('form')[0]);
    $(el).parents('.lw_item').find('form select[name^=staff_agen]').each(function () {
      if ($(this).val() == -1) {
        $(this).next('.chosen-container').find('.chosen-single span').css('color', '#f05252');
      }
    });

  }
}

function AddNewDate(record_id, time_string) {
  $('#record_li_' + record_id + ' .client_date').html(time_string);
}

function AddNewTitle(record_id, title) {
  $('#record_li_' + record_id + ' .t1').text(title);
}

function SaveAmoIntegration(form, record_id) {
    var domain    = '';//form['domain'].value;
    var apikey    = '';//form['apikey'].value;
    var login     = '';//form['login'].value;
    var itype = form['itype'].value;
  var title = form['title'].value;
  var staff_access = $('#staff_access_' + record_id).val() || $('#staff_access_amocrm').val() || [];

  var errors = [];
  var errors_fields = [];

  // if (domain.length === 0) {
  //   errors_fields.push(form['domain'].id);
  // }
  // if (apikey.length === 0) {
  //   errors_fields.push(form['apikey'].id);
  // }
  // if (!login.length) {
  //   errors_fields.push(form['login'].id);
  // }
  if (!title.length) {
    return false;
  }

  if (staff_access.length === 0) {
    errors_fields.push(form['staff_access[]'].id);
    errors.push('INTEGRATION_ERROR_EMPTY_STAFF_ACCESS');
  } else {
    for (var i = 0; i < staff_access.length; i++) {
      if (false === /^(-\d+)|(\d+(:\d)?)|(g:\d+(:\d)?)$/i.test(staff_access[i])) {
        errors_fields.push(form['staff_access[]'].id);
        errors.push('INTEGRATION_ERROR_INCORRECT_STAFF_ACCESS');
        errors.push('staff_access[' + i + '] = ' + staff_access[i]);
        break;
      }
    }
  }

  if (errors_fields.length) {
    errors.push('INTEGRATION_ERROR_EMPTY');
  }
  ShowNotification(errors, errors_fields);
  if (errors.length > 0) {
    return false;
  }

  if (record_id)
    ShowSpinButton('button_update_' + record_id);
  else
    ShowSpinButton('button_amo_link');

  xajax_SaveAmoIntegration(domain, apikey, login, title, staff_access, itype, record_id);
}

function SavePipedriveIntegration(form, record_id) {
  var domain = form['domain'].value;
  var apikey = form['apikey'].value;
  var itype = form['itype'].value;
  var staff_access = $('#staff_access_' + record_id).val() || $('#staff_access_pipedrive').val() || [];

  var errors = [];
  var errors_fields = [];

  if (domain.length === 0) {
    errors_fields.push(form['domain'].id);
  }
  if (apikey.length === 0) {
    errors_fields.push(form['apikey'].id);
  }

  if (staff_access.length === 0) {
    errors_fields.push(form['staff_access[]'].id);
    errors.push('INTEGRATION_ERROR_EMPTY_STAFF_ACCESS');
  } else {
    for (var i = 0; i < staff_access.length; i++) {
      if (false === /^(-\d+)|(\d+(:\d)?)|(g:\d+(:\d)?)$/i.test(staff_access[i])) {
        errors_fields.push(form['staff_access[]'].id);
        errors.push('INTEGRATION_ERROR_INCORRECT_STAFF_ACCESS');
        errors.push('staff_access[' + i + '] = ' + staff_access[i]);
        break;
      }
    }
  }

  if (errors_fields.length) {
    errors.push('INTEGRATION_ERROR_EMPTY');
  }
  ShowNotification(errors, errors_fields);
  if (errors.length > 0) {
    return false;
  }

  if (record_id)
    ShowSpinButton('spin_button_update_' + record_id);
  else
    ShowSpinButton('button_pipedrive_link');
  xajax_SavePipedriveIntegration(domain, apikey, staff_access, itype, record_id);
}

function SaveMailchimpIntegration(form, record_id) {
  var apikey = form['apikey'].value;
  var itype = form['itype'].value;
  var staff_access = $('#staff_access_' + record_id).val() || $('#staff_access_mailchimp').val() || [];

  var errors = [];
  var errors_fields = [];

  if (apikey.length === 0) {
    errors_fields.push(form['apikey'].id);
  }

  if (staff_access.length === 0) {
    errors_fields.push(form['staff_access[]'].id);
    errors.push('INTEGRATION_ERROR_EMPTY_STAFF_ACCESS');
  } else {
    for (var i = 0; i < staff_access.length; i++) {
      if (false === /^(-\d+)|(\d+(:\d)?)|(g:\d+(:\d)?)$/i.test(staff_access[i])) {
        errors_fields.push(form['staff_access[]'].id);
        errors.push('INTEGRATION_ERROR_INCORRECT_STAFF_ACCESS');
        errors.push('staff_access[' + i + '] = ' + staff_access[i]);
        break;
      }
    }
  }

  if (errors_fields.length) {
    errors.push('INTEGRATION_ERROR_EMPTY');
  }
  ShowNotification(errors, errors_fields);
  if (errors.length > 0) {
    return false;
  }
  if (record_id)
    ShowSpinButton('button_update_' + record_id);
  else
    ShowSpinButton('button_mailchimp_link');
  xajax_SaveMailchimpIntegration(apikey, staff_access, itype, record_id);
}

function SaveCampaignMonitorIntegration(form, record_id) {
  var apiKey = form['apiKey'].value;
  var clientId = form['clientId'].value;
  var itype = form['itype'].value;
  var staff_access = $('#staff_access_' + record_id).val() || $('#staff_access_campaignmonitor').val() || [];

  var errors = [];
  var errors_fields = [];

  if (apiKey.length === 0) {
    errors_fields.push(form['apiKey'].id);
    errors.push('INTEGRATION_ERROR_CAMPAIGNMONITOR_EMPTY_API_KEY');
  }
  if (clientId.length === 0) {
    errors_fields.push(form['clientId'].id);
    errors.push('INTEGRATION_ERROR_CAMPAIGNMONITOR_EMPTY_CLIENT_ID');
  }
  if (false === /^[a-z0-9+/]{2,}==$/i.test(apiKey)) {
    errors_fields.push(form['apiKey'].id);
    errors.push('INTEGRATION_ERROR_CAMPAIGNMONITOR_INCORRECT_API_KEY');
  }
  if (false === /^[0-9a-z]{32}$/i.test(clientId)) {
    errors_fields.push(form['clientId'].id);
    errors.push('INTEGRATION_ERROR_CAMPAIGNMONITOR_INCORRECT_CLIENT_ID');
  }

  if (staff_access.length === 0) {
    errors_fields.push(form['staff_access[]'].id);
    errors.push('INTEGRATION_ERROR_EMPTY_STAFF_ACCESS');
  } else {
    for (var i = 0; i < staff_access.length; i++) {
      if (false === /^(-\d+)|(\d+(:\d)?)|(g:\d+(:\d)?)$/i.test(staff_access[i])) {
        errors_fields.push(form['staff_access[]'].id);
        errors.push('INTEGRATION_ERROR_INCORRECT_STAFF_ACCESS');
        errors.push('staff_access[' + i + '] = ' + staff_access[i]);
        break;
      }
    }
  }

  if (errors.length > 0) {
    ShowNotification(errors, errors_fields);
    return false;
  }

  if (record_id) {
    ShowSpinButton('button_update_' + record_id);
  } else {
    ShowSpinButton('button_campaignmonitor_link');
  }

  xajax_SaveCampaignMonitorIntegration(apiKey, clientId, staff_access, itype, record_id);
}

function SaveChartMogulIntegration(form, record_id) {
  var token = form['token'].value;
  var secret = form['secret'].value;
  var staff_access = $('#staff_access_' + record_id).val() || $('#staff_access_chartmogul').val() || [];
  var itype = form['itype'].value;

  var errors = [];
  var errors_fields = [];

  if (token.length === 0) {
    errors_fields.push(form['token'].id);
    errors.push('INTEGRATION_ERROR_CHARTMOGUL_EMPTY_TOKEN');
  }
  if (secret.length === 0) {
    errors_fields.push(form['secret'].id);
    errors.push('INTEGRATION_ERROR_CHARTMOGUL_EMPTY_SECRET');
  }
  if (false === /^[a-z0-9]{2,}$/i.test(token)) {
    errors_fields.push(form['token'].id);
    errors.push('INTEGRATION_ERROR_CHARTMOGUL_INCORRECT_TOKEN');
  }
  if (false === /^[a-z0-9]{2,}$/i.test(secret)) {
    errors_fields.push(form['secret'].id);
    errors.push('INTEGRATION_ERROR_CHARTMOGUL_INCORRECT_SECRET');
  }

  if (staff_access.length === 0) {
    errors_fields.push(form['staff_access[]'].id);
    errors.push('INTEGRATION_ERROR_EMPTY_STAFF_ACCESS');
  } else {
    for (var i = 0; i < staff_access.length; i++) {
      if (false === /^(-\d+)|(\d+(:\d)?)|(g:\d+(:\d)?)$/i.test(staff_access[i])) {
        errors_fields.push(form['staff_access[]'].id);
        errors.push('INTEGRATION_ERROR_INCORRECT_STAFF_ACCESS');
        errors.push('staff_access[' + i + '] = ' + staff_access[i]);
        break;
      }
    }
  }

  if (errors.length > 0) {
    ShowNotification(errors, errors_fields);
    return false;
  }

  if (record_id) {
    ShowSpinButton('button_update_' + record_id);
  } else {
    ShowSpinButton('button_chartmogul_link');
  }

  xajax_SaveChartMogulIntegration(token, secret, staff_access, itype, record_id);
}

function SaveUniSenderIntegration(form, record_id) {
  var apiKey = form['apiKey'].value;
  var itype = form['itype'].value;
  var staff_access = $('#staff_access_' + record_id).val() || $('#staff_access_unisender').val() || [];

  var errors = [];
  var errors_fields = [];

  if (apiKey.length === 0) {
    errors_fields.push(form['apiKey'].id);
    errors.push('INTEGRATION_ERROR_UNISENDER_EMPTY_API_KEY');
  }
  if (false === /^[a-z0-9]{2,}$/i.test(apiKey)) {
    errors_fields.push(form['apiKey'].id);
    errors.push('INTEGRATION_ERROR_UNISENDER_INCORRECT_API_KEY');
  }

  if (staff_access.length === 0) {
    errors_fields.push(form['staff_access[]'].id);
    errors.push('INTEGRATION_ERROR_EMPTY_STAFF_ACCESS');
  } else {
    for (var i = 0; i < staff_access.length; i++) {
      if (false === /^(-\d+)|(\d+(:\d)?)|(g:\d+(:\d)?)$/i.test(staff_access[i])) {
        errors_fields.push(form['staff_access[]'].id);
        errors.push('INTEGRATION_ERROR_INCORRECT_STAFF_ACCESS');
        errors.push('staff_access[' + i + '] = ' + staff_access[i]);
        break;
      }
    }
  }

  if (errors.length > 0) {
    ShowNotification(errors, errors_fields);
    return false;
  }

  if (record_id) {
    ShowSpinButton('button_update_' + record_id);
  } else {
    ShowSpinButton('button_unisender_link');
  }

  xajax_SaveUniSenderIntegration(apiKey, staff_access, itype, record_id);
}

function SaveMegaplanIntegration(form, record_id) {
  var domain = form['domain'].value;
  var login = form['login'].value;
  var passwd = form['password'].value;
  var itype = form['itype'].value;
  var staff_access = $('#staff_access_' + record_id).val() || $('#staff_access_megaplan').val() || [];

  var errors = [];
  var errors_fields = [];

  if (domain.length === 0) {
    errors_fields.push(form['apikey'].id);
  }
  if (login.length === 0) {
    errors_fields.push(form['login'].id);
  }
  //if(passwd.length == 0) {
  //    errors_fields.push(form['password'].id);
  //}

  if (staff_access.length === 0) {
    errors_fields.push(form['staff_access[]'].id);
    errors.push('INTEGRATION_ERROR_EMPTY_STAFF_ACCESS');
  } else {
    for (var i = 0; i < staff_access.length; i++) {
      if (false === /^(-\d+)|(\d+(:\d)?)|(g:\d+(:\d)?)$/i.test(staff_access[i])) {
        errors_fields.push(form['staff_access[]'].id);
        errors.push('INTEGRATION_ERROR_INCORRECT_STAFF_ACCESS');
        errors.push('staff_access[' + i + '] = ' + staff_access[i]);
        break;
      }
    }
  }

  if (errors_fields.length) {
    errors.push('INTEGRATION_ERROR_EMPTY');
  }
  ShowNotification(errors, errors_fields);
  if (errors.length > 0) {
    return false;
  }

  if (record_id)
    ShowSpinButton('button_update_' + record_id);
  else
    ShowSpinButton('button_megaplan_link');
  xajax_SaveMegaplanIntegration(domain, login, passwd, staff_access, itype, record_id);
}

function SaveJiraIntegration(form, record_id) {
  var domain = form['domain'].value;
  var itype = form['itype'].value;
  var staff_access = $('#staff_access_' + record_id).val() || $('#staff_access_jira').val() || [];

  var errors = [];
  var errors_fields = [];

  if (domain.length === 0) {
    errors_fields.push(form['domain'].id);
  }

  if (staff_access.length === 0) {
    errors_fields.push(form['staff_access[]'].id);
    errors.push('INTEGRATION_ERROR_EMPTY_STAFF_ACCESS');
  } else {
    for (var i = 0; i < staff_access.length; i++) {
      if (false === /^(-\d+)|(\d+(:\d)?)|(g:\d+(:\d)?)$/i.test(staff_access[i])) {
        errors_fields.push(form['staff_access[]'].id);
        errors.push('INTEGRATION_ERROR_INCORRECT_STAFF_ACCESS');
        errors.push('staff_access[' + i + '] = ' + staff_access[i]);
        break;
      }
    }
  }

  if (errors_fields.length) {
    errors.push('INTEGRATION_ERROR_EMPTY');
  }
  ShowNotification(errors, errors_fields);
  if (errors.length > 0) {
    return false;
  }

  if (record_id)
    ShowSpinButton('button_update_' + record_id);
  else
    ShowSpinButton('button_jira_link');
  xajax_SaveJiraIntegration(domain, staff_access, itype, record_id);
}

function SaveGetResponseIntegration(form, record_id) {
  var api_key = form['api_key'].value;
  var itype = form['itype'].value;
  var staff_access = $('#staff_access_' + record_id).val() || $('#staff_access_getresponse').val() || [];

  var errors = [];
  var errors_fields = [];

  if (api_key.length === 0) {
    errors_fields.push(form['api_key'].id);
  }

  if (staff_access.length === 0) {
    errors_fields.push(form['staff_access[]'].id);
    errors.push('INTEGRATION_ERROR_EMPTY_STAFF_ACCESS');
  } else {
    for (var i = 0; i < staff_access.length; i++) {
      if (false === /^(-\d+)|(\d+(:\d)?)|(g:\d+(:\d)?)$/i.test(staff_access[i])) {
        errors_fields.push(form['staff_access[]'].id);
        errors.push('INTEGRATION_ERROR_INCORRECT_STAFF_ACCESS');
        errors.push('staff_access[' + i + '] = ' + staff_access[i]);
        break;
      }
    }
  }

  if (errors_fields.length) {
    errors.push('INTEGRATION_ERROR_EMPTY');
  } else if (api_key.length !== 32) {
    errors_fields.push('INTEGRATION_GETRESPONSE_TOKEN');
  }

  ShowNotification(errors, errors_fields);
  if (errors.length > 0) {
    return false;
  }

  if (record_id)
    ShowSpinButton('button_update_' + record_id);
  else
    ShowSpinButton('button_getresponse_link');
  xajax_SaveGetResponseIntegration(api_key, staff_access, itype, record_id);
}

function SaveSendPulseIntegration(form, record_id) {
  var api_key = form['api_key'].value;
  var secret_key = form['secret_key'].value;
  var itype = form['itype'].value;
  var staff_access = $('#staff_access_' + record_id).val() || $('#staff_access_sendpulse').val() || [];

  var errors = [];
  var errors_fields = [];

  if (api_key.length === 0) {
    errors_fields.push(form['api_key'].id);
  }

  if (secret_key.length === 0) {
    errors_fields.push(form['secret_key'].id);
  }

  if (staff_access.length === 0) {
    errors_fields.push(form['staff_access[]'].id);
    errors.push('INTEGRATION_ERROR_EMPTY_STAFF_ACCESS');
  } else {
    for (var i = 0; i < staff_access.length; i++) {
      if (false === /^(-\d+)|(\d+(:\d)?)|(g:\d+(:\d)?)$/i.test(staff_access[i])) {
        errors_fields.push(form['staff_access[]'].id);
        errors.push('INTEGRATION_ERROR_INCORRECT_STAFF_ACCESS');
        errors.push('staff_access[' + i + '] = ' + staff_access[i]);
        break;
      }
    }
  }

  if (errors_fields.length) {
    errors.push('INTEGRATION_ERROR_EMPTY');
  }

  ShowNotification(errors, errors_fields);
  if (errors.length > 0) {
    return false;
  }

  if (record_id) {
    ShowSpinButton('button_update_' + record_id);
  } else {
    ShowSpinButton('button_sendpulse_link');
  }

  xajax_SaveSendPulseIntegration(api_key, secret_key, staff_access, itype, record_id);
}

function SaveRetailCRMIntegration(form, record_id) {
  var api_key = form['api_key'].value;
  var domain = form['domain'].value;
  var email = form['email'].value;
  //тип отображения интеграции, 1 - в общей панели, 2 - в отдельной панели
  var itype = form['itype'].value;
  var staff_access = $('#staff_access_' + record_id).val() || $('#staff_access_retailcrm').val() || [];

  var errors = [];
  var errors_fields = [];

  if (api_key.length === 0) {
    errors_fields.push(form['api_key'].id);
  }

  if (domain.length === 0) {
    errors_fields.push(form['domain'].id);
  }

  if (email.length === 0) {
    errors_fields.push(form['email'].id);
  }

  if (staff_access.length === 0) {
    errors_fields.push(form['staff_access[]'].id);
    errors.push('INTEGRATION_ERROR_EMPTY_STAFF_ACCESS');
  } else {
    for (var i = 0; i < staff_access.length; i++) {
      if (false === /^(-\d+)|(\d+(:\d)?)|(g:\d+(:\d)?)$/i.test(staff_access[i])) {
        errors_fields.push(form['staff_access[]'].id);
        errors.push('INTEGRATION_ERROR_INCORRECT_STAFF_ACCESS');
        errors.push('staff_access[' + i + '] = ' + staff_access[i]);
        break;
      }
    }
  }

  if (errors_fields.length) {
    errors.push('INTEGRATION_ERROR_EMPTY');
  }

  ShowNotification(errors, errors_fields);
  if (errors.length > 0) {
    return false;
  }

  if (record_id) {
    ShowSpinButton('button_update_' + record_id);
  } else {
    ShowSpinButton('button_retailcrm_link');
  }

  xajax_SaveRetailCRMIntegration(domain, api_key, email, staff_access, itype, record_id);
}

function SaveChatApiIntegration(form, record_id) {
  var addrecord_id = function (record_id) {
    return (record_id ? '_' + record_id : '');
  };

  var secret_key = form['secret_key'].value;
  var token = form['chatapi_token' + addrecord_id(record_id)].value;
  var api_url = form['chatapi_api_url' + addrecord_id(record_id)].value;
  var name = form['chatapi_name' + addrecord_id(record_id)].value;
  var group_id = form['chatapi_group_id' + addrecord_id(record_id)].value;
  // var staff_id   = form['chatapi_staff_id' + addrecord_id(record_id)].value;
  var phone = form['chatapi_phone' + addrecord_id(record_id)].value;
  var ignore_old = $('#chatapi_ignore_old' + addrecord_id(record_id)).prop('checked')
  ;
  ignore_old = typeof ignore_old !== 'undefined' ? ignore_old : false;

  // var secret_key = '';
  // if($('#chatapi_secret_key' + addrecord_id(record_id)).length) {
  //     secret_key   = form['chatapi_secret_key' + addrecord_id(record_id)].value;
  // }
  //
  // var number   = '';
  // if($('#chatapi_number' + addrecord_id(record_id)).length) {
  //     number   = form['chatapi_number' + addrecord_id(record_id)].value;
  // }

  var errors = [];
  var errors_fields = [];

  if (api_url.length === 0) {
    errors_fields.push(form['chatapi_api_url' + addrecord_id(record_id)].id);
  }

  if (token.length === 0) {
    errors_fields.push(form['chatapi_token' + addrecord_id(record_id)].id);
  }

  // if(!$('#chatapi_number' + addrecord_id(record_id)).length || number.length === 0) {
  //     errors_fields.push('chatapi_number' + addrecord_id(record_id));
  // }

  // if(!$('#chatapi_secret_key' + addrecord_id(record_id)).length || secret_key.length === 0) {
  //     errors_fields.push('chatapi_secret_key' + addrecord_id(record_id));
  // }

  if (group_id.length === 0 || !Number(group_id)) {
    errors_fields.push('chatapi_group_id' + addrecord_id(record_id));
  }

  // if(staff_id.length === 0 || !Number(staff_id)) {
  //     errors_fields.push('chatapi_staff_id' + addrecord_id(record_id));
  // }

  if (phone.length === 0) {
    errors_fields.push(form['chatapi_phone' + addrecord_id(record_id)].id);
  }

  if (errors_fields.length) {
    errors.push('INTEGRATION_ERROR_EMPTY');
  }

  ShowNotification(errors, errors_fields);
  if (errors.length > 0) {
    return false;
  }

  if (record_id) {
    ShowSpinButton('button_update_' + record_id);
  } else {
    ShowSpinButton('button_chatapi_link');
  }

  // console.log(api_url, token, name, phone, group_id, staff_id, ignore_old, secret_key, number, record_id);
  xajax_SaveChatApiIntegration(api_url, token, name, phone, group_id, 0, ignore_old, secret_key, record_id);
}
function SaveWazzupApiIntegration(form, record_id) {
  var addrecord_id = function (record_id) {
    return (record_id ? '_' + record_id : '');
  };

  var secret_key = form['secret_key'].value;
  var token = form['wazzup_token' + addrecord_id(record_id)].value;
  var name = form['wazzup_name' + addrecord_id(record_id)].value;
  var group_channel = form['group_channel' + addrecord_id(record_id)];

  var errors = [];
  var errors_fields = [];

  if (token.length === 0) {
    errors_fields.push(form['wazzup_token' + addrecord_id(record_id)].id);
  }

  if (errors_fields.length) {
    errors.push('INTEGRATION_ERROR_EMPTY');
  }

  ShowNotification(errors, errors_fields);
  if (errors.length > 0) {
    return false;
  }
  var group_ids = {};
  if(group_channel.length)
  {
    $(group_channel).each(function(index)
    {
      var channel_name = $(this).attr('name').replace('group_channel[', '').replace(']', '');
      group_ids[channel_name] = $(this).val();
    });
  }
  if (record_id) {
    ShowSpinButton('button_update_' + record_id);
  } else {
    ShowSpinButton('button_wazzup_link');
  }

  xajax_SaveWazzupApiIntegration(token, name, group_ids, secret_key, record_id);
}
function SaveAcebotIntegration(form, record_id) {
    var addrecord_id = function (record_id) {
        return (record_id ? '_' + record_id : '');
    };

    var secret_key = form['secret_key'].value;
    var token      = form['acebot_token' + addrecord_id(record_id)].value;
    var pass       = form['acebot_pass' + addrecord_id(record_id)].value;
    var name       = form['acebot_name' + addrecord_id(record_id)].value;
    var group_id   = form['acebot_group_id' + addrecord_id(record_id)].value;
    var phone      = '';//form['phone' + addrecord_id(record_id)].value;

    var errors = [];
    var errors_fields = [];

    if (pass.length === 0) {
        errors_fields.push(form['pass' + addrecord_id(record_id)].id);
    }

    if (token.length === 0) {
        errors_fields.push(form['token' + addrecord_id(record_id)].id);
    }


    if (group_id.length === 0 || !Number(group_id)) {
        errors_fields.push('group_id' + addrecord_id(record_id));
    }


    // if (phone.length === 0) {
    //     errors_fields.push(form['phone' + addrecord_id(record_id)].id);
    // }

    if (errors_fields.length) {
        errors.push('INTEGRATION_ERROR_EMPTY');
    }

    ShowNotification(errors, errors_fields);
    if (errors.length > 0) {
        return false;
    }

    if (record_id) {
        ShowSpinButton('button_update_' + record_id);
    } else {
        ShowSpinButton('button_acebot_link');
    }

    xajax_SaveAcebotIntegration( name, pass, token, phone, group_id, secret_key, record_id);
}

function ShowChatApiStaffs(value, form_id) {
  xajax_ShowChatApiStaffs(value, form_id);
}

function AddChatApiStaffsList(html, integration_id) {
  $('.chatapi_staff_ids' + (Number(integration_id) ? '_' + integration_id : '')).html(html);
  $('.chatapi_staff_ids' + (Number(integration_id) ? '_' + integration_id : '')).find('select').selectmenu();
}

function GetChatApiWebhook(form, record_id) {
  // УДАЛИТЬ //
  var token = form['chatapi_token'].value;
  var api_url = form['chatapi_api_url'].value;

  var errors = [];
  var errors_fields = [];

  if (api_url.length === 0) {
    errors_fields.push(form['chatapi_api_url'].id);
  }

  if (token.length === 0) {
    errors_fields.push(form['chatapi_token'].id);
  }

  if (errors_fields.length) {
    errors.push('INTEGRATION_ERROR_EMPTY');
  }

  ShowNotification(errors, errors_fields);
  if (errors.length > 0) {
    return false;
  }

  xajax_GetChatApiWebhook(api_url, token);
}

function SaveDropboxIntegration(form, record_id) {
  var PUBLIC_ACCOUNT = 0;
  var PRIVATE_ACCOUNT = 1;

  var secret_key = null;
  if ($(form).find('[name="secret_key"]').length > 0) {
    secret_key = form['secret_key'].value;
  }

  var access_token = null;
  if ($(form).find('[name="access_token"]').length > 0) {
    access_token = form['access_token'].value;
  }
  var public_key = form['public_key'].value;
  var chooser_type = $(form).find('.active').data('value');

  var errors = [];
  var errors_fields = [];

  if (chooser_type.length === 0) {
    errors_fields.push(form['chooser_type'].id);
  }

  if (public_key.length === 0) {
    errors_fields.push(form['public_key'].id);
  }

  if (chooser_type === PUBLIC_ACCOUNT && secret_key !== null && secret_key.length === 0) {
    errors_fields.push(form['secret_key'].id);
  }

  if (chooser_type === PUBLIC_ACCOUNT && access_token !== null && access_token.length === 0) {
    errors_fields.push(form['access_token'].id);
  }

  if (errors_fields.length) {
    errors.push('INTEGRATION_ERROR_EMPTY');
  }

  ShowNotification(errors, errors_fields);
  if (errors.length > 0) {
    return false;
  }

  if (record_id) {
    ShowSpinButton('button_update_' + record_id);
  } else {
    ShowSpinButton('button_dropbox_link');
  }

  xajax_SaveDropboxIntegration(public_key, secret_key, access_token, chooser_type, record_id);
}

function SaveYandexDiskIntegration(form, record_id) {
  var PUBLIC_ACCOUNT = 0;
  var PRIVATE_ACCOUNT = 1;

  var password = form['password'].value;
  var public_key = form['public_key'].value;
  var chooser_type = $(form).find('.active').data('value');

  var errors = [];
  var errors_fields = [];

  if (chooser_type.length === 0) {
    errors_fields.push(form['chooser_type'].id);
  }

  if (public_key.length === 0) {
    errors_fields.push(form['public_key'].id);
  }

  if (password.length === 0) {
    errors_fields.push(form['password'].id);
  }

  if (errors_fields.length) {
    errors.push('INTEGRATION_ERROR_EMPTY');
  }

  ShowNotification(errors, errors_fields);
  if (errors.length > 0) {
    return false;
  }

  if (record_id) {
    ShowSpinButton('button_update_' + record_id);
  } else {
    ShowSpinButton('button_yandexdisk_link');
  }

  var code = null;
  if (Number(chooser_type) === PUBLIC_ACCOUNT) {
    var authUrl = 'https://oauth.yandex.ru/authorize'
      + '?response_type=code'
      + '&force_confirm=true'
      + '&client_id=' + public_key;

    var newWin = window.open(
      authUrl,
      Translate('integrations_c/yadisk_title'),
      'width=600,height=400'
    );

    var timer = null;

    timer = setInterval(function () {
      if (typeof newWin.yandexDiskCode !== 'undefined' && newWin.yandexDiskCode) {
        clearInterval(timer);
        code = newWin.yandexDiskCode;
        newWin.close();

        xajax_SaveYandexDiskIntegration(public_key, password, code, chooser_type, record_id);
      }
    }, 1000);
  } else {
    xajax_SaveYandexDiskIntegration(public_key, password, code, chooser_type, record_id);
  }
}

function SaveGoogleDriveIntegration(form, record_id) {
  var PUBLIC_ACCOUNT = 0;
  var PRIVATE_ACCOUNT = 1;

  var project_number = form['project_number'].value;
  var client_id = form['client_id'].value;
  var public_key = form['public_key'].value;
  var secret_key = form['secret_key'].value;
  var chooser_type = $(form).find('.active').data('value');

  var errors = [];
  var errors_fields = [];

  if (chooser_type.length === 0) {
    errors_fields.push(form['chooser_type'].id);
  }

  if (public_key.length === 0) {
    errors_fields.push(form['public_key'].id);
  }

  if (project_number.length === 0) {
    errors_fields.push(form['project_number'].id);
  }

  if (client_id.length === 0) {
    errors_fields.push(form['client_id'].id);
  }

  if (errors_fields.length) {
    errors.push('INTEGRATION_ERROR_EMPTY');
  }

  ShowNotification(errors, errors_fields);
  if (errors.length > 0) {
    return false;
  }

  if (record_id) {
    ShowSpinButton('button_update_' + record_id);
  } else {
    ShowSpinButton('button_googledrive_link');
  }

  var code = null;
  if (Number(chooser_type) === PUBLIC_ACCOUNT) {
    var authUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
      + '?scope=https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata'
      + '&access_type=offline'
      + '&prompt=consent'
      + '&include_granted_scopes=true'
      + '&state=state_parameter_passthrough_value'
      + '&redirect_uri=' + String(document.location.origin) + '/admin/settings/integrations/googledrive/get'
      + '&response_type=code'
      + '&client_id=' + client_id;
    var newWin = window.open(
      authUrl,
      Translate('integrations_new_record/googledrive'),
      'width=600,height=400'
    );

    var timer = null;

    timer = setInterval(function () {
      if (typeof newWin.googleDriveCode !== 'undefined' && newWin.googleDriveCode) {
        clearInterval(timer);
        code = newWin.googleDriveCode;
        newWin.close();

        xajax_SaveGoogleDriveIntegration(public_key, project_number, client_id, secret_key, code, chooser_type, record_id);
      }
    }, 1000);
  } else {
    xajax_SaveGoogleDriveIntegration(public_key, project_number, client_id, secret_key, code, chooser_type, record_id);
  }
}

function SaveOneDriveIntegration(form, record_id) {
  var PUBLIC_ACCOUNT = 0;
  var PRIVATE_ACCOUNT = 1;

  var secret_key = null;
  if ($(form).find('[name="secret_key"]').length > 0) {
    secret_key = form['secret_key'].value;
  }

  var public_key = form['public_key'].value;
  var chooser_type = $(form).find('.active').data('value');

  var errors = [];
  var errors_fields = [];

  if (chooser_type.length === 0) {
    errors_fields.push(form['chooser_type'].id);
  }

  if (public_key.length === 0) {
    errors_fields.push(form['public_key'].id);
  }

  if (chooser_type === PUBLIC_ACCOUNT && secret_key !== null && secret_key.length === 0) {
    errors_fields.push(form['secret_key'].id);
  }

  if (errors_fields.length) {
    errors.push('INTEGRATION_ERROR_EMPTY');
  }

  ShowNotification(errors, errors_fields);
  if (errors.length > 0) {
    return false;
  }

  if (record_id) {
    ShowSpinButton('button_update_' + record_id);
  } else {
    ShowSpinButton('button_onedrive_link');
  }

  var code = null;
  if (Number(chooser_type) === PUBLIC_ACCOUNT) {
    var oauthUrl = 'https://login.live.com/oauth20_authorize.srf'
      + '?client_id=' + String(public_key)
      + '&scope=offline_access,files.readwrite.all'
      + '&response_type=code'
      + '&prompt=login'
      + '&redirect_uri=' + String(document.location.origin) + '/admin/settings/integrations/onedrive/get';

    var newWin = window.open(
      oauthUrl,
      Translate('integrations_new_record/onedrive'),
      'width=600,height=400'
    );

    var timer = null;

    timer = setInterval(function () {
      if (typeof newWin.oneDriveCode !== 'undefined' && newWin.oneDriveCode) {
        clearInterval(timer);
        code = newWin.oneDriveCode;
        newWin.close();

        xajax_SaveOneDriveIntegration(public_key, secret_key, code, chooser_type, record_id);
      }
    }, 1000);
  } else {

    xajax_SaveOneDriveIntegration(public_key, secret_key, code, chooser_type, record_id);
  }
}

function SaveChatraIntegration(form, record_id) {
  var group_id = form['group'].value;
  var itype = form['itype'].value;
  var chatra_groups = [];
  var omni_groups = [];
  var link_groups = {};
  for (var i = 0; i < form.elements.length; i++) {
    if ($(form.elements[i]).attr('name') && $(form.elements[i]).attr('name').match(/^chatra_groups\[/)) {
      chatra_groups.push(form.elements[i].value)
    }
    if ($(form.elements[i]).attr('name') && $(form.elements[i]).attr('name').match(/^omni_groups\[/)) {
      omni_groups.push(form.elements[i].value)
    }
  }
  for (var i = 0; i < chatra_groups.length; i++) {
    if (chatra_groups[i].length && omni_groups[i] && parseInt(omni_groups[i])) {
      link_groups[chatra_groups[i].trim()] = parseInt(omni_groups[i]);
    }
  }


  //
  // var errors = [];
  // var errors_fields = [];
  //
  // if(public_apikey.length == 0) {
  //     errors_fields.push(form['public_apikey'].id);
  // }
  // if(private_apikey.length == 0) {
  //     errors_fields.push(form['private_apikey'].id);
  // }
  //
  // if( errors_fields.length ){
  //     errors.push('INTEGRATION_ERROR_EMPTY');
  // }
  // ShowNotification(errors, errors_fields);
  // if(errors.length>0) {
  //     return false;
  // }

  if (record_id)
    ShowSpinButton('button_update_' + record_id);
  else
    ShowSpinButton('button_chatra_link');
  xajax_SaveChatraIntegration(group_id, link_groups, itype, record_id);
}

function SaveCqIntegration(form, record_id) {
  var group_id = form['group'].value;
  var itype = 0;//form['itype'].value;

  if (record_id)
    ShowSpinButton('button_update_' + record_id);
  else
    ShowSpinButton('button_chatra_link');
  xajax_SaveCqIntegration(group_id, itype, record_id);
}

function ValidateItoolabsIntegration(form, b_notify) {
  var url = form['url'].value;
  var key = form['key'].value;
  // var secret_key = form['secret_key'].value;
  // var itype      = form['itype'].value;
  // var group_id   = form['group'].value;
  var staff_agent = {};
  var b_empty_agents = false;
  var cnt_staff_agent = 0;
  for (var i = 0; i < form.elements.length; i++) {
    if ($(form.elements[i]).attr('name')
      && $(form.elements[i]).attr('name').match(/^staff_agent\[/)) {
      staff_agent[$(form.elements[i]).attr('name').replace('staff_agent[', '').replace(']', '')] = $(form.elements[i]).val();
      // if($(form.elements[i]).val())
      // {
      //     b_empty_agents = true;
      // }
      // else
      // {
      cnt_staff_agent++;
      // }
    }
  }
  if (!cnt_staff_agent) {
    b_empty_agents = true;
  }

  var errors = [];
  var errors_fields = [];

  if (url.length == 0) {
    errors_fields.push(form['url'].id);
  }
  if (key.length == 0) {
    errors_fields.push(form['key'].id);
  }
  if (b_empty_agents) {
    errors_fields.push('staff_agent');
  }

  if (errors_fields.length) {
    errors.push('INTEGRATION_ERROR_EMPTY');
  }
  if (b_notify) {
    ShowNotification(errors, errors_fields);
  }
  if (errors.length > 0) {
    $(form).find('input[type=submit]').attr('disabled', 'disabled').addClass('dsbld');
    return false;
  }
  $(form).find('input[type=submit]').removeAttr('disabled').removeClass('dsbld');
  return true;
}

function ValidateMangoIntegration(form, b_notify) {
  var sign = form['sign'].value;
  var key = form['key'].value;
  // var secret_key = form['secret_key'].value;
  // var itype      = form['itype'].value;
  // var group_id   = form['group'].value;
  var staff_agent = {};
  var b_empty_agents = false;
  var cnt_staff_agent = 0;
  for (var i = 0; i < form.elements.length; i++) {
    if ($(form.elements[i]).attr('name')
      && $(form.elements[i]).attr('name').match(/^staff_agent\[/)) {
      staff_agent[parseInt($(form.elements[i]).attr('name').replace('staff_agent[', ''))] = $(form.elements[i]).val();
      if (!parseInt($(form.elements[i]).val())) {
        b_empty_agents = true;
      } else {
        cnt_staff_agent++;
      }
    }
  }
  if (!cnt_staff_agent) {
    b_empty_agents = true;
  }

  var errors = [];
  var errors_fields = [];

  if (sign.length == 0) {
    errors_fields.push(form['sign'].id);
  }
  if (key.length == 0) {
    errors_fields.push(form['key'].id);
  }
  if (b_empty_agents) {
    errors_fields.push('staff_agent');
  }

  if (errors_fields.length) {
    errors.push('INTEGRATION_ERROR_EMPTY');
  }
  if (b_notify) {
    ShowNotification(errors, errors_fields);
  }
  if (errors.length > 0) {
    $(form).find('input[type=submit]').attr('disabled', 'disabled').addClass('dsbld');
    return false;
  }
  $(form).find('input[type=submit]').removeAttr('disabled').removeClass('dsbld');
  return true;
}

function ValidateUiscomIntegration(form, b_notify) {
  var key = (form['key']||form['url']).value;
  // var secret_key = form['secret_key'].value;
  // var itype      = form['itype'].value;
  // var group_id   = form['group'].value;
  var staff_agent = {};
  var b_empty_agents = false;
  var cnt_staff_agent = 0;
  for (var i = 0; i < form.elements.length; i++) {
    if ($(form.elements[i]).attr('name')
      && $(form.elements[i]).attr('name').match(/^staff_agent\[/)) {
      staff_agent[parseInt($(form.elements[i]).attr('name').replace('staff_agent[', ''))] = $(form.elements[i]).val();
      if (!parseInt($(form.elements[i]).val())) {
        b_empty_agents = true;
      } else {
        cnt_staff_agent++;
      }
    }
  }
  if (!cnt_staff_agent) {
    b_empty_agents = true;
  }

  var errors = [];
  var errors_fields = [];

  if(form['url'] && form['url'].value.length == 0)
  {
      errors_fields.push(form['url'].id);
  }
  if (key.length == 0 && form['key']) {
    errors_fields.push(form['key'].id);
  }
  if (b_empty_agents) {
    errors_fields.push('staff_agent');
  }

  if (errors_fields.length) {
    errors.push('INTEGRATION_ERROR_EMPTY');
  }
  if (b_notify) {
    ShowNotification(errors, errors_fields);
  }
  if (errors.length > 0) {
    $(form).find('input[type=submit]').attr('disabled', 'disabled').addClass('dsbld');
    return false;
  }
  $(form).find('input[type=submit]').removeAttr('disabled').removeClass('dsbld');
  return true;
}

function SaveItoolabsIntegration(form, record_id) {

  if (ValidateItoolabsIntegration(form, true)) {
    var url = form['url'].value;
    var key = form['key'].value;
    var secret_key = form['secret_key'].value;
    var itype = form['itype'].value;
    var group_id = form['group'].value;
    var integration_type = form['integration_type'].value;
    var disable_sip = 1;//form['disable_sip'].checked;
    staff_agent = {};
    for (var i = 0; i < form.elements.length; i++) {
      if ($(form.elements[i]).attr('name')
        && $(form.elements[i]).attr('name').match(/^staff_agent\[/)) {
        staff_agent[$(form.elements[i]).attr('name').replace('staff_agent[', '').replace(']', '')] = $(form.elements[i]).val();
      }
    }
    if (record_id)
      ShowSpinButton('button_update_' + record_id);
    else
      ShowSpinButton('button_gravitel_link');
    xajax_SaveItoolabsIntegration(integration_type, url, key, secret_key, group_id, staff_agent, disable_sip, itype, record_id);
  }
  return false;
}

function SaveMangoOfficeIntegration(form, record_id) {
  if (ValidateMangoIntegration(form, true)) {
    var key = form['key'].value;
    var sign = form['sign'].value;
    var secret_key = form['secret_key'].value;
    var itype = form['itype'].value;
    var group_id = form['group'].value;
    var disable_sip = form['disable_sip'].checked;
    staff_agent = {};
    for (var i = 0; i < form.elements.length; i++) {
      if ($(form.elements[i]).attr('name')
        && $(form.elements[i]).attr('name').match(/^staff_agent\[/)) {
        staff_agent[parseInt($(form.elements[i]).attr('name').replace('staff_agent[', ''))] = $(form.elements[i]).val();
      }
    }
    if (record_id)
      ShowSpinButton('button_update_' + record_id);
    else
      ShowSpinButton('button_mango_office_link');
    xajax_SaveMangoOfficeIntegration(key, sign, secret_key, group_id, staff_agent, disable_sip, itype, record_id);
  }
}

function SaveUisComIntegration(type_integration, form, record_id) {
    if (ValidateUiscomIntegration(form, true)) {
        var key = form['key'].value;
        var secret_key = form['secret_key'].value;
        var itype = form['itype'].value;
        var group_id = form['group'].value;
        var disable_sip = form['disable_sip'].checked;
        if (!type_integration) {
            type_integration = form['integration_type'].value;
        }
        staff_agent = {};
        for (var i = 0; i < form.elements.length; i++) {
            if ($(form.elements[i]).attr('name')
                && $(form.elements[i]).attr('name').match(/^staff_agent\[/)) {
                staff_agent[parseInt($(form.elements[i]).attr('name').replace('staff_agent[', ''))] = $(form.elements[i]).val();
            }
        }
        if (record_id)
            ShowSpinButton('button_update_' + record_id);
        else
            ShowSpinButton('button_' + type_integration + '_link');
        xajax_SaveUisComIntegration(type_integration, key, secret_key, group_id, staff_agent, disable_sip, itype, record_id);
    }
}
function SaveAsteriskIntegration(form, record_id) {
    if (ValidateUiscomIntegration(form, true)) {
        var login = form['login'].value;
        var password = form['passwd'].value;
        var url = form['url'].value;
        var port = form['port'].value;

        var secret_key = form['secret_key'].value;
        var itype = form['itype'].value;
        var group_id = form['group'].value;
        var disable_sip = form['disable_sip'].checked;
        staff_agent = {};
        for (var i = 0; i < form.elements.length; i++) {
            if ($(form.elements[i]).attr('name')
                && $(form.elements[i]).attr('name').match(/^staff_agent\[/)) {
                staff_agent[parseInt($(form.elements[i]).attr('name').replace('staff_agent[', ''))] = $(form.elements[i]).val();
            }
        }
        if (record_id)
            ShowSpinButton('button_update_' + record_id);
        else
            ShowSpinButton('button_asterisk_link');
        xajax_SaveAsteriskIntegration(login,password,url, port, secret_key, group_id, staff_agent, disable_sip, itype, record_id);
    }
}

function SaveYouScanIntegration(form, record_id) {
    var secret_key = form['secret_key'].value;
    var itype = form['itype'].value;
    var group_id = form['group'].value;
    var title = form['title'].value;
    // var staff_access = $('#staff_access_' + record_id).val() || $('#staff_access_youscan').val() || [];

    var errors = [];
    var errors_fields = [];

    if (!title.length) {
        return false;
    }

    // if (staff_access.length === 0) {
    //     errors_fields.push(form['staff_access[]'].id);
    //     errors.push('INTEGRATION_ERROR_EMPTY_STAFF_ACCESS');
    // } else {
    //     for (var i = 0; i < staff_access.length; i++) {
    //         if (false === /^(-\d+)|(\d+(:\d)?)|(g:\d+(:\d)?)$/i.test(staff_access[i])) {
    //             errors_fields.push(form['staff_access[]'].id);
    //             errors.push('INTEGRATION_ERROR_INCORRECT_STAFF_ACCESS');
    //             errors.push('staff_access[' + i + '] = ' + staff_access[i]);
    //             break;
    //         }
    //     }
    // }

    if (errors_fields.length) {
        errors.push('INTEGRATION_ERROR_EMPTY');
    }
    ShowNotification(errors, errors_fields);
    if (errors.length > 0) {
        return false;
    }

    if (record_id)
        ShowSpinButton('button_update_' + record_id);
    else
        ShowSpinButton('button_youscan_link');
    xajax_SaveYouScanIntegration(record_id,title, group_id, itype,  secret_key);
}

function SaveAvitoIntegration(form, record_id) {
  var addrecord_id = function (record_id) {
    return (record_id ?  record_id : '');
  };

  var secret_key = form['secret_key'].value;
  // var client_id = form['client_id_' + addrecord_id(record_id)].value;
  // var client_secret = form['client_secret_' + addrecord_id(record_id)].value;
  var name = form['avito_title_' + addrecord_id(record_id)].value;
  var group_id = form['avito_group_id_' + addrecord_id(record_id)].value;
  var itype = form['itype'].value;

  var errors = [];
  var errors_fields = [];

  // if (client_id.length === 0) {
  //   errors_fields.push(form['client_id_' + addrecord_id(record_id)].id);
  // }
  //
  // if (client_secret.length === 0) {
  //   errors_fields.push(form['client_secret_' + addrecord_id(record_id)].id);
  // }

  if (group_id.length === 0 || !Number(group_id)) {
    errors_fields.push('avito_group_id_' + addrecord_id(record_id));
  }

  if (name.length === 0) {
    errors_fields.push(form['avito_title_' + addrecord_id(record_id)].id);
  }

  if (errors_fields.length) {
    errors.push('INTEGRATION_ERROR_EMPTY');
  }

  ShowNotification(errors, errors_fields);
  if (errors.length > 0) {
    return false;
  }

  if (record_id) {
    ShowSpinButton('button_update_' + record_id);
  } else {
    ShowSpinButton('button_avito_link');
  }

  xajax_SaveAvitoIntegration(record_id,secret_key,name,group_id,itype);
}


/**
 * Набор отборнейших костылей срабатывающих по клику на икону "Редактировать"
 * @param element - это $(this) из jQ
 */
function showIntegrations(element) {
  // Костыль заключается в том, что некоторым селектам в интеграции нужен другой флаг при ините choices
  // и дополнительно навешивать класс на одну опцию
  const form = document.querySelector(element)
  const select = Array.from(form.querySelectorAll(`[name*="staff_agent"],[name*="group_channel"]`))
  if (!select.length) return

  choicesInit(select, {
    searchEnabled: true,
    searchResultLimit: 9999,
    shouldSort: false,
    itemSelectText: '',
    noResultsText: Translate('alpha20_js/no_results'),
    noChoicesText: Translate('alpha20_js/no_variants')
  });
  InitNanoScrolls(""); // кастомный скролл

  form.addEventListener("click", () => clickSelect(element))
  form.addEventListener("change", () => clickSelect(element))
  clickSelect(element)
}

// ф-ция прокладка между xAjaxCall и showIntegrations
function setIntegration(e) {
  const element = e.target.closest(".integrations_itoolabs")

  // В DOM есть интеграция с невалидным селектором. Если это он - заменяем
  if (element && element.getAttribute("class").includes("2090909_integration")) {
    const string = element.getAttribute("class")
    const newClass = string.replace('2090909_integration', 'el-city')
    element.setAttribute("class", newClass)
  }


  if(element){
    const classs = `.${Object.values(element.classList).join('.')}`
    InitNanoScrolls("")
    showIntegrations(classs)
  }
}

// навешиваем класс на опцию
function clickSelect(element) {
  const target = document.querySelector(element)

  const option = target.querySelectorAll(`[data-value="-1"]`)
  option.forEach(e => e.classList.add("-tomato"))
}
