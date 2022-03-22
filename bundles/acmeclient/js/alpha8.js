// JavaScript Document

/**
 * Массивы, генерируемые на сервере, имеют следующий формат имени: имя_тип
 * имя - значение "value" из выпадающего списка с временным периодом - select.time_settings
 * тип - _entry - поступивших обращений, _reply - обращений с первым ответом, _interval - временного интервала (примеры в <head> HTML-файла)
 * обязательно для каждого интервала строгое соответствие количества элементов во всех 3-х массивах!
 * элементов массива может быть любое количество - 7, 8, 10 и т.д.
 */

$(document).ready(function () {
  blockStatus = 'enabled';
  choicesInit('.select-box', {searchResultLimit: 99, searchEnabled: true, shouldSort: false, itemSelectText: ''});

  if ($('.rating')) {
    $('.select-box').on('change', function () {
      const picker = document.querySelector(".pika-single.is-bound.is-hidden")
      $('.select-box').attr('disabled', 'disabled');
      // $('.select-box').trigger('chosen:updated');
      $(this).closest(".time_settings").find(".icon-spin").show();
    });
  }
});

function HideSpinIcon() {
  $('.select-box').removeAttr('disabled');
  // $('.select-box').trigger('chosen:updated');
  $('.time_settings .icon').hide();
}

// ------- Общая для amount и speed -------
// Генерация одинарного графика
function genTable(array, sum, interval, color1, color2) {
  var maximum = Math.max.apply(0, array);
  var scale = (163 / maximum);
  for (var i = 0; i < array.length; i++) {
    var percent = Math.round(array[i] / sum * 100);
    $('.graphic table thead tr').append('<th><h5 style="color:' + color2 + ';">' + array[i] + '</h5><span>' + percent + '%</span></th>');
    $('.graphic table tbody tr').not(':last').append('<td></td>');
    var height = Math.round(array[i] * scale);
    $('.graphic table tbody tr:last').append('<td class="graph"><div style="height:' + height + 'px;  width:100%; bottom:0; left:0; background:' + color1 + ';"></div></td>');
    $('.graphic table tfoot tr').append('<td>' + interval[i] + '</td>');
  }
}

// ------- Общие для всех -------
// Подсчет суммы значений
function summary(array) {
  var sum = 0;
  for (var i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
}

// Очистка графика
function clearTable() {
  $('.graphic table thead tr').html('');
  $('.graphic table tbody tr').html('');
  $('.graphic table tfoot tr').html('');
}

// Снятие поведения с информационных блоков
function disableBlocks() {
  if( $('.enter_reply').length > 0 ){
    $('.enter h2 .number').text('0');
    $('.reply h2 .number').text('0');
    $(document).off('click', '.enter_reply .enter, .enter_reply .reply');

    $(document).off('click', '.enter_reply .enter input, .enter_reply .reply input'); // раньше был ifClicked

    // $('.enter_reply input').iCheck('uncheck'); // старая
    // $('.enter_reply input').iCheck('disable'); // старая

    // Замена START
    $('.enter_reply input')[0].checked = false
    $('.enter_reply input')[0].disabled = true
    //
    $('.enter_reply input')[1].checked = false
    $('.enter_reply input')[1].disabled = true
    // Замена END

    $('.enter_reply .enter, .enter_reply .reply').removeClass('active');
    $('.enter_reply .enter .icon').removeClass('fas fa-level-up-alt').text('0%');
    $('.enter_reply .enter .icon').removeClass('fas fa-level-down-alt').text('0%');
    $('.enter_reply .reply .icon').removeClass('fas fa-level-up-alt').text('0%');
    $('.enter_reply .reply .icon').removeClass('fas fa-level-down-alt').text('0%');
  }
  if( $('.rating').length > 0 ){
    $('.rating h2').html('<span class="number">0%</span><span class="icon no_trend"><i>0%</i></span>');
    $('.rating > div').removeClass('active');

    // $('.rating input').iCheck('uncheck'); // старая
    // $('.rating input').iCheck('disable'); // старая

    $('.rating input').attr("checked", "false")
    $('.rating input').attr("disabled", "true")

    $('.answer_quality tr').hide();
    $(document).off('click', '.rating > div');
  }
}

function DisableChannel() {
  if ($('.act_closed').length > 0) {
    $('.act_closed').hide();
    $('.channels_table').hide();
  }
}

function disableAnswers() {
  $('.answer_speed .first_answer h2').html('0<span class="word">'+Translate('leaderboard/hours')+'</span> 0<span class="word">'+Translate('leaderboard/minutes')+'</span><span class="icon no_trend"><i>0%</i></span>');
  $('.answer_speed .closed_answer h2').html('<span class="number">0</span><span class="icon no_trend"><i>0%</i></span>');
  $('.answer_speed .closed_stuff h2').html('0<span class="word">'+Translate('leaderboard/hours')+'</span> 0<span class="word">'+Translate('leaderboard/minutes')+'</span><span class="icon no_trend"><i>0%</i></span>');
  $(document).off('click', '.answer_speed .first_answer, .answer_speed .closed_answer, .answer_speed .closed_stuff');
  $('.answer_speed .first_answer, .answer_speed .closed_answer, .answer_speed .closed_stuff').removeClass('active');
}

function DisableLeaderboard() {
  if ($('.leader_table').length > 0) {
    $('.leader_table').hide();
  }
}

function DisableSatisfaction() {
  if ($('.answer_quality').length > 0) {
    $('.answer_quality').hide();
    $('.show_more').hide();
  }
}

function NoInformation(type) {
  // Это случай, когда нет статистики вообще
  var type_class = '.no_stat';
  // Это случай, когда нет данных по указанному фильтру
  if (type == 'no_info') {
    type_class = '.no_info';
  }
  clearTable();
  blockStatus = 'disabled';
  disableBlocks();
  DisableChannel();
  disableAnswers();
  DisableLeaderboard();
  DisableSatisfaction();
  $('.empty').show();
  $('.empty ' + type_class).show();

  HideSpinIcon();
}
