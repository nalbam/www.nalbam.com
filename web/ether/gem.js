function getParam(n) {
  // console.log(location.search);
  var q = null,
    t = [];
  location.search
    .substr(1)
    .split("&")
    .forEach(function (v) {
      t = v.split("=");
      if (t[0] === n) q = decodeURIComponent(t[1]).substr(0, 6);
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

function hexToRgbA(h, a) {
  var c = h.substring(1).split('');
  if (c.length == 3) {
    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  c = '0x' + c.join('');
  return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + a + ')';
}

function getGem() {
  var q = getParam('v');
  if (validate(q)) {
    var c = hexToRgbA(q, 0.9);
    document.write('<div class="gem"></div>');
    document.write('<h1 class="val">' + q + '</h1>');
    document.querySelector(".gem").style.backgroundColor = c;
    document.querySelector(".val").style.color = c;
  }
}

getGem();
