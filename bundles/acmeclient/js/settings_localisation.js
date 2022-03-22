var saving_lang_id = 0;
$(document).ready(function () {
  $(document).on('click', '.modal-close', function (e) {
    e.preventDefault();
    $.magnificPopup.close();
  });

  $('.addingLocalisation').click(function () {
    $(this).addClass('dsbld');
    $('#record_li_0.addingBlock').slideDown('slow');

    SelectNano( `#record_li_0` )
    $('.cancelTop').fadeIn();
    return false;
  });

  $('.addingCancel_localisation').click(function () {
    var record_id = this.id.match(/\d+$/).toString();
    HideEditableBlock(record_id);
    return false;
  });

  $(document).on('keyup keypress blur change', '.localisation-form-lang input.lang_name_id', function () {
    var parent = $(this).closest(".addGroup")
    var record_id = $(parent).attr('id').match(/\d+$/).toString();
    if (($(parent).find('.-js-upload-language').hasClass('ready') && $(this).val().length) || ($(this).val().length && (record_id > 0 || !b_support_zone))) {
      $(parent).find('.submit-lang').removeClass('dsbld');
    } else {
      $(parent).find('.submit-lang').addClass('dsbld');
    }
  });
  $(document).on('change', '.localisation-form-lang input.save-lang-file', function () {
    var parent = $(this).closest(".addGroup")
    saving_lang_id = $(parent).attr('id').match(/\d+$/).toString();
    var act = $(this).parents('form').attr('action').replace(/\/upload_lang(.*)/, '/upload_lang/' + saving_lang_id);
    $(this).parents('form').attr('action', act);

    $(this).parents('form').submit();
  });

  $(document).on('click', 'input.submit-lang:not(.dsbld)', function () {
    var parent = $(this).parent().parent().parent().parent().parent();
    var record_id = $(parent).attr('id').match(/\d+$/).toString();

    var name = $(parent).find('.lang_name_id').val().toString();
    if (!name.match(/^[A-ZА-ЯЁІЇЄҐ]{3}\s\-\s.*$/)) {
      $(parent).find('.lang_name_id').addClass('border-error');
      return false;
    }
    $(parent).find('.lang_name_id').removeClass('border-error');

    xajax_SaveLang(record_id, name);
    $('#record_li_' + record_id + ' .formFooter .submit-lang').hide();
    $('#record_li_' + record_id + ' .formFooter #spin_button_create').show();
  });

  $('.alpha5_header').on('click', function(){
     $(this).next().toggle();
     if (($(this).attr('data-cond') == 'enabled')||(!$(this).attr('data-cond'))) {
         $(this).attr('data-cond', 'disabled');
         $(this).children('span').html('<i class="icon fas fa-angle-right"></i>');
         $(this).addClass("-active")
     } else {
         $(this).attr('data-cond', 'enabled');
         $(this).children('span').html('<i class="icon fas fa-angle-down"></i>');
         $(this).removeClass("-active")
     }
 });


  $('form.form-lang').ajaxForm({
    beforeSend: function () {
      // console.log(saving_lang_id);
      let language = $('#record_li_' + saving_lang_id + ' .-js-upload-language')
      let name = $('#record_li_' + saving_lang_id + ' .save-lang-file')[0].files[0].name

      language.removeClass('download').removeClass('load').removeClass('ready').removeClass('failed').addClass('load');
      $('#record_li_' + saving_lang_id + ' .-js-upload-language i').removeClass('fa-upload').removeClass('fa-spinner').removeClass('fa-spin').removeClass('fa-check').removeClass('fa-times').addClass('fa-spinner').addClass('fa-spin');

      language[0].setAttribute("title", `${name}`)
    },
    complete: function (xhr) {
      if (xhr.status == 404) {
        $('#record_li_' + saving_lang_id + ' .-js-upload-language').removeClass('download').removeClass('load').removeClass('ready').removeClass('failed').addClass('failed');
        $('#record_li_' + saving_lang_id + ' .-js-upload-language i').removeClass('fa-upload').removeClass('fa-spinner').removeClass('fa-spin').removeClass('fa-check').removeClass('fa-times').addClass('fa-times');
      } else {
        $('#record_li_' + saving_lang_id + ' .-js-upload-language').removeClass('download').removeClass('load').removeClass('ready').removeClass('failed').addClass('ready');
        $('#record_li_' + saving_lang_id + ' .-js-upload-language i').removeClass('fa-upload').removeClass('fa-spinner').removeClass('fa-spin').removeClass('fa-check').removeClass('fa-times').addClass('fa-check');

        if ($('#record_li_' + saving_lang_id + ' .localisation-form-lang .lang_name_id').val().length) {
          $('#record_li_' + saving_lang_id + ' .localisation-form-lang .submit-lang').removeClass('dsbld')
        }
      }
    }
  });


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

  const init = choicesInit(".lang-select-box", {
    searchEnabled: true,
    searchResultLimit: 9999,
    shouldSort: false,
    itemSelectText: '',
    noResultsText: Translate('alpha20_js/no_results'),
    noChoicesText: Translate('alpha20_js/no_variants')
  });

  init.map(element => {
    element.passedElement.element.addEventListener("search", (event) => {
      const liID = event.target.closest(".addGroup").id
      $(this).find(`#${liID} .select_nano`).nanoScroller({alwaysVisible: true});
    })
  })
});

function DeleteRecord(remove_id) {
  //посылаем запрос на удаление элемента
  if (remove_id) {
    let zone = $('#record_'+remove_id).data('zone');
    xajax_RemoveLang(remove_id, zone);
    HideRecordRow(remove_id);
  }
}



function HideEditableBlock(record_id) {
  if (record_id == 0) {
    $('#record_li_0.addingBlock').slideUp();
    $('.addingLocalisation').removeClass('dsbld');
    $('.cancelTop').hide();
    $('#record_li_' + record_id + ' .localisation-form-lang .lang_name_id').val('');
    $('#record_li_' + record_id + ' .localisation-form-lang .submit-lang').addClass('dsbld')
  } else {
    $('#record_li_' + record_id + ' .w_settings').slideUp();
    $('#record_li_' + record_id + '').find('.edit').removeClass('active');
  }
  $('#record_li_' + record_id + ' .-js-upload-language').removeClass('download').removeClass('load').removeClass('ready').removeClass('failed').addClass('download');
  $('#record_li_' + record_id + ' .-js-upload-language i').removeClass('fa-upload').removeClass('fa-spinner').removeClass('fa-spin').removeClass('fa-check').removeClass('fa-times').addClass('fa-upload');
  $('#record_li_' + record_id + ' .submit-lang-spinner').hide();
  $('#record_li_' + record_id + ' .submit-lang').show();
}

function AddNewLang(record_html, record_id, title, code, zone = 'support') {
  if ($('#record_li_' + record_id).length) {
    HideEditableBlock(record_id);
    $('#record_li_' + record_id + ' .client_date').html(record_html);
    $('#record_li_' + record_id + ' .t3').html(code + ' — ' + title);
    $('#record_li_' + record_id + ' a.edit_lang').attr('data-name', code + ' - ' + title);
  } else {
    if(zone == 'support')
    {
      $('#record_list_enabled').append(record_html);
    } else if(zone == 'client')
    {
      $('#client_record_list_enabled').append(record_html);
    }

    SortElements(false);
    HideEditableBlock(0);

    InitialSettings(record_id);

    const select = Array.from( document.querySelectorAll(`#record_li_${record_id} select`) );

    const init = choicesInit(select, {
      searchEnabled: true,
      searchResultLimit: 9999,
      shouldSort: false,
      itemSelectText: '',
      noResultsText: Translate('alpha20_js/no_results'),
      noChoicesText: Translate('alpha20_js/no_variants')
    });

    init[0].passedElement.element.addEventListener("search", (event) => {
      const liID = event.target.closest(".addGroup").id;
      $(`#${liID} .select_nano`).nanoScroller({alwaysVisible: true});
    });
  }
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
  let zone = $(el).data('zone');
  enableRecord(el, enable, enable_record_url, zone);
  var li_el = $(el).closest('li');
  var ul_el = $(el).closest('ul');

  if(zone == 'client')
  {
    if (enable) {
      $('#client_record_list_enabled').append(li_el);
    } else {
      $('#client_record_list_disabled').append(li_el);
    }
  } else {
    if (enable) {
      $('#record_list_enabled').append(li_el);
    } else {
      $('#record_list_disabled').append(li_el);
    }
  }

  SortElements(true);
}

function dialogListTranslated(lang_id) {
  var contents = $('#localisation-lang_translated .content_modal');
  var default_tr = contents.find('div.tr_default');
  contents.find('>div:not(.tr_default)').remove();
  for (var i in translated_list) {
    var data = translated_list[i];
    var new_tr = default_tr.clone();
    new_tr.show().removeClass('tr_default');
    new_tr.find('.title_ a').html(data['name']);
    new_tr.find('.title_ a').attr('href', data['url']);

    if (data['data'][lang_id]) {
      new_tr.find('.translated').show();
      new_tr.find('.notranslated').hide();
    } else {
      new_tr.find('.translated').hide();
      new_tr.find('.notranslated').show();

    }
    contents.append(new_tr);
  }


  $.magnificPopup.open({
    items: {
      src: '#localisation-lang_translated'
    },
    type: 'inline',
    midClick: true,
    closeBtnInside: true,
    tClose: Translate('cases_custom_fields_js/close'),
    closeMarkup: '<div title="%title%" class="modal-close mfp-close"><i class="icon fas fa-times"></i></div>'
  });

  return false;
}

function AddEngLang(el) {
  $('#record_li_0 .localisation-form-lang .submit-lang').hide();
  $('#record_li_0 .localisation-form-lang #spin_button_create').show();

  xajax_AddEngLang('support');
}

function AddAkEngLang(el) {
  $("#spin_lazy").show();
  xajax_AddEngLang('client');
}
