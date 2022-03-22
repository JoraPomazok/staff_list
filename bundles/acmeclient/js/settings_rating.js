$(document).ready(function () {

  $('input[name=rating_type]').on('click', function () {
    $('.generalSettings.rating input:disabled').removeAttr('disabled');
    $('div[id^=rating_access_all_notes]').hide();
    $('#rating_access_only_notes').hide();
    if ($('input[name=rating_type]:checked').val() == 2) {
      $('#rating_access_all_notes_' + $('select[name=type_send_rating]').val()).show();
    } else {
      $('#rating_access_only_notes').show();
    }
    updateTextTip();

  });
  $('select').on('change', function () {
    // if (this.matches(".-js-multipleSelect-special")) return
    $('.generalSettings.rating input:disabled').removeAttr('disabled');
    $(`div[id^="${this.name}"]`).hide()
    $(`div[id="${this.name}_${+this.value}"]`).show();
    RedactorNano("");
    SelectNano("");
  });

  $('#button_update').click(function () {
    ShowSpinButton('button_update');
    UpdateRating();
  });

  $(document).on('click', '.change_form', function () {
    var lang_id = $(this).attr('data-lang_id');
    var record_id = 0;//$(this).attr('data-record_id');
    $(this).parent().find('a').removeClass('active');
    $(this).addClass('active');

    $(this).parents('label').find('input[id*=_' + record_id + '_]').hide();
    $(this).parents('label').find('input[id$=_' + record_id + '_' + lang_id + ']').show();

    $(this).parents('label').find('textarea[id^=email_rating_text_' + record_id + ']').parent().hide();
    $(this).parents('label').find('textarea#email_rating_text_' + record_id + '_' + lang_id).parent().show();

    RedactorNano("");
    SelectNano("");
    return false;
  });
  $('.ck_editor-textarea').each(function () {
    var textarea_id = $(this).attr('id');
    if (!GetRedactorInstance(textarea_id)) {
      CreateHtmlEditor(textarea_id, 94, false, true, false, false);
      if (!$(this).attr('data-star')) {
        $(this).parent().hide();
      }
      // $('input[type=hidden]').focus();
    }
  });
  RedactorNano("");

  const main = document.querySelector("main")

  main.addEventListener("click", (event) => {
    if (event.target.closest(".onOff")) {
      RedactorNano("");
      SelectNano("");
    }
  })
  init_nice_elements(); // инитим селекты
  SelectNano("");
});

function onOff(el, enable) {
  var li_item = $(el).parents('li');
  $('.generalSettings.rating input:disabled').removeAttr('disabled');
  if (enable == 1) {
    li_item.addClass('active').removeClass('fllw_off');
    li_item.find('.icon').addClass('fa-check').removeClass('fa-times');
    //$('#rating_access').slideDown('slow');
    if (li_item[0].id == "record_li_rating_chat") {
      $('#block_rating_chat_off').hide();
      $('.block_rating_chat_on').show();
    } else {
      $('#block_rating_off').hide();
      $('#block_rating_on').show();
      $('#block_rating_settings').show();
      init_nice_elements('#block_rating_settings')

    }
    $('#rating_access').show();
  } else {
    li_item.removeClass('active').addClass('fllw_off');
    li_item.find('.icon').removeClass('fa-check').addClass('fa-times');
    if (li_item[0].id == "record_li_rating_chat") {
      $('#block_rating_chat_off').show();
      $('.block_rating_chat_on').hide();
    } else {
      $('#block_rating_off').show();
      $('#block_rating_on').hide();
      $('#block_rating_settings').hide();
    }
    if (!$('li[id^=record_li_rating].active').length) {
      $('#rating_access').hide();
    }
  }
  updateTextTip();
}

function UpdateRating() {
  $('input[name=rating_on]').val($('#record_li_rating').hasClass('active') ? 1 : 0);
  $('input[name=rating_chat_on]').val($('#record_li_rating_chat').hasClass('active') ? 1 : 0);
  $('#rating_update_form').submit();
}

function activeButt() {
  $('.generalSettings.rating input:disabled').removeAttr('disabled');

}