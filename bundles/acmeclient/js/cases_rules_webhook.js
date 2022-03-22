// JavaScript Document
(function ($) {

  $(function () {
    $(document).on('change', '.method_list', function (event) {
      const value = event.target[0].value

      if (value === "get" || value === "delete") {
        let lettersRequestStandartData = event.target.closest(".acrItem").querySelector(".letters_content.scnd-perform_webhook.-block ul.request_standart_data")
        let lettersRequestDield = event.target.closest(".acrItem").querySelector(".letters_content.scnd-perform_webhook.-block .request_field")
        let scndRequestStandartData = event.target.closest(".acrItem").querySelector(".scnd-perform_webhook.-block .request_standart_data")
        let scndRequestCustomData = event.target.closest(".acrItem").querySelector(".scnd-perform_webhook.-block .request_custom_data")

        if (!lettersRequestStandartData) return

        lettersRequestStandartData.style.display = "none"
        lettersRequestDield.style.display = "none"
        scndRequestStandartData.style.display = "none"
        scndRequestCustomData.style.display = "none"

        item = Array.from(event.target.closest('.acrItem').querySelectorAll('.letters_content.scnd-perform_webhook.-block .request_field select'));
        initChoices(false, '', false, false, item, false);
        InitNanoScrolls(`#${event.target.closest("li").id}`)
      }
      if (value === "post" || value === "put") {
        let attr = event.target.closest(".acrItem").querySelector(".letters_content.scnd-perform_webhook.-block select option").getAttribute("value")
        let lettersRequestStandartData = event.target.closest(".acrItem").querySelector(".letters_content.scnd-perform_webhook.-block .request_standart_data")
        let lettersRequestField = event.target.closest(".acrItem").querySelector(".letters_content.scnd-perform_webhook.-block .request_field")
        let scndRequestCustomData = event.target.closest(".acrItem").querySelector(".scnd-perform_webhook.-block .request_custom_data")
        let scndRequestCustomWrap = event.target.closest(".acrItem").querySelector(".scnd-perform_webhook.-block .request_custom_wrap")
        let scndRequestStandartWrap = event.target.closest(".acrItem").querySelector(".scnd-perform_webhook.-block .request_standart_wrap")

        lettersRequestStandartData.style.display = "flex"
        lettersRequestField.style.display = "flex"
        scndRequestCustomData.style.display = "none"

        if (attr === "standart") {
          scndRequestCustomData.style.display = "none"
          scndRequestCustomWrap.style.display = "none"
          scndRequestStandartWrap.style.display = "flex"
        } else if (attr === "custom") {
          lettersRequestStandartData.style.display = "none"
          scndRequestCustomData.style.display = "flex"
          scndRequestCustomWrap.style.display = "flex"
          scndRequestStandartWrap.style.display = "none"
        }

        item = Array.from(event.target.closest('.acrItem').querySelectorAll('.letters_content.scnd-perform_webhook.-block .request_field select'));
        initChoices(false, '', false, false, item, false);
        InitNanoScrolls(`#${event.target.closest("li").id}`)
      }
    });

    $(document).on('change', '.request_list', function (e) {
      e.preventDefault();
      var request = $(this).val();
      var parent = $(this).parents('.acrItem');
      console.log(request)
      switch (request) {
        case 'standart':
          $(parent).find('.request_standart_wrap').css("display", "flex")
          $(parent).find('.request_custom_wrap').css("display", "none")
          $(parent).find('.request_standart_data').css("display", "flex")
          $(parent).find('.request_custom_data').css("display", "none")
          init_nice_elements( '#'+$(parent)[0].getAttribute("id") )
          break
        case 'custom':
          $(parent).find('.request_standart_wrap').css("display", "none")
          $(parent).find('.request_custom_wrap').css("display", "flex")
          $(parent).find('.request_standart_data').css("display", "none")
          $(parent).find('.request_custom_data').css("display", "flex")
          init_nice_elements( '#'+$(parent)[0].getAttribute("id") )
          break
      }
    });

    $(document).on('click', '.a16_pp_action', function (e) {
      e.preventDefault();
      $(this).parents().find('.note-variable-link').show();
      $(this).parents().find('.pp_list_notes').show();
      $(this).next().css("margin-bottom", "10px")
      $(this).next().show();

      if ($(this).next().offset().top < 0) {
        document.querySelector("header").style.zIndex = '8';
        const paddingTop = parseInt( $(this).next().find(".pp_list_wrap").css("paddingTop") )
        const padding    = paddingTop + parseInt( $(this).next().find(".pp_list_wrap").css("paddingBottom") ) // padding = 14px (25.09.2020)
        // const header     = $("header").height() // 50px (25.09.2020)
        const height     = $(this).next().height() + $(this).next().offset().top - padding  /* - header */
        $(this).next().find(".pp_list_wrap").css("height", `${height}px`)

        const listHeader      = $(this).next().find(".pp_list_header").height()
        const listHeaderMb    = parseInt( $(this).next().find(".pp_list_header").css("marginBottom") )
        const ulWrapperHeight = height - listHeader - listHeaderMb - paddingTop + 8 // хз откуда 8, где-то потерял при расчётах
        $(this).next().find(".ul_wrapper").css("height", `${ulWrapperHeight}px`)

        initCustomScrollLabel("")
      }
    });

    // переменные
    $(document).on('click', '.scnd-perform_webhook .pp_list li > a', function (e) {
      e.preventDefault();
      var value = $(this).attr('rel');
      var place = '';
      if ($(this).parents('.scnd-perform_webhook').length) {
        place = $(this).parents('.scnd-perform_webhook').next().find('.a16_url_field').first();
      }
      if ($(this).parents('.request_field').length) {
        place = $(this).parents('.request_field').siblings('.request_custom_data').find('.a16_custom_data').first();
      }
      if (place.length) {
        var element_id = place.attr('id');
        var myField = document.getElementById(element_id);
        if (myField) {
          insertAtCursor(myField, value);
        }
        $(place).focus();
      }
    });

    // чекбокс "требуется аутентификация для принятия запроса"
    $(document).on('click', '.a16_auth input', function (e) {
      let auth_rel = $(this).closest('div.letters_content').find('.log_key li a.active').first().attr('rel');
      $(this).closest('div.letters_content').find('.webhook-auth').first().val(auth_rel);

      let firstStep = this.closest('.a16_auth').querySelector('.first_step') // селектор с текстом: "требуется аутентификация для принятия запроса"
      let secondStep = this.closest('.a16_auth').querySelector('.second_step') // селектор с текстом: "требуется аутентификация через"
      let logKey = this.closest('.letters_content').querySelector('.log_key') // родительйский селектор переключателя "логин-пароль / API-ключ"
      let logKeyFields = this.closest('.letters_content').querySelector('.log_key_fields') // родительский селектор для инпутов
      let a16Auth = this.closest('.a16_auth').querySelector("input") // сам переключатель - input[type="checkbox"]
      let logKeyPassword = logKey.querySelector("a[rel='password']")

      // если чекбокс выбран, то отображаем родитель input-ов "Логин" и "Пароль"
      if (a16Auth.checked) {
        logKeyFields.style.display = "flex" // интуп "Логин" и "Пароль" или "API-ключ"
        logKey.style.display = "inline-flex" // переключатель "логин-пароль / API-ключ"
        firstStep.style.display = "none" // "требуется аутентификация для принятия запроса"
        secondStep.style.display = "inline-flex" // "требуется аутентификация через"
        logKeyPassword.classList.add("active")
      } else {
        logKeyPassword.classList.remove("active")
        logKeyFields.style.display = "none" // интуп "Логин" и "Пароль" или "API-ключ"
        logKey.style.display = "none" // переключатель "логин-пароль / API-ключ"
        firstStep.style.display = "inline-flex" // "требуется аутентификация для принятия запроса"
        secondStep.style.display = "none" // "требуется аутентификация через"
      }
    });

    // Метки в вебхуке
    $(document).on('click', '.log_key li a', function (e) {
      e.preventDefault();
      $(this).parents('.log_key').find('a').removeClass('active');
      $(this).addClass('active');
      var auth_rel = $(this).attr('rel');
      $(this).closest('div.letters_content').find('.webhook-auth').first().val(auth_rel);
      console.log()
      if (auth_rel == 'password') {
        $(this).parents('.log_key').next().find('.first_val').show();
        $(this).parents('.log_key').next().find('.second_val').hide();
      } else {
        $(this).parents('.log_key').next().find('.first_val').hide();
        $(this).parents('.log_key').next().find('.second_val').css('display', 'block');
      }
    });
    $(document).on('click', '.request_standart_data input', function (e) {
      this.closest('li').classList.toggle('active')
    });
  });

  initCustomScrollLabel("")

})(jQuery)

function initCustomScrollLabel(start) {
  $(`${start} .pp_list_body:visible:not(.-js-no-nano)`).each( function(id, el) {
    var target = $(el);
    target.addClass('nano-content');
    target.wrap("<div class='nano list_nano'></div>")
    target.parent().nanoScroller({alwaysVisible: true})
  })
}

// Срабатывает в Правилах и Шаблонах
// window.onload = function() {
//   document.querySelector(".loader").classList.remove("-js-load")
//   InitNanoScrolls("")
// }

document.addEventListener('DOMContentLoaded', () => {
  // на момент выполнения JS отработает не весь.
  // событие onload использовать нельзя - если будут битые картинки, то прелоадер спадёт тольпо спустя 15 секунд
  setTimeout(() => {
    document.querySelector(".loader").classList.remove("-js-load")
    InitNanoScrolls("")
  }, 1)
})