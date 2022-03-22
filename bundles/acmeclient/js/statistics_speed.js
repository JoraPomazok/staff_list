$(document).ready(function () {

    // Первоначальное состояние
    basicColor = '#6ccddf';
    basicTextColor = '#2daac1';
    currentAnswer = 'first_answer';

    if (typeof no_stat !== "undefined" && no_stat == true) {
        NoInformation('no_stat');
    } else {
        currentEnter = cur_first_answer;
        currentIntervar = first_answer_interval;

        if (currentEnter.length == 0 && !json_blocks.cnt_speed_closed) {
            NoInformation('no_info');
        } else {
            genTable(currentEnter, summary(currentEnter), currentIntervar, basicColor, basicTextColor);

            BlockInitialisation();
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

function BlockInitialisation() {
    $(document).on('click', '.answer_speed .first_answer, .answer_speed .closed_answer, .answer_speed .closed_stuff', function () {
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        currentAnswer = $(this).attr('data-open');
        basicColor = $(this).attr('data-color');
        basicTextColor = $(this).attr('data-color-text');
        clearTable();
        currentEnter = eval('cur_' + currentAnswer);
        currentIntervar = eval(currentAnswer + '_interval');
        genTable(currentEnter, summary(currentEnter), currentIntervar, basicColor, basicTextColor);
    });
}

// Отслеживание состояний информационных блоков
function BlockStatus() {
    BlockInitialisation();

    $('.' + currentAnswer).addClass('active');

    clearTable();

    currentEnter = eval('cur_' + currentAnswer);
    currentIntervar = eval(currentAnswer + '_interval');
    genTable(currentEnter, summary(currentEnter), currentIntervar, basicColor, basicTextColor);
}

// Отображение изменения общих данных и процентов
function ChangeBlocksPercent(json_data) {
    var icon_level = 'no_trend';
    var percent_speed = 0;

    var cnt_hours = parseInt(json_data.cnt_speed_first / 3600);
    var cnt_min = Math.round((json_data.cnt_speed_first - cnt_hours * 3600) / 60);
    if (json_data.cnt_speed_first > 0
    && json_data.cnt_speed_first < 60)
    {
        cnt_min = 1;
    }
    if(json_data.percent_speed_first == '-') {
        percent_speed = 0;
    } else {
        if (json_data.percent_speed_first > 0) {
            icon_level = 'fas fa-level-up-alt negative_trend';
        }
        if (json_data.percent_speed_first < 0) {
            icon_level = 'fas fa-level-down-alt positive_trend';
        }
        percent_speed = Math.abs(json_data.percent_speed_first);
    }
    $('.answer_speed .first_answer h2').html(cnt_hours + '<span class="word">'+Translate('leaderboard/hours')+'</span> ' + cnt_min + '<span class="word">'+Translate('leaderboard/minutes')+'</span><span class="icon ' + icon_level + '"><i>' + percent_speed + '%</i></span>');

    icon_level = 'no_trend';
    if (json_data.percent_speed_answers == '-') {
        percent_speed = 0;
    } else {
        if (json_data.percent_speed_answers > 0) {
            icon_level = 'fas fa-level-up-alt negative_trend';
        }
        if (json_data.percent_speed_answers < 0) {
            icon_level = 'fas fa-level-down-alt positive_trend';
        }
        percent_speed = Math.abs(json_data.percent_speed_answers);
    }
    $('.answer_speed .closed_answer h2').html('<span class="number">' + json_data.cnt_speed_answers + '</span><span class="icon ' + icon_level + '"><i>' + percent_speed + '%</i></span>');

    icon_level = 'no_trend';
    cnt_hours = parseInt(json_data.cnt_speed_closed / 3600);
    cnt_min = Math.round((json_data.cnt_speed_closed - cnt_hours * 3600) / 60);
    if (cnt_min == 60) {
        cnt_hours++;
        cnt_min = 0;
    }
    if(json_data.cnt_speed_closed > 0
    && json_data.cnt_speed_closed < 60)
    {
        cnt_min = 1;
    }
    if (json_data.percent_speed_close == '-') {
        percent_speed = 0;
    } else {
        if (json_data.percent_speed_close > 0) {
            icon_level = 'fas fa-level-up-alt negative_trend';
        }
        if (json_data.percent_speed_close < 0) {
            icon_level = 'fas fa-level-down-alt positive_trend';
        }
        percent_speed = Math.abs(json_data.percent_speed_close);
    }
    $('.answer_speed .closed_stuff h2').html(cnt_hours + '<span class="word">'+Translate('leaderboard/hours')+'</span> ' + cnt_min + '<span class="word">'+Translate('leaderboard/minutes')+'</span><span class="icon ' + icon_level + '"><i>' + percent_speed + '%</i></span>');

    if (json_data.cnt_speed_answers == 0 || json_data.cnt_speed_closed == 0) {
        $(document).off('click', '.answer_speed .first_answer, .answer_speed .closed_answer, .answer_speed .closed_stuff');

        $('.answer_speed .first_answer').addClass('active');
        $('.answer_speed .first_answer').siblings().removeClass('active');
        currentAnswer = $('.answer_speed .first_answer').attr('data-open');
        basicColor = $('.answer_speed .first_answer').attr('data-color');
        basicTextColor = $('.answer_speed .first_answer').attr('data-color-text');
        clearTable();
        currentEnter = eval('cur_' + currentAnswer);
        currentIntervar = eval(currentAnswer + '_interval');
        genTable(currentEnter, summary(currentEnter), currentIntervar, basicColor, basicTextColor);
    }
    if( cur_first_answer.length == 0 && json_blocks.cnt_speed_closed ){
        $('.answer_speed .closed_stuff').click();
    }

}
