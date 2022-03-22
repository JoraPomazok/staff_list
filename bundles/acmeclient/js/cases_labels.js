var start_date_picker;
var b_init_picker = false;

$(document).ready(function () {

  const submit = document.querySelector("#add_label")
  submit ? submit.addEventListener("click", () => ShowSpinButton('add_label')) : null

  $('#edit_label').click(function (e) {
    const width = this.offsetWidth - 1 //153
    const height = this.offsetHeight //153
    $(this).html('<i class="fa fa-spinner fa-spin" style="height: min-content;"></i>').addClass('disabled');
    this.classList.add('-spin-button');

    this.setAttribute("style", `
        width:${width}px;
        height:${height}px;
        padding:0;
        display: flex;
        justify-content: center;
        align-items: center;
      `)

    e.preventDefault();
  })
    $(document).on('click', '#show_more_records', function () {
        // $('.select-box').attr('disabled', 'disabled');
        // $('div.datepicker input#datepicker_').attr('disabled', 'disabled');
        // $('.select-box').trigger('chosen:updated');
        // var s_d = $('#start_date_value').val();
        // var e_d = $('#end_date_value').val();
        xajax_ChangeData(label_id,$('#labels_list_cases tr').length);
    });

    $('.tagSwitch a:first-child').click(function () {
    $('.tagSwitch a').removeClass('active');
    $(this).addClass('active');
    $('.t_tag2').addClass('hidden');
    $('.t_tag1').removeClass('hidden');
    $('.tag_tab_1').show();
    $('.tag_tab_2').hide();
    return false;
  });
  $('.tagSwitch a:last-child').click(function () {
    $('.tagSwitch a').removeClass('active');
    $('.tagSwitch a').removeClass('active');
    $(this).addClass('active');
    $('.t_tag1').addClass('hidden');
    $('.t_tag2').removeClass('hidden');
    $('.tag_tab_2').show();
    $('.tag_tab_1').hide();
    return false;
  });

  //  Change name by lang
   $(document).on('click', '.label_titles .change_form', function(e){
     e.preventDefault();
     $(this).parents('.label_titles').find('.change_form').removeClass('active');
     $(this).addClass('active');
     let lang_id  = $(this).data('lang_id');
     $(this).parents('.label_titles').find('.label_title').hide();
     $(this).parents('.label_titles').find('#title_'+lang_id).show();
   });

  // Отслеживание значений выпадающего списка
  // $('.select-box').chosen({
  //     // disable_search: true,
  //     width: '221px'
  // });

  // mySelect - одиночный селект (без мультывыбора) START
  (function () {
    const elements = Array.from(document.querySelectorAll('.select-box'))

    if (!elements) { return }

    const instances = elements.map((element) => {
      let init = new Choices(element, {
        searchEnabled: true,
        searchResultLimit: 9999,
        noResultsText: Translate('cases_labels_js/not_found'),
        shouldSort: false,
        itemSelectText: ''
      })

      element.addEventListener("search", () => {
        $(".select_nano").nanoScroller({alwaysVisible: true});
      })

      element.addEventListener('choice', function(event) {
        f_period = event.detail.choice.value;
        $('input.datepicker').hide();
        if (f_period === '14') {
          $(this).next().hide();
          $('div.datepicker input#datepicker_').val('... — ...');
          $('div.datepicker').show();
          InitPicker(true);
        } else if (f_period === '13') {
          $(this).next().hide();
          $('div.datepicker input#datepicker_').val('...');
          $('div.datepicker').show();
          InitPicker(true);
        } else {
          GetData('period');
        }
      })
    })
  })();

// mySelect - одиночный селект (без мультывыбора) END

  $(document).on('click', '.datepicker i', function () {
    $('div.datepicker').hide();
    $('#f_period_chosen').show();
    $('#f_period_chosen').parent().show();
    f_period = 'all';
    $('#f_period').val(f_period).trigger('chosen:updated');
    $('div.datepicker input#datepicker_').val('... — ...');
    $('#start_date_value').val('');
    $('#end_date_value').val('');
    GetData('period');
  });

  if (!$('div.datepicker input#datepicker_').val()) { return }

  if ($('div.datepicker input#datepicker_').val().length) {
    var tmp = $('div.datepicker input#datepicker_').val();
    InitPicker();
    $('div.datepicker input#datepicker_').val(tmp)
  }
  InitNanoScrolls("");

})

function ClickDeleteRecord(el) {
  remove_id = $(el).attr('rel').split('_')[1];
  if (remove_id) {
    $('#removeRow').val(remove_id);
    $('#deleteRow').togglePopup();
  }
}

function DeleteRecord(remove_id) {
  window.location.href = remove_record_url + remove_id;
}
function GetData(type) {
  $('.ico_unload_export').hide();
  $('.select-box').attr('disabled', 'disabled');
  $('div.datepicker input#datepicker_').attr('disabled', 'disabled');
  $('.select-box').trigger('chosen:updated');
  $('#f_' + type).next().next().next('.icon').show();
  var s_d = $('#start_date_value').val();
  var e_d = $('#end_date_value').val();
  // xajax_ChangeData(f_period,s_d,e_d,$('input[name=search_title]').val());
  window.location.href = labels_main_url + '?f_period=' + f_period + '&s_d=' + s_d + '&e_d=' + e_d + '&s=' + $('input[name=search_title]').val();
}
function InitPicker(b_show) {
  if (b_init_picker) {
    start_date_picker.show();
    return;
  }
  start_date_picker = new Pikaday(
    {
      field: document.getElementById('datepicker_'),
      format: 'DD MMM YYYY',
      firstDay: 1,
      minDate: new Date('2000-01-01'),
      maxDate: new Date(),
      defaultDate: Date.now(),
      // yearRange: [2000, 2020],
      onSelect: function () {
        if (f_period == 14) {
          if ($('#start_date_value').val().length < 2) {
            $('#start_date_value').val(this.getMoment().format('DD.MM.YYYY'));
            $('div.datepicker input#datepicker_').val(this.getMoment().format('DD.MM.YYYY') + ' — ...');
            // console.log(this.getMoment().subtract(6,'months').format('DD-MM-YYYY'));
            var self = this;
            setTimeout(function () {
              // console.log(self.getMoment().subtract(6, 'months').format('DD-MM-YYYY'),new Date(self.getMoment().subtract(6, 'months').format('YYYY-MM-DD')));
              start_date_picker.setMinDate(new Date(self.getMoment().format('YYYY-MM-DD')))
              start_date_picker.setMaxDate(new Date(self.getMoment().add(6, 'months').format('YYYY-MM-DD')));
              start_date_picker.show();
            }, 500);
          }
          else {
            $('#end_date_value').val(this.getMoment().format('DD.MM.YYYY'));
            $('div.datepicker input#datepicker_').val($('#start_date_value').val() + ' — ' + this.getMoment().format('DD.MM.YYYY'));
            GetData('period');
          }
        }
        else {
          $('#start_date_value').val(this.getMoment().format('DD.MM.YYYY'));
          GetData('period');
        }
      },
      onOpen: function () {
        if (f_period == 8 && $('#end_date_value').val().length > 1) {
          $('div.datepicker input#datepicker_').val('... — ...');
          $('#start_date_value').val('');
          $('#end_date_value').val('');
        }
        else if (f_period == 7) {
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
  b_init_picker = true;
  if (b_show) {
    start_date_picker.show();
  }

}
