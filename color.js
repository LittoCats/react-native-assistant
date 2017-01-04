export default {
  random: function RandomColor(argument) {
    var color = [
      '#'
      , Math.floor(Math.random()*0xf).toString(16)
      , Math.floor(Math.random()*0xf).toString(16)
      , Math.floor(Math.random()*0xf).toString(16)
      , Math.floor(Math.random()*0xf).toString(16)
      , Math.floor(Math.random()*0xf).toString(16)
      , Math.floor(Math.random()*0xf).toString(16)
      , 'FF'
    ];
    return color.join('');
  },
  light: lightColor,
  dark: function darkColor(color, rate = 0.3) {
    return lightColor(color, 0-rate, 0);
  }
};
function lightColor(color, rate = 0.3, max = 255) {
  rate = Math.max(-1, Math.min(rate, 1))
  if (typeof color === 'string') color = parseInt(color.replace('#', '0x'));
  var r = (color >> 16) & 0xff;
  var g = (color >>  8) & 0xff;
  var b = (color >>  0) & 0xff;

  r += (max - r)*rate;
  g += (max - g)*rate;
  b += (max - b)*rate;
  return `rgb(${r}, ${g}, ${b})`
}

// 目前仅支持 RGB 24 位 Number
export {gradientColors};
function gradientColors(_start = 0xffffff, _to = 0, _steps = 16) {
  
  var start = _start;
  var to = _to;
  var steps = _steps;

  if (typeof start === 'string') start = parseInt(start.replace('#', '0x'))
  if (typeof to === 'string') to = parseInt(to.replace('#', '0x'))

  const sr = (start >> 16) & 0xff;
  const sg = (start >>  8) & 0xff;
  const sb = (start >>  0) & 0xff;

  const tr = (to >> 16) & 0xff;
  const tg = (to >>  8) & 0xff;
  const tb = (to >>  0) & 0xff;

  const rsp = (tr - sr)/steps;
  const gsp = (tg - sg)/steps;
  const bsp = (tb - sb)/steps;

  var iList = [];
  while(steps--) {
    iList.push(
      'rgb('+ [Math.floor(tr-rsp*steps) , Math.floor(tg-gsp*steps), Math.floor(tb-bsp*steps)].join(',') + ')'
    )
  }

  return iList;
}