var nr_added_holidays = 0;
var nr_added_schedule = 0;
var days_arr = ['-', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

let holidaySelectDay, naborDiv;

$(document).ready(function () {
  // Получаем Li
  holidaySelectDay = document.querySelector(".holidaysRow");
  holidaySelectDay = holidaySelectDay.cloneNode(true);

  // naborDiv = $('.nabor_default').first();
  // naborDiv = naborDiv.clone();
  isInitSelect()

    //переключение между вкладками
  $('.h_button a').click(function () {

    switch_tabs($(this));
    isInitSelect()
    return false;
  });

  /* Блок по обработке рабочего времени */
  $(document).on('change', '.choices', function () {
    var schedule_row = $(this).closest('.hourRow');
    CountSheduleTime(schedule_row);
  });

  $('.hourRow').each(function () {
    var schedule_row = $(this);
    CountSheduleTime(schedule_row);
  });

  $(document).on('click','.addSchedule a',function() {
    var parent;
    var parent_ = parent = $(this).parents('.hourContent');
    var b_nabor = false;
    if(parent.find('.nabor').length)
    {
      parent = $(this).parents('.nabor');
      b_nabor = true;
      var nabor_n = parent.parent().find('.nabor:not(.nabor_default)').index(parent);

    }
    nr_added_schedule++;
    var new_schedule_row = parent_.find('.schedule_row_default').clone();
    new_schedule_row.removeClass('schedule_row_default');
    new_schedule_row.attr("style", "display: flex")

    var new_schedule_id = new_schedule_row.attr('id');
    new_schedule_id = new_schedule_id.replace('default', 'new_'+nr_added_schedule);
    new_schedule_row.attr('id', new_schedule_id);

    new_schedule_row.find('select').each(function() {
      var tmp_id = $(this).attr('name');

      tmp_id = tmp_id.replace('default', 'new_'+nr_added_schedule);
      if(b_nabor)
      {
        tmp_id = tmp_id.replace('[new]', '['+nabor_n+']');
      }
      $(this).attr('name', tmp_id);
    })

    //РѕРїСЂРµРґРµР»СЏРµРј РїРѕСЃР»РµРґРЅРёР№ РІС‹Р±СЂР°РЅРЅС‹Р№ РґРµРЅСЊ
    var last_work_day_nr = 0;
    var last_work_start = 540;
    var last_work_end = 1080;
    $('.select-day').each(function() {
      var selecect_name = $(this).attr('name');
      if(selecect_name.indexOf('default')==-1) {
        var day_str = $(this).val();
        for(var i=0; i<days_arr.length; i++) {
          if(day_str==days_arr[i]) {
            if(i>last_work_day_nr) {
              last_work_day_nr = i;

              var parent_div = $(this).closest('.hourRow');
              last_work_start = parent_div.find('.counter-select').first().val();
              last_work_end = parent_div.find('.counter-select').last().val();
            }
          }
        }
      }
    })

    parent.find('.hourList').append(new_schedule_row);

    if(last_work_day_nr) {
      if(last_work_day_nr<7) {
        last_work_day_nr++;
      }
      var last_work_day = days_arr[last_work_day_nr];
      $('#'+new_schedule_id+' select.select-day').val(last_work_day);
    }
    $('#'+new_schedule_id+' select.counter-select').first().val(last_work_start);
    $('#'+new_schedule_id+' select.counter-select').last().val(last_work_end);

    CountSheduleTime($('#'+new_schedule_id));

    const elements = document.querySelectorAll(`#${new_schedule_id} select`)
    choicesInit(elements, {searchEnabled: false, shouldSort: false, itemSelectText: ''});
    SelectNano(`#${new_schedule_id}`)
    return false;
  })

  $(document).on('click', '.hourRow .remove', function () {
    $(this).closest('.hourRow').remove();
    return false;
  });

  /* Блок по обработке праздников */

  sortEvent()
  choicesInit('.holidaysList select', {searchEnabled: false, shouldSort: false, itemSelectText: ''});

  $(document).on('click','.holidaysRow .remove',function () {

      const quanityEvent = document.querySelectorAll('.holidaysList .holidaysRow');
    if (quanityEvent.length <= 1) {
      const holidaysList = document.querySelector('.holidaysList');
      holidaysList.insertAdjacentHTML("afterbegin", `<li class="holidaysRow normalRow -none" data-month="1.01">`)
    }

    $(this).closest('.holidaysRow').remove();
    return false;
  });
  editApply();

    $(document).on('click','.addHoliday a',function () {

        var new_holiday = $('#new_holiday').html();
        var replace_select = /<select/g;
        new_holiday = new_holiday.replace(replace_select, '<select class="mySelect"');
        nr_added_holidays++;
        var replace_id = /new_id/g;
        new_holiday = new_holiday.replace(replace_id, nr_added_holidays);
        $(this).parents('._holiday_nabor_js').find('.holidaysList').append(new_holiday);

        choicesInit('.holidaysList:visible li:last-child select', {searchEnabled: false, shouldSort: false, itemSelectText: ''});

        actionButton();

        // перевставляем праздник, который добавил юзер, сортируя его согласно календаря START
        (function () {
            const addButton = document.querySelector(".holidaysRow .addRow")
            const li = document.querySelector(".holidaysRow .addRow .holidaysRow[data-month]")
            if (!li) return
            addButton.addEventListener("click", () => rePastEvent(undefined))
        })();
        // перевставляем праздник, который добавил юзер, сортируя его согласно календаря END

        editApply();
        SelectNano(`.holidaysList`)
        return false;
    });
    $(document).on('click','.addHoliday_nabor a',function () {

        var parent;
        var parent_ = parent = $(this).parents('.hourContent');
        var b_nabor = false;
        if(parent.find('.nabor').length)
        {
            parent = $(this).parents('.nabor');
            b_nabor = true;
            var nabor_n = parent.parent().find('.nabor:not(.nabor_default)').index(parent);

        }


        var new_holiday = $('#new_holiday_nabor').html();
        var replace_select = /<select/g;
        new_holiday = new_holiday.replace(replace_select, '<select class="mySelect"');
        nr_added_holidays++;
        new_holiday = new_holiday.replace(/new_id_n/g, parseInt(nabor_n));
        new_holiday = new_holiday.replace(/new_id/g, nr_added_holidays);

        $(this).parents('._holiday_nabor_js').find('.holidaysList').append(new_holiday);

        choicesInit('.holidaysList:visible li:last-child select', {searchEnabled: false, shouldSort: false, itemSelectText: ''});

        actionButton();

        // перевставляем праздник, который добавил юзер, сортируя его согласно календаря START
        (function () {
            const addButton = document.querySelector(".holidaysRow .addRow")
            const li = document.querySelector(".holidaysRow .addRow .holidaysRow[data-month]")
            if (!li) return
            addButton.addEventListener("click", () => rePastEvent(undefined))
        })();
        // перевставляем праздник, который добавил юзер, сортируя его согласно календаря END

        editApply();
        SelectNano(`.holidaysList`)
        return false;
    });


    $('._js_workhours .removeNabor').toggle($('._js_workhours .removeNabor').length > 2 ? true : false);
    $('._js_workhours .addNabor').hide();
    $('._js_workhours .nabor:not(.nabor_default):last .addNabor').show();

    $('._js_holidays .removeNabor').toggle($('._js_holidays .removeNabor').length > 2 ? true : false);
    $('._js_holidays .addNabor:not(._addNabor_start)').hide();
    $('._js_holidays .nabor:not(.nabor_default):last .addNabor').show();

  // создать новый набор рабочего времени
  $(document).on('click', '.addNabor a', function () {
    let num = document.querySelectorAll(".nabor").length;
    setTimeout(() => {
      var parent = $(this).parents('.hourContent');
      var nr = parent.find('div.nabor').length;
      var new_nabor_row = parent.find('.nabor_default').clone(true);

      new_nabor_row.removeClass('nabor_default').removeClass('hidden');

      new_nabor_row.find('select').each(function () {
        var tmp_id = $(this).attr('name');
        tmp_id = tmp_id.replace('[new]', '[' + (nr - 1) + ']');
        $(this).attr('name', tmp_id);
      });

      new_nabor_row.find('input').each(function() {
        var tmp_id = $(this).attr('name');

        if (tmp_id) {
          tmp_id = tmp_id.replace('[new]', '['+(nr-1)+']');
          $(this).attr('name', tmp_id);
        }
      })

      new_nabor_row.addClass("d-flex");
      new_nabor_row.find('strong:first').html(nr + ')');
      $('.addNabor').hide();
      new_nabor_row.find('.addNabor').show();
      new_nabor_row.find('select').removeClass('default_hidden');

      let ins = new_nabor_row[0].outerHTML;
      // ins = ins.replace(/\[new\]/g, `[${num}]`)
      parent[0].insertAdjacentHTML("beforeend", ins);

      parent.find('.removeNabor').toggle(parent.find('.removeNabor').length > 2 ? true : false);

      parent.find('.nabor:last-child .hourRow').each(function () {
        var schedule_row = $(this);
        CountSheduleTime(schedule_row);
      });
      choicesInit('.nabor:not(.nabor_default) #hourList_ select', {searchEnabled: false, shouldSort: false, itemSelectText: ''});
        choicesInit('#h_rab3 .nabor:last-child .select_group_staff select', {searchEnabled: true, shouldSort: false, itemSelectText: '', removeItemButton: true });
        SelectNano(`#h_rab3`)

        choicesInit('.nabor:not(.nabor_default) .holidaysList select', {searchEnabled: false, shouldSort: false, itemSelectText: ''});
        choicesInit('#h_holiday2 .nabor:last-child .select_group_staff select', {searchEnabled: true, shouldSort: false, itemSelectText: '', removeItemButton: true });
        SelectNano(`#h_holiday2`)
    }, 1);

    return false;
  });

  // удалить этот набор
  $(document).on('click', '.removeNabor a', function () {
    var parent = $(this).parents('.hourContent');
    $(this).parents('.nabor').remove();
    parent.find('.removeNabor').toggle(parent.find('.removeNabor').length > 2 ? true : false);
    parent.find('.nabor:not(.nabor_default) .addNabor:last').show();
    var i = 1;
    parent.find('.nabor:not(.nabor_default)').each(function () {
      $(this).find('strong:first').html(i + ')');
      $(this).find('select').each(function () {
        var tmp_id = $(this).attr('name');

        tmp_id = tmp_id.replace(/\[[0-9]+\]\[/, '[' + (i - 1) + '][');
        $(this).attr('name', tmp_id);
      });
      i++;
    });

    return false;
  });
  const submit = document.querySelector("#work_hours")
  submit ? submit.addEventListener("click", () => ShowSpinButton('work_hours')) : null;

  // перевставляем праздник если его отредактировали и изменили дату START
  (function () {
    const applyButtonEvent = document.querySelector(".holidaysList")
    applyButtonEvent.addEventListener("click", (event) => {
      const li = document.querySelector(".holidaysRow .addRow .holidaysRow[data-month]")
      if (!li) return
        if (event.target.matches(".apply")) { rePastEvent(event.target.closest("li")) }
    })
  })();

  // Multilang
  $(document).on('click', '.holidaysRow .holidayTitle .list_lang_form .change_form', function(e){
    e.preventDefault();
    $(this).parent('.list_lang_form').find('.change_form').removeClass('active');
    $(this).addClass('active');
    let lang_id = $(this).data('lang_id');
    $(this).parents('.holidayTitle').find('input.holidays').hide();
    $(this).parents('.holidayTitle').find('input.holidays_'+lang_id).show();
  });
  // перевставляем праздник если его отредактировали и изменили дату END
  InitNanoScrolls("")
});

function CountSheduleTime(schedule_row) {
  if (!schedule_row[0]) return
  // При клике на "добавить рабочий интервал" библиотека Choices ещё не обработает селекты
  // В результате чего будет выбран неправильный option (будет выбран первый)
  setTimeout(() => {
    var start_value = parseInt(schedule_row.find('.counter-select').first().val());
    var end_value   = parseInt(schedule_row.find('.counter-select').last().val());

    if(end_value<start_value) {
      end_value += 60*24;
    }

    var diff_value = end_value - start_value;

    schedule_row.find('.counter').hide();
    schedule_row.find('.counter_' + diff_value).show();
  }, 1)
}


function switch_tabs(obj) {

  var id = obj.attr("rel");
  let parent = $(obj).parents('.gSettings');
  $('#h_holiday2_description').hide();
  if ($('#' + id).css('display') == 'none') {
    $(parent).find('.hourContent').slideUp();
    $(parent).find('.h_button a').removeClass("active");

    if($(parent).hasClass('_js_workhours'))
    {
        $('#work_hours_type').val(parseInt(id.match(/\d$/)));
    }
    else
    {
        $('#holidays_type').val(parseInt(id.match(/\d$/)));
    }

    $('#' + id).slideDown();
      $('#' + id + '_description').show();
    obj.addClass("active");

    SelectNano(`.hourBlock`)
  }
}

function CheckWorkHours() {
  b_allow_save = false;
  if ($('#b_full_week').val() == 1) {
    b_allow_save = true;
  } else {
    var work_schedule = [[], [], [], [], [], [], [], []];

    $('.hourRow').each(function () {
      var schedule_row = $(this);

      //мы не обрабатываем дефолтную скрытую строку
      if (schedule_row.attr('id') != 'schedule_row_default') {
        var work_day = schedule_row.find('.select-day').first().val();
        var work_day_nr = 0;
        for (var i = 0; i < days_arr.length; i++) {
          if (work_day == days_arr[i]) {
            work_day_nr = i;
          }
        }

        if (work_day_nr) {
          var start_value = parseInt(schedule_row.find('.counter-select').first().val());
          var end_value = parseInt(schedule_row.find('.counter-select').last().val());

          var diff_value = end_value - start_value;

          if (diff_value > 0) {
            work_schedule[work_day_nr].push([start_value, end_value]);
            if (work_schedule[work_day_nr].length > 1) {
              var tmp_arr = work_schedule[work_day_nr];
              do {
                var changes_made = false;
                for (var i = 0; i < (tmp_arr.length - 1); i++) {
                  for (var j = i + 1; j < tmp_arr.length; j++) {
                    var work_1 = tmp_arr[i];
                    var work_2 = tmp_arr[j];

                    //если первый элемент находится внутри второго
                    if (work_1[0] >= work_2[0] && work_1[1] <= work_2[1]) {
                      var add_work = work_2;
                      changes_made = true;
                    }
                    //если второй элемент находится внутри первого
                    else if (work_2[0] >= work_1[0] && work_2[1] <= work_1[1]) {
                      var add_work = work_1;
                      changes_made = true;
                    }
                    //если второй элемент пересекается с первым по правой стороне - второй является логическим продолжением первого
                    else if (work_2[0] <= work_1[1] && work_2[1] > work_1[1]) {
                      var add_work = [work_1[0], work_2[1]];
                      changes_made = true;
                    }
                    //если второй элемент пересекается с первым по левой стороне - первый является логическим продолжением второго
                    else if (work_1[0] <= work_2[1] && work_1[1] > work_2[1]) {
                      var add_work = [work_2[0], work_1[1]];
                      changes_made = true;
                    }
                    //если они не пересекаются
                    else {
                      changes_made = false;
                    }

                    if (changes_made) {
                      tmp_arr.splice(j, 1);
                      tmp_arr.splice(i, 1);
                      tmp_arr.push(add_work);
                      break;
                    }
                  }
                  if (changes_made) {
                    break;
                  }
                }
              } while (changes_made);

              work_schedule[work_day_nr] = tmp_arr;
            }
          }
        }
      }
    });

    var working_min = 0;
    for (var i = 0; i < work_schedule.length; i++) {
      var work_intervals = work_schedule[i];
      for (var j = 0; j < work_intervals.length; j++) {
        var schedule_diff = work_intervals[j][1] - work_intervals[j][0];
        working_min = working_min + schedule_diff;
      }
    }

    if (working_min >= 600) {
      b_allow_save = true;
    }
  }
  if (!b_allow_save) {
    ShowXajaxNotification('SMALL_TIME');
  }
  return b_allow_save;
}

// сортируем праздничные дни
function sortEvent() {
  const holidaysListLink = document.querySelector(".holidaysList")
  const holidaysList = holidaysListLink.cloneNode(true)  // выбираем все li без скрытого
  const holidaysRow = Array.from( holidaysList.children )
  let holidaysListNew = holidaysList

  holidaysRow.forEach(element => {
    // добавляем атрибут месяц на эл. с числом дня месяца и номером месяца для удобства сортировки
    const month = element.querySelector(".hldMonth select [selected]").value
    const dataElement = element.querySelector(".hldDay select [selected]").value
    const day = (dataElement.length === 1) ? `0${dataElement}` : dataElement


    const allData = Number(`${month}.${day}`)
    element.setAttribute("data-month", allData)
  })

  // сортируем массив по месяцу
  const holidaysRowNew = holidaysRow.sort((prev, next) => prev.attributes[1].value - next.attributes[1].value);

  holidaysRow.forEach(element => { element.remove() }) // удаляем детей
  holidaysRowNew.forEach(element => { holidaysListNew.append(element) }) // вставляем в ul отсортированные li

  holidaysListLink.replaceWith(holidaysListNew) // заменяем старые li на новые

  editApply();
}

// перевставляем праздник согласно календарного порядка
function rePastEvent(target) {
  /**
   * Ф-ция охватывает два случая
   * Если нам нужно отсортировать праздник при добавлении нового - передаём в ф-цию undefined
   * А если нужно сортировать при редактировании - передаём сам айтем, который редактируем
   * Если передали undefined - возьмётся последний праздник в .holidaysList (если мы добавили праздник то он будет последним)
  */
  const element = (target) ? target : document.querySelector(".holidaysList .holidaysRow:last-child")

  const hldDay = element.querySelector(".hldDay select [selected]").value
  const hldMonth = element.querySelector(".hldMonth select [selected]").value
  const text = element.querySelector(".holidayTitle input").value
  const nameNldholidayTitle = element.querySelector(".holidayTitle input").getAttribute("name")
  const nameNldMonth = element.querySelector(".hldMonth select").getAttribute("name")
  const nameHldDay = element.querySelector(".hldDay select").getAttribute("name")
  const holidaySelectDayCopy = holidaySelectDay.cloneNode(true) // holidaySelectDay - это эталонный HTML-код для праздников. Если нужно вставить праздник - берём его

  element.remove() // удаляем только что вставленный эл., чтобы перевставить его согласно сортировке

  const holidaysRowAll = Array.from( document.querySelectorAll(".holidaysList .holidaysRow") ) // все праздники
  const toRemoveAttr = holidaySelectDayCopy.querySelectorAll(`select option[selected]`) // выбранный option

  toRemoveAttr.forEach(element => { element.removeAttribute("selected") }) // удаляем атр. у выбранных option

  holidaySelectDayCopy.querySelector(`.hldDay select option[value="${hldDay}"]`).setAttribute("selected", "") // выбираем нужный option у дня
  holidaySelectDayCopy.querySelector(`.hldMonth select option[value="${hldMonth}"]`).setAttribute("selected", "") // выбираем нужный option у месяца
  holidaySelectDayCopy.querySelector(`.holidayTitle input`).value = text // добавляем текст, который ввёл юзер
  holidaySelectDayCopy.querySelector(".hldMonth select").setAttribute("name", `${nameNldMonth}`) // устанавливаем поле name для селекта выбора месяца
  holidaySelectDayCopy.querySelector(".hldDay select").setAttribute("name", `${nameHldDay}`) // устанавливаем поле name для селекта выбора дня
  holidaySelectDayCopy.querySelector(".holidayTitle input").setAttribute("name", `${nameNldholidayTitle}`) // устанавливаем поле name для селекта выбора дня

  /**
   * Для того, чтобы отсортировать праздники по убыванию мы добавляем атрибут data-month на li - это контейнер самого праздника
   * Значение data-month состоит из двух чисел: месяц.число
   * Если у нас дата от 1 до 9 - добавляем впереди ноль, иначе будет считать/сортировать не правильно
   * В таком случае если у нас "3 июля", то data-month будет 7.03, а если "10 января", то 1.1
  */

  const day = (parseInt(hldDay) < 10) ? `0${hldDay}` : hldDay // если число <= 9 - добавляем ноль спереди
  const currentData = parseFloat(`${hldMonth}.${day}`) // формируем саму дату вида месяц.число

  holidaySelectDayCopy.setAttribute("data-month", `${currentData}`)

  /** Нам нужен только 1 эл. у которого атр. data-month больше нашего, чтобы перед ним вставить наш новый эл.
   * @param allData - дата вставляемого праздника
   * @param dataMonth - дата перебираемого праздника
  */

  /**
   * Сортировка праздника при его добавлении. Пока откатил эту фичу, а то работает с глюком.
   * Глюк заключается в том, что если удалить все праздники, сохранить и обновить страницу, то потом нельзя будет добавить праздник.
  */

  // const el = holidaysRowAll.find(element => {
  //   const dataMonth = parseFloat( element.getAttribute("data-month") )
  //
  //   if ( currentData >= dataMonth ) {
  //     prepareEvent(holidaySelectDayCopy) // общие действия для любого случая вставки
  //     document.querySelector(`.holidaysList li[data-month="${dataMonth}"]`).after(holidaySelectDayCopy)
  //   } else {
  //
  //     // если наш вставляемый праздник меньше всех, то нам его нужно вставить перед первым праздником
  //     const firstHoliday = document.querySelector(".holidaysList li:first-child")
  //     const firstHolidayDataAttr = firstHoliday.getAttribute("data-month")
  //
  //     if (currentData < firstHolidayDataAttr) {
  //
  //       prepareEvent(holidaySelectDayCopy)
  //       document.querySelector(`.holidaysList li[data-month="${dataMonth}"]`).before(holidaySelectDayCopy)
  //     }
  //   }
  // })

  // const allDataMonth = holidaysRowAll.map(element => parseFloat( element.getAttribute("data-month") ))
  // const closestRight = Math.min(...allDataMonth.filter(v => v > currentData));
  // const closestLeft =  Math.max(...allDataMonth.filter(v => v < currentData));
  // alert(closestLeft+' '+closestRight)

  prepareEvent(holidaySelectDayCopy)
  document.querySelector(`.holidaysList`).after(holidaySelectDayCopy)

  actionButton();
  /** Все общие действия с праздником перед его вставкой
   * @param holidaySelectDayCopy - наш праздник, который мы ходим вставить
  */
  function prepareEvent(holidaySelectDayCopy) {
    const select = holidaySelectDayCopy.querySelectorAll("select")
    choicesInit(select, { searchEnabled: false, shouldSort: false, itemSelectText: '' }) // пропускаем селекты через Choices.JS

    // событие для удаления праздника START
    holidaySelectDayCopy.querySelector(".remove").addEventListener("click", (event) => {
      event.target.closest('li').remove();
    })
    // событие для удаления праздника END
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector(".loader").classList.remove("-js-load")
  InitNanoScrolls("")

  const isActive = document.querySelector(".h_button a.active")
  const getRel = isActive.getAttribute("rel")
  if (getRel !== "h_rab3") {
    // Если выбарно НЕ "отдельные", то потом все равно инитим селекты, а то при переключении на "отдельные" страница подвисает чуток
    choicesInit('.nabor:not(.nabor_default) #hourList_ .multipleSelect', {searchEnabled: false, shouldSort: false, itemSelectText: '', removeItemButton: true });
    choicesInit('.nabor:not(.nabor_default) #hourList_ select', {searchEnabled: false, shouldSort: false, itemSelectText: ''});
  }
})

// Инитим селекты согласно выбора клиента
function isInitSelect() {
  const isActive = document.querySelector(".h_button a.active")
  const getRel = isActive.getAttribute("rel")

  if (getRel === "h_rab3") {
    choicesInit('.nabor:not(.nabor_default) #hourList_ .multipleSelect', {searchEnabled: false, shouldSort: false, itemSelectText: '', removeItemButton: true });
    choicesInit('.nabor:not(.nabor_default) #hourList_ select', {searchEnabled: false, shouldSort: false, itemSelectText: ''});
  } else if (getRel === "h_rab2") {
    choicesInit('#hourList select', {searchEnabled: false, shouldSort: false, itemSelectText: ''});
  }
  SelectNano("")
}
