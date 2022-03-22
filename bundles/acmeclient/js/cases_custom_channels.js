$(document).ready(function () {
  $(".records_sortable").sortable(
    {handle: ".js-move-item"},
    {axis: "y"},
    {
      stop: function (event, ui) {
        SortRecords(true);
      }
    }
  );

  //  Change name by lang
   $(document).on('click', '.cch_titles .change_form', function(e){
     e.preventDefault();
     $(this).parents('.cch_titles').find('.change_form').removeClass('active');
     $(this).addClass('active');
     let lang_id  = $(this).data('lang_id');
     $(this).parents('.cch_titles').find('.cch_title').hide();
     $(this).parents('.cch_titles').find('#title_'+lang_id).show();
   });
});

function SortRecords(b_sort_db) {
  var start = 1;
  var sort_li_arr = Array();
  $('#record_list li').each(function () {
    if ($(this).hasClass('active')) {
      $(this).find('.span-sort').html(start);
      start++;
      sort_li_arr.push($(this).attr('id'));
    }
  });
  if (sort_li_arr.length > 0 && b_sort_db) {
    xajax_SortRecords(sort_li_arr.join(':'));
  }
}

function onOff(item, enable) {
  enableRecord(item, enable);
  var li_el = $(item).closest('li');
  if (enable) {
    $('#record_list').append(li_el);
  } else {
    $('#disabled_record_list').append(li_el);
  }
  SortRecords(false);
}


function PostDeleteRecord() {
  SortRecords(false);
}

function init_create_record() {
  $('.create-record').off('click').on('click', function (e) {
    e.preventDefault();
    update_record('button_update_0');
  })
}

function init_update_record(start) {
  $(start + ' .update-record').off('click').on('click', function (e) {
    e.preventDefault();
    update_record($(this).attr('id'));
  })

  // Обрабатываем все селекты на странице
  const iconPicker = Array.from(document.querySelectorAll("select[id*=\"icon_\"]:not([data-choice=\"active\"])"))
  const select = Array.from(document.querySelectorAll("select:not([id*=\"icon_\"]):not([data-choice=\"active\"])"))
  const allSelect = iconPicker.concat(select)
  const instances = allSelect.map((element) => {
    return new Choices(element, {
      searchEnabled: false,
      shouldSort: false,
      itemSelectText: ''
    });
  });

  iconSelect()
  // На селект с иконками
  iconPicker.forEach(element => {
    //console.log( element )
    if (!element.matches(".mySelect")) {
      element.addEventListener("change", (event) => selectEvent(event))
    }
  })
}

function OnEdit(el) {
    InitColorPicker( $(el).closest("li").find('input.cch_colorpicker') )
}

function update_record(button_id) {
  if (request_sent) {
    return;
  }
  var record_id = button_id.match(/button_update_(\d+)/)[1];
  var titles = {};
  $.each($('#form_'+record_id +' input.cch_title'), function(i, input) {
          if($(input).val())  titles[input.id.replace('title_', '')] = $(input).val().trim();
        });
  var group_id = $.trim($('#group_id_' + record_id).val());
  var icon = $.trim($('#icon_' + record_id).val());
  var color = $.trim($('#color_' + record_id).val());
  var webhook_url = $.trim($('#webhook_url_' + record_id).val());
  var type_channel = $.trim($('#type_channel_' + record_id).val());

  var errors = [];
  var errors_fields = [];

  if(!Object.keys(titles).length)
  {
  	errors.push('EMPTY_TITLE');
  	errors_fields.push('title_'+record_id);
  }
  if (!$('#webhook_url_' + record_id).is(':disabled') && !webhook_url.length) {
    errors.push('EMPTY_WH_URL');
    errors_fields.push('webhook_url_' + record_id);
  }
  ShowNotification(errors, errors_fields);
  if (errors.length > 0) {
    return false;
  }

  ShowSpinButton('button_update_' + record_id);
  xajax_UpdateRecord(record_id, titles, group_id, icon, color, webhook_url, type_channel);

  setTimeout(() => {
    SortRecords(true)
    offOn()
  }, 700)
}

function ChangeColorForIcon(el, color) {
  const icon = el?.closest("form").querySelectorAll(".choices__item--selectable i")

  if (icon) {
    icon.forEach(element => {
      element.setAttribute("style", `color:${color}`)
    })
  }
}

function ClickDeleteRecord(el) {
  IsUsed(el, function (is_used) {
    if (is_used) {
      $('#record_used').togglePopup();
    } else {
      StartDeleteRecord(el);
    }
  });
}

function IsUsed(item, callback, skip_load) {
  if (skip_load) {
    return callback(0);
  }
  var id = get_closes_li_id(item);
  $.ajax({
    url: is_used_record_url,
    type: 'POST',
    dataType: 'json',
    data: {
      record_id: id
    },
    success: function (response) {
      callback(response);
    },
    cache: false
  });
}

// В селекте с иконками в option приходят иконки ввиде текста. Нам их нужно преобразовать в HTML
function iconSelect() {
  const select = document.querySelectorAll("select[id*=\"icon_\"]") // выбираем все селекты с иконками
  let allChoices = [] // тут будем хранить опции селектов

  select.forEach(element => {
    const option = element.closest(".choices").querySelectorAll(".choices__item--selectable")
    allChoices.push(option) // добавляем в массив все опции
  })

  allChoices.forEach(element => {
    element.forEach(el => {
      if (el.firstChild.tagName === "I") {
        return
      }
      const text = el.textContent
      el.firstChild.remove()
      el.insertAdjacentHTML("beforeend", text) // заменяем текст внутри опции иконкой
    })
  })
}

function ClickDeleteRecord(el) {
  IsUsed(el, function (is_used) {
    if (is_used) {
      $('#record_used').togglePopup();
    } else {
      StartDeleteRecord(el);
    }
  });
}

// Меняем цвет и иконку в уже созданных каналах (функция навешивается на событие)
function selectEvent(event) {
  iconSelect()

  const color = event.target.closest("form").querySelector(".color-box").getAttribute("data-color")
  const option = event.target.closest(".choices").querySelectorAll(".choices__item--selectable")

  option.forEach(element => {
    const text = element.textContent
    element.firstChild.remove()
    element.insertAdjacentHTML("beforeend", text) // заменяем текст внутри опции иконкой
  })

  const icon = event.target.closest(".choices").querySelectorAll(".choices__item--selectable i")

  icon.forEach(element => {
    // console.log( element );
    element.setAttribute("style", `color: ${color}`)
  })
}
