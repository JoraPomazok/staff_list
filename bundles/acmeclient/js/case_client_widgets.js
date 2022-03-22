function CreateClientWidget(widget_id) {
  var form_data_widget = {
    'title': null,
    'css_theme': null,
    'type_widget': null,
    'button_type': null,
    'button_position': null,
    'button_text': '',
    'ico_type': null,
    'ico_size': null,
    'knowledge_type': null,
    'knowledge_search_label': null,
    'knowledge_articles_ids': [],
    'knowledge_search_labels': {},
    'knowledge_text_recommended_articles': {},
    'knowledge_text_link_kb': {},
    'channels_list': {},
    'group_id': 0,
    'help_param': null,
    'help_text': null,
    'help_close': null,
    'form_title': null,
    'form_titles': {},
    'form_fields': {},
    'form_button_value': null,
    'form_button_values': {},
    'email': null, 'labels': [],
    'b_terms': 0,
    'text_terms': {},
    'b_chat_vk': 0,
    'b_chat_fb': 0,
    'chatra_group_id': '',
    'lang_id': 0,
    'help_texts': {},
    'success_type': null,
    'success_message_title': null,
    'success_message_text': null,
    'success_redirect_url': null,
    'success_message_titles': {},
    'success_message_texts': {},
    'kl_text_result_search': {},
    'kl_text_create_ticket': {},
    'form_text_search_kl': {},
    'form_text_not_found': {},
    'form_text_search_results': {},
    'form_text_all_results': {},
    'form_custom_chanels': {},
    'button_texts': {},
  };
  if (!$('li.a20_settings_step1  li.active').attr('data-form-value')) {
    ShowXajaxNotification('WIDGET_ERROR_TYPE');
    return false;
  } else {
    form_data_widget['type_widget'] = $('li.a20_settings_step1  li.active').attr('data-form-value');
    $('#WIDGET_ERROR_TYPE').fadeOut();
  }
  if ($('li.a20_settings_step2 ul.a20_position li.active').attr('data-form-value')) {
    switch ($('li.a20_settings_step2 ul.a20_position li.active').attr('data-form-value')) {
      case 'square_l':
        form_data_widget['button_type'] = 'square';
        form_data_widget['button_position'] = 'left';
        break;
      case 'square_r':
        form_data_widget['button_type'] = 'square';
        form_data_widget['button_position'] = 'right';
        break;
      case 'line_l'  :
        form_data_widget['button_type'] = 'line';
        form_data_widget['button_position'] = 'left';
        break;
      case 'line_bl' :
        form_data_widget['button_type'] = 'line';
        form_data_widget['button_position'] = 'bottom_left';
        break;
      case 'line_br' :
        form_data_widget['button_type'] = 'line';
        form_data_widget['button_position'] = 'bottom_right';
        break;
      case 'line_r'  :
        form_data_widget['button_type'] = 'line';
        form_data_widget['button_position'] = 'right';
        break;
    }
  }
  if ($('li.a20_settings_step2 #button_text'))
    form_data_widget['button_text'] = $('li.a20_settings_step2 .button_text:first').val();
  if ($('li.a20_settings_step2 ul.a20_icon li.active').attr('data-form-value'))
    form_data_widget['ico_type'] = $('li.a20_settings_step2 ul.a20_icon li.active').attr('data-form-value');
  if ($('li.a20_settings_step2 ul.a20_btn_size li.active').attr('data-form-value'))
    form_data_widget['ico_size'] = $('li.a20_settings_step2 ul.a20_btn_size li.active').attr('data-form-value');
  if ($('li.a20_settings_step2 ul.a20_color i'))
    form_data_widget['css_theme'] = $('li.a20_settings_step2 ul.a20_color i').parent().attr('class');
  if ($('li.a20_settings_step3 ul.a20_s3_switch li.active').attr('data-form-value'))
    form_data_widget['knowledge_type'] = $('li.a20_settings_step3 ul.a20_s3_switch li.active').attr('data-form-value');
  if ($('li.a20_settings_step3 #knowledge_search_label'))
    form_data_widget['knowledge_search_label'] = $('li.a20_settings_step3 .knowledge_search_label:first').val();
  if ($('li.a20_settings_step3 div.a20_articles select')) {
    form_data_widget['knowledge_articles_ids'] = articles_selected;
    // $('li.a20_settings_step3 div.a20_articles select').each(function(){
    //     form_data_widget['knowledge_articles_ids'].push($(this).val());
    // })
  }
  if ($('li.a20_settings_step4 #form_title'))
    form_data_widget['form_title'] = $('li.a20_settings_step4 .form_title:first').val();
  if ($('li.a20_settings_step4 ul.a20_form_fields select')) {
    // var i = 0;
    // $('li.a20_settings_step4 ul.a20_form_fields select').each(function(){
    //     form_data_widget['form_fields'][$(this).val()] = {
    //         'id' : $(this).val(),
    //         'required' : ($(this).parent().find('i.fa-asterisk.active').length ? true : false),
    //         'label' : $(this).parent().find('input.new_name_field').val(),
    //         'position' : i
    //     };
    //     i++;
    // })
    form_data_widget['form_fields'] = fields_selected;

  }
  if ($('li.a20_settings_step31 div.a20_chanels_list select').length) {
    var i = 0;
    let cch_id = 1;

    $('li.a20_settings_step31 div.a20_chanels_list ul.js_chanels_list>li:not([b_hide]):not([b_deleted])').each(function () {
      let id = $(this)[0].id.replace('li_channel_', '');
      if ($(this).hasClass('custom-btn')
        || $(this).hasClass('custom-standart-btn')) {
        let key = id.match(/^cch/) ? 'cch' + cch_id : id;
        form_data_widget['channels_list'][key] = {
          'id': key,
          'position': i,
          'key': key,
          'color': '',
          'icon': '',
          'chatra_group': '',
          'urls': {},
          'names': {}

        };
        $(this).find('.js_cch_name').each(function () {
          let parent = $(this).parent().parent();
          let lang_id = $(this).attr('data-lang');
          let url = $(parent).find('.js_cch_url[data-lang="' + lang_id + '"]').length ? $(parent).find('.js_cch_url[data-lang="' + lang_id + '"]').val().trim() : '';
          let name = $(parent).find('.js_cch_name[data-lang="' + lang_id + '"]').length ? $(parent).find('.js_cch_name[data-lang="' + lang_id + '"]').val().trim() : '';

          // Ваиранты с заглушкой
          // let url     = $(this).val().trim().length ? $(this).val().trim() : '#';
          // let name    = $(parent).find('.js_cch_name[data-lang="'+lang_id+'"]').length ? $(parent).find('.js_cch_name[data-lang="'+lang_id+'"]').val().trim().length ? $(parent).find('.js_cch_name[data-lang="'+lang_id+'"]').val().trim() : 'Custom channel' : '';

          let color = $(parent).find('.cch_colorpicker').val();
          let icon = $(parent).find('#section_icon_0').val();

          form_data_widget['channels_list'][key]['color'] = color;
          form_data_widget['channels_list'][key]['icon'] = icon;
          form_data_widget['channels_list'][key]['data_sel'] = $(parent).find('select.js_sc_data_select').length ? parseInt($(parent).find('select.js_sc_data_select').val()) : 0;

          form_data_widget['channels_list'][key]['urls'][lang_id] = url;
          form_data_widget['channels_list'][key]['names'][lang_id] = name;
        });
        cch_id++;
        i++;
      } else {
        let select = $(this).find('select');
        if ($(select)[0].id.match('chatra_link_groups_chat')) {
          return;
        }
        var b_deleted = $(select).parent().attr('b_deleted');
        if (!b_deleted || b_deleted == 0) {
          key = $(select)[0].id.replace('channel_', '');
          if (key == 'emails' && form_data_widget['type_widget'] == 'messengers') {
            return;
          }
          form_data_widget['channels_list'][key] = {
            'id': $(select).val(),
            'position': i,
            'key': key,
            'chatra_group': (key == 'chat' && $('#chatra_link_groups_chat_' + $(select).find('option:selected').index()).length ? $('#chatra_link_groups_chat_' + $(select).find('option:selected').index()).val() : '')
          };
          i++;
        }
      }
    });
  }
  if ($('li.a20_settings_step32 select.select_help_text'))
    form_data_widget['help_param'] = $('li.a20_settings_step32 select.select_help_text').val();
  if ($('li.a20_settings_step32 select.select_help_close'))
    form_data_widget['help_close'] = $('li.a20_settings_step32 select.select_help_close').val();
  if ($('li.a20_settings_step32 textarea#help_text_input'))
    form_data_widget['help_text'] = $('li.a20_settings_step32 textarea.js_help_text_input:first').val();
  if ($('li.a20_settings_step4 #form_button_value'))
    form_data_widget['form_button_value'] = $('li.a20_settings_step4 .form_button_value:first').val();
  if ($('li.a20_settings_step5 select.widget_email'))
    form_data_widget['email'] = $('li.a20_settings_step5 select.widget_email').val();
  if ($('li.a20_settings_step5 select.widget_group'))
    form_data_widget['group_id'] = $('li.a20_settings_step5 select.widget_group').val();
  if ($('li[data-key="step_lang"]').next().find('select').length)
    form_data_widget['lang_id'] = $('li[data-key="step_lang"]').next().find('select').val();
  if ($('li.a20_settings_step5 #label_box')) {
    const id = $('li.a20_settings_step5 #label_box').val()
    const valueItem = document.querySelectorAll(".a20_settings_step5--labels select option")
    form_data_widget['labels'] = addLabels(id, valueItem);
  }
  form_data_widget['b_terms'] = $('#b_terms').length && $('#b_terms').prop('checked') ? 1 : 0;

  form_data_widget['b_chat_vk'] = $('li#li_channel_vk .type_soc_widget a.active').length ? $('li#li_channel_vk .type_soc_widget a.active').attr('data-value') : 0;
  form_data_widget['b_chat_fb'] = $('li#li_channel_fb .type_soc_widget a.active').length ? $('li#li_channel_fb .type_soc_widget a.active').attr('data-value') : 0;

  $('.button_text').each(function () {
    form_data_widget['button_texts'][$(this).attr('data-lang')] = $(this).val()
  });
  $('.js_help_text_input').each(function () {
    form_data_widget['help_texts'][$(this).attr('data-lang')] = $(this).val()
  });
  $('.knowledge_search_label').each(function () {
    form_data_widget['knowledge_search_labels'][$(this).attr('data-lang')] = $(this).val()
  });
  $('.knowledge_text_recommended_articles').each(function () {
    form_data_widget['knowledge_text_recommended_articles'][$(this).attr('data-lang')] = $(this).val()
  });
  $('.knowledge_text_link_kb').each(function () {
    form_data_widget['knowledge_text_link_kb'][$(this).attr('data-lang')] = $(this).val()
  });
  $('.form_title').each(function () {
    form_data_widget['form_titles'][$(this).attr('data-lang')] = $(this).val()
  });
  $('.form_button_value').each(function () {
    form_data_widget['form_button_values'][$(this).attr('data-lang')] = $(this).val()
  });
  $('.js_terms_input').each(function () {
    form_data_widget['text_terms'][$(this).attr('data-lang')] = $(this).val()
  });
  $('.message_title_input').each(function () {
    form_data_widget['success_message_titles'][$(this).attr('data-lang')] = $(this).val()
  });
  $('.message_text_input').each(function () {
    form_data_widget['success_message_texts'][$(this).attr('data-lang')] = $(this).val()
  });
  $('.kl_text_result_search').each(function () {
    form_data_widget['kl_text_result_search'][$(this).attr('data-lang')] = $(this).val()
  });
  $('.kl_text_create_ticket').each(function () {
    form_data_widget['kl_text_create_ticket'][$(this).attr('data-lang')] = $(this).val()
  });
  $('.form_text_not_found').each(function () {
    form_data_widget['form_text_not_found'][$(this).attr('data-lang')] = $(this).val()
  });
  $('.form_text_search_results').each(function () {
    form_data_widget['form_text_search_results'][$(this).attr('data-lang')] = $(this).val()
  });
  $('.form_text_search_kl').each(function () {
    form_data_widget['form_text_search_kl'][$(this).attr('data-lang')] = $(this).val()
  });
  $('.form_text_all_results').each(function () {
    form_data_widget['form_text_all_results'][$(this).attr('data-lang')] = $(this).val()
  });


  if ($('li.a20_settings_step6 ul li.active').attr('data-form-value'))
    form_data_widget['success_type'] = $('li.a20_settings_step6 ul li.active').attr('data-form-value');
  if ($('li.a20_settings_step6 #message_title_input'))
    form_data_widget['success_message_title'] = $('li.a20_settings_step6 .message_title_input:first').val();
  if ($('li.a20_settings_step6 #message_text_input'))
    form_data_widget['success_message_text'] = $('li.a20_settings_step6 .message_text_input:first').val();
  if ($('li.a20_settings_step6 #redirect_url_input'))
    form_data_widget['success_redirect_url'] = $('li.a20_settings_step6 #redirect_url_input').val();


  $('.js_chanels_list li[class*="custom-"]:not([b_hide]):not([b_deleted]) input[type="text"]:not([class*="select2"])').each(function (i, el) {
    if (wid_type == 'mail') {
      return
    }
    if (!$(this).val()) {
      let $this = $(this);
      let parent = $(this).closest('li');
      let data_lang = $(this).attr('data-lang')

      if (parent.hasClass('custom-standart-btn')) {
        !$('#WIDGET_ERROR_СUSTOM_STANDART').is(':visible') ? ShowXajaxNotification('WIDGET_ERROR_СUSTOM_STANDART') : null;
      } else {
        !$('#WIDGET_ERROR_СUSTOM_CHANNEL').is(':visible') ? ShowXajaxNotification('WIDGET_ERROR_СUSTOM_CHANNEL') : null;
      }

      // открываем вкладку "Настройка каналов"
      !$('.a20_settings_step31').is(':visible') ? $('.a20_step_031').trigger('click') : null;

      $(this).addClass('border-error');

      // выбираем язык === setTimeout, потому что обновляется a20_step_031 при открытии вкладки, функцией SetLang()
      setTimeout(function () {
        if ($this.hasClass('border-error') && !parent.find('input[type="text"]:not([class*="select2"]).border-error:visible').length) {
          parent.find('.change_form[data-lang="' + data_lang + '"]:not(.active)').trigger('click')
          marked($this[0].closest("li"))
        }
      }, 250)

      return
    }
  })

  $('.js_chanels_list li[class*="custom-"]:not([b_hide]) input[type="text"]:not([class*="select2"])').on('change paste keyup', function() {
    $(this).removeClass('border-error');
  })

  if($('.js_chanels_list li[class*="custom-"]:not([b_hide]) input[type="text"]:not([class*="select2"])').hasClass('border-error')) {
    return
  } else {
    $('#WIDGET_ERROR_СUSTOM_CHANNEL').fadeOut();
    $('#WIDGET_ERROR_СUSTOM_STANDART').fadeOut();
  }

  if(!$('#widget_title').val()) {
    ShowXajaxNotification('WIDGET_ERROR_TITLE');
    $('#widget_title').addClass('border-error');
    return false;
  }
  else {
    $('#WIDGET_ERROR_TITLE').fadeOut();
    $('#widget_title').removeClass('border-error');
    form_data_widget['title'] = $('#widget_title').val()
  }

  ShowSpinButton('client_widget_link');
  // console.log(form_data_widget);
  xajax_SaveWidget(form_data_widget,widget_id);
}

// Надстройки цветовой схемы
var globalCS = {
  second_red: {
    border: '1px solid rgba(233, 30, 99, 0.5)',
    colorText: 'rgba(233, 30, 99, 1)',
    bg100: 'rgba(233, 30, 99, 1)',
    bg10: 'rgba(233, 30, 99, 0.1)',
    scrollIn: '#ffe0eb'
  },
  second_violet: {
    border: '1px solid rgba(156, 39, 176, 0.5)',
    colorText: 'rgba(156, 39, 176, 1)',
    bg100: 'rgba(156, 39, 176, 1)',
    bg10: 'rgba(156, 39, 176, 0.1)',
    scrollIn: '#fae0ff'
  },
  third_violet: {
    border: '1px solid rgba(103, 58, 183, 0.5)',
    colorText: 'rgba(103, 58, 183, 1)',
    bg100: 'rgba(103, 58, 183, 1)',
    bg10: 'rgba(103, 58, 183, 0.1)',
    scrollIn: '#ece0ff'
  },
  dark_blue: {
    border: '1px solid rgba(63, 81, 181, 0.5)',
    colorText: 'rgba(63, 81, 181, 1)',
    bg100: 'rgba(63, 81, 181, 1)',
    bg10: 'rgba(63, 81, 181, 0.1)',
    scrollIn: '#e0e5ff'
  },
  light_blue: {
    border: '1px solid rgba(3, 169, 244, 0.5)',
    colorText: 'rgba(3, 169, 244, 1)',
    bg100: 'rgba(3, 169, 244, 1)',
    bg10: 'rgba(3, 169, 244, 0.1)',
    scrollIn: '#e0f5ff'
  },
  dark_green: {
    border: '1px solid rgba(0, 150, 136, 0.5)',
    colorText: 'rgba(0, 150, 136, 1)',
    bg100: 'rgba(0, 150, 136, 1)',
    bg10: 'rgba(0, 150, 136, 0.1)',
    scrollIn: '#e0fffc'
  },
  light_salad: {
    border: '1px solid rgba(192, 202, 51, 0.5)',
    colorText: 'rgba(192, 202, 51, 1)',
    bg100: 'rgba(192, 202, 51, 1)',
    bg10: 'rgba(192, 202, 51, 0.1)',
    scrollIn: '#fdffe0'
  },
  dark_orange: {
    border: '1px solid rgba(239, 108, 0, 0.5)',
    colorText: 'rgba(239, 108, 0, 1)',
    bg100: 'rgba(239, 108, 0, 1)',
    bg10: 'rgba(239, 108, 0, 0.1)',
    scrollIn: '#ffeee0'
  },
  second_dark_orange: {
    border: '1px solid rgba(244, 81, 30, 0.5)',
    colorText: 'rgba(244, 81, 30, 1)',
    bg100: 'rgba(244, 81, 30, 1)',
    bg10: 'rgba(244, 81, 30, 0.1)',
    scrollIn: '#ffe8e0'
  },
  brown: {
    border: '1px solid rgba(121, 85, 72, 0.5)',
    colorText: 'rgba(121, 85, 72, 1)',
    bg100: 'rgba(121, 85, 72, 1)',
    bg10: 'rgba(121, 85, 72, 0.1)',
    scrollIn: '#eae0dc'
  },
  gray: {
    border: '1px solid rgba(84, 110, 122, 0.5)',
    colorText: 'rgba(84, 110, 122, 1)',
    bg100: 'rgba(84, 110, 122, 1)',
    bg10: 'rgba(84, 110, 122, 0.1)',
    scrollIn: '#e1e7ea'
  },
  orange: {
    border: '1px solid rgba(255, 148, 50, 0.5)',
    colorText: 'rgba(255, 148, 50, 1)',
    bg100: 'rgba(255, 148, 50, 1)',
    bg10: 'rgba(255, 148, 50, 0.1)',
    scrollIn: '#fff3e0'
  },
  red: {
    border: '1px solid rgba(254, 72, 80, 0.5)',
    colorText: 'rgba(254, 72, 80, 1)',
    bg100: 'rgba(254, 72, 80, 1)',
    bg10: 'rgba(254, 72, 80, 0.1)',
    scrollIn: '#ffeaea'
  },
  yellow: {
    border: '1px solid rgba(250, 200, 33, 0.5)',
    colorText: 'rgba(250, 200, 33, 1)',
    bg100: 'rgba(250, 200, 33, 1)',
    bg10: 'rgba(250, 200, 33, 0.1)',
    scrollIn: '#fdfcee'
  },
  violet: {
    border: '1px solid rgba(167, 72, 232, 0.5)',
    colorText: 'rgba(167, 72, 232, 1)',
    bg100: 'rgba(167, 72, 232, 1)',
    bg10: 'rgba(167, 72, 232, 0.1)',
    scrollIn: '#f2eefb'
  },
  blue: {
    border: '1px solid rgba(48, 133, 209, 0.5)',
    colorText: 'rgba(48, 133, 209, 1)',
    bg100: 'rgba(24, 153, 248, 1)',
    bg10: 'rgba(24, 153, 248, 0.1)',
    scrollIn: '#e3f3fe'
  },
  cyan: {
    border: '1px solid rgba(0, 207, 224, 0.5)',
    colorText: 'rgba(0, 207, 224, 1)',
    bg100: 'rgba(0, 207, 224, 1)',
    bg10: 'rgba(0, 207, 224, 0.1)',
    scrollIn: '#e8f9fb'
  },
  salad: {
    border: '1px solid rgba(122, 207, 31, 0.5)',
    colorText: 'rgba(122, 207, 31, 1)',
    bg100: 'rgba(122, 207, 31, 1)',
    bg10: 'rgba(122, 207, 31, 0.1)',
    scrollIn: '#f1f9e9'
  },
  green: {
    border: '1px solid rgba(0, 178, 87, 0.5)',
    colorText: 'rgba(0, 178, 87, 1)',
    bg100: 'rgba(0, 178, 87, 1)',
    bg10: 'rgba(0, 178, 87, 0.1)',
    scrollIn: '#e6f6e6'
  },
  white: {
    border: '1px solid rgba(217, 217, 217, 0.5)',
    colorText: 'rgba(48, 113, 169, 1)',
    bg100: 'rgba(238, 238, 238, 1)',
    bg10: 'rgba(238, 238, 238, 1)',
    scrollIn: '#f4f4f4'
  }
  // сделано через класс black-theme
  // black: {
  //     border: '1px solid rgba(84, 88, 96, 0.5)',
  //     colorText: 'rgba(84, 88, 96, 1)',
  //     bg100: 'rgba(84, 88, 96, 1)',
  //     bg10: 'rgba(84, 88, 96, 0.1)',
  //     scrollIn: '#eaebec'
  // }
};

function changeGlobalSC(color) {
  for (var key in globalCS) {
    if (key == color) {
      if (color != 'white') {
        $('.a20_slides .a20_slide4 .a20_zoom > li h4').css('color', '');
        $('.a20_slide6 .a20_win_success h3').css('color', '');
        $('.a20_slides .a20_slide4 .a20_zoom > li h4 i').css('opacity', '1');
        $('.a20_slides .a20_slide4 .a20_zoom > li .a20_form_foot .a20_send_form').css('background', '');
        $('.a20_slides .a20_slide4 .a20_zoom > li .a20_form_foot .a20_add_file').css('background', '');
        $('.a20_preview_modal .a20_zoom > li .a20_form_foot .a20_send_form').css('background', '');
        $('.a20_preview_modal .a20_zoom > li .a20_form_foot .a20_add_file').css('background', '');
        $('.a20_preview_modal .a20_zoom > li.white p').css('color', '');
        $('.a20_preview_modal .a20_zoom > li.white i').css('color', '');
        $('.a20_scroll_thumb').css('background', '');
      }
      $('.a20_border_cs').css('border-top', globalCS[key].border);
      $('.a20_color_cs').css('color', globalCS[key].colorText);
      $('.a20_bg100_cs').css('background', globalCS[key].bg100);
      $('.a20_bg10_cs').css('background', globalCS[key].bg10);
      $('.a20_scroll_in').css('background', globalCS[key].scrollIn);
      $('.a20_scroll_thumb').css('background', globalCS[key].bg100);
      if (color == 'white') {
        $('.a20_slides .a20_slide4 .a20_zoom > li h4').css('color', '#000');
        $('.a20_slide6 .a20_win_success h3').css('color', '#000');
        $('.a20_slides .a20_slide4 .a20_zoom > li h4 i').css('opacity', '0.4');
        $('.a20_slides .a20_slide4 .a20_zoom > li .a20_form_foot .a20_send_form').css('background', '#8ac34b');
        $('.a20_slides .a20_slide4 .a20_zoom > li .a20_form_foot .a20_add_file').css('background', '#8ac34b');
        $('.a20_preview_modal .a20_zoom > li .a20_form_foot .a20_send_form').css('background', '#8ac34b');
        $('.a20_preview_modal .a20_zoom > li .a20_form_foot .a20_add_file').css('background', '#8ac34b');
        $('.a20_preview_modal .a20_zoom > li.white p').css('color', '#8ac34b');
        $('.a20_preview_modal .a20_zoom > li.white i').css('color', '#8ac34b');
        $('.a20_scroll_thumb').css('background', '#a4a4a4');
      }
    }
  }

  // при загрузке, если цвет темы - черный
  $('.a20_color li.black i').length ? $('.a20_slide2, .a20_slide3, .a20_slide4, .a20_slide6').addClass('black-theme') : $('.a20_slide2, .a20_slide3, .a20_slide4, .a20_slide6').removeClass('black-theme');
}

// Преобразовываем метки в массив объектов перед отправкой на сервер
function addLabels(id, valueItem) {
  let idVal = id.split(',') // Преобразовываем строку с id в массив
  let value = []

  if (valueItem.length === 0) {
    return undefined
  }
  valueItem.forEach(element => {
    value.push(element.textContent)
  }) // Вытягиваем текст метки из item

  let labels = idVal.map(function (item, index) {
    return {'id': item, 'text': value[index], 'value': item, 'label': value[index], 'selected': true}
  }) // Создаём необходимого вида массив объектов

  return labels
}
