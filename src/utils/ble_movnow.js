var g_deviceId = "";
var g_services = null;
var g_characteristics;
var cd0 = null;
var cd1 = null;
var cd2 = null;
var cd3 = null;
var cd4 = null;
var isConnect = 0;
var isNeedSyncHistory = false;
var util = require('util.js');

var board_serverId = "00001800-0000-1000-8000-00805F9B34FB";

var serverIdFee7 = "0000FEE7-0000-1000-8000-00805F9B34FB";

var serverId180A = "0000180A-0000-1000-8000-00805F9B34FB";
var serverId180F = "0000180F-0000-1000-8000-00805F9B34FB";
var serverId1804 = "00001804-0000-1000-8000-00805F9B34FB";
var serverId1802 = "00001802-0000-1000-8000-00805F9B34FB";
var serverId1803 = "00001803-0000-1000-8000-00805F9B34FB";
var serverId180D = "0000180D-0000-1000-8000-00805F9B34FB";
var serverId1810 = "00001810-0000-1000-8000-00805F9B34FB";
var serverIdFFC0 = "0000FFC0-0000-1000-8000-00805F9B34FB";


var app = getApp();


function getServerId(id) {
	return "0000" + id + "-0000-1000-8000-00805F9B34FB";
}
function getCharacter(id) {
	return "0000" + id + "-0000-1000-8000-00805F9B34FB";
}

function initBle(deviceId) {
	g_deviceId = deviceId;
	loadBleDevice(deviceId);
}
function syncBle(deviceId) {

}
function buf2hex(buffer) { // buffer is an ArrayBuffer
	return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}
function getDeviceName() {
	wx.getBLEDeviceCharacteristics({
		// 这里的 deviceId 需要在上面的 getBluetoothDevices
		deviceId: g_deviceId,
		// 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
		serviceId: board_serverId,
		success: function (res) {
			console.log("mymymymy=", res);
		},
		fail: function (res) {
			console.log("mymymy error", res);
		}
	});
}


function read_time() {
	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("FFC0"),
		characteristicId: getCharacter("FF15"),
		success: function (res) {
			console.log('蓝牙返回成功:readBLECharacteristicValue:', res);
			wx.onBLECharacteristicValueChange(function (res) {

				console.log(`^_^characteristic ${res.characteristicId} has changed, now is ${res.value}`)
				//    console.log('characteristic value comed:', res)
				let dataView = new DataView(res.value);
				var str = "";
				for (var n = 0; n < dataView.byteLength; n++) {
					str = str + " " + dataView.getInt8(n);
				}
				console.log("time=" + str);
				set_time();
			});
		},
		fail: function (res) {
			console.log('蓝牙返回错误:readBLECharacteristicValue:', res);
		}
	});
}

function getTimeDiff() {
	var begin = new Date();
	var end = new Date("2000/01/01 00:00:00");

	return parseInt(parseInt(begin.getTime() - end.getTime()) / 1000);
}

var set_times = 0;
function set_time() {
	let buffer = new ArrayBuffer(4)
	let dataView = new DataView(buffer)
	console.log("---------------begin write_time------------------------" + getTimeDiff());
	dataView.setUint32(0, getTimeDiff(), true);


	set_times = 0;
	wx.writeBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("FFC0"),
		characteristicId: getCharacter("FF15"),
		value: buffer,
		success: function (res) {

			if (set_times == 0) {
				set_times = 1;
				console.log('写入数据：writeBLECharacteristicValue success', res);
				syncRunStep();
			}

		},
		fail: function (res) {
			console.log("写入数据失败:", res);
		}
	})

}
function readAllConfig() {
	// bleCommNotifyRegister();

	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("FFC0"),
		characteristicId: getCharacter("FF14"),
		success: function (res) {
			//读取当前的数据
		//	return;
			wx.notifyBLECharacteristicValueChanged({
				deviceId: g_deviceId,
				serviceId: getServerId("FFC0"),
				characteristicId: getCharacter("FF14"),
				state: true,
				success: function (res) {
					// success
					console.log("-------succed----", res);

				},
				fail: function (res) {
					console.log("-------failure----", res);
					// fail
				}
			});
		}
	});
	return;

}
function saveHwConfigPage1() {

	let buffer = new ArrayBuffer(20)
	let dataView = new DataView(buffer);
	var config = wx.getStorageSync("config");
	for (var n = 0; n < 20; n++) {
		dataView.setUint8(n, 0x00);
	}
	/*
	1Byte: bit0--单位制(0:公制；1:英制)
		bit1: 2: 页序号0：0
	1Byte: 身高（单位：50 - 250cm/ 20 - 100inch）
	2Byte: 体重（单位：30 - 250Kg/ 60 - 500Pd）
	2Byte: 步长（单位：20 - 200cm/ 5 - 100inch）
	1Byte: 目标类型 1:卡路里（0 - 59999Kcal）
	2:距离（PD199: 0 - 99, MG353:0 - 400km/ mile）
	3:步数（0 - 99999）
	4:时间（0 - 600Minute）
	4Byte: 目标值
	1Byte：年龄
	1Byte：性别
	2Byte：时区（单位分钟）
	1Byte：心率自动检测间隔时间, 单位分钟: 0或10- 120(5倍数）
	  1Byte: 跑步目标类型（支持动态心率）
	  1:卡路里（0 - 59999Kcal）
	  2:距离（PD199:0 - 99, MG353:0 - 400km/ mile）
	  3:步数（0 - 99999）
	  4:时间（0 - 600Minute）
	  3Byte: 跑步目标值（支持动态心率）
	  */
	dataView.setUint8(0, 0);
	dataView.setUint8(1, util.safe(wx.getStorageSync("height"), 170));//身高
	dataView.setUint16(2, util.safe(wx.getStorageSync("weight"), 70, true)); //体重
	dataView.setUint16(4, 80, true);//步长
	dataView.setUint8(6, 3);//目标类型
	dataView.setUint32(7, util.safe(wx.getStorageSync("dest"), 70), true);//目标步数
	dataView.setUint8(11, 30);//年龄
	dataView.setUint8(12, util.safe(wx.getStorageSync("gender"), 1));//性别
	dataView.setUint16(13, 0, true);//
	dataView.setUint8(15, util.safeGet(config, "hb_interal", 60));
	dataView.setUint8(16, 3);

	console.log("write config1 begin....");
	util.dumpArrayBuffer(dataView);
	wx.writeBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("FFC0"),
		characteristicId: getCharacter("FF14"),
		value: buffer,
		success: function (res) {
			console.log('写入数据 page1：writeBLECharacteristicValue success', res);
			saveHwConfigPage2();
		},
		fail: function (res) {
			console.log("写入数据失败 page1 :", res);
		}
	})
}
function saveHwConfigPage2() {

	let buffer = new ArrayBuffer(20)
	let dataView = new DataView(buffer);
	var config = wx.getStorageSync("config");
	for (var n = 0; n < 20; n++) {
		dataView.setUint8(n, 0x00);
	}
	dataView.setUint8(0, 2);

	dataView.setUint16(1, 1000, true); //自行车轮圈周长（900-2500mm）
	dataView.setUint16(3, 120, true); //自行车曲柄长度（110.0-236.5mm）
	var str = util.safeGet(config, "notice_time", "9:00~23:00");
	var arr = str.split(/:|~/);
	dataView.setUint8(5, arr[0]);//开始时
	dataView.setUint8(6, arr[1]);//目标类型
	dataView.setUint8(7, arr[2]);//目标类型
	dataView.setUint8(8, arr[3]);//目标类型

	dataView.setUint8(8, arr[3]);//目标类型
	var onoff = util.safeGet(config, "notice_onoff", 0);
	var b = 0;
	if (util.safeGet(config, "notice_msg", 0) == 1) { //短信
		util.setBit(b, 0);
	}
	if (util.safeGet(config, "notice_phone", 0) == 1) { //电话
		util.setBit(b, 1);
	}
	if (onoff == 0)
		b = 0;
	dataView.setUint8(9, b);//目标类型

	b = 0;
	dataView.setUint8(10, b);//目标类型
	if (util.safeGet(config, "notcie_wx", 0) == 1)  //微信
		util.setBit(b, 0);
	if (util.safeGet(config, "notice_qq", 0) == 1)  //QQ
		util.setBit(b, 1);
	if (util.safeGet(config, "notice_wb", 0) == 1)  //weibo
		util.setBit(b, 2);
	if (util.safeGet(config, "notice_facebook", 0) == 1)  //facebook
		util.setBit(b, 3);
	if (util.safeGet(config, "notice_messenger", 0) == 1)  //messenger
		util.setBit(b, 4);
	if (util.safeGet(config, "notice_skype", 0) == 1)  //skype
		util.setBit(b, 5);
	if (util.safeGet(config, "notice_whatsapp", 0) == 1)  //whats app
		util.setBit(b, 6);
	if (util.safeGet(config, "notice_viber", 0) == 1)  //viber
		util.setBit(b, 7);
	if (onoff == 0)
		b = 0;
	dataView.setUint8(10, b);//目标类型

	b = 0;
	if (util.safeGet(config, "notcie_vk", 0) == 1)  //vk
		util.setBit(b, 0);
	if (util.safeGet(config, "notice_linkin", 0) == 1)  //linked
		util.setBit(b, 1);
	if (util.safeGet(config, "notice_twitter", 0) == 1)  //twitter
		util.setBit(b, 2);
	if (util.safeGet(config, "notice_pinterest", 0) == 1)  //pinterest
		util.setBit(b, 3);
	if (util.safeGet(config, "notice_instagram", 0) == 1)  //instagram
		util.setBit(b, 4);
	if (util.safeGet(config, "notice_telegram", 0) == 1)  //telegram
		util.setBit(b, 5);
	if (util.safeGet(config, "notice_snapchat", 0) == 1)  //snapchat
		util.setBit(b, 6);
	if (util.safeGet(config, "notice_yandex", 0) == 1)  //yandex
		util.setBit(b, 7);
	if (onoff == 0)
		b = 0;
	dataView.setUint8(11, b);//目标类型

	console.log("write 页面2 config begin....");
	util.dumpArrayBuffer(dataView);
	wx.writeBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("FFC0"),
		characteristicId: getCharacter("FF14"),
		value: buffer,
		success: function (res) {
			console.log('写入数据 page2：writeBLECharacteristicValue success', res);
			saveHwConfigPage3();
		},
		fail: function (res) {
			console.log("写入数据失败 page2 :", res);
		}
	});

}
function saveHwConfigPage3() {

	let buffer = new ArrayBuffer(20)
	let dataView = new DataView(buffer);
	var config = wx.getStorageSync("config");
	for (var n = 0; n < 20; n++) {
		dataView.setUint8(n, 0x00);
	}
	dataView.setUint8(0, 4);

	//闹钟1
	var b = 0;
	if (util.safeGet(config, "alarm1", 0) == 1)
		util.setBit(b, 7);
	var w = util.safeGet(config, "alarm1week", [0, 0, 0, 0, 0, 0, 0]);
	if (w[0] == 1)
		util.setBit(b, 0);
	if (w[1] == 1)
		util.setBit(b, 1);
	if (w[2] == 1)
		util.setBit(b, 2);
	if (w[3] == 1)
		util.setBit(b, 3);
	if (w[4] == 1)
		util.setBit(b, 4);
	if (w[5] == 1)
		util.setBit(b, 5);
	if (w[6] == 1)
		util.setBit(b, 6);

	dataView.setUint8(1, b); //1闹钟1

	var str = util.safeGet(config, "alarm1time", "06:00");
	var arr = str.split(/:|~/);
	dataView.setUint8(2, arr[0]); //1闹钟1
	dataView.setUint8(3, arr[1]); //1闹钟1
	dataView.setUint8(4, 0); //1闹钟1

	//闹钟2
	var w = util.safeGet(config, "alarm2week", [0, 0, 0, 0, 0, 0, 0]);
	b = 0;
	if (w[0] == 1)
		util.setBit(b, 0);
	if (w[1] == 1)
		util.setBit(b, 1);
	if (w[2] == 1)
		util.setBit(b, 2);
	if (w[3] == 1)
		util.setBit(b, 3);
	if (w[4] == 1)
		util.setBit(b, 4);
	if (w[5] == 1)
		util.setBit(b, 5);
	if (w[6] == 1)
		util.setBit(b, 6);

	dataView.setUint8(5, b); //1闹钟1

	var str = util.safeGet(config, "alarm2time", "06:00");
	var arr = str.split(/:|~/);
	dataView.setUint8(6, arr[0]); //1闹钟1
	dataView.setUint8(7, arr[1]); //1闹钟1
	dataView.setUint8(8, 0); //1闹钟1

	//闹钟3
	var w = util.safeGet(config, "alarm3week", [0, 0, 0, 0, 0, 0, 0]);
	b = 0;
	if (w[0] == 1)
		util.setBit(b, 0);
	if (w[1] == 1)
		util.setBit(b, 1);
	if (w[2] == 1)
		util.setBit(b, 2);
	if (w[3] == 1)
		util.setBit(b, 3);
	if (w[4] == 1)
		util.setBit(b, 4);
	if (w[5] == 1)
		util.setBit(b, 5);
	if (w[6] == 1)
		util.setBit(b, 6);

	dataView.setUint8(9, b); //1闹钟1

	var str = util.safeGet(config, "alarm2time", "06:00");
	var arr = str.split(/:|~/);
	dataView.setUint8(10, arr[0]); //1闹钟1
	dataView.setUint8(11, arr[1]); //1闹钟1
	dataView.setUint8(12, 0); //1闹钟1

	dataView.setUint8(13, 1); //中文
	console.log("write 页面3 config begin....");
	util.dumpArrayBuffer(dataView);

	wx.writeBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("FFC0"),
		characteristicId: getCharacter("FF14"),
		value: buffer,
		success: function (res) {
			console.log('写入数据 page3：writeBLECharacteristicValue success', res);
			saveHwConfigPage4();
		},
		fail: function (res) {
			console.log("写入数据失败 page3 :", res);
		}
	});


}
function saveHwConfigPage4() {
	let buffer = new ArrayBuffer(20)
	let dataView = new DataView(buffer);
	var config = wx.getStorageSync("config");
	for (var n = 0; n < 20; n++) {
		dataView.setUint8(n, 0x00);
	}
	dataView.setUint8(0, 6);

	//闹钟1
	var b = 0;
	if (util.safeGet(config, "sit_onoff", 0) == 1)
		util.setBit(b, 7);
	var w = util.safeGet(config, "sit_week", [0, 0, 0, 0, 0, 0, 0]);
	if (w[0] == 1)
		util.setBit(b, 0);
	if (w[1] == 1)
		util.setBit(b, 1);
	if (w[2] == 1)
		util.setBit(b, 2);
	if (w[3] == 1)
		util.setBit(b, 3);
	if (w[4] == 1)
		util.setBit(b, 4);
	if (w[5] == 1)
		util.setBit(b, 5);
	if (w[6] == 1)
		util.setBit(b, 6);

	dataView.setUint8(1, b); //1闹钟1

	var str = util.safeGet(config, "sit_morning", "09:02~12:00");
	var arr = str.split(/:|~/);
	dataView.setUint8(2, arr[0]);
	dataView.setUint8(3, arr[3]);

	var str = util.safeGet(config, "sit_afternoon", "14:00~20:00");
	var arr = str.split(/:|~/);
	dataView.setUint8(4, arr[0]);
	dataView.setUint8(5, arr[2]);

	dataView.setUint8(6, 0);
	dataView.setUint8(7, 0);
	dataView.setUint8(8, 0);

	b = 0;
	if (util.safeGet(config, "hb_warn", 0) == 1)
		util.setBit(b, 0);
	if (util.safeGet(config, "bp_warn", 0) == 1)
		util.setBit(b, 1);

	dataView.setUint8(9, b);
	dataView.setUint8(10, 120);
	dataView.setUint8(11, 90);
	dataView.setUint8(12, 140);

	console.log("write 页面4 config begin....");
	util.dumpArrayBuffer(dataView);

	wx.writeBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("FFC0"),
		characteristicId: getCharacter("FF14"),
		value: buffer,
		success: function (res) {
			console.log('写入数据 page4：writeBLECharacteristicValue success', res);
			readAllConfig();
		},
		fail: function (res) {
			console.log("写入数据失败 page4 :", res);
		}
	});
}

function readHwVersion() {
	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("180A"),
		characteristicId: getCharacter("2A27"),
		success: function (res) {

		}
	});
}
function readZhiZhaoShan() {
	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("180A"),
		characteristicId: getCharacter("2A29"),
		success: function (res) {
		}
	});
}
function readSwVersion() {
	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("180A"),
		characteristicId: getCharacter("2A28"),
		success: function (res) {
		}
	});
}
function readProductInfo() {
	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("180A"),
		characteristicId: getCharacter("2A24"),
		success: function (res) {
		}
	});
}
function readMacAddr() {
	//读取mac地址
	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("180A"),
		characteristicId: getCharacter("2A25"),
		success: function (res) {
			console.log("结束mac地址读取...", res)

		}
	});
}
function saveAllConfig() {
	wx.getBLEDeviceCharacteristics({
		deviceId: g_deviceId,
		serviceId: getServerId("FFC0"),
		success: function (res) {
			//读取当前的数据
			saveHwConfigPage1();
			return;
			wx.notifyBLECharacteristicValueChanged({
				deviceId: g_deviceId,
				serviceId: getServerId("FFC0"),
				characteristicId: getCharacter("FF14"),
				state: true,
				success: function (res) {
					saveHwConfigPage1();
				},
				fail: function (res) {
					console.log("-------failure----", res);
					// fail
				}
			});
		},
		fail: function (res) {
			console.log('180A蓝牙返回错误:readBLECharacteristicValue:', res);
		}
	});

	// saveHwConfigPage2();
	// saveHwConfigPage3();
	// saveHwConfigPage4();
}
function readPowerUsed() {
	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("180F"),
		characteristicId: getCharacter("2A19"),
		success: function (res) {
			console.log("readPowerUsed ---read----succed----", res);
		},
		fail: function (res) {
			console.log("readPowerUsed ---read----error----", res);
		}
	});
	return;
	
	if (wx.getSystemInfoSync().platform == "android") {
		wx.readBLECharacteristicValue({
			deviceId: g_deviceId,
			serviceId: getServerId("180F"),
			characteristicId: getCharacter("2A19"),
			success: function (res) {
				console.log("readPowerUsed ---read----succed----", res);
			},
			fail: function (res) {
				console.log("readPowerUsed ---read----error----", res);
			}
		});
		return;
	}
	else {
		wx.notifyBLECharacteristicValueChanged({
			deviceId: g_deviceId,
			serviceId: getServerId("180F"),
			characteristicId: getCharacter("2A19"),
			state: true,
			success: function (res) {

				wx.readBLECharacteristicValue({
					deviceId: g_deviceId,
					serviceId: getServerId("180F"),
					characteristicId: getCharacter("2A19"),
					success: function (res) {
						console.log("readPowerUsed ---read----succed----", res);
					},
					fail: function (res) {
						console.log("readPowerUsed ---read----error----", res);
					}
				});
				console.log("readPowerUsed ---notify----succed----", res);
			},
			fail: function (res) {
				console.log("readPowerUsed----notify---failure----", res);
			}
		});
	}

	return;
}
var total = 0;

var ddd = 0;
let bufferStep;
let dataViewStep;
var stepDataJson = {};//
var sleepDataJson = {};
var readHistoryType = 0;//0 运动计步  1：心率


let bufferStepToday;
let dataViewStepToday;
function processStepToday(dataView) {
	//	let dataView = new DataView(val);

	var total = dataView.getUint16(0, true);
	var seq = dataView.getUint16(2, true) - 1;
	console.log("total=" + total + " seq=" + seq);

	if (seq == 0) {
		bufferStepToday = new ArrayBuffer(16 * total);
		dataViewStepToday = new DataView(bufferStepToday);
	}

	for (var n = 4; n < 20; n++) {
		dataViewStepToday.setUint8(seq * 16 + n - 4, dataView.getUint8(n));
	}
	if (seq == (total - 1)) {

		for (var n = 0; n < (16 * total) / 64; n++) {

			var runDate = dataViewStepToday.getUint32(n * 64, true);
			if (util.isValDate(runDate)) {
				var item = {};
				item.time = dataViewStepToday.getUint32(n * 64 + 4, true);
				item.step = dataViewStepToday.getUint32(n * 64 + 8, true);
				
				var valate = dataViewStepToday.getUint32(n * 64 + 60, true);
				item.h0 = dataViewStepToday.getUint16(n * 64 + 12, true);
				item.h1 = dataViewStepToday.getUint16(n * 64 + 14, true);
				item.h2 = dataViewStepToday.getUint16(n * 64 + 16, true);
				item.h3 = dataViewStepToday.getUint16(n * 64 + 18, true);
				item.h4 = dataViewStepToday.getUint16(n * 64 + 20, true);
				item.h5 = dataViewStepToday.getUint16(n * 64 + 22, true);
				item.h6 = dataViewStepToday.getUint16(n * 64 + 24, true);
				item.h7 = dataViewStepToday.getUint16(n * 64 + 26, true);
				item.h8 = dataViewStepToday.getUint16(n * 64 + 28, true);
				item.h9 = dataViewStepToday.getUint16(n * 64 + 30, true);
				item.h10 = dataViewStepToday.getUint16(n * 64 + 32, true);
				item.h11 = dataViewStepToday.getUint16(n * 64 + 34, true);
				item.h12 = dataViewStepToday.getUint16(n * 64 + 36, true);
				item.h13 = dataViewStepToday.getUint16(n * 64 + 38, true);
				item.h14 = dataViewStepToday.getUint16(n * 64 + 40, true);
				item.h15 = dataViewStepToday.getUint16(n * 64 + 42, true);
				item.h16 = dataViewStepToday.getUint16(n * 64 + 44, true);
				item.h17 = dataViewStepToday.getUint16(n * 64 + 46, true);
				item.h18 = dataViewStepToday.getUint16(n * 64 + 48, true);
				item.h19 = dataViewStepToday.getUint16(n * 64 + 50, true);
				item.h20 = dataViewStepToday.getUint16(n * 64 + 52, true);
				item.h21 = dataViewStepToday.getUint16(n * 64 + 54, true);
				item.h22 = dataViewStepToday.getUint16(n * 64 + 56, true);
				item.h23 = dataViewStepToday.getUint16(n * 64 + 58, true);

				if (valate == 0x34567890) {
					//			var pDate = util.getDataFrom1970(runDate, "yyyy-MM-dd");
					//			stepDataJsonToday[pDate] = item;
					//		console.log("today ^_^---step data=" + item.step);
					wx.setStorageSync("today", item);
					console.log("----设置当天->>>>>", item);
					wx.request({
						url: util.getUrl('ble.php?action=save_today_step_data'),
						data: {
							step_data: util.objToBase64(item),
							run_date: util.getDateOffset(0, "yyyy-MM-dd"),
							uid: wx.getStorageSync('serverId')
						},
						method: 'POST',
						header: { 'content-type': 'application/x-www-form-urlencoded' },
						success: function (res) {

							console.log("save--processStepToday--", res);

						}
					});
					getApp().globalData.indexPage.showHistoryData(util.getDateOffset(0, "yyyy-MM-dd"));
				}
				else if (valate == 0x45678901) {
					//	console.log("today ^_^---sleep data=" + item.step);
					//		var pDate = util.getDataFrom1970(runDate, "yyyy-MM-dd");
					//		sleepDataJsonToday[pDate] = item;
					console.log("睡眠时间:", item);
					wx.setStorageSync("today", item);

				}
				else {
					console.log("unused data......^_^");
				}

			}
		}
		//	console.log("run---run---" + JSON.stringify(stepDataJsonToday));

	}
}
function processStepHistory(val) {
	let dataView = new DataView(val);
	var total = dataView.getUint16(0, true);
	var seq = dataView.getUint16(2, true) - 1;

	if (seq == 0) {
		console.log("begin--------" + 16 * total);
		bufferStep = new ArrayBuffer(16 * total);
		dataViewStep = new DataView(bufferStep);
	}
	for (var n = 4; n < 20; n++) {
		dataViewStep.setUint8(seq * 16 + n - 4, dataView.getUint8(n));
	}

	if (seq == (total - 1)) {
		wx.setStorageSync("sync_flag", util.getDateOffset(0, "yyyy-MM-dd"));
		for (var n = 0; n < (16 * total) / 64; n++) {

			var runDate = dataViewStep.getUint32(n * 64, true);
			if (util.isValDate(runDate)) {
				var item = {};
				var valate = dataViewStep.getUint32(n * 64 + 60, true);
				item.h0 = dataViewStep.getUint16(n * 64 + 12, true);
				item.h1 = dataViewStep.getUint16(n * 64 + 14, true);
				item.h2 = dataViewStep.getUint16(n * 64 + 16, true);
				item.h3 = dataViewStep.getUint16(n * 64 + 18, true);
				item.h4 = dataViewStep.getUint16(n * 64 + 20, true);
				item.h5 = dataViewStep.getUint16(n * 64 + 22, true);
				item.h6 = dataViewStep.getUint16(n * 64 + 24, true);
				item.h7 = dataViewStep.getUint16(n * 64 + 26, true);
				item.h8 = dataViewStep.getUint16(n * 64 + 28, true);
				item.h9 = dataViewStep.getUint16(n * 64 + 30, true);
				item.h10 = dataViewStep.getUint16(n * 64 + 32, true);
				item.h11 = dataViewStep.getUint16(n * 64 + 34, true);
				item.h12 = dataViewStep.getUint16(n * 64 + 36, true);
				item.h13 = dataViewStep.getUint16(n * 64 + 38, true);
				item.h14 = dataViewStep.getUint16(n * 64 + 40, true);
				item.h15 = dataViewStep.getUint16(n * 64 + 42, true);
				item.h16 = dataViewStep.getUint16(n * 64 + 44, true);
				item.h17 = dataViewStep.getUint16(n * 64 + 46, true);
				item.h18 = dataViewStep.getUint16(n * 64 + 48, true);
				item.h19 = dataViewStep.getUint16(n * 64 + 50, true);
				item.h20 = dataViewStep.getUint16(n * 64 + 52, true);
				item.h21 = dataViewStep.getUint16(n * 64 + 54, true);
				item.h22 = dataViewStep.getUint16(n * 64 + 56, true);
				item.h23 = dataViewStep.getUint16(n * 64 + 58, true);
				// console.log(util.getDataFrom1970(runDate, "yyyy-MM-dd")+"=====valate===="+valate);
				if (valate == 0x34567890) {//计步数据
					item.time = dataViewStep.getUint32(n * 64 + 4, true);
					item.step = dataViewStep.getUint32(n * 64 + 8, true);

					var pDate = util.getDataFrom1970(runDate, "yyyy-MM-dd");
					stepDataJson[pDate] = item;

					console.log(pDate + "---^_^当日运动数据---step data="+item.step + "运动时间:"+item.time);
					wx.setStorageSync("step-" + pDate, item);
				}
				else if (valate == 0x45678901) {//睡眠数据
					item.startTime = dataViewStep.getUint32(n * 64 + 0, true);
					item.endTime = dataViewStep.getUint32(n * 64 + 4, true);
					item.runMin = dataViewStep.getUint16(n * 64 + 8, true);
					item.restless = dataViewStep.getUint16(n * 64 + 10, true);
					item.deep = (item.endTime - item.startTime) / 60 - item.runMin - item.restless;


					//item.runTime = dataViewStep.getUint32(n * 64 + 4, true);
					//item.step = dataViewStep.getUint32(n * 64 + 8, true);

					var pDate = util.getDataFrom1970(runDate, "yyyy-MM-dd");

					sleepDataJson[pDate] = item;
					console.log(pDate + "^_^---sleep data=", item);
					wx.setStorageSync("sleep-" + pDate, item);
				}
				else {
					console.log("unused data......^_^");
				}

			}//end if 
		}//end for

		showAndSaveStepData();
	}
}
function processHeartHistory(val) {
	return;
	let dataView = new DataView(val);

	var total = dataView.getUint16(0, true);
	var seq = dataView.getUint16(2, true) - 1;

	console.log(readHistoryType + " readHistoryType, total=" + total + " seq=" + seq);

	if (seq == 0) {
		bufferStep = new ArrayBuffer(16 * total);
		dataViewStep = new DataView(bufferStep);
	}
	for (var n = 4; n < 20; n++) {
		dataViewStep.setUint8(seq * 16 + n - 4, dataView.getUint8(n));
	}

	if (seq == (total - 1)) {
		var offset = 0;
		for (var offset = 0; offset < (16 * total);) {
			if (util.isValDate(dataViewStep.getUint32(offset, true)) == false) {
				offset = offset + 8 * count + 8;
				continue;
			}
			var currDate = util.getDataFrom1970(dataViewStep.getUint32(offset, true), "yyyy-MM-dd");
			var count = dataViewStep.getUint16(offset + 4, true);
			var val = dataViewStep.getUint16(offset + 6, true);
			if (val != 0x9012) {
				offset = offset + 8 * count + 8;
				continue;
			}


			for (var n = 0; n < count; n++) {
				var seq = offset + 8 + n * 8;
				var hour = dataViewStep.getUint8(seq + 0, true);
				var min = dataViewStep.getUint8(seq + 1, true);
				var hb = dataViewStep.getUint8(seq + 2, true);
				var max_bp = dataViewStep.getUint8(seq + 3, true);
				var min_bp = dataViewStep.getUint8(seq + 4, true);

				console.log(currDate + " " + hour + ":" + min + " hb=" + hb + " max_bp=" + max_bp + " min_bp=" + min_bp + "  val=" + val + "---" + 0x9012);

			}

			offset = offset + 8 * count + 8;

		}//end for
		wx.hideLoading();
	}
}
function uploadConfig() {
	console.log("--------uploadConfig-----------");
	wx.request({
		url: util.getUrl('setting.php?action=save_all_setting'),
		data: {
			model: wx.getStorageSync("model"),
			mac: wx.getStorageSync("mac"),
			hw_version: wx.getStorageSync("hw_version"),
			sw_version: wx.getStorageSync("sw_version"),
			manufacturer: wx.getStorageSync("manufacturer"),
			power: wx.getStorageSync("power"),
			device_id: g_deviceId,
			uid: wx.getStorageSync('serverId'),
			config: util.objToBase64(wx.getStorageSync("config"))
		},
		method: 'POST',
		header: { 'content-type': 'application/x-www-form-urlencoded' },
		success: function (res) {
			console.log("save--uploadConfig--", res);
		}
	});

	syncTodayDate();
//	isNeedSyncHistory=true;

}
function bleCommNotifyRegister() {

	wx.onBLECharacteristicValueChange(function (res) {
	//	console.log(`---(^_^)---characteristic ${res.characteristicId} has changed, now is ${res.value}`)
		let dataView = new DataView(res.value);

		if (res.characteristicId.indexOf("FF14") > 0) { //系统参数
			console.log("系统参数..." + dataView.getInt8(0));
			if (dataView.getInt8(0) == 0) {
				/*
				1Byte: bit0--单位制(0:公制；1:英制)
			   bit1:2: 页序号0：0
			  1Byte: 身高（单位：50-250cm/20-100inch）
		2Byte: 体重（单位：30-250Kg/60-500Pd）
		2Byte: 步长（单位：20-200cm/5-100inch）
		1Byte: 目标类型 1:卡路里（0-59999Kcal）
						2:距离（PD199:0-99,MG353:0-400km/mile）
						3:步数（0-99999）
						4:时间（0-600Minute）
		4Byte: 目标值
		1Byte：年龄
		1Byte：性别
		2Byte：时区（单位分钟）
		1Byte：心率自动检测间隔时间,单位分钟: 0或10-120(5倍数）
		1Byte: 跑步目标类型（支持动态心率）
			   1:卡路里（0-59999Kcal）
			   2:距离（PD199:0-99,MG353:0-400km/mile）
			   3:步数（0-99999）
			   4:时间（0-600Minute）
				3Byte: 跑步目标值（支持动态心率）*/
				util.dumpArrayBuffer(dataView);


				console.log("信息: 身高:" + dataView.getUint8(1) + " 体重=" + dataView.getUint16(2, true)
					+ " 步长" + dataView.getUint16(4, true) + " 目标类型=" + dataView.getUint8(6) + " 目标值=" + dataView.getUint32(7, true) + " 年龄="
					+ dataView.getUint8(11) + " 性别=" + dataView.getUint8(12) + " 市区=" + dataView.getUint16(13, true) + " 心率自动检测间隔时间=" +
					dataView.getUint8(15) + "跑步目标类型（支持动态心率）=" + dataView.getUint8(16));


			}
			else if (dataView.getInt8(0) == 2) {
				/*
		"参数第2页：1/2
		1Byte: bit0--单位制(0:公制；1:英制)
			   bit1:2: 页序号1：0
		2Byte: 自行车轮圈周长（900-2500mm）
		2Byte: 自行车曲柄长度（110.0-236.5mm）
		4Byte：提醒时间段
			   1Byte：开始时间的小时值
			   1Byte：开始时间的分钟值
			   1Byte：结束时间的小时值
			   1Byte：结束时间的分钟值
		1Byte：提醒开关1
			   bit0：短信
			   bit1：电话
			   其他保留"
		1Byte：提醒开关2
			   bit0：REMINDER_WeChat = 0, //0:微信
			   bit1：REMINDER_QQ,         //1:QQ
			   bit2：REMINDER_Weibo,      //2:微博
			   bit3：REMINDER_Facebook,   //3:fb 
			   bit4：REMINDER_Messenger,  //4:messenger
			   bit5：REMINDER_Skype,      //5:skype
			   bit6：REMINDER_WhatsApp,   //6:whats app
			   bit7：REMINDER_Viber,      //7:viber
		1Byte：提醒开关3
			   bit0：REMINDER_VK,         //0:vk
			   bit1：REMINDER_LinkedIn,   //1:linked in
			   bit2：REMINDER_Twitter,    //2:twitter
			   bit3：REMINDER_Pinterest,  //3:pinterest
			   bit4：REMINDER_Instagram,  //4:instagram
			   bit5：REMINDER_Telegram,   //5:telegram
			   bit6：REMINDER_Snapchat,   //6:snapchat
			   bit7：REMINDER_Yandex,     //7:yandex
		8Byte：保留
		*/
				console.log("自行车轮圈周长=" + dataView.getUint16(1, true)
					+ "自行车曲柄长度" + dataView.getUint16(3, true) + " 提醒时间段=" + dataView.getUint32(5, true) + " 提醒开关1=" + dataView.getUint8(9) + " 提醒开关2=" + dataView.getUint8(10) + " 提醒开关3=" + dataView.getUint8(10));

			}
			else if (dataView.getInt8(0) == 4) {
				/*
		1Byte: bit0--单位制(0:公制；1:英制)
			   bit1:2: 页序号0：1
		4Byte：闹钟1开关和时间段
			   1Byte：bit7为开关标志，bit0-6==星期天-六
			   1Byte：闹钟1的小时值
			   1Byte：闹钟1的分钟值
			   1Byte：保留
		4Byte：闹钟2开关和时间段
			   1Byte：bit7为开关标志，bit0-6==星期天-六
			   1Byte：闹钟1的小时值
			   1Byte：闹钟1的分钟值
			   1Byte：保留
		4Byte：闹钟3开关和时间段
			   1Byte：bit7为开关标志，bit0-6==星期天-六
			   1Byte：闹钟1的小时值
			   1Byte：闹钟1的分钟值
			   1Byte：保留
		1Byte：多国语言的国家代码
			   0-ENGLISH,1-CN,2-TW,3-JAPANESE,4-KOREAN,
			   5-FRENCH,6-GERMAN,7-ITALIAN,8-DUTCH,
			   9-PORTUGUESE,10-SPANISH,11-SWEDISH,12-CZECH,
			   13-DANISH,14-POLISH,15-RUSSIAN,16-TURKISH,
			   17-BULGARIAN,18-HUNGARIAN,19-ROMANIAN,
			   20-SLOVENIAN,21-GREEK,
			  6Byte：保留"
		*/
				console.log("自行车轮圈周长=" + dataView.getUint16(1, true)
					+ "自行车曲柄长度" + dataView.getUint16(3, true) + " 提醒时间段=" + dataView.getUint32(5, true) + " 提醒开关1=" + dataView.getUint8(9, true) + " 提醒开关2=" + dataView.getUint8(10, true) + " 提醒开关3=" + dataView.getUint8(10, true));

			}
			util.dumpArrayBuffer(dataView);
		}
		else if (res.characteristicId.indexOf("2A35") > 0) { //手工测试心率和血压
			var low = dataView.getUint16(1, true);
			var high = dataView.getUint16(3, true);
			var hb = dataView.getUint16(7, true);
			console.log("低压:" + low + " 高压:" + high + " 心率:" + hb);
			getApp().globalData.indexPage.showDynHbBp(hb, low, high);

		}
		else if (res.characteristicId.indexOf("2A37") > 0) { //产品型号

			console.log(`--666-(^_^)---characteristic ${res.characteristicId} has changed, now is ${res.value}`)
			var str = "";
			for (var n = 0; n < dataView.byteLength; n++) {
				str = str + " " + dataView.getUint8(n);
			}
			console.log("notify data...." + str);
		}
		else if (res.characteristicId.indexOf("2A24") > 0) { //产品型号
			var data = util.arrayBufferToString(dataView);
			console.log("end====model=" + data);
			wx.setStorageSync("model", data);
			uploadConfig();
		}
		else if (res.characteristicId.indexOf("2A25") > 0) { //读取mac地址

			var data = util.arrayBufferToString(dataView);
			console.log("mac=" + data);
			wx.setStorageSync("mac", data);
			readHwVersion();
		}
		else if (res.characteristicId.indexOf("2A27") > 0) { //硬件版本
			var data = util.arrayBufferToString(dataView);
			console.log("hw_version=" + data);
			wx.setStorageSync("hw_version", data);
			readSwVersion();
		}
		else if (res.characteristicId.indexOf("2A28") > 0) {//软件版本
			var data = util.arrayBufferToString(dataView);
			console.log("sw_version=" + data);
			wx.setStorageSync("sw_version", data);
			readZhiZhaoShan();
		}
		else if (res.characteristicId.indexOf("2A29") > 0) {//
			var data = util.arrayBufferToString(dataView);
			console.log("manufacturer=" + data);
			wx.setStorageSync("manufacturer", data);
			readProductInfo();
		}
		else if (res.characteristicId.indexOf("2A19") > 0) {//电量返回
			console.log("电量power=" + dataView.getUint8(0, true));
			wx.setStorageSync("power", dataView.getUint8(0, true));
			getApp().globalData.indexPage.setData({
				power_ps: parseInt(dataView.getUint8(0, true)),
				power_text: parseInt(dataView.getUint8(0, true)),
			});
			readMacAddr();
			return;
		}
		else if (res.characteristicId.indexOf("FF11") > 0) {
			console.log("total=" + dataView.getUint32(0, true));

			var str = "";
			for (var n = 0; n < dataView.byteLength; n++) {
			}
			initCharacteristic180A();
			var todayData = new Object();

			getApp().globalData.indexPage.showCurrStepInfo(dataView.getUint32(10, true),
				dataView.getUint32(14, true));
			todayData.step = dataView.getUint32(10, true);
			todayData.h0 = 0;
			todayData.h1 = 0;
			todayData.h2 = 0;
			todayData.h3 = 0;
			todayData.h4 = 0;
			todayData.h5 = 0;
			todayData.h6 = 0;
			todayData.h7 = 0;
			todayData.h8 = 0;
			todayData.h9 = 0;
			todayData.h10 = 0;
			todayData.h11 = 0;
			todayData.h12 = 0;
			todayData.h13 = 0;
			todayData.h14 = 0;
			todayData.h15 = 0;
			todayData.h16 = 0;
			todayData.h17 = 0;
			todayData.h18 = 0;
			todayData.h19 = 0;
			todayData.h20 = 0;
			todayData.h21 = 0;
			todayData.h22 = 0;
			todayData.h23 = 0;
			todayData.time = dataView.getUint32(14, true);

			wx.setStorageSync("today", todayData);
			console.log(dataView.getUint32(14, true) + " ---save today....", todayData);

			var h1 = wx.getStorageSync("step-" + util.getDateOffset(-1, "yyyy-MM-dd"));
			var h2 = wx.getStorageSync("step-" + util.getDateOffset(-2, "yyyy-MM-dd"));

			// syncStepHistory();
			// 

			if (h1 == null || h1.hasOwnProperty("step") == false) {
				console.log("-----save^_^-----", h1);
				var syncFlag = wx.getStorageSync("sync_flag");
				console.log("syncFlag=", syncFlag);
				if (syncFlag == null || syncFlag == "") {
					isNeedSyncHistory = true;
					//   syncStepHistory();
				}
				else {
					if (syncFlag != util.getDateOffset(0, "yyyy-MM-dd")) {
						isNeedSyncHistory = true;
						//syncStepHistory();
					}
				}
				//	syncStepHistory();

			}
			else {
				//    syncHeartBeatHistory();
				console.log("不需要同步历史数据");
			}
			console.log("syncStep=" + str);
		}
		else if (res.characteristicId.indexOf("FF13") > 0) {//读取当天的数据
			//	console.log(ddd + `>>>yls-begin today>>>>>characteristic ${res.characteristicId} has changed, now is ${res.value}`);
			//  util.dumpArrayBuffer(dataView);
			processStepToday(dataView);
			if (isNeedSyncHistory == true) {
				isNeedSyncHistory = false;
				syncStepHistory();
			}

		}
		else if (res.characteristicId.indexOf("FF21") > 0) {//读取历史数据
			// console.log(readHistoryType + `>>>yls-begin history>>>>>characteristic ${res.characteristicId} has changed, now is ${res.value}`);
			if (readHistoryType == 0)
				processStepHistory(res.value);
			else
				processHeartHistory(res.value);
		}
	});
}
function initCharacteristic180A() {
	console.log("initCharacteristic180A...begin...");
	wx.getBLEDeviceCharacteristics({
		deviceId: g_deviceId,
		serviceId: getServerId("180F"),
		success: function (res) {
			console.log("initCharacteristic180A...read power...");
			readPowerUsed();
			//	readMacAddr();
		},
		fail: function (res) {
			console.log('180A蓝牙返回错误:readBLECharacteristicValue:', res);
		}
	});
}
function syncTodayDate() {

	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("FFC0"),
		characteristicId: getCharacter("FF13"),
		success: function (res) {
			wx.notifyBLECharacteristicValueChanged({
				deviceId: g_deviceId,
				serviceId: getServerId("FFC0"),
				characteristicId: getCharacter("FF13"),
				state: true,
				success: function (res) {
					// success

					console.log("-------succed----", res);
				},
				fail: function (res) {
					console.log("-------failure----", res);
					// fail
				}
			});
			console.log(total + '蓝牙返回成功:readBLECharacteristicValue:', res);
			total++;
		},
		fail: function (res) {
			console.log('蓝牙返回错误:readBLECharacteristicValue:', res);
		}
	});
	//读取当前的数据

}
function syncRunStep() {
	bleCommNotifyRegister();
	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("FFC0"),
		characteristicId: getCharacter("FF11"),
		success: function (res) {
			console.log(total + '蓝牙返回成功:readBLECharacteristicValue:', res);
			total++;

		},
		fail: function (res) {
			console.log('蓝牙返回错误:readBLECharacteristicValue:', res);
		}
	});
	//syncTodayDate();
}

function showAndSaveStepData() {
	console.log("stepData...", stepDataJson);
	console.log("sleepData...", sleepDataJson);
	wx.request({
		url: util.getUrl('ble.php?action=save_step_data'),
		data: {
			step_data: util.objToBase64(stepDataJson),
			sleep_data: util.objToBase64(sleepDataJson),
			uid: wx.getStorageSync('serverId')
		},
		method: 'POST',
		header: { 'content-type': 'application/x-www-form-urlencoded' },
		success: function (res) {
			wx.hideLoading();
			console.log("save--showAndSaveStepData--", res);

		}
	});
}
function endHeartBeatTest() {
	let buffer = new ArrayBuffer(20);
	let dataView = new DataView(buffer);
	for (var n = 0; n < 20; n++) {
		dataView.setUint8(n, 0x00);
	}
	dataView.setUint8(0, 0x01);
	dataView.setUint8(1, 0x02);
	dataView.setUint8(2, 0x03);


	wx.writeBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("FFC0"),
		characteristicId: getCharacter("FF12"),
		value: buffer,
		success: function (res) {
			console.log("sync write....", res);

		},
		fail: function (res) {
			console.log("写入数据失败:", res);
		}
	});
}
function beginH() {
	let buffer = new ArrayBuffer(20);
	let dataView = new DataView(buffer);
	for (var n = 0; n < 20; n++) {
		dataView.setUint8(n, 0x00);
	}
	dataView.setUint8(0, 0x01);
	dataView.setUint8(1, 0x02);
	dataView.setUint8(2, 0x01);


	wx.writeBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("FFC0"),
		characteristicId: getCharacter("FF12"),
		value: buffer,
		success: function (res) {
			console.log("sync write....", res);
			wx.notifyBLECharacteristicValueChanged({
				deviceId: g_deviceId,
				serviceId: getServerId("1810"),
				characteristicId: getCharacter("2A35"),
				state: true,
				success: function (res) {
				}
			});
		},
		fail: function (res) {
			console.log("写入数据失败:", res);
		}
	});
	return ;
	wx.notifyBLECharacteristicValueChanged({
		deviceId: g_deviceId,
		serviceId: getServerId("1810"),
		characteristicId: getCharacter("2A35"),
		state: true,
		success: function (res) {
			console.log("181D/2A37 readPowerUsed-------succeed!----", res);
			let buffer = new ArrayBuffer(20);
			let dataView = new DataView(buffer);
			for (var n = 0; n < 20; n++) {
				dataView.setUint8(n, 0x00);
			}
			dataView.setUint8(0, 0x01);
			dataView.setUint8(1, 0x02);
			dataView.setUint8(2, 0x01);

			wx.writeBLECharacteristicValue({
				deviceId: g_deviceId,
				serviceId: getServerId("FFC0"),
				characteristicId: getCharacter("FF12"),
				value: buffer,
				success: function (res) {
					console.log("sync write....", res);
				},
				fail: function (res) {
					console.log("写入数据失败:", res);
				}
			});
		},
		fail: function (res) {
			console.log("1810/2A35 readPowerUsed-------failure----", res);
		}
	});
}
function beginHeartBeatTest() {
	/*
	wx.getBLEDeviceCharacteristics({
		deviceId: g_deviceId,
		serviceId: getServerId("1810"),
		success: function (res) {
			console.log("init 1810 succeed", res);
			//    beginH();
		},
		fail: function (res) {
			console.log('1810蓝牙返回错误:readBLECharacteristicValue:', res);
		}
	});
	*/
	wx.getBLEDeviceCharacteristics({
		deviceId: g_deviceId,
		serviceId: getServerId("180D"),
		success: function (res) {
			console.log("init 180D succeed", res);
			beginH();
		},
		fail: function (res) {
			console.log('180A蓝牙返回错误:readBLECharacteristicValue:', res);
		}
	});
}

function syncHeartBeatHistory() {
	wx.showLoading({
		title: '同步心率血压数据...',
	});
	readHistoryType = 1;
	//读取当前的数据
	wx.notifyBLECharacteristicValueChanged({
		deviceId: g_deviceId,
		serviceId: getServerId("FFC0"),
		characteristicId: getCharacter("FF13"),
		state: true,
		success: function (res) {
			// success
			console.log("-------succed----", res);
		},
		fail: function (res) {
			console.log("-------failure----", res);
			// fail
		}
	});

	wx.notifyBLECharacteristicValueChanged({
		deviceId: g_deviceId,
		serviceId: getServerId("FFC0"),
		characteristicId: getCharacter("FF21"),
		state: true,
		success: function (res) {
			let buffer = new ArrayBuffer(20);
			let dataView = new DataView(buffer);
			for (var n = 0; n < 20; n++) {
				dataView.setUint8(n, 0x00);
			}
			dataView.setUint8(0, 0x01);
			dataView.setUint8(1, 0x02);
			dataView.setUint8(2, 0x22);

			wx.writeBLECharacteristicValue({
				deviceId: g_deviceId,
				serviceId: getServerId("FFC0"),
				characteristicId: getCharacter("FF12"),
				value: buffer,
				success: function (res) {
					console.log("sync write....", res);
				},
				fail: function (res) {
					console.log("写入数据失败:", res);
				}
			});
		},
		fail: function (res) {
			console.log("-------failure----", res);
			// fail
		},
		complete: function (res) {
			//console.log("-------complete----", res);
			// complete
		}
	});

	return;
}
function readNotify()
{
	wx.notifyBLECharacteristicValueChanged({
		deviceId: g_deviceId,
		serviceId: getServerId("FFC0"),
		characteristicId: getCharacter("FF21"),
		state: true,
		success: function (res) {
		},
		fail: function (res) {
			console.log("-------failure----", res);
			// fail
		},
		complete: function (res) {
			//console.log("-------complete----", res);
			// complete
		}
	});
}
function endSync()
{
	wx.hideLoading();
}
function syncStepHistory() {
	wx.showLoading({
		title: '同步历史数据...',
	});
	setTimeout(endSync,10*1000);
	readHistoryType = 0;

		// success
		let buffer = new ArrayBuffer(20);
		let dataView = new DataView(buffer);
		for (var n = 0; n < 20; n++) {
			dataView.setUint8(n, 0x00);
		}
		dataView.setUint8(0, 0x01);
		dataView.setUint8(1, 0x02);
		dataView.setUint8(2, 0x20);


		wx.writeBLECharacteristicValue({
			deviceId: g_deviceId,
			serviceId: getServerId("FFC0"),
			characteristicId: getCharacter("FF12"),
			value: buffer,
			success: function (res) {
				readNotify();
				console.log("sync write....", res);
			},
			fail: function (res) {
				console.log("写入数据失败:", res);
			}
		});

		return;
	//}
		

	//读取当前的数据
/*
	wx.notifyBLECharacteristicValueChanged({
			deviceId: g_deviceId,
			serviceId: getServerId("FFC0"),
			characteristicId: getCharacter("FF13"),
			state: true,
			success: function (res) {
				// success
				console.log("-------succed----", res);
			},
			fail: function (res) {
				console.log("-------failure----", res);
				// fail
			}
		});*/

	wx.notifyBLECharacteristicValueChanged({
		deviceId: g_deviceId,
		serviceId: getServerId("FFC0"),
		characteristicId: getCharacter("FF21"),
		state: true,
		success: function (res) {
			// success
			let buffer = new ArrayBuffer(20);
			let dataView = new DataView(buffer);
			for (var n = 0; n < 20; n++) {
				dataView.setUint8(n, 0x00);
			}
			dataView.setUint8(0, 0x01);
			dataView.setUint8(1, 0x02);
			dataView.setUint8(2, 0x20);


			wx.writeBLECharacteristicValue({
				deviceId: g_deviceId,
				serviceId: getServerId("FFC0"),
				characteristicId: getCharacter("FF12"),
				value: buffer,
				success: function (res) {
					console.log("sync write....", res);
				},
				fail: function (res) {
					console.log("写入数据失败:", res);
				}
			});
		},
		fail: function (res) {
			console.log("-------failure----", res);
			// fail
		},
		complete: function (res) {
			//console.log("-------complete----", res);
			// complete
		}
	});
	return;
}

function beginService() {
	wx.getBLEDeviceServices({
		deviceId: g_deviceId,
		success: function (res) {
			g_services = res.services[1].uuid;
			for (var n = 0; n < res.services.length; n++) {
				g_services = "" + res.services[n].uuid;
			
				if (g_services.indexOf("FFC0") > 0)
					break;
			}
			console.log("global uuid=" + g_services);
			setTimeout(function () {
				g_services = serverId180A;
				wx.getBLEDeviceCharacteristics({
					deviceId: g_deviceId,
					serviceId: getServerId("FFC0"),
					success: function (res) {
						read_time();
					}
				});
				wx.getBLEDeviceCharacteristics({
					// 这里的 deviceId 需要在上面的 getBluetoothDevices
					deviceId: g_deviceId,
					// 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
					serviceId: g_services,
					success: function (res) {
						//read_time();
						return;

					}, fail: function (res) {
						console.log(res);
					}
				})
			}, 1500);
		}
	})
}
function findService() {
	wx.getBLEDeviceServices({
		// 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
		deviceId: g_deviceId,
		success: function (res) {
			console.log('device services:', res.services);
			g_services = res.services[0].uuid;
			setTimeout(findCharacteristics, 1000);

		}
	})
}
function findCharacteristics() {
	wx.getBLEDeviceCharacteristics({
		// 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
		deviceId: g_deviceId,
		// 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
		serviceId: g_services,
		success: function (res) {
			console.log('device getBLEDeviceCharacteristics:', res.characteristics);
			g_characteristics = res.characteristics[2].uuid;
			console.log("读取特征:" + res.characteristics[1].uuid);
			notifyBLECharacteristicValueChanged();
		}
	})
}

function findDevice(val) {
	wx.getBLEDeviceCharacteristics({
		deviceId: g_deviceId,
		serviceId: getServerId("1802"),
		success: function (res) {
			let buffer = new ArrayBuffer(1);
			let dataView = new DataView(buffer);
			// for (var n = 0; n < 20; n++) {
			//  dataView.setUint8(n, 0x00);
			//}
			dataView.setUint8(0, val);

			wx.writeBLECharacteristicValue({
				deviceId: g_deviceId,
				serviceId: getServerId("1802"),
				characteristicId: getCharacter("2A06"),
				value: buffer,
				success: function (res) {
					console.log("sync write....", res);
					wx.showToast({
						title: '正在查找设备...',
					});
				},
				fail: function (res) {
					console.log("写入数据失败:", res);
				}
			});
		},
		fail: function (res) {
			console.log('1802蓝牙返回错误:readBLECharacteristicValue:', res);
		}
	});

}

function loadBleDevice(serviceId) {
	wx.showLoading({
		title: '连接蓝牙设备中...',
	});
	console.log("uuid=====" + serviceId);
	wx.createBLEConnection({
		deviceId: serviceId,
		success: function (res) {
			wx.hideLoading()
			wx.showToast({
				title: '连接成功',
				icon: 'success',
				duration: 1000
			})
			console.log("连接设备成功")

			console.log(res)
			isConnect = 1;
			beginService();
			//  findService();

		},
		fail: function (res) {
			wx.hideLoading()
			wx.showToast({
				title: '连接设备失败',
				icon: 'success',
				duration: 1000
			})
			getApp().globalData.indexPage.showHistoryData(util.getDateOffset(0, "yyyy-MM-dd"));
			console.log("连接设备失败")
			isConnect = 0;
			console.log(res)
		}
	});
	wx.onBLEConnectionStateChange(function (res) {
		// 该方法回调中可以用于处理连接意外断开等异常情况
		console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
		if (res.connected == false) {
			isConnect = 0;
			getApp().globalData.indexPage.setData({
				isConnect: 0
			});
		}
		else {
			isConnect = 1;
			getApp().globalData.indexPage.setData({
				isConnect: 1
			});
		}
	})
}
function openBleDevice() {
	wx.openBluetoothAdapter({
		success: function (res) {
			console.log("初始化蓝牙适配器成功")

			wx.onBluetoothAdapterStateChange(function (res) {
				console.log("蓝牙适配器状态变化", res)
			})
		},
		fail: function (res) {
			console.log("初始化蓝牙适配器失败");
			wx.showModal({
				title: '提示',
				content: '请检查手机蓝牙是否打开',
				success: function (res) {
				}
			})
		}
	})
}
function getConnectState() {
	return isConnect;
}
function disConnect()
{
	console.log("will  be disconnect....");
}
module.exports = {
	initBle: initBle,
	syncBle: syncBle,
	openBleDevice: openBleDevice,
	getConnectState: getConnectState,
	beginHeartBeatTest: beginHeartBeatTest,
	endHeartBeatTest: endHeartBeatTest,
	findDevice: findDevice,
	saveAllConfig: saveAllConfig,
	disConnect: disConnect

}