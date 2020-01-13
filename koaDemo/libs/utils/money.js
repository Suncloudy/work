

// 后端价格传给前端
exports.get = function(key) {
	let val = this.getDataValue(key);
  if (!val) return val;
  return Math.round(val*100)
}

// 获取来自前端的价格
exports.set = function(val, key) {
	let v = val?(parseInt(val)/100):val;
  this.setDataValue(key, v);
}

// 前端价格格式化（"分"、"厘"、"毫"显示为"元", 默认"分"）
exports.toFixed = function(val, s=2) {
  let times = Math.pow(10, s);
  var des = val/times;
  return des+'';
}
