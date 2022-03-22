let countF = 0;

$(document).ready(function () {

  $('textarea[id^=article_content_]').each(function () {
    CreateKnowledgeArticlesHtmlEditor(this.id, 260, 400);
  });

  $(document).on('click', 'a.change_form', function (e) {
    e.preventDefault();
    var lang_id = $(this).attr('data-lang_id');
    $('a.change_form').removeClass('active');
    $(this).addClass('active');

    $('div[id^=article_lang_]').addClass("-none")
    $('div[id^=article_lang_]').removeClass("-block")

    $('div#article_lang_' + lang_id).addClass("-block")
    $('div#article_lang_' + lang_id).removeClass("-none")
  });


  $(document).on('change', 'select[id^=access_type_]', function (e) {
    e.preventDefault();
    var value = $(this).val();
    $('select[id^=access_type_]').each(function () {
      $(this).val(value);
      // $(this).selectmenu();
    });
  });


  // Проганяем через Choices.JS select-ы из "Раздел базы знаний" и "Статья доступна"
  (function () {
    const knowledgeBaseSection = choicesInit('select.-js-noMySelect', {
      searchResultLimit: 99,
      shouldSort: false,
      itemSelectText: '',
      removeItems: true,
      removeItemButton: true,
      noResultsText: Translate('alpha20_js/no_results'),
      noChoicesText: Translate('alpha20_js/no_variants'),
    });
    addRemoveOption(knowledgeBaseSection);

    const articleAvailable = choicesInit('.article_key_access', {
      searchEnabled: false,
      shouldSort: false,
      itemSelectText: '',
      noResultsText: Translate('alpha20_js/no_results'),
      noChoicesText: Translate('alpha20_js/no_variants')
    });
    addRemoveOption(articleAvailable);

    // При выборе в RUS версии, в других языках option в select-ах будет меняться автоматом на аналог на другом языке.
    function addRemoveOption(select) {
      select[0].passedElement.element.addEventListener('removeItem', function (event) {
        select.map(element => element.removeActiveItemsByValue(event.detail.value))

        const selectId = select[0].passedElement.element.id
        if (selectId.includes("knowledge_section_")) {
          const option = Array.from(document.querySelectorAll("#knowledge_section_id_1 option"))
          data = {'section': addLabels(option)}
        }
      })

      select[0].passedElement.element.addEventListener('addItem', function (event) {
        select.map(element => element.setChoiceByValue(event.detail.value))

        const selectId = select[0].passedElement.element.id
        if (selectId.includes("knowledge_section_")) {
          const option = Array.from(document.querySelectorAll("#knowledge_section_id_1 option"))
          data = {'section': addLabels(option)}
        }
      })

    }
  })();

  $("select.no_lang").each(function () {
    $(this).parent().find('a.ui-selectmenu').hide();
    $(this).parent().find('div.no_lang_text').show();
  });

  $('#support_center_articles').click(function(e) {
      if($('.alpha5_lang a').length > 0) {
          $('.alpha5_lang a').each(function () {
              let red = 'article_content_' + $(this).attr('data-lang_id');
              if($('#'+red).hasClass('redactor-source-open')){
                  $R('#'+red, 'module.source.hide'); // https://imperavi.com/redactor/docs/api-modules/source/
              }
          });
      } else {
          let red = 'article_content_1';
          if($('#'+red).hasClass('redactor-source-open')){
              $R('#'+red, 'module.source.hide'); // https://imperavi.com/redactor/docs/api-modules/source/
          }
      }
      setTimeout(function ()
      {
          $('.form_save_article')[0].submit();
      },300);
      return false;
  });
  init_nice_elements(); // инитим селекты
  SelectNano("")
  AutoSaveArticle();
});

function AutoSaveArticle() {
  if (!CheckLocalStorage()) {
    $('form.form_save_article a.cancel').show();
    $('form.form_save_article input[type=submit]').removeAttr('disabled');
    return false;
  }
  $('form.form_save_article a.cancel').hide();
  $('form.form_save_article input[type=submit]').attr('disabled', 'disabled');
  var article_id = parseInt($('input[name=article_id]').val());
  var article_img_uid = article_id > 0 ? article_id : $('input[name=article_img_uid]').val();
  var prefix = 'Omni/KB/AutoSave/' + article_id;
  var b_edited = false;
  var b_save = false;
  $(document).on('click', '.cancel', function (e) {
    e.preventDefault();
    setTimeout(function () {
      default_data = getData();
      $('form.form_save_article a.cancel').hide();
      $('form.form_save_article input[type=submit]').attr('disabled', 'disabled');
      b_edited = false;
    }, 100);
  });
  var getData = function () {
    const option = Array.from(document.querySelectorAll("#article_lang_1 .section_in_edit_article option"))

    var data = {
      'section': addLabels(option),
      'access': $('.article_key_access option').val(),
      'tstamp': $('input[name=article_key_access]').val(),
      'titles': {},
      'contents': {},
      'tags': {},
      'article_img_uid': article_img_uid
    };

    if (default_data) {
      default_data['section'].forEach(default_data => {
        data['section'].forEach(data => {
          // проверяем метки. Если метки в "Раздел базы знаний" изменились, то: b_edited = true; если нет, то: b_edited = false
          b_edited = (default_data.id === data.id) ? b_edited = false : b_edited = true
        })
      })
    }

    b_edited = default_data && default_data['access'] != data['access'] ? true : b_edited;
    $('input[class*=article_key_title_]').each(function () {
      var lang_id = $(this).attr('class').match(/article_key_title_([0-9]+)/)[1];
      data['titles'][lang_id] = $(this).val();

      b_edited = default_data && default_data['titles'][lang_id] != data['titles'][lang_id] ? true : b_edited;
    });
    $('textarea[class*=article_key_content_]').each(function () {
      var lang_id = $(this).attr('class').match(/article_key_content_([0-9]+)/)[1];

      let redactorContent = $(this).parent().find('.redactor-layer');

      if(redactorContent.find('table, ul, ol').length) {
        let tables = redactorContent.find('table');
        let lists = redactorContent.find('ul, ol');

        tables.each(function() {
          // $(this).find('div[data-redactor-tag="tbr"]').removeAttr('data-redactor-style-cache data-redactor-tag')
          let tbrBlocks = $(this).find('div[data-redactor-tag="tbr"]');
          tbrBlocks.each(function() {
            let html = $(this).html();
            let styles = typeof $(this).attr('style') !== undefined ? $(this).attr('style') : '';
            if($(this).text().trim().length > 0) {
              if(!$(this).find('.fixAlignment').length) {
                $(this).html('');
                $(this).append('<p class="fixAlignment" style="'+styles+'">'+html+'<p/>')
                $(this).find('p:empty').remove();
              } else {
                $(this).find('.fixAlignment').attr('style', styles)
              }
            }
          })
        })

        lists.each(function() {
          let liBlocks = $(this).find('li');
          liBlocks.each(function() {
            let html = $(this).html();
            if($(this).text().trim().length > 0) {
              if(!$(this).find('.fixAlignment').length) {
                if(!$(this).children('p').length) {
                  $(this).html('');
                  $(this).append('<p class="fixAlignment">'+html+'<p/>');
                } else {
                  $(this).children('p').addClass('fixAlignment');
                }

                // возвращаем курсор вконец строки, после фикса выравнивания
                if(countF <= 3) {
                  if(placeCaretAtRowEnd(this) == true) {
                    return
                  }
                  countF++;
                }

                let styles = typeof $(this).find('.fixAlignment').attr('style') !== undefined ? $(this).find('.fixAlignment').attr('style') : '';
                if(styles !== undefined) {
                  $(this).attr('style', styles)
                }

                $(this).find('p:empty').remove();

              } else {
                let styles = typeof $(this).find('.fixAlignment').attr('style') !== undefined ? $(this).find('.fixAlignment').attr('style') : '';
                if(styles !== undefined) {
                  $(this).attr('style', styles)
                }
              }
              $(this).find('p:empty').remove();
            }
          })
        })
        // console.log(redactorContent.html())
        data['contents'][lang_id] = $.trim(redactorContent.html());
      } else {
        data['contents'][lang_id] = $.trim($(this).val());
      }


      b_edited = default_data && $.trim(default_data['contents'][lang_id].replace(/&nbsp;/g, ' ')) != $.trim(data['contents'][lang_id].replace(/&nbsp;/g, ' ')) && $('[id*=article_lang_' + lang_id + ']').find('.js_omni_redactor_container').text().trim().length > 0
      && Object.keys(data['contents'][lang_id]).length > 0 ? true : b_edited;
    });

    $('input[class*=article_key_tags_]').each(function () {
      var lang_id = $(this).attr('class').match(/article_key_tags_([0-9]+)/)[1];
      data['tags'][lang_id] = $(this).val();
      b_edited = default_data && default_data['tags'][lang_id] != data['tags'][lang_id] ? true : b_edited;
    });


    // console.log( data )
    if (b_edited && validate()) {
      $('form.form_save_article a.cancel').show();
      $('form.form_save_article input[type=submit]').removeAttr('disabled');
    } else {
      $('form.form_save_article a.cancel').hide();
      $('form.form_save_article input[type=submit]').attr('disabled', 'disabled');
    }
    b_edited = false;

    window.data = data
    window.default_data = default_data
    // console.log(data, 'data[contents] возвращает таблицу без форматирования')
    return data;
  };

  var default_data = getData();
  var saved_data = localStorage.getItem(prefix);
  // var saved_data = getData();
  if (saved_data) {
    saved_data = $.parseJSON(saved_data);
    // console.log(saved_data)
    if (saved_data['tstamp'] && saved_data['tstamp'] == $('input[name=article_last_updated]').val()) {
      b_edited = default_data['section'] != saved_data['section'] ? true : b_edited;
      b_edited = default_data['access'] != saved_data['access'] ? true : b_edited;
      for (var lang_id in saved_data['titles']) {
        // если сохрененные данные не пусты
        if (Object.keys(saved_data['titles'][lang_id]).length > 0) {
          $('input.article_key_title_' + lang_id).val(saved_data['titles'][lang_id]);
        }
        b_edited = default_data['titles'][lang_id] != saved_data['titles'][lang_id] ? true : b_edited;
      }
      for (var lang_id in saved_data['contents']) {
        var re = new RegExp('/knowledge_files/' + client_id + '/' + article_id + '/', "g");
        if (saved_data['contents'][lang_id].match(re) && default_data['contents'][lang_id].match(/selcdn\.ru\/KB_images\/omnideskru\//)) {
          continue;
        }
        // если сохрененные данные не пусты
        if (Object.keys(saved_data['contents'][lang_id]).length > 0) {
          // UpdateRedactorContent('textarea.article_key_content_' + lang_id, $.trim(saved_data['contents'][lang_id]));
        }
        b_edited = $.trim(default_data['contents'][lang_id].replace(/&nbsp;/g, ' ')) != $.trim(saved_data['contents'][lang_id].replace(/&nbsp;/g, ' ')) ? true : b_edited;
      }
      for (var lang_id in saved_data['tags']) {
        // если сохрененные данные не пусты
        if (Object.keys(saved_data['tags'][lang_id]).length > 0) {
          $('input.article_key_tags_' + lang_id).val(saved_data['tags'][lang_id]);
        }
        b_edited = default_data['tags'][lang_id] != saved_data['tags'][lang_id] ? true : b_edited;
      }
      b_edited = false;
    }
  }

  var auto_save_interval = setInterval(function () {
    var data = getData();
    if (b_save) {
      return;
    }

    localStorage.setItem(prefix, JSON.stringify(data));
  }, 3000);
  setInterval(function () {
    var data = getData();
  }, 500);
  setInterval(function () {
    var data = getData();
    // xajax_AutoSaveImgArticle(article_img_uid,data['contents']);
  }, 60000);
}

function regex_escape(str) {
  return str.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g'), '\\$&');
}

function validate() {
  var l_id = $('.alpha5_lang a').length ? $('.alpha5_lang a.active').attr('data-lang_id') : $('.form_save_article').attr('rel').match(/[0-9]+$/).toString();
  var container_div = $('#article_lang_' + l_id);
  var f = true;
  const knowledgeBaseSection = $(container_div).find('.section_in_edit_article')

  // console.log( knowledgeBaseSection );
  // console.log( "---" );
  // console.log( container_div );

  if (knowledgeBaseSection.children().length === 0) {
    f = false;
  }
  if (!$(container_div).find('.article_key_title_' + l_id).val().length) {
    f = false;
  }
  if (!GetRedactorCode('article_content_' + l_id).length) {
    f = false;
  }
  return f;
}


// Преобразовываем метки в массив объектов перед отправкой на сервер
function addLabels(option) {
  let arrayOption = option.map(function (item) {
    return {'id': item.value, 'text': item.textContent}
  }) // Создаём необходимого вида массив объектов
  return arrayOption
}
