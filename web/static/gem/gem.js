function getParam(n) {
  var q = null,
      t = [];
  location.search
      .substr(1)
      .split("&")
      .forEach(function (v) {
        t = v.split("=");
        if (t[0] === n) q = decodeURIComponent(t[1]);
      });
  return '#' + q.substr(0,6);
}

function getHash() {
  return document.querySelector(".gem").style.backgroundColor = location.hash.substr(0,7);
}

function validate(q) {
  if (/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(q)) {
    return true;
  } else {
    return false;
  }
}

function getGem() {
  var q = getParam('q');
  if (validate(q)) {
    document.write('<div class="gem"></div>');
    document.write('<div class="val">'+q+'</div>');
    document.querySelector(".gem").style.backgroundColor = q;
    document.querySelector(".val").style.color = q;
  }
}

getGem();
