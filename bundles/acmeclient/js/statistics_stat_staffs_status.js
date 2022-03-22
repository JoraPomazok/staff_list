let statusHtmlArr = [];
let statusFixedHtmlArr = [];
let fillGraphHtmlArr = [];
let itemConfigArr = [];
let intervalsArr = [];
let onlineTime = 0;
let offlineTime = 0;
let months_arr =[Translate('common/january_'),Translate('common/february_'),Translate('common/march_'),Translate('common/april_'),Translate('common/may_'),Translate('common/june_'),Translate('common/july_'),Translate('common/august_'),Translate('common/september_'),Translate('common/october_'),Translate('common/november_'),Translate('common/december_')];
let week_arr = [Translate('common/monday_'),Translate('common/tuesday_'),Translate('common/wednesday_'),Translate('common/thursday_'),Translate('common/friday_'),Translate('common/saturday_'),Translate('common/sunday_')];
// let week_arr = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

$(document).ready(function(){
    ShowMessagePeriod()
    UpdateStatusList()

    $(document).on('click', '.js_st_info_collapse', function(e){
        e.preventDefault();
        let $this = $(this);
        let text = $(this).text()
        $(this).parents('.st_tr__info_inner').toggleClass('full')

        $this.parents('.st_tr__info').css('height', $this.parents('.st_tr__info_inner').outerHeight()+'px')

        text == Translate('statistics_stat_staffs_status_js/detailed') ? $(this).text(Translate('statistics_stat_staffs_status_js/collapse')) : $(this).text(Translate('statistics_stat_staffs_status_js/detailed'));
    })


    $(document).on('mouseenter', '.omni_custom_tooltip', function() {
        if($(this).hasClass('omni_custom_tooltip--center')) {
            let width = 0;
            let m_t = 0;
            const topOffset = 9;
            let targetWidth = $(this).outerWidth();
            let tooltipWidth = $('.omni_absolute_tt').outerWidth();
            let tooltipHeight = $('.omni_absolute_tt').outerHeight();

            m_t = -1*(tooltipHeight + topOffset)

            if(targetWidth >= tooltipWidth) {
                width = targetWidth/2 - tooltipWidth/2;
            } else {
                width = -1 * (tooltipWidth/2 - targetWidth/2);
            }
            $('.omni_absolute_tt').css('margin-left', width+'px')
            $('.omni_absolute_tt').css('margin-top', m_t+'px')
        }
    })


    // $('#f_period').chosen().on('change', function(){
    //     // let periodVal = $(this).val();


    //     // location.reload(); //todo без перезагрузки data не меняется
    // })
});

function UpdateStat(new_data)
{
    data_stat = new_data;
    ShowMessagePeriod();
    UpdateStatusList();

}

function TableScroll() {
    // jquery.scrollbar for tables
    let target = $('.statistic_table');

    target.each( function(id, el) {
        let $this = $(el);

        if(!$this.parents('.scrollbar-inner').length
        && $($this).parents('.request-area').outerWidth() < $($this).outerWidth()) {
            $this.wrap("<div class='scrollbar-inner'></div>");
        }

    })
    $('.scrollbar-inner').scrollbar({
        'scrollx': "simple",
        "onScroll": function(y, x){
            target.find('.st_tr__info_inner').css('padding-left', x.scroll + 'px');
        }
    });

    let temp_container = $('.scroll-wrapper');
    temp_container.each( function(id, el) {
        while($(el).parents('.scroll-wrapper').length) {
            $(el).unwrap();
            $(el).parents('.scroll-wrapper').removeClass('scroll-content');
        }
    })
}

function TableScrollReset(){
    $('.scrollbar-inner').scrollbar('destroy');
    setTimeout(function() {
        TableScroll();
    }, 1)
}



function ShowMessagePeriod() {
    let periodType = GetPeriodType();

    if(periodType == 'year') {
        $('.js_message_long_period').fadeIn(500)
    } else {
        $('.js_message_long_period').fadeOut(500)
    }
};

function FixGraph() {
    let periodType = GetPeriodType();

    if(periodType == 'year') {
        $('.st_tr__header, .st_tr__graph').hide();
    }
}

function ConvertUnixTime(time, tooltip, status_time) {
    let unix_timestamp = time+current_period.offset

    let date = new Date(unix_timestamp*1000);
    let year = date.getUTCFullYear();
    let month = months_arr[date.getUTCMonth()];
    let day = date.getUTCDate();
    let hours = date.getUTCHours();
    let minutes = "0" + date.getUTCMinutes();
    let seconds = "0" + date.getUTCSeconds();
    let dayWeek = date.getUTCDay() == 0 ? week_arr[6] : week_arr[date.getUTCDay() - 1];
    let monthCount = date.getUTCMonth();
    // Display date time in MM-dd-yyyy h:m:s format
    // let formattedTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    let periodType = GetPeriodType();

    // todo Настроить formattedTime
    if (periodType == 'day') {
        if(tooltip) {
            // formattedTime = hours + ':' + minutes.substr(-2) + ' ' + day + '/'  + month + '/' + year;
            formattedTime = hours + ':' + minutes.substr(-2);
        } else if(status_time) {
            formattedTime = hours + Translate('leaderboard/hours')+' ' + minutes.substr(-2) + Translate('leaderboard/minutes')+' ' + seconds.substr(-2)+ Translate('leaderboard/seconds');
        } else {
            formattedTime = hours;
        }
    } else if(periodType == 'week' || periodType == 'month') {
        // formattedTime = !tooltip ? dayWeek : hours + ':' + minutes.substr(-2) + ' ' + dayWeek +' '+ day + '/'  + month + '/' + year;
        if(tooltip) {
            formattedTime = periodType == 'week' ? dayWeek + ', ' + hours + ':' + minutes.substr(-2) : day + ' '  + month + ', ' + hours + ':' + minutes.substr(-2);
        } else if(status_time) {
            formattedTime = day + Translate('common/day')+' ' + hours + Translate('leaderboard/hours')+' ' + minutes.substr(-2) + Translate('leaderboard/minutes')+' ' + seconds.substr(-2)+ Translate('leaderboard/seconds');
        } else {
            formattedTime = dayWeek;
        }
    } else if(periodType == 'year') {
        let weekCount = 0;
        let dayCount = day;
        if(monthCount > 0) {
            if(weekCount > 0) {
                weekCount = Math.trunc(day / 7);
                dayCount = day - weekCount * 7;
                formattedTime = monthCount + Translate('leaderboard/minutes')+' ' + weekCount + Translate('common/week_')+' ' + dayCount + Translate('common/day');
            } else {
                formattedTime = monthCount + Translate('leaderboard/minutes')+' ' + dayCount + Translate('common/day');
            }
        } else if(weekCount > 0) {
            weekCount = Math.trunc(day / 7);
            dayCount = day - weekCount * 7;
            if(dayCount > 0) {
                formattedTime = weekCount + Translate('common/week_')+' ' + dayCount + Translate('common/day');
            } else {
                formattedTime = weekCount + Translate('common/week_');
            }
        } else {
            formattedTime = dayCount + Translate('common/day');
        }
    }
    // console.log(formattedTime);
    return formattedTime
}


function GetStatus(arr) {
    statusHtmlArr = [];

    let sortableArr = Object.fromEntries(Object.entries(Object.entries(arr).sort(([,a],[,b]) => b-a))) // b - a От большего к меншему

    // console.log(sortableArr)
    for(let id in sortableArr) {
        let status_id = sortableArr[id][0]
        let isOffline = 2;
        // let unixTime = sortableArr[id][1];
        // let time = ConvertUnixTime(unixTime, false, true)
        let time = convertTime(sortableArr[id][1]);

        let title = status_list[status_id] ? status_list[status_id].title : console.log('Error - status_list');
        let color = status_list[status_id] ? status_list[status_id].color : console.log('Error - status_list');

        if(parseInt(status_id) !== isOffline) {
            let statusHtml = '<div class="status_element" data-status-id="'+status_id+'">'+
                                '<i class="status-color" style="background-color: '+color+';"></i>'+
                                '<span class="status-name">'+title+':</span>'+
                                '<span class="status-time cl--green">'+time+'</span>'+
                            '</div>'
            statusHtmlArr.push(statusHtml)
        }
    }
    return statusHtmlArr
}

function GetStatusFixed(arr) {
    let totalTime = ActivityCalcHelper(arr);
    let isOffline = 2;
    statusFixedHtmlArr = [];
    onlineTime = 0;
    offlineTime = 0;

    if(totalTime == 0) {
        return
    }

    if(totalTime == 0){
        onlineTime = '-'
    } else {
        onlineTime = convertTime(totalTime)
    }

    // console.log(arr[isOffline])
    let hideOfflineTime = typeof arr[isOffline] == typeof undefined ? 'style="display:none"' : '';
    offlineTime = typeof arr[isOffline] == typeof undefined ? '---' : convertTime(arr[isOffline], false, true);

    let html = '<div class="fixed">'+
                    '<div class="fixed_el" data-status-type="offline" '+ hideOfflineTime +'>'+
                        Translate('statistics_stat_staffs_status_js/offline')+': <span class="cl--gray">'+offlineTime+'</span>'+
                    '</div>'+
                    '<div class="fixed_el" data-status-type="online">'+
                        Translate('statistics_stat_staffs_status_js/activity')+': <span class="cl--green">'+onlineTime+'</span>'+
                    '</div>'+
                '</div>'

    return statusFixedHtmlArr.push(html)
}

function HelperGraphItemConfig(time, fromTimeTarget) {
    // todo Cделать width, left для всех типов периодов
    let periodVal = $('#f_period').val();
    let periodType = GetPeriodType();
    let additionalTimePeriod = 1; // начальное значение 1 - тоесть сутки(24 часа), дальше мы его делим на periodType

    // todo additionalTimePeriod
    if(periodType == 'week') {
        additionalTimePeriod = 7
        fromTimeTarget += current_period.offset
        // time += current_period.offset
    } else if(periodType == 'month') {
        additionalTimePeriod = GetMonthMaxDay()
        fromTimeTarget += current_period.offset - (periodVal !== "last_30" && periodVal !== "last_14" ? 86400 : 0); // ??? надо ли
    }

    let unix_timestamp = time;
    let date = new Date(unix_timestamp * 1000);
    let day = date.getUTCDate();
    let hours = date.getUTCHours();
    let minutes =  date.getUTCMinutes();
    let width = 0;
    let left = 0;

    itemConfigArr = [];

    if(day > 1 && periodType !== 'day') {
        if(hours > 0 || minutes > 0) {
            day--;
        }
        let perDay = parseFloat(day / additionalTimePeriod * 100)
        let perHour = parseFloat((hours / 24 / additionalTimePeriod * 100))
        let perMin = parseFloat(((minutes / 60) / 24 / additionalTimePeriod * 100))
        width = parseFloat(perDay) + parseFloat(perHour) + parseFloat(perMin);
    } else if(hours >= 1) {
        let perHour = parseFloat((hours / 24 / additionalTimePeriod * 100))
        let perMin = parseFloat(((minutes / 60) / 24 / additionalTimePeriod * 100))
        width = parseFloat(perHour) + parseFloat(perMin);
    } else if (minutes > 0) {
        width = parseFloat(((minutes / 60) / 24 / additionalTimePeriod * 100));
    }

    // console.log(hours+':'+minutes)

    // calc left offset
    let startTimePeriod;
    if(periodType == 'day') {
        startTimePeriod = HelperTruncHours(current_period.from);
    } else if(periodType == 'week') {
        startTimePeriod = HelperTruncDay(current_period.from);
    } else if(periodType == 'month') {
        startTimePeriod = HelperTruncDay(current_period.from);
    }

    // console.log(fromTimeTarget, startTimePeriod)

    let diffTimeUnix = fromTimeTarget - startTimePeriod;
    // console.log(diffTimeUnix)
    if(diffTimeUnix !== 0) {
        // debugger
        let date2 = new Date(diffTimeUnix * 1000);
        let day2 = date2.getUTCDate();
        let hours2 = date2.getUTCHours();
        let minutes2 =  date2.getUTCMinutes();
        if(day2 >= 1 && periodType !== 'day') { // day2 >= 1 ---- '>=' не было для day(>), но добавил на week(>=), если что сделать отдельным условием
            let perLeftExp = periodVal == "thisweek" || periodVal == "week" || periodVal == "thismonth" // ??? возможно надо будет добавить с month_1 по month_-6
            if(perLeftExp) { // ??? хз почему, именно для них количество дней надо - 2
                day2-=2;
            } else if(hours2 > 0 || minutes2 > 0) {
                day2--;
            }
            let perDay = parseFloat(day2 / additionalTimePeriod * 100)
            let perHour = parseFloat((hours2 / 24 / additionalTimePeriod * 100))
            let perMin = parseFloat(((minutes2 / 60) / 24 / additionalTimePeriod * 100))
            left = parseFloat(perDay) + parseFloat(perHour) + parseFloat(perMin);
        } else {
            let perHour = parseFloat((hours2 / 24 / additionalTimePeriod * 100))
            let perMin = parseFloat(((minutes2 / 60) / 24 / additionalTimePeriod * 100))
            left = parseFloat(perHour) + parseFloat(perMin);
        }
    }

    // console.log(hours2+':'+minutes2)

    let res = (hours > 0 || minutes > 0) ? itemConfigArr.push(width, left) : null

    // console.log(res);
    return res
}

function FillGraph(arr) {
    // todo Настроить количество ячеек и положение заполненных ячеек + временной интервал
    fillGraphHtmlArr = [];

    Period();

    // округляем значение интервала, если оно больше временной шкалы
    let lastPeriodTstamp = 0;
    let periodType = GetPeriodType();
    if(periodType == 'day') {
        lastPeriodTstamp = HelperCeilHours(parseFloat($('.st_tr.st_tr__header .st_td:last').attr('tstamp')) + 3600);
    } else if(periodType == 'week') {
        lastPeriodTstamp = parseFloat($('.st_tr.st_tr__header .st_td:last').attr('tstamp')) + 86400 - current_period.offset;
    } else if(periodType == 'month') {
        lastPeriodTstamp = parseFloat($('.st_tr.st_tr__header .st_td:last').attr('tstamp')) + 86400; // возможно + 86400 только для такого (periodVal !== "last_30" && periodVal !== "last_14" ? 86400 : 0)
    } else if(periodType == 'year') {
        return fillGraphHtmlArr
    }

    // console.log(intervalsArr)

    fillGraphHtmlArr = intervalsArr;

    for(let elem in arr) {
        let from = arr[elem].from;
        let fromConv = ConvertUnixTime(from, true);
        let originalTo = arr[elem].to;
        let to = originalTo; // ??? надо ли выводить в подсказку реальное значение конечного периода
        if(to > lastPeriodTstamp) {
            to = lastPeriodTstamp
        }
        let toConv = ConvertUnixTime(to, true);
        let id = arr[elem].status_id;
        let color = status_list[id] ? status_list[id].color : console.log('Error - status_list');
        let status = status_list[id] ? status_list[id].title : console.log('Error - status_list');
        let isOffline = arr[elem].status_id == 2;
        let targetInterval = to - from;

        if(targetInterval > 0 && !isOffline) {
            HelperGraphItemConfig(targetInterval, from);

            if(itemConfigArr.length){
                // console.log(itemConfigArr);

                let tdCountConfig = itemConfigArr[0]
                let width = tdCountConfig+'%'
                let left = itemConfigArr[1]+'%'

                let html = '<div class="fill" style="width:'+width+'; background-color:'+color+'; left:'+left+';" fromtstamp="'+from+'" totstamp="'+originalTo+'">'+
                            '<span class="omni_custom_tooltip omni_custom_tooltip--center" data-tt="absolute" data-tt-class="statistic_table_tooltip"'+
                            'data-title ="<strong>'+status+':</strong> '+fromConv+' - '+toConv+'"></span></div>'
                fillGraphHtmlArr.push(html)
            }
        } else {
            console.log('временной интервал <= 0')
        }

    }

    return fillGraphHtmlArr
}

function HelperTruncHours(startTimePeriod) { // если больше ровного значения, пример: 18:23, начинаем с 18, сетка разбита на целые временные промежутки
    let resUnix = 0;
    let tempData = new Date(startTimePeriod * 1000)

    if(tempData.getUTCMinutes() > 0) {
        tempData.setUTCHours(tempData.getUTCHours() + Math.trunc(tempData.getUTCMinutes()/60));
        tempData.setUTCMinutes(0, 0, 0);
        resUnix = tempData.getTime() / 1000;
    } else {
        resUnix = startTimePeriod;
    }

    return resUnix;
}

function HelperCeilHours(startTimePeriod) { // если больше ровного значения, пример: 18:23, начинаем с 19, сетка разбита на целые временные промежутки
    let resUnix = 0;
    let tempData = new Date(startTimePeriod * 1000)

    if(tempData.getUTCMinutes() > 0) {
        tempData.setUTCHours(tempData.getUTCHours() + Math.ceil(tempData.getUTCMinutes()/60));
        tempData.setUTCMinutes(0, 0, 0);
        resUnix = tempData.getTime() / 1000;
    } else {
        resUnix = startTimePeriod;
    }

    return resUnix;
}

function HelperTruncDay(startTimePeriod) { // если больше ровного значения, пример: 18:23, начинаем с 00:00, сетка разбита на целые временные промежутки
    let resUnix = 0;
    let tempData = new Date(startTimePeriod * 1000)

    if(tempData.getUTCHours() > 0) {
        tempData.setUTCHours(0, 0, 0);
        resUnix = tempData.getTime() / 1000;
    } else {
        resUnix = startTimePeriod;
    }

    return resUnix;
}

function GetPeriodType() {
    let periodType = '';
    let periodVal = $('#f_period').val();
    let day = periodVal == "last_24" || periodVal == "today" || periodVal == "day"
    let week = periodVal == "last_7" ||  periodVal == "thisweek" || periodVal == "week"
    let month = periodVal == "last_14" || periodVal == "last_30" || periodVal == "thismonth" || periodVal == "month_1" || periodVal == "month_-2" || periodVal == "month_-3" || periodVal == "month_-4" || periodVal == "month_-5" || periodVal == "month_-6"
    let year = periodVal == "month_3" || periodVal == "month_6" || periodVal == "thisyear" || periodVal == "year"

    if(day) {
        periodType = 'day'
    } else if(week) {
        periodType = 'week'
    } else if(month) {
        periodType = 'month'
    } else if(year) {
        periodType = 'year'
    }

    return periodType
}

function GetMonthMaxDay() {
    let periodVal = $('#f_period').val();

    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth();
    let lastDay = 0;

    if(periodVal == "last_14") {
        lastDay = 14;
    } else if(periodVal == "last_30") {
        lastDay = new Date(y, m, 0).getDate();
    } else if(periodVal == "thismonth") {
        lastDay = new Date(y, m+1, 0).getDate();
    } else if(periodVal == "month_1") {
        lastDay = new Date(y, m, 0).getDate();
    } else if(periodVal == "month_-2") {
        lastDay = new Date(y, m-1, 0).getDate();
    } else if(periodVal == "month_-3") {
        lastDay = new Date(y, m-2, 0).getDate();
    } else if(periodVal == "month_-4") {
        lastDay = new Date(y, m-3, 0).getDate();
    } else if(periodVal == "month_-5") {
        lastDay = new Date(y, m-4, 0).getDate();
    } else if(periodVal == "month_-6") {
        lastDay = new Date(y, m-5, 0).getDate();
    }

    return lastDay;
}

function HelperMonthPeriodFor(max, i) {
    let periodVal = $('#f_period').val();

    let res = 0;
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth();
    let day = date.getDate();

    if(periodVal == "last_14") {
        res = new Date(y, m, day - max + i);
    } else if(periodVal == "last_30") {
        res = new Date(y, m, day - max + i); // ??? неверные входящие данные, должно быть как в last_14
    } else if(periodVal == "thismonth") {
        res = new Date(y, m, i);
    } else if(periodVal == "month_1") {
        res = new Date(y, m-1, i);
    } else if(periodVal == "month_-2") {
        res = new Date(y, m-2, i);
    } else if(periodVal == "month_-3") {
        res = new Date(y, m-3, i);
    } else if(periodVal == "month_-4") {
        res = new Date(y, m-4, i);
    } else if(periodVal == "month_-5") {
        res = new Date(y, m-5, i);
    } else if(periodVal == "month_-6") {
        res = new Date(y, m-6, i);
    }

    return res
}

function Period(targetWrap) {
    let step;
    let emptyTd = false;
    intervalsArr = [];

    if(!current_period) {
        return
    }

    if(targetWrap) {
        emptyTd = true
    }

    let from = HelperTruncHours(current_period.from); // возможно надо округлить к меньшему
    let to = current_period.to; // возможно надо округлить к большему

    let periodType = GetPeriodType();

    // ??? step возможно надо сделать step = current_period.offset
    if (periodType == 'day') {
        step = 3600;
        intervalsArr = HelperPeriodFor(from, to, step, 24, emptyTd)
    } else if(periodType == 'week') {
        from = HelperTruncDay(current_period.from + current_period.offset)
        step = 86400;
        intervalsArr = HelperPeriodFor(from, to, step, 7, emptyTd)
    } else if(periodType == 'month') {
        let maxDay = GetMonthMaxDay();
        step = 86400;
        intervalsArr = HelperPeriodFor(from, to, step, maxDay, emptyTd)
    } else if(periodType == 'year') {
        return
    }

    // вставка контента в таблицу
    if(targetWrap) {
        targetWrap.append(intervalsArr.join(''))
    }
    return intervalsArr
}

function HelperPeriodFor(from, to, step, max, notEmptyTd) {
    let periodHtmlArr = [];

    let periodType = GetPeriodType();

    // todo Настроить title
    let title = '';

    for (let i = 1; i<=max; i++) {
        if (periodType == 'day') {
            temp = ConvertUnixTime(from);
            if(temp < 10) {
                title = '0'+(temp)+Translate('leaderboard/hours')
            } else {
                title = temp+Translate('leaderboard/hours')
            }
        } else if(periodType == 'week') {
            title = ConvertUnixTime(from)
        } else if(periodType == 'month') {
            // console.log(HelperMonthPeriodFor(max, i))
            title = HelperMonthPeriodFor(max, i).getDate();
        }

        let html = '<div class="st_td" tstamp="'+from+'">'+( notEmptyTd ? title : '')+'</div>'
        periodHtmlArr.push(html)
        from += step
    }
    return periodHtmlArr
}

function UpdateStatusList() {
    if(!status_list && !data_stat) {
        return
    }

    // console.log(status_list)
    // console.log(data_stat)


    let HtmlArr = [];

    // очистка таблицы
    $('.st_tr__group').remove()
    $('.st_tr__header .st_td').remove()

    // период
    Period($('.st_tr__header'))


    data_stat = getActivitySorted();

    // tr таблицы
    for(let elem in data_stat) {
        let full_name = data_stat[elem][1].full_name;
        let status_time = data_stat[elem][1].summary;
        let graph_data = data_stat[elem][1].data;

        if(!Object.keys(status_time).length)
        {
            continue;
        }

        // статусы
        GetStatus(status_time);
        GetStatusFixed(status_time);

        // graph
        FillGraph(graph_data)
        let btn_more = statusHtmlArr.length ? '(<a href="#" class="js_st_info_collapse cl--blue">'+Translate('statistics_stat_staffs_status_js/detailed')+'</a>)' : '';

        let html = '<div class="st_tr st_tr__group"  data-user-id="'+elem+'">'+
                        '<div class="st_tr st_tr__info">'+
                            '<div class="st_tr__info_inner clearfix">'+
                                '<div>'+
                                    '<span>'+full_name+'</span> '+ btn_more +
                                '</div>'+
                                '<div>'+
                                    statusFixedHtmlArr.join('')+
                                    statusHtmlArr.join('')+
                                '</div>'+
                            '</div>'+
                        '</div>'+

                        '<div class="st_tr st_tr--border st_tr__graph">'+
                            fillGraphHtmlArr.join('')+
                        '</div>'+
                    '</div>';

        HtmlArr.push(html)
    }

    // вставка контента в таблицу
    $('.statistic_table').append(HtmlArr.join(''))

    FixGraph();
}

function convertTime(time) {
    var timeGet = time;
    var days;
    var hours;
    var hoursAll;
    var minutes;
    var seconds;
    let formattedTime;

    days = parseInt(timeGet/86400);
    hours = parseInt((timeGet - days*86400)/3600);
    hoursAll = parseInt(timeGet / 3600);
    minutes = parseInt((timeGet - days*86400 - hours*3600)/60);
    seconds = timeGet - days*86400 - hours*3600 - minutes*60;

    // let periodType = GetPeriodType();

    if (days >= 0 && days < 10) days = '0' + days;
    // if (hours >= 0 && hours < 10) hours = '0' + hours;
    if (hoursAll >= 0 && hoursAll < 10) hoursAll = '0' + hoursAll;
    if (minutes >= 0 && minutes < 10) minutes = '0' + minutes;
    if (seconds >= 0 && seconds < 10) seconds = '0' + seconds;

    // if (periodType == 'day') {
        // formattedTime = hours + 'ч ' + minutes + 'м ' + seconds + 'с';
    // } else if(periodType == 'week' || periodType == 'month' || periodType == 'year') {
        // formattedTime = days + 'дн ' + hours + 'ч ' + minutes + 'м ';
    // }

    formattedTime = hoursAll + Translate('leaderboard/hours')+' ' + minutes + Translate('leaderboard/minutes')+' ' + seconds + Translate('leaderboard/seconds');


    return formattedTime
}

function ActivityCalcHelper(arr) {
    let totalTime = 0;
    let isOffline = 2;

    for(let id in arr) {
        if(parseInt(id) !== isOffline) {
            let unixTime = arr[id];
            totalTime += unixTime
        }
    }
    return totalTime
}

function getActivitySorted() {
    if(!data_stat) {
        return
    }

    for(let elem in data_stat) {
        let status_time = data_stat[elem].summary;

        data_stat[elem].summaryTotal = ActivityCalcHelper(status_time);
    }

    // console.log(data_stat)

    let sortableArr = Object.entries(data_stat).sort(function(a, b) {
        return parseFloat(b[1].summaryTotal) - parseFloat(a[1].summaryTotal);
    });

    let orderedObj = {};
    sortableArr.forEach(function(key, i) {
        orderedObj[i] = Object.fromEntries(Object.entries(key));
    });

    // console.log(orderedObj);
    return orderedObj
}
