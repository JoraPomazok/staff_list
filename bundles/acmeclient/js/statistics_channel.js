$(document).ready(function () {
  
  is_already_enable_blocks = false;
  
  if (typeof no_stat !== "undefined" && no_stat == true) {
    NoInformation('no_stat');
  } else {
    if (currentAct.length == 0) {
      NoInformation('no_info');
    } else {
      checkActStatus();
      ChangeBlocksPercent(json_blocks);
    }
    
    $('.select-box').on('change', function () {
      $('.empty, .empty .no_stat, .empty .no_info').hide();
      
      var f_period = $('#f_period').val();
      var f_staff = $('#f_staff').val();
      xajax_ChangeStatData(f_period, f_staff);
    });
  }
  InitNanoScrolls('');
});

// Вкл/выкл информационных блоков
function enableBlocks(){
  is_already_enable_blocks = true;
  
  $(document).on('click', '.act_closed .act, .act_closed .closed', function(event) {
    if (event.target.tagName == "INPUT") {$(this).toggleClass('active'); checkActStatus(); return}
    
    $(this).toggleClass('active');
    // $(this).find('input').iCheck('toggle');
  
    // Заменяем START
    if ( $(this).find('input')[0].checked == true ) {
      $(this).find('input')[0].checked = false
    } else {
      $(this).find('input')[0].checked = true
    }
    // Заменяем END
    
    checkActStatus();
    clearActBlocks();
    genButton (currentAct, '.act');
    genButton (currentClosed, '.closed');
  });
  
};

// Отображение изменения общих данных и процентов
function ChangeBlocksPercent(json_data) {
  $('.act_closed').show();
  
  $('.act h2 .number').text(json_data.cnt_cases);
  
  var icon_level = '';
  if (json_data.percent_cases == '-') {
    $('.act_closed .act .icon:first').removeClass().addClass('icon no_trend').html('<i>0%</i>');
  } else {
    var icon_level = 'no_trend';
    if (json_data.percent_cases > 0) {
      icon_level = 'icon fas fa-level-up-alt positive_trend';
    }
    if (json_data.percent_cases < 0) {
      icon_level = 'fas fa-level-down-alt negative_trend';
    }
    $('.act_closed .act .icon:first').removeClass().addClass('icon ' + icon_level).html('<i>' + Math.abs(json_data.percent_cases) + '%</i>');
  }
  
  $('.closed h2 .number').text(json_data.cnt_closed);
  
  if (json_data.percent_closed == '-') {
    $('.act_closed .closed .icon:first').removeClass().addClass('icon no_trend').html('<i>0%</i>');
  } else {
    icon_level = 'no_trend';
    if (json_data.percent_closed > 0) {
      icon_level = 'icon fas fa-level-up-alt positive_trend';
    }
    if (json_data.percent_closed < 0) {
      icon_level = 'fas fa-level-down-alt negative_trend';
    }
    $('.act_closed .closed .icon:first').removeClass().addClass('icon ' + icon_level).html('<i>' + Math.abs(json_data.percent_closed) + '%</i>');
  }
  
  CheckBlocks();
  
  genButton(currentAct, '.act');
  genButton(currentClosed, '.closed');
}

// Проверка состояния блоков
function CheckBlocks() {
  
  var val_act = $('.act h2 .number').text();
  var val_closed = $('.closed h2 .number').text();
  
  var act_on = 0;
  var closed_on = 0;
  
  if ($('.act_closed div.act').hasClass('active')) {
    act_on = 1;
  }
  if ($('.act_closed div.closed').hasClass('active')) {
    closed_on = 1;
  }
  if (val_act == 0) {
    NoInformation('no_info');
  }
  
  if (val_closed == 0) {
    if (closed_on == 1) {
      $('.act_closed div.closed').toggleClass('active');
      // $('.act_closed .closed input').iCheck('uncheck');
      
      $('.act_closed .closed input')[0].checked = false
    }
    
    // $('.act_closed .closed input').iCheck('disable');
    // $('.act_closed .act input').iCheck('enable');
    
    $('.act_closed .closed input')[0].disabled = true
    $('.act_closed .act input')[0].disabled = false
    
    $(document).off('click', '.act_closed .act, .act_closed .closed');
    $(document).off('click', '.act_closed .act input, .act_closed .closed input');
    
    is_already_enable_blocks = false;
    if (act_on == 0) {
      $('.act_closed .act').toggleClass('active');
      // $('.act_closed .act input').iCheck('check');
      
      $('.act_closed .act input')[0].disabled = true // добавил этот фикс
      $('.act_closed .act input')[0].checked = true
    }
  }
  
  if (val_act > 0 && act_on > 0) {
    // $('.act_closed .act input').iCheck('check');
    
    $('.act_closed .act input')[0].disabled = true // добавил этот фикс
    $('.act_closed .act input')[0].checked = true
  }
  
  if (val_closed > 0 && closed_on > 0) {
    // $('.act_closed .closed input').iCheck('check');
    $('.act_closed .act input')[0].checked = true
  }
  
  if (val_act > 0 && val_closed > 0) {
    if (!is_already_enable_blocks) {
      enableBlocks();
    }
    
    // $('.act_closed .act input').iCheck('enable');
    // $('.act_closed .closed input').iCheck('enable');
    
    $('.act_closed .act input')[0].disabled = false;
    $('.act_closed .closed input')[0].disabled = false;
    
    if (act_on == 0 && closed_on == 0) {
      console.log('11');
      $('.act_closed div.act').toggleClass('active');
      // $('.act_closed .act input').iCheck('check');
      $('.act_closed .act input')[0].checked = true
    }
  }
}

// Генерация значений блоков-кнопок
function genButton(array, element) {
  $(element).append('<ul class="wrap"></ul>');
  for (var i = 0; i < array.length; i++) {
    var symbol = array[i][1];
    var color = array[i][2];
    var sum = 0;
    for (var j = 3; j < array[i].length; j++) {
      sum += array[i][j];
    }
    if ($(element).hasClass('active')) {
      $(element).find('ul').append('<li style="background:' + color + ';"><span class="icon ' + symbol + ' flt_l"></span><span class="value flt_r">' + sum + '</span></li>');
    } else {
      $(element).find('ul').append('<li style="background:#cdcdcd;"><span class="icon ' + symbol + ' flt_l"></span><span class="value flt_r">' + sum + '</span></li>');
    }
  }
  // if ((array.length % 3) == 1) $(element).find('ul li:last').css('margin-left', '112px');
}

// Генерация таблицы каналов
function genChannels(array, interval, color) {
  if (array.length > 1) {
    $('.channels_table table thead').append('<tr></tr>');
    for (var i = 3; i < array[0].length; i++) {
      var sum = 0;
      for (var j = 0; j < array.length; j++) {
        sum += array[j][i];
      }
      $('.channels_table table thead tr').append('<th style="color:' + color + '">' + sum + '</th>');
    }
  }
  for (var i = 0; i < array.length; i++) {
    if (array.length > 1) {
      $('.channels_table .socials').css('top', '46px');
    } else {
      $('.channels_table .socials').css('top', '3px');
    }
    $('.channels_table .socials').append('<li style="background:' + array[i][2] + ';"></li>');
    $('.channels_table table tbody').append('<tr></tr>');
    var maximum = 0, number = 0;
    for (var j = 3; j < array[i].length; j++) {
      if (array[i][j] == 0) {
        $('.channels_table table tbody tr:last').append('<td style="color:#b6b6b6;">&ndash;</td>');
      } else {
        $('.channels_table table tbody tr:last').append('<td>' + array[i][j] + '</td>');
      }
      if (i % 2 == 1) $('.channels_table table tbody tr:last td').css('background', '#fcfcfc');
      if (array[i][j] > maximum) {
        maximum = array[i][j];
        number = j - 3;
      }
    }
    $('.channels_table table tbody tr:last td:eq(' + number + ')').css('color', '#ef3f3f');
  }
  $('.channels_table table tfoot').append('<tr></tr>');
  for (var i = 0; i < interval.length; i++) {
    $('.channels_table table tfoot tr').append('<td>' + interval[i] + '</td>');
  }
}

// Генерация двойной таблицы каналов
function genDoubleChannels(array1, array2, interval, color1, color2) {
  if (array1.length > 1) {
    $('.channels_table table thead').append('<tr></tr>');
    for (var i = 3; i < array1[0].length; i++) {
      var sum1 = 0, sum2 = 0;
      for (var j = 0; j < array1.length; j++) {
        sum1 += array1[j][i];
        sum2 += array2[j][i];
      }
      $('.channels_table table thead tr').append('<th><span style="color:' + color1 + '">' + sum1 + '</span><span style="color:#b6b6b6; font-weight:normal;"> / </span><span style="color:' + color2 + '">' + sum2 + '</span></th>');
    }
  }
  for (var i = 0; i < array1.length; i++) {
    if (array1.length > 1) {
      $('.channels_table .socials').css('top', '46px');
    } else {
      $('.channels_table .socials').css('top', '3px');
    }
    $('.channels_table .socials').append('<li style="background:' + array1[i][2] + ';"></li>');
    $('.channels_table table tbody').append('<tr></tr>');
    var maximum1 = 0, number1 = 0, maximum2 = 0, number2 = 0;
    for (var j = 3; j < array1[i].length; j++) {
      if ((array1[i][j] == 0) && (array2[i][j] == 0)) {
        $('.channels_table table tbody tr:last').append('<td style="color:#b6b6b6;">&ndash;</td>');
      } else if (array1[i][j] == 0) {
        $('.channels_table table tbody tr:last').append('<td><span style="color:#b6b6b6;">' + array1[i][j] + '</span><span style="color:#b6b6b6; font-weight:normal;"> / </span><span>' + array2[i][j] + '</span></td>');
      } else if (array2[i][j] == 0) {
        $('.channels_table table tbody tr:last').append('<td><span>' + array1[i][j] + '</span><span style="color:#b6b6b6; font-weight:normal;"> / </span><span style="color:#b6b6b6;">' + array2[i][j] + '</span></td>');
      } else {
        $('.channels_table table tbody tr:last').append('<td><span>' + array1[i][j] + '</span><span style="color:#b6b6b6; font-weight:normal;"> / </span><span>' + array2[i][j] + '</span></td>');
      }
      if (i % 2 == 1) $('.channels_table table tbody tr:last td').css('background', '#fcfcfc');
      if (array1[i][j] > maximum1) {
        maximum1 = array1[i][j];
        number1 = j - 3;
      }
      if (array2[i][j] > maximum2) {
        maximum2 = array2[i][j];
        number2 = j - 3;
      }
    }
    $('.channels_table table tbody tr:last td:eq(' + number1 + ') span:first').css('color', '#eb5757');
    $('.channels_table table tbody tr:last td:eq(' + number2 + ') span:last').css('color', '#eb5757');
  }
  $('.channels_table table tfoot').append('<tr></tr>');
  for (var i = 0; i < interval.length; i++) {
    $('.channels_table table tfoot tr').append('<td>' + interval[i] + '</td>');
  }
}

// Отслеживание состояний блоков-кнопок
function checkActStatus() {
  var actTable = 'off';
  var closedTable = 'off';
  
  $('.act_closed').children().each(function (index, element) {
    if (($(element).hasClass('active')) && ($(element).hasClass('act'))) {
      actTable = 'on';
    }
    if (($(element).hasClass('active')) && ($(element).hasClass('closed'))) {
      closedTable = 'on';
    }
  });
  
  clearActTable();
  if ((actTable == 'on') && (closedTable == 'on')) {
    genDoubleChannels(currentAct, currentClosed, currentInterval, '#2873c6', '#8768cc');
  }
  if ((actTable == 'on') && (closedTable == 'off')) {
    genChannels(currentAct, currentInterval, '#2873c6');
  }
  if ((actTable == 'off') && (closedTable == 'on')) {
    genChannels(currentClosed, currentInterval, '#8768cc');
  }
}

// Очистка таблицы каналов
function clearActTable() {
  $('.channels_table ul').html('');
  $('.channels_table table thead').html('');
  $('.channels_table table tbody').html('');
  $('.channels_table table tfoot').html('');
  $('.channels_table').show();
}

// Очистка блоков-кнопок
function clearActBlocks() {
  $('.act_closed').children().each(function (index, element) {
    $(element).find('ul').remove();
  });
}
