(function() {
  const elem = document.querySelectorAll(".nws_content");
  console.log(elem);
  let text = elem.innerHTML;
  let size = 75;
  let n = 130;
  for (let i = 0; i < elem.length; i++) {
    /* необходимо вставить цикл, чтоб получить все блоки с классом tit */
    if (elem[i].innerHTML.length > size) {
      text = elem[i].innerHTML.substr(0, n);
    } else {
      text = elem[i].innerHTML;
    }
    elem[i].innerHTML = text + "...";
  }


})();
