var base64 = require('base64.js');

function formatTime(date) {
	var year = date.getFullYear()
	var month = date.getMonth() + 1
	var day = date.getDate()

	var hour = date.getHours()
	var minute = date.getMinutes()
	var second = date.getSeconds()


	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
	n = n.toString()
	return n[1] ? n : '0' + n
}
function getWeekName(str) {
	var arys1 = new Array();
	arys1 = str.split('-');
	var ssdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);
	var week1 = String(ssdate.getDay()).replace("0", "日").replace("1", "一").replace("2", "二").replace("3", "三").replace("4", "四").replace("5", "五").replace("6", "六");
	return "星期" + week1;
}
function alert(str) {
	wx.showModal({
		title: '弹窗标题',
		content: str,
		confirmText: "主操作",
		//   cancelText: "辅助操作",
		success: function (res) {
			console.log(res);
			if (res.confirm) {
				console.log('用户点击主操作')
			} else {
				console.log('用户点击辅助操作')
			}
		}
	});
}
function test() {
	return "i come from utils modules!";
}
function dump_obj(obj) {
	for (var o in obj) {
		console.log(o + ":" + obj[o]);
	}
}
function toast(t) {
	wx.showToast({
		title: t,
	});
}
function getTimeDiff() {
	var d = new Date().getTime() - new Date("2000/01/01 00:00:00").getTime();
	return Math.floor(d / 1000);
}
function getUrl(url) {
	if (url.charAt(0) == "/")
		return "https://apps.movnow.com/a/sporthi_web/api" + url;
	else
		return "https://apps.movnow.com/a/sporthi_web/api/" + url;
}
function objToBase64(str) {


	return base64.encode(JSON.stringify(str));
}
function base64encode(str) {
	return base64.encode(str);
}
function base64decode(str) {
	return base64.decode(str);
}
function convert(match, nosign) {
	if (nosign) {
		match.sign = '';
	} else {
		match.sign = match.negative ? '-' : match.sign;
	}
	var l = match.min - match.argument.length + 1 - match.sign.length;
	var pad = new Array(l < 0 ? 0 : l).join(match.pad);
	if (!match.left) {
		if (match.pad == "0" || nosign) {
			return match.sign + pad + match.argument;
		} else {
			return pad + match.sign + match.argument;
		}
	} else {
		if (match.pad == "0" || nosign) {
			return match.sign + match.argument + pad.replace(/0/g, ' ');
		} else {
			return match.sign + match.argument + pad;
		}
	}
}
Date.prototype.Format = function (fmt) { //author: meizz 
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
function getDate(fmt) {

}
function getDataFrom1970(sec, fmt) {
	var d = new Date((new Date("1970/01/01 00:00:00").getTime() + sec * 1000));

	return d.Format(fmt);
}
function getDataFrom1900(sec, fmt) {
	var d = new Date((new Date("1900/01/01 00:00:00").getTime() + sec * 1000));

	return d.Format(fmt);
}
function getPrevDate(str, sec) {
	var d = new Date((new Date(str.replace(/-/g, "/") + " 12:00:00").getTime() + sec * 3600 * 24 * 1000));
	return d.Format("yyyy-MM-dd");
}
function getDateOffset(sec, fmt) {
	var d = new Date((new Date().getTime() + parseInt(sec) * 3600 * 24 * 1000));

	return d.Format(fmt);
}
function isValDate(sec) {
	var d = new Date((new Date("1970/01/01 00:00:00").getTime() + sec * 1000));
	var begin = new Date((new Date().getTime() + parseInt(-60) * 3600 * 24 * 1000));
	var end = new Date((new Date().getTime() + parseInt(1) * 3600 * 24 * 1000));
	if (d.getTime() > begin.getTime() && d.getTime() < end.getTime())
		return true;
	else
		return false;
}
function sprintf() {
	if (typeof arguments == "undefined") {
		return null;
	}
	if (arguments.length < 1) {
		return null;
	}
	if (typeof arguments[0] != "string") {
		return null;
	}
	if (typeof RegExp == "undefined") {
		return null;
	}

	var string = arguments[0];
	var exp = new RegExp(/(%([%]|(\-)?(\+|\x20)?(0)?(\d+)?(\.(\d)?)?([bcdfosxX])))/g);
	var matches = new Array();
	var strings = new Array();
	var convCount = 0;
	var stringPosStart = 0;
	var stringPosEnd = 0;
	var matchPosEnd = 0;
	var newString = '';
	var match = null;

	while (match = exp.exec(string)) {
		if (match[9]) {
			convCount += 1;
		}
		stringPosStart = matchPosEnd;
		stringPosEnd = exp.lastIndex - match[0].length;
		strings[strings.length] = string.substring(stringPosStart, stringPosEnd);
		matchPosEnd = exp.lastIndex;
		matches[matches.length] = {
			match: match[0],
			left: match[3] ? true : false,
			sign: match[4] || '',
			pad: match[5] || ' ',
			min: match[6] || 0,
			precision: match[8],
			code: match[9] || '%',
			negative: parseInt(arguments[convCount]) < 0 ? true : false,
			argument: String(arguments[convCount])
		};
	}

	strings[strings.length] = string.substring(matchPosEnd);
	if (matches.length == 0) {
		return string;
	}

	if ((arguments.length - 1) < convCount) {
		return null;
	}

	var code = null;
	var match = null;
	var i = null;

	for (i = 0; i < matches.length; i++) {
		var substitution = "";
		if (matches[i].code == '%') {
			substitution = '%'
		}
		else if (matches[i].code == 'b') {
			matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(2));
			substitution = convert(matches[i], true);
		}
		else if (matches[i].code == 'c') {
			matches[i].argument = String(String.fromCharCode(parseInt(Math.abs(parseInt(matches[i].argument)))));
			substitution = convert(matches[i], true);
		}
		else if (matches[i].code == 'd') {
			matches[i].argument = String(Math.abs(parseInt(matches[i].argument)));
			substitution = convert(matches[i]);
		}
		else if (matches[i].code == 'f') {
			matches[i].argument = String(Math.abs(parseFloat(matches[i].argument)).toFixed(matches[i].precision ? matches[i].precision : 6));
			substitution = convert(matches[i]);
		}
		else if (matches[i].code == 'o') {
			matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(8));
			substitution = convert(matches[i]);
		}
		else if (matches[i].code == 's') {
			matches[i].argument = matches[i].argument.substring(0, matches[i].precision ? matches[i].precision : matches[i].argument.length)
			substitution = convert(matches[i], true);
		}
		else if (matches[i].code == 'x') {
			matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
			substitution = convert(matches[i]);
		}
		else if (matches[i].code == 'X') {
			matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
			substitution = convert(matches[i]).toUpperCase();
		}
		else {
			substitution = matches[i].match;
		}
		newString += strings[i];
		newString += substitution;
	}
	newString += strings[i];
	return newString;
}

/*
calorie=(weight(kg) * height(cm) * steps * 6.92)/1000000
odo = (steps * stride(cm))/100;
stride = height(cm)*0.415;(male)
stride = height(vm)*0.415;(female)
*/
function calcCalorie(step) {
	var height = wx.getStorageSync("height");
	var weight = wx.getStorageSync("weight");

	return parseInt((weight * height * step * 6.92) / 1000000);
}
function calcOdo(step) {
	var height = wx.getStorageSync("height");
	return Math.floor(height * 0.415 * step / 100);
}
function toHourMinute(s) {
	var t;
	if (s == 0||s==null) {
		return "00:00";
	}
	else
		s=s*60;
	if (s > -1) {
		var hour = Math.floor(s / 3600);
		var min = Math.floor(s / 60) % 60;
		var sec = s % 60;
		return sprintf("%02d:%02d", hour,min);
	}
	return t;
}
function arrayBufferToString(dataView) {
	var str = "";
	for (var n = 0; n < dataView.byteLength; n++) {
		str = str + sprintf("%c", dataView.getUint8(n));
	}
	return str;
}
function dumpArrayBuffer(dataView,title) {
	var str = "";
	for (var n = 0; n < dataView.byteLength; n++) {
		str = str + " " + dataView.getUint8(n);
	}
	if (title==undefined)
		console.log(str);
	else
		console.log(title+":"+str);
}
function safeGet(obj, key, def) {
	if (obj == null || obj == "")
		return def;
	if (obj.hasOwnProperty(key) == false)
		return def;

	return obj[key];

}
function safe(key, def) {
	if (key == null || key == "")
		return def;
	return key;
}
function fixWeekDate(w) {
	var arr = new Array();
	for (var n = 0; n < 7; n++) {
		arr[n] = 0;
	}
	if (w == null || w == "" || w.length == 0) {
		return arr;
	}

	for (var n = 0; n < w.length; n++) {
		arr[w[n]] = 1;
	}
	return arr;
}
//获取某位的值
function getBit(val, bit) {
	/*1 return true; 0 return false*/
	return ((val & (0x1 << bit)) >> bit) == 1;
}
//设置位
function setBit(val, bit) {
	return val | (0x1 << bit)
}
//清除位
function clearBit(val, bit) {
	var a = 255;
	for (var i = 0; i <= bit; i++) {
		a = a << 1;
		if (i > 0) a++;
	}
	return val & a;
}
function isAndroid() {
	return wx.getSystemInfoSync().platform == "android" ? true : false;
}

function min(arr) {
	if (arr == null || arr == "" || arr.length == 0) {
		return 0;
	}
	var min = arr[0];
	var len = arr.length;
	for (var i = 1; i < len; i++) {
		if (arr[i] < min) {
			min = arr[i];
		}
	}
	return min;
}
function avg(arr)
{
	if (arr == null || arr == "" || arr.length == 0) {
		return 0;
	}
	var len = arr.length;
	var sum=0;
	for (var i = 0; i < len; i++) {
		sum = sum +parseInt(arr[i]);
	}
	return parseInt(sum/len);
}
//最大值
 function max(arr) {
	 if (arr==null || arr=="" ||arr.length==0){
		 return 0;
	 }
	var max = arr[0];
	var len = arr.length;
	for (var i = 1; i < len; i++) {
		if (arr[i] > max) {
			max = arr[i];
		}
	}
	return max;
}
module.exports = {
	formatTime: formatTime,
	test: test,
	alert: alert,
	dump_obj: dump_obj,
	toast: toast,
	getUrl: getUrl,
	sprintf: sprintf,
	getDate: getDate,
	getDataFrom1970: getDataFrom1970,
	getDataFrom1900: getDataFrom1900,
	getDateOffset: getDateOffset,
	objToBase64: objToBase64,
	isValDate: isValDate,
	getPrevDate: getPrevDate,
	getWeekName: getWeekName,
	calcCalorie: calcCalorie,
	calcOdo: calcOdo,
	toHourMinute: toHourMinute,
	base64encode: base64encode,
	base64decode: base64decode,
	arrayBufferToString: arrayBufferToString,
	dumpArrayBuffer: dumpArrayBuffer,
	safeGet: safeGet,
	safe: safe,
	fixWeekDate: fixWeekDate,
	getBit: getBit,
	setBit: setBit,
	clearBit: clearBit,
	isAndroid: isAndroid,
	min:min,
	max:max,
	avg:avg

}
