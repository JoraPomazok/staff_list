/**
 * Select2 Russian translation
 */
if( typeof LangShortCode !== 'undefined' && LangShortCode )
{
  switch(LangShortCode)
  {
    case 'ru':  //Russian translation
      (function ($) {
          "use strict";

          $.extend($.fn.select2.defaults, {
            formatNoMatches: function () { return "Совпадений не найдено"; },
            formatInputTooShort: function (input, min) { var n = min - input.length; return "Введите "+ (input.length==0 ? "хотя бы " : "еще ") + n + " символ" + (n == 1 ? "" : ((n > 1)&&(n < 5) ? "а" : "ов")); },
            formatInputTooLong: function (input, max) { var n = input.length - max; return "Пожалуйста, введите на " + n + " символ" + (n == 1 ? "" : ((n > 1)&&(n < 5)? "а" : "ов")) + " меньше"; },
            formatSelectionTooBig: function (limit) { return "Не более " + (limit==1 ? "одного пользователя" : (limit+" пользователей")); },
            formatLoadMore: function (pageNumber) { return "Загрузка данных..."; },
            formatSearching: function () { return "Поиск..."; }
          });
      })(jQuery);
    break;
    case 'tr':  // Turkey translation
    (function ($) {
        "use strict";

        $.extend($.fn.select2.defaults, {
          formatNoMatches: function () { return "Eşleşme bulunаmadı"; },
          formatInputTooShort: function (input, min) { var n = min - input.length; return "Girin "+ (input.length==0 ? "en az " : "daha ") + n + " karakter" + (n == 1 ? "" : ((n > 1)&&(n < 5) ? "" : "")); },
          formatInputTooLong: function (input, max) { var n = input.length - max; return "Lütfen, " + n + " karakter" + (n == 1 ? "" : ((n > 1)&&(n < 5)? "" : "")) + " daha az girin"; },
          formatSelectionTooBig: function (limit) { return "En çok " + (limit==1 ? "bir müşteri" : (limit+" müşteri")); },
          formatLoadMore: function (pageNumber) { return "Veriler yükleniyor..."; },
          formatSearching: function () { return "Aranıyor..."; }
        });
    })(jQuery);
    break;
    case 'en':  //English translation
      (function ($) {
          "use strict";

          $.extend($.fn.select2.defaults, {
            formatNoMatches: function () { return "No matches found"; },
            formatInputTooShort: function (input, min) { var n = min - input.length; return "Enter "+ (input.length==0 ? "at least " : "more ") + n + " character" + (n == 1 ? "" : ((n > 1)&&(n < 5) ? "s" : "s")); },
            formatInputTooLong: function (input, max) { var n = input.length - max; return "Please enter " + n + " character" + (n == 1 ? "" : ((n > 1)&&(n < 5)? "s" : "s")) + " less"; },
            formatSelectionTooBig: function (limit) { return "No more than " + (limit==1 ? "one user" : (limit+" users")); },
            formatLoadMore: function (pageNumber) { return "Loading data..."; },
            formatSearching: function () { return "Searching..."; }
          });
      })(jQuery);
    break;
    default:
    (function ($) {
        "use strict";

        $.extend($.fn.select2.defaults, {
          formatNoMatches: function () { return "Совпадений не найдено"; },
          formatInputTooShort: function (input, min) { var n = min - input.length; return "Введите "+ (input.length==0 ? "хотя бы " : "еще ") + n + " символ" + (n == 1 ? "" : ((n > 1)&&(n < 5) ? "а" : "ов")); },
          formatInputTooLong: function (input, max) { var n = input.length - max; return "Пожалуйста, введите на " + n + " символ" + (n == 1 ? "" : ((n > 1)&&(n < 5)? "а" : "ов")) + " меньше"; },
          formatSelectionTooBig: function (limit) { return "Не более " + (limit==1 ? "одного пользователя" : (limit+" пользователей")); },
          formatLoadMore: function (pageNumber) { return "Загрузка данных..."; },
          formatSearching: function () { return "Поиск..."; }
        });
    })(jQuery);
  }
} else {
  (function ($) {
      "use strict";

      $.extend($.fn.select2.defaults, {
        formatNoMatches: function () { return "Совпадений не найдено"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "Введите "+ (input.length==0 ? "хотя бы " : "еще ") + n + " символ" + (n == 1 ? "" : ((n > 1)&&(n < 5) ? "а" : "ов")); },
        formatInputTooLong: function (input, max) { var n = input.length - max; return "Пожалуйста, введите на " + n + " символ" + (n == 1 ? "" : ((n > 1)&&(n < 5)? "а" : "ов")) + " меньше"; },
        formatSelectionTooBig: function (limit) { return "Не более " + (limit==1 ? "одного пользователя" : (limit+" пользователей")); },
        formatLoadMore: function (pageNumber) { return "Загрузка данных..."; },
        formatSearching: function () { return "Поиск..."; }
      });
  })(jQuery);
}
