// JavaScript Document
var start_date_picker;
var f_period;
var f_staff;
var last_tstamp;
$(document).ready(function () {
  let select = choicesInit('.select-box', {searchEnabled: true, shouldSort: false, itemSelectText: ''});

  InitSocketPusher();
  blockStatus = 'enabled';

  // Отслеживание значений выпадающего списка
  $('.select-box').each(function () {
    $(this).val(-1);
  });
  // $('.select-box').chosen({
  //     // disable_search: true,
  //     width: '221px'
  // });

  // $('.time_settings .chosen-container:first').css('float', 'left');
  // $('.time_settings .icon:first').css({'float': 'left', 'margin-left': '10px'});
  // $('.time_settings .icon:last').css({'float': 'right', 'margin-right': '10px'});
  // $('.time_settings .chosen-container:last').css('float', 'right');
  $('#f_period').on('change', function () {
    f_period = this.value;
    $('input.datepicker').hide();
    if (f_period == 8) {
      // $(this).next().hide();
      $('div.datepicker input#datepicker_').val('... — ...');
      $('div.datepicker').show();
      start_date_picker.show();
    } else if (f_period == 7) {
      // $(this).next().hide();
      $('div.datepicker input#datepicker_').val('...');
      $('div.datepicker').show();
      start_date_picker.show();
    } else {
      GetData('period');
    }
  });
  $('#f_staff').on('change', function () {
    f_staff = this.value;
    GetData('staff');
  });

  $(document).on('click', '.datepicker i', function () {
    $('div.datepicker').hide();
    $('#f_period_chosen').show();
    f_period = -1;
    select[0].setChoiceByValue(`${f_period}`) // устанавливаем option "последние 24 часа"
    $('div.datepicker input#datepicker_').val('... — ...');
    $('#start_date_value').val('');
    $('#end_date_value').val('');
    GetData('period');
  });
  $(document).on('click', '#show_more_records', function () {
    $('.select-box').attr('disabled', 'disabled');
    $('div.datepicker input#datepicker_').attr('disabled', 'disabled');
    $('.select-box').trigger('chosen:updated');
    var s_d = $('#start_date_value').val();
    var e_d = $('#end_date_value').val();
    xajax_ChangeData(f_period, f_staff, s_d, e_d, last_tstamp);
  });
  $(document).on('click', '.ico_unload_export', function () {
      if($(this).hasClass('disabled'))
      {
          return false;
      }
    var s_d = $('#start_date_value').val();
    var e_d = $('#end_date_value').val();
    var os = (navigator.userAgent.indexOf("Windows") != -1) ? 'win' : 'unix';

    // if([1,2,7].indexOf(parseInt(f_period)) == -1)
    // {
    //     window.b_running_cases_export = true;
    //     AddNotification(
    //         'Экспорт ленты активности может занять какое-то время. Мы уведомим вас, когда операция будет завершена.',
    //         'warning',
    //         'ADD_EXPORT_QUEUE');
    // }
    $.ajax('/admin/team/staffs_activities/export/' + f_staff + '_' + f_period + '_' + (s_d.length ? s_d.replace(/\./g, '-') : '0') + '_' + (e_d.length ? e_d.replace(/\./g, '-') : '0') + '.csv?os=' + os)
        .done(function( data ) {
            if (data.queue)
            {
                window.b_running_export = true;
                AddNotification(
                    Translate('staffs_activities_js/export_wait'),
                    'warning',
                    'ADD_EXPORT_QUEUE');
                CheckRunningExport()
            }
            if(data.file)
            {
                window.location = data.file
            }
        });
  });
    let d = new Date();
    d.setFullYear((new Date()).getFullYear() - 1);

    start_date_picker = new Pikaday(
    {
      field: document.getElementById('datepicker_'),
      format: 'DD MMM YYYY',
      firstDay: 1,
      minDate: d,
      maxDate: new Date(),
      // yearRange: [2000, 2020],
      onSelect: function () {
        if (f_period == 8) {
          if ($('#start_date_value').val().length < 2) {
            $('#start_date_value').val(this.getMoment().format('DD.MM.YYYY'));
            $('div.datepicker input#datepicker_').val(this.getMoment().format('DD.MM.YYYY') + ' — ...');
            setTimeout(function () {
              start_date_picker.show();
            }, 500);
          } else {
            $('#end_date_value').val(this.getMoment().format('DD.MM.YYYY'));
            $('div.datepicker input#datepicker_').val($('#start_date_value').val() + ' — ' + this.getMoment().format('DD.MM.YYYY'));
            GetData('period');
          }
        } else {
          $('#start_date_value').val(this.getMoment().format('DD.MM.YYYY'));
          GetData('period');
        }
      },
      onOpen: function () {
        if (f_period == 8 && $('#end_date_value').val().length > 1) {
          $('div.datepicker input#datepicker_').val('... — ...');
          $('#start_date_value').val('');
          $('#end_date_value').val('');
        } else if (f_period == 7) {
          $('div.datepicker input#datepicker_').val('...');
          $('#start_date_value').val('');
          $('#end_date_value').val('');
        }
        $(this.el).css({
          'left': $('div.datepicker').offset().left + 'px',
          'top': ($('div.datepicker').offset().top + 35) + 'px'
        });
      }
    });
  setInterval(function () {
    xajax_ActivitiesPing(f_staff);
  }, 60 * 60 * 1000);
  InitNanoScrolls('')
  CheckRunningExport();
});

function HideSpinIcon() {
  $('.select-box').removeAttr('disabled');
  $('div.datepicker input#datepicker_').removeAttr('disabled');
  $('.select-box').trigger('chosen:updated');
  $('.time_settings .icon').hide();
  if (f_period == -1) {
    $('.ico_unload_export').hide();
  } else {
    $('.ico_unload_export').show();
  }
}

function GetData(type) {
  $('.ico_unload_export').hide();
  $('#f_' + type).closest(".time_settings").find(".icon-spin").show();
  $('.select-box').attr('disabled', 'disabled');
  $('div.datepicker input#datepicker_').attr('disabled', 'disabled');
  $('.select-box').trigger('chosen:updated');


  var s_d = $('#start_date_value').val();
  var e_d = $('#end_date_value').val();
  xajax_ChangeData(f_period, f_staff, s_d, e_d);
}
function CheckRunningExport()
{
    if (window.b_running_export )
    {
        $('.ico_unload_export').addClass('disabled')
        .addClass('omni_custom_tooltip')
        .addClass('omni_custom_tooltip_export');
    }
    else
    {
        $('.ico_unload_export').removeClass('disabled')
        .removeClass('omni_custom_tooltip');
    }

}
function op_ExportStaffActivitiesReady(msg)
{
    $('#ADD_EXPORT_QUEUE').hide();
    AddNotification(
        Translate('staffs_activites_c/export_finish')+': <a href="'+msg.file+'">'+Translate('rmq_export_cases_command/download_file')+'</a>',
        '',
        'SUCCESS_CASES_EXPORT');
    b_running_export = false;
    CheckRunningExport()

}
