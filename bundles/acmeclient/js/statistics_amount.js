$(document).ready(function () {
  
  is_already_enable_blocks = false;
  
  if (typeof no_stat !== "undefined" && no_stat == true) {
    NoInformation('no_stat');
  } else {
    if (currentEnter.length == 0) {
      NoInformation('no_info');
    } else {
      ChangeBlocksPercent(json_blocks);
      CheckBlocks();
      
      if (summary(currentEnter) > 0) {
        basicColor = '#8dafd1';
        basicTextColor = '#2873c6';
        genTable(currentEnter, summary(currentEnter), currentIntervar, basicColor, basicTextColor);
      } else {
        basicColor = '#68cde0';
        basicTextColor = '#2daac1';
        genTable(currentReply, summary(currentReply), currentIntervar, basicColor, basicTextColor);
      }
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
  
  
  
  $(document).on('click', '.enter_reply .enter, .enter_reply .reply', function() {
    $(this).toggleClass('active');

    // $(this).find('input').iCheck('toggle'); // оригинал
    // Заменяем START
    if ( $(this).find('input')[0].checked == true ) {
      $(this).find('input')[0].checked = false
    } else {
      $(this).find('input')[0].checked = true
    }
    // Заменяем END
    checkStatus();
  });
  
  $(document).on('click', '.enter_reply .enter input, .enter_reply .reply input', function() {
    $(this).closest("div").toggleClass("active")
    
    if ($(this)[0].checked) {
      $(this)[0].checked = false
      this.closest("div").classList.toggle("active")
    } else {
      this.closest("div").classList.toggle("active")
      $(this)[0].checked = true
    }
    
    checkStatus();
  });
  
};

// Отслеживание состояний информационных блоков
function checkStatus() {
  var enterTable = 'off';
  var replyTable = 'off';
  $('.enter_reply').children().each(function (index, element) {
    if (($(element).hasClass('active')) && ($(element).hasClass('enter'))) enterTable = 'on';
    if (($(element).hasClass('active')) && ($(element).hasClass('reply'))) replyTable = 'on';
  });
  clearTable();
  if ((enterTable == 'on')&&(replyTable == 'on')) genDoubleTable(currentEnter, currentReply, summary(currentEnter), summary(currentReply), currentIntervar, '#8dafd1', '#68cde0', '#2873c6', '#2daac1');
  if ((enterTable == 'on')&&(replyTable == 'off')) genTable (currentEnter, summary(currentEnter), currentIntervar, '#8dafd1', '#2873c6');
  if ((enterTable == 'off')&&(replyTable == 'on')) genTable (currentReply, summary(currentReply), currentIntervar, '#68cde0', '#2daac1');
}

// Генерация двойного графика
function genDoubleTable(array1, array2, sum1, sum2, interval, color1, color2, color3, color4) {
  var maximum1 = Math.max.apply(0, array1);
  var maximum2 = Math.max.apply(0, array2);
  if (maximum1 >= maximum2) {
    var maximum = maximum1;
  } else {
    var maximum = maximum2;
  }
  var scale = (163 / maximum);
  for (var i = 0; i < array1.length; i++) {
    var percent1 = Math.round(array1[i] / sum1 * 100);
    var percent2 = Math.round(array2[i] / sum2 * 100);
    $('.graphic table thead tr').append('<th><h5><span style="color:' + color3 + '; font-size:14px;">' + array1[i] + '</span> <span style="color:#b6b6b6; font-size:14px; font-weight:normal;">/</span> <span style="color:' + color4 + '; font-size:14px;">' + array2[i] + '</span></h5><span>' + percent1 + '%</span> <span style="color:#b6b6b6;">/</span> <span>' + percent2 + '%</span></th>');
    $('.graphic table tbody tr').not(':last').append('<td></td>');
    var height1 = Math.round(array1[i] * scale);
    var height2 = Math.round(array2[i] * scale);
    $('.graphic table tbody tr:last').append('<td class="graph"><div style="height:' + height1 + 'px;  width:50%; bottom:0; left:0; background:' + color1 + ';"></div><div style="height:' + height2 + 'px;  width:50%; bottom:0; right:0; background:' + color2 + ';"></div></td>');
    $('.graphic table tfoot tr').append('<td>' + interval[i] + '</td>');
  }
}

// Отображение изменения общих данных и процентов
function ChangeBlocksPercent( json_data ){
  $('.enter h2 .number').text(json_data.cnt_cases);
  
  var icon_level = '';
  if( json_data.percent_cases == '-' ){
    $('.enter_reply .enter .icon').removeClass().addClass('icon no_trend').html('<i>0%</i>');
  }
  else{
    var icon_level = 'no_trend';
    if( json_data.percent_cases > 0 ){
      icon_level = 'fas fa-level-up-alt positive_trend';
    }
    if( json_data.percent_cases < 0 ){
      icon_level = 'fas fa-level-down-alt negative_trend';
    }
    $('.enter_reply .enter .icon').removeClass().addClass('icon '+icon_level).html('<i>'+Math.abs(json_data.percent_cases)+'%</i>');
  }
  
  $('.reply h2 .number').text(json_data.cnt_first);
  
  if( json_data.percent_first == '-' ){
    $('.enter_reply .reply .icon').removeClass().addClass('icon no_trend').html('<i>0%</i>');
  }
  else{
    icon_level = 'no_trend';
    if( json_data.percent_first > 0 ){
      icon_level = 'fas fa-level-up-alt positive_trend';
    }
    if( json_data.percent_first < 0 ){
      icon_level = 'fas fa-level-down-alt negative_trend';
    }
    $('.enter_reply .reply .icon').removeClass().addClass('icon '+icon_level).html('<i>'+Math.abs(json_data.percent_first)+'%</i>');
  }
}

// Проверка состояния блоков
function CheckBlocks(){
  if (blockStatus == 'disabled') {
    blockStatus = 'enabled';
    is_already_enable_blocks = false;
  }
  
  var val_enter = $('.enter h2 .number').text();
  var val_reply = $('.reply h2 .number').text();
  
  var enter_on = 0;
  var reply_on = 0;
  if ( $('.enter_reply div.enter').hasClass('active') ){
    enter_on = 1;
  }
  if ( $('.enter_reply div.reply').hasClass('active') ){
    reply_on = 1;
  }
  
  if( val_enter == 0 ){
    if( enter_on == 1 ){
      $('.enter_reply div.enter').toggleClass('active');
      // $('.enter_reply .enter input').iCheck('uncheck'); // старая
      // Замена START
      $('.enter_reply .enter input')[0].checked = false
      // Замена END
    }
    // $('.enter_reply .enter input').iCheck('disable'); // старая
    // $('.enter_reply .reply input').iCheck('enable'); // старая
  
    // Замена START
    $('.enter_reply .enter input')[0].disabled = true
    $('.enter_reply .reply input')[0].disabled = false
    // Замена END
    
    $(document).off('click', '.enter_reply .enter, .enter_reply .reply');
    $(document).off('click', '.enter_reply .enter input, .enter_reply .reply input');
    is_already_enable_blocks = false;
    
    if( reply_on == 0 ){
      $('.enter_reply .reply').toggleClass('active');
      // $('.enter_reply .reply input').iCheck('check'); // старая
  
      // Замена START
      $('.enter_reply .reply input')[0].checked = true
      // Замена END
    }
  }
  
  if( val_reply == 0 ){
    if( reply_on == 1 ){
      $('.enter_reply div.reply').toggleClass('active');
      // $('.enter_reply .reply input').iCheck('uncheck'); // старая
  
      // Замена START
      $('.enter_reply .reply input')[0].checked = false
      // Замена END
      
    }
    // $('.enter_reply .reply input').iCheck('disable'); // старая
    // $('.enter_reply .enter input').iCheck('enable'); // старая
  
    // Замена START
    $('.enter_reply .reply input')[0].disabled = true
    $('.enter_reply .enter input')[0].disabled = false
    // Замена END
    
    $(document).off('click', '.enter_reply .enter, .enter_reply .reply');
    $(document).off('ifClicked', '.enter_reply .enter input, .enter_reply .reply input');
    is_already_enable_blocks = false;
    if( enter_on == 0 ){
      $('.enter_reply .enter').toggleClass('active');
      // $('.enter_reply .enter input').iCheck('check'); // старая
  
      // Замена START
      $('.enter_reply .enter input')[0].disabled = true // добавил. Этого небыло изначально
      $('.enter_reply .enter input')[0].checked = true
      // Замена END
      
    }
  }
  
  if( val_enter > 0 && enter_on > 0 ){
    // $('.enter_reply .enter input').iCheck('check'); // старая
    // Замена START
    $('.enter_reply .enter input')[0].disabled = true // добавил. Этого небыло изначально
    $('.enter_reply .enter input')[0].checked = true
    // Замена END
    
  }
  
  if( val_reply > 0 && reply_on > 0 ){
    // $('.enter_reply .reply input').iCheck('check'); // старая
    // Замена START
    $('.enter_reply .reply input')[0].checked = true
    // Замена END
    
  }
  
  if( val_enter > 0 && val_reply > 0 ){
    if( !is_already_enable_blocks ){
      enableBlocks();
    }
    
    // $('.enter_reply .enter input').iCheck('enable'); // старая
    // $('.enter_reply .reply input').iCheck('enable'); // старая
  
    // Замена START
    $('.enter_reply .enter input')[0].disabled = false
    $('.enter_reply .reply input')[0].disabled = false
    // Замена END
    
    if( enter_on == 0 && reply_on == 0 ){

      $('.enter_reply div.enter').toggleClass('active');
      // $('.enter_reply .enter input').iCheck('check'); // старая
  
      // Замена START
      $('.enter_reply .enter input')[0].checked = true
      // Замена END
      
    }
  }
}
