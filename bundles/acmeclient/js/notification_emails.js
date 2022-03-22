$(document).ready(function () {
  $('form').submit(function () {
    $('textarea').each(function () {
      if ($(this)[0].id) {
        SyncRedactorCode($(this)[0].id);
      }
    })
  });
  
  $('.h_button a').click(function () { //When any link is clicked
    var tab_rel = $(this).attr('rel');
    if ($('.' + tab_rel + ':visible').length == 0) {
      var current_tab = $(this).closest('.gSettings .h_button').find('.active');
      current_tab.removeClass('active');
      $('.' + current_tab.attr('rel')).hide();
      
      $(this).addClass('active'); //Set clicked link class to active
      $('.' + tab_rel).show();
      SelectNano("");
      RedactorNano("");
      
      var notifications_common = 0;
      if (tab_rel == 'notifications_common') {
        notifications_common = 1;
      }
      $('#notifications_common').val(notifications_common);
    }
    return false;
  });
  
  init_email_replace_fields();
  
  $('textarea[id^=form_content_]').each(function () {
    CreateHtmlEditor(this.id, 295, '', true);
    if (!$(this).attr('b_star')) {
      $(this).parent().hide();
    }
  });
  
  $('.restore-default-email').click(function () {
    var email_id = $(this).attr('rel');
    if (email_id == 0) {
      var lang_id = $(this).closest("form").find('div.hourContent:visible a.change_form.active').attr('data-lang_id');
    } else {
      var lang_id = $(this).closest(".tab-content").find('a.change_form.active').attr('data-lang_id');
    }

    if (!lang_id) lang_id = 1; // RUS}

    var DefaultSubject = DefaultSubjects[lang_id] ? DefaultSubjects[lang_id] : DefaultSubjects[1];
    var DefaultContent = DefaultContents[lang_id] ? DefaultContents[lang_id] : DefaultContents[1];
    var DefaultFrom = DefaultFroms[lang_id] ? DefaultFroms[lang_id] : DefaultFroms[1];

    // если это тёмная тема то меняем цвет стандартного текста "Вернуть стандартное письмо"
    (function () {
      const theme = document.querySelector(".b_dark_theme .dark")
      if (theme)
        DefaultContent = DefaultContent.replace(/000/g,"d5d6d7")
    })();
    
    if ($('#form_subject_' + email_id + '_' + lang_id).val() != DefaultSubject) {
      $('#form_subject_' + email_id + '_' + lang_id).val(DefaultSubject);
    }
    if ($('#form_from_' + email_id + '_' + lang_id).val() != DefaultFrom) {
      $('#form_from_' + email_id + '_' + lang_id).val(DefaultFrom);
    }
    ClearRedactorContent('form_content_' + email_id + '_' + lang_id);
    SetRedactorCode('form_content_' + email_id + '_' + lang_id, DefaultContent);
    
    $('#b_default_form_content_' + email_id + '_' + lang_id).val(1);
    SelectNano("");
    RedactorNano("");
    return false;
  });
  $(document).on('click', '.change_form', function () {
    var lang_id = $(this).attr('data-lang_id');
    var tab_common = $('#notifications_common').val();
    if (tab_common == 1) {
      var mail_id = 0;
    } else {
      var mail_id = $(this).closest(".tab-content")[0].id.match(/[0-9]+$/).toString();
    }
    $(this).parent().find('a.change_form').removeClass('active');
    $(this).addClass('active');
    $('input[id^=form_subject_' + mail_id + ']').closest(".-js-show").addClass("-none");
    $('input#form_subject_' + mail_id + '_' + lang_id).closest(".-js-show").removeClass("-none");
    
    $('input[id^=form_from_' + mail_id + ']').closest(".-js-show").addClass("-none");
    $('input#form_from_' + mail_id + '_' + lang_id).closest(".-js-show").removeClass("-none");
    
    $('textarea[id^=form_content_' + mail_id + ']').parent().hide();
    $('textarea#form_content_' + mail_id + '_' + lang_id).parent().show();
    SelectNano("form");
    RedactorNano("form");
    
    return false;
  });
  init_nice_elements()
  initCustomScrollLabel("")
  SelectNano("");
  RedactorNano("");
	const submit = document.querySelector("#notification_emails")
	submit ? submit.addEventListener("click", () => ShowSpinButton('notification_emails')) : null;
});


function initCustomScrollLabel(start) {
  $(`${start} .pp_list_body:visible:not(.-js-no-nano)`).each( function(id, el) {
    var target = $(el);
    target.addClass('nano-content');
    target.wrap("<div class='nano list_nano'></div>")
    target.parent().nanoScroller({alwaysVisible: true})
  })
}