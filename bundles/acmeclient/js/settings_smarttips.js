var nr_added_holidays = 0;
var nr_added_schedule = 0;
var days_arr = ['-', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
$(document).ready(function () {
  //переключение между вкладками
  $('.h_button a').click(function () {
    switch_tabs($(this));
    return false;
  });
  $('select,input').on("change", function (e) {
    activeButt();
  });
  $(document).on('click', '.change_form', function () {
    var lang_id = $(this).attr('data-lang_id');
    var record_id = $(this).attr('data-record_id');
    $(this).parent().find('a').removeClass('active');
    $(this).addClass('active');

    $(this).parents('label').find('input[id*=_' + record_id + '_]').hide();
    $(this).parents('label').find('input[id$=_' + record_id + '_' + lang_id + ']').show();

    $(this).parents('label').find('textarea[id^=signature_' + record_id + ']').parent().hide();
    $(this).parents('label').find('textarea#signature_' + record_id + '_' + lang_id).parent().show();
    InitNanoScrolls("");

    return false;
  });
  $('.ck_editor-textarea').each(function () {
    var textarea_id = $(this).attr('id');
    if (!GetRedactorInstance(textarea_id)) {
      CreateHtmlEditor(textarea_id, 72, false, true, false, false, true, true);
      if (!$(this).attr('data-star')) {
        $(this).parent().hide();
      }
    }
  });
  InitNanoScrolls("");
  const submit = document.querySelector("#settings_smarttips")
  submit ? submit.addEventListener("click", () => ShowSpinButton('settings_smarttips')) : null
});

function activeButt() {
  $('input[type=submit]:visible').removeAttr('disabled');
}

function switch_tabs(obj) {
  var id = obj.attr("rel");
  if ($('#' + id).css('display') == 'none') {
    $('.hourContent').slideUp();
    $('.h_button a').removeClass("active");

    $('#smartips_type').val(parseInt(id.match(/\d$/)));

    $('#' + id).slideDown();
    obj.addClass("active");
    InitNanoScrolls("");
    activeButt();
  }
}

// Если выбрали группу или подргуппу - удаляем вложенные option START
document.addEventListener('DOMContentLoaded', () => {
  // Ф-ция для обработки специальных селетов
  (function () {
    const choices = choicesInit('.-js-multipleSelect-remove-group', {
      searchResultLimit: 99,
      shouldSort: false,
      itemSelectText: '',
      noResultsText: Translate('alpha20_js/no_results'),
      noChoicesText: Translate('alpha20_js/no_variants'),
      addItems: true,
      removeItemButton: true,
    });

    choices.forEach(element => {
      element.passedElement.element.addEventListener("addItem", () => hiddenItems(element))
      element.passedElement.element.addEventListener("showDropdown", () => hiddenItems(element))
      element.passedElement.element.addEventListener("removeItem", () => hiddenItems(element))
      element.passedElement.element.addEventListener("search", () => hiddenItems(element))

      element.passedElement.element.closest(".choices").addEventListener("keyup", (event) => {
        if (event.key !== "Backspace") return // кастомное событие search не срабатывает на Backspace, если мы удалили последний символ с инпута
        setTimeout(() => hiddenItems(element),0) // костыль. Элементы перевставляются до того, как мы пытаемся их скрыть по "Backspace"
      })
    })

    function hiddenItems(element) {
      const wrapper = element.passedElement.element.closest(".choices")
      const selected = Array.from(wrapper.querySelector(".choices__list.choices__list--multiple").childNodes)

      selected.forEach(option => {
        const value = option.getAttribute("data-value")
        const optionSplit = value.split(":")

        if (optionSplit.length === 1 || optionSplit.length === 2) {
          const optionWrapper = wrapper.querySelectorAll(`.choices__list--dropdown [data-value*="${value}"]`)

          optionWrapper.forEach(optionWrapperOption => {
            // Если у нас срабатывает событие addItem и showDropdown - скрываем <option> в воображаемом <optgroup>
            if (event?.type !== "removeItem" || event.key === "Backspace") {
              optionWrapperOption.setAttribute("style", "display : none")
              optionWrapperOption.classList.remove("is-highlighted")
            }
            // Если у нас срабатывает событие removeItem - отображаем <option> в воображаемом <optgroup>
            if (event?.type === "removeItem" || event?.type === "search") {
              if (optionWrapperOption.getAttribute("data-value") !== value) {
                optionWrapperOption.setAttribute("style", "display : none")
                optionWrapperOption.classList.remove("is-highlighted")
              }
            }
          })
        }
      });

      // Отображаем (или скрываем) специальный DIV если нет (или есть) <option> в выпадающем списке
      ;(function () {
        const parentForAdd = wrapper.querySelector(`.choices__list--dropdown .choices__list`) // сюда вставляем спец. DIV
        const option = wrapper.querySelectorAll(`.choices__list--dropdown .choices__list > div:not([style])`) // все не скрытые option
        const SPECIAL_OPTION_DIV = `<div class="choices__item choices__item--choice has-no-choices-special">`+Translate('alpha20_js/no_variants')+`</div>`; // специальный DIV

        if (option.length > 0) {
          // Если option есть - скрываем специальный div показывающий, что доступных option для выбора нет
          const special = wrapper.querySelector(".has-no-choices-special")
          if (special) special.hidden = true;
        } else {
          // Если option доступных для выбора нет - вставляем, а потом и отображаем специальный div только 1 раз
          const special = wrapper.querySelector(".has-no-choices-special")
          if (!special) {
            parentForAdd.parentNode.insertAdjacentHTML("beforeend", SPECIAL_OPTION_DIV)
          } else {
            special.hidden = false;
          }
        }
      })();
      SelectNano("");
    }
  })();
})
