function getParam(n) {
  // console.log(location.search);
  var q = null,
      t = [];
  location.search
      .substr(1)
      .split("&")
      .forEach(function (v) {
        t = v.split("=");
        if (t[0] === n) q = decodeURIComponent(t[1]).substr(0,6);
      });
  return '#' + q;
}

function validate(q) {
  if (/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(q)) {
    return true;
  } else {
    return false;
  }
}

function getGem() {
  var q = getParam('v');
  if (validate(q)) {
    document.write('<div class="gem"></div>');
    document.write('<div class="val">'+q+'</div>');
    document.querySelector(".gem").style.backgroundColor = q;
    document.querySelector(".val").style.color = q;
  }
}

getGem();
