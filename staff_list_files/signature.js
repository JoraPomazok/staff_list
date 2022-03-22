$(document).ready(function () {
  InitSignatureRedactor(0);
  $(document).on('click', '.pp_action', function () {
    var closes_letters_content = $(this).closest('.staff-signature');
    var add_top = 0;
    var letters_content_pp_list = closes_letters_content.find('.pp_list');

    var pos_h = closes_letters_content.height();
    var pos_b = closes_letters_content.find('.text').position().top + closes_letters_content.find('.text').height();
    letters_content_pp_list.css('bottom', add_top + pos_h + (-pos_b) + 1 + 'px').show();

    return false;
  });

  $(document).on('click', '.pp_list .close', function () {
    $(this).closest('.pp_list').hide();
    return false;
  });

  $(document).on('click', '.pp_list_item a', function (e) {
    e.preventDefault();
    var element_rel = $(this).parent().attr('rel');
    var variable = $(this).attr('rel');
    var parent = $(this).parents('.staff-signature');

    if (parent.find('textarea[id^=signature_chat_' + element_rel + ']').length) {
      if (parent.find('.redactor-layer').length) {
        var focus_element_id = $('textarea[id^=signature_chat_' + element_rel + ']').parent().filter(':visible').find('textarea')[0].id;

        if (IsSetRedactorInstance(focus_element_id)) {
          InsertRedactorText(focus_element_id, variable);
        }
      } else {
        $('textarea[id^=signature_chat_' + element_rel + ']').each(function (index, el) {
          if ($(el).css('display') !== 'none') {
            insertTextAtCursor(el, variable);
            // var textareaText = $(el).val();

            // $(el).val(textareaText + variable);
          }
        });
      }

      $(this).closest('.pp_list').hide();
    } else {
      var focus_element_id = $('textarea[id^=signature_' + element_rel + ']').parent().filter(':visible').find('textarea')[0].id;

      if (IsSetRedactorInstance(focus_element_id)) {
        InsertRedactorText(focus_element_id, variable);
      }

      $(this).closest('.pp_list').hide();
    }


    return false;
  });
});

function InitSignatureRedactor(staff_id, b_updated) {
  //dru: РЅРµ СѓРІРµСЂРµРЅ С‡С‚Рѕ СЌС‚Рѕ С‚РѕР»СЊРєРѕ РІ СЃРѕР·РґР°РЅРёРё СЃРѕС‚СЂСѓРґРЅРёРєРѕРІ, РїРѕСЌС‚РѕРјСѓ РІ
  //СЃРѕС‚СЂСѓРґРЅРёРєР°С… РґРѕР±Р°РІРёР» data-staff
  var g_id = staff_id == 0 ? 'new_record' : 'record_li_' + staff_id;
  $('#' + g_id + ' .ck_editor-textarea').each(function () {
    var textarea_id = $(this).attr('id');
    var height = ($(this).attr('data-staff') ? 134 : 72);

    if (!GetRedactorInstance(textarea_id) || b_updated) {
      CreateHtmlEditor(textarea_id, height, false, false, true, false, false
        , [
          'format', 'fontsize', 'fontcolor', 'background_color',
          'bold', 'italic', 'underline', 'ul', 'ol', 'link', 'image', 'line', 'html']);
      if (!$(this).attr('data-star')) {
        $(this).parent().hide();
      }
    }
  });
}