var multilang_form = {1: true, 2: true, 3: true, 4: true};
var client_lang_id_star = 0;
(function ($) {

  $(function () {
    $('form').submit(function (event) {
      var this_form = $(this);
      var all_titles_exists = true;
      //если все поля заполнены
      this_form.find('input[type=text]:visible').each(function () {
        if (!$.trim($(this).val())) {
          $(this).addClass('error');
          all_titles_exists = false;
        } else {
          $(this).removeClass('error');
        }
      });

      if (!all_titles_exists) {
        ShowXajaxNotification('EMPTY_TEXT_FIELDS');
        return false;
      }

      var field_type = this_form.find('#field_type').first().val();
      //если это выпадающий список
      if (field_type == 'select') {
        //если нет значений
        if (this_form.find('.selects li').length == 0) {
          ShowXajaxNotification('EMPTY_SELECT_OPTIONS');
          return false;
        }
      }
      ShowSpinButton('button_create');
      return true;
    });
  });

  $(document).on('click', 'input.input--checkbox', function (e) {
    if ($(this).parents('.fields').siblings('.fields_select').length) {
      var b_hide_lang = true;

      $(this).parents('.fields').siblings('.fields').each(function (index, element) {
        if (e.target === 'input' || e.target.getAttribute('type') === "text") {
          return
        }
        $(element).removeClass('flt_l');
        $(element).removeClass('flt_r');
        if (index % 2 == 0) {
          $(element).addClass('flt_l');
        } else {
          $(element).addClass('flt_r');
        }
        form_id = $(this).attr('rel');
        if (multilang_form[form_id]) {
          b_hide_lang = false;
        }
      });

      var fieldText = $.trim($(this).parents('label').text());
      $(this).parents('.fields').siblings('.fields_select').children('span').each(function (index, element) {
        if ($(element).text() == fieldText) $(element).removeClass('invisible');
        if ($(element).parent('.fields_select').is(':hidden')) $(element).parent('.fields_select').show();
      });
      var field_id = SelectNumber($(this).parents('form').attr('id'));
      var form_id = $(this).parent().parent().parent().attr('rel');
      if (field_id == 0) {
        var type = $('#form_0 .fields_type span.active').attr('rel');
      } else {
        var type = $('#form_' + field_id).attr('rel_type');
        type = type == 4 ? 'select' : 'undefined';
      }

      if (type == 'select' && b_hide_lang) {
        var selects_el = $(this).parents('form').find('.fields_add_selects');
        selects_el.find('.list_lang_form').hide();
        selects_el.find('input[id^=field_options_]').hide();
        selects_el.find('input[id^=field_options_]').each(function () {
          if (parseInt(this.id.match(/[0-9]+$/)) == 1)
            $(this).show();
        })
      }
      if (e.target === 'input' || e.target.getAttribute('type') === "text") {
        return
      }
      $(this).parents('.fields').remove();

      checkingAddedField()
    }

    if ($(this).prop('checked')) {
      $(this).parents('label').removeClass('check_off');
      $(this).parents('label').siblings('input').removeAttr('disabled');
    } else {
      $(this).parents('label').addClass('check_off');
      $(this).parents('label').siblings('input[type=text]').attr('disabled', 'disabled');
    }
  });

  $(function () {
    $(document).on('click', '.required_icon:not(.disabled)', function (e) {
      e.preventDefault();
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        $(this).siblings('.field-required').val('0');
        $(this).attr('title', Translate('custom_fields/optional'));
      } else {
        $(this).addClass('active');
        $(this).siblings('.field-required').val('1');
        $(this).attr('title', Translate('custom_fields/obligatory'));
      }
    });
    $(document).on('click', '.disabled_icon:not(.disabled)', function (e) {
      e.preventDefault();
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        $(this).siblings('.field-disabled').val('1');
        $(this).attr('title', Translate('custom_fields_form_item/user_can_see'));
      } else {
        $(this).addClass('active');
        $(this).siblings('.field-disabled').val('0');
        $(this).attr('title', Translate('custom_fields_form_item/user_can_edit'));
      }
    });
  });

  $(function () {
    $(document).on('click', '.actionBlock .edit', function (e) {
      e.preventDefault();
      var number = $(this).parents('li').attr('id');
      number = number.replace('record_li_', '');
      $('#settings_li_' + number).show();
    });
  });

  $(function () {
    $('.limited .actionBlock .delete').off('click');
    $('.limited .onOff').off('click');
    $(document).on('click', '.limited .actionBlock .delete', function (e) {
      e.preventDefault();
    });
    $(document).on('click', '.limited .onOff', function (e) {
      e.preventDefault();
    });
    $(document).on('click', '#custom_fields_sort_forms .delete', function (e) {
      e.preventDefault();
      var delete_href = $(this).attr('href');
      var closes_li = $(this).closest('li');
      if (!closes_li.hasClass('limited')) {
        parentUl = closes_li.parent();
        closes_li.remove();
        parentUl.find('li').each(function (index, element) {
          $(element).find('.span-sort').text(index + 1);
        });
        $.ajax({
          url: delete_href,
          cache: false
        });

      }
    })
  });

  $(function () {
    $(document).on('click', '.formFooter a.cancel', function (e) {
      var number = $(this).attr('id');
      number = number.replace('cancel_', '');
      $('#settings_li_' + number).slideUp();
      return false;
    });
  });

  $(function () {
    $(document).on('click', '.addUser', function (e) {
      e.preventDefault();
      if ($('.groupList').is(':visible')) {
        $('#settings_li_0').show();
      }
    });

    //$(document).on('click', '.fields_type span:not(".defined_type")', function(e){
    $(document).on('click', '.fields_type span', function (e) {
      e.preventDefault();
      var fields_type_rel = $(this).attr('rel');
      $('#field_type').val(fields_type_rel);
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
      if ($(this).attr('rel') == 'select') {
        $(this).parent().siblings('.fields_add_selects').show();
        var self = $(this);
        var selects_el = $(self).parent().siblings('.fields_add_selects');
        selects_el.find('.list_lang_form').show();
        selects_el.find('input[id^=field_options_]').hide();
        selects_el.find('input[id^=field_options_]').each(function () {
          if (parseInt(this.id.match(/[0-9]+$/)) == client_lang_id_star)
            $(this).show();
        })
        $(this).parent().parent().find('.fields[rel]').each(function () {
          let form_id = $(this).attr('rel');
          if (multilang_forms.indexOf(form_id) > -1) {
//						var selects_el = $(self).parent().siblings('.fields_add_selects');
            selects_el.find('.list_lang_form').show();
            selects_el.find('input[id^=field_options_]').hide();
            selects_el.find('input[id^=field_options_]').each(function () {
              if (parseInt(this.id.match(/[0-9]+$/)) == client_lang_id_star)
                $(this).show();
            })
          }
        })
      } else {
        $(this).parent().siblings('.fields_add_selects').hide();
      }
      checkingAddedField()
    });
  });

  $(function () {
    $(document).on('click', '.coWorker a', function (e) {
      e.preventDefault();
      if ($(this).hasClass('active')) {
        return;
      }
      $(this).siblings().removeClass('active');
      $(this).addClass('active');


      if ($(this).hasClass('fields_list')) {
        $('.main_fields_list').show();
        $('.main_forms_list').hide();
      } else {
        $('.main_fields_list').hide();
        $('.main_forms_list').show();
      }
    });

    HideCaseUserLevelLists();

    $(document).on('click', '.custom_field_level a', function (e) {
      e.preventDefault();
      if ($(this).hasClass('active')) {
        return;
      }
      $(this).siblings().removeClass('active');
      $(this).addClass('active');

      $('#form_0 .new-field input[type=checkbox]').each(function () {
        $(this).trigger('click');
      });

      if ($(this).hasClass('user_level')) {
        $('#field_level').val('user');
        HideCaseUserLevelLists();
      } else {
        $('#field_level').val('case');
        ShowCaseUserLevelLists();
      }
      checkingAddedField()
    });
  });

  $(function () {
    $('.sort_fields').sortable({
        cursor: "move",
        items: ".able_sort",
        deactivate: function (event, ui) {
          $(event.target).find('li').each(function (index, element) {
            $(element).find('.span-sort').text(index + 1);
          });
        }
      },
      {
        stop: function (event, ui) {
          var li_item = ui.item;
          var closest_ul = li_item.closest('ul');
          var form_id = SelectNumber(closest_ul.attr('id'));

          var sort_li_arr = Array();
          closest_ul.find('li').each(function () {
            if (!$(this).hasClass('no_sort')) {
              var field_id = $(this).attr('id');
              field_id = field_id.replace("sort_field_" + form_id + "_", "");
              sort_li_arr.push(field_id);
            }
          });
          if (sort_li_arr.length > 0) {
            xajax_SortFormFields(form_id, sort_li_arr.join(':'));
          }

        }
      });
    $(document).on('click', '.sort_field_header', function () {
      $(this).next().toggle();
      if (($(this).attr('data-cond') == 'enabled') || (!$(this).attr('data-cond'))) {
        $(this).attr('data-cond', 'disabled');
        $(this).children('span').removeClass('fa-angle-down');
        $(this).children('span').addClass('fa-angle-right');
        $(this).addClass("-active");
      } else {
        $(this).attr('data-cond', 'enabled');
        $(this).children('span').removeClass('fa-angle-right');
        $(this).children('span').addClass('fa-angle-down');
        $(this).removeClass("-active");
      }
    });
    $(document).on('click', '.change_form', function () {
      var lang_id = $(this).attr('data-lang_id');
      $(this).parent().find('a.change_form').removeClass('active');
      $(this).addClass('active');
      $(this).parent().parent().find('input[id^=cf_input_lang_]').hide();
      $(this).parent().parent().find('input#cf_input_lang_' + lang_id).show();
      return false;
    });
    $(document).on('click', '.change_form_option', function () {
      var lang_id = $(this).attr('data-lang_id');
      var record_id = $(this).attr('data-record_id');

      $(this).parent().find('a').removeClass('active');
      $(this).addClass('active');
      $(this).parent().parent().find('input[id^=field_options_' + record_id + ']').hide();
      $(this).parent().parent().find('input#field_options_' + record_id + '_' + lang_id).show();

      return false;
    });
    $(document).on('click', '.fields_type span', function (e) {
      var type = $('#form_0 .fields_type span.active').attr('rel');
      if (type == 'checkbox') {
        $('#form_0').children('.fields').children('.required_icon').hide().hide();
      } else {
        $('#form_0').children('.fields').children('.required_icon').hide().show();
      }
    });
  });

  $(function () {
    // fa-edit - это иконка с Font Awesome 5 Pro
    // admin/channels/custom_fields кнопка редактирования START
    $(document).on('click', '.actionBlock .fa-edit', function (e) {
      e.preventDefault();
      var number = $(this).parents('li').attr('id');
      number = number.replace('record_li_', '');
      if (this.closest('.f_disabled')) return

      const numberNum = parseInt(number);
      const fieldsSelect = e.target.closest("ul").querySelector(`#settings_li_${numberNum} form .fields_select`);
      if (fieldsSelect) {
        const span = fieldsSelect?.querySelectorAll(`#settings_li_${numberNum} form span:not(.invisible)`);
        (span.length >= 1) ? fieldsSelect.style.display = '' : fieldsSelect.style.display = 'none';
      }

      const fields = Array.from( $('#settings_li_' + number)[0].querySelectorAll(".fields.new-field") )
      const span   = Array.from( $('#settings_li_' + number)[0].querySelectorAll(".fields_select > span:not(.invisible)") )
      const allFields = span.length > 0 ? fields.concat(span) : fields;

      if (allFields.length <= 1) {
        $('#settings_li_' + number)[0].querySelector(".formFooter").classList.add("-mt--61")
      }
      $('#settings_li_' + number).show();
    });
  });

  $(function () {
    var floating = 'flt_l';
    $('.selects').sortable();

    $(document).on('click', '.fields_select span', function (e) {
      var field_id = SelectNumber($(this).parents('form').attr('id'));
      var custom_form_id = $(this).attr('rel');
      var form_id = SelectNumber(custom_form_id);
      if ($(this).siblings('span:visible').length == 0) $(this).parent().hide();
      var fieldCounter = $(this).parent('.fields_select').siblings('.fields').length;
      if (fieldCounter % 2 == 0) {
        floating = 'flt_l';
      } else {
        floating = 'flt_r';
      }
      var fieldText = $(this).text();
      var new_field = $('.new-default').first().clone();
      new_field.attr('rel', form_id);
      //РїРѕРєР° РїРµСЂРµРІРѕРґС‹ РґРѕР»Р¶РЅС‹ Р±С‹С‚СЊ РЅРµ РІРѕ РІСЃРµС… С„РѕСЂРјР°С…
      if (multilang_forms.indexOf(form_id) == -1) {
        new_field.find('.list_lang_form').hide();
        new_field.find('input[id^=cf_input_lang_]').hide();
        new_field.find('input[id=cf_input_lang_1]').show();
      }
      //РїСЂРѕРІРµСЂРёРј С„РѕСЂРјСѓ, РЅР° РїСЂРµРґРјРµС‚ РјСѓР»СЊС‚РёСЏР·С‹РЅРѕСЃС‚Рё, РЅСѓР¶РЅРѕ Р»Рё РїРѕРєР°Р·С‹РІР°С‚СЊ СЏР·С‹РєРё
      if (field_id == 0) {
        var type = $('#form_0 .fields_type span.active').attr('rel');
      } else {
        var type = $('#form_' + field_id).attr('rel_type');
        type = type == 4 ? 'select' : 'undefined';
      }
      if (type == 'select' && multilang_forms.indexOf(form_id) > -1) {
        var selects_el = $(this).parent().parent().find('.fields_add_selects');
        selects_el.find('.list_lang_form').show();
        selects_el.find('input[id^=field_options_]').hide();
        selects_el.find('input[id^=field_options_]').each(function () {
          if (parseInt(this.id.match(/[0-9]+$/)) == client_lang_id_star)
            $(this).show();
        })
      }
      new_field.removeClass('new-default').removeClass('hidden').addClass(floating);
      new_field.find('.title-span').first().text(fieldText);

      new_field.find('input').each(function () {
        var tmp_name = $(this).attr('name');
        tmp_name = tmp_name.replace('default', form_id);
        $(this).attr('name', tmp_name);
      });

      new_field.find('.image-gallery').each(function () {
        var tmp_href = $(this).attr('href');
        tmp_href = tmp_href.replace('default', form_id);
        $(this).attr('href', tmp_href);
      });
      new_field.find('.disabled_icon').removeClass('active');
      //todo: РЈР±СЂР°С‚СЊ, РєРѕРіРґР° СЃРґРµР»Р°РµРј РґР»СЏ РІСЃРµС… С„РѕСЂРј РІРѕР·РјРѕР¶РЅРѕСЃС‚СЊ РїРµСЂРµРєР»СЋС‡Р°С‚СЊ РїРѕР»СЏ РІ readonly
      if (form_id == 11) {
        new_field.find('a.disabled_icon').removeClass('hidden');
        new_field.find('a.required_icon').addClass('hidden');
      } else if (form_id == 4) {
        new_field.find('a.disabled_icon').removeClass('hidden');
      }

      SetupFormImages(new_field);

      // Добавляем поля при клике на метку в конкретном поле или в "Добавить поле"
      // В зависимсоти от того где скликнули вставляем поле в нужном месте
      if ($(this).parent().parent().parent().hasClass('add-rule')) {
        $(this).parent().before(new_field);

        checkingAddedField()

      } else if ($(this).parent().parent().parent().hasClass('rule')) {
        $(this).parent().before(new_field);
      }

      $(this).addClass('invisible');
      if ($(this).parents('form').attr('rel_type')) {
        if ($(this).parents('form').attr('rel_type') == 3) {
          $(this).parent().parent().children('.fields').children('.required_icon').hide();
        } else if ($(this).parents('form').attr('rel_type') != 'undefined') {
          // $(this).parent().parent().children('.fields').children('.required_icon').show();
        }
      } else if (field_id == 0) {
        if ($('#form_0').children('#field_type').val() == 'checkbox') {
          $(this).parent().parent().children('.fields').children('.required_icon').hide();
        } else {
          // $(this).parent().parent().children('.fields').children('.required_icon').show();
        }
      }


    });


    /////

    $(document).on('click', '.add_new_select', function (e) {
      e.preventDefault();
      var selectsUl = $(this).prev();
      var new_option = $('.new_option').first().clone();
      new_option.removeClass('new_option').removeClass('hidden');
      var max_input_number = 0;
      selectsUl.find('input').each(function () {
        var input_name = $(this).attr('name');
        var name_nr = SelectNumber(input_name);
        if (name_nr > max_input_number) {
          max_input_number = name_nr;
        }
      });
      max_input_number++;

      //выставление правильного id
      new_option.find('input').each(function () {
        var tmp_name = $(this).attr('name');
        tmp_name = tmp_name.replace('default', max_input_number);
        $(this).attr('name', tmp_name);
      });

      selectsUl.append(new_option);
      checkingAddedField()
    });

    $(document).on('click', '.remove_var', function (e) {
      e.preventDefault();
      $(this).parent().remove();
      checkingAddedField()
    });
  });

  $(function () {
    SetupFormImages($('#all_custom_fields'));
  });

})(jQuery);


function HideCaseUserLevelLists() {
  $('.case_level_list').addClass('invisible');
  $('.user_level_list').removeClass('invisible');
}

function ShowCaseUserLevelLists() {
  $('.user_level_list').addClass('invisible');
  $('.case_level_list').removeClass('invisible');
}

function SetupFormImages(element) {
  element.magnificPopup({
    delegate: '.image-gallery',
    type: 'image',
    tLoading: Translate('cases_custom_fields_js/loading_picture')+' #%curr%...',
    mainClass: 'mfp-img-mobile mfp-bg-gallery',
    tClose: Translate('cases_custom_fields_js/close'),
    closeMarkup: '<button title="%title%" type="button" class="mfp-close mfp-close-gallery">×</button>',
    gallery: {
      enabled: false,
      navigateByImgClick: false,
      preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '<a href="%url%">'+Translate('cases_custom_fields_js/picture')+' #%curr%</a> '+Translate('cases_custom_fields_js/can_not_be_load'),
    }
  });
}

function ClickDeleteRecord(el) {
  if ($(el).hasClass('field-record') && !$(el)[0].closest('li').matches(".limited")) {
    StartDeleteRecord(el);
  }
}

function DeleteRecord(field_id) {
  AjaxDeleteRecord(field_id);
  $("li.field_" + field_id).each(function () {
    var parentUl = $(this).parent();
    $(this).remove();
    parentUl.find('li').each(function (index, element) {
      $(element).find('.span-sort').text(index + 1);
    });
  });
}

function CheckFormFooterPading(fotter_id) {
  form_footer = $('#' + fotter_id);
  var fieldNum = form_footer.prevAll('.fields').length;
  var rows = parseInt(fieldNum / 2);
  if (form_footer.parents('.lw_item_settings').attr('id') != 'settings_li_0') {
    if (form_footer.siblings('.fields_select').length == 0) {
      // if (fieldNum%2 == 1) {
      // 	form_footer.css('padding-top', (rows * 113 + 61) + 'px');
      // 	form_footer.parents('.lw_item_settings').css('padding-bottom', 0);
      // }
    } else {
      var fields_select = form_footer.siblings('.fields_select').first();
      var show_fields_select = false;
      fields_select.find('span').each(function () {
        if (form_footer.css('display') != 'none') {
          show_fields_select = true;
        }
      });
      if (!show_fields_select) {
        fields_select.hide();
      }
    }
  }
}

// если не выбрано ни одно поле/список в форме добавления поля - дизейблим кнопку "Создать поле" и наоборот
function checkingAddedField() {
  const button = document.querySelector("#button_create") // кнопка "Создать поле"
  const field = Array.from(document.querySelectorAll("#form_0 .fields.new-field")) // все добавленные поля
  const fieldsForSelect = document.querySelector("#form_0 .fields_add_selects ul") // список
  const li = fieldsForSelect?.offsetHeight !== 0
    && Array.from(fieldsForSelect.querySelectorAll("#form_0 .fields_add_selects li")) // если юзер выбрал список, то получаем li списка
  const target = li ? field.concat(li) : field; // если в списке есть li - объеденяем с полями, если нет - берём только поля

  target.length === 0 ? button.disabled = true : button.disabled = false;
}
