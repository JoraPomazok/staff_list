var client_custom_css;
var client_custom_js;

$(document).ready(function () {
  $('.upload-form').ajaxForm({
    complete: function (xhr) {
      response = xhr.responseText;
      if (response) {
        response = JSON.parse(response);
        img_id = response.img_id;

        HideSpinButton('button_update');
        if (response.message_code) {
          ShowXajaxNotification(response.message_code);
        }

        if (response.status == 'success') {
          $('#' + img_id).each(function () {
            $(this).attr('src', response.thumbnail);
          })
        }

        $('#logo_pic').val('');
        $('#favicon_pic').val('');
        $('#favicon_ak_pic').val('');
        $('#favicon_ac_pic').val('');
      }
    }
  });
  $('input[type=file]').change(function () {
    ShowSpinButton('button_update');
    $(this).closest('form').trigger('submit');
  });

  $('#button_update').click(function (e) {
    e.preventDefault();
    ShowSpinButton('button_update');
    var clients_domain_name = $('#clients_domain_name').val();
    var client_redirect_url = $('#client_redirect_url').val();
    var client_custom_css_ = client_custom_css.getValue();
    var client_custom_js_ = client_custom_js.getValue();

    var title = {};
    $('input[id^=sc_title_]').each(function () {
      var lang_id = $(this).attr('data-lang');
      title[lang_id] = $(this).val();
    });
    var terms = $("#form_0").serializeJSON()['terms'];

    var time_zone = $('#form_tz_info').val();
    var widget_id = $('#form_widget').val();
    var time_format = $('input:checked[name=time_format]').val();
    var date_format = $('input:checked[name=date_format]').val();
    var support_scale = $('select[name=support_scale]').val();
    var support_container_width = $('select[name=support_container_width]').val();

    var menu = $("#form_0").serializeJSON()['menu'];

    xajax_UpdateSettings(clients_domain_name, title, time_zone, time_format, date_format, client_redirect_url, client_custom_css_, client_custom_js_, widget_id, menu, terms, support_scale, support_container_width);
  });
  $(document).on('click', '.change_form', function () {
    let lang_id = $(this).attr('data-lang') || $(this).attr('data-lang_id');
    let parent = $(this).closest('.list_lang_form');
    $(this).closest(".menu_fields_group").find('a.change_form').removeClass('active');
    $(this).closest(".list_lang_form").find('a.change_form').removeClass('active');
    $(this).addClass('active');

    if (parent.hasClass('js_form_menu')) {
      parent.closest('.menu_fields_group').find('input[class^=js_sc_menu_]').hide();
      parent.closest('.menu_fields_group').find('input.js_sc_menu_' + lang_id).show();

    } else {
      parent.closest(".-js-lang-wrap").find('textarea,input').hide();
      parent.closest(".-js-lang-wrap").find('textarea[data-lang=' + lang_id + '],input[data-lang=' + lang_id + ']').show();
    }
    return false;
  });
  client_custom_css = CodeMirror.fromTextArea($('#client_custom_css')[0], {
    mode: "css",
    scrollbarStyle: "simple",
    lineNumbers: true,
  });
  client_custom_js = CodeMirror.fromTextArea($('#client_custom_js')[0], {
    scrollbarStyle: "simple",
    mode: "htmlmixed",
    lineNumbers: true,
  });

  $('.menu_fields').sortable({
    items: 'li',
    handle: '.-js-move-item',
    cursor: 'ns-resize',
  });

  $('.js_add_menu_field').on('click', function (e) {
    e.preventDefault();

    let newField = $(this).prev().find('li.hidden').clone();
    let uid = 'm' + (Math.floor((Math.random() * 1000) + 100));
    $(newField).find('input').each(function () {
      this.id = this.id.replace(/\{default\}/g, uid);
      this.name = this.name.replace(/\{default\}/g, uid);
    })

    $(newField).removeClass('hidden').attr('id', 'menu_field_id_' + uid);
    $(newField).insertBefore($(this).prev().find('li.hidden'));

    $(newField).find('input').val('');
  });


  $(document).on('click', '.menu_fields .-js-remove-rule', function () {
    $(this).closest('li').remove();
  });
});
