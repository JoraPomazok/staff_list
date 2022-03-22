$(document).ready(function () {
  // add Row
  $('.sc2 .addRow a').click(function () {
    add_action_row('.sc2', '', 'action_default');
    return false;
  });

  $('.acrList').each(function () {
    $(this).sortable({
      handle: ".js-move-item"
    });
  });

  $('.main-select').change(function () {
    change_main_select(this);
    let el;
    // Если это "Добавить метки" - находим select для инита Choices.js во втором поле в scnd-add_labels
    // Если это "Удалить метки"  - находим select для инита Choices.js во втором поле в scnd-remove_labels
    if (this.querySelector("[selected][value='add_labels']")) {

      el = this.closest(".acrItem").querySelector(".scndItem.scnd-add_labels select");
      // checkOnLabels(el)
    } else if (this.querySelector("[selected][value='remove_labels']")) {
      el = this.closest(".acrItem").querySelector(".scndItem.scnd-remove_labels select");
      // checkOnLabels(el)
    }
  });

  $('#visibility').change(function () {
    checkVisibilityOption();
  });
  $('.select_category').change(function () {
    const option = $(this)[0].querySelector("option").value

    if (option == -1) {
      $(this).closest(".row").find('input').toggle($(this).val() == -1);
      $(this).closest(".row").find('input').removeClass("-none")
    } else {
      $(this).closest(".row").find('input').addClass("-none")
    }

  });
  $('.scndItem:visible select').each(function () {
    CheckDisabledItems($(this));
  });

  $(document).on('click', '.span_set_reopen_1 a', function () {
    $(this).parent().find('a').removeClass('active');
    $(this).addClass('active');
    $(this).parent().find('input').val($(this).attr('rel'));
    return false;
  });


  $(document).on('change', '.scndItem select', function () {
    CheckDisabledItems($(this));
  });

  // для удаления строк условия и действий
  acrDeleteRow();
  init_email_replace_fields();
  checkVisibilityOption();

  $('#edit_tmpl_btn').click(function (e) {
    e.preventDefault();

    var errors = [];
    var errors_fields = [];

    var subjEmpty = Array.from($('.templates_titles input[name*=title]')).every((item) => $(item).val().trim().length === 0)
    if (subjEmpty) {
      errors.push('EMPTY_TITLE');
      errors_fields.push('tmpl_title');
    }

    $('.acrList li div.scndItem:visible').each(function () {
      var el_input = $(this).children('input');
      if (el_input.length && el_input.attr('rel') == 'email') {
        var recipients_arr = el_input.val();
        recipients_arr = recipients_arr.split(',');

        var b_error_email = false;
        for (i = 0; i < recipients_arr.length; i++) {
          var check_recipient = $.trim(recipients_arr[i]);
          if (!validateEmail(check_recipient)) {
            b_error_email = true;
          }
        }
      }

      if (b_error_email && $.inArray('ERROR_EMAIL', errors) == -1) {
        errors.push('ERROR_EMAIL');
        errors_fields.push(el_input.attr('id'));
      }
    });

    // если при замене ссылки остался пустой тег от старой - удаляем (так же в omni_ck.js)
    $('.redactor-layer:visible').each(function() {
      let link_tag = $(this).find('a');

      if(!link_tag.length) {
          return false;
      }

      link_tag.each(function(){
          if($(this).text().trim() == '') {
              $(this).remove();
          }
          if($(this).find('a').length) {
            $(this).find('a').unwrap();
        }
      });
    })

    if (errors.length > 0) {
      ShowNotification(errors, errors_fields);
    } else {
      ShowSpinButton('edit_tmpl_btn');
      $('#form_edit_tmpl').submit();
    }
  });
  //  Change name by lang
   $(document).on('click', '.templates_titles .change_form.only_template_title', function(e){
     e.preventDefault();
     $(this).parents('.templates_titles').find('.change_form.only_template_title').removeClass('active');
     $(this).addClass('active');
     let lang_id  = $(this).data('lang_id');
     $(this).parents('.templates_titles').find('.template_title').hide();
     $(this).parents('.templates_titles').find('#title_'+lang_id).show();
   });


  $(document).on('click', '.change_form:not(.only_template_title)', function () {
    var lang_id = $(this).attr('data-lang_id');
    var action_id = $(this).parents('li')[0].id.match(/[0-9]+$/).toString();
    $(this).parent().find('a.change_form').removeClass('active');
    $(this).addClass('active');

    $(this).parent().parent().parent().find('textarea[id^=form_content_email_to_user_' + action_id + ']').parent().hide();
    $(this).parent().parent().parent().find('textarea#form_content_email_to_user_' + action_id + '_' + lang_id).parent().show();

    $(this).parent().parent().parent().find('input[id^=form_content_set_subject_' + action_id + ']').hide();
    $(this).parent().parent().parent().find('input#form_content_set_subject_' + action_id + '_' + lang_id).show();

    $(this).parent().parent().parent().find('div[class^=form_content_email_to_user_'+action_id+']').hide();
    $(this).parent().parent().parent().find('div.form_content_email_to_user_'+action_id+'_'+lang_id+'_redactor-upload-block').show();
    InitNanoScrolls( `#${$(this)[0].closest("li").id}` )
    return false;
  });

  setTimeout(() => {
    InitNanoScrolls("")
  }, 1)
});

// Логика для "Шаблон доступен" START
function checkVisibilityOption() {
  let visibility = $('#visibility').val();

  let groupId = document.querySelector(".js-visibility_group_id");
  let staffId = document.querySelector(".js-visibility_staff_id");
  let templateId = document.querySelector(".js-template-category");


  groupId.hidden = true;
  staffId.hidden = true;

  if (visibility == 2) {
    groupId.hidden = false
    staffId.hidden = true
    if (templateId) templateId.hidden = false
    choicesInit('.js-visibility_group_id select', {searchEnabled: false, shouldSort: false, itemSelectText: ''});
    SelectNano( `.js-visibility_group_id` )
  } else if (visibility == 3) {
    groupId.hidden = true
    staffId.hidden = false
    if (templateId) templateId.hidden = true
    choicesInit('.js-visibility_staff_id select', {searchEnabled: false, shouldSort: false, itemSelectText: ''});
    SelectNano( `.js-visibility_staff_id` )
  } else {
    groupId.hidden = true
    staffId.hidden = true
    if (templateId) templateId.hidden = false
  }
}

// Логика для "Шаблон доступен" END

function add_action_row(rule_row_class, rule_mod, default_id) {
  last_action_nr++;

  var default_li = $('#' + default_id).clone();
  $(default_li).addClass('d-flex');
  $(default_li).removeClass('hidden');


  var tmp_id = $(default_li).attr('id');
  tmp_id = tmp_id.replace('default', last_action_nr);
  $(default_li).attr('id', tmp_id);

  $(rule_row_class + ' .acrList').append(default_li);

  $(default_li).find('input, select, textarea').each(function () {
    var tmp_name = $(this).attr('name');
    if (tmp_name) {
      tmp_name = tmp_name.replace('default', last_action_nr);
      tmp_name = tmp_name.replace('rule_mod', rule_mod);
      $(this).attr('name', tmp_name);
    }
    var tmp_id = $(this).attr('id');
    if (tmp_id) {
      tmp_id = tmp_id.replace('default', last_action_nr);
      tmp_id = tmp_id.replace('rule_mod', rule_mod);
      $(this).attr('id', tmp_id);
    }
  });

  if (rule_mod == '') {
    $('textarea[id^=form_content_email_to_user_' + last_action_nr + ']').each(function () {
      let lang_id = $(this).data('lang_id');
      CreateHtmlEditor(this.id, 144, false, false, true, false, false, false, true, last_action_nr, null, lang_id, true);
      if (!$(this).attr('b_star')) {
        $(this).parent().hide();
      }
    });

    CreateHtmlEditor('form_content_add_note_' + last_action_nr, 144, false, false, true,  true, false, false, true, last_action_nr, null, client_lang_id_star, true);
    CreateHtmlEditor('form_content_email_to_staff_' + last_action_nr, 144, false, false, true,  true, false, false, true, last_action_nr, null, client_lang_id_star, true);
    CreateHtmlEditor('form_content_fwd_case_to_email_' + last_action_nr, 144, false, false, true,  true, false, false, true, last_action_nr, null, client_lang_id_star, true);
    CreateHtmlEditor('js_action_set_reopen_set_reopen_3_' + last_action_nr, 70, false, false, true, true);
console.log(client_lang_id_star);
  }

  $(default_li).find('.pp_list_item').each(function () {
    var tmp_rel = $(this).attr('rel');
    tmp_rel = tmp_rel.replace('default', last_action_nr);
    tmp_rel = tmp_rel.replace('rule_mod', rule_mod);
    $(this).attr('rel', tmp_rel);
  });

  var main_select = default_li.find('.main-select');
  $(main_select).change(function () {
    change_main_select(this);
  });
  change_main_select($(main_select));

  default_li.children('.fa-times').click(function () {
    $(this).closest('.acrItem').fadeOut();
    $(this).closest('.acrItem').remove();
  });

  default_li.find('select').each(function () {
    if (rule_mod == 'every_conditions') {
      $(this).find('option').each(function () {
        if ($(this).attr('rel') == 'just_for_all') {
          $(this).remove();
        }
      });
    }
    checkOnLabels(this)
  });
  InitNanoScrolls(`#${tmp_id}`)
  if (rule_mod == '') {
    labels_width = 363;
  } else {
    labels_width = 202;
  }
}

function change_main_select(el) {
  if($(el).hasClass('-js-noMySelect')) {
    return
  }
  var main_select_value = $(el).val();
  var closes_li = $(el).closest('li');
  $(closes_li).find('.letters_content').hide();
  $(closes_li).find('.scndItem').hide();
  $(closes_li).find('.lstItem').hide();

  // Проверка на язык START
  (function () {
    if (closes_li[0].querySelector(".scndItem.flt_l.scnd-set_subject")) {
      let child = closes_li[0].querySelector(".scndItem.flt_l.scnd-set_subject .list_lang_form");

      if (child.children.length === 0) {
        closes_li[0].querySelector(".scndItem.flt_l.scnd-set_subject").remove();
      }
    }
  })();
  // Проверка на язык END

  $(closes_li).find('.scnd-' + main_select_value).show();
  $(closes_li).find('.lst-' + main_select_value).show();
  if (main_select_value.match(/^cf_/)) {
    if ($(closes_li).find('.scnd-' + main_select_value).find('.input_calendar_ico').length) {
      $(closes_li).find('.scnd-' + main_select_value).find('.input_calendar_ico,input').hide();
    }
  }
  init_nice_elements('.lst-set_reopen');
  if (main_select_value == 'set_reopen' && !$('.span_set_reopen_1:visible a.active').length) {
    $('.span_set_reopen_1 a[rel=60]').trigger('click')
    // console.log($('.lst-set_reopen input[type=checkbox]')[0])
    $('.lst-set_reopen input[type=checkbox]').prop("checked", true)
  }
  if (main_select_value == 'set_reopen') {
    let elem = el.closest(".acrItem").querySelector(".scndItem.scnd-set_reopen.hidden")
    elem.setAttribute("style", "display:flex")
  }
  if (main_select_value === "add_labels") {
    checkOnLabels($(el)[0].closest("li").querySelector(".scndItem.scnd-add_labels select"))
  }
  if (main_select_value === "remove_labels") {
    checkOnLabels($(el)[0].closest("li").querySelector(".scndItem.scnd-remove_labels select"))
  }

  // для всех остальных шаблонов
  const select = Array.from( closes_li[0].querySelectorAll(`.scnd-${main_select_value} select`) )
  choicesInit(select, { searchEnabled: false, shouldSort: false, itemSelectText: ''})
  InitNanoScrolls(`#${closes_li[0].id}`)
}

function acrDeleteRow() {
  $('.acrWrap .acrItem > .js-remove-rule').click(function () {
    $(this).closest('.acrItem').fadeOut();
    $(this).closest('.acrItem').remove();
  });
}

function CheckDisabledItems(el) {
  var select_val = el.val();
  // Ложно срабатывает при добавлении меток в "Добавить/редактировать шаблоны"
  // Решение: добавил проверку на массив: !Array.isArray(select_val)

  if (select_val && !Array.isArray(select_val) && select_val.match(/^cf_date_/)) {
    el.closest('.scndItem').addClass('d-flex', 'css_cf_date').removeClass('hidden').removeAttr('style')

    el.closest('.scndItem').find('.input_calendar_ico, .css_cf_date__input, input,span').hide();

    setTimeout(() => {
      if (select_val == 'cf_date_-1' || select_val == 'cf_date_2' || select_val == 'cf_date_3') {
        el.closest('.scndItem').find('.input_calendar_ico,input').hide();
        el.closest('.scndItem').find('.css_cf_date__input').hide();
      } else if (select_val == 'cf_date_1') {
        el.closest('.scndItem').find('.css_cf_date__input').hide();
        el.closest('.scndItem').find('.input_calendar_ico, .input_calendar_ico input').show();
        InitCfDatepickers();
      } else if (select_val == 'cf_date_4' || select_val == 'cf_date_5') {
        el.closest('.scndItem').find('.css_cf_date__input').show();
        el.closest('.scndItem').find('.css_cf_date__input').addClass("-pl-10")
        el.closest('.scndItem').find('input,span').show();
      }
    }, 1);
    InitNanoScrolls(`#${el.closest("li")[0].id}`)
  }
}

function checkOnLabels(el) {
  // Если это метки - обрабатываем по другому
  if (el.closest(".scndItem.scnd-remove_labels") || el.closest(".scndItem.scnd-add_labels")) {

    let selected = [], temporary = [], newString, variables = parsChoices(all_labels_list),
      hiddenInput = el.closest(".scndItem").querySelector("input.hidden"); //  Добавляем скрытый инпут;

    el.addEventListener("addItem", (event) => {
      el.childNodes.forEach(element => {
        let isUsed = element.value.includes('e:');
        // проверяем новая это метка или нет, если нет - добавляем "n:"
        if (isUsed) {
          newString = `${element.value}`
        } else {
          newString = `n:${element.value}`
        }
        // передаём массив меток в скрытый input
        temporary.push(newString);
        selected = Array.from(new Set(temporary));
        hiddenInput.value = selected
      })
    });
    el.addEventListener("removeItem", (event) => {
      let option = el.querySelectorAll('option');
      temporary = [];

      option.forEach(element => {
        temporary.push(element.value)
      });

      selected = Array.from(new Set(temporary));
      hiddenInput.value = selected
    });
    templateInitChoices(el, true, true, true, variables)

  } else {
    templateInitChoices(el, false, false, false, [])
  }

  function templateInitChoices(select, addChoices, removeItemButton, searchEnabled, variables) {
    // Тут всегда на входе будет 1 <select>
    if (select.getAttribute('data-choice')) return
    const init = new Choices(select, {
      searchResultLimit: 9999,
      searchEnabled: searchEnabled,
      itemSelectText: '',
      removeItemButton: removeItemButton,
      shouldSort: false,
      noChoicesText: Translate('alpha20_js/no_variants'),
      noResultsText: Translate('cases_labels_js/not_found'),
      addChoices: addChoices,
      addItems: true,
      duplicateItemsAllowed: false,
      addItemText: (value) => {
        return Translate('cases_rules_edit_js/press_enter')+` <b>"${value}"</b>`;
      },
      choices: variables
    });
    init.passedElement.element.addEventListener("change", () => {
      init.hideDropdown()
    })

    init.passedElement.element.addEventListener("search", (e) => {
      const nano = select.closest(".choices").querySelector(".nano-pane")
      const resultCount = e.detail.resultCount

      if (resultCount <= 12) {
        nano.style.display = "none"
      } else {
        nano.style.display = ""
        $(`#${select.closest("li")} .select_nano`).nanoScroller({alwaysVisible: true});
      }
    })
  }
}
