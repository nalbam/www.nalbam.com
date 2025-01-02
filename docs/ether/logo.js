function getParam(n) {
  // console.log(location.search);
  var q = null,
    t = [];
  location.search
    .substr(1)
    .split('&')
    .forEach(function (v) {
      t = v.split('=');
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
  var c = '0x' + h.substring(1);
  return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + a + ')';
}

function getGem() {
  var q = getParam('v');
  if (validate(q)) {
    document.querySelector('.val').innerText = q;
    document.querySelector('.val').style.color = q;
    document.querySelector('.u1').style.borderBottom = '250px solid ' + hexToRgbA(q, 0.8);
    document.querySelector('.u2').style.borderBottom = '250px solid ' + hexToRgbA(q, 0.6);
    document.querySelector('.u3').style.borderBottom = '250px solid ' + hexToRgbA(q, 0.3);
    document.querySelector('.u4').style.borderBottom = '250px solid ' + hexToRgbA(q, 0.3);
    document.querySelector('.ct').style.backgroundColor = q;
    document.querySelector('.l1').style.borderBottom = '250px solid ' + hexToRgbA(q, 0.8);
    document.querySelector('.l2').style.borderBottom = '250px solid ' + hexToRgbA(q, 0.6);
  }
}

getGem();
