$(document).ready(function () {
  // let select;
  if (typeof no_stat !== "undefined" && no_stat == true) {
    NoInformation('no_stat');
  } else {

    if (currentList.length == 0) {
      NoInformation('no_info');
    } else {
      $('.leader_table').show();
      defaultSortListTestOptimization();
    }

    // select = choicesInit('.select-box', {searchEnabled: false, shouldSort: false, itemSelectText: ''});

    $('.select-box').on('change', function () {
      $('.empty, .empty .no_stat, .empty .no_info').hide();
      $('.icon-spinner').show();

      // console.log(this);
      var f_period = $('#f_period').val();
      var f_staff = $('#f_staff').val();

      $('input.datepicker').hide();
      if (f_period == 8 && this.closest(".js_select_period")) {
        // $(this).next().hide();
        $('div.datepicker input#datepicker_').val('... — ...');
        $('div.datepicker').show();
        start_date_picker.show();
        $('.icon-spinner').hide()
      } else if (f_period == 7 && this.closest(".js_select_period")) {
        // $(this).next().hide();
        $('div.datepicker input#datepicker_').val('...');
        $('div.datepicker').show();
        start_date_picker.show();
        $('.icon-spinner').hide()
      } else {
        // console.log(f_period, f_staff, $('#start_date_value').val())
        // xajax_ChangeStatData(f_period, f_staff);

        if (f_period == 8) {
          if ($('#start_date_value').val().length >= 2) {
            xajax_ChangeStatData(f_period + ':' + $('#start_date_value').val() + ':' + $('#end_date_value').val(), f_staff);
          }
        } else if (f_period == 7) {
          xajax_ChangeStatData(f_period + ':' + $('#start_date_value').val(), f_staff);
        } else {
          xajax_ChangeStatData(f_period, f_staff);
        }
      }
    });

    $(document).on('click', '.js_worker_board_by_vals thead th .sort_by_val', function (e) {
      if ($(this).parents('th').hasClass('active')) {
        $(this).parents('th').removeClass('active');
        $(this).parents('th').find('.no_sort').hide();
        restoreBorders($(this).parents('th'));
        defaultSortList();
      } else {
        restoreAllBorders();
        $(this).parents('th').siblings().removeClass('active');
        $(this).parents('th').addClass('active');
        $(this).parents('th').find('.no_sort').css('display', 'flex');
        // setBlueBorders($(this).parents('th'));
        var place = $(this).parents('th').index();
        if ((place == 2) || (place == 6)) {
          sortListMin(place);
        } else {
          sortListMax(place);
        }
      }
    });

    $(document).on('click', '.js_worker_board_by_vals thead th .sort_by_group', function (e) {
      SortByGroup($(this).parents('th').index(), $(this).parents('th').attr('data-key'))
    });
    $(document).on('click', '.worker_board thead th .no_sort2', function (e) {
      $('.leader_table').show();
      $('.leader_table_by_group').hide();
    });
    $(document).on('click', '.worker_board thead th .no_sort', function (e) {
      $('.leader_table').show();
      $('.leader_table_by_group').hide();
      $(this).hide();
      $(this).parents('th').removeClass('active');
      defaultSortListTestOptimization();
      setBlueBorders($(this));
    });

    $(document).on('mouseenter', '.js_worker_board_by_vals thead th.active', function (e) {
      $(this).find('.no_sort').css('display', 'flex');
      restoreBorders($(this));
    });
    $(document).on('mouseleave', '.js_worker_board_by_vals thead th.active', function (e) {
      $(this).find('.no_sort').hide();
      setBlueBorders($(this));
    });
    PrepareByFilter(filter);
  }

  $(document).on('click', '.datepicker i', function () {
    $('div.datepicker').hide();
    $('#f_period_chosen').show();
    $('.js_select_period').show();

    f_period = 'last_24';

    select[0].setChoiceByValue(`${f_period}`); // устанавливаем option "последние 24 часа"

    $('div.datepicker input#datepicker_').val('... — ...');
    $('#start_date_value').val('');
    $('#end_date_value').val('');
    xajax_ChangeStatData($('#f_period').val(), $('#f_staff').val());
  });
  start_date_picker = new Pikaday(
    {
      field: document.getElementById('datepicker_'),
      format: 'DD MMM YYYY',
      firstDay: 1,
      minDate: new Date('2000-01-01'),
      maxDate: new Date(((new Date()).getFullYear()) + '-12-31'),
      yearRange: [2000, (new Date()).getFullYear()],
      onSelect: function () {
        $('.empty, .empty .no_stat, .empty .no_info').hide();
        if ($('#f_period').val() == 8) {
          if ($('#start_date_value').val().length < 2) {
            $('#start_date_value').val(this.getMoment().format('DD.MM.YYYY'));
            $('div.datepicker input#datepicker_').val(this.getMoment().format('DD.MM.YYYY') + ' — ...');
            self = this;
            setTimeout(function () {
              start_date_picker.setMinDate(new Date(self.getMoment().subtract(($('#f_period option[value=year]').length ? 366 : 92), 'days').format('YYYY-MM-DD')));
              start_date_picker.setMaxDate(new Date(self.getMoment().add(($('#f_period option[value=year]').length ? 366 : 92), 'days').format('YYYY-MM-DD')));

              start_date_picker.show();
            }, 500);
          } else {
            $('#end_date_value').val(this.getMoment().format('DD.MM.YYYY'));
            $('div.datepicker input#datepicker_').val($('#start_date_value').val() + ' — ' + this.getMoment().format('DD.MM.YYYY'));
            xajax_ChangeStatData('8:' + $('#start_date_value').val() + ':' + $('#end_date_value').val(), $('#f_staff').val());
          }
        } else {
          $('#start_date_value').val(this.getMoment().format('DD.MM.YYYY'));
          xajax_ChangeStatData('7:' + $('#start_date_value').val(), $('#f_staff').val());
        }
      },
      onOpen: function () {
        if ($('#f_period').val() == 8 && $('#end_date_value').val().length > 1) {
          $('div.datepicker input#datepicker_').val('... — ...');
          $('#start_date_value').val('');
          $('#end_date_value').val('');
        } else if ($('#f_period').val() == 7) {
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
  setTimeout(function () {
    $('div.datepicker input#datepicker_').val($('div.datepicker input#datepicker_').attr('data-value'));
  }, 100);
  InitNanoScrolls('');
  initScroll();
});

// Построение данных таблицы
function TableData(list, b_sort) {
  if (!list) {
    list = currentList
  }
  $('.leader_table').show();
  $('.js_worker_board_by_vals tbody').html('');
  // $('.js_worker_board_by_vals thead').find('th').removeClass('active');
  restoreAllBorders();
  createTableList(list);
  countSumList();
  if (list.length > 1) {
    setBests();
  }
  if (!b_sort) {
    defaultSortList();
  }
  convertFormatsHead();
  convertFormatsBody();
}

function createTableList(array, table) {
  if (!table) {
    table = '.js_worker_board_by_vals';
  }
  var num_col = 0;
  $(table + ' thead th').each(function () {
    num_col++;
  });
  var g_content = '';
  for (var i = 0; i < array.length; i++) {
    var _i = '';
    var t = array[i][0];
    if (array[i][0].match(/^\[[0-9]+\]/)) {
      _i = array[i][0].match(/^\[([0-9]+)\]/)[1].toString();
      t = array[i][0].replace(/^\[[0-9]+\]/, '')
    }
    var content = '';
    for (var j = 1; j < array[i].length; j++) {
      content += '<td>' + array[i][j] + '</td>';
    }

    g_content += '<tr class="name" data-id="' + _i + '"><td colspan="' + num_col + '">' + t + '</td></tr>';
    g_content += '<tr class="values" data-id="' + _i + '">' + content + '</tr>';
  }
  $(table + ' tbody').append(g_content);
}

function countSumList() {
  $('.js_worker_board_by_vals thead th h5').eq(0).text(sumData.all_cases);
  $('.js_worker_board_by_vals thead th h5').eq(1).text(sumData.with_first);
  $('.js_worker_board_by_vals thead th h5').eq(2).text(sumData.speed_first);
  $('.js_worker_board_by_vals thead th h5').eq(3).text(sumData.all_answers);
  $('.js_worker_board_by_vals thead th h5').eq(4).text(sumData.cnt_notes);
  $('.js_worker_board_by_vals thead th h5').eq(5).text(sumData.case_closed);
  $('.js_worker_board_by_vals thead th h5').eq(6).text(sumData.speed_closed);
  $('.js_worker_board_by_vals thead th h5').eq(7).text(sumData.percent_notes);
}

function setBests() {
  var verticalArray = [[], [], [], [], [], [], [], []];
  $('.js_worker_board_by_vals tbody .values').each(function (index, element) {
    $(element).find('td').each(function (index, element) {
      if (($(element).text() != 0 && index != 7) || ($(element).text() != '-' && index == 7)) {
        verticalArray[index].push($(element).text());
      }
    });
  });
  for (var i = 0; i < 8; i++) {
    if (verticalArray[i].length > 1) {
      if ((i == 2) || (i == 6)) {
        // чем меньше, тем лучше
        var worst = Math.max.apply(0, verticalArray[i]);
        var best = Math.min.apply(0, verticalArray[i]);
      } else {
        // чем больше, тем лучше
        var best = Math.max.apply(0, verticalArray[i]);
        var worst = Math.min.apply(0, verticalArray[i]);
      }
      $('.js_worker_board_by_vals tbody .values').each(function (index, element) {
        if ($(element).find('td').eq(i).text() == best) $(element).find('td').eq(i).addClass('best');
        if ($(element).find('td').eq(i).text() == worst) $(element).find('td').eq(i).addClass('worst');
      });
    }
  }
}

function defaultSortList() {
  return defaultSortListTestOptimization();

  var array_t = [], array_b = [];
  var counter_t = 0, counter_b = 0, cnt_t_max = 0, cnt_t_min = 0, cnt_b_max = 0, cnt_b_min = 0;
  for (var i = 0; i < $('.js_worker_board_by_vals tbody .values').length; i++) {
    for (var j = 0; j < $('.js_worker_board_by_vals tbody .values').length - 1; j++) {
      array_t = [];
      array_b = [];
      $('.js_worker_board_by_vals tbody .values').eq(j).find('td').each(function (index, element) {
        if ($(element).text() == '-') {
          array_t.push(0);
        } else {
          array_t.push(parseInt($(element).text()));
        }
      });
      $('.js_worker_board_by_vals tbody .values').eq(j + 1).find('td').each(function (index, element) {
        if ($(element).text() == '-') {
          array_b.push(0);
        } else {
          array_b.push(parseInt($(element).text()));
        }
      });

      counter_t = 0, counter_b = 0, cnt_t_max = 0, cnt_t_min = 0, cnt_b_max = 0, cnt_b_min = 0;
      if (summary(array_t) > 0 || summary(array_b) > 0) {
        for (var a = 0; a < array_t.length; a++) {
          if (a == 2 || a == 6) {
            if (array_t[a] > 0 && (array_t[a] < array_b[a] || array_b[a] == 0)) {
              counter_t++;
              cnt_t_min = cnt_t_min + array_t[a];
            }
            if (array_b[a] > 0 && (array_t[a] > array_b[a] || array_t[a] == 0)) {
              counter_b++;
              cnt_b_min = cnt_b_min + array_b[a];
            }
          } else {
            if (array_t[a] > 0 && (array_t[a] > array_b[a] || array_b[a] == 0)) {
              counter_t++;
              cnt_t_max = cnt_t_max + array_t[a];
            }
            if (array_b[a] > 0 && (array_t[a] < array_b[a] || array_t[a] == 0)) {
              counter_b++;
              cnt_b_max = cnt_b_max + array_b[a];
            }
          }
        }
      }
      if ((counter_b > counter_t) || (counter_b == counter_t && cnt_b_min < cnt_t_min && cnt_b_max > cnt_t_max)) {
        $('.js_worker_board_by_vals tbody .name').eq(j).before($('.js_worker_board_by_vals tbody .values').eq(j + 1));
        $('.js_worker_board_by_vals tbody .values').eq(j).before($('.js_worker_board_by_vals tbody .name').eq(j + 1));
      }
    }
  }
}

function defaultSortListTestOptimization() {
  deconvertFormats();
  console.time('stat_sort');
  var sort_currentList = currentList;
  var array_t = [], array_b = [];
  var counter_t = 0, counter_b = 0, cnt_t_max = 0, cnt_t_min = 0, cnt_b_max = 0, cnt_b_min = 0, summary_array_t = 0,
    summary_array_b = 0;
  for (var i = 0; i < currentList.length; i++) {
    for (var j = 0; j < currentList.length - 1; j++) {
      array_t = [];
      array_b = [];
      summary_array_t = 0;
      summary_array_b = 0;

      for (var k = 1; k < currentList[j].length; k++) {
        array_t.push(currentList[j][k] == '-' ? 0 : parseInt(currentList[j][k]));
        summary_array_t += currentList[j][k] == '-' ? 0 : parseInt(currentList[j][k]);
      }
      for (var k = 1; k < currentList[j + 1].length; k++) {
        array_b.push(currentList[j + 1][k] == '-' ? 0 : parseInt(currentList[j + 1][k]));
        summary_array_b += currentList[j + 1][k] == '-' ? 0 : parseInt(currentList[j + 1][k]);
      }


      counter_t = 0, counter_b = 0, cnt_t_max = 0, cnt_t_min = 0, cnt_b_max = 0, cnt_b_min = 0;
      if (summary_array_t > 0 || summary_array_b > 0) {
        for (var a = 0; a < array_t.length; a++) {
          if (a == 2 || a == 6) {
            if (array_t[a] > 0 && (array_t[a] < array_b[a] || array_b[a] == 0)) {
              counter_t++;
              cnt_t_min = cnt_t_min + array_t[a];
            }
            if (array_b[a] > 0 && (array_t[a] > array_b[a] || array_t[a] == 0)) {
              counter_b++;
              cnt_b_min = cnt_b_min + array_b[a];
            }
          } else {
            if (array_t[a] > 0 && (array_t[a] > array_b[a] || array_b[a] == 0)) {
              counter_t++;
              cnt_t_max = cnt_t_max + array_t[a];
            }
            if (array_b[a] > 0 && (array_t[a] < array_b[a] || array_t[a] == 0)) {
              counter_b++;
              cnt_b_max = cnt_b_max + array_b[a];
            }
          }
        }
      }
      if ((counter_b > counter_t)
        || (counter_b == counter_t && cnt_b_min < cnt_t_min && cnt_b_max > cnt_t_max)
        || (counter_b == counter_t && counter_b == 0)) {
        t = sort_currentList[j + 1];
        sort_currentList[j + 1] = sort_currentList[j];
        sort_currentList[j] = t;
      }
    }
  }
  TableData(sort_currentList, true);
}

function convertFormatsHead() {
  $('.js_worker_board_by_vals thead th h5').each(function (index, element) {
    if (index == 2) convertTime($(element), $(element).text());
    if (index == 6) convertTime($(element), $(element).text());
    if (index == 7) $(element).html($(element).text() + '<span class="word" style="vertical-align:2px">%</span>');
  });
}

function convertFormatsBody() {
  $('.js_worker_board_by_vals tbody .values').each(function (index, element) {
    $(element).find('td').each(function (index, element) {
      if ($(element).text() == 0 && index != 7) {
        $(element).html('-');
      } else {
        if (index == 2) convertTime($(element), $(element).text());
        if (index == 6) convertTime($(element), $(element).text());
        if (index == 7) {
          if ($(element).text() == '-') {
            $(element).html('-');
          } else {
            $(element).html($(element).text() + '<span class="word">%</span>');
          }
        }
      }
    });
  });
}

function convertTime(position, time) {
  var timeGet = time;
  var hours = parseInt(timeGet / 60);
  var minutes = timeGet - hours * 60;
  var seconds = 0;

  hours = parseInt(timeGet / 3600);
  minutes = Math.round((timeGet - hours * 3600) / 60);
  seconds = timeGet - hours * 60 - minutes * 60;

  if (minutes < 1 && seconds > 0) {
    minutes = '01'
  } else if (minutes < 10) minutes = '0' + minutes;
  $(position).html(hours + '<span class="word">'+Translate('leaderboard/hours')+'</span> ' + minutes + '<span class="word">'+Translate('leaderboard/minutes')+'</span>');
}

function deconvertFormats() {
  $('.js_worker_board_by_vals tbody .values').each(function (index, element) {
    $(element).find('td').each(function (index, element) {
      if ($(element).text() == '-' && index != 6) {
        $(element).text('0');
      } else {
        if (index == 1) deconvertTime($(element), $(element).text());
        if (index == 5) deconvertTime($(element), $(element).text());
        if (index == 6) {
          if ($(element).text() == '-') {
            $(element).text('-');
          } else {
            $(element).text(parseInt($(element).text().replace('%', '')));
          }
        }
      }
    });
  });
}

function deconvertTime(position, time, b_return) {
  var timeStr = parseInt(time.replace('ч ', ''));
  var hours = parseInt(timeStr / 100);
  var minutes = timeStr - hours * 100;
  var timeInt = hours * 60 + minutes;
  if (b_return)
    return timeInt;
  $(position).text(timeInt);
}

function restoreAllBorders() {
  return;
  $('.js_worker_board_by_vals thead').find('th').css({
    'border-top': '1px solid #e5e5e5',
    'border-right': '1px solid #e5e5e5',
    'border-bottom': '1px solid #e5e5e5',
  });
  $('.js_worker_board_by_vals thead th:first').css('border-left', '1px solid #e5e5e5');
}

function restoreBorders(element) {
  return;
  $(element).css({
    'border-right': '1px solid #e5e5e5',
    'border-top': '1px solid #e5e5e5',
    'border-bottom': '1px solid #e5e5e5'
  });
  $(element).prev().css('border-right', '1px solid #e5e5e5');
  if ($(element).index() == 0) $(element).css('border-left', '1px solid #e5e5e5');
}

function setBlueBorders(element) {
  return;
  $(element).css({
    'border-right': '1px solid #4c90cf',
    'border-top': '1px solid #4c90cf',
    'border-bottom': '1px solid #4c90cf'
  });
  $(element).prev().css('border-right', '1px solid #4c90cf');
  if ($(element).index() == 0) $(element).css('border-left', '1px solid #4c90cf');
}

function old_sortListMax(number) {
  deconvertFormats();
  for (var i = 0; i < $('.js_worker_board_by_vals tbody .values').length; i++) {
    for (var j = 0; j < $('.js_worker_board_by_vals tbody .values').length - 1; j++) {
      var value1 = $('.js_worker_board_by_vals tbody .values').eq(j).find('td').eq(number).text();
      var value2 = $('.js_worker_board_by_vals tbody .values').eq(j + 1).find('td').eq(number).text();
      if (value1 != '-') {
        value1 = parseInt(value1 * 10);
      }
      if (value2 != '-') {
        value2 = parseInt(value2 * 10);
      }
      if ((value2 > value1 && value1 != 0) || (value2 > 0 && value1 == 0) || (value1 == '-' && value2 != '-')) {
        $('.js_worker_board_by_vals tbody .name').eq(j).before($('.js_worker_board_by_vals tbody .values').eq(j + 1));
        $('.js_worker_board_by_vals tbody .values').eq(j).before($('.js_worker_board_by_vals tbody .name').eq(j + 1));
      }
    }
  }
  convertFormatsBody();
}

function old_sortListMin(number) {
  deconvertFormats();
  for (var i = 0; i < $('.js_worker_board_by_vals tbody .values').length; i++) {
    for (var j = 0; j < $('.js_worker_board_by_vals tbody .values').length - 1; j++) {
      var value1 = $('.js_worker_board_by_vals tbody .values').eq(j).find('td').eq(number).text();
      var value2 = $('.js_worker_board_by_vals tbody .values').eq(j + 1).find('td').eq(number).text();
      if (value1 != '-') {
        value1 = parseInt(value1 * 10);
      }
      if (value2 != '-') {
        value2 = parseInt(value2 * 10);
      }

      if ((value2 < value1 && value2 != 0) || (value2 > 0 && value1 == 0) || (value1 != '-' && value2 == '-')) {
        $('.js_worker_board_by_vals tbody .name').eq(j).before($('.js_worker_board_by_vals tbody .values').eq(j + 1));
        $('.js_worker_board_by_vals tbody .values').eq(j).before($('.js_worker_board_by_vals tbody .name').eq(j + 1));
      }
    }
  }
  convertFormatsBody();
}

function sortListMax(number) {
  deconvertFormats();
  var sort_currentList = currentList;
  for (var i = 0; i < currentList.length; i++) {
    for (var j = 0; j < currentList.length - 1; j++) {
      var value1 = currentList[j][number + 1];
      var value2 = currentList[j + 1][number + 1];
      if (value1 != '-') {
        value1 = parseInt(value1 * 10);
      }
      if (value2 != '-') {
        value2 = parseInt(value2 * 10);
      }
      if ((value2 > value1 && value1 != 0) || (value2 > 0 && value1 == 0) || (value1 == '-' && value2 != '-')) {
        t = sort_currentList[j + 1];
        sort_currentList[j + 1] = sort_currentList[j];
        sort_currentList[j] = t;
      }
    }
  }
  TableData(sort_currentList, true);
}

function sortListMin(number) {
  deconvertFormats();
  var sort_currentList = currentList;
  for (var i = 0; i < currentList.length; i++) {
    for (var j = 0; j < currentList.length - 1; j++) {
      var value1 = currentList[j][number + 1];
      var value2 = currentList[j + 1][number + 1];
      if (value1 != '-') {
        value1 = parseInt(value1 * 10);
      }
      if (value2 != '-') {
        value2 = parseInt(value2 * 10);
      }

      if ((value2 < value1 && value2 != 0) || (value2 > 0 && value1 == 0) || (value1 != '-' && value2 == '-')) {
        t = sort_currentList[j + 1];
        sort_currentList[j + 1] = sort_currentList[j];
        sort_currentList[j] = t;
      }
    }
  }
  TableData(sort_currentList, true);

}

function SortByGroup(index, key) {
  // $('.leader_table_by_group.nano').nanoScroller({scroll: 'bottom'});
  $('.leader_table').hide();
  $('.leader_table_by_group').show();

  // $('.leader_table_by_group').css('width',((ar_groups.length+1)*108)+'px');
  $('.leader_table_by_group thead').html('<tr></tr>');
  $('.leader_table_by_group tbody').html('');
  //create head
  var row = $('.leader_table th').eq(index).clone();
  $(row).addClass('border_active');

  $(row).find('.sort').html($(row).find('.no_sort2').html()).addClass('revert').addClass('no_sort2');
  $('.leader_table_by_group thead tr').append(row);
  for (var arGroupsKey in ar_groups) {
    $('.leader_table_by_group thead tr').append('<th data-title="' + ar_groups[arGroupsKey] + '" class="omni_custom_tooltip omni_custom_tooltip_leaderboard"><h5>0</h5><p>' + ar_groups[arGroupsKey] + '</p></th>');
  }

  isOverflown = function (element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
  };

  $('.leader_table_by_group thead tr th>p').each(function () {
    $(this).parents('th').removeClass('omni_custom_tooltip').removeClass('omni_custom_tooltip_leaderboard');
  });

  var results = [];

  var t = [];
  $('.leader_table tbody tr').each(function () {
    if ($(this).hasClass('name')) {
      t.push($(this).text());
    }
    if ($(this).hasClass('values')) {
      t.push($(this).find('td').eq(index).text());
      id = $(this).attr('data-id');
      if (stat_by_groups[id][key]) {
        for (var statByGroupKey in stat_by_groups[id][key]) {
          t.push(stat_by_groups[id][key][statByGroupKey]);
        }
      }
      results.push(t);
      t = [];

    }
  });
  ///////////////////////////////////
  createTableList(results, '.leader_table_by_group');
  ////////set best/worst
  for (var i = 1; i < results[0].length; i++) {
    min = 1000000;
    max = 0;
    min_row = -1;
    max_row = -1;
    sum = 0;
    arr = [];
    for (var j = 0; j < results.length; j++) {

      v = results[j][i].toString().match(/ч/) ? deconvertTime(null, results[j][i].toString(), true) : results[j][i];
      v = parseInt(v);
      if (!v) {
        continue;
      }
      sum += v;

      arr.push(v);
      if (v > max) {
        max = v;
        max_row = j
      }
      if (v < min) {
        min = v;
        min_row = j
      }
    }
    if (min_row > -1) {
      $('.leader_table_by_group tbody tr.values').eq(min_row).find('td').eq(i - 1).removeClass('worst').removeClass('best').addClass(key.match(/speed/) ? 'best' : 'worst');
    }
    if (max_row > -1) {
      $('.leader_table_by_group tbody tr.values').eq(max_row).find('td').eq(i - 1).removeClass('worst').removeClass('best').addClass(key.match(/speed/) ? 'worst' : 'best');
    }
    if (i == 1) {
      //первый столбец  игнорим
      continue;
    }

    if (key.match(/speed/)) {
      convertTime($('.leader_table_by_group thead th').eq(i - 1).find('h5'), b_client_mediana ? calculate_median(arr) : calculate_average(arr))
    } else if (key == 'percent_notes') {
      $('.leader_table_by_group thead th').eq(i - 1).find('h5').text((b_client_mediana ? calculate_median(arr) : calculate_average(arr)) + '%');
    } else {
      $('.leader_table_by_group thead th').eq(i - 1).find('h5').text(sum);
    }
  }
  //////////////////////////////////////////////////////
  //////fixes
  $('.leader_table_by_group tr.values td').each(function () {

    if ($(this).index() == 0) {
      $(this).addClass('border_active');
    } else {
      var _t = this.textContent;
      if (_t == '0') {
        this.textContent = '-';
        // $(this).text('-')
      } else if (key.match(/speed/) && !isNaN(parseInt(_t))) {
        convertTime(this, _t)
      } else if (key == 'percent_notes') {
        this.textContent += '%';
      }

    }
  });

  // $('.leader_table_by_group').css('overflow','hidden');
  initScroll()
  /////////////////////////////////////////////////////////
}

function PrepareByFilter(f) {
  // console.log('test');

  if (f == 'staff_0') {
    // $('.leader_table thead th .sort').css('visibility', 'visible');
    $('.leader_table thead th .old_sort').css('display', 'none');
  } else {
    // $('.leader_table thead th .sort').css('visibility', 'hidden');
    // $('.leader_table thead th .old_sort').css('display', 'block');
    $('.leader_table_by_group').hide();

  }

}

function calculate_median(values) {
  if (values.length === 0) return 0;
  for (var i = 0; i < values.length; i++) {
    sum += parseInt(values[i], 10); //don't forget to add the base
  }

  values.sort(function (a, b) {
    return a - b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2)
    return values[half];

  return (values[half - 1] + values[half]) / 2.0;
}

function calculate_average(array) {
  if (array.length === 0) return 0;
  var sum = 0;
  for (var i = 0; i < array.length; i++) {
    sum += parseInt(array[i], 10); //don't forget to add the base
  }

  return parseInt(sum / array.length);
}


// инит скролла
function initScroll() {
  if ((Object.keys(ar_groups).length + 1) > 8) {
    var table = $('.leader_table_by_group table');

    if (!table.parents('.scrollbar-inner').length) {
      table.wrap("<div class='scrollbar-inner'></div>");
    }
    $('.scrollbar-inner').scrollbar({
      'scrollx': "simple",
      "onScroll": function (y, x) {
        $('.leader_table_by_group tbody tr.name td').css('padding-left', x.scroll + 'px');
      }
    });
    $('.leader_table_by_group .scroll-content').omniDragScroll();
  }
}
