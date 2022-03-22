$(document).ready(function () {
  $('.h_button a').click(function () { //When any link is clicked
    if ($($(this).attr('href')).css('display') == 'none') {
      var current_tab = $(this).closest('.gSettings').find('.active');
      $($(current_tab).attr('href')).slideUp();
      current_tab.removeClass('active');
      $(this).addClass('active'); //Set clicked link class to active
      $($(this).attr('href')).slideDown();
      SelectNano('')
      if ($(this).attr('href').match(/t_serv(\d*)/)) {
        $('#service_common').val($(this).attr('href').match(/t_serv(\d*)/)[1]);
      }
      if ($(this).attr('href').match(/t_act(\d*)/)) {
        $('#action_common').val($(this).attr('href').match(/t_act(\d*)/)[1]);
      }

      // Обрабатываем только видимые селекты
      const wrapper = $(this).closest(".gSettings")[0]
      const ollSelect = Array.from(wrapper.querySelectorAll(".mySelect:not(.-js-noMySelect)"))
      const visibleSelect = ollSelect.filter(element => element.offsetHeight > 0)
      choicesInit(visibleSelect, {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        noResultsText: Translate('alpha20_js/no_results'),
        noChoicesText: Translate('alpha20_js/no_variants')
      })
      if (wrapper.matches(".tabsBlock2")) {
        labelSelect()
      }
      SelectNano('')
    }
    hiddenGroup()
    return false;
  });

  // Скрываем/показываем div при определённом выборе
  $('select.sla-action-type').change(function () {
    var current_val = $(this).val();
    var closes_div = $(this).closest('div.groupRow').siblings('div.groupRow');
    if (current_val == 'b') {
      closes_div.hide();

    } else {
      closes_div.show();
      const select = Array.from(closes_div[0].querySelectorAll(".mySelect:not(.-js-noMySelect)"))
      choicesInit(select, {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        noResultsText: Translate('alpha20_js/no_results'),
        noChoicesText: Translate('alpha20_js/no_variants')
      })
      SelectNano("")
    }
  });
  labelSelect()
  const submit = document.querySelector("#team_sla")
  submit ? submit.addEventListener("click", () => ShowSpinButton('team_sla')) : null

  const select = Array.from(document.querySelectorAll(".mySelect:not(.-js-noMySelect)"))
  const selectVisible = select.filter(element => element.offsetHeight > 0)
  choicesInit(selectVisible, {
    searchEnabled: false,
    shouldSort: false,
    itemSelectText: '',
    noResultsText: Translate('alpha20_js/no_results'),
    noChoicesText: Translate('alpha20_js/no_variants')
  })

  choicesForVisibled()
  labelSelect()

///////

  const agList = document.querySelector(".tabsBlock2 .agList")
  agList.addEventListener("click", (event) => {

    const li = event.target.closest("li")

    if (li) {
      if (li.className.includes("g_item_a")) {
        const numberOfId = event.target.closest("li").className.split("g_item_a_")[1].replace(/\s+/g, ' ').trim()
        const currentli = document.querySelector(`#results_a_${numberOfId}`)
        const selectAll = currentli.querySelectorAll(".multipleSelect")

        selectAll.forEach(element => {
          const firstInput = element.closest("label").querySelector("input");
          const firstLocation = '-col-2';
          addDelLabels([], all_labels_list, firstInput, firstLocation, false);
        })
      }
    }
  })
});

function choicesForVisibled() {
  document.body.addEventListener("click", (event) => {
    if (!event.target.closest(".-js-click")) return

    const hourContent = event.target.closest(".hourContent")
    const mySelect = Array.from(hourContent.querySelectorAll(".mySelect:not(.-js-noMySelect)"))
    const selectVisible = mySelect.filter(element => element.offsetHeight > 0)
    choicesInit(selectVisible, {
      searchEnabled: false,
      shouldSort: false,
      itemSelectText: '',
      noResultsText: Translate('alpha20_js/no_results'),
      noChoicesText: Translate('alpha20_js/no_variants')
    })

    if (event.target.closest(".tabsBlock2")) {
      labelSelect()
    }
    SelectNano('')
  })
}

// Еследим что выбрал юзер в селекте и меняем на противоположное в другом селекте
function reChoicesByValue(change, changeable) {
  /**
   * @param change - где произошла смена option;
   * @param changeable - где меняем на противоположный option
   */
  change[0].passedElement.element.addEventListener('change', function (event) {
    changeable[0].setChoiceByValue(event.detail.value);

    if (event.detail.value === 'r') {
      changeable[0].setChoiceByValue("c")
    } else if (event.detail.value === 'c') {
      changeable[0].setChoiceByValue('r')
    }
    hiddenGroup()
  })
}


// Блок "действия при несоблюдении минимального уровня услуг"
function labelSelect() {
  const div = Array.from(document.querySelectorAll(".special__select"))
  const divVIsible = div.filter(element => element.offsetHeight > 0)

  divVIsible.forEach(element => {
    const idd = element.id

    const firstActionType = Array.from(document.querySelectorAll(`#${idd} .-js-noMySelect[name*='first_action_type']`))
    const secondActionType = Array.from(document.querySelectorAll(`#${idd} .-js-noMySelect[name*='second_action_type']`))

    if (firstActionType[0].closest(".choices") && secondActionType[0].closest(".choices")) return

    const firstSelect = choicesInit(firstActionType, {searchEnabled: false, shouldSort: false, itemSelectText: ''});
    const secondSelect = choicesInit(secondActionType, {searchEnabled: false, shouldSort: false, itemSelectText: ''});

    reChoicesByValue(firstSelect, secondSelect)
    reChoicesByValue(secondSelect, firstSelect)
  })
  SelectNano('')
}

// window.onload = function () {
//   document.querySelector(".loader").classList.remove("-js-load")
//   SelectNano("")
// }

document.addEventListener('DOMContentLoaded', () => {
  // на момент выполнения JS отработает не весь.
  // событие onload использовать нельзя - если будут битые картинки, то прелоадер спадёт тольпо спустя 15 секунд
  setTimeout(() => {
    document.querySelector(".loader").classList.remove("-js-load")
    hiddenGroup()
    InitNanoScrolls("")
  }, 1)
})

function hiddenGroup() {
  const group = document.querySelectorAll(`[data-id="-hidden-group"]`)
  group.forEach(element => {
    element.classList.add("-none")

    element.closest(".choices").removeEventListener("change", hideGroup)
    element.closest(".choices").addEventListener("change", hideGroup)

    function hideGroup() {
      event.target.closest(".choices").querySelector(`[data-id="-hidden-group"]`).classList.add("-none")
    }
  })
}
