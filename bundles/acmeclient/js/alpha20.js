var gAllFields = {};
var cnt_all_fields = 0;
var arr_allowed = [];
var update_preview_recommend = true;
var widget_lang_id = null;
let etalonSelectArticles;
let etalonSelectSettings;
let chanelInit; // иниты селектов у каналов при загрузке страницы
let newChanelInit = [] // иниты селектов у каналов после удалении и вставки
let channelForChoices = [] // список опций для каналов
let channelForChoicesLang = [] // список опций для каналов при смене языка
let channelInitForAdded // селект "Выберите канал"
let optionForChatra = []


function InitSelects() {
  // Инитим селекты в "Первый шаг" -> "Рекомендуемые статьи"
  const init = choicesInit('.a20_articles select:not([data-choice]), .a20_form_fields select:not([data-choice])', {
    searchEnabled: false,
    shouldSort: false,
    itemSelectText: '',
    noResultsText: Translate('alpha20_js/no_results'),
    noChoicesText: Translate('alpha20_js/no_variants')
  });

  noTranslated(".a20_articles li[data-noranslated]");    // Рекомендуемые статьи
  noTranslated(".a20_form_fields li[data-noranslated]"); // Поля формы

  // Если в "Рекомендуемые статьи" доступна только 1 опция для выбора, то мы на .choices навешиваем класс и подсвечиваем
  (function () {
    const markedOption = Array.from(document.querySelectorAll(".a20_articles .choices"))
    if (markedOption.length === 0) {
      return
    }

    markedOption.forEach(element => {
      const option = element.querySelectorAll(".choices__list.choices__list--dropdown .choices__item--selectable")
      if (option.length <= 1) {
        element.closest(".choices").classList.add("-js-is-highlighted")
      }
    })
  }());

  $('.a20_articles ul, .a20_form_fields, .a20_chanels_list  ul.js_chanels_list').sortable({
    items: 'li:not(.noorder)',
    handle: '.-js-move-item',
    cursor: 'ns-resize',
  });

  $('.a20_zoom .nano').nanoScroller({alwaysVisible: true});
  $('.a20_zoom .nano .nano-pane').addClass('a20_scroll_in');
  $('.a20_zoom .nano .nano-pane .nano-slider').addClass('a20_scroll_thumb');
  $('.a20_articles select').on('change', function () {
    articles_selected = [];
    $('.a20_articles select').each(function () {
      articles_selected.push($(this).val());
    })
  })

  return init
}

$(document).ready(function () {
  $('.js_terms_input').each(function () {
    this.id = 'terms_input' + GenUid(4);
    CreateHtmlEditor(this.id, 48, false, false, false, false, false);
    if ($('.js_block_terms a').length && $(this).attr('data-lang') != $('.js_block_terms a.active').attr('data-lang')) {
      $(this).parent().hide();
    }
  });
  $(document).on('click', '.type_soc_widget a', function (e) {
    e.preventDefault();
    $(this).parent().find('a').removeClass('active');
    $(this).addClass('active');
  })

  // при клике на div с языками или на селект - подсвечиваем непереведённые опции
  const wrapper = document.querySelector('.js_chanels_list')
  wrapper.addEventListener("click", (event) => marked(event.target.closest("li")))

  ;(function () {
    const option = document.querySelectorAll(".chatra_link_groups_chat option")
    option.forEach(element => {
      const text = element.textContent.replace(/\s+/g, ' ').trim()
      optionForChatra.push({ value : element.value, label : text })
    })
  }());
});

$(document).on('ready', function () {
  InitColorPicker($(".a20_steps .custom-btn .cch_colorpicker, .a20_steps .custom-standart-btn .cch_colorpicker"));
});

(function ($) {

  $(function () {
    InitSelects();
    $('select#channel_chat').on('change', function () {
      let _el = $(this).parents('li');
      ChangeChatraChannel(_el);
    })
  });

  choicesInit('.a20_form_fields select:not([data-choice])', {
    searchEnabled: false,
    shouldSort: false,
    itemSelectText: '',
    noResultsText: Translate('alpha20_js/no_results'),
    noChoicesText: Translate('alpha20_js/no_variants')
  })

  $(function () {
    $('li.a20_step, #client_widget_link').on('click', function () {
      $('.js_chanels_list .channel-default').remove();

      !$('.a20_settings_step31').is(':visible') ? $('.a20_slide3 .a20_form_foot').hide() : null;

      $('.a20_slide3 .search_panel .fa-search').show();
      $('.a20_slide3 .search_panel .fa-times').hide();

      if ($(this).hasClass('a20_step_031')) {
        update_preview_recommend = false;
      } else {
        if ($('.a20_settings_step31').is(':visible')) {
          return
        }
        update_preview_recommend = true;
      }
    });
    /* 1-st step */
    $('li.a20_step[data-key="step_type"]').on('click', function () {
      $('#WIDGET_ERROR_СUSTOM_CHANNEL').fadeOut();
      $('#WIDGET_ERROR_СUSTOM_STANDART').fadeOut();
      $('li[class^=a20_settings_step]').slideUp(400);
      $('li[class^=a20_slide]').hide();
      $('.a20_full_size').hide();
      $('.a20_settings_step1').slideDown(400);
      $('.a20_slide1').show();
      refreshHeaders(this);
      if ($(this).hasClass('setted')) toggleNumber($(this));
    });

    $('.a20_settings_step1 ul li').on('click', function () {
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
      $('.a20_settings_step1').prev().find('.a20_number b').hide();
      $('.a20_settings_step1').prev().find('.a20_number i').show();
      $('.a20_settings_step1').prev().addClass('setted');

      $('.a20_slide2 .a20_zoom.messengers_containers').hide();
      $('.a20_slide2 .a20_zoom .a20_help_text').hide();
      $('.a20_slide2 ul.a20_zoom').show();
      wid_type = GetWidgetType();
      $('#WIDGET_ERROR_TYPE').fadeOut();
      if (button_type == "line" && wid_type.match(/messengers/)) {
        $('.a20_position li').eq(1).trigger('click')
      }

      prepareDisplay(wid_type);
      refreshHeaders(this);
      recountNumbers();
      $('.a20_settings_step1').prev().find('.a20_step_edit').show();
      $('.a20_settings_step1').hide();
      $('.a20_settings_step2').show();
      $('.a20_step_02 .a20_number').addClass('editing');
      $('.a20_step_02').css('cursor', 'pointer');
      if ($('.a20_step_02').hasClass('setted')) toggleNumber($('.a20_step_02'));
      $('.a20_slide1').hide();
      $('.a20_slide2').show();
      $('.a20_full_size').css('display', 'block');
      $('.a20_step_032').css('cursor', 'pointer');
      GenerateChannelSelectList();
    });

    /* 2-nd step */
    $('li.a20_step[data-key="step_init_button"]').on('click', function () {
      if (!$(this).prevAll(".a20_step:visible:first").hasClass('setted')) {
        return;
      }

      if ($('.a20_step_01').hasClass('setted')) {
        $('li[class^=a20_settings_step]').slideUp(400);
        $('.a20_settings_step2').slideDown(400);
        //
        $('li[class^=a20_slide]').hide();
        $('.a20_slide2 .a20_zoom.messengers_containers').hide();
        $('.a20_slide2 .a20_zoom .a20_help_text').hide();
        $('.a20_slide2 ul.a20_zoom').show();
        $('.a20_slide2').show();
        $('.a20_full_size').show();
        refreshHeaders(this);
        if ($(this).hasClass('setted')) toggleNumber($(this));
      }
    });

    $('.a20_position li').on('click', function () {
      //js_help_text_input
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
      if (($(this).index() == 0) || ($(this).index() == 1)) {
        $('.a20_settings_step2 h4:eq(3)').show();
        $('.a20_settings_step2 .a20_btn_size').show();
        $('.a20_settings_step2 .last').hide();
        // $('.a20_settings_step2 input[type="text"]').hide();
        $('.a20_step_032').show();
        SelectNano(".a20_step_032")
        $('.a20_step_03').css('cursor', 'default');

        button_type = 'square';
      } else {
        $('.a20_settings_step2 .last').show();
        // $('.a20_settings_step2 input[type="text"]').show();
        $('.a20_settings_step2 h4:eq(3)').hide();
        $('.a20_settings_step2 .a20_btn_size').hide();
        $('.a20_step_032').hide();
        $('.a20_step_03').css('cursor', 'pointer');

        button_type = 'line';
      }
      switch ($(this).index()) {
        case 0:
          button_position = 'left';
          break;
        case 1:
          button_position = 'right';
          break;
        case 2:
          button_position = 'left';
          break;
        case 3:
          button_position = 'bottom_left';
          break;
        case 4:
          button_position = 'bottom_right';
          break;
        case 5:
          button_position = 'right';
          break;
      }
      changeButtonType($(this).index());
      updatePreview();
    });

    $('.a20_icon li').on('click', function () {
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
      var iconSymbol = $(this).children().attr('class');
      changeIcon(iconSymbol);
    });

    $('.a20_color li').on('click', function () {
      $(this).siblings().html('');
      $(this).html('<i class="fa fa-check"></i>');
      var currentColor = $(this).attr('class');
      currentGlobalCSE = currentColor;
      changeButtonColor(currentColor);
      changeGlobalSC(currentColor);
    });

    $('.a20_btn_size li').on('click', function () {
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
      changeSqrButtonSize($(this).index());
    });

    $('.a20_settings_step2 input[type="text"]').on('keyup', function () {
      updatePreview()
    });

    function changeButtonType(index) {
      switch (index) {
        case 0:
          $('.a20_slide2 .a20_zoom li').hide();
          $('.a20_slide2 .a20_zoom li.a20_sqr_btn').show();
          $('.a20_slide2 .a20_zoom li.a20_sqr_btn').removeClass('a20_right').addClass('a20_left');
          $('.a20_slide2 .a20_zoom li.a20_help_text').removeClass('a20_right').addClass('a20_left');
          $('.a20_slide2 .a20_zoom.a20_sqr_btn').removeClass('a20_right').addClass('a20_left');
          break;
        case 1:
          $('.a20_slide2 .a20_zoom li').hide();
          $('.a20_slide2 .a20_zoom li.a20_sqr_btn').show();
          $('.a20_slide2 .a20_zoom li.a20_sqr_btn').removeClass('a20_left').addClass('a20_right');
          $('.a20_slide2 .a20_zoom li.a20_help_text').removeClass('a20_left').addClass('a20_right');
          $('.a20_slide2 .a20_zoom.a20_sqr_btn').removeClass('a20_left').addClass('a20_right');
          break;
        case 2:
          $('.a20_slide2 .a20_zoom li').hide();
          $('.a20_slide2 .a20_zoom li.a20_str_vert').show();
          $('.a20_slide2 .a20_zoom li.a20_str_vert').removeClass('a20_pos_right').addClass('a20_pos_left');
          $('.a20_slide2 .a20_zoom li.a20_str_vert').css('right', 'auto');
          break;
        case 3:
          $('.a20_slide2 .a20_zoom li').hide();
          $('.a20_slide2 .a20_zoom li.a20_str_hor').show();
          $('.a20_slide2 .a20_zoom li.a20_str_hor').removeClass('a20_right').addClass('a20_left');
          break;
        case 4:
          $('.a20_slide2 .a20_zoom li').hide();
          $('.a20_slide2 .a20_zoom li.a20_str_hor').show();
          $('.a20_slide2 .a20_zoom li.a20_str_hor').removeClass('a20_left').addClass('a20_right');
          break;
        case 5:
          $('.a20_slide2 .a20_zoom li').hide();
          $('.a20_slide2 .a20_zoom li.a20_str_vert').show();
          $('.a20_slide2 .a20_zoom li.a20_str_vert').removeClass('a20_pos_left').addClass('a20_pos_right');
          var offset = $('.a20_slide2 .a20_zoom li.a20_str_vert').width();
          $('.a20_slide2 .a20_zoom li.a20_str_vert').css('right', (-offset + 36) + 'px');
          break
      }
    }

    function changeIcon(icon) {
      $('.a20_slide2 .a20_zoom li i').each(function (index, element) {
        $(element).removeAttr('class').addClass(icon);
      });
    }

    // function changeButtonColor(color) {
    //   $('.a20_slide2 .a20_zoom li').each(function (index, element) {
    //     $(element).removeClass('yellow').removeClass('orange').removeClass('red').removeClass('violet').removeClass('blue').removeClass('cyan').removeClass('salad').removeClass('green').removeClass('white').removeClass('black');
    //     $(element).addClass(color);
    //   });
    //
    //   color == 'black' ? $('.a20_slide2, .a20_slide3, .a20_slide4, .a20_slide6').addClass('black-theme') : $('a20_slide2, .a20_slide3, .a20_slide4, .a20_slide6').removeClass('black-theme');
    // }

    function changeSqrButtonSize(index) {
      $('.a20_zoom .a20_sqr_btn').removeClass('a20_sqr_36').removeClass('a20_sqr_42').removeClass('a20_sqr_50');
      $('.a20_zoom .a20_help_text').removeClass('a20_sqr_36').removeClass('a20_sqr_42').removeClass('a20_sqr_50');

      switch (index) {
        case 0:
          $('.a20_zoom .a20_sqr_btn').addClass('a20_sqr_36');
          $('.a20_zoom .a20_help_text').addClass('a20_sqr_36');
          break;
        case 1:
          $('.a20_zoom .a20_sqr_btn').addClass('a20_sqr_42');
          $('.a20_zoom .a20_help_text').addClass('a20_sqr_42');
          break;
        case 2:
          $('.a20_zoom .a20_sqr_btn').addClass('a20_sqr_50');
          $('.a20_zoom .a20_help_text').addClass('a20_sqr_50');
          break
      }

      switch (index) {
        case 0:
          $('.a20_zoom.a20_sqr_btn').addClass('a20_sqr_36');
          $('.messenger_link.messenger_text a').html('OMNI');
          break;
        case 1:
          $('.a20_zoom.a20_sqr_btn').addClass('a20_sqr_42');
          break;
        case 2:
          $('.a20_zoom.a20_sqr_btn').addClass('a20_sqr_50');
          break
      }
    }

    /* 3-rd step */
    $('li.a20_step[data-key="step_init_knowledge"]').on('click', function () {
      if (!$(this).prevAll(".a20_step:visible:first").hasClass('setted')) {
        return;
      }
      update_preview_recommend = true;

      if ($('.a20_step_01').hasClass('setted')) {
        $('.a20_slide3 .a20_form_foot').hide();
        $('li[class^=a20_settings_step]').slideUp(400);
        $('.a20_settings_step3').slideDown(400);
        $('li[class^=a20_slide]').hide();
        $('.a20_slide3').show();
        $('.a20_full_size').show();
        $('.a20_step_03 .a20_number').addClass('editing');
        $('.a20_settings_step2').prev().find('.a20_number b').hide();
        $('.a20_settings_step2').prev().find('.a20_number i').show();
        $('.a20_settings_step2').prev().addClass('setted');
        $('.a20_settings_step2').prev().find('.a20_step_edit').show();
        refreshHeaders(this);
        if ($(this).hasClass('setted')) toggleNumber($(this));
        /*if (button_type == 'square') $('.a20_settings_step2').prev().find('.a20_step_name').addClass('a20_gray').html('Кнопка: <b>иконка + текст</b>');
        if (button_type == 'line') $('.a20_settings_step2').prev().find('.a20_step_name').addClass('a20_gray').html('Кнопка: <b>полоска + текст</b>');*/
        $('.a20_step_04').css('cursor', 'pointer');
        setTimeout(function () {
          SetLang();
          SelectNano(".a20_articles")
        }, 310)
        // когда при загрузке изначально только поиск
        $(".a20_settings_step3 .a20_articles").trigger('click');
      }
    });

    $('.a20_s3_switch li').on('click', function () {
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
      if ($(this).index() == 0) {
        $('.a20_settings_step3 .last').show();
        $('.a20_settings_step3 .a20_articles').show();
        //$('.a20_settings_step3 input[type="text"]').css('margin-bottom', '16px');
        $('.a20_zoom .recommended').show();
        $('.a20_slide3 .search_panel p').text(strToText($('input.knowledge_search_label:visible').val()));
        $('.a20_slide3 div.recommended span.name').text(strToText($('input.knowledge_text_recommended_articles:visible').val()));
        $('.a20_slide3 div.recommended span.link').text(strToText($('input.knowledge_text_link_kb:visible').val()));
        first_step = 'recomendations';
      } else {
        $('.a20_settings_step3 .last').hide();
        $('.a20_settings_step3 .a20_articles').hide();
        //$('.a20_settings_step3 input[type="text"]').css('margin-bottom', '20px');
        $('.a20_zoom .recommended').hide();
        $('.a20_slide3 .search_panel p').text(strToText($('input.knowledge_search_label:visible').val()));
        $('.a20_slide3 div.recommended span.name').text(strToText($('input.knowledge_text_recommended_articles:visible').val()));
        $('.a20_slide3 div.recommended span.link').text(strToText($('input.knowledge_text_link_kb:visible').val()));
        first_step = 'search';
      }
      centeringStep3();
      SelectNano(".a20_s3_switch")
    });

    $('.a20_articles a').on('click', function (e) {
      e.preventDefault();
      articles_num++;
      if (articles_num == 5) {
        $(this).hide();
      }
      //$(this).prev().find('li:last').clone().appendTo('.a20_articles ul');

      $(etalonSelectArticles).appendTo('.a20_articles ul'); // вставляем селект в шаге 4 "Рекомендуемые статьи"

      $('.a20_articles ul li:last').find('.select2-container').remove();
      $('.a20_articles ul li:last').find('.mySelect').removeClass('.select2-offscreen');
      // $('.a20_articles ul li:last').find('.mySelect').select2({minimumResultsForSearch: Infinity});
      InitSelects();
      setTimeout(function () {
        updateArticlesList();
        centeringStep3();
        SelectNano(".a20_articles")
      }, 310)
    });

    $('.a20_settings_step3  input[type="text"]').on('keyup', function () {
      if ($(this).parents('.a20_articles').length) {
        return
      }
      var newText = $(this).val();
      if ($(this).hasClass('knowledge_search_label')) {
        $('.a20_slide3 .search_panel p').text(newText);
      } else if ($(this).hasClass('knowledge_text_recommended_articles')) {
        $('.a20_slide3 div.recommended span.name').text(newText);
      } else if ($(this).hasClass('knowledge_text_link_kb')) {
        $('.a20_slide3 div.recommended span.link').text(newText);
      }
    });

    $(document).on('click', '.a20_articles .-js-remove-rule', function () {
      if (articles_num > 1) {
        $(this).closest("li").remove();
        articles_num--;
      }
      $('.a20_articles ul').css('margin-bottom', '0');
      $('.a20_articles a').show();
      updateArticlesList();
      centeringStep3();
    });

    $(".a20_articles ul").on("sortstop", function (event, ui) {
      updateArticlesList();
    });

    $(document).on('change', '.a20_articles > ul > li .mySelect', function () {
      updateArticlesList();
    });

    function updateArticlesList() {
      let lang_id = $('.js_block_articles a.active').length ? $('.js_block_articles a.active').attr('data-lang') : star_lang_id;

      updatePreview(lang_id);
      var color = $('.a20_slide3 .a20_zoom .recommended h3 .link').css('color');
      $('.a20_color_cs').css('color', color);
    }


    /* 3.1-th step */
    $('li.a20_step[data-key="step_init_channels"]').on('click', function () {
      if (!$(this).prevAll(".a20_step:visible:first").hasClass('setted')) {
        return;
      }
      update_preview_recommend = false;
      if (($('.a20_step_02').hasClass('setted')) || ($('.a20_step_03').is(':hidden'))) {
        $('li[class^=a20_settings_step]').slideUp(400);

        $('.a20_settings_step31').slideDown(400);
        $('li[class^=a20_slide]').hide();
        InitNanoScrolls("")
        if (wid_type == 'knowledge_mail' && $('.a20_step_031').is(':visible')) {
          $('.a20_step_031 .a20_number').addClass('editing');
          $('.a20_slide3').show();
          $('.a20_slide3 .a20_zoom > li').css("margin-top", "-163px");

          $('.a20_slide3 .recommended').show();

          $('.a20_slide3 .a20_form_foot').show();

          //  preview static
          setStaticInfoSlide3();

          Slide3FootChange();
        } else {
          $('.a20_slide2').show();
          $('.a20_slide2 .a20_zoom.messengers_containers').show();
          $('.a20_slide2 ul.a20_zoom').hide();

          $('.a20_step_031 .a20_number').addClass('editing');
          $('.a20_settings_step2').prev().addClass('setted');
          $('.a20_settings_step31').prev().find('.a20_number b').hide();
          $('.a20_settings_step31').prev().find('.a20_number i').show();
          $('.a20_settings_step31').prev().addClass('setted');
          $('.a20_settings_step31').prev().find('.a20_step_edit').show();
          $('.a20_settings_step32').prev().find('.a20_number b').hide();
          $('.a20_settings_step32').prev().find('.a20_number i').show();
          $('.a20_settings_step32').prev().addClass('setted');
          $('.a20_settings_step32').prev().find('.a20_step_edit').show();
        }
        // /*if (first_step == 'recomendations') $('.a20_settings_step3').prev().find('.a20_step_name').addClass('a20_gray').html('Первый шаг: <b>рекомендации + поиск</b>');
        refreshHeaders(this);
        updateChannelsList(true)
        setTimeout(function () {
          SetLang();
          updateChannelsList(true);
          SelectNano(".a20_steps");
        }, 200);
//				$('.a20_settings_step31').prev().find('.a20_step_name').addClass('a20_gray').html('Каналы');
        if ($(this).hasClass('setted')) toggleNumber($(this));
        // $('.a20_settings_step4').show();
        if ($('select#channel_emails').parent().is(':visible')) {
          if (wid_type == 'messengers_mail') {
            $('.a20_step_04').css('cursor', 'pointer').show();
          } else {
            $('.a20_step_05').css('cursor', 'pointer');
          }
        }
        if ($('.a20_chanels_list ul.js_chanels_list>li:not([b_hide]):hidden').length) {
          $('.a20_chanels_list a[rel=add_chanel]').show();
        } else {
          $('.a20_chanels_list a[rel=add_chanel]').hide();
        }


        if (chanelInit === undefined) {

          chanelInit = choicesInit('.a20_steps select:not([data-choice])', {
            searchEnabled: false,
            shouldSort: false,
            itemSelectText: '',
            noResultsText: Translate('alpha20_js/no_results'),
            noChoicesText: Translate('alpha20_js/no_variants')
          });
        }
      }
      if (arr_allowed.length) {
        $('.a20_chanels_list a[rel=add_chanel]').removeAttr('style');
      }
    });
    $(document).on('click', '.a20_chanels_list ul.js_chanels_list>li .-js-remove-rule', function () {
      if (!$(this).closest('li').hasClass('custom-btn') && !$(this).closest('li').hasClass('channel-default')) {
        if (messengers_num > 1) {
          $(this).parents('li:eq(0)').hide();
          $(this).parents('li:eq(0)').attr('b_deleted', 1);

          $(this).closest('li').hasClass('custom-standart-btn') ? $(this).closest('li').attr('b_hide', "1") : null
          messengers_num--;
        }

        $('.a20_chanels_list a[rel=add_chanel]').show();
      } else {
        $(this).parents('.custom-btn').remove();
        $(this).parents('.channel-default').remove();
      }

      updateChannelsList();
      GenerateChannelSelectList();
      Slide3FootChange();
      setTimeout(() => SelectNano(""), 1)
    });
    $('.a20_chanels_list a[rel=add_chanel]').on('click', function (e) {
      e.preventDefault();
      if ($('.js_chanels_list > .channel-default').length) {
        $('.js_chanels_list .channel_default_select').each(function () {
          $(this).closest(".choices__inner").addClass('border-error')
        });
        return
      }

      let data = $('div.channel-defaul:hidden').html();
      let new_el = $('<li id="li_channel_' + GenUid(4) + '" class="channel-default">').html(data);

      $('.js_chanels_list').append(new_el);

      $('.js_chanels_list .channel_default_select').addClass('mod_select').removeClass('hidden')

      GenerateChannelSelectList();
      InitNanoScrolls("")
    });

    $('.a20_chanels_list a[rel=add_custom_button]').on('click', function (e) {
      e.preventDefault();
      let data = $('div.custom-btn-default:hidden').html();
      // let _el = $('.a20_chanels_list .custom-btn-default:hidden');
      // let new_el = _el.clone();
      // new_el.insertBefore($(this).parents('.a20_chanels_list').find('li.custom-btn:hidden')).show();
      let new_el = $('<li id="cch_' + GenUid(4) + '" class="custom-btn">').html(data);
      $('.a20_chanels_list ul.js_chanels_list').append(new_el);

      // refresh and reinit CP
      InitColorPicker(new_el.find(".cch_colorpicker"), new_el.find('.color-box-wrap'));

      updateChannelsList();
    });
    $(".a20_chanels_list  ul.js_chanels_list").on("sortstop", function (event, ui) {
      updateChannelsList();
    });

    $('.cch_colorpicker').on('change', function () {
      updateChannelsList();
    });

    $(document).bind("runUpdateChannels", function (e) {
      updateChannelsList();
    });
    $('li.a20_step[data-key=step_lang]').on('click', function () {
      if (!$(this).prevAll(".a20_step:visible:first").hasClass('setted')) {
        return;
      }

      if ($('.a20_step_01').hasClass('setted')) {
        $('li[class^=a20_settings_step]').slideUp(400);
        $(this).next().slideDown(400);
        $('li[class^=a20_slide]').hide();

        $('.a20_slide2 .a20_zoom.messengers_containers').hide();
        $('.a20_slide2 ul.a20_zoom').show();
        $('.a20_slide2').show();
        //
        // showHelper();

        $(this).find('.a20_number').addClass('editing');
        $('.a20_settings_step2').prev().find('.a20_number b').hide();
        $('.a20_settings_step2').prev().find('.a20_number i').show();
        $('.a20_settings_step2').prev().addClass('setted');
        $('.a20_settings_step2').prev().find('.a20_step_edit').show();
        refreshHeaders(this);
        if ($(this).hasClass('setted')) toggleNumber($(this));
      }
    });
    /* 3.2-rd step */
    $('li.a20_step[data-key="step_init_help"]').on('click', function () {
      if (!$(this).prevAll(".a20_step:visible:first").hasClass('setted')) {
        return;
      }
      if ($('.a20_step_01').hasClass('setted')) {
        // Убираем лишние пробелы в текстовых полях
        const textarea = document.querySelectorAll(".js_help_text_input")
        textarea.forEach((element) => {
          const text = element.textContent
          const newText = text.replace(/ +/g, ' ').trim();
          element.textContent = newText
        })

        $('li[class^=a20_settings_step]').slideUp(400);
        $('.a20_settings_step32').slideDown(400);
        $('li[class^=a20_slide]').hide();

        const start = $('.a20_settings_step32')[0].getAttribute("class")
        InitNanoScrolls(`.${start}`);

        $('.a20_slide2 .a20_zoom.messengers_containers').hide();
        $('.a20_slide2 ul.a20_zoom').show();
        $('.a20_slide2').show();


        $('.a20_step_032 .a20_number').addClass('editing');
        $('.a20_settings_step2').prev().find('.a20_number b').hide();
        $('.a20_settings_step2').prev().find('.a20_number i').show();
        $('.a20_settings_step2').prev().addClass('setted');
        $('.a20_settings_step2').prev().find('.a20_step_edit').show();
        refreshHeaders(this);
        if ($(this).hasClass('setted')) toggleNumber($(this));

        $('.a20_step_031').css('cursor', 'pointer');
        $('textarea#help_text_input').parent().show();
        $('.a20_slide2 .a20_zoom .a20_help_text').show();
        if ($('.a20_settings_step32 select.select_help_text').val() == '0') {
          $('textarea#help_text_input').parent().hide();
          $('.a20_slide2 .a20_zoom .a20_help_text').hide();
        }
        setTimeout(function () {
          SetLang();
          showHelper();
        }, 310)
      }
    });
    $(document).on('change', '.a20_settings_step32 select.select_help_text', function () {
      $('textarea#help_text_input').parent().show();
      $('.a20_slide2 .a20_zoom .a20_help_text').show();
      if ($(this).val() == '0') {
        $('textarea#help_text_input').parent().hide();
        $('.a20_slide2 .a20_zoom .a20_help_text').hide();
      }
    });
    $(document).on('keyup', 'textarea.js_help_text_input', function () {
      var text = $.trim($(this).val());
      var text = $('<div/>').text(text).html();
      text = text.replace(/\n/g, '<br>')
      $('.a20_slide2 .a20_zoom .a20_help_text').html(text);
    });
    /* 4-th step */
    $(document).on('change', '.a20_settings_step4 select', function () {
      FixSelects();
    });
    $('li.a20_step[data-key="step_init_form"]').on('click', function () {
      if (!$(this).prevAll(".a20_step:visible:first").hasClass('setted')) {
        return;
      }
      FixSelects();

      if (($('.a20_step_02').hasClass('setted')) || ($('.a20_step_03').is(':hidden'))) {
        $('li[class^=a20_settings_step]').slideUp(400);
        $('.a20_settings_step4').slideDown(400);
        $('li[class^=a20_slide]').hide();
        $('.a20_slide4').show();
        $('.a20_full_size').show();
        $('.a20_step_04 .a20_number').addClass('editing');
        $('.a20_settings_step3').prev().find('.a20_number b').hide();
        $('.a20_settings_step3').prev().find('.a20_number i').show();
        $('.a20_settings_step2').prev().addClass('setted');
        $('.a20_settings_step3').prev().addClass('setted');
        $('.a20_settings_step3').prev().find('.a20_step_edit').show();
        refreshHeaders(this);
        if ($(this).hasClass('setted')) toggleNumber($(this));
        $('.a20_settings_step4').show();
        $('.a20_step_05').css('cursor', 'pointer');
        setTimeout(function () {
          SetLang();
          SelectNano('.a20_form_fields')
        }, 310)

      }
    });

    $(document).on('click', '.a20_form_fields .fa-asterisk', function () {
      var field_id = $(this).attr('data-field_id');
      var position = $(this).parent().index();
      let b_req = 0;

//			    EMAILADDRESS     SUBJECT           CONTENT
      if (field_id == 2 || field_id == 10 || field_id == 11) {
        $(this).addClass('active');
        b_req = 1;
      } else if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        $('.a20_slide4 .a20_zoom li ul li').eq(position).find('span').addClass('a20_off');
      } else {
        $(this).addClass('active');
        b_req = 1;
        $('.a20_slide4 .a20_zoom li ul li').eq(position).find('span').removeClass('a20_off');
      }
      for (var i in fields_selected) {
        if (fields_selected[i]['id'] == field_id) {
          fields_selected[i]['required'] = b_req;
        }
      }
    });

    $('.a20_settings_step4 a[rel=add_field]').on('click', function (e) {
      // Вставляем select в пункт 5 "Форма отправки запроса"
      e.preventDefault();
      fields_num++;

      if (fields_num >= cnt_all_fields) {
        $(this).hide();
        $(this).prev().css('margin-bottom', '16px');
      }

      /** Вставляем Li по клику на "добавить поле".
       * В etalonSelectSettings находиться Li с содержимым преобразованным в строку,
       * Взятого ранее из DOM, из п.5 "Форма отправки запроса"
       * Эта Li будет вставляться по клику на "добавить поле" и обрабатываться библиотекой choices.js
       */
      const newID = Math.floor((Math.random() * 1000) + 100); // генерируем новый ID
      const fieldsData = Object.entries(fields_data)
      let newElement = etalonSelectSettings.replace('disabled', ' '); // убираем disabled у option
      let optionForNewElement = [] // опции для вставки в селект
      let selectedOption

      newElement = $.parseHTML(newElement);
      newElement = newElement[0];
      newElement.removeAttribute("data-noranslated")
      newElement.setAttribute('id', `form_field_id${newID}`) // добавляем ID нашей Li

      // Фикс. Иногда может быть так, что value у input-а будет не пустым. Нам это не нужно
      ;(function () {
        let input = newElement.querySelectorAll(".new_name_field")
        input.forEach(element => {
          element.removeAttribute('value')
          element.textContent = ''
        })
      })();

      const selected = Array.from(document.querySelectorAll(".a20_form_fields .choices__list.choices__list--single .choices__item--selectable"))
      const option = selected.map(element => element.getAttribute("data-value"))

        // Фикс. При комировании li может не оказаться крестика для удаления правила
      ;(function () {
        const isRemove = newElement.querySelector(".-js-remove-rule")
        if (!isRemove) {
          const button = `<i class="far fa-times -js-remove-rule"></i>`
          newElement.insertAdjacentHTML("beforeend", button)
        }
      })();

      // удаляем все опции в селекте
      ;(function () {
        const option = newElement.querySelectorAll("option")
        option.forEach(element => element.remove())
      })();

      // Формируем массив объектов из переведённых опций для вставки
      ;(function () {
        const lang_block_fields = document.querySelector(".js_block_fields .change_form.active");
        const email_helper_lang = document.querySelector("#form_field_id2 .new_name_field");
        const lang = lang_block_fields ? lang_block_fields.getAttribute("data-lang") : email_helper_lang.getAttribute("data-lang")
        fieldsData.filter(element => {
          if (element[1]["titles"][lang]) {
            optionForNewElement.push({label: element[1]["titles"][lang], value: element[0]})
          }
        })

        selectedOption = optionForNewElement.find(element => !option.includes(element["value"]))
        if (selectedOption) selectedOption.selected = "true"
      })();

      // Если есть перевод опции - в селект добавляем опции с переводом, а если нет - добавляем опции на рус. яз.
      ;(function () {
        if (selectedOption === undefined) {
          fieldsData.forEach(element => {
            optionForNewElement.push({label: element[1]["titles"][1], value: element[0]})
          })

          selectedOption = optionForNewElement.find(element => !option.includes(element["value"]))
          if (selectedOption) selectedOption.selected = "true"

          const currentValue = optionForNewElement[0].value
          newElement.setAttribute("data-noranslated", currentValue)
        }
      })();

      newElement = newElement.outerHTML
      $(newElement).insertBefore($('#form_field_id10')); // вставляем новый li

      const init = choicesInit('.a20_form_fields select', {
        choices: optionForNewElement,
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        noResultsText: Translate('alpha20_js/no_results'),
        noChoicesText: Translate('alpha20_js/no_variants')
      })

      selectChange(init)
      SelectNano(".a20_form_fields")
      isSelected() // оставляем только уникальные опции, а остальные скрываем
      FixSelects(true);
      updatePreviewFormFields();
      changeGlobalSC(currentGlobalCSE);

      const lang = document.querySelector(".a20_settings_step4 .js_block_fields .change_form.active").getAttribute("data-lang")
      if (lang != "1") {
        const fieldsData = Object.entries(fields_data)
        const translatedOption = fieldsData.filter(element => !element[1]["titles"][`${lang}`]) // все НЕ переведённые опции на текущий язык
        const liId = `form_field_id${newID}`
        highlightedNoTranslatedOption(translatedOption, liId)
      }
    });

    $(document).on('click', '.a20_form_fields .-js-remove-rule', function () {
      if ($('.a20_form_fields li').length > 1) {
        $(this).parent().remove();
        fields_num--;
      }
      $('.a20_form_fields').css('margin-bottom', '0');
      $('.a20_settings_step4 a').show();
      FixSelects();
      updatePreviewFormFields();
    });

    $('.a20_settings_step4 input[type="text"]').on('keyup', function () {
      updatePreview()
    });
    $('.a20_settings_step4 textarea').on('keyup', function () {
      updatePreview()
    });

    $('.a20_settings_step4 > input[type="text"]:last').on('keyup', function () {
      var newText = $(this).val();
      $('.a20_slide4 .a20_form_foot .a20_send_form').text(newText);
    });

    $(document).on('keyup', '.a20_settings_step4 .a20_form_fields li input[type="text"]', function () {
      var position = $(this).parent().index();
      var newText = $.trim($(this).val());
      for (var i in fields_selected) {
        if (fields_selected[i]['id'] == $(this).closest("li").find("select").val()) {
          fields_selected[i]['label'][$('.js_block_fields a.active').attr('data-lang') || star_lang_id] = newText;

          if ($(this).closest("li").find("select").closest("li").find('.-js-no-translate').length && newText.length) {
            $(this).closest("li").find("select").closest("li").find('.-js-no-translate').removeClass('-js-no-translate').removeClass('-js-translate').addClass('noranslated_');
          }
          if ($(this).closest("li").find("select").closest("li").find('.noranslated_').length && !newText.length) {
            $(this).closest("li").find("select").closest("li").find('.noranslated_').removeClass('noranslated_').addClass('-js-no-translate').removeClass('-js-translate');
          }
        }
      }
      updatePreviewFormFields();
    });

    $(".a20_form_fields").on("sortstop", function (event, ui) {
      updatePreviewFormFields();
    });

    $(document).on('change', '.a20_form_fields > li .choices', function () {
      updatePreviewFormFields();
      changeGlobalSC(currentGlobalCSE);
    });


    /* 5-th step */
    $('li.a20_step[data-key="step_init_labels"]').on('click', function () {
      if (!$(this).prevAll(".a20_step:visible:first").hasClass('setted')) {
        return;
      }
      if ($('.a20_step_03').hasClass('setted') || (
        wid_type.match(/messengers/) && $('.a20_step_031').hasClass('setted')
      )) {
        if (wid_type.match(/messengers/) &&
          CheckChannelHide('chat') &&
          CheckChannelHide('emails')) {
        }
        $('li[class^=a20_settings_step]').slideUp(400);
        $('.a20_settings_step5').slideDown(400);
        $('li[class^=a20_slide]').hide();
        $('.a20_slide1').show();
        $('.a20_full_size').hide();
        $('.a20_step_05 .a20_number').addClass('editing');
        $('.a20_settings_step4').prev().find('.a20_number b').hide();
        $('.a20_settings_step4').prev().find('.a20_number i').show();
        $('.a20_settings_step4').prev().addClass('setted');
        $('.a20_settings_step4').prev().find('.a20_step_edit').show();
        SelectNano(".a20_settings_step5")
        refreshHeaders(this);
        if ($(this).hasClass('setted')) toggleNumber($(this));
        $('.a20_step_06').css('cursor', 'pointer');
      }
    });

    $('.a20_settings_step5 .mySelect').on("change", function (e) {
      if (!$(this).hasClass('a20_last')) {
        parameter = e.val;
      }
    });

    /* 6-th step */
    $('li.a20_step[data-key="step_init_message"]').on('click', function () {
      if (!$(this).prevAll(".a20_step:visible:first").hasClass('setted')) {
        return;
      }

      if ($('.a20_step_04').hasClass('setted')) {
        $('li[class^=a20_settings_step]').slideUp(400);
        $('li[class^=a20_slide]').hide();
        if (lastAction == Translate('client_widgets_add/closure')) {
          $('.a20_slide2').show();

        } else {
          $('.a20_slide6').show();
        }
        $('.a20_full_size').show();
        $('.a20_settings_step5').prev().find('.a20_number b').hide();
        $('.a20_settings_step5').prev().find('.a20_number i').show();
        $('.a20_settings_step5').prev().addClass('setted');
        $('.a20_settings_step5').prev().find('.a20_step_edit').show();
        refreshHeaders(this);
        if ($(this).hasClass('setted')) toggleNumber($(this));
        $('.a20_step_06 .a20_number').addClass('editing');
        $('.a20_settings_step6').slideDown(400);

        InitNanoScrolls(`.a20_settings_step6`);
        setTimeout(function () {
          updatePreview()
        }, 450);
      }
    });
//		var lastAction = 'сообщение';
    $('.a20_settings_step6 ul li').on('click', function () {
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
      if ($(this).index() == 0) {
        $('.a20_slide6').show();
        $('.a20_slide2').hide();
        $('.a20_slide6 .a20_win_success').show();
        $('.a20_slide6 .a20_redirect').hide();
        lastAction = Translate('client_widgets_add/case');
      }
      if ($(this).index() == 1) {
        $('.a20_slide6').hide();
        $('.a20_slide2').show();
        lastAction = Translate('client_widgets_add/closure');
      }
      if ($(this).index() == 2) {
        $('.a20_slide6').show();
        $('.a20_slide2').hide();
        lastAction = Translate('client_widgets_add/redirect');
      }
      let step_success = $('.a20_settings_step6 li.active').attr('data-form-value');
      $('.a20_settings_step6>div').hide();
      $('.a20_settings_step6>div.js_success_block_' + step_success).show();

    });

    $('.a20_settings_step6 .js_success_block_message input[type="text"]').on('keyup', function () {
      updatePreview()
    });

    $('.a20_settings_step6 .js_success_block_message textarea').on('keyup', function () {
      updatePreview()
      centeringStep6();
    });

    function centeringStep6() {
      var height = $('.a20_slides .a20_slide6 .a20_zoom .a20_win_success').height();
      $('.a20_slides .a20_slide6 .a20_zoom .a20_win_success').css('margin-top', -height / 2 + 'px');
    }


    /* 100% view */
    $('.a20_full_size').on('click', function (e) {
      e.preventDefault();
      $('.a20_preview_modal_inner').empty();
      /*$('.a20_preview').clone().appendTo('.a20_preview_modal_inner');*/
      var currentSlide = $('.a20_preview .a20_slides li:visible').attr('class');
      $('.a20_preview_modal').attr('data-slide', currentSlide);
      $('.a20_preview .a20_slides li:visible .a20_pr_body').clone().appendTo('.a20_preview_modal_inner');
      $('.a20_preview_modal').show();
      if ($('.a20_preview .a20_slides li:visible').index() == 3) {
        var innContent = $('.a20_preview_modal_inner .nano .nano-content').html();
        $('.a20_preview_modal_inner .nano').remove();
        $('.a20_preview_modal_inner .a20_zoom li h4').after('<ul class="nano"><div class="overthrow nano-content">' + innContent + '</div></ul>');
        $('.a20_preview_modal_inner .nano').nanoScroller({alwaysVisible: true});
        $('.a20_preview_modal_inner .nano-pane').addClass('a20_scroll_in');
        $('.a20_preview_modal_inner .nano .nano-pane .nano-slider').addClass('a20_scroll_thumb');
        // $('.sp-viewport').css('padding-right', '');
        changeGlobalSC(currentGlobalCSE);
      }
      if ($('.a20_preview_modal_inner .messengers_containers:visible').length) {
        var margin = 690 - parseInt($('.a20_preview_modal_inner .messengers_containers:visible').height()) - 10;
        $('.a20_preview_modal_inner .messengers_containers:visible').css('margin-top', margin + 'px');
      }
      if ($('.a20_preview .a20_slides li:visible').index() == 1) {
        changeGlobalSC(currentGlobalCSE);
      }
      $('html').addClass('overflow');
    });

    $('.a20_preview_modal .a20_preview_modal_wrap h3 i').on('click', function () {
      $('.a20_preview_modal').hide();
      $('html').removeClass('overflow');
    });

    $(document).on('click', '.a20_preview_modal', function (e) {
      e = e || window.event;
      target = e.target || e.srcElement;
      if (target.className == "a20_preview_modal") {
        $('.a20_preview_modal').hide();
        $('html').removeClass('overflow');
      }
    });

    /* modal height scrollable */
    $(window).on('resize', function () {
      if ($(this).height() < 798) {
        $('.a20_preview_modal').css('position', 'absolute');
      } else {
        $('.a20_preview_modal').css('position', 'fixed');
      }
    });

    if ($(window).height() < 798) {
      $('.a20_preview_modal').css('position', 'absolute');
    } else {
      $('.a20_preview_modal').css('position', 'fixed');
    }

  });
  $(document).on('change', 'select#channel_emails', function () {
    if (wid_type == 'messengers_mail' || wid_type == 'knowledge_mail') {
      var val_selected_email = $(this).find("option:selected").text();
      $('select.widget_email').select2('val', val_selected_email);
    }
  })

  $(document).on('click', '.list_lang_form a', function () {
    let lang_id = $(this).attr('data-lang');
    let lang_text = $(this).text();
    let parent = $(this).parents('.list_lang_form');
    let parent_li = $(this).parents('li');

    $(this).closest(".a20_settings_step4").find(".a20_form_fields").removeAttr("data-lang")
    $(this).closest(".a20_settings_step4").find(".a20_form_fields").attr("data-lang", `${lang_text}`)

    $(this).parent().find('a.change_form').removeClass('active');
    $(this).addClass('active');
    if (parent.hasClass('js_block_articles')) {
      updateListArticles(lang_id)
    } else if (parent.hasClass('js_block_fields')) {
      updateListFields(lang_id)
    } else if (parent.next().find('.redactor-box').length) {

      parent.next().find('textarea,input').parent().hide();
      parent.next().find('textarea[data-lang=' + lang_id + '],input[data-lang=' + lang_id + ']').parent().show();
    } else {
      parent.next().find('textarea,input').hide();
      parent.next().find('textarea[data-lang=' + lang_id + '],input[data-lang=' + lang_id + ']').show();
    }
    if (parent_li[0].id &&
      (parent_li[0].id == 'li_channel_knowledge' || parent_li[0].id == 'li_channel_idea')) {
      updateListCch(lang_id, [parent_li[0].id])
    }
    const start = $(this)[0].closest("li").getAttribute("class")
    InitNanoScrolls(`.${start}`);
    updatePreview(lang_id)

    return false;
  });
  $(document).on('change', '#b_terms', function () {
    if ($(this).prop('checked')) {
      $(this).closest('li').find(".b_terms__wrap").show();
    } else {
      $(this).closest('li').find(".b_terms__wrap").hide();
    }
    updatePreview()
  })

})(jQuery);

function CheckChannelHide(key) {
  var el = typeof key == 'string' ? $('#li_channel_' + key) : key;
  if (!$(el).length)
    return true;
  if ($(el).attr('b_deleted') && $(el).attr('b_deleted') == 1)
    return true;
  if ($(el).attr('b_hide') && $(el).attr('b_hide') == 1)
    return true;
  return false;


}

/* recount numbers */
function recountNumbers() {
  var number = 1;
  $('.a20_steps .a20_step').each(function (index, element) {
    var numPositon = $(element).find('.a20_number b');
    if ($(element).is(':visible')) {
      numPositon.text(number);
      number++;
    }
  });
}

/* toggle number */
function toggleNumber(stepNum) {
  $(stepNum).find('.a20_number b').show();
  $(stepNum).find('.a20_number i').hide();
  $(stepNum).find('.a20_step_name').show();
  $(stepNum).find('.a20_gray').hide();
  $(stepNum).find('.a20_step_edit').hide();
}

/* refreshing headers */
function refreshHeaders(_el, b_init) {
  setTimeout(function () {
    $('.a20_steps>li').each(function (index, element) {
      if ($(this).attr('class').match(/a20_settings_step/) && $(this).is(':visible')) {
        $(this).prevAll().filter('.a20_step').addClass('setted');

      }

    });

    $('.a20_steps .a20_step').each(function (index, element) {
      if ($(element).hasClass('setted')) {

        var step_key = $(element).attr('data-key');

        switch (step_key) {
          case 'step_type':
            $('.a20_step_01 .a20_step_name').hide();
            var title = $('li.a20_settings_step1 li[data-form-value=' + wid_type + '] h4').html();
            $('.a20_step_01 .a20_gray').show().html(Translate('alpha20_js/type')+': <b>' + title + '</b>');

            break;
          case 'step_init_button':

            if (b_init) {
              break;
            }
            $('.a20_step_02 .a20_step_name').hide();
            if (button_type == 'square') {
              if (wid_type.match(/messengers/)) {
                $('.a20_step_02 .a20_gray').show().html(Translate('alpha20_js/button_text', {'text': $('li.a20_settings_step2 ul.a20_btn_size li.active').text()}));
              } else {
                $('.a20_step_02 .a20_gray').show().html(Translate('alpha20_js/button_icon'));
              }
            }
            if (button_type == 'line') $('.a20_step_02 .a20_gray').show().html(Translate('alpha20_js/button_line'));
            break;
          case 'step_init_knowledge':
            $('.a20_step_03 .a20_step_name').hide();
            if (first_step == 'recomendations') $('.a20_step_03 .a20_gray').show().html(Translate('alpha20_js/first_step_recomand'));
            if (first_step == 'search') $('.a20_step_03 .a20_gray').show().html(Translate('alpha20_js/first_step_search'));
            break;
          case 'step_init_help':
            $('.a20_step_032 .a20_step_name').hide();
            $('.a20_step_032 .a20_gray').show().html(Translate('alpha20_js/help', {'text':$('select.select_help_text option:selected').text()}));
            break;
          case 'step_lang':
            let li = $('li.a20_step[data-key=' + step_key + ']');
            li.find('.a20_step_name').hide();
            li.find('.a20_gray').show().html(Translate('alpha20_js/lang', {'lang': li.next().find('select option:selected').text()}));
            break;
          case 'step_init_channels':
            $('.a20_step_031 .a20_step_name').hide();
            var num = 0;
            $('.a20_chanels_list  ul.js_chanels_list>li').each(function () {
              if (!CheckChannelHide(this)) {
                num++;
              }

            });
            switch (num) {
              case 1:
                var ending = Translate('alpha20_js/channel');
                break;
              case 2:
                var ending = Translate('alpha20_js/the_channel');
                break;
              case 3:
                var ending = Translate('alpha20_js/the_channel');
                break;
              case 4:
                var ending = Translate('alpha20_js/the_channel');
                break;
              default:
                var ending = Translate('alpha20_js/the_channels');
                break
            }
            $('.a20_step_031 .a20_gray').show().html(Translate('alpha20_js/channels', {'num':num, 'ending':ending}));
            break;
          case 'step_init_form':
            $('.a20_step_04 .a20_step_name').hide();
            switch (fields_num) {
              case 1:
                var ending = Translate('alpha20_js/field');
                break;
              case 2:
                var ending = Translate('alpha20_js/fields');
                break;
              case 3:
                var ending = Translate('alpha20_js/fields');
                break;
              case 4:
                var ending = Translate('alpha20_js/fields');
                break;
              case 5:
                var ending = Translate('alpha20_js/the_fields');
                break;
              case 6:
                var ending = Translate('alpha20_js/the_fields');
                break;
              default:
                var ending = Translate('alpha20_js/the_fields');
                break
            }
            $('.a20_step_04 .a20_gray').show().html(Translate('alpha20_js/form', {'fields_num': fields_num, 'ending': ending}));
            break;
          case 'step_init_labels':
            $('.a20_step_05 .a20_step_name').hide();
            if (wid_type.match(/messengers/) || wid_type == 'knowledge_mail') {
              let labels_arr = document.querySelector('.a20_settings_step5--labels select')
              let labels_str = '';
              let option = labels_arr.childNodes

              if (option.length === 0) {
                $('.a20_step_05 .a20_gray').show().html(Translate('alpha20_js/labels')+': ' + `<b>`+Translate('alpha20_js/no_labels')+`</b>`);
              } else {
                option.forEach((element, index) => {
                  if (option.length === index + 1) {
                    labels_str += `<b>${element.textContent}</b>`
                  } else {
                    labels_str += `<b>${element.textContent},</b> `
                  }
                }) // последнему элементу не добавляем запятую в конце
                $('.a20_step_05 .a20_gray').show().html(Translate('alpha20_js/labels')+': ' + labels_str);
              }
            } else {
              $('.a20_step_05 .a20_gray').show().html(Translate('alpha20_js/params')+': <b>' + parameter + '</b>');
            }
            if (($('.a20_step_06 .a20_number').hasClass('editing')) && (!$('.a20_step_06').hasClass('setted'))) {
              $('.a20_step_06').addClass('setted');
              $('.a20_settings_step6').prev().find('.a20_number b').hide();
              $('.a20_settings_step6').prev().find('.a20_number i').show();
              refreshHeaders();
            }
            break;
          case 'step_init_message':
            $('.a20_step_06 .a20_step_name').hide();
            $('.a20_step_06 .a20_gray').show().html(Translate('alpha20_js/last_action')+': <b>' + lastAction + '</b>');
            break
        }
        if (index == 1 && b_init) {
          return;
        }
        $(element).find('.a20_number b').hide();
        $(element).find('.a20_number i').show();
        $(element).find('.a20_step_edit').show();
      }
    });
    if (_el && $(_el).hasClass('setted')) toggleNumber($(_el));

  }, 100);
}

function centeringStep3() {
  var height = $('.a20_slides .a20_slide3 .a20_zoom > li').height();
  $('.a20_slides .a20_slide3 .a20_zoom > li').css('margin-top', -height / 2 + 'px');
}

function preLoad(button_type, button_position) {
  prepareDisplay(wid_type, true);
  recountNumbers();
  refreshHeaders(false, true);
  SetLang()
  switch (button_type + '_' + button_position) {
    case 'square_left':
      $('.a20_slide2 .a20_zoom li').hide();
      $('.a20_slide2 .a20_zoom li.a20_sqr_btn').show();
      $('.a20_slide2 .a20_zoom li.a20_sqr_btn').removeClass('a20_right').addClass('a20_left');
      $('.a20_slide2 .a20_zoom li.a20_help_text').removeClass('a20_right').addClass('a20_left');
      $('.a20_slide2 .a20_zoom.a20_sqr_btn').removeClass('a20_right').addClass('a20_left');
      break;
    case 'square_right':
      $('.a20_slide2 .a20_zoom li').hide();
      $('.a20_slide2 .a20_zoom li.a20_sqr_btn').show();
      $('.a20_slide2 .a20_zoom li.a20_sqr_btn').removeClass('a20_left').addClass('a20_right');
      $('.a20_slide2 .a20_zoom li.a20_help_text').removeClass('a20_left').addClass('a20_right');
      $('.a20_slide2 .a20_zoom.a20_sqr_btn').removeClass('a20_left').addClass('a20_right');
      break;
    case 'line_left':
      $('.a20_slide2 .a20_zoom li').hide();
      $('.a20_slide2 .a20_zoom li.a20_str_vert').show();
      $('.a20_slide2 .a20_zoom li.a20_str_vert').removeClass('a20_pos_right').addClass('a20_pos_left');
      $('.a20_slide2 .a20_zoom li.a20_str_vert').css('right', 'auto');
      $('.a20_step_032').hide();
      break;
    case 'line_bottom_left':
      $('.a20_slide2 .a20_zoom li').hide();
      $('.a20_slide2 .a20_zoom li.a20_str_hor').show();
      $('.a20_slide2 .a20_zoom li.a20_str_hor').removeClass('a20_right').addClass('a20_left');
      $('.a20_step_032').hide();
      break;
    case 'line_bottom_right':
      $('.a20_slide2 .a20_zoom li').hide();
      $('.a20_slide2 .a20_zoom li.a20_str_hor').show();
      $('.a20_slide2 .a20_zoom li.a20_str_hor').removeClass('a20_left').addClass('a20_right');
      $('.a20_step_032').hide();
      break;
    case 'line_right':
      $('.a20_slide2 .a20_zoom li').hide();
      $('.a20_slide2 .a20_zoom li.a20_str_vert').show();
      $('.a20_slide2 .a20_zoom li.a20_str_vert').removeClass('a20_pos_left').addClass('a20_pos_right');
      var offset = $('.a20_slide2 .a20_zoom li.a20_str_vert').width();
      $('.a20_slide2 .a20_zoom li.a20_str_vert').css('right', (-offset + 36) + 'px');
      $('.a20_step_032').hide();
      break
  }
//горизонтальную кнопку поправляем
  var verticalOffset = $('.a20_zoom li.a20_str_vert').width() / 2;
  $('.a20_zoom li.a20_str_vert').css('margin-top', verticalOffset + 'px');

  if (first_step == 'search')
    centeringStep3();
// поправим размер кнопки
  $('.messenger_link.messenger_text a').html('OMNIDESK');
  $('.a20_zoom .a20_sqr_btn').removeClass('a20_sqr_36').removeClass('a20_sqr_42').removeClass('a20_sqr_50');
  switch (ico_size) {
    case 'small' :
      $('.a20_zoom .a20_sqr_btn').addClass('a20_sqr_36');
      $('.a20_zoom .a20_help_text').addClass('a20_sqr_36');
      $('.messenger_link.messenger_text a').html('OMNI');
      break;
    case 'middle':
      $('.a20_zoom .a20_sqr_btn').addClass('a20_sqr_42');
      $('.a20_zoom .a20_help_text').addClass('a20_sqr_42');
      break;
    case 'big'   :
      $('.a20_zoom .a20_sqr_btn').addClass('a20_sqr_50');
      $('.a20_zoom .a20_help_text').addClass('a20_sqr_50');
      break

  }

//	FixSelects();
}

function FixSelects(f_add) {
  /**
   * Считаем колличество опций в селекте в "Форма отправки запроса" -> "Поля формы"
   * По кол-ву опций определяем сколько полей может добавить юзер
   * Т.к. оно должно вставится только 1 раз. Т.е выбрали "Должность" - больше выбрать "Должность" нельзя
   * Т.к. исп. библ. Choices.js для селектов, то мы считаем не опции, а кол-во div-ов с классом .choices__item--choice
   * Потому что библиотека убирает все <option> из <select> оставляя только выбранный.
   */
  var selected = {};
  if (!Object.keys(gAllFields).length) {
    gAllFields = {};
    $('.a20_settings_step4 .choices:eq(1) .choices__list--dropdown .choices__item--choice').each(function () {
      gAllFields[$(this).val()] = $(this).text();
      cnt_all_fields++;
    });
  }
  var i = 1;
  $('.a20_settings_step4 select').each(function () {
    selected[$(this).val()] = i;
    $(this).attr('data-fix_id', i);
    i++;
  });

  if (f_add)
    FixSelects();
}

function prepareDisplay(widget_type, b_edit) {
  $('li.a20_settings_step2 ul.a20_position>li').show();
  if (!b_edit || typeof b_edit == typeof undefined) {
    $('li.a20_settings_step2 ul.a20_icon>li').removeClass('active').show();
  }
  $('li.a20_settings_step2 ul.a20_icon>li[data-form-value=comments]').hide();

  $('.a20_step_03').hide();
  if (widget_type !== 'knowledge_mail') {
    $('.a20_step_04').show();
    $('.a20_step_05').show();
    $('.a20_step_06').show();
  }
  //$('.widget_email').removeClass('hidden').show();
  //$('.widget_email').prev().show();
  emailNeed(true)



  $('.a20_step_031').hide();
  $('.a20_step_032').show();
  //$('select.widget_email').select2('enable');
  $('select#channel_emails').closest("li").show();
  $('select#channel_emails').closest("li").removeAttr('b_hide');
  $('.a20_chanels_list ul.js_chanels_list>li[b_deleted]').hide();
  //
  if (button_type == 'line') {
    $('.a20_steps > li > h4.css_h4_size').hide();
    $('.a20_settings_step2 .a20_btn_size').hide();

    $('.a20_settings_step2 .last').show();
  } else {
    $('.a20_settings_step2 .last').hide();
  }
  if (widget_type.match(/messengers/)) {
    // $('.widget_email').addClass('hidden').hide();
    // $('.widget_email').prev().hide();
    emailNeed(false)

    $('li.a20_settings_step2 ul.a20_position>li[data-form-value^=line]').hide();
    $('li.a20_settings_step2 ul.a20_icon>li[data-form-value=comments]').show();

    $('li.a20_settings_step2 ul.a20_icon>li[data-form-value=envelope]').hide();
    $('li.a20_settings_step2 ul.a20_icon>li[data-form-value=at]').hide();
    $('li.a20_settings_step2 ul.a20_icon>li[data-form-value=graduation-cap]').hide();
    $('li.a20_settings_step2 ul.a20_icon>li[data-form-value=search]').hide();
    if (!b_edit || typeof b_edit == typeof undefined) {
      $('li.a20_settings_step2 ul.a20_icon>li[data-form-value=comments]').addClass('active');
      $('.a20_slide2 .a20_zoom li i').each(function (index, element) {
        $(element).removeAttr('class').addClass('fa fa-comments');
      });
    }
    $('.a20_step_032').show().css('cursor', 'pointer');
    $('.a20_step_031').show();

    if ($('select#channel_emails').length && $('select#channel_emails').val()) {
      $('select.widget_email').select2('val', $("select#channel_emails option:selected").text());
    }
    if (widget_type == 'messengers' || $('select#channel_emails').parent().attr('b_deleted')) {
      $('select#s2id_channel_emails').hide();
      $('.a20_step_04').hide();
      $('.a20_step_05').hide();
      $('.a20_step_06').hide();
      if (!CheckChannelHide('chat')) {
        $('.a20_step_05').show();
      }
      $('select#channel_emails').closest("li").hide();
      if (widget_type == 'messengers') {
        $('select#channel_emails').closest("li").attr('b_hide', 1);
        $('.custom-standart-btn').attr('b_hide', 1).hide();
      }
    } else {
      $('select.widget_email').select2('disable');
    }
  } else if (widget_type == 'knowledge_mail') {
    $('.widget_email').addClass('hidden').hide();
    $('.widget_email').prev().hide();

    emailNeed(false)

    if ($('select#channel_emails').length && $('select#channel_emails').val()) {
      $('select.widget_email').select2('val', $("select#channel_emails option:selected").text());
    }
    $('select.widget_email').select2('disable');

    if (!b_edit || typeof b_edit == typeof undefined) {
      $('li.a20_settings_step2 ul.a20_icon>li[data-form-value=question-circle]').show().addClass('active');
      $('.a20_slide2 .a20_zoom li i').each(function (index, element) {
        $(element).removeAttr('class').addClass('fa fa-question-circle');
      });
    }

    if (CheckChannelHide('emails')) {
      $('.a20_step_04').hide();
      $('.a20_step_05').hide();
      $('.a20_step_06').hide();
      if (!CheckChannelHide('chat')) {
        $('.a20_step_05').show();
      }
    }

    $('.a20_step_03').show();
    $('.a20_step_031').show();
    $('.custom-standart-btn').attr('b_hide', 1).hide();
  } else if (widget_type == 'mail') {
    if (!b_edit || typeof b_edit == typeof undefined) {
      $('li.a20_settings_step2 ul.a20_icon>li[data-form-value=envelope]').show().addClass('active');
      $('.a20_slide2 .a20_zoom li i').each(function (index, element) {
        $(element).removeAttr('class').addClass('fa fa-envelope');
      });
    }
    $('.a20_step_04').css('cursor', 'pointer');
    $('.a20_step_03 .a20_number').addClass('editing');
  }
  let step_success = $('.a20_settings_step6 li.active').attr('data-form-value');
  $('.a20_settings_step6>div').hide();
  $('.a20_settings_step6>div.js_success_block_' + step_success).show();

  // refresh and reinit CP
  InitColorPicker($('.js_chanels_list ').find(".cch_colorpicker"), $('.js_chanels_list ').find('.color-box-wrap'))
}

function ChangeChatraChannel(_el) {
  if ($(_el[0]).length && _el[0].id == 'li_channel_chat') {
    _el.find('.chatra_link_groups_chat').hide();
    _el.find('#channel_chat option:selected').index();
    _el.find('#s2id_chatra_link_groups_chat_' + _el.find('#channel_chat option:selected').index()).show()
  }
}

function showHelper() {
  var text = $.trim($('textarea.js_help_text_input:visible').val());
  var text = $('<div/>').text(text).html();
  text = text.replace(/\n/g, '<br>')
  $('.a20_slide2 .a20_zoom .a20_help_text').html(text);
  $('.a20_slide2 .a20_zoom .a20_help_text').show();
}

function GetWidgetType() {
  let i = $('.a20_settings_step1 ul li.active').index();

  if (i == 0) {
    return 'knowledge_mail';
  } else if (i == 1) {
    return 'mail';
  } else if (i == 2) {
    return 'messengers_mail';
  } else if (i == 3) {
    return 'messengers';
  }
  return 0;
}

function SetLang() {
  let lang_id = $('li[data-key="step_lang"]').length ? $('li[data-key="step_lang"]').next().find('select').val() : star_lang_id;
  lang_id = lang_id <= 0 ? star_lang_id : lang_id;
  $('span.list_lang_text').each(function () {
    let parent = $(this).parents('.list_lang_form');
    if ($(this).find('a[data-lang=' + lang_id + ']').length) {
      $(this).find('a.change_form').removeClass('active');
      $(this).find('a[data-lang=' + lang_id + ']').addClass('active');

      if (parent.next().find('.redactor-box').length) {
        parent.next().find('textarea,input').parent().hide();
        parent.next().find('textarea[data-lang=' + lang_id + '],input[data-lang=' + lang_id + ']').parent().show();
      } else {
        parent.next().find('textarea,input').hide();
        parent.next().find('textarea[data-lang=' + lang_id + '],input[data-lang=' + lang_id + ']').show();
      }
    }
  });
  widget_lang_id = lang_id;
  let widget_type = GetWidgetType();
  if (widget_type == 'knowledge_mail') {
    updateListArticles(lang_id);
  }

  updateListFields(lang_id);

  updatePreview(lang_id)

  for (let i in langs_ids) {
    updateListCch(langs_ids[i], false, true);
  }
  updateListCch(lang_id);
  changeGlobalSC(currentGlobalCSE)
}

function updateListArticles(lang_id) {
  if (!lang_id) {
    lang_id = $('.js_block_articles a.active').length ? $('.js_block_articles a.active').attr('data-lang') : star_lang_id;
  }
  let ul = $('li.a20_step[data-key="step_init_knowledge"]').next().find('.a20_articles ul');
  ul.html('');
  ul.parent().find('a').show();

  let cnt = 0;
  let tmp = [];
  let b_empty = articles_selected.length == 0;
  for (let i = 0; i < articles_num; i++) {
    let options = '';
    let noranslated = ''
    for (let cid in articles_data) {
      let b_translate = articles_data[cid]['section_title'][lang_id];
      let articles = articles_data[cid]['data']
      options += '<optgroup class="' + (!b_translate ? 'noranslated' : '') + '" label="' + (articles_data[cid]['section_title'][lang_id] || articles_data[cid]['section_title'][star_lang_id]) + '">';
      for (let aid in articles) {
        let b_translate = articles[aid]['titles'][lang_id] && articles[aid]['anons'][lang_id];
        if (b_empty && tmp.indexOf(articles[aid]['id'].toString()) == -1) {
          //Если это создание виджета - показываем 3 разных статьи
          tmp.push(articles[aid]['id'].toString());
          articles_selected.push(articles[aid]['id'].toString());
        }
        let selected = articles_selected[i] && articles_selected[i].toString() == articles[aid]['id'].toString() ? 'selected' : '';

        if (b_translate || selected) {
          options += '<option class="' + (!b_translate && selected ? 'noranslated' : '') + '" ' + selected + ' value="' + articles[aid]['id'] + '">' + (articles[aid]['titles'][lang_id] || articles[aid]['titles'][star_lang_id]) + '</option>'
          cnt++;
          if (!b_translate && selected) {
            noranslated = articles[aid]['id']
          }
        }
      }
      options += '</optgroup>';
    }
    ul.append(`<li ${noranslated ? `data-noranslated=${noranslated}` : ""}><i class="far fa-bars -js-move-item"></i><select class="mySelect">${options}</select><i class="far fa-times -js-remove-rule"></i></li>`);
  }


  etalonSelectArticles = document.querySelector(".a20_articles ul li:last-child").outerHTML;

  // Если статей меньше 5 - показываем кнопку "добавить статью"
  if (ul[0].children.length !== 5) {
    ul.parent().find('a').show();
  } else {
    ul.parent().find('a').hide();
  }

  InitSelects();
}

function updateListFields(lang_id) {

  if (!lang_id) {
    lang_id = $('.js_block_fields a.active').length ? $('.js_block_fields a.active').attr('data-lang') : star_lang_id;
  }
  lang_id = parseInt(lang_id);
  let ul = $('li.a20_step[data-key="step_init_form"]').next().find('ul.a20_form_fields');
  (function () {
    // если мы добавляем поле на другом языке (не на русском), то у нас могут закончиться варианты для полей,
    // хотя для рус. языка варианты будут, поэтому нам нужно скопировать все возможные варианты перед сменой языка на другой
    const field = document.querySelector(".a20_form_fields")
    if (!field.getAttribute("data-lang") && field.clientHeight > 0) {
      saveOption()
    }
  })();

  ul.html('');
  ul.parent().find('a').show();
  for (let i in fields_selected) {
    let _custom_title;
    let options = '';
    let noranslated = ''
    fields_selected[i]['id'] = parseInt(fields_selected[i]['id']);

    if ($('.js_block_fields').children().length) {
      _custom_title = fields_selected[i]['label'] && fields_selected[i]['label'][lang_id] ? fields_selected[i]['label'][lang_id] : '';
    }
    for (let fid in fields_data) {
      let b_translate = fields_data[fid]['titles'][lang_id];
      let selected = fields_selected[i]['id'] == fid ? 'selected' : '';
      if (b_translate || selected) {
        options += '<option class="' + (!b_translate && selected ? (_custom_title ? 'noranslated_' : 'noranslated') : '') + '" ' + selected + ' value="' + fid + '">' + (fields_data[fid]['titles'][lang_id] || fields_data[fid]['titles'][star_lang_id]) + '</option>'

        if (!b_translate && selected) noranslated = fid
      }
    }

    let noorder = fields_selected[i]['id'] == 11 ? 'class="noorder"' : '';
    let hidden = fields_selected[i]['id'] == 11 ? 'style="visibility: hidden"' : '';
    let disabled = [2, 10, 11].indexOf(fields_selected[i]['id']) > -1 ? 'disabled' : '';
    let custom_title = '';

    if ($('.js_block_fields a').length) {
      $('.js_block_fields a').each(function () {
        custom_title += '<input type="text" placeholder="'+Translate('alpha20_js/rename')+'" class="new_name_field" value="' + (fields_selected[i]['label'][$(this).attr('data-lang')] || '') + '" style="' + ($(this).attr('data-lang') != $('.js_block_fields a.active').attr('data-lang') ? 'display:none;' : '') + '" data-lang="' + $(this).attr('data-lang') + '"/>'
      })
    } else {
      custom_title += '<input type="text" placeholder="'+Translate('alpha20_js/rename')+'" class="new_name_field" value="' + (fields_selected[i]['label'][star_lang_id] || '') + '" data-lang="' + star_lang_id + '"/>'
    }

    ul.append('' +
      '<li ' + ((noranslated) ? `data-noranslated=${noranslated}` : "") + '  ' + noorder + ' id="form_field_id' + fields_selected[i]['id'] + '">' +
      '<i class="far fa-bars -js-move-item" ' + hidden + '></i>' +
      '<select class="mod_select" ' + disabled + '>' + options + '</select>' +
      custom_title +
      '<i class="fa fa-asterisk' + (fields_selected[i]['required'] ? ' active' : '') + '" data-field_id="' + fields_selected[i]['id'] + '"></i>' +
      (!disabled ? '<i class="far fa-times -js-remove-rule"></i>' : '') +
      '</li>'
    );
  }
  etalonSelectSettings = document.querySelector(".a20_settings_step4 ul li:first-child").outerHTML; // выбираем незадизейбенное поле

  const init = InitSelects()
  const input = document.querySelectorAll(".a20_form_fields .new_name_field")

  input.forEach(element => {
    if (element.offsetHeight > 0 && element.value.length > 0) {
      const div = element.closest("li").querySelectorAll(".-js-no-translate")
      div.forEach(element => element.classList.add("-js-translate"))
    }
  })
  selectChange(init)
}

function updateListCch(lang_id, arr, b_only_indecators) {
  if (!arr) {
    arr = ['li_channel_knowledge', 'li_channel_idea'];
  }
  channelForChoicesLang = []
  let key;
  for (let ik in arr) {
    let class_name = arr[ik] == 'li_channel_idea' ? 'idea' : 'knowledge'
    let select = $('#' + arr[ik]).find('select');
    let g_b_translate = true;
    let selected = select.find('option:selected').val();
    key = arr[ik]
    if (!b_only_indecators) {
      select.find('option:not([value=none])').remove()
      select.hasClass('mod_select') ? select.select2("destroy") : null;
    }
    if (channels_list[class_name]) {
      let channel_arr = channels_list[class_name];

      if (get_object_len(channel_arr.data)
        || get_object_len(channel_arr.custom_data)) {
        let channel = channel_arr.data;
        for (let i in channel) {
          let data = channel[i];
          let id = data.id;
          let css_icon = data.icon;
          let val = data.title;
          let vals = data.titles;
          let b_translate = true;
          if (vals) {
            if (!vals[lang_id]) {
              b_translate = false;
              if (selected == id) {
                g_b_translate = false;
              }
            } else {
              val = vals[lang_id];
            }
          }
          if (!b_only_indecators) {
            ;(function () {
              let nameChanel
              let colorChannel
              Object.entries(channels_list).forEach(element => Object.keys(element[1]["data"]).forEach(data => {
                  colorChannel = element[1]["custom_data"]["color"]
                  if (class_name === element[0]) nameChanel = class_name
                })
              )

              const isExclusive = channelForChoicesLang.some(e => e.css == nameChanel && e.value == id)
              if (!isExclusive) // пишем в channelForChoices только уникальные опции
                channelForChoicesLang.push({
                  css: nameChanel,
                  value: id,
                  label: val,
                  color: colorChannel,
                  icon: css_icon
                })
            })();
            select.append('<option class="' + class_name + ' ' + (!b_translate ? 'noranslated' : '') + '" value="' + id + '" data-css="' + css_icon + '" ' + (id == selected ? 'selected' : '') + ' >' + val + '</option>');
          }
        }
      }
    }

    if (!g_b_translate) {
      const langIndicator = $('#' + arr[ik] + ' .list_lang_text a[data-lang=' + lang_id + ']')
      if (!langIndicator.closest(".custom-standart-btn")) {
        langIndicator.removeClass('translated').addClass('notranslated');
      }
    } else {
      const langIndicator = $('#' + arr[ik] + ' .list_lang_text a[data-lang=' + lang_id + ']')
      if (!langIndicator.closest(".custom-standart-btn")) {
        langIndicator.removeClass('notranslated').addClass('translated');
      }
    }
  }

  if (event?.type !== "click") return // нужен только "click", а может быть ещё и "DOMContentLoaded"
  if (!event?.target?.matches(".change_form")) return // отлавливаем только клик

  let select = $('#' + key).find('select')
  let _el_option_id = select.find("option[selected]").attr("value")
  let _el_option = Object.values(channelForChoicesLang).find(e => Number(e.value) === Number(_el_option_id)) // получаем запись с нужным каналом

  destroyInit(chanelInit, _el_option);
  destroyInit(newChanelInit, _el_option);

  channelForChoicesLang.map(element => {
    if (Number(element.value) === Number(_el_option_id)) {
      element['selected'] = true;
    } else {
      element['selected'] = false;
    }
  }) // для финальной версии канала устанавливаем выбранную ранее опцию

  // channelForChoicesLang = channelForChoicesLang.filter(e => e.css == _el_option.css) // оставляем опции только для текущего канала
  const selectForInit = Array.from(document.querySelectorAll(`#${key} select`))
  const newInit = choicesInit(selectForInit, {
    searchEnabled: false,
    shouldSort: false,
    itemSelectText: '',
    noResultsText: Translate('alpha20_js/no_results'),
    noChoicesText: Translate('alpha20_js/no_variants'),
    choices: channelForChoicesLang
  })
  /**
   * Нам нужно сохранить все иниты селектов у каналов на случай, если юзер переключит язык туда и обратно.
   * Для этого мы их пушим в массив newChanelInit. Это нужно для того, чтобы найти инстанс селекта текущего языка и проделать следуюущее:
   * дать destroy() инстансу - вставить опции, указав только что выбранную.
   */
  newChanelInit.push(newInit[0])

  // при выборе опции нам нужно подсветить все непереведённые опции
  selectForInit.forEach(e => e.closest(".choices").addEventListener("change", (event) => marked(event.target.closest("li"))))
  SelectNano(".js_chanels_list")
}

function strToText(str) {
  return $('<div/>').text($.trim(str)).html().replace(/\n/g, '<br>')
}

function updateIndicatorsLang() {
  $('.js_block_articles a').each(function () {
    let b_translate = true;
    $(this).removeClass('notranslated').addClass('translated')
    let lang_id = $(this).attr('data-lang');
    for (let i in articles_selected) {
      if (list_articles[articles_selected[i]]) {
        let article = list_articles[articles_selected[i]];
        b_translate = article['titles'][lang_id] && article['anons'][lang_id];
        if (!b_translate) {
          break;
        }
      }
    }
    if (!b_translate) {
      $(this).removeClass('translated').addClass('notranslated');
    }
  });
  let tmp = {};
  for (let i in fields_selected) {
    tmp[fields_selected[i]['id']] = fields_selected[i];
  }
  $('.js_block_fields a').each(function () {
    let b_translate = true;
    $(this).removeClass('notranslated').addClass('translated')
    let lang_id = $(this).attr('data-lang');

    for (let i in tmp) {
      if (fields_data[i]) {
        b_translate = fields_data[i]['titles'][lang_id] || tmp[i]['label'][lang_id];
        if (!b_translate) {
          break;
        }
      }
    }
    if (!b_translate) {
      $(this).removeClass('translated').addClass('notranslated');
    }
  });

  $('ul:not(.js_chanels_list) span.list_lang_text a').each(function () {
    let lang_id = $(this).attr('data-lang');
    let parent = $(this).parents('.list_lang_form');
    if (parent.hasClass('js_block_fields')
      || parent.hasClass('js_block_articles')) {
      return;
    }

    $(this).addClass('notranslated').removeClass('translated')

    if (parent.hasClass('js_block_custom_btn')) {
      let b_translate = true;
      parent.next().find('input[data-lang=' + lang_id + ']').each(function () {
        if (!$(this).val().length) {
          b_translate = false;
        }
      });
      if (b_translate) {

        $(this).removeClass('notranslated').addClass('translated');

        if (parent.hasClass('js_block_cch')) {
          updateListCch(lang_id, false, true)
        }
      }
    } else {
      const input = parent.next().find('input[data-lang=' + lang_id + ']')
      const textarea = parent.next().find('textarea[data-lang=' + lang_id + ']')

      if ((input.length && input.val().length) || (textarea.length && textarea.val().length)) {
        // возможно ошибка тут
        $(this).removeClass('notranslated').addClass('translated')
      }
    }
  });
}

function updatePreview(lang_id) {
  $('.a20_slide2 .a20_zoom .a20_help_text').html(strToText($('textarea.js_help_text_input:visible').val()));
  if (update_preview_recommend) {
    $('.a20_slide3 .search_panel p').text(strToText($('input.knowledge_search_label:visible').val()));
    $('.a20_slide3 div.recommended span.name').text(strToText($('input.knowledge_text_recommended_articles:visible').val()));
    $('.a20_slide3 div.recommended span.link').text(strToText($('input.knowledge_text_link_kb:visible').val()));
  }
  $('.a20_slide4 h4.a20_bg100_cs span').text(strToText($('input.form_title:visible').val()));
  $('.a20_slide4 div.a20_form_foot span.a20_send_form').text(strToText($('input.form_button_value:visible').val()));
  $('.a20_slide6 li.a20_win_success h3 span').text(strToText($('input.message_title_input:visible').val()));
  $('.a20_slide6 li.a20_win_success p').html(strToText($('textarea.message_text_input:visible').val()));

  $('.a20_zoom li.a20_str_hor span').text(strToText($('input.button_text:visible').val()));
  $('.a20_zoom li.a20_str_vert span').text(strToText($('input.button_text:visible').val()));
  $('.a20_slide4 .a20_term_text').text('');

  if ($('#b_terms').prop('checked')) {
    if ($('.js_terms_input[data-lang]').length == 1) {
      $('.a20_slide4 .a20_term_text').html(($('.js_terms_input[data-lang="1"]').val()));

    } else {
      $('.a20_slide4 .a20_term_text').html(($('.js_terms_input[data-lang=' + $('.js_block_terms a.active').attr('data-lang') + ']').val()));
    }
  }
  var verticalOffset = $('.a20_zoom li.a20_str_vert').width() / 2;
  $('.a20_zoom li.a20_str_vert').css('margin-top', verticalOffset + 'px');
  if ((button_type + '_' + button_position) == 'line_right') {
    var offset = $('.a20_slide2 .a20_zoom li.a20_str_vert').width();
    $('.a20_slide2 .a20_zoom li.a20_str_vert').css('right', (-offset + 36) + 'px');

  }

  if (update_preview_recommend) {
    $('.a20_slide3 div.recommended ul').html('')

    articles_selected = [];
    $('.a20_articles select').each(function () {
      articles_selected.push($(this).val());
      if (list_articles[$(this).val()]) {
        let article = list_articles[$(this).val()];
        let b_translate = article['titles'][lang_id] && article['anons'][lang_id];
        if (b_translate) {
          $('.a20_slide3 div.recommended ul').append('<li><h4 class="a20_color_cs">' + (article['titles'][lang_id] || article['titles'][star_lang_id]) + '</h4><p>' + (article['anons'][lang_id] || article['anons'][star_lang_id]) + '</p></li>');
        }
      }
    });
  }
  updateIndicatorsLang()
  updatePreviewFormFields()
}

function updatePreviewFormFields(lang_id) {
  if (!lang_id) {
    lang_id = $('.js_block_fields a.active').length ? $('.js_block_fields a.active').attr('data-lang') : star_lang_id;
  }
  let old = {};
  for (let i in fields_selected) {
    old[fields_selected[i]['id']] = fields_selected[i];
  }

  if ($('.a20_form_fields li').length > 0) {
    /**
     * Без этой проверки может оказатсья так, что полей в "Поля формы" нет, а мы очистили fields_selected.
     * В результате чего updateListFields(lang_id) отработает с ошибками и поля не появяться вовсе.
     */
    fields_selected = [];
    $('.a20_form_fields li').each(function () {

      let id = parseInt($(this).find('select').val());
      let labels = old[id] ? old[id]['label'] || {} : {};
      fields_selected.push({
        'id': id,
        'label': labels,
        'required': $(this).find('i.fa-asterisk').hasClass('active') ? 1 : 0
      })
    });
  }

  // FixSelects()
  updateIndicatorsLang()

  container = $('.a20_slide4 .a20_zoom li ul .nano-content');
  $(container).html('');
  var types = {
    'FIELD_TYPE_TEXT': 1,
    'FIELD_TYPE_TEXTAREA': 2,
    'FIELD_TYPE_CHECKBOX': 3,
    'FIELD_TYPE_SELECT': 4,
    'FIELD_TYPE_DATE': 5
  };

  $('.a20_form_fields > li select').each(function (index, element) {
    var field_id = $(element).val();

    if (fields_data[field_id]) {

      var field = fields_data[field_id];
      let b_required = $(element).closest("li").find('.fa-asterisk').hasClass('active');
      let title = field['titles'][lang_id];
      let custom_title = $(element).closest("li").find('input.new_name_field[data-lang=' + lang_id + ']').val();
      let class_required = b_required ? '' : 'class="a20_off"';
      if (b_required && !title) {
        title = field['titles'][star_lang_id];
      }
      if (custom_title) {
        title = custom_title
      }
      if (!title) return;

      if (field['field_type'] == types['FIELD_TYPE_TEXT'] || field['field_type'] == types['FIELD_TYPE_DATE']) {
        $(container).append('<li class="a20_border_cs"><p>' + title + '</p> <span ' + class_required + '>*</span></li>');
      } else if (field['field_type'] == types['FIELD_TYPE_TEXTAREA']) {
        $(container).append('<li class="a20_border_cs a20_cast"><p>' + title + '</p> <span ' + class_required + '>*</span></li>');
      } else if (field['field_type'] == types['FIELD_TYPE_CHECKBOX']) {
        $(container).append('<li class="a20_border_cs"><i class="far fa-square"></i><p>' + title + '</p> <span ' + class_required + '>*</span></li>');
      } else if (field['field_type'] == types['FIELD_TYPE_SELECT']) {
        $(container).append('<li class="a20_border_cs"><p>' + title + '</p> <span ' + class_required + '>*</span><i class="fas fa-sort-down"></i></li>');
      }
    }
  });

  $('.a20_slide4 .a20_zoom li ul li:first').removeClass('a20_border_cs');
  // $('.a20_slide4 .a20_zoom li ul').scrollpanel('update');
  $('.nano').nanoScroller();
}

function updateChannelsList(b_init) {
  updatePreview();
  var theme = $('li.a20_settings_step2 ul.a20_color i').parent().attr('class');
  if (wid_type == 'knowledge_mail') {
    $('.a20_slide3 .a20_zoom .social-block li').remove();
  } else {
    $('.a20_slide2 .a20_zoom.messengers_containers .channel_zoom').remove();
  }

  if(wid_type == "knowledge_mail") {
    Slide3FootChange();
  }

  var i = 0;
  var is_emails = false;
  $('.a20_settings_step31 li:not([b_hide]):visible').each(function (index, element) {
    let _el = $(this);
    let _select = _el.find('select');
    let isCustomBtn = _el.hasClass('custom-btn') || _el.hasClass('custom-standart-btn');

    ChangeChatraChannel(_el);
    if (isCustomBtn && b_init) {
      InitColorPicker(_el.find(".cch_colorpicker"), _el.find('.color-box-wrap'));
    }

    if (!isCustomBtn) {
      if (_select[0].id.match('chatra_link_groups_chat')) return;
      let c_key = _select[0].id.replace('channel_', '');
      if (wid_type == 'knowledge_mail') {
        const isHidden = $(this).attr("data-css") ? '' : ' -none ' // если добавить канал, а потом удалить канал, то останется пустое место вместо иконки

        $('.a20_slide3 .a20_zoom .social-block').append(
          '<li class="'+ isHidden +'"><span class="' + c_key + ' ' + (c_key == 'emails' ? theme : '') + '">'
          + '<i class="' + fixIcon($(this)) + ' fa-' + $(this).attr("data-css") + '"></i>' // иконку сюда для каналов
          + '</span></li>'
        );
      } else {
          const isHidden = $(this).attr("data-css") ? '' : ' -none ' // если добавить канал, а потом удалить канал, то останется пустое место вместо иконки

          $('.a20_slide2 .a20_zoom.messengers_containers .messenger_close').before(
            '<div class="'+ isHidden +'widget_button messenger_link messenger_' + c_key + ' ' + (c_key == 'emails' ? theme : '') + ' channel_zoom clearfix ">'
            + '<i class="' + fixIcon($(this)) + ' fa-' + $(this).attr("data-css") + '"></i>' // иконку сюда для каналов
            + '</div>'
          );
      }

      i++;
      if (c_key == 'emails') is_emails = true;
    } else {
      const icon = $(this).find('.form_item_icon i').attr('class')
      let c_ic = _el.find('.form_item_icon i').attr('style');
      let c_clr = _el.find('.cch_colorpicker').val();
      if (wid_type == 'knowledge_mail') {
        $('.a20_slide3 .a20_zoom .social-block').append(
          '<li><span class="custom_btn" style="background:' + c_clr + ';">'
          + '<i class="fa fa4-5 ' + icon + '" style="' + c_ic + '"></i>'
          + '</span></li>'
        );
      } else {
        $('.a20_slide2 .a20_zoom.messengers_containers .messenger_close').before(
          '<div class="widget_button messenger_link messenger_custom_btn channel_zoom clearfix" style="background:' + c_clr + ';">'
          + '<i class="fa fa4-5 ' + icon + '" style="' + c_ic + '"></i>'
          + '</div>'
        );  // возможно надо поправить после бека
      }
    }
  })

  if (is_emails) {
    $('li.a20_step[data-key="step_init_form"]').show();
    $('li.a20_step[data-key="step_init_labels"]').show();
    $('li.a20_step[data-key="step_init_message"]').show();
  } else {
    $('li.a20_step[data-key="step_init_form"]').hide();
    $('li.a20_step[data-key="step_init_labels"]').hide();
    $('li.a20_step[data-key="step_init_message"]').hide();
  }

  if (!CheckChannelHide('chat')) {
    $('li.a20_step[data-key="step_init_labels"]').show();
  }
  recountNumbers();
  var ico_size_pixels_ = $('li.a20_settings_step2 ul.a20_btn_size li.active').attr('data-form-value');
  var ico_size_pixels = 0;
  var ico_margin_b = 0;
  var ico_margin_b_last = 0;
  switch (ico_size_pixels_) {
    case 'small' :
      ico_size_pixels = 36;
      ico_margin_b = 6;
      ico_margin_b_last = 12;
      break;
    case 'middle':
      ico_size_pixels = 42;
      ico_margin_b = 8;
      ico_margin_b_last = 16;
      break;
    case 'big'   :
      ico_size_pixels = 50;
      ico_margin_b = 10;
      ico_margin_b_last = 20;
      break;
  }

  var height = ((ico_size_pixels + ico_margin_b) * (i - 1) + (ico_size_pixels + ico_margin_b_last) + ico_size_pixels + 25);
  height = $('.a20_zoom.messengers_containers').height();
  var margin = 367 - ((height + 14) / 2);
  $('.a20_slide2 .a20_zoom.messengers_containers').css('margin-top', margin + 'px');


  // Вынесем атрибут data-css из option на Li. Библиотека choices.js убирает все атрибуты у option и select
  function fixIcon(element) {
    const dataCss = element.find("select option").attr('data-css')
    element.attr("data-css", dataCss) // навешиваем на Li атрибут согласно типу канала

    // Если активирован Telegram (иконка 'paper-plane') или E-mail (иконка 'envelope') или Онлайн-чат (иконка 'comments'),
    // то нужно впереди вставлять fab, а не fas как для всех остальных
    let className = ($(element).attr("data-css") === 'paper-plane' ||
      element.attr("data-css") === 'envelope' ||
      element.attr("data-css") === 'comments')
      ? 'fas'
      : 'fab'
    //

    // if ($(element).attr("data-css")) {
    //   return className
    // } else {
    //   className = '-hidden'
    //   return className
    // }

    return className
  }
}

// Подсвечиваем опцию в селекте в "Поля формы" если она одна
function highlightedLastOption() {
  let selectAll = document.querySelectorAll(".a20_form_fields select");

  selectAll.forEach(element => {
    const optionWrapper = element.closest(".choices")
      .querySelectorAll(".choices__list .choices__item.choices__item--choice:not(.has-no-choices-special)")

    if (optionWrapper.length === 0) {
      const selected = element.closest(".choices").querySelector(".choices__list.choices__list--single .choices__item--selectable")
      selected.classList.add("-js-no-translate")
    }
  })
}

// Если нет перевода - подсвечиваем опцию
function noTranslated(selector) {
  const select = document.querySelectorAll(selector)

  select.forEach(li => {
    const value = li.getAttribute("data-noranslated")
    const div = li.querySelectorAll(`[data-value="${value}"]`)

    div.forEach(element => element.classList.add("-js-no-translate"))
  })
}

// Сохраняем опции при переключении языка
function saveOption() {
  let choicesItem = Array.from(document.querySelectorAll(".a20_form_fields li:first-child .choices__list.choices__list--dropdown .choices__item"))
  // const choicesItemSelected = document.querySelector(".a20_form_fields .choices__list.choices__list--single .choices__item--selectable").getAttribute("data-value")

  // choicesItem = choicesItem.filter(element => element.getAttribute("data-value") !== choicesItemSelected)

  const fieldsData = Object.entries(fields_data)
  let choice = [];

  choicesItem.forEach(element => {
    choice.push({label: element.innerText, value: element.getAttribute("data-value")})
  })

  localStorage.setItem("choiceForChoice", `${JSON.stringify(choice)}`)
}

//
function selectChange(init) {
  const step4 = document.querySelector(".a20_settings_step4").offsetHeight
  if (step4 === 0) return

  let wrapper = document.querySelector(".a20_settings_step4");
  const selects = wrapper.querySelectorAll(".choices")

  selects.forEach(element => {
    element.removeEventListener("change", changeWrapper)
    element.addEventListener("change", changeWrapper)
  })

  wrapper.removeEventListener("click", clickWrapper)
  wrapper.addEventListener("click", clickWrapper)
  isSelected()

  // Ф-ция для выбора в селекте
  function changeWrapper(event) {
    if (!event.target.closest(".choices")) return
    const lang = wrapper.querySelector(".js_block_fields .change_form.active").getAttribute("data-lang")
    if (lang == "1") return
    const liId = event.target.closest("li").id
    const instance = init.filter(element => element.passedElement.element.closest("li").id === liId) // получаем инстанс селекта где был совершён выбор
    if (instance.length === 0) return
    const currentValue = event.detail.value
    const fieldsData = Object.entries(fields_data)
    const translatedOption = fieldsData.filter(element => !element[1]["titles"][`${lang}`]) // все НЕ переведённые опции на текущий язык
    const whaIt = event.target.closest("li")

    if (whaIt.getAttribute("data-revert")) {
      addedTranslatedChoices(fieldsData, instance, translatedOption, lang, currentValue, liId)
      whaIt.removeAttribute("data-revert")
    } else {
      addedAllChoices(fieldsData, instance, translatedOption, lang, currentValue, liId)
      whaIt.setAttribute("data-revert", "true")
    }

    isSelected()
  }

  // Ф-ция для клика
  function clickWrapper(event) {
    if (event.target.closest("a[rel='add_field']") || event.target.closest(".-js-remove-rule") || event.target.closest(".choices")) {
      isSelected()
    }
  }

  // если выбрали переведённую опцию, то добавляем переведённые опции заменяя предыдущие
  function addedTranslatedChoices(fieldsData, instance, translatedOption, lang, currentValue, liId) {
    let option = []

    fieldsData.filter(element => {
      if (element[1]["titles"][`${lang}`]) {
        const id = element[0]
        const title = element[1]["titles"][`${lang}`]

        option.push({label: title, value: id})
      }
    })

    option.filter(element => {
      if (element.value === currentValue) {
        element["selected"] = true // выбираем текущую опцию, но только на другом языке
      } else {
        document.querySelector(`#${liId} .choices__list.choices__list--single [data-value='${currentValue}']`)
          .classList.add("-js-no-translate") // подсвечиваем непереведённую выбранную опцию
      }
    })

    // const currentText = document.querySelector(`#${liId} .choices__list.choices__list--single [data-value='${currentValue}']`).textContent
    // option.push({ label : currentText, value : currentValue })

    instance[0].setChoices(option, 'value', 'label', true,)
    instance[0].passedElement.element.closest("li").removeAttribute("data-noranslated")

    // document.querySelector(`#${liId} .choices__list--dropdown [data-value='${currentValue}']`)
    //   .classList.add("-js-no-translate") // подсвечиваем непереведённую выбранную опцию
  }

  // при выборе непереведённой опции добавляем опции на рус. языке, заменяя предыдущие и подсвечиваем непереведённые
  function addedAllChoices(fieldsData, instance, translatedOption, lang, currentValue, liId) {
    const option = JSON.parse(localStorage.getItem("choiceForChoice"))

    option.filter(element => (element.value === currentValue) ? element["selected"] = true : null) // выбираем текущую опцию, но только на другом языке
    instance[0].setChoices(option, 'value', 'label', true,) // добавляем новые опции (на рус. языке) заменяя остальные

    highlightedNoTranslatedOption(translatedOption, liId)

    const selected = option.filter(element => element['selected'])
    instance[0].passedElement.element.closest("li").setAttribute("data-noranslated", selected[0].value)
  }
}

// Скрываем опции если они где-то выбраны
function isSelected() {
  // Получаем все выбранные option
  let select = document.querySelectorAll(".a20_form_fields .choices__list.choices__list--single .choices__item--selectable");
  let choicesItem = Array.from(document.querySelectorAll(".a20_form_fields .choices__list.choices__list--dropdown .choices__item"))
  let option = []

  // Получаем сам value
  select.forEach(element => option.push(element.getAttribute("data-value")));

  // Скрываем варианты в выпадающем списке если они уже где-то выбраны
  choicesItem.filter((element) => {
    if (option.includes(element.getAttribute("data-value"))) {
      const value = element.getAttribute("data-value")
      const isSelected = element.closest(".choices").querySelector(`.choices__list.choices__list--single [data-value='${value}']`)

      // Не скрываем вариант выбора, если он выбран у текущего селекта
      if (!isSelected) element.classList.add("-none")
    } else {
      element.classList.remove("-none")
    }
  })

  highlightedLastOption() // подсвечиваем опцию, если она осталась одна
}

// подсвечиваем все неперевёднные опции
function highlightedNoTranslatedOption(translatedOption, liId) {
  translatedOption.forEach(element => {
    const value = element[0]

    const option = document.querySelectorAll(`#${liId} [data-value="${value}"]`)
    option.forEach(element => element.classList.add("-js-no-translate"))
  })
}

function GenerateChannelSelectList(lang_id) {
  if (!lang_id) {
    lang_id = widget_lang_id ? widget_lang_id : star_lang_id;
  }
  lang_id = parseInt(lang_id);

  let channels = $('.js_chanels_list > li');
  let select = $('.channel_default_select');
  let option = select.find('option');

  arr_allowed.length = 0;

  channels.each(function (i, el) {
    let channel_name = $(el).attr('id').replace('li_channel_', '');
    if (CheckChannelHide($(el))) {

      if (wid_type == 'knowledge_mail') {
        if (channel_name !== 'knowledge' && channel_name !== 'idea') {
          arr_allowed.push(channel_name);
        }
      } else if (wid_type == 'mail') {
        return;
      } else if (wid_type == 'messengers_mail') {
        arr_allowed.push(channel_name);
      } else if (wid_type == 'messengers') {
        if (channel_name !== 'knowledge' && channel_name !== 'idea' && channel_name !== 'emails') {
          arr_allowed.push(channel_name);
        }
      }
    } else {
      if (channel_name) {
        select.find('option.' + channel_name).addClass('hidden')
      } // при редактировании виджета channel_name может быть пустым
    }
  })

  // сбрасываем селект "Выберите канал"
  if (channelInitForAdded !== undefined && channelInitForAdded.length > 0) {
    channelInitForAdded[0].destroy()
  }

  select.hasClass('mod_select') ? select.select2("destroy") : null;
  select.find('option:not([value=none])').remove()

  // отображаем нужные option, обновляем селекты
  if (arr_allowed.length) {
    channelForChoices = []
    arr_allowed.map(function (class_name, k) {
      if (channels_list[class_name]) {
        let channel_arr = channels_list[class_name];
        if (get_object_len(channel_arr.data) || get_object_len(channel_arr.custom_data)) {
          let title = channel_arr.title;
          let channel = channel_arr.data;

          select.append('<option class="' + class_name + '" value="d" disabled>— ' + title + '</option>');
          for (let i in channel) {
            let data = channel[i];
            let id = data.id;
            let css_icon = data.icon;
            let val = data.title;
            let vals = data.titles;
            if (vals) {
              if (!vals[lang_id]) {
                continue;
              }
              val = vals[lang_id]
            }

            ;(function () {
              let nameChanel
              let colorChannel
              Object.entries(channels_list).forEach(element => Object.keys(element[1]["data"]).forEach(data => {
                  colorChannel = element[1]["custom_data"]["color"]
                  if (class_name === element[0]) nameChanel = class_name
                })
              )
              channelForChoices.push({css: nameChanel, value: id, label: val, color: colorChannel, icon: css_icon})
            })();
            select.append('<option class="' + class_name + '" value="' + id + '" data-css="' + css_icon + '">— ' + val + '</option>');
          }
        }
      }
    })

    //Подготавливаем селект при клике на "добавить канал"
    ;(function (){
      // Если мы нажали на "добавить канал" и удалили какой-то канал, то нужно добавить опцию прочерк
      ;(function () {
        const select = document.querySelector(".a20_steps .channel_default_select:not(.choices__input)")
        if (!select) return
        const option = select.querySelector(`[value='none']`)
        if (option) return
        select.insertAdjacentHTML("afterbegin", `<option value="none" selected class="dash">—</option>`)
      })();

      channelInitForAdded = choicesInit('.a20_steps .channel_default_select', {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        noResultsText: Translate('alpha20_js/no_results'),
        noChoicesText: Translate('alpha20_js/no_variants')
      });

      // Опция прочерк не должна быть доступна для выбора среди других опций
      const noneOption = document.querySelector(".a20_steps .choices__list.choices__list--dropdown [data-value='none']");
      noneOption && noneOption.remove()
    })();

    ;(function () {
      $('select.mod_select:not(.hidden)')
        .on("showDropdown", function () {
          $('.js_chanels_list .channel_default_select .choices__inner').removeClass('border-error')
        })
        .on('change', function (e) {
          let parent_li = $(this).parents('li');
          if (parent_li[0].id && (parent_li[0].id == 'li_channel_knowledge' || parent_li[0].id == 'li_channel_idea')) {
            for (let i in langs_ids) {
              updateListCch(langs_ids[i], [parent_li[0].id], true);
            }
          }
        })
        .on('change', function (e) {
          if ($(this).hasClass('channel_default_select')) {
            let _el_option_id = e.target[0].value;
            let _el_option = Object.values(channelForChoices).find(e => e.value == _el_option_id)
            let _el = $('#li_channel_' + _el_option.css);

            if (_el.length == 0) return

            _el.removeAttr('b_deleted');
            _el.hasClass('custom-standart-btn') ? _el.removeAttr('b_hide') : null

            destroyInit(chanelInit, _el_option); // инит при загрузке страницы
            destroyInit(newChanelInit, _el_option); // инит после удаления и добавления того же самого канала

            let new_el = _el.clone();

            ;(function () {
              /**
               * При редактировании виджета, а конкретно при смене типа виджета и добавлении нового канала,
               * иконки не добавляться из-за отсутствия аттрибута data-css у li.
               * База знаний и Предложения этот аттрибут не нужен
              */
              const icon = _el_option.icon
              const isData = new_el.attr("data-css")

              if (isData !== undefined || _el_option.css === "knowledge" || _el_option.css === "idea") return

              const className = (icon === 'paper-plane' ||
                icon === 'envelope' ||
                icon === 'comments')
                ? 'fas' // Если активирован Telegram (иконка 'paper-plane') или E-mail (иконка 'envelope') или Онлайн-чат (иконка 'comments'),
                : 'fab' // то нужно впереди вставлять fab, а не fas как для всех остальных

              new_el.attr("data-css", icon)
            })();

            _el.remove();
            $('.js_chanels_list').append(new_el);
            _el = $('#li_channel_' + _el_option.css);

            channelForChoices = channelForChoices.filter(e => e.css == _el_option.css) // оставляем опции только для текущего канала
            channelForChoices.map(element => {
              if (Number(element.value) === Number(_el_option_id)) {
                element['selected'] = true;
              } else {
                element['selected'] = false;
              }
            }) // для финальной версии канала устанавливаем выбранную ранее опцию

            const selectForInit = Array.from(document.querySelectorAll(`.js_chanels_list #li_channel_${_el_option.css} select:not(.js_service)`))
            const newInit = choicesInit(selectForInit, {
              searchEnabled: false,
              shouldSort: false,
              itemSelectText: '',
              noResultsText: Translate('alpha20_js/no_results'),
              noChoicesText: Translate('alpha20_js/no_variants'),
              choices: channelForChoices
            })
            /**
             * Нам нужно сохранить все иниты селектов у каналов на случай, если юзер удалит 2 и больше каналов, а потом заново их вставит.
             * Для этого мы их пушим в массив newChanelInit. Это нужно для того, чтобы найти инстанс селекта у канала и если он был заново вставлен, то:
             * дать destroy() инстансу - скопировать HTML - вставить опции, указав только что выбранную.
             */
            newChanelInit.push(newInit[0])

            // выбор дефолт опшина для Чатры
            if (_el_option.css == 'chat') {
              const spechialChatra = Array.from(document.querySelectorAll(`.js_service`))
              const init = choicesInit(spechialChatra, {
                searchEnabled: false,
                shouldSort: false,
                itemSelectText: '',
                noResultsText: Translate('alpha20_js/no_results'),
                noChoicesText: Translate('alpha20_js/no_variants'),
                choices: optionForChatra
              })

              newChanelInit.push(init[0])
            }

            ChangeChatraChannel(_el);
            messengers_num++;
            removeA(arr_allowed, _el_option.css)

            if (!arr_allowed.length) $('.a20_chanels_list a[rel=add_chanel]').hide();
            $('.js_chanels_list li.channel-default').remove();

            InitColorPicker(_el.find(".cch_colorpicker"), _el.find('.color-box-wrap')); // refresh and reinit CP
            _el.show();
            updateChannelsList();
            Slide3FootChange();
            InitNanoScrolls("")
          }
        });

      $('.a20_articles ul, .a20_form_fields, .a20_chanels_list  ul.js_chanels_list').sortable({
        items: 'li:not(.noorder)',
        handle: '.-js-move-item',
        cursor: 'ns-resize',
      });

      $('.nano').nanoScroller({alwaysVisible: true});
      $('.nano .nano-pane').addClass('a20_scroll_in');
      $('.nano .nano-pane .nano-slider').addClass('a20_scroll_thumb');
      $('.a20_articles select').on('change', function () {
        articles_selected = [];
        $('.a20_articles select').each(function () {
          articles_selected.push($(this).val());
        })
      })
    })();
  }
}

function removeA(arr) {
  var what, a = arguments, L = a.length, ax;
  while (L > 1 && arr.length) {
    what = a[--L];
    while ((ax = arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1);
    }
  }
  return arr;
}

function Slide3FootChange() {
  let exp = $('.js_chanels_list > li:not([id="li_channel_emails"]):not(.channel-default)').is(':visible');

  $('.a20_slide3 .a20_form_foot .foot_group .question').text($('.kl_text_create_ticket').eq(0).val())

  if (exp) {
    $('.a20_slide3 .a20_form_foot .social-container').show();
    $('.a20_slide3 .a20_form_foot .foot_group').hide();
  } else {
    $('.a20_slide3 .a20_form_foot .foot_group').show();
    $('.a20_slide3 .a20_form_foot .social-container').hide();
  }
}

function changeButtonColor(color) {
  console.log(color)
  $('.a20_slide2 .a20_zoom li').each(function (index, element) {
    $(element).removeClass('red')
      .removeClass('second_red')
      .removeClass('violet')
      .removeClass('second_violet')
      .removeClass('third_violet')
      .removeClass('dark_blue')
      .removeClass('blue')
      .removeClass('light_blue')
      .removeClass('cyan')
      .removeClass('dark_green')
      .removeClass('green')
      .removeClass('salad')
      .removeClass('light_salad')
      .removeClass('yellow')
      .removeClass('orange')
      .removeClass('dark_orange')
      .removeClass('second_dark_orange')
      .removeClass('brown')
      .removeClass('gray')
      .removeClass('white')
      .removeClass('black');
    $(element).addClass(color);
  });

  $('.a20_slide3 .a20_zoom li').each(function (index, element) {
    $(element).removeClass('red')
      .removeClass('second_red')
      .removeClass('violet')
      .removeClass('second_violet')
      .removeClass('third_violet')
      .removeClass('dark_blue')
      .removeClass('blue')
      .removeClass('light_blue')
      .removeClass('cyan')
      .removeClass('dark_green')
      .removeClass('green')
      .removeClass('salad')
      .removeClass('light_salad')
      .removeClass('yellow')
      .removeClass('orange')
      .removeClass('dark_orange')
      .removeClass('second_dark_orange')
      .removeClass('brown')
      .removeClass('gray')
      .removeClass('white')
      .removeClass('black');
    $(element).addClass(color);
  });

  color == 'black' ? $('.a20_slide2, .a20_slide3, .a20_slide4, .a20_slide6').addClass('black-theme') : $('a20_slide2, .a20_slide3, .a20_slide4, .a20_slide6').removeClass('black-theme');
}

function setStaticInfoSlide3() {
  $('.a20_slide3 .search_panel p').text(Translate('alpha20_js/search_query'));
  $('.a20_slide3 .search_panel .fa-search').hide();
  $('.a20_slide3 .search_panel .fa-times').show();

  $('.social-container > p').text($('.kl_text_create_ticket').eq(0).val())

  $('.a20_slide3 .a20_zoom .recommended h3 .name').text(Translate('alpha20_js/searching_result'));

  $('.a20_slide3 div.recommended ul').html('')

  let listHtml = `<li><h4 class="a20_color_cs">`+Translate('alpha20_js/personalisation_sc')+`</h4>
                   <p>`+Translate('alpha20_js/li1')+`</p>
                   </li>
                   <li><h4 class="a20_color_cs">`+Translate('alpha20_js/cases_list_filter')+`</h4>
                   <p>`+Translate('alpha20_js/li2')+`</p>
                   </li>
                   <li><h4 class="a20_color_cs">`+Translate('alpha20_js/templates_for_fast_proccesing_cases')+`</h4>
                   <p>`+Translate('alpha20_js/li3')+`</p>
                   </li>`;
  $('.a20_slide3 div.recommended ul').append(listHtml);
}

// находим нужный инит и destroy-ем его, чтобы скопировать чистый HTML и перевставить его с опциями
function destroyInit(instanse, _el_option) {
  if (instanse !== undefined) {
    instanse.filter(element => {
      if (element && element.passedElement.element.id.includes(_el_option?.css) ||
        element && element.passedElement.element.closest("li").id.includes(_el_option?.css)) {
        element.destroy();
      }
    })
  }
}

// подсвечиваем все непереведённые опции в каналах "Предложения" и "База знаний"
function marked(target) {
  setTimeout(() => {
    if (target.matches("#li_channel_knowledge") ||
      target.matches("#li_channel_idea")) {
      let select = target.querySelector(".choices")
      let options = select.querySelectorAll(".choices__item[data-value]")
      let channelName = target.id.split("li_channel_")[1] // текущий канал
      let langID = target.querySelector(".change_form.active").getAttribute("data-lang") // какой язык выбран
      let noTranslated = [] // id непереведённых опций

      if (Number(langID) === 1) return

      // получаем id непереведённых опций
      Object.values(channels_list[channelName]["data"]).filter(data => {
        Object.entries(data).filter(element => {
          if (element[0] !== "titles") return
          if (!element[1][langID]) {
            noTranslated.push(data.id)
          }
        })
      })

      // навешиваем класс на непереведённые опции
      options.forEach(option => {
        noTranslated.forEach(element => {
          if (Number(option.getAttribute("data-value")) === Number(element)) {
            option.classList.add("noranslated")
          }
        })
      })
    }
  }, 1) // не успевает заново заинитится селект с опциями для выбранного языка
}

// скрываем/показываем поле E-mail
function emailNeed(isNeed) {
  const status = isNeed ? "block" : "none"
  const widgetEmail = document.querySelectorAll(".widget_email--inner")

  widgetEmail.forEach(element => {
    const choices = element.closest(".choices")
    if (choices) {
      choices.style.display = status
    } else {
      element.style.display = status
    }
  })
}
