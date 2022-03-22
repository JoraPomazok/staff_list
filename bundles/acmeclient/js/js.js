var current_email_focus = 'subject';
var request_sent = false;
var b_nice_els_only_visible = false;
var b_event_inited = false;
/**
 * defaultChoiesInit - тут храним иниты селектов из ф-ций init_nice_elements() и choicesInit() на случай,
 * если нам нужно убить инстанс селекта и заинитить заново с новыми параментами или опциями, например.
 * Убивать нужно только конкретный инит иначе отвалятся лишние селекты, найти нужный можно по ID или NAME у селекта.
 */
let defaultChoiesInit = {};


$(document).ready(function () {
    $(document).on('click', 'li.b_dark_theme a', function () {
        if ($(this).hasClass('dark')) {
            $(this).removeClass('dark');
            xajax_SetDarkTheme(0);
        } else {
            $(this).addClass('dark');
            xajax_SetDarkTheme(1);
        }
    });
    $(document).on('click', '#welcoming_popup a.js-change-theme', function () {
        xajax_SetDarkTheme($(this).attr('rel'),b_new_client);
    });

  $('.disabled-href').click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

  // middle wrapper
  function getPosLine() {
    if ($('.middle .wrapper').length) {
      var offsetMiddle = $('.middle .wrapper').offset();
      $('.v_line').css('left', offsetMiddle.left);
    }
  }

  getPosLine();
  $(window).resize(function () {
    getPosLine();
  });

  //show hide settigs
  init_start_settings();
  init_add_settings();

  (function () {
    const main = document.querySelector("main.sla__wrapper") ||
      document.querySelector("main.notification_emails__wrapper") ||
      document.querySelector("main.settings-rating__wrapper") ||
      document.querySelector("main.staffs_activities__wrap") ||
      document.querySelector("main.settings-integrations__wrapper") ||
      document.querySelector("main.stat_leaderboard__wrap")

    if (main) return
    init_nice_elements(); // инитим селекты
    InitNanoScrolls(""); // кастомный скролл
  })();

  offOn();
  profileLogout();
  if (typeof init_create_record == 'function') {
    init_create_record();
  }
  if (typeof init_update_record == 'function') {
    init_update_record('');
  }

  //additional properties for jQuery object
  //align element in the middle of the screen
  $.fn.alignCenter = function () {
    //get margin left
    var marginLeft = -$(this).width() / 2 + 'px';
    //get margin top
    var marginTop = $(document).scrollTop() - $(this).height() / 2 + 'px';
    //return updated element
    return $(this).css({
      'margin-left': marginLeft,
      'margin-top': marginTop
    });
  };

  $.fn.togglePopup = function () {
    let init;
    //detect whether popup is visible or not

    setTimeout(() => {
      init = choicesInit(`#popup select`, {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
      });
    }, 1)
    if ($('#popup').hasClass('hidden')) {
      //hidden - then display
      // document.body.style.overflow = 'hidden';

      $('#opaco').height($(document).height()).toggleClass('hidden').fadeTo('slow')
        .click(function () {
          $(this).togglePopup();
        });

      $('#popup')
        .html($(this).html())
        .alignCenter()
        .toggleClass('hidden');
      InitNanoScrolls("#popup")
      document.body.style.overflow = 'hidden'
    } else {
      //visible - then hide
      $('#opaco').toggleClass('hidden').removeAttr('style').unbind('click');
      $('#popup').toggleClass('hidden');
      document.body.style.overflow = '';
    }
    $('.popupClose').click(function () {
      $.fn.togglePopup();
      init[0] ? init[0].destroy() : null// убиваем инит селекта
    });
  };

  $('.reset-form').click(function () {
    var li_id = $(this).closest('li').attr('id');
  });

  //notifications
  $(document).on('click', '.notifications .n_close', function () {
    var notification_id = $(this).closest('.noti_wrap').attr('id');
    if (notification_id) {
      if (notification_id == 'NOTIFICATION_CLIENT') {
        xajax_NotificationClose('client');
      } else if (notification_id.match(/NOTIFICATION_(\d*)/)) {
        var notification_id = notification_id.match(/NOTIFICATION_(\d*)/)[1];
        xajax_NotificationClose(notification_id);
      }
    }
    $(this).parent().fadeOut();
    setTimeout('hideBlock()', 450);
    return false;
  });

  hideBlock();

  $('input').on('focus', function () {
    if ($(this).hasClass('border-error')) {
      $(this).removeClass('border-error');
    }
  });

  CheckAgTitle();

  $('.tell-about-vk').click(function () {
    $('#vk_info').togglePopup();
    return false;
  });

  $(document).on('change, input, keyup', '.vk-info', function () {
    var new_value = $.trim($(this).val());
    if (new_value) {
      var disable_button = false;
    } else {
      var disable_button = true;
    }
    $(this).closest('.fiedlsRow').find('.btn-primary').attr('disabled', disable_button);
  });

  if ($.browser.mozilla) {
    $('body').addClass('mozilla');
  }
  if ($.browser.webkit) {
    $('body').addClass('webkit')
  }
  if ($.browser.chrome) {
    $('body').addClass('chrome')
  }
  if ($.browser.safari) {
    $('body').addClass('safari')
  }
  if ($.browser.mac) {
    $('body').addClass('mac')
  }
  if ($.browser.win) {
    $('body').addClass('win')
  }
  if ($.browser.linux) {
    $('body').addClass('lin')
  }
  if ($.browser.iphone) {
    $('body').addClass('iphone');
  }
  if ($.browser.msie) {
    $('body').addClass('ie');
  }

  InitModalWindows();

  setInterval(function () {
    if (!window.b_ajax_check_notifications) {
      return false;
    }
    var b_reload = window.location.href.match(/\/team\/staff\//) ? 1 : 0;
    var b_reload = window.location.href.match(/\/channels\/groups\//) ? 2 : b_reload;
    $.ajax({
      url: '/admin/ajax_check_notifications?b_reload=' + b_reload,
      cache: false,
      success: function (response) {
        if (response.length) {
          if (b_reload) {
            window.location.reload();
            b_ajax_check_notifications = 0;
            return false;
          }
          for (var i in response) {
            $('div.notifications > .wrapper')
              .append('<div class="noti_wrap n_green" id="NOTIFICATION_CLIENT" style="display: block; "><div class="text">' + response[i] + '</div><i class="icon fas fa-check-circle"></i><a href="#" class="n_close"><i class="icon fa fa-times"></i></a></div>');
            $('div.notifications').fadeIn();
          }
          b_ajax_check_notifications = 0;
        }
      }
    });
  }, 2000);
  $(document).on('submit', 'form', function (e) {

    var s = $('form').serializeArray(),
      d = [];
    for (var i in s) {
      d.push(s[i]['value'])
    }
    $(this).append('<input type="hidden" name="_csrf_token" value=""/>');
  });
  $(document).on('click', '.notify_note_staff li a', function () {
    // e.stopPropagation();
    var id = $(this).parent().attr('rel');
    var name = $(this).clone();

    name.find('div').remove();

    name = name.html();
    ReplaceResponseNotify('@' + GetResponseNotify(), '<notify rel="' + id + '">' + (id.substring(0, 1) == 'g' ? '@' : '') + $.trim(name) + '</notify>');
    // xajax_CheckAccessMention(CurrentCaseId,id,name);
    return false;
  });
  // const submin = document.querySelector("")

  $('.gSettings .a20_color li').on('click', function () {
    $(this).siblings().html('');
    $(this).html('<i class="fa fa-check"></i>');

    $('.gSettings .customLogo .u_logo .pic').attr('data-color', $(this).attr('data-value'))
    xajax_UpdateTheme($(this).attr('data-value'))
  });
  $(document).on('click', '.js-open-icons', function (e) {
    e.preventDefault();
    let iconBlock = $(this).parents('.form_item_icon_wrap').find('.form_item_icon_content');
    iconBlock.is(':visible') ? iconBlock.hide() : iconBlock.show();
    $('.nano_icon_content').nanoScroller({alwaysVisible: true});
    $(this).parents('.form_item_icon_wrap').find('.nano_icon_content').nanoScroller({scroll: 'top'});
  });
  $(document).on('click', '.form_item_icon_content li', function (e) {
    let checkDefault = $(this).parents('.form_item_icon_wrap').hasClass('add_icon');
    let iconDefaultClass = $(this).parents('.form_item_icon_wrap').find('input').val();
    let iconBlock = $(this).parents('.form_item_icon_content');

    if ($(this).hasClass('close')) {
      $(this).parents('.form_item_icon_wrap').removeAttr('data-default data-defaultclass');
      $(this).parents('.form_item_icon_wrap').addClass('add_icon').find('.icon-wrap').removeClass('current');
      $(this).parents('.form_item_icon_wrap').find('input').val('');
      iconBlock.hide();
      return;
    }

    $(this).parents('.form_item_icon_wrap').removeClass('add_icon').attr('data-default', checkDefault);
    !checkDefault ? $(this).parents('.form_item_icon_wrap').attr('data-defaultclass', iconDefaultClass) : null;

    let iconMain = $(this).parents('.form_item_icon_wrap').find('.js-open-icons > i');
    let iconTargetClass = $(this).find('i').attr('class');

    iconBlock.find('li').removeClass('current');
    $(this).addClass('current');
    $(this).parents('.form_item_icon_wrap').find('input').val($(this).attr('data-value'))

		iconMain.attr('class', iconTargetClass);

    iconBlock.hide();

    // trigger for a20 (3.1-th step) clone elements
    let isStepsWidget = $(this).parents('.a20_steps').length;
    isStepsWidget ? $(document).trigger('runUpdateChannels') : null;
  });
  $('.nano_icon_content').nanoScroller({alwaysVisible: true});


  document.addEventListener("keyup", keyUpEvent)
  document.addEventListener("click", clickEvent)
  document.addEventListener("search", customSearchMultiple)
});

function ValidEmail(email) {
  //var re = /^[-_A-Za-z0-9\+][A-Za-z0-9\+\._-]*[\+A-Za-z0-9_]*@([A-Za-z0-9]+([A-Za-z0-9-]*[A-Za-z0-9]+)*\.)+[A-Za-z]+$/;
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-ZА-Яа-я\-0-9]+\.)+[a-zA-ZА-Яа-я]{2,}))$/;
  return re.test(email);
}

function closeRow(el) {
  $(el).closest('.w_settings').slideUp();
  $(el).closest('.lw_item').find('.edit').removeClass('active');
}

function checkTabs() {
  if ($('.content div.heading').hasClass('noteOpen')) {
    $('.topTab').css({
      'padding-bottom': '0px'
    })
  } else {
    $('.topTab').css({
      'padding-bottom': '16px',
      'margin-bottom': '0px'
    })
  }
}

function changeCheckbox(checkbox_id, checkbox_status) {
  $('#' + checkbox_id).prop('checked', checkbox_status);
}

function hideBlock() {
  find_display_block = false;
  $('.notifications').find('.noti_wrap').each(function () {
    if ($(this).css('display') != 'none') {
      find_display_block = true;
    }
  });
  if (!find_display_block) {
    $('.notifications').hide();
  }
}

// Инитим селекты
function init_nice_elements(start) {
  /**
   * @param start - передаём класс/id где инитить селекты. Если передать пустую строку - селекты обработаются на всей странице
   */
    if(!start)
    {
        start = document;
    }

  let elements;
    // Обрабатываем одиночные селекты
    (function () {
        if(typeof start == 'string')
        {
            elements = Array.from($(start + ' .mySelect:not(.default_hidden):not(.multipleSelect):not(.-js-noMySelect)'))
        }
        else
        {
            elements = Array.from($(' .mySelect:not(.default_hidden):not(.multipleSelect):not(.-js-noMySelect)'))
        }
      if (elements.length === 0) return

      const init = choicesInit(elements, {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        noResultsText: Translate('alpha20_js/no_results'),
        noChoicesText: Translate('alpha20_js/no_variants'),
        resetScrollPosition: false,
      })
    })();

    // Обрабатываем мультиселекты
    (function () {
        if(typeof start == 'string')
        {
            elements = Array.from($(start + ' .multipleSelect:not(.default_hidden):not(.-js-noMySelect)'))
        }
        else
        {
            elements = Array.from($(' .multipleSelect:not(.default_hidden):not(.-js-noMySelect)'))
        }
      if (elements.length === 0) return

      const init = choicesInit(elements, {
        shouldSort: false,
        searchResultLimit: 99,
        itemSelectText: '',
        noResultsText: Translate('alpha20_js/no_results'),
        noChoicesText: Translate('alpha20_js/no_variants'),
        addChoices: false,
        removeItemButton: true,
        resetScrollPosition: false,
      });
    })();

    if($(document).chosen)
    {
        $(start).find('.mySelect_chosen').chosen({
            width: '100%',
            placeholder_text: ''
        }).on('chosen:showing_dropdown', function (evt, params) {
            setTimeout(function () {
                SelectNano(".chosen-container")
            },100);

        }).trigger("chosen:updated");

        $('.chosen-search input').on('input keydown paste cut', function () {
          setTimeout(function() {
            SelectNano(".chosen-container")
          }, 180)
        });

        SelectNano(".chosen-container")
    }

    if($(document).select2)
    {
        $(start).find('.mySelect_select2').select2({
            width: '100%',
        })

        setTimeout(function () {
          InputSelectNano();
        },100);
    }
    // Библиотека обрабатывает даже скрытые селекты. В Правилах и Шаблонах это критично
  function isVisible(elements) {
    // {todo: было бы здорово пройтись по всему проду и пофиксить обработку скрытый селектов. Сейчас это работает только для Правил и Шаблонов}
    const main = document.querySelector("main.rule__wrapper") ||
      document.querySelector("main.templates__wrapper")

    if (main) {
      return elements.filter(element => element.offsetHeight > 0)
    } else {
      return elements
    }
  }
}

function cancelRemoveRow() {
  $('#deleteRow').togglePopup();
  $('#removeRow').val('');
}

function removeRow() {
  //получаем ID элемента, которого собираемся удалить
  var remove_id = $('#removeRow').val();
  //скрываем модальное окно по удалению
  cancelRemoveRow();

  if (typeof DeleteRecord == 'function') {
    DeleteRecord(remove_id);
  } else {
    AjaxDeleteRecord(remove_id);
  }
}

function AjaxDeleteRecord(remove_id, url) {
  if (!url) {
    url = remove_record_url;
  }
  category_id = $('#record_li_' + remove_id).parents('div:first').attr('id');
  //посылаем запрос на удаление элемента
  if (remove_id) {
    $.ajax({
      url: url,
      type: 'POST',
      dataType: 'json',
      data: {
        remove_id: remove_id,
        category_id: category_id ? category_id.replace('block_section_articles_', '') : 0,
      },
      success: function (response) {
        if (response.status && response.status == 'email_2') {
          document.location.href = '/admin/channels/email/';
        } else if (response.status && response.status == 'OK') {
          if (response.type == 'intercom') {
            Intercom('trackEvent', response.message);
          }
        }
      },
      cache: false
    });
    if (typeof MyHideRecordRow == 'function') {
      MyHideRecordRow(remove_id);
    } else {
      HideRecordRow(remove_id);
    }
  }
}

function HideRecordRow(record_id) {

  category_id = $('#record_li_' + record_id).parents('div:first').attr('id');
  data_type = $('#record_li_' + record_id).attr('data-type');
  if (data_type) {
    $('.new_integration_block a[rel=' + data_type + ']').removeClass('activated');
  }
  //скрываем строку, которую удалили
  $('#record_li_' + record_id).fadeOut(500);
  setTimeout(function () {
    //уменьшаем счетчик элементов на 1
    var record_list = $('#record_li_' + record_id).closest('.listWorker');
    var heading = record_list.prevAll('.heading').first();
    if ($('.span_cnt_all').length) {
      var count_span = heading.find('.span_cnt_all').first();
      if ($('#record_li_' + record_id).find('.fa-check')) {
        var count_span_ = heading.find('.span_cnt').first();
        count_span_.html(count_span_.html() - 1);

      }
    } else {
      var count_span = heading.find('.span_cnt').first();
    }
    count_span.html(count_span.html() - 1);
    $('#record_li_' + record_id).remove();

    if (typeof DeleteRecordExt == 'function') {
      DeleteRecordExt(category_id);
    }

    if (typeof PostDeleteRecord == 'function') {
      PostDeleteRecord();
    }
  }, 550);
}

function get_closes_li_id(el, li_id) {
  if (!li_id) {
    var closes_li = $(el).closest('.lw_item');
    var li_id = $(closes_li).prop('id');
  }
  var return_id = '';
  if (li_id) {
    if (li_id.match(/record_li_(.+)/)) {
      return_id = li_id.match(/record_li_(.+)/)[1];
    } else if (li_id.match(/recordT_li_(.+)/)) {
      return_id = li_id.match(/recordT_li_(.+)/)[1];
    }
  }
  return return_id;
}

function enableRecord(item, enable, url, zone = 'support') {
  if (!url && typeof enable_record_url != 'undefined') {
    url = enable_record_url;
  }

  var id = get_closes_li_id(item);
  markOffOn($(item).closest('.lw_item'), enable);
  if (!$(item).hasClass('no-ajax')) {
    $.ajax({
      url: url,
      type: 'POST',
      dataType: 'json',
      data: {
        record_id: id,
        enable: enable,
        zone: zone
      },
      success: function (response) {
        if (response.status && response.status == 'OK') {
          if (response.type == 'intercom') {
            Intercom('trackEvent', response.message);
          }
        }
        if (enable_record_url.match(/staff/)) {
          if (enable) {
            $('.span_cnt').html((parseInt($('.span_cnt').html()) + 1));
          } else {
            $('.span_cnt').html((parseInt($('.span_cnt').html()) - 1));
          }
        }
      },
      cache: false
    });
  }
}

function reload_li_record(id, callback_func) {
  close_li(id);

  $.ajax({
    url: reload_record_url,
    type: 'POST',
    data: {
      record_id: id,
    },
    cache: false
  }).done(function (response) {
    $("#reload_" + id).html(response);
    if (callback_func) {
      eval(callback_func + '();');
    }
    init_nice_elements();
  });
}

function reset_li_record(id) {
  close_li(id);
  //$("#form_"+id).trigger('reset');
}

function close_li(li_id) {
  $('#li_' + li_id).find('.edit').removeClass('active');
  $('#li_' + li_id).find('.w_settings').slideUp();
}

$(document).ready(function () {
  $('.check_limit').each(function () {
    var input_that = $(this);
    var no_symbol_that = $(input_that).siblings('.no_symbol');
    var used_that = $(no_symbol_that).find('span').first();
    var limit_that = $(no_symbol_that).find('i').first().html();
    input_that.bind('change keyup keydown blur', function () {
      var tmp_val = $(input_that).val();
      used_length = tmp_val.length;
      if (used_length > limit_that) {
        used_length = limit_that;
        tmp_val = tmp_val.substring(0, limit_that);
        $(input_that).val(tmp_val);
      }
      $(used_that).html(used_length);
    })
  });

  $('.cancelReload').click(function () {
    var reload_id = get_closes_li_id(this);
    if (reload_id) {
      reload_li_record(reload_id);
    }
  });
});

function remove_all_errors() {
  $('.errorTip').hide();
  $('input, select').removeClass('error');
}

function showError(fieldid) {
  $('#warning_' + fieldid).show();
  $('#warning_' + fieldid).siblings().addClass('error');
}

function init_email_replace_fields() {
  $(document).on('click', '.pp_action', function () {
    document.querySelector("header").style.zIndex = '8';
    var add_top = 0;
    if ($(this).hasClass('new_pp_action') || $(this).hasClass('chat_pp_action')) {
      var closes_letters_content = $(this).closest('div').next('.letters_content');
      add_top = 30;
    } else {
      var closes_letters_content = $(this).closest('.letters_content');
      if (closes_letters_content.length == 0) {
        closes_letters_content = $(this).closest('.acrItem').find('.letters_content').first();
        add_top = 30;
      }
    }
    var letters_content_pp_list = closes_letters_content.find('.pp_list');
    var pos_h = closes_letters_content.height();

    const main = document.querySelector("main.rule__wrapper") || document.querySelector("main.templates__wrapper")
    const forNotification = document.querySelector("main.notification_emails__wrapper") // Настройки -> Письмо-уведомление

    // В правилах и Шаблонах есть два типа поп-апов с метками. Для каждого типа свои отступы
    if (main) {
      const chatAction = $(this)[0].matches(".chat_pp_action")
      const newAction = $(this)[0].matches(".new_pp_action")

      if (chatAction) {
        letters_content_pp_list.css("margin-bottom", "16px")
      } else if (newAction) {
        letters_content_pp_list.css("margin-bottom", "7px")
      }
    }

    if (forNotification) {
      // Только для Настройки -> Письмо-уведомление

      const browser = document.querySelector("body")

      if (browser.matches(".mozilla") || browser.matches(".safari")) {
        letters_content_pp_list.css('bottom', add_top + pos_h - 28 + 'px').show();
      } else {
        letters_content_pp_list.css('bottom', add_top + pos_h - 26 + 'px').show();
      }
    } else {
      // Все остальные случаи
      letters_content_pp_list.css('bottom', add_top + pos_h + 10 + 'px').show();
    }

    if (letters_content_pp_list.offset().top < 0) {
      const padding = parseInt(letters_content_pp_list.find(".pp_list_wrap").css("paddingTop")) +
        parseInt(letters_content_pp_list.find(".pp_list_wrap").css("paddingBottom"))
      let marginBottom = parseInt(letters_content_pp_list.css("marginBottom")) + padding

      letters_content_pp_list.css("marginBottom", marginBottom + 'px')
      letters_content_pp_list.height();
      letters_content_pp_list.css('height', (letters_content_pp_list.height() + letters_content_pp_list.offset().top) + 'px');
      letters_content_pp_list.find('.pp_list_body').css('height', (letters_content_pp_list.height() - 29) + 'px');

      let gh = letters_content_pp_list.find('.pp_list_body').height()
      letters_content_pp_list.find('.pp_list_body').css('overflow', 'auto');
      letters_content_pp_list.find('.ul_wrapper').css('height', `${gh}px`)
      initCustomScrollLabel("")
    }
    $('.profile_logout').hide();
    return false;
  });

  $(document).on('click', '.pp_list .close', function () {
    $(this).closest('.pp_list').hide();
    document.querySelector("header").style.zIndex = '100';
    return false;
  });

  $(document).on('click', '.pp_list_item a', function (e) {
    e.preventDefault();

    var element_rel = $(this).parent().attr('rel');
    var variable = $(this).attr('rel');
    if (element_rel.indexOf('add_note') >= 0 ||
      element_rel.indexOf('comment_to_post') >= 0) {
      current_email_focus = 'content';
    }
    var notification_emails = ($(this).parents('.hourContent'));
    if (element_rel.match(/email_to_user/) ||
      element_rel.match(/comment_to_post/) ||
      element_rel.match(/message_to_chat/) ||
      $(notification_emails).hasClass('notifications_common') ||
      $(notification_emails).hasClass('notifications_per_email')) {
      if (current_email_focus == 'subject') {
        var focus_element_id = $('input[id^=form_' + current_email_focus + '_' + element_rel + ']:visible')[0].id;
      } else {
        if (element_rel.match(/comment_to_post/) ||
          element_rel.match(/message_to_chat/)) {
          var focus_element_id = $('textarea[id^=form_' + current_email_focus + '_' + element_rel + ']:visible')[0].id;
        } else {
          //redactor
          var focus_element_id = $('textarea[id^=form_' + current_email_focus + '_' + element_rel + ']').parent().filter(':visible').find('textarea')[0].id;
        }
      }
    } else {
      var focus_element_id = 'form_' + current_email_focus + '_' + element_rel;
    }
    if (IsSetRedactorInstance(focus_element_id)) {
      InsertRedactorText(focus_element_id, variable);
    } else {
      var myField = document.getElementById(focus_element_id);

      if (myField) {
        insertAtCursor(myField, variable);
      }
    }
    $(this).closest('.pp_list').hide();
  });

  $(document).on('focus', 'input.email-field', function () {
    current_email_focus = 'subject';
  });
  $(document).on('focus', 'textarea.email-field', function () {
    current_email_focus = 'content';
  });
}

function insertAtCursor(myField, myValue) {
  if (document.selection) {
    myField.focus();
    sel = document.selection.createRange();
    sel.text = myValue;
  } else {
    if (myField.selectionStart || myField.selectionStart == '0') {
      var startPos = myField.selectionStart;
      var endPos = myField.selectionEnd;
      myField.value = myField.value.substring(0, startPos) +
        myValue +
        myField.value.substring(endPos, myField.value.length);
    } else {
      myField.value += myValue;
    }
  }
}

function actionButton() {
  $('.holidaysRow .addRow, .addRowThis').click(function () {
    $(this).closest('.holidaysRow, .lw_item').removeClass('editRow hldNewRow newRow').addClass('normalRow');
    $(this).remove();
    return false;
  });
  $('.holidaysRow .remove').click(function () {
    $(this).closest('.holidaysRow').remove();
    return false;
  });
}

// on off
function markOffOn(lw_item, enable) {
  if (enable) {
    lw_item.addClass('active').removeClass('fllw_off');

    // Добавляем галку если переключатель включён
    if (!lw_item.hasClass('api_lw')) {
      lw_item.find('.-js-onOff-icon').addClass('fa-check').removeClass('fa-times');
    }
    // Добавляем галку если переключатель включён END

    lw_item.find('.gsCanvas').stop().animate({
      'opacity': '0'
    }, 500);
    lw_item.find('.gsWrapper').animate({
      'opacity': '1'
    });

    // для payment
    if($('.admin-payment__wrapper').length && $('.lw_payment_card_save').length) {
      $('.processBody').hide();
    }
  } else {
    //disable record
    lw_item.find('.btn-mark').removeClass('btn-activated');
    lw_item.removeClass('active').addClass('fllw_off');

    // Удаляем галку если переключатель выключён
    if (!lw_item.hasClass('api_lw')) {
      lw_item.find('.-js-onOff-icon').removeClass('fa-check').addClass('fa-times');
    }
    // Удаляем галку если переключатель выключён END

    if (lw_item.find('.fellow .pic img').length && lw_item.find('.fellow .pic img')[0].naturalHeight) {
      lw_item.find('.fellow .pic img').greyScale({
        fadeTime: 500
      });
    }
    lw_item.find('.gsWrapper').animate({
      'opacity': '0.7'
    });

    // для payment
    if($('.admin-payment__wrapper').length && $('.lw_payment_card_save').length) {
      $('.processBody').slideDown();
    }
  }

  if (typeof OnOffExt == 'function') {
    OnOffExt(lw_item, enable);
  }
}

function offOn(start) {
  if (start) {
    start = start + ' ';
  } else {
    start = '';
  }

  $(start + '.onOff').off('click').click(function (e) {
    if ($(this).hasClass('f_disabled')) {
      return false;
    }

    var parent_list = $(this).parents('.elem_group_list');
    if (parent_list.hasClass('lang_support_list')) {
      $('.notifications .n_close').click();
      var b_lang_file_missing = $(this).parent().parent().hasClass('b_lang_file_missing');
      if (!b_lang_file_missing) {
        e.preventDefault();
        var lw_item = $(this).closest('.lw_item');
        if (!lw_item.hasClass("b_star") && !lw_item.hasClass("b_appraise")) {
          if (lw_item.hasClass('active')) {
            //remove star
            StarRecord($(this), 0);
            if (typeof onOff == 'function') {
              onOff(this, 0);
            } else {
              enableRecord(this, 0);
            }
          } else {
            if (typeof onOff == 'function') {
              onOff(this, 1);
            } else {
              enableRecord(this, 1);
            }
          }
        }
      } else {
        var errors = [];
        var errors_fields = [];
        errors.push('LANG_FILE_MISSING');
        ShowNotification(errors, errors_fields);
      }
    } else {
      e.preventDefault();
      var lw_item = $(this).closest('.lw_item');
      if (!lw_item.hasClass("b_star") && !lw_item.hasClass("b_appraise")) {
        if (lw_item.hasClass('active')) {
          //remove star
          StarRecord($(this), 0);
          if (typeof onOff == 'function') {
            onOff(this, 0);
          } else {
            enableRecord(this, 0);
          }
        } else {
          if (typeof onOff == 'function') {
            onOff(this, 1);
          } else {
            enableRecord(this, 1);
          }
        }
      }
    }
  });
}

function editApply(start) {
  if (start) {
    start = start + ' ';
  } else {
    start = '';
  }
  $(start + '.holidaysRow .edit, .editRowList').click(function () {
    $(this).closest('.holidaysRow, .lw_item').removeClass('normalRow');
    $(this).closest('.holidaysRow, .lw_item').addClass('editRow');
    $(this).closest('.holidaysRow, .lw_item').find('.apply').show();
    $(this).closest('.holidaysRow, .lw_item').find('.edit, .editRowList').hide();
    $(this).removeClass('active');
    //return false;
  });
  $(start + '.apply, .addRowThis').click(function () {
    $(this).closest('.holidaysRow, .lw_item').removeClass('editRow');
    $(this).closest('.holidaysRow, .lw_item').addClass('normalRow');
    $(this).closest('.holidaysRow, .lw_item').find('.apply').hide();
    $(this).closest('.holidaysRow, .lw_item').find('.edit, .editRowList').show();
    $(this).closest('.lw_item').find('.fieldRow input').attr("disabled", "disabled");

    if (typeof handleApiKeyRow == 'function') {
      handleApiKeyRow(this);
    }
    //return false;
  });
    $(document).on('click',start + '.holidaysRow .edit, .editRowList',function () {
        $(this).closest('.holidaysRow, .lw_item').removeClass('normalRow');
        $(this).closest('.holidaysRow, .lw_item').addClass('editRow');
        $(this).closest('.holidaysRow, .lw_item').find('.apply').show();
        $(this).closest('.holidaysRow, .lw_item').find('.edit, .editRowList').hide();

        $(this).removeClass('active');
        //return false;
    });
    $(document).on('click',start + '.apply, .addRowThis',function () {
        $(this).closest('.holidaysRow, .lw_item').removeClass('editRow');
        $(this).closest('.holidaysRow, .lw_item').addClass('normalRow');
        $(this).closest('.holidaysRow, .lw_item').find('.apply').hide();
        $(this).closest('.holidaysRow, .lw_item').find('.edit, .editRowList').show();
        $(this).closest('.lw_item').find('.fieldRow input').attr("disabled", "disabled");

        if (typeof handleApiKeyRow == 'function') {
            handleApiKeyRow(this);
        }
        //return false;
    });

}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function ShowXajaxNotification(message_code, b_hide) {
  var message_codes = [];
  var errors_fields = [];
  if (message_code) {
    codes_array = message_code.split(',');
    for (i = 0; i < codes_array.length; i++) {
      message_codes.push(codes_array[i]);
    }
  }
  ShowNotification(message_codes, errors_fields, b_hide);
}

function HideNotifications() {

}

function ShowNotification(message_codes, errors_fields, b_not_hide) {
  if (!b_not_hide) {
    $('.noti_wrap').each(function () {
      message_code = $(this).attr('id');
      if (message_code && $.inArray(message_code, message_codes) == -1 && !message_code.match(/NOTIFICATION_(\d*)/)) {
        $('#' + message_code).fadeOut();
      }
    });
  }
  hideBlock();
  if (message_codes.length > 0) {
    $('.notifications').show();
    for (i = 0; i < message_codes.length; i++) {
      message_code = message_codes[i];
      $('#' + message_code).fadeIn();
    }
    for (i = 0; i < errors_fields.length; i++) {
      field_id = errors_fields[i];
      $('#' + field_id).addClass('border-error');
    }
  }
}

function closeCreateBlock() {
  $('.addingButon').removeClass('dsbld');
  $('.addingBlock input[type=text]').val('');
  $('.addingBlock').slideUp('slow');

  if ($('.addEmail').length) {
    $('.addEmail').slideUp('slow');
    $('#form_li_0').find('.regular-email').css('display', 'block');
    $('#form_li_0').find('.google-email').hide();
    $('#form_li_0').find('.oauth-email').hide();
    //hideTwin();
    $('.google-aps-info.oauth-email .google-info-b2 a').show();
    $('.google-aps-info.oauth-email .google-info-b2 span').hide();
    var email_id = 0;
    $('#user_group_id_' + email_id).val('');
    $('#email_protocol_' + email_id).val('');
    $('#emailaddress_' + email_id).val('');
    $('#password_' + email_id).val('');
    $('#incoming_server_' + email_id).val('');
    $('#incoming_port_' + email_id).val('');
    $('#outgoing_server_' + email_id).val('');
    $('#outgoing_port_' + email_id).val('');
    $('#gmail_token_' + email_id).val('');
    $('.e_standard').slideUp();
    $('.e_own').slideUp();
    $('.twoBlock').show();
  }
  if($('#new_record .mySelect_select2').length) {
    $('#new_record .mySelect_select2').val('').trigger('change')
  }
  if($('#new_record input.js_valid_integer[id^=disable_focus_]').length) {
    $('#new_record input.js_valid_integer[id^=disable_focus_]').attr('disabled', 'disabled');
  }
}

function gsimg() {
  $('.w_groupList ul li').each(function () {
    if ($(this).hasClass('active')) {
    } else {
      $('.pic img').greyScale();
    }
    return false;
  });
}

function profileLogout() {
  $('.ma').click(function () {
    if ($('.profile_logout').is(":hidden")) {
      $(this).addClass('ma_active');
      $('.fa-sort-down').removeClass('fa-sort-down').addClass('fa-sort-up');
      $('.profile_logout').show();
      $('.topBlock').css('z-index', '100');
      $('.middle .pp_list').hide();
    } else {
      $(this).removeClass('ma_active');
      $('.fa-sort-up').removeClass('fa-sort-up').addClass('fa-sort-down');
      $('.profile_logout').hide();
      // $('.topBlock').css('z-index','2');
    }
  });
  $('html').click(function () {
    $('.profile_logout').hide();
    // $('.topBlock').css('z-index','2');
    $('.ma').removeClass('ma_active');
    $('.fa-sort-up').removeClass('fa-sort-up').addClass('fa-sort-down');
  });
  $('.ma').click(function (event) {
    event.stopPropagation();
    event.preventDefault();
  });
}

function init_start_settings(start) {
  if (start) {
    start = start + ' ';
  } else {
    start = '';
  }
  $('.count-lenght').each(function () {
    $(this).on('change, blur, keyup', function () {
      var curl_val = $(this).val();
      curl_val = curl_val.split("\n").join('  ');
      curl_length = curl_val.length;
      $(this).prev('.no_symbol').children('span').html(curl_length);
    })
  });
  $(start + '.edit').click(function () {
    if ($(this).hasClass('f_disabled')) {
      return false;
    }

    if ($(this).hasClass('noJs')) {
      return true;
    }
    if (typeof UploadSettingsData == 'function') {
      const el = UploadSettingsData(this);
    } else {
      $(this).closest('.lw_item').find('.w_settings').slideDown('slow');
      const main = document.querySelector(".settings-integrations__wrapper")
      const element = `#${$(this).closest("li").attr("id")}`
      if (main) showIntegrations(element)

      init_nice_elements(`#${$(this).closest('li')[0].id}`);
      InitNanoScrolls(`#${$(this).closest('li')[0].id}`)
    }
    $(this).addClass('active');
    if (typeof OnEdit == 'function') {
      OnEdit(this);
    }
    gsimg();
    const star = $(this)[0].closest("li").id
    InitNanoScrolls(`#${star}`);
    $('.nano_icon_content').nanoScroller({alwaysVisible: true});
    setTimeout(() => {
      CheckAgTitle()
    }, 700)
    return false;
  });

  $(start + '.settingsButton').click(function (e) {
    e.preventDefault();
    closeRow($(this));
  });

  if (start == '') {
    $(document).on('click', '.cancel', function () {
      if ($(this).attr('rel') == 'ajax_reload') {
        if (typeof ReloadRecord == 'function') {
          ReloadRecord($(this).attr('id'));
        }
      } else {
        var closes_form = $(this).closest('form');
        $(closes_form).trigger('reset');
        $(closes_form).find('textarea').each(function () {
          var form_textarea_id = $(this).attr('id');
          var is_group = $(this).attr('rel') && $(this).attr('rel') == 'group' ? true : false;

          if (typeof IsSetRedactorInstance === "function") {
            if (IsSetRedactorInstance(form_textarea_id) && !is_group) {
              var form_textarea_data = $('#' + form_textarea_id).val();
              ClearRedactorContent(form_textarea_id);
              SetRedactorCode(form_textarea_id, form_textarea_data);
            }
          }
        });
        init_nice_elements('#' + $(closes_form).attr('id'));
      }
      if (typeof OnCancel == 'function') {
        OnCancel(this);
      }
      //e.preventDefault();
      //$(this).closest('form').trigger('reset');
      //init_nice_elements();

      IconRefreshKBSectionCancel($(this).parents('.formFooter').find('.form_item_icon_wrap'));
    });
  }

  // show group description
  var container = $(start + ".allGroups");
  $(start + ".agList li input").on("click", function (event) {

    // event.target.setAttribute("checked", "true")
    $(this).each(function (i, el) {
      var $el = $(el),
        num = $el.val().match(/pstr(_.+_\d*)/)[1];

      container.show();
      $('#results' + num).slideDown();
      InitNanoScrolls('#results' + num)

      $('#results' + num)[0].querySelector(".la_li_lst input").checked = true;
      $(this).closest('.agList li').hide();
    });

    setTimeout(() => {
      const main = document.querySelector(".sla__wrapper")
      if (main) hiddenGroup()
    }, 1)


    CheckAgTitle();
  });

  $(start + ".groupSlct").on("click", function () {
    $(this).each(function (i, el) {
      var $el = $(el),
        num = $el.val().match(/pstr(_.+_\d*)/)[1];
      $('#results' + num).slideUp();

      $('.agList li.g_item' + num)[0].querySelector("input").checked = false;

      $('.agList li.g_item' + num).show();
    });
    CheckAgTitle();
  });

  // checkbox

  $(start + '.w_groupList li').bind('click', function () {
    var checkbox = $(this).find(':checkbox');
    $(this).toggleClass('active');
    var checkbox = $(this).find(':checkbox');
  });
  $(start + '.w_groupList li').each(function () {
    var clickScale = $(this);
    var elseScale = $(this).find('.pic img');
    clickScale.click(function () {
      if ($(this).hasClass('active')) {
        $(this).find('.gsCanvas').stop().animate({
          'opacity': '0'
        }, $options.fadeTime);
      } else {
        elseScale.greyScale({
          fadeTime: 500
        });
      }
    });
  });

  if (!b_event_inited) {
    $(document).on('click', start + '.delete', function (e) {
      if ($(this).hasClass('f_disabled')) {
        return false;
      } else if ($(this).hasClass('no-js')) {
        return true;
      } else {
        e.preventDefault();
        if (typeof ClickDeleteRecord == 'function') {
          ClickDeleteRecord(this);
        } else {
          StartDeleteRecord(this);
        }
      }
    });
    b_event_inited = true;
  }
}

function StartDeleteRecord(el) {
  // console.trace();
  var lw_item = $(el).closest('.lw_item');
  if ((!lw_item.hasClass("b_star") && !lw_item.hasClass("b_appraise") && !lw_item.hasClass("b_reappraise")) ||
    lw_item.hasClass("b_last_email_delete")) {
    remove_id = get_closes_li_id(el);
    $('#removeRow').val(remove_id);
    // Если есть служебный класс -js-not-remove-temporary на элементе - не удаляем
    if (lw_item.hasClass("-js-not-remove-temporary")) return

    $('#deleteRow').togglePopup();
  }
}

function ReloadRecord(cancel_id) {
  cancel_id = '' + cancel_id;
  record_id = cancel_id.match(/(cancel_)?(\d+)/)[2];
  xajax_ReloadRecord(record_id);
}

function AddRecord(record_html, record_id) {
  $('#record_list').append(record_html);
  if ($('.span_cnt_all').length) {
    $('.span_cnt_all').html((parseInt($('.span_cnt_all').html()) + 1));
  } else {
    $('.span_cnt').html((parseInt($('.span_cnt').html()) + 1));
  }
  closeCreateBlock();
  ReloadRecord(0);
}

function InitialSettings(record_id) {
  //record_id = parseInt(record_id);
  if (record_id == 0) {
    element_id = '#new_record';
  } else {
    element_id = '#record_li_' + record_id;
  }
  init_start_settings(element_id);
  init_nice_elements(element_id);
  offOn(element_id);

  init_add_settings();
  if (typeof init_create_record == 'function') {
    init_create_record();
  }
  if (typeof init_update_record == 'function') {
    init_update_record(element_id);
  }
  if (typeof init_select_box == 'function') {
    init_select_box();
  }
}

function HideSpinButton(button_id) {
  $('#spin_' + button_id).hide();
  $('#' + button_id).show();
}

function InsertChatApiWebhook(html) {
  $('#chatapi_webhook_wrapper').html(html);
}

// Инициализация select2 при редактировании правил

// function InitLabelsBoxes(search_labels) {
// 	$(search_labels).select2({
// 		width: '100%',
// 		createSearchChoice: function(term, data) {
// 			if ($(data).filter(function() {
// 				return this.text.localeCompare(term) === 0;
// 			}).length === 0) {
// 				return {
// 					id: 'n:' + term,
// 					text: term
// 				};
// 			}
// 		},
// 		multiple: true,
// 		query: function (query){
// 			var data = {results: []};

// 			$.each(all_labels_list, function(){
// 				if(query.term.length == 0 || this.text.toUpperCase().indexOf(query.term.toUpperCase()) >= 0 ){
// 					data.results.push({id: this.id, text: this.text });
// 				}
// 			});

// 			query.callback(data);
// 		},
// 		tokenSeparators: [","]
// 	});
// }

// Инициализация select2 при редактировании правил END

function SelectNumber(string_number) {
  number = 0;
  if (string_number.match(/\d+/)) {
    number = parseInt(string_number.match(/\d+/)[0]);
  }
  return number;
}

function ResetFeedbacks(f) {
  $.ajax({
    type: "POST",
    url: reset_feedbacks_url + "/" + f,
    success: function () {
      $(".feedback-question-number").html("").addClass("icon-question").removeClass("feedback-question-number").removeClass("icon").parent().removeClass("feedback-question")
    },
    dataType: 'text',
  })
}

function InitModalWindows() {
  if (!$.magnificPopup) {
    return false;
  }
  //Modal
  $('.knowledge-item .btn-delete-item, .modal-trigger').magnificPopup({
    type: 'inline',
    midClick: true,
    closeBtnInside: true,
    tClose: Translate('cases_custom_fields_js/close'),
    closeMarkup: '<div title="%title%" class="modal-close mfp-close"><i class="fas fa-times"></i></div>',
    callbacks: {
      open: function () {
        $('html').css('overflow', '');
      },
      close: function () {
      }
    }
  });
}

function CheckLocalStorage() {
  if (typeof localStorage === 'object') {
    try {
      localStorage.setItem('localStorage', 1);
      localStorage.removeItem('localStorage');
      return true;
    } catch (e) {
      return false;
    }
  }
  return false;
}

function removeLangFileMissingMark(lang_id) {
  $('#record_li_' + lang_id).removeClass('b_lang_file_missing');
}

function ChangeColorIcon(el, color) {
  $($(el).selectmenu("widget")[0]).find('i').css('color', color);
  $($(el).selectmenu("widget")[1]).find('li').each(function () {
    $(this).find('i').css('color', color);
  });
}

function CheckAgTitle() {
  if ($('.agList li:visible').length == 0) {
    $('.agTitle').hide();
  } else {
    $('.agTitle').show();
  }
}

function InitModalWindows() {

}

function StarRecord(item, star) {
  if (typeof (star_record_url) != 'undefined') {
    var id = get_closes_li_id(item);
    $.ajax({
      url: star_record_url,
      type: 'POST',
      data: {
        record_id: id,
        star: star
      },
      cache: false
    });
  }
}

function ShowSpinButton(button_id, skipp_resize) {
  var hb = typeof button_id == 'string' ? $('#' + button_id) : button_id;
  if (skipp_resize) {
    $('#spin_' + button_id).show()
  } else {
    var width = hb.width();
    var padding_left = hb.css('padding-left');
    var padding_right = hb.css('padding-right');
    $('#spin_' + button_id).show().css('padding-left', padding_left).css('padding-right', padding_right).width(width);
  }
  hb.hide();
}

function init_add_settings() {
  $('a.third').click(function (e) { //When any link is clicked
    var current_tab = $(this).closest('.thirdBlock').find('.active');
    $($(current_tab).attr('href')).hide();
    current_tab.removeClass('active');
    $(this).addClass('active'); //Set clicked link class to active
    $($(this).attr('href')).show();
    e.preventDefault();
  });

  // add new
  $('.addingButon, .addingEmail, .addingNmbr').click(function () {
    //( Added by Zubcu Serghei
    if ($(this).hasClass('noJs')) {
      return true;
    }
    //)
    $(this).addClass('dsbld');
    if (typeof ClickAddNewRecord == 'function') {
      ClickAddNewRecord(this);
    }
    if ($('.addingBlock').length > 1) {
      $(this).parent().next().slideDown('slow');
    } else {
      $('.addingBlock').slideDown('slow');
      InitNanoScrolls(".addingBlock");
    }

    // refresh and reinit CP Добавление кастомного канала
    if ($(this).parent().next().find(".cch_colorpicker")[0]) {
      $(this).hasClass('addingButon') ? InitColorPicker($(this).parent().next().find(".cch_colorpicker"), $(this).parent().next().find('.color-box-wrap')) : null;
    }

    gsimg();
    return false;
  });
  $('.addingEmail, .addingNmbr').click(function () {
    $('.cancelTop').fadeIn();
    /*if($('.e_standard').and('.e_own').is(':hidden')){$('.cancelTop').fadeIn();}
    else{$('.cancelTop').hide();}*/
  });
  $(document).on('click', '.addingCancel, .cancelTop', function () {
    closeCreateBlock();

    IconRefreshKBSectionCancel($(this).parents('.formFooter').find('.form_item_icon_wrap'));
    return false;
  });
  $('.cancelTop').click(function () {
    $('.addingEmail, .addingNmbr, .addingIntegrations, .addingLocalisation').removeClass('dsbld');
    $(this).fadeOut();
    return false;
  });
  $('.addingCancel_e_standard').click(function () {
    $('.e_standard').slideUp();
    $('.twoBlock').slideDown();
    $('.cancelTop').fadeIn();
    return false;
  });
  $('.addingCancel_e_own').click(function () {
    $('.e_own').slideUp();
    $('.twoBlock').slideDown();
    $('.cancelTop').fadeIn();
    return false;
  });
}

function InitColorPicker(el, refreshEl) {
  /** Фикс ломает в виджетах повторных инит колорпикера в "Настройки каналов" **/
    // if (el[0]) {
    //   const elementIs = el[0].closest("div").querySelector(".color-box-wrap")
    //   if (elementIs) {
    //     return
    //   } // если датапикер уже есть - убиваем функцию, иначе вставится два раза
    // }

    // проверить сохранение цвета с опасити
  var input = el[0],
    code = document.createElement('input'),
    box = document.createElement('div');

  if (typeof input == 'undefined') {
    return
  }

  // for a20 (3.1-th step) clone elements
  if (typeof refreshEl !== 'undefined') {
    refreshEl.remove();
  }

  box.className = 'color-box';
  box.style.backgroundColor = input.getAttribute('value');
  box.setAttribute('data-color', input.getAttribute('value'));

  const isHere = input.parentNode.querySelector(".color-box-wrap")
  if (!isHere) input.parentNode.insertBefore(box, input); // в "Кастомные каналы" дублируется колорпикер

  input.type = 'hidden';
  code.className = 'color-code';
  code.pattern = '^#([A-Fa-f0-9]{6,8})$';
  code.type = 'text';

  var picker = new CP(box);
  $(picker.source).wrap('<div class="color-box-wrap" />');

  var isStepsWidget = $(picker.source).parents('.a20_steps').length;

  // add class for disable opacity panel + need css
  // picker.self.classList.add('no-alpha');


  // Prevent showing native color picker panel
  picker.source.addEventListener('click', function (e) {
    e.preventDefault();
  }, false);

  picker.on('enter', function (r, g, b, a) {
    var color = this.color(r, g, b, a);
    code.value = color;
    this.source.style.backgroundColor = color;
    this.source.setAttribute('data-color', color);
    // isStepsWidget ? $('.cch_colorpicker').trigger('change') : null;
    if (isStepsWidget && window.updateChannelsList) {
      $('.a20_settings_step31').is(':visible') ? updateChannelsList() : null;
    }
  });

  picker.on('change', function (r, g, b, a) {
    var color = this.color(r, g, b, a);
    this.source.value = color;
    code.value = color;
    input.value = color;
    this.source.style.backgroundColor = color;
    this.source.setAttribute('data-color', color);

    // Только для Каналы -> Кастомные каналы START
    if (this.source.closest(".custom-channels__wrapper")) {
      ChangeColorForIcon(this.source, color)
    }
    // Только для Каналы -> Кастомные каналы END

    if (isStepsWidget && window.updateChannelsList) {
      $('.a20_settings_step31').is(':visible') ? updateChannelsList() : null;
    }
  });


  picker.self.appendChild(code);

  function onChange() {
    if (this.value.length) {
      var color = CP.HEX(this.value);
      picker.set.apply(picker, color);
      picker.source.value = CP.HEX(color);

      picker.source.style.backgroundColor = CP.HEX(color);
      picker.source.setAttribute('data-color', CP.HEX(color));

      input.value = CP.HEX(color);

      // Только для Каналы -> Кастомные каналы START
      if (picker.source.closest(".custom-channels__wrapper")) {
        ChangeColorForIcon(this.source ? this.source.closest(".fields") : '', color)
      }
      // Только для Каналы -> Кастомные каналы END

      isStepsWidget ? $('.cch_colorpicker').trigger('change') : null;
    }
  }

  ['cut', 'paste', 'input', 'keyup'].forEach(function (name) { // добавить событие для 'keyup', 'input' и задержку при печати.
    code.addEventListener(name, onChange, false);
  });

  // добавить обновление в превью от ручного ввода
}

function IconRefreshKBSectionCancel(target) {
  let iconWrap = $(target);
  let defaultData = iconWrap.data('default');
  let defaultClassData = iconWrap.data('defaultclass');

  iconWrap.find('.form_item_icon_content').hide();

  if (defaultData) {
    // console.log('1')
    iconWrap.addClass('add_icon').find('.icon-wrap').removeClass('current');
    iconWrap.find('input').val('');
  } else {
    // console.log('2')
    iconWrap.find('.icon-wrap').removeClass('current');

    iconWrap.find('.icon-wrap[data-value="' + defaultClassData + '"]').addClass('current');
    iconWrap.find('input').val(iconWrap.find('.icon-wrap.current').attr('data-value'))

    let newStyleIcon = iconWrap.find('.icon-wrap.current i').attr('style');

    iconWrap.find('.form_item_icon i').removeAttr('style').attr('style', newStyleIcon);
  }
}


// Denis (05.12.2019)
document.addEventListener('DOMContentLoaded', () => {
  // Go to top button START
  (function () {
    const upButton = document.getElementById('up-button');
    const aside = document.querySelector('aside .sidebar-wrap');
    const main = document.querySelector('main .content-wrap');

    if (!upButton || !aside || !main) {
      return
    }

    window.onscroll = () => {

      if (window.pageYOffset >= 100 && main.offsetHeight >= aside.offsetHeight) {
        upButton.style.opacity = '.65';
        upButton.style.visibility = 'visible';
        upButton.style.zIndex = '1000';

        upButton.onclick = () => {
          (function toTop() {
            if (window.pageYOffset > 0) {
              window.scrollBy(0, -240);
              setTimeout(toTop, 10)
            }
          })()
        }
      } else {
        upButton.style.opacity = '0';
        upButton.style.visibility = 'hidden';
        upButton.style.zIndex = '-1'
      }
    }
  })();
  // Go to top button END

  // Каналы -> Правила -> Добавить/Редактировать правило. Логика для "Категория шаблона", а также
  // Каналы -> Шаблоны -> Добавить/Редактировать шаблон. Логика для "Шаблон доступен" START
  (function () {
    const choices = document.querySelector(".select_category--wrapper .choices .choices__item.choices__item--selectable");
    const item = document.querySelector(".select_category--wrapper .choices");
    if (!choices) return

    eventChoices();
    item.addEventListener('change', eventChoices);

    function eventChoices() {
      const choices = document.querySelector(".select_category--wrapper .choices .choices__item.choices__item--selectable");
      if (choices.getAttribute("data-value") === "-1") {
        choices.closest(".select_category--wrapper").querySelector("input").classList.replace("-none", "d-flex")
      } else {
        choices.closest(".select_category--wrapper").querySelector("input").classList.replace("d-flex", "-none")
      }
    }
  })();
  // Каналы -> Шаблоны -> Добавить/Редактировать шаблон. Логика для "Шаблон доступен" END

  // Встречающий попап. Появляется один раз только после регистрации аккаунта START
  (function () {
    const popupContainer = document.querySelector(".welcoming_popup"),
      topBlock = document.querySelector(".topBlock"),
      body = document.body;

    if (!popupContainer) return

    // {todo: Костыль. Когда этот попа-ап переедет в спец. файлы для поп-апа, тот этот код можно убрать START}
    let iframe
    setTimeout(() => {
      iframe = document.querySelector("iframe");
      iframe.classList.add("-z-none");
    }, 1000)
    // {todo: Костыль. Когда этот попа-ап переедет в спец. файлы для поп-апа, тот этот код можно убрать END}

    topBlock.classList.add("-z-none");
    body.classList.add("-overthrow-hidden");

    // Логика дотсов в попапе
    function unblockDots() {
      const buttonsContainer = document.querySelector('.dots-container');
      const tabs = document.querySelector('.welcoming_popup');

      buttonsContainer.addEventListener('click', event => {
        if (event.target.tagName !== "BUTTON") {
          return
        }

        let index = event.target.dataset.value;

        tabs.querySelector('.tab.-js-active').classList.remove('-js-active');
        tabs.querySelector('.tab--' + index).classList.add('-js-active');

        buttonsContainer.querySelector(".dots.-js-active").classList.remove("-js-active")
        event.target.classList.add("-js-active")
      });

      // Если мы разблокировали дотсы, то добавляем в localStorage запись
      const button = tabs.querySelector(".b_dark_theme")
      button.addEventListener("click", () => {
        localStorage.setItem('changeTheme', 'true');
      })
    }

    // Кнопки "Вперёд" и "Назад" в попапе
    popupContainer.addEventListener("click", event => {
      if (!event.target.closest(".-js-button")) {
        return
      } // если это не кнопка
      let index = event.target.closest(".-js-button").dataset.value; // индекс кнопки

      if (index === "end") {
        event.target.closest(".welcoming_popup_background").classList.add("-none")
        localStorage.removeItem('changeTheme');

        topBlock.classList.remove("-z-none");
        iframe.classList.remove("-z-none"); // не забыть убрать строку после переезда кода
        body.classList.remove("-overthrow-hidden");

        return
      } // если это конечный слайд - закрываем

      event.target.closest(".tab").classList.remove("-js-active") // инактивим текущий слайд
      event.target.closest(".welcoming_popup").querySelector(`.tab--${index}`).classList.add('-js-active'); // делаем активный другой

      event.target.closest(".welcoming_popup_background").querySelector(".dots-container .-js-active").classList.remove("-js-active")
      event.target.closest(".welcoming_popup_background").querySelector(`.dots-container button[data-value="${index}"] `).classList.add('-js-active')

      const element = event.target.closest(".welcoming_popup").querySelector(`.tab--${index}`)
      if (element.matches(".-js-last")) {
        unblockDots()
      } // Если мы увидели последний слайд - разблюкируем переключение по клику на дотсы
    })

    // Если запись спец. есть в localStorage - разблокируем дотсы
    const darkTheme = localStorage.getItem('changeTheme');
    if (darkTheme) {
      unblockDots()
    }
  })();
  // Встречающий попап. Появляется один раз только после регистрации аккаунта END
});

// Основная функция для парса меток пришедших из бэка
function addDelLabels(selected_labels, all_labels_list, input, location, markedLabels) {
  /**
   * @param selected_labels - выбранные метки
   * @param all_labels_list - все доступные метки
   * @param input - скрытый инпут
   * @param location - где искать select
   * @param markedLabels (принимает true или false) - маркировать новые метки или нет
   */

  // console.log(input)

  let element = input.closest(`.${location}`).querySelector("select"),
    variables = parsChoices(all_labels_list),
    hiddenInput = input.closest(`.${location}`).querySelector("input.hidden"), // cкрытый инпут
    select = element,
    option = uniqSelected(selected_labels),
    selected = [],
    temporary = [],
    newString;

  // Первый раз добавляем метки в скрытый инпут
  firstAddLabels(option, temporary, selected, hiddenInput);
  // А дальше слушаем события и по событию добавляем или удяляем метки
  select.addEventListener("addItem", () => addItemLabels(select, newString, temporary, selected, hiddenInput, markedLabels));
  select.addEventListener("removeItem", () => removeItemLabels(select, newString, temporary, selected, hiddenInput));

  select.addEventListener("search", (e) => {
    const nano = select.closest(".choices").querySelector(".nano-pane")
    const resultCount = e.detail.resultCount

    if (resultCount <= 12) {
      nano.style.display = "none"
    } else {
      nano.style.display = ""
      $(`.select_nano`).nanoScroller({alwaysVisible: true});
    }
  });

  const choices = new Choices(element, {
    searchResultLimit: 9999,
    searchEnabled: true,
    searchChoices: true,
    itemSelectText: '',
    removeItemButton: true,
    shouldSort: false,
    noChoicesText: Translate('alpha20_js/no_variants'),
    noResultsText: Translate('cases_labels_js/not_found'),
    addChoices: true,
    addItems: true,
    duplicateItemsAllowed: false,
    addItemText: (value) => {
      return Translate('cases_rules_edit_js/press_enter')+` <b>"${value}"</b>`;
    },
    choices: uniqSelected(variables, selected_labels)
  });

  choices.passedElement.element.addEventListener("change", () => choices.hideDropdown())
}

// Парсим доступные для выбора метки, которые пришли из бэка. Также добавляем необходимые свойства в метки для Choices.js
function parsChoices(arr) {
  if (!arr) {
    return
  }
  let variables = [];

  arr.forEach(function (e) {
    e.value = e.id;
    e.label = e.text;
    variables.push(e)
  });
  return variables
}

// Парсим выбранные метки, которые пришли из бэка. Также добавляем необходимые свойства в метки для Choices.js
function parsSelectedChoices(arr) {
  if (!arr) {
    return
  }
  let variables = [];

  arr.forEach(function (e) {
    e.value = e.id;
    e.label = e.text;
    e.selected = true;
    // console.log(e);
    variables.push(e)
  });
  return variables
}

// Перебираем массивы объектов пришедших из бэка для поля "Метки". Конкатенируем выбранные и доступные метки
function uniqSelected(...args) {
  const out = [];
  const map = {};
  args.forEach(arr => arr.forEach(item => {
    const {id} = item;
    if (id in map)
      return map[id].selected = true;
    out.push(map[id] = {...item});
  }));
  return out;
}

// Функция для события "Добавить метки" - "addItem". Используется в "Правилах" и "Шаблоны"
function addItemLabels(select, newString, temporary, selected, hiddenInput, markedLabels) {
  // Если нам нужно пометить новые метки, то в markedLabels передаём true
  if (markedLabels) {
    select.childNodes.forEach(element => {

      // Если нужно помечать новые метки, то в markedLabels передаём true, если нет - false
      if (markedLabels) {
        let isUsed = element.value.includes('e:');
        // Проверяем новая это метка или нет, если нет - добавляем "n:"
        (isUsed) ? newString = `${element.value}` : newString = `n:${element.value}`
      }
      // Передаём массив меток в скрытый input
      temporary.push(newString);
      selected = Array.from(new Set(temporary));
      hiddenInput.value = selected
    })
  } else {
    let option = select.querySelectorAll('option');
    temporary = [];

    option.forEach(element => {
      temporary.push(element.value)
    });
    // Передаём массив меток в скрытый input
    selected = Array.from(new Set(temporary));
    hiddenInput.value = selected
  }
}

// Функция для события "Удалить метки" - "removeItem". Используется в "Правилах" и "Шаблоны"
function removeItemLabels(select, newString, temporary, selected, hiddenInput) {
  let option = select.querySelectorAll('option');
  temporary = [];

  // console.log(option);

  option.forEach(element => {
    temporary.push(element.value)
  });
  // Передаём массив меток в скрытый input
  selected = Array.from(new Set(temporary));
  hiddenInput.value = selected
}

// Первый раз добавляем метки в скрытый инпут. Исп. на ст. "Добавить (или редактировать) правило, а также "Добавить (или редактирвоать) шаблон"
function firstAddLabels(option, temporary, selected, hiddenInput) {
  setTimeout(() => {
    option.forEach(element => {
      temporary.push(element.id)
    });

    selected = Array.from(new Set(temporary));
    hiddenInput.value = selected
  }, 1)
}

// Если нужно где-то заинитить Choices.JS
function choicesInit(select, param) {
  /** Передаём селекты и параметры. Например: choicesInit(element, { searchEnabled: false, shouldSort: false, itemSelectText: ''})
   * где element - это айтемы полученные через document.querySelectorAll(".hourList .hourRow:last-child select")
   * или choicesInit(".a20_articles select", { searchEnabled: false, shouldSort: false, itemSelectText: ''})
   */
  let elements
  if (typeof select === "string") {
    elements = Array.from($(`${select}`));
  } else if (typeof select === "object") {
    elements = Array.from(select);
  } else {
    console.error(Translate('js_js/error_text'));
  }

  // Если есть атрибут 'data-choice' - значит селект обрабатывался библиотекой - отбасываем его
  // const item = elements.filter(elements => !elements.getAttribute('data-choice'));
    let  item = elements;

    const instances = item.map((element) => {
//     choicesUpdate(element,'destroy');
     let uuid = '';

      while(1)
      {
          uuid = GenUid(16);
          if(!defaultChoiesInit[uuid])
          {
              break;
          }
      }
      $(element).attr('choices_uuid',uuid);
    const init = new Choices(element, param);
    isMultiple(init); // проверка на мультиселект
    defaultChoiesInit[uuid] = init;

    return init;
  });
  return instances

  // В мультиселекте при выборе айтема скрываем выпадающий список
  function isMultiple(init) {
    const select = init.passedElement.element.hasAttribute("multiple")
    if (select) {
      const element = init.passedElement.element
      forSpechialOption(element, init)
    }
  }
}
function choicesUpdate(select,method,val)
{
    let uuid = $(select).attr('choices_uuid')
    if(uuid
    && defaultChoiesInit[uuid])
    {
        if(method)
        {
            defaultChoiesInit[uuid][method](val);

        }
    }


}
// Кастомный скроллбар START
function InitNanoScrolls(start) {
  /**
   * @start - передаём либо пустую строку (например если мы инитим первый раз при загрузке страницы),
   * или же класс либо id родителя от которого будут искаться поля для для обработки и вставки скролла
   */
  CheckTemplatesTextareas(start);
  RedactorNano(start);
  TextareaNano(start);
  SelectNano(start);
  InputSelectNano();

  $(document).on("select2-opening select2-open", "input.search-select-box", InputSelectNano);

  $(document).on('change paste keyup focus input', ".select2-container .select2-input", InputSelectNano);

  $(document).on('change paste keyup', `${start} .textarea_nano textarea:not(.-js-no-nano)`, function () {
    $(`${start} .textarea_nano`).nanoScroller({alwaysVisible: true});

    let targetMarBott = parseFloat($(this).css('margin-bottom'));
    targetMarBott > 0
      ?
      $(this).parent().find('.nano-pane').css('margin-bottom', (targetMarBott + 7) + 'px')
      :
      null

    if (!$(this).parents('.textarea_nano').find('.nano-pane').is(':visible')) {
      $(this).removeClass('with-scroll');
      $(this).css('padding-right', '8px');
    } else {
      $(this).addClass('with-scroll');
      $(this).css('padding-right', '17px');
    }
    $(`${start} .textarea_nano`).nanoScroller({alwaysVisible: true});
    if ($(`${start} .info_panel_nano`).length) {
      $(`${start} .info_panel_nano`).nanoScroller({alwaysVisible: true});
    }
  });
}

function CheckTemplatesTextareas(start) {
  $(`${start} textarea:visible:not(.-js-no-nano):not(.textarea-for-nano)`).each(function (id, el) {
    var target = $(el);

    // добавляем textarea-for-nano для textarea что не является в последствии редактором
    let editor_id = target.attr('id');
    if(editor_id) {
      if(
        editor_id.match('_email_to_user') == null
        &
        editor_id.match('_add_note') == null
        &
        editor_id.match('_email_to_staff') == null
        &
        editor_id.match('_fwd_case_to_email') == null
        &
        editor_id.match('js_action_set_reopen_set_reopen') == null
      )
      {
        target.addClass('textarea-for-nano');
      }
    } else {
      target.addClass('textarea-for-nano');
    }
  })
}

function RedactorNano(start) {
  if ($(`${start} .redactor-box`).length == 0) {
    return false;
  }

  let target = $(`${start} .js_omni_redactor_container:visible:not(.-js-no-nano):not(.nano-content)`);

  target.each(function (id, el) {
    let parentWrap = $(el).parent();

    if (!parentWrap.hasClass('nano redactor_nano')) {
      $(el).addClass('nano-content').wrap("<div class='nano redactor_nano'></div>");
    }

    $(`${start} .redactor_nano .nano-content`).css('position', 'relative');
    $(`${start} .redactor_nano`).nanoScroller({alwaysVisible: true});
  })
}

function TextareaNano(start) {
  const main = document.querySelector("main.settings-smarttips__wrapper")
  if (main) return

  let target = $(`${start} .textarea-for-nano:visible:not(".-js-no-nano"):not(.nano-content)`);

  if(!target) {
    return
  }

  target.parent().addClass('textarea-for-nano-wrap');

  target.each(function (id, el) {
    let parentWrap = $(el).parent();

    if (!parentWrap.hasClass('nano textarea_nano')) {
      $(el).addClass('nano-content').wrap("<div class='nano textarea_nano'></div>");
    }

    $(`${start} .textarea_nano`).nanoScroller({alwaysVisible: true});

    if (!$(`${start} .textarea_nano`).find('.nano-pane').is(':visible')) {
      target.removeClass('with-scroll');
    } else {
      target.addClass('with-scroll');
    }
  })
}

function SelectNano(start) {
  $(`${start} .choices:visible:not(".-js-no-nano")`).on("showDropdown", nanoInitForEvent);
  $(`${start} .choices:visible:not(".-js-no-nano")`).on("change", nanoInitForEvent);

  function nanoInitForEvent() {

    if (!$(this).find(".select_nano")[0]) {
      $(this).find(".choices__list--dropdown .choices__list").wrap("<div class='nano select_nano'></div>")
    }

    const heg = $(this).find(".choices__list--dropdown .choices__list").height()
    if (heg >= 300) {
      $(this).find(".choices .nano-pane").show();
    } else {
      $(this).find(".choices .nano-pane").hide();
    }

    $(this).find(".choices__list--dropdown .choices__list").addClass("nano-content")
    $(this).find(".select_nano").nanoScroller({alwaysVisible: true});
  }
    $(start).each( function(id, el) {
        let parentWrap = $(el).parent();

        if(!parentWrap.find('.chosen-results').parent().hasClass('nano select_nano')) {
            parentWrap.find('.chosen-results').addClass('nano-content').wrap("<div class='nano select_nano'></div>");
        }
        $(parentWrap).find(".select_nano").nanoScroller({alwaysVisible: true});
    })
}

function InputSelectNano() {
  let target = $('.select2-drop');

  let len = target.length;

  if(!len) {
      return
  }

  for (let i=0; i<len; i++) {
      let el = $(target[i]);

      if(!el.hasClass('nano inp_select_nano')) {
          el.addClass('nano inp_select_nano').find('.select2-results').addClass('nano-content');
      }
  }

  const heg = $(".select2-results.nano-content:visible").height()
  if (heg >= 200) {
    $(".inp_select_nano:visible .nano-pane").show();
    setTimeout(function() {
      $(".inp_select_nano").nanoScroller({alwaysVisible: true});
    }, 400)
  } else {
    $(".inp_select_nano:visible .nano-pane").hide();
    setTimeout(function() {
      $(".inp_select_nano").nanoScroller({alwaysVisible: true});
    }, 400)
  }

  $(".inp_select_nano").nanoScroller({alwaysVisible: true});
}

// Кастомный скроллбар END

// Если выбрали опцию с value="-1", то нужно все другие варианты выбора скрыть
function forSpechialOption(element, init) {
  /**
   * @param element - сам select
   * @param init - инстанс Choices.js
   */
  const SPECIAL_OPTION_DIV = `<div class="choices__item choices__item--choice has-no-choices-special">`+Translate('cases_rules_edit_js/others_variants_unavailable')+`</div>`;
  let div, multiple, multipleChild, choicesList;
  let specials_vals = [
      '-5',
      '-4',
      '-3',
      '-2',
      '-1',
      'staff_or_status'
  ]

  disabledInput()

  element.addEventListener('removeItem', (event) => {
    // Показываем выпадающий список вариантов и скрываем DIV с текстом "При выборе этого варианта другие недоступны"
    if (
        specials_vals.indexOf(event.detail.value.split(':')[0]) != -1
        //event.detail.value === "-1"
    ) {
      event.target.closest('.choices').querySelector('.choices__list.choices__list--dropdown .choices__list').hidden = false;
      const special = event.target.closest('.choices').querySelector('.choices__list .has-no-choices-special')
      event.target.closest('.choices').querySelector(".choices__input.choices__input--cloned").style.display = ""
      if (special) special.hidden = true
    }

    let choices = choicesList = event.target.closest('.choices').querySelector('.choices__inner .choices__list.choices__list--multiple');
    let child;

    if (choices.children && choices.children.length > 0) {
      child = choices.children;

      for (let i = 0; i < child.length; i++) {
        if (
            //child[i].getAttribute('data-value') !== '-1'
            specials_vals.indexOf(child[i].getAttribute('data-value').split(':')[0]) == -1
        ) {
          setTimeout(() => {
              for(let k in specials_vals)
              {
                  $(event.target).closest('.choices').find('.choices__list.choices__list--dropdown [data-value^="'+specials_vals[k]+'"]').remove()
              }
          }, 1)
        }
      }
    }

    let dropdownElements = event.target.closest('.choices').querySelector(".choices__list.choices__list--dropdown .choices__list");
    if (dropdownElements.children.length > 1) {
      setTimeout(() => {
        let isActive = event.target.closest('.choices').querySelector(".choices__list.choices__list--dropdown");
        if (isActive) {
          isActive.classList.remove('-none');
          isActive.classList.add('-block')
        }
      }, 1)
    }

    disabledInput()
    if(init.choiceList) { // проверка на undefined
      init.hideDropdown();
    }
  });

  element.addEventListener('addItem', (event) => {
    if (
        specials_vals.indexOf(event.detail.value.split(':')[0]) != -1
        //event.detail.value === "-1"
    ) {
      // event.target.closest('.choices').querySelector(`.choices__list.choices__list--dropdown .choices__list [data-value="-1"]`).hidden = false
      choicesList = event.target.closest('.choices').querySelector('.choices__list.choices__list--dropdown .choices__list');
      div = event.target.closest('.choices').querySelector('.has-no-choices-special'); // DIV с текстом "При выборе этого варианта другие недоступны"

      choicesList.hidden = true;

      if (div) div.hidden = false;
      // Если div-а нет в DOM - добавляем (добавляется только 1 раз)
      if (!div) choicesList.insertAdjacentHTML('beforeBegin', SPECIAL_OPTION_DIV)

      multiple = event.target.closest('.choices').querySelector('.choices__list.choices__list--multiple'); // выбранные варианты
      multipleChild = multiple.children;

      for (let index = 0; index < multipleChild.length; index++) {
        if (
            specials_vals.indexOf(multipleChild[index].getAttribute('data-value').split(':')[0]) == -1

            //    multipleChild[index].getAttribute('data-value') !== '-1'
        ) {
          multipleChild[index].style.display = 'none'
        }
      }

      event.target.closest('.choices').querySelector(".choices__input.choices__input--cloned").style.display = "none"

      // фиксим добавление опции по клику на Enter
      setTimeout(() => {
        const allOption = Array.from(choicesList.children)

        allOption.forEach(element => {
          element.classList.remove("is-highlighted")
        })
      }, 1);
    } else if (
        specials_vals.indexOf(event.detail.value.split(':')[0]) == -1
//        event.detail.value !== "-1"
  )
    {
      event.target.closest('.choices')
        .querySelector(".choices__input.choices__input--cloned").style.display = ""
      setTimeout(() => {
          for(let k in specials_vals)
          {
              $(event.target).closest('.choices').find('.choices__list.choices__list--dropdown [data-value^="'+specials_vals[k]+'"]').remove()
          }
      }, 1)
    }

    disabledInput()
    if(init.choiceList) { // проверка на undefined
      init.hideDropdown();
    }
  });

  element.addEventListener('showDropdown', (event) => {
    let select = Array.from(event.target);
    select.forEach(element => {
        if (
          //element.value == '-1'
          specials_vals.indexOf(element.value.split(':')[0]) != -1
        //event.detail.value === "-1"

    ) {

        choicesList = event.target.closest('.choices').querySelector('.choices__list.choices__list--dropdown .choices__list');
        choicesList.hidden = 'true';
        div = event.target.closest('.choices').querySelector('.has-no-choices-special'); // DIV с текстом "При выборе этого варианта другие недоступны"

        if (div) div.hidden = false;

        // Если div-а нет в DOM - добавляем (добавляется только 1 раз)
        if (!div) choicesList.insertAdjacentHTML('beforeBegin', SPECIAL_OPTION_DIV)
      } else// if (element.value !== '-1')
      {

            for(let k in specials_vals)
            {
                $(event.target).closest('.choices').find('.choices__list.choices__list--dropdown [data-value^="'+specials_vals[k]+'"]').remove()
            }

      }
    })
  });

  // Если выбрали "особую" опцию, то дизейблим инпут
  function disabledInput() {
    const values = Array.from(element.closest(".choices").querySelectorAll(".choices__list.choices__list--multiple .choices__item"))
    const input = element.closest(".choices").querySelector(".choices__input.choices__input--cloned")
    const isSpecial = values.some(element => (element ? element.getAttribute("data-value").split('')[0] : '' === "-"));
    isSpecial ? input.classList.add("-none") : input.classList.remove("-none")
  }
}

function customSearchMultiple() {
  const target = event.target.closest(".choices.is-open")
  if (!target) return;

  spechialInSearch(target)
  const option = target.querySelectorAll(".choices__list--dropdown .choices__item--selectable")
  option.forEach(element => {
    const text = element.textContent.replace(/\s+/g, ' ').trim() // убираем лишние пробелы
    const regexp = new RegExp(`${event.detail.value}`, 'i')
    const rez = text.replace(regexp, (str) => `<span class="-underline">${str}</span>`)
    element.childNodes[0].remove() // удаляем текстовую ноду
    element.insertAdjacentHTML("afterbegin", rez) // вставляем span с текстом
  })

  $(this).find(".select_nano").nanoScroller({alwaysVisible: true});
}

// фикс-функция для мультиселектов и одиночных селектов
function spechialInSearch(target) {
  // Если мы выбрали хоть одну опцию и при поиске нашлась опция с value = -1 -- то мы её не показываем
  setTimeout(() => {
    const values = Array.from(target.querySelectorAll(".choices__list--dropdown .choices__item"))
    const selected = target.querySelector(".choices__list--multiple .choices__item")

    if (selected) {
      values.filter(element => {
        if (element.getAttribute("data-value") === "-1") {
          element.classList.add('-none');
        }
      });
    }
  }, 1)

  // фиксим кастомный скролл при нажатии на Backspace
  ;(function () {
    const id = target.querySelector("select").id
    const dropdown = target.querySelector(".choices__list--dropdown .choices__list")
    const selector = id ? `#${id}` : `[name='${target.querySelector("select").getAttribute("name")}']` // если нет id, то получаем нужный селект по name
    const nano = $(selector) ? $(selector).closest(".choices ").find(".select_nano") : null

    setTimeout(() => {
      const heg = dropdown.offsetHeight
      if (heg >= 300 && nano) {
        nano.show()
        nano.nanoScroller({alwaysVisible: true});
      }
    }, 1)
  })();
}

// ф-ция для события клавиатуры
function keyUpEvent() {
  /** Вызовы функций **/
  customSearchChoices() // поиск в селектах
  hiddenElements(".pp_list") // cкрываем поп-ап с иконками при клике на Escape
  hiddenElements(".form_item_icon_content") // cкрываем поп-ап с метками при клике на Escape

  /** Функции **/

  // кастомный поиск для одиночных селектов и маленький фикс для мультиселекта
  function customSearchChoices() {
    const target = document.querySelector(".choices.is-open")
    if (!target) return;

    const type = event.target.closest(".choices")?event.target.closest(".choices").getAttribute("data-type") : '' // в мультиселекте таргет будет на инпуте, а не на .choices
    if (event.key === "Backspace") spechialInSearch(target); // фикс для мультиселекта и поиска
    if (type !== "select-one") return

    const key = event.key.toLowerCase();
    const options = Array.from(event.target.querySelectorAll(".choices__list--dropdown .choices__item"));
    selectOne()

    // при сворачивании выпадающего списка удаляем все классы
    event.target.removeEventListener("hideDropdown", removeClass)
    event.target.addEventListener("hideDropdown", removeClass)

    // ф-ция для удаления классов при сворачивании выпадающего списка
    function removeClass(event) {
      const choices = event.target.closest(".choices").querySelectorAll(".choices__list--dropdown .choices__item")
      choices.forEach(element => element.classList.remove("-is-highlighted", "is-highlighted"))
    }

    // для одиночных селектов
    function selectOne() {
      // ищем опции, которые начинаются на искомую букву
      const choices = options.filter((text) => {
        text.textContent = text.textContent.replace(/\s+/g, ' ').trim() // убираем лишние пробелы
        if (text.textContent.toLowerCase().startsWith(key) && !text.matches(".-is-highlighted")) return text
      });

      let target;

      // если это была последняя искомая опция, а все остальные уже были выделяемые, то в else нужно убрать все классы и начать с первой
      if (choices.length) {
        target = highlighted(choices)
      } else {
        options.forEach((text) => text.classList.remove("-is-highlighted", "is-highlighted"));
        const choices = options.filter((text) => text.textContent.toLowerCase().startsWith(key) && !text.matches(".-is-highlighted"));
        target = highlighted(choices)
      }

      // target?.scrollIntoView({behavior: "smooth"}); // скроллим к опции
      if (target) target.parentNode.scrollTop = target.offsetTop;

      // подсвечиваем опцию, если нашли нужную
      function highlighted(choices) {
        let index = (choices.findIndex((selected) => selected.matches(".-is-highlighted")) + 1);

        choices[index]?choices[index].classList.add("-is-highlighted", "is-highlighted"):''

        options.filter((text) => {
          const data = text.getAttribute("data-value")
          if (data !== choices[index]?choices[index].getAttribute("data-value"):null) {
            text.classList.remove("is-highlighted")
          }
        });
        return choices[index]
      }
    }
  }

  // cкрываем элементы при клике на Escape
  function hiddenElements(element) {
    const target = document.querySelectorAll(element) // поп-ап с иконами
    if (target.length === 0) return

    target.forEach(element => {
      if (element.offsetHeight === 0) return
      element.style.display = 'none'
    })
  }
}

function clickEvent() {
  (function () {
    const target = document.querySelectorAll(".form_item_icon_content") // поп-ап с иконами
    // если нет поп-апа с иконами, кликнули на него или на иконку - выходим
    if (target.length === 0 || event.target.closest(".form_item_icon_content") || event.target.closest(".form_item_icon_wrap")) return

    target.forEach(element => {
      if (element.offsetHeight === 0) return
      element.style.display = 'none'
    })
  })();

  (function () {
    const target = document.querySelectorAll(".pp_list") // поп-ап с иконами
    // если нет поп-апа с метками или кликнули на него - выходим
    if (target.length === 0 || event.target.closest(".pp_list") || event.target.closest(".pp_action") || event.target.closest(".a16_pp_action")) return

    target.forEach(element => {
      if (element.offsetHeight === 0) return
      element.style.display = 'none'
    })
  })();
}
function changeClientTheme(b_dark)
{
    // $('#welcoming_popup .content-unit:visible a .icon-checked').remove()
    $('#welcoming_popup .content-unit:visible').removeClass('-js-active')
    if(!b_dark)
    {
        $('link#dark_css_link').remove();
        $('#welcoming_popup .content-unit:visible:eq(0)').addClass('-js-active')
        $('li.b_dark_theme a').text(Translate('js_js/dark_theme'))
    }
    else
    {
        $('head').append('<link rel="stylesheet" href="/bundles/acmeclient/css/dark-theme/_dark-theme.css" type="text/css" id="dark_css_link"/>')
        $('#welcoming_popup .content-unit:visible:eq(1)').addClass('-js-active')
        $('li.b_dark_theme a').text(Translate('js_js/light_theme'))
    }

}
