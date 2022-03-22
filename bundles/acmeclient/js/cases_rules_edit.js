let setOpenSelect = false;
let ui_id = '';
let cur_select = null;
let isYouScan = false;

$(document).ready(function () {

  //  Change title by lang
   $(document).on('click', '.rule_titles .change_form_title', function(e){
     e.preventDefault();
     $(this).parents('.rule_titles').find('.change_form_title').removeClass('active');
     $(this).addClass('active');
     let lang_id  = $(this).data('lang_id');
     $(this).parents('.rule_titles').find('.rule_title').hide();
     $(this).parents('.rule_titles').find('#title_'+lang_id).show();
   });

   //  Change description by lang
    $(document).on('click', '.rule_descriptions .change_form_description', function(e){
      e.preventDefault();
      $(this).parents('.rule_descriptions').find('.change_form_description').removeClass('active');
      $(this).addClass('active');
      let lang_id  = $(this).data('lang_id');
      $(this).parents('.rule_descriptions').find('.rule_description').hide();
      $(this).parents('.rule_descriptions').find('#description_'+lang_id).show();
    });
    //  Change group title by lang
     $(document).on('click', '.rule_group_titles .change_form_group_title', function(e){
       e.preventDefault();
       $(this).parents('.rule_group_titles').find('.change_form_group_title').removeClass('active');
       $(this).addClass('active');
       let lang_id  = $(this).data('lang_id');
       $(this).parents('.rule_group_titles').find('.rule_group_title').hide();
       $(this).parents('.rule_group_titles').find('#group_titles_'+lang_id).show();
     });

  // init clockpicker
  $('.clockpicker_input:visible').clockpicker({
    autoclose: true
  });

  $('.clockpicker_input').change(function() { // для редактирования правил
    ClockpickerAction($(this))
  })

  // add Row
  $('.sc .addRow a').click(function (event) {
    add_rule_row('.sc', 'all_conditions', 'rule_default');
    return false;
  });
  $('.sc1 .addRow a').click(function () {
    add_rule_row('.sc1', 'every_conditions', 'rule_default');
    return false;
  });
  $('.sc2 .addRow a').click(function () {
    add_rule_row('.sc2', '', 'action_default');
    return false;
  });
  $(document).on('keydown', 'input[maxlength]', function (e) {
    if ($(this).val().match(/[,\.]/)) {
      $(this).attr('maxlength', 5)
    } else {
      $(this).attr('maxlength', 4)
    }

  });
  $('.acrList').each(function () {
    // Перемещает section при редактировании/создании Правила
    $(this).sortable({
      handle: ".js-move-item"
    });
  });

  $('.main-select').change(function (e,b_manual) {
    change_main_select(this);
      if(!b_manual)
      {
          setRequiredCondition()
      }
  });
  $('.frstItem:visible select').each(function () {
    change_main_select(this);
  });

  $('.scndItem:visible select').each(function (idx, element) {
    CheckDisabledItems($(this));
  });
    $('.sc1 .scndItem:visible.scnd-rule_time_hour_type select option[value=for]').remove()
    $('.sc1 .scndItem:visible.scnd-rule_time_hour_type select option[value=repeat]').remove()

    $('.sc1 .scndItem:visible.scnd-rule_time_hour_type .choices__item[data-value=for]').remove()
    $('.sc1 .scndItem:visible.scnd-rule_time_hour_type .choices__item[data-value=repeat]').remove()

  $(document).on('change', '.scndItem select', function (event) {
    CheckDisabledItems($(this));
    convertSomeSelectsText();
  });

  // Категория шаблона
  (function () {
    setTimeout(() => {
      const choices = document.querySelector(".select_category--wrapper .choices .choices__item.choices__item--selectable");
      const item = document.querySelector(".select_category--wrapper .choices");

      if (choices.getAttribute("data-value") === "-1") {
        choices.closest(".select_category--wrapper").querySelector(".rule_group_titles").classList.replace("-none", "d-flex")
      } else {
        choices.closest(".select_category--wrapper").querySelector(".rule_group_titles").classList.replace("d-flex", "-none")
      }
      item.addEventListener('change', () => {
        const choices = document.querySelector(".select_category--wrapper .choices .choices__item.choices__item--selectable");
        if (choices.getAttribute("data-value") === "-1") {
          choices.closest(".select_category--wrapper").querySelector(".rule_group_titles").classList.replace("-none", "d-flex")
        } else {
          choices.closest(".select_category--wrapper").querySelector(".rule_group_titles").classList.replace("d-flex", "-none")
        }
      })
    }, 1)
  })();


  // Слой маска для selects при редактировании правил
  (function () {
    // setTimeout(() => {
      let isEditPage = location.href.match('exist') == null;
      if(isEditPage) {
        let visible_selects = $('.acrList').find('select:visible:not([multiple])');
        visible_selects.each(function() {
          let val = $(this).children('option:selected').text().trim();

          $(this).wrap('<div class="select_wrap_mask" />');

          $(this).parent().append('<div class="select_mask_value">'+val+'</div>');
        })
      }

    // }, 1)
  })();

  // Проверка для YouScan
  (function() {
    YouScanConfig();
    setRequiredCondition()

  })();

  $(document).on('click', '.select_wrap_mask', function () {
    let li = $(this).closest('li');
    let select = li.find('select');
    let frstItem = li.find('.frstItem:visible');
    let scndItem = li.find('.scndItem:visible');

    if($(this).find('select')[0].hasAttribute('disabled') || $(this).find('.select_mask_value').hasClass('disabled')) {
      return
    }

    if(!$(this).children('.choices').length) {
      ui_id = '';
      select.removeClass('-js-noMySelect');

      // инит первого селекта строки условия, возможно надо другие параметры
      choicesInit(frstItem.find('select'), {
        searchEnabled: false,
        itemSelectText: "",
        shouldSort: false,
        removeItemButton: false,
        resetScrollPosition: false,
      });

      frstItem.find('.select_mask_value').hide();

      change_main_select(frstItem.find('select'));

      CheckDisabledItems(scndItem.find('select'));

      setOpenSelect = true;
      cur_select = $(this).find('select');
    }

    return false;
  });

  $(document).on('click', '.span_set_reopen_1 a', function () {
    $(this).parent().find('a').removeClass('active');
    $(this).addClass('active');
    $(this).parent().find('input').val($(this).attr('rel'));
    return false;
  });

  // Для второй части правил
  function CheckDisabledItems(el) {
    setTimeout(() => {
      var select_val = el.val();
      //  Оценка качества ответов
      if (select_val && typeof select_val == 'string' && select_val.match(/^cf_date_/)) {
        el.closest('.scndItem').addClass('css_cf_date');
        el.closest('.scndItem').find('.input_calendar_ico, .css_cf_date__input, input,span').hidden = true;

        if (select_val == 'cf_date_-1' || select_val == 'cf_date_2' || select_val == 'cf_date_3') {
          el.closest('.scndItem').find('.input_calendar_ico,.input_calendar_ico input').addClass("hidden") // датапикер
          el.closest('.scndItem').find('.action_field_class').addClass("hidden")
          el.closest('.scndItem').find('span').removeClass("-block-important")
          el.closest('.scndItem').find('.css_cf_date__input').addClass("hidden")
        } else if (select_val == 'cf_date_1') {
          el.closest('.scndItem').find('.action_field_class').addClass("hidden")
          el.closest('.scndItem').find('.input_calendar_ico,.input_calendar_ico input').removeClass("hidden") // датапикер
          el.closest('.scndItem').find('span').removeClass("-block-important")
          el.closest('.scndItem').find('.css_cf_date__input').addClass("hidden")
          InitCfDatepickers(true);
        } else if (select_val == 'cf_date_4' || select_val == 'cf_date_5') {
          el.closest('.scndItem').find('.action_field_class').removeClass("hidden")
          el.closest('.scndItem').find('.input_calendar_ico,.input_calendar_ico input').addClass("hidden")// датапикер
          el.closest('.scndItem').find('span').addClass("-block-important")
          el.closest('.scndItem').find('.css_cf_date__input').removeClass("hidden")
        }
      } else if (select_val && (select_val == 'yesterday' || select_val == 'today' || select_val == 'tomorrow')) {
        el.closest('.scndItem').next().find('input').parent().parent().removeClass("-block")
        el.closest('.scndItem').next().find('input').parent().parent().addClass("hidden")
      } else if (select_val === "equal" || select_val === "not equal" || select_val === "less" || select_val === "more") {
        const scndItemClassName = Array.from(el.closest('.scndItem')[0].classList)
        const cfNumber = scndItemClassName.filter(element => element.includes("scnd-cf"))
        if (cfNumber[0]) {
          const cf = cfNumber[0].split("scnd-")
          const cfString = cf[1]
          el.closest('.scndItem').next().find('input').parent().parent().removeClass("hidden")
          el.closest('li').find(`.lstItem.lst-${cfString}`).addClass("-block")
        }
      } else if (select_val && typeof select_val == 'string' && select_val.match(/cf_date/)) {
        el.closest('.scndItem').next().find('input').parent().show();
        InitCfDatepickers(true);
      }

      if (select_val && !el[0].closest('.scnd-rating.-block')) {
        var prop_disabled = false;
        if (select_val.indexOf('disabled') >= 0) {
          prop_disabled = true;
        }

        var next_el = el.closest('.scndItem').next();
        next_el.find('input, textarea, select').prop('disabled', prop_disabled);

        // disabled for select_mask
        if(prop_disabled){
          next_el.find('select').each(function() {
            $(this).next().hasClass('select_mask_value') ? $(this).next().addClass('disabled').text('') : null;
          })
        }

        next_el.find('select').each(function () {
          if ($(this).attr('name').indexOf('default') == -1) {
            // Включаем селект
            if(!isYouScan && $(this).val() !== '18') {
              $(this).closest(".choices").removeClass("is-disabled").removeClass("-js-focused")
            }
            $(this).closest(".choices").find('.choices__list.choices__list--dropdown').removeClass("-none")
            if (prop_disabled) {
              // Дизейблим селект
              $(this).closest(".choices").addClass("is-disabled").addClass("-js-focused")
              $(this).closest(".choices").find('.choices__list.choices__list--dropdown').addClass("-none")
            }
          }
        });
      }
      if (el[0] && el[0].closest('.scnd-rating.-block')) {
        if (select_val == "has been") disabledElement(el, "has been")
        if (select_val == "has not been") disabledElement(el, "has not been")
        if (select_val == "consist") disabledElement(el, "consist")
        if (select_val == "not consist") disabledElement(el, "not consist")
        if (select_val == "equal") disabledElement(el, "equal")
        if (select_val == "not equal") disabledElement(el, "not equal")
      }
      // В "Правило срабатывает" - "при"
      if (el.val() === "for") {
        el[0].closest('li').querySelector("[data-scnd='for']").classList.replace("hidden", "-block");
        el[0].closest('li').querySelector("[data-scnd='in time']").classList.replace("-block", "hidden");

        const elements = el[0].closest('li').querySelectorAll("[data-scnd='for'] select:not(.-js-noMySelect)");
        choicesInit(elements, {
          searchEnabled: false,
          shouldSort: false,
          itemSelectText: '',
          noResultsText: Translate('alpha20_js/no_results'),
          noChoicesText: Translate('alpha20_js/no_variants')
        });
      }

      // В "Правило срабатывает" - "во время"
      if (el.val() === "in time") {
        const inTime = el[0].closest('li').querySelector("[data-scnd='in time']")
        const forTime = el[0].closest('li').querySelector("[data-scnd='for']")

        if (inTime) inTime.classList.replace("hidden", "-block");
        if (forTime) forTime.classList.replace("-block", "hidden");

        const elements = el[0].closest('li').querySelectorAll("[data-scnd='in time'] select:not(.-js-noMySelect)");
        choicesInit(elements, {
          searchEnabled: false,
          shouldSort: false,
          itemSelectText: '',
          noResultsText: Translate('alpha20_js/no_results'),
          noChoicesText: Translate('alpha20_js/no_variants')
        });
      }
      if (el.val() === "repeat") {
          el[0].closest('li').querySelector("[data-scnd='repeat']").classList.replace("hidden", "-block");
          el[0].closest('li').querySelector("[data-scnd='in time']").classList.replace("-block", "hidden");

          const elements = el[0].closest('li').querySelectorAll("[data-scnd='repeat'] select:not(.-js-noMySelect)");
          choicesInit(elements, {
              searchEnabled: false,
              shouldSort: false,
              itemSelectText: '',
              noResultsText: Translate('alpha20_js/no_results'),
              noChoicesText: Translate('alpha20_js/no_variants')
          });
      }

      $(document).off('change', '.letters_content.scnd-perform_sound select')
      $(document).on('change', '.letters_content.scnd-perform_sound select', function () {
        var audio = new Audio('/bundles/notification_sounds/' + $(this).val() + '.wav');
        audio.play();
      });
      $(document).off('click', '.scnd-perform_sound a.listen_audio')
      $(document).on('click', '.scnd-perform_sound a.listen_audio', function () {
        var audio = new Audio('/bundles/notification_sounds/' + $(this).parent().find('select').val() + '.wav');
        audio.play();
      });

      if (el[0] && (el[0].closest(".scndItem.scnd-perform_sound.-block") ||
        el[0].closest(".scndItem.scnd-perform_push.-block") ||
        el[0].closest('.scndItem.scnd-group_id.-block') ||
        el[0].closest('.scndItem.scnd-email_to_group.-block') ||
        el[0].closest('.scndItem.scnd-email_to_staff.-block'))) {
        specialOption(el[0])
      }
      if (el[0] && (el[0].closest('.scndItem.scnd-staff_id:not(.hidden)') ||
        el[0].closest('.scndItem.scnd-take_chat:not(.hidden)'))) {
        specialOption(el[0])
          // optionallyField(el[0])
          handleStaffExcludeWidget(el[0])
      }
    }, 1)
  }

  //для удаления строк условия и действий
  acrDeleteRow();
  init_email_replace_fields();

  $(document).on('click', '.change_form', function () {
    let target = $(this)
    var lang_id = $(this).attr('data-lang_id');
    var action_id = $(this).parents('li')[0].id.match(/[0-9]+$/).toString();
    // Язык
    target.parent().find('a.change_form').removeClass('active');
    target.addClass('active');

    target.closest(".acrItem").find('input[id^=form_subject_email_to_user_' + action_id + ']').hide();
    var el = target.closest(".acrItem").find('input#form_subject_email_to_user_' + action_id + '_' + lang_id).show();

    target.closest(".acrItem").find('input[id^=form_from_email_to_user_' + action_id + ']').hide();
    var el = target.closest(".acrItem").find('input#form_from_email_to_user_' + action_id + '_' + lang_id).show();

    target.closest(".acrItem").find('textarea[id^=form_content_email_to_user_' + action_id + ']').parent().hide();
    var el = target.closest(".acrItem").find('textarea#form_content_email_to_user_' + action_id + '_' + lang_id).parent().show();

    /////
    ;(function (){
      const hide = target.closest(".acrItem").find(`textarea[id^=form_content_message_to_chat_${action_id}]`)
      const show = target.closest(".acrItem").find(`textarea#form_content_message_to_chat_${action_id}_${lang_id}`)

      hide.each((idx, element) => {
        if (!element.closest(".letters_content.hidden")) {
          element.style.display = "none"
        }
      })

      show.each((idx, element) => {
        if (!element.closest(".letters_content.hidden")) {
          element.style.display = "block"
        }
      })
    })();
    //////

    /////
    ;(function (){
      const hide = target.closest(".acrItem").find('textarea[id^=form_content_comment_to_post_' + action_id + ']')
      const show = target.closest(".acrItem").find('textarea#form_content_comment_to_post_' + action_id + '_' + lang_id)

      hide.each((idx, element) => {
        if (!element.closest(".letters_content.hidden")) {
          element.style.display = "none"
        }
      })

      show.each((idx, element) => {
        if (!element.closest(".letters_content.hidden")) {
          element.style.display = "block"
        }
      })
    })();
    //////

    InitNanoScrolls(`#${el.closest("li")[0].id}`)
    return false;
  });
  $(document).on('click', '.text_type_hours_select a', function () {
    var type = $(this).attr('rel');
    $(this).parent().find('a').removeClass('active');
    $(this).addClass('active');
    $(this).parent().parent().find('input.hidden_type_hours_id').val(type);
    return false;
  });
  //
  $(document).on('click', '.text_type_content_select a', function () {
    var type = $(this).attr('rel');
    $(this).parent().find('a').removeClass('active');
    $(this).addClass('active');
    $(this).parent().parent().find('input.hidden_type_content_id').val(type);
    return false;
  });
  //
  $(document).on('focus', '.text_type_hours', function () {
    $(this).parent().find('div.text_type_hours_select').addClass('focus');
    $(this).parent().addClass('focus');
  });
  $(document).on('focusout', '.text_type_hours', function () {
    $(this).parent().find('div.text_type_hours_select').removeClass('focus');
    $(this).parent().removeClass('focus');
  });

  $('#edit_rule_btn').click(function (e) {

    let lstLabels = document.querySelectorAll(".lstItem.lst-labels.-block select");
    let scndAddLabels = document.querySelectorAll(".scndItem.scnd-add_labels.-block select");
    let scndRemoveLabels = document.querySelectorAll(".scndItem.scnd-remove_labels.-block select");

    // if (lstLabels) {
    //   lstLabels.forEach(element => {
    //     element.remove()
    //   })
    // } else if (scndAddLabels) {
    //   scndAddLabels.forEach(element => {
    //     element.remove()
    //   })
    // } else if (scndRemoveLabels) {
    //   scndAddLabels.forEach(element => {
    //     element.remove()
    //   })
    // }

    e.preventDefault();

    var errors = [];
    var errors_fields = [];

    var subjEmpty = Array.from($('.rule_titles input[name*=title]')).every((item) => $(item).val().trim().length === 0)
    if (subjEmpty) {
      errors.push('EMPTY_TITLE');
      errors_fields.push('rule_title');
    }

    if (errors.length > 0) {
      ShowNotification(errors, errors_fields);
    } else {
      // todo Код ниже долго выполняется, надо на сабмите отправлять только нужные данные, без скрытых. Как вариант можно ненужным полям делать disabled
      ShowSpinButton('edit_rule_btn');

      $('#form_edit_rule').find('div:hidden input:hidden,div:hidden select:hidden,div:hidden textarea:hidden').each(function () {
        if (!$(this).closest('.letters_content:visible').length) {
          // $(this).remove();
          $(this).prop('disabled', true);
        }
      });
      $('#form_edit_rule').submit();


      //!!! ВАРИАНТ 1
      // let xhr = new XMLHttpRequest();

      // let json = $('#form_edit_rule div').not(':hidden').find('input, select, textarea').not(':hidden').serialize();

      // xhr.open("POST", '/')
      // xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

      // xhr.send(json);

      //!!! ВАРИАНТ 2
      // var $form = $('<form>', {
      //   action: '',
      //   method: 'post'
      // });
      // $('#form_edit_rule div').not(':hidden').find('input, select, textarea').not(':hidden').each(function () {
      //       $(this).clone().appendTo($form);
      // });

      // $form.appendTo('body').submit();

    }
  });
  convertSomeSelectsText()

});

$(document).on('change', '.lstItem select', function (e,b_manual) {
  let selectVal = $(this).val();
  let wrap = $(this).parents('.lstItem');

  wrap.find('.clockpicker').hide();
  if (selectVal == 7) {
    wrap.find('.clockpicker_input').clockpicker({
      autoclose: true
    }).change(function() { // для новых clockpicker_input, потому что по другому не хочет работать в динамике
      ClockpickerAction($(this))
    });

    wrap.find('.clockpicker_input').val('... — ...');

    wrap.find('.clockpicker').show();
    wrap.find('.clockpicker_input').clockpicker('show');
  }

  YouScanConfig();
  if(!b_manual)
  {
      setRequiredCondition()
  }
  convertSomeSelectsText();
});

$(document).on('click', '.clockpicker i', function () {
  let wrap = $(this).parents('.lstItem');
  // let select = $(this).parents('.lstItem').find('select');
  wrap.find('.clockpicker').hide();

  //todo: Сделать смену значение слекта при сбросе
  // select[0].setChoiceByValue('1'); // устанавливаем option "рабочих часов"

  wrap.find('.clockpicker_input').val('... — ...');
  wrap.find('[id*="start_clock_value["]').val('');
  wrap.find('[id*="end_clock_value["]').val('');

  // wrap.find('.clockpicker_input').clockpicker('show');
});


function add_rule_row(rule_row_class, rule_mod, default_id) {
  last_rule_nr++;

  var default_li = $('#' + default_id).clone();
  $(default_li).addClass('-block').removeClass('hidden');
  $(default_li).removeClass('hidden');

  if(rule_mod == 'every_conditions' && rule_type == 3)
  {
      $(default_li).find('.scnd-rule_time_hour_type select option[value=for]').remove()
      $(default_li).find('.scnd-rule_time_hour_type select option[value=repeat]').remove()
  }

  $(rule_row_class + ' .acrList').append(default_li);

  var tmp_id = $(default_li).attr('id');
  tmp_id = tmp_id.replace('default', last_rule_nr);
  $(default_li).attr('id', tmp_id);

  $('#' + tmp_id + ' .main-select').change(function () {
    $(this).removeClass('-js-noMySelect');
    change_main_select(this,true);
  });
  $('#' + tmp_id).children('.icon-remove').click(function () {
    $(this).closest('.acrItem').fadeOut();
    $(this).closest('.acrItem').remove();
  });

  $(default_li).find('input, select, textarea').each(function () {
    if ($(this)[0].nodeName == "SELECT") {
      $(this).removeClass('-js-noMySelect');
    }
    var tmp_name = $(this).attr('name');
    if (tmp_name) {
      tmp_name = tmp_name.replace('default', last_rule_nr);
      tmp_name = tmp_name.replace('rule_mod', rule_mod);
      $(this).attr('name', tmp_name);
    }
    var tmp_id = $(this).attr('id');
    if (tmp_id) {
      tmp_id = tmp_id.replace('default', last_rule_nr);
      tmp_id = tmp_id.replace('rule_mod', rule_mod);
      $(this).attr('id', tmp_id);
    }
  });
  // if (rule_mod == '') {
  //   $('textarea[id^=form_content_email_to_user_' + last_rule_nr + ']').each(function () {
  //     CreateHtmlEditor(this.id, 144, false, false, true);
  //     if (!$(this).attr('b_star')) {
  //       $(this).parent().addClass('hidden').removeClass('-block')
  //     }
  //   });
  //   CreateHtmlEditor('form_content_add_note_' + last_rule_nr, 144, false, false, true, true);
  //   CreateHtmlEditor('form_content_email_to_group_' + last_rule_nr, 144, false, false, true);
  //   CreateHtmlEditor('form_content_email_to_staff_' + last_rule_nr, 144, false, false, true);
  //   CreateHtmlEditor('js_action_set_reopen_set_reopen_3_' + last_rule_nr, 70, false, true, true, true);
  //   //		CreateHtmlEditor('form_content_message_to_chat_'+last_rule_nr, 144);
  // }

  $(default_li).find('.pp_list_item').each(function () {
    var tmp_rel = $(this).attr('rel');
    tmp_rel = tmp_rel.replace('default', last_rule_nr);
    tmp_rel = tmp_rel.replace('rule_mod', rule_mod);
    $(this).attr('rel', tmp_rel);
  });

  if (rule_mod == 'every_conditions') {
    $('#' + tmp_id + ' option[rel=just_for_all]').remove();
  }

  if (rule_mod == '') {
    labels_width = 363;
  } else {
    labels_width = 202;
  }

  $('#' + tmp_id + ' select').each(function () {
    $(this).removeClass('-js-noMySelect');
    if ($(this).attr('multiple')) {
      $(this).addClass('multipleSelect');
    } else {
      $(this).addClass('mySelect');
    }
  });

  $('#' + tmp_id + ' input[type="checkbox"]').removeClass('rule-default-action');

  // Инит стартового правила при добавлении нового
  (function () {
    const multipleSelect = []
    const simpleSelect = []
    let item = Array.from(document.querySelectorAll(`#${tmp_id} select:not(.-js-noMySelect)`))

    if (item) item = item.filter(element => element.offsetHeight > 0) // важно инитить только видимые селекты, иначе страдает производительность

    item.forEach(element => {
      (element.matches(".multipleSelect")) ? multipleSelect.push(element) : simpleSelect.push(element)
    })

    choicesInit(multipleSelect, {
      itemSelectText: "",
      shouldSort: false,
      removeItemButton: true,
      noResultsText: Translate('alpha20_js/no_results'),
      resetScrollPosition: false,
    });

    choicesInit(simpleSelect, {
      searchEnabled: false,
      itemSelectText: "",
      shouldSort: false,
      removeItemButton: false,
      resetScrollPosition: false,
    });
    InitNanoScrolls(`#${tmp_id}`)
  })();

  $(document).on('click', '.change_form', function () {
    var lang_id = $(this).attr('data-lang_id');
    // Язык
    $(this).parent().find('a.change_form').removeClass('active');
    $(this).addClass('active');

    // третья часть

    $(this).parent().parent().parent().find('textarea[id^=form_content_email_to_user_' + last_rule_nr + ']').parent().addClass('hidden').removeClass('-block');
    $(this).parent().parent().parent().find('textarea#form_content_email_to_user_' + last_rule_nr + '_' + lang_id).parent().addClass('-block').removeClass('hidden');
    return false;
  });
  acrDeleteRow();
  return last_rule_nr
}

function change_main_select(el,b_new) {
  if($(el).hasClass('-js-noMySelect')) {
    return
  }
  setTimeout(() => {
    var main_select_value = $(el).val();

    var b_action = $(el).attr('name').match(/action_list/) ? true : false;
    var closes_li = $(el).closest('li');
    var second_select_value = closes_li.find('.scnd-' + main_select_value);

    // первая часть

    $(closes_li).find('.letters_content').addClass('hidden').removeClass('-block');
    $(closes_li).find('.scndItem').addClass('hidden').removeClass('-block');
    $(closes_li).find('.lstItem').addClass('hidden').removeClass('-block');
    $(closes_li).find('.scnd-' + main_select_value).addClass('-block').removeClass('hidden');

    if (second_select_value.attr('data-last') == 'multiple') {
      var second_id = second_select_value.find('select').attr('id');
      var second_key = second_select_value.find('select').val();

      $(closes_li).find('.lst-' + main_select_value + '[data-scnd="' + second_key + '"]').addClass('-block').removeClass('hidden');

      second_select_value.find('select').change(function (e,b_manual) {
        change_second_select(this, main_select_value, true);
          if(!b_manual)
          {
              setRequiredCondition()
          }

      });
    } else {
      $(closes_li).find('.lst-' + main_select_value).addClass('-block').removeClass('hidden');

      var second_id = second_select_value.children('select').attr('id');
      $('#' + second_id).change(function (e,b_manual) {
          change_second_select(this, main_select_value);
          if(!b_manual)
          {
              setRequiredCondition()
          }
      });
    }
    if (main_select_value.match(/^hours_staff_in_status_/)) {
        $(closes_li).find('.lst-' + main_select_value).addClass('lst-hours_staff_in_status')
    }
    if ($(closes_li).find('div.lstItem:visible input.hidden_type_hours_id').val() && $(closes_li).find('div.lstItem:visible input.hidden_type_hours_id').val().length) {
    } else if (main_select_value == 'hours_from_create' ||
      main_select_value == 'hours_in_open' ||
      main_select_value == 'hours_from_assign' ||
      main_select_value == 'hours_from_user_response') {
      $(closes_li).find('div.lstItem:visible input.hidden_type_hours_id').val(1);
      $(closes_li).find('div.lstItem:visible div.text_type_hours_select a').removeClass('active');
      $(closes_li).find('div.lstItem:visible div.text_type_hours_select a[rel=1]').addClass('active');
    } else if (main_select_value == 'hours_in_waiting' ||
      main_select_value == 'hours_in_close' ||
      main_select_value == 'hours_from_response' ||
      main_select_value == 'hours_from_note' ||
      main_select_value == 'hours_from_staff_response' ||
      main_select_value == 'hours_staff_in_offline'
    || main_select_value.match(/^hours_staff_in_status_/)
    ) {
      $(closes_li).find('div.lstItem:visible input.hidden_type_hours_id').val(2);
      $(closes_li).find('div.lstItem:visible div.text_type_hours_select a').removeClass('active');
      $(closes_li).find('div.lstItem:visible div.text_type_hours_select a[rel=2]').addClass('active');
    } else if (main_select_value.match(/^cf_/) && b_action) {
      if (second_select_value.find('.input_calendar_ico').length) {
        second_select_value.find('.input_calendar_ico, .css_cf_date__input').addClass('hidden').removeClass('-block')
      }
    } else if (main_select_value == 'set_reopen' && b_new) {
      $('.span_set_reopen_1 a[rel=60]').trigger('click')
    }
    // "Отправить звуковое уведомление", "Отправить браузерное уведомление"
    else if (main_select_value === "perform_sound" ||
      main_select_value === "perform_push" ||
      main_select_value === "perform_webhook"
      ) {
      const lettersContent = Array.from($(closes_li)[0].querySelectorAll('.letters_content.-block select:not(.-js-noMySelect)'));
      const scndItem = Array.from($(closes_li)[0].querySelectorAll('.scndItem.-block select:not(.-js-noMySelect)'));

      choicesInit(lettersContent, {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        noResultsText: Translate('alpha20_js/no_results'),
        noChoicesText: Translate('alpha20_js/no_variants')
      })

      if(main_select_value !== "perform_webhook") {
        choicesInit(scndItem, {
          shouldSort: false,
          itemSelectText: '',
          noResultsText: Translate('alpha20_js/no_results'),
          noChoicesText: Translate('alpha20_js/no_variants'),
          removeItemButton: true
        })
      }

      InitNanoScrolls(`#${closes_li[0].id}`)
    }
    // "Назначить ответственным", "Зафиксировать чат за", "Выставить группу"
    else if (main_select_value === "staff_id" && $(el)[0].closest(".sc2") ||
      main_select_value === "take_chat" ||
      main_select_value === "group_id" && $(el)[0].closest(".sc2") ||
      main_select_value === "email_to_staff" ||
      main_select_value === "email_to_group") {
      const elements = Array.from($(closes_li)[0].querySelectorAll('.scndItem.-block select:not(.-js-noMySelect)'));
      choicesInit(elements, {
        itemSelectText: "",
        shouldSort: false,
        removeItemButton: true,
        searchResultLimit: 99,
        noResultsText: Translate('alpha20_js/no_results')
      })
      InitNanoScrolls(`#${closes_li[0].id}`)
    }
    // "Добавлены метки", "Удалены метки", "Метки"
    else if (main_select_value === "labels" ||
      main_select_value === "labels_added" ||
      main_select_value === "labels_removed") {
      let hiddenInput = $(closes_li)[0].querySelector(`.lst-${main_select_value} input.hidden`);
      let scndSelect = Array.from($(closes_li)[0].querySelectorAll(`.scnd-${main_select_value} select:not(.-js-noMySelect)`))
      let select = $(closes_li)[0].querySelector(`.lst-${main_select_value} select`);
      let option = parsChoices(all_labels_list);
      let selected = [];
      let temporary = [];
      let newString;
      let markedLabels = true
      const id = select.closest("li").id

      select.addEventListener('addItem', () => addItemLabels(select, newString, temporary, selected, hiddenInput, markedLabels));
      select.addEventListener("removeItem", () => removeItemLabels(select, newString, temporary, selected, hiddenInput));
      select.addEventListener("search", (e) => {
        const nano = select.closest(".choices").querySelector(".nano-pane")
        const resultCount = e.detail.resultCount

        if (resultCount <= 12) {
          nano.style.display = "none"
        } else {
          nano.style.display = ""
          $(`#${id} .select_nano`).nanoScroller({alwaysVisible: true});
        }
      });

      initChoicesLabels(select, option)
      choicesInit(scndSelect, {
        searchEnabled: false,
        itemSelectText: "",
        shouldSort: false,
        removeItemButton: false
      })
      InitNanoScrolls(`#${closes_li[0].id}`)
    }
    // "Добавить метки", "Удалить метки"
    else if (main_select_value === "add_labels" ||
      main_select_value === "remove_labels") {
      let hiddenInput = $(closes_li)[0].querySelector(`.scnd-${main_select_value} input.hidden`);
      let select = $(closes_li)[0].querySelector(`.scnd-${main_select_value} select`);
      let option = parsChoices(all_labels_list);
      let selected = [];
      let temporary = [];
      let newString;
      let markedLabels = true
      const id = select.closest("li").id

      select.addEventListener('addItem', () => addItemLabels(select, newString, temporary, selected, hiddenInput, markedLabels));
      select.addEventListener("removeItem", () => removeItemLabels(select, newString, temporary, selected, hiddenInput));
      select.addEventListener("search", (e) => {
        const nano = select.closest(".choices").querySelector(".nano-pane")
        const resultCount = e.detail.resultCount

        if (resultCount <= 12) {
          nano.style.display = "none"
        } else {
          nano.style.display = ""
          $(`#${id} .select_nano`).nanoScroller({alwaysVisible: true});
        }
      });

      initChoicesLabels(select, option)
      InitNanoScrolls(`#${closes_li[0].id}`)
    }
    // Создать новое обращение на основе ответа
    if (main_select_value === "create_ticket") {
      $(closes_li).closest('li').find(".scndItem.scnd-create_ticket.-block select").prop('disabled', "disabled");
    }

    // Если это НЕ интуп с мультивводом. Должно быть в самом конце
    if (main_select_value !== "labels" ||
      main_select_value !== "add_labels" ||
      main_select_value !== "labels_added" ||
      main_select_value !== "labels_removed" ||
      main_select_value !== "remove_labels") {
      const scndItem = Array.from($(closes_li)[0].querySelectorAll('.scndItem.-block select:not(.-js-noMySelect)'));
      const lstItem = Array.from($(closes_li)[0].querySelectorAll('.lstItem.-block select:not(.-js-noMySelect)'))
      const elements = scndItem.concat(lstItem);
      choicesInit(elements, {
        searchEnabled: false,
        itemSelectText: "",
        shouldSort: false,
        removeItemButton: false
      })
      InitNanoScrolls(`#${closes_li[0].id}`)
    }
    if (main_select_value === "email_to_user")
    {
        $('textarea[id^=form_content_email_to_user_' + last_rule_nr + ']').each(function () {
            CreateHtmlEditor(this.id, 144, false, false, true);
            if (!$(this).attr('b_star')) {
                $(this).parent().addClass('hidden').removeClass('-block')
            }
        });
    }
    else if (main_select_value === "add_note")
    {
        CreateHtmlEditor('form_content_add_note_' + last_rule_nr, 144, false, false, true, true);

    }
    else if (main_select_value === "email_to_group")
    {
        CreateHtmlEditor('form_content_email_to_group_' + last_rule_nr, 144, false, false, true);

    }
    else if (main_select_value === "email_to_staff")
    {
        CreateHtmlEditor('form_content_email_to_staff_' + last_rule_nr, 144, false, false, true);

    }
    else if (main_select_value === "set_reopen")
    {
        CreateHtmlEditor('js_action_set_reopen_set_reopen_3_' + last_rule_nr, 70, false, true, true, true);
    }
    // открыть выпадающий список на который было нажатие для select_mask
    if(setOpenSelect) {
      ui_id = cur_select.attr('choices_uuid');

      // проверка на undefined
      if(defaultChoiesInit[ui_id]) {
        defaultChoiesInit[ui_id].dropdown ? defaultChoiesInit[ui_id].showDropdown() : null;
      }

      let li = cur_select.parents('.acrItem');
      li.find('.select_mask_value').hide();
      setOpenSelect = false;
      convertSomeSelectsText();
    }

    InitCfDatepickers(true);
    InitNanoScrolls(`#${closes_li[0].id}`)
    YouScanConfig()


  }, 1)
}

// var =
function change_second_select(el, main_select_value, b_multiple) {
  var closes_li = $(el).closest('li');
  var second_key = $(el).val();

  if (b_multiple) {
    $(closes_li).find('.lst-' + main_select_value + '[data-scnd]').addClass('hidden').removeClass('-block');
    $(closes_li).find('.lst-' + main_select_value + '[data-scnd="' + second_key + '"]').addClass('-block').removeClass('hidden')

    if (second_key == 'for' || second_key == 'in time') {
      const select = Array.from(closes_li[0].querySelectorAll(`.lst-${main_select_value}.-block select:not(.-js-noMySelect)`))
      choicesInit(select, {searchEnabled: false, itemSelectText: "", shouldSort: false, removeItemButton: false})
    }
  }

  if (main_select_value == 'rating') {
    init_nice_elements()

  } else if (main_select_value == 'created_hour_type') {
    if (second_key == 'for') {
      $('.lst-' + main_select_value + ' select option[value!=6]').hide();
      $('.lst-' + main_select_value + ' select option[value=6]').show();
    } else if (second_key == 'in time') {
      $('.lst-' + main_select_value + ' select option[value=6]').hide();
      $('.lst-' + main_select_value + ' select option[value!=6]').show();
    }
  }
}

function acrDeleteRow() {
  $('.acrWrap .acrItem > .js-remove-rule').click(function () {
    $(this).closest('.acrItem').fadeOut();
    $(this).closest('.acrItem').remove();
    YouScanConfig();
    setRequiredCondition()
  });
}

// Одна общая функция инита для обычных селектов, в которую передаём параметры для Choices
function initChoices(searchEnabled, itemSelectText, shouldSort, removeItemButton, elements, addChoices) {
  let multipleSelect;


  const item = elements.filter(function (elements) {
    // Проверяем на мультиселект. Если это мультиселект - нужно обработать по другому
    if (!elements.classList.contains('multipleSelect')) {
      // Проверяем на атрибут. Если есть - elements уже обрабатывался Choices
      if (!elements.getAttribute('data-choice')) {
        return elements
      }
    } else {
      multipleSelect = elements
    }
  });
  // Если это мультиселект - запускаем функцию
  if (multipleSelect != undefined) {
    initChoicesMultiple(multipleSelect, addChoices)
  }

  const instances = item.map((element) => {
    let init = new Choices(element, {
      searchEnabled: searchEnabled,
      itemSelectText: itemSelectText,
      shouldSort: false,
      removeItemButton: removeItemButton,
      addChoices: addChoices,
      addItemText: (value) => {
        return Translate('cases_rules_edit_js/press_enter') +`<b> "${value}"</b>`;
      }
    })
  })
}

// Инитим мультиселект
function initChoicesMultiple(multipleSelect, addChoices, setChoices) {
  let variables = [];
  multipleSelect = [multipleSelect];

  // проверяем не обрабатывали ли Choices.js наш select (или input), чтобы не обработать его второй раз
  const item = multipleSelect.filter(function (elements) {
    if (!elements.getAttribute('data-choice')) return elements
  });

  const instances = item.map((element) => {
    let init = new Choices(element, {
      searchEnabled: true,
      itemSelectText: '',
      removeItemButton: true,
      shouldSort: false,
      noChoicesText: Translate('alpha20_js/no_variants'),
      noResultsText: Translate('cases_labels_js/not_found'),
      addChoices: addChoices,
      addItems: true,
      duplicateItemsAllowed: false,
      addItemText: (value) => {
        return Translate('cases_rules_edit_js/press_enter') + ` <b>"${value}"</b>`;
      },
    })
  })
}

// Ф-ция инита Choices.js для меток
function initChoicesLabels(select, option) {
  // Если есть атрибут - значит уже скармливали селект Choices.js
  if (select.getAttribute('data-choice')) return

  const init = new Choices(select, {
    searchResultLimit: 9999,
    searchEnabled: true,
    itemSelectText: '',
    removeItemButton: true,
    shouldSort: false,
    noChoicesText: Translate('alpha20_js/no_variants'),
    noResultsText: Translate('cases_labels_js/not_found'),
    addChoices: true,
    addItems: true,
    duplicateItemsAllowed: false,
    addItemText: (value) => {
      return Translate('cases_rules_edit_js/press_enter') + ` <b>"${value}"</b>`;
    },
    // сюда приходят только метки для 3 типов полей, если метки ненужны, то тут пустой массив
    choices: option,
  })
  init.passedElement.element.addEventListener("change", () => {
    init.hideDropdown();
  })
}

// Скрываем варианты выбора при выборе "особой" опции
function specialOption(element) {
  if($(element).hasClass('-js-noMySelect')) {
    return
  }
  // Если юзер выбирает специальные option, то мы скрываем остальные. У такого option value начинается с минуса (-)
  const SPECIAL_OPTION_DIV = `<div class="choices__item choices__item--choice has-no-choices-special">`+Translate('cases_rules_edit_js/others_variants_unavailable')+`</div>`;
  const values = Array.from(element.querySelectorAll("option[selected]")); // выбранные опции
  const choices = element.closest(".choices");
  const allOption = choices.querySelectorAll(".choices__list .choices__item.choices__item--choice");
  const optionWrapper = choices.querySelector(".choices__list.choices__list--dropdown .choices__list");
  const selectedWrapper = choices.querySelectorAll(".choices__inner .choices__list.choices__list--multiple .choices__item--selectable");
  const allStaffOption = choices.querySelector(`.choices__list .choices__item.choices__item--selectable[data-value="-1"]`) // опция "всем сотрудникам"

  const isSpecial = values.some(element => (element?.value.split('')[0] === "-"));
  isSpecial ? actionOption(true) : actionOption(false)

  InitNanoScrolls(`#${element.closest("li").id}`)
  const specialOption = choices.querySelector(".has-no-choices-special")
  const nanoPane = choices.querySelector(".nano-pane");

  if (specialOption && nanoPane) {
    nanoPane.style.opacity = 0
  } else {
    if (nanoPane) nanoPane.style.opacity = 1
  }

  const special = values.some(element => (element.value === "-1"))

  if (allStaffOption && special || allStaffOption && values.length === 0) {
    allStaffOption.classList.remove("-none")
  } else {
    if (allStaffOption) allStaffOption.classList.add("-none")
  }

  // Действия для опций внутри селекта
  function actionOption(isSpecial) {
    /**
     * @isSpecial - принимает true или false
     * Если true - скрываем опции и варианты выбора, если false - наоборот показываем
     */

    // скрываем все option
    allOption.forEach(element => {
      if (element.classList.contains("has-no-choices-special")) return
      (isSpecial) ? element.classList.add("-none") : element.classList.remove("-none")
    })

    // скрываем все выбранные option кроме "особенного"
    selectedWrapper.forEach(element => {
      const attr = element.getAttribute("data-value");
      const attrFirstLetter = attr.split("")[0]
      if (attrFirstLetter === "-") return

      if(isSpecial) {
        // element.classList.add("-none")
        $(element).closest('.choices').find('select option[value="'+attr+'"]').remove();
        element.remove();
      } else {
        element.classList.remove("-none")
      }

    })

    // фиксим добавление опции по клику на Enter
    ;(function () {
      const div = choices.querySelector(".choices__input.choices__input--cloned")
      if (isSpecial) {
        if (div) div.style.display = "none"
        setTimeout(() => {
          allOption.forEach(element => element.classList.remove("is-highlighted"))
        }, 1);
      } else {
        if (div) div.style.display = ""
      }
    })();

    if (isSpecial) {
      // вставляем DIV
      const special = choices.querySelector(".has-no-choices-special");
      if (special) special.hidden = false;
      if (!special) {
        optionWrapper.insertAdjacentHTML("beforeBegin", SPECIAL_OPTION_DIV);
      }
    } else {
      const special = choices.querySelector(".has-no-choices-special");
      if (special) special.hidden = true;
    }
  }
}

// Скрываем/показываем доп. поле при выборе "особой" опции или имени сотрудника
function optionallyField(element) {
    //OFF
  const exception = element.closest('.scndItem').querySelector('.staff_exclude_widget'); // блок "за исключением"
  const select = element.closest('.scndItem').querySelectorAll('.staff_exclude_widget select:not(.-js-noMySelect)'); // блок "за исключением"
  const option = Array.from(element.closest('.scndItem').querySelectorAll("select[name*='action_list'] option[selected]"))

  // Если выбрано "никого (сбросить ответственного)" или имя сотрудника - скрываем доп. поле, в ином случае - отображаем
  const result = option.every(element => element.value.includes("-2") || checkedName(element.value) )
  if (result) {
    if (exception) exception.style.display = "none"
  } else {
    if (exception) exception.style.display = "flex"
    choicesInit(select, {itemSelectText: "", shouldSort: false, removeItemButton: true});
    InitNanoScrolls(`#${element.closest("li").id}`)
  }

  // Проверка на имя. Если выбрано имя - возвращяем true, если нет - false
  function checkedName(element) {
    let user = element
    let userArray = user.split(":");
    let userArrayFirst = userArray[0].split("");
    if (userArrayFirst.length >= "3") {
      return true
    } else {
      return false
    }
  }
}

// Оценка качества ответов
function disabledElement(el, param) {
  el.closest('li').find(".lstItem.lst-rating").removeClass("-block").addClass("hidden") // общее действие для любого выбора
  el.closest('li').find(`.lstItem.lst-rating[data-scnd="${param}"]`).addClass("-block").removeClass("hidden") // общее действие для любого выбора

  if (param === "has been" || param === "has not been" || param === "consist" || param === "not consist") {
    el.closest('li').find(`.lstItem.lst-rating[data-scnd="${param}"] input[type="text"]`).prop('disabled', true)
  } else if (param === "equal" || param === "not equal") {
    const select = Array.from(document.querySelectorAll(`#${el.closest("li")[0].id} select:not(.-js-noMySelect)`))
    choicesInit(select, {searchEnabled: false, itemSelectText: "", shouldSort: false, removeItemButton: false});
    InitNanoScrolls(`#${el.closest("li")[0].id}`)
  }
}

function ClockpickerAction(target) {
  let clockpickerVal = target.val();
  let wrap = target.parents('.lstItem');
  let start = wrap.find('[class*="start_clock_value["]');
  let end = wrap.find('[class*="end_clock_value["]');

  let bugSelection = /\s.*/g.test(clockpickerVal);

  if(bugSelection) {
    return
  }

  if(start.val().length > 2 && end.val().length > 2) {
    target.val('... — ...');
    start.val('');
    end.val('');
  }

  // if (selectVal == 7) {
    if (start.val().length < 2 ) {
      start.val(clockpickerVal)
      target.val(clockpickerVal + ' — ...');

      wrap.find('.clockpicker').show();
      target.clockpicker('show');
    } else {
      end.val(clockpickerVal)
      target.val(start.val() + ' — '+ clockpickerVal);
        let s = start.val().split(':')
        let e = end.val().split(':')

        s = parseInt(s[0])*3600+parseInt(s[1])*60;
        e = parseInt(e[0])*3600+parseInt(e[1])*60;
        target.next().val(s+'_'+e)
    }
  // }
}

function convertSomeSelectsText() {
  let selectWrap = $('.lstItem.lst-staff_id:visible, .lstItem.lst-note_mention_added:visible, .scndItem.scnd-staff_id:visible, .scndItem.scnd-take_chat:visible');

  if(!selectWrap.length) {
    return
  }

  selectWrap.each(function() {
    let $this = $(this);
    let selList = $this.find('.choices__inner .choices__list:not(.choices__list--dropdown)');
    let selMask = $this.find('.select_mask_value:visible');

    if(selList.children().length) {
      eachList(selList)
    }

    if(selMask.length) {
      if(!$(selMask).hasClass('converted')) {
        convMasked(selMask)
      }
    }

  })


  function convText(item, typeText) {

    let isLstStaffId = false;
    let isNoteMAdded = false;
    let isSndStaffId = false;
    let isTakeChat = false;

    if( $(item).closest('.lst-staff_id').length )
    {
      isLstStaffId = true;
    } else
    if( $(item).closest('.lst-note_mention_added').length )
    {
      isNoteMAdded = true;
    } else
    if( $(item).closest('.scnd-staff_id').length ) {
      isSndStaffId = true;
    } else
    if( $(item).closest('.scnd-take_chat').length ) {
      isTakeChat = true;
    }

    if(typeText == "status") {

      if(isLstStaffId) {
        typeText = Translate('rules_c/staff_in_status');
      } else
      if(isNoteMAdded) {
        typeText = Translate('rules_c/the_staff_in_status');
      } else
      if(isSndStaffId) {
        typeText = Translate('rules_c/the_staff_in_status');
      } else
      if(isTakeChat) {
        typeText = Translate('cases_rules_edit_js/staff_in_status_');
      } else {
        typeText = '';
      }

    } else if(typeText == "group") {

      if(isNoteMAdded) {
        typeText = Translate('cases_rules_edit_js/groups').toLowerCase();
      } else
      if(isSndStaffId) {
        if( $(item).closest('.staff_exclude_widget').length ) {
          typeText = Translate('cases_rules_edit_js/the_staff_with_group_access3');
        } else {
          typeText = Translate('cases_rules_edit_js/the_staff_with_group_access');
        }
      } else
      if(isTakeChat) {
        if( $(item).closest('.staff_exclude_widget').length ) {
          typeText = Translate('cases_rules_edit_js/the_staff_with_group_access3');
        } else {
          typeText = Translate('cases_rules_edit_js/the_staff_with_group_access2');
        }
      } else {
        typeText = '';
      }

    } else {
      typeText = '';
    }

    let text = $(item).text().replace('Remove item', '').trim();
    let removeBtn = $(item).children('button').length ? $(item).children('button')[0].outerHTML  : '';
    let text_in_brackets = '';

    if(text.indexOf('('+Translate('cases_rules_edit_js/if')) !== -1) {
      text_in_brackets = text.substr(text.indexOf(' ('+Translate('cases_rules_edit_js/if')))
      text = text.replace(text_in_brackets, '')
    }
    let _text = Translate('cases_rules_edit_js/quotes', {'title': text});
    $(item).html( text.replace(text, `${typeText}  ${_text} ${text_in_brackets}`) + removeBtn );

    $(item).addClass('converted')
  }

  function convMasked(target) {
    let selectVal = $(target).prev().val();
    let isStat = /^status/i.test(selectVal);
    let isGroup = selectVal.indexOf('g:') !== -1 || ( (!isNaN(selectVal[1]) && selectVal[0] == 'g') );

    if(isStat) {
      convText(target, 'status');
    } else if(isGroup) {
      convText(target, 'group');
    }
  }

  function eachList(targetList) {
    let option = $(targetList).children();

    option.each(function(i, item) {
      let dataVal = $(item).attr('data-value');

      if(dataVal && !$(item).hasClass('converted')) {
          let isStat = /^status/i.test(dataVal);
        let isGroup = dataVal.indexOf('g:') !== -1 || ( (!isNaN(dataVal[1]) && dataVal[0] == 'g') );

        if(isStat) {
          convText($(item), 'status');
        } else
        if(isGroup) {
          convText($(item), 'group');
        }
      }
    })
  }

}

function YouScanConfig() {
  setTimeout(() => {
      let runReturn = false;
      let visible_selects = $('.acrList').find('.frstItem:visible select');

      let firstRulesBlockLi = $('.sc ul li.acrItem:visible');

      visible_selects.each(function() {
        let val = $(this).children('option:selected').attr('value');

        if(val && val.match('ys_') !== null) {
          isYouScan = true;
          return false;
        } else {
          isYouScan = false;
        }

      })


      if(firstRulesBlockLi && isYouScan) {
        firstRulesBlockLi.each(function() {
          let checkExistYouScan =
            $(this).find('.frstItem:visible select').val() == "chanel"
            &&
            // $(this).find('.scndItem:visible select').val() == "equal"
            // &&
            $(this).find('.lstItem:visible select').val() == "18"
          ;

          if(checkExistYouScan) {
            $(this).parent().prepend($(this));

            if($(this).find('.frstItem:visible .select_mask_value:visible').length) {
              $(this).find('.frstItem:visible .select_mask_value').addClass('disabled')
              $(this).find('.scndItem:visible .select_mask_value').text(Translate('hd4ustats_m/equal')).addClass('disabled')
              $(this).find('.lstItem:visible .select_mask_value').addClass('disabled')
            } else {
              // setTimeout(() => {
                let secondSelect = $(this).find('.scndItem:visible select');

                ui_id = secondSelect.attr('choices_uuid');

                // проверка на undefined
                if(defaultChoiesInit[ui_id]) {
                  defaultChoiesInit[ui_id].setChoiceByValue('equal');
                  secondSelect.trigger('change');
                }
                $(this).find('.scndItem:visible .choices').addClass('is-disabled').parent().addClass('cur_not_allowed')

              // }, 2)
              $(this).find('.frstItem:visible .choices').addClass('is-disabled').parent().addClass('cur_not_allowed')
              $(this).find('.lstItem:visible .choices').addClass('is-disabled').parent().addClass('cur_not_allowed')

            }

            $(this).find('.js-remove-rule').hide();

            isYouScan = true;
            runReturn = true;

            return false;
          }
        })
      }

      if(runReturn) {
        return
      }

      if(isYouScan) {
        let YouScanSelectId = add_rule_row('.sc', 'all_conditions', 'rule_default');

        let li = $(`#rule_${YouScanSelectId}`);
        let targetSelect = li.find('.frstItem:visible select');

        li.parent().prepend(li);

        let ui_id = targetSelect.attr('choices_uuid');

        // проверка на undefined
        if(defaultChoiesInit[ui_id]) {
          defaultChoiesInit[ui_id].setChoiceByValue('chanel');
          targetSelect.addClass('is-disabled').trigger('change');
          targetSelect.parent().addClass('cur_not_allowed')
        }

        // setTimeout(() => {
        //   let secondSelect = li.find('.scndItem:visible select');
        //   // ui_id = secondSelect.attr('choices_uuid');
        //   // проверка на undefined
        //   // if(defaultChoiesInit[ui_id]) {
        //     // defaultChoiesInit[ui_id];
        //     secondSelect.addClass('is-disabled').trigger('change');

        //   // }
        // }, 2)

        setTimeout(function() {
          let thirdSelect = li.find('.lstItem:visible select');
          ui_id = thirdSelect.attr('choices_uuid');
          // проверка на undefined
          if(defaultChoiesInit[ui_id]) {
            defaultChoiesInit[ui_id].setChoiceByValue('18');
            thirdSelect.addClass('is-disabled').trigger('change');
            thirdSelect.parent().addClass('cur_not_allowed')

            li.find('.js-remove-rule').hide();
            return false;
          }
        }, 10)

      }

      // удаление, если нету других условий по YouScan
      if(!isYouScan) {
        if(firstRulesBlockLi) {

          firstRulesBlockLi.each(function() {
            let checkExistYouScan =
              $(this).find('.frstItem:visible select').val() == "chanel"
              &&
              $(this).find('.lstItem:visible select').val() == "18"
            ;

            if(checkExistYouScan) {
              if($(this).find('.frstItem:visible .select_mask_value:visible').length) {
                $(this).find('.frstItem:visible .select_mask_value').removeClass('disabled')
                $(this).find('.scndItem:visible .select_mask_value').removeClass('disabled')
                $(this).find('.lstItem:visible .select_mask_value').removeClass('disabled')
              } else {
                $(this).find('.frstItem:visible .choices').removeClass('is-disabled').parent().removeClass('cur_not_allowed')
                $(this).find('.scndItem:visible .choices').removeClass('is-disabled').parent().removeClass('cur_not_allowed')
                $(this).find('.lstItem:visible .choices').removeClass('is-disabled').parent().removeClass('cur_not_allowed')
              }

              $(this).find('.js-remove-rule').show();
              return false;
            }
          })
        }


      }
  }, 10)
}
function setRequiredCondition()
{
    let data = {
        '^freestaffs$' : ['status:equal:1','b_active_chat:0:1']
    };
    let checkIssetCondition = function (c)
    {
        for (let k in data)
        {
            if(c.match(k))
            {
                return data[k]
            }
        }
        return false;
    }
    let checkAddedCondition = function (condition,val)
    {
        if(!$('.acrList').find('.frstItem:visible select option:selected[value='+condition[0]+']').length)
        {
            // console.log('1');
            return false;
        }
        if(condition[1] !== '0'
            && !$('.acrList').find('.scnd-'+condition[0]+':visible select option:selected[value='+condition[1]+']').length)
        {
            // console.log('2');
            return false
        }
        if(!$('.acrList').find('.lst-'+condition[0]+':visible select option:selected[value='+condition[2]+']').length)
        {
            // console.log('3');
            return false
        }
        $('.acrList').find('.frstItem:visible select option:selected[value='+condition[0]+']')
            .parents('.select_wrap_mask').find('.select_mask_value').addClass('disabled')
        $('.acrList').find('.scnd-'+condition[0]+':visible .select_mask_value').addClass('disabled')
        $('.acrList').find('.lst-'+condition[0]+':visible .select_mask_value').addClass('disabled')

        $('.acrList').find('.frstItem:visible select option:selected[value='+condition[0]+']')
            .parents('.choices').addClass('is-disabled');
        $('.acrList').find('.scnd-'+condition[0]+':visible .choices').addClass('is-disabled');
        $('.acrList').find('.lst-'+condition[0]+':visible .choices').addClass('is-disabled');


        $('.acrList').find('.frstItem:visible select option:selected[value='+condition[0]+']')
            .parents('li').find('.js-remove-rule').hide();

        $('.acrList').find('.frstItem:visible select option:selected[value='+condition[0]+']')
            .parents('li').addClass('_required_'+val).addClass('cur_not_allowed');

        return true;
    }

        setTimeout(() => {



            // $('.acrList').find('.frstItem:visible select').each(function() {
            //     let val = $(this).children('option:selected').attr('value');
            //     if(val && val.match('ys_') !== null) {
            //         isYouScan = true;
            //         return false;
            //     } else {
            //         isYouScan = false;
            //     }
            // })
            let found_condition = [];
            $('.acrList').find('.lstItem:visible select').each(function() {
                let val = $(this).children('option:selected').attr('value');
                let conditions = checkIssetCondition(val);
                if(!conditions)
                {
                    return;
                }
                found_condition.push(val);
                for (let k in conditions)
                {
                    let condition = conditions[k].split(':');
                    let b_check = checkAddedCondition(condition,val);
                    if(!b_check)
                    {
                        //Тут знать в какой блок добавлять
                        let YouScanSelectId =  add_rule_row('.sc1', 'every_conditions', 'rule_default');
                                             //add_rule_row('.sc', 'all_conditions', 'rule_default');

                        let li = $(`#rule_${YouScanSelectId}`);
                        $(li).addClass('_required_'+val).addClass('cur_not_allowed');
                        let targetSelect = li.find('.frstItem:visible select');

                        li.parent().prepend(li);

                        let ui_id = targetSelect.attr('choices_uuid');

                        // проверка на undefined
                        if(defaultChoiesInit[ui_id]) {
                            defaultChoiesInit[ui_id].setChoiceByValue(condition[0]);
                            targetSelect.trigger('change',1);
                            targetSelect.parent().parent().addClass('is-disabled')
                        }
                        if(condition[1] !== '0')
                        {
                            setTimeout(() => {
                                let secondSelect = li.find('.scndItem:visible select');
                                ui_id = secondSelect.attr('choices_uuid');
                                if(defaultChoiesInit[ui_id]) {
                                    defaultChoiesInit[ui_id].setChoiceByValue(condition[1]);
                                    secondSelect.trigger('change',1);
                                    secondSelect.parent().parent().addClass('is-disabled')
                                }

                            }, 2)
                        }
                        setTimeout(function() {
                            let thirdSelect = li.find('.lstItem:visible select');
                            ui_id = thirdSelect.attr('choices_uuid');
                            // проверка на undefined
                            if(defaultChoiesInit[ui_id]) {
                                defaultChoiesInit[ui_id].setChoiceByValue(condition[2]);
                                thirdSelect.trigger('change',1);
                                setTimeout(function () {
                                    thirdSelect.parent().parent().addClass('is-disabled')

                                },4)

                                li.find('.js-remove-rule').hide();
                                return false;
                            }
                         }, 2)
                    }
                }
            })
            for (let k in data)
            {
                k = k.replace('^','').replace('$','')
                if(found_condition.indexOf(k) === -1
                && $('li._required_'+k).length)
                {
                    $('li._required_'+k).each(function () {
                        // $(this).removeClass('cur_not_allowed');
                        // $(this).find('.js-remove-rule').show();
                        // $(this).find('.choices').removeClass('is-disabled');
                        // $(this).find('.select_mask_value').removeClass('disabled');

                        $(this).closest('.acrItem').remove();
                        YouScanConfig();
                        setRequiredCondition();
                    })
                }
            }
        }, 10)
}
