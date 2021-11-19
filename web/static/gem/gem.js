function getParam(name) {
  var result = null,
      tmp = [];
  location.search
      .substr(1)
      .split("&")
      .forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === name) result = decodeURIComponent(tmp[1]);
      });
  return '#' + result.substr(0,6);
}

function getCode() {
  return document.querySelector(".gem").style.backgroundColor = location.hash.substr(0,7);
}

document.querySelector(".gem").style.backgroundColor = getParam('q');
