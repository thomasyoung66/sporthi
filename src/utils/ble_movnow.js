var g_deviceId = "";
var g_services = null;
var g_characteristics;
var g_characteristics_notify = "000001D4-0000-1000-8000-00805F9B34FB";
var g_characteristics_write =  "000000D4-0000-1000-8000-00805F9B34FB";

//var g_characteristics_notify = "003784CF-F7E3-55B4-6C4C-9FD140100A16";
//var g_characteristics_write = "013784CF-F7E3-55B4-6C4C-9FD140100A16";

var cd0 = null;
var cd1 = null;
var cd2 = null;
var cd3 = null;
var cd4 = null;
var allDays=0;
var currDay=0;
var isConnect = 0;
var isNeedSyncHistory = false;
var util = require('util.js');

var board_serverId = "00001800-0000-1000-8000-00805F9B34FB";

var syncDataType="step";

var app = getApp();
var supportHb=false;


function getServerId(id) {
	return "0000" + id + "-0000-1000-8000-00805F9B34FB";
}
function getCharacter(id) {
	return "0000" + id + "-0000-1000-8000-00805F9B34FB";
}

function initBle(deviceId, service, notify, write,hb) {
	g_deviceId = deviceId;
	g_services = service;
	g_characteristics_notify = notify;
	g_characteristics_write = write;
	supportHb=hb;
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

function readAllConfig() {

	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId:g_services,
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
function setSyncConfig()
{
	let buffer = new ArrayBuffer(20);
	let dataView = new DataView(buffer);
	for (var n = 0; n < 20; n++) {
		dataView.setUint8(n, 0x00);
	}
	dataView.setUint8(0, 0x5A);
	dataView.setUint8(1, 0x01);
	dataView.setUint8(2, 0x00);
	var now = new Date();
	dataView.setUint8(3, now.getFullYear()-2000);
	dataView.setUint8(4, now.getMonth()+1);
	dataView.setUint8(5, now.getDate());
	dataView.setUint8(6, now.getHours());
	dataView.setUint8(7, now.getMinutes());
	dataView.setUint8(8, now.getSeconds());
	dataView.setUint16(9, util.safe(wx.getStorageSync("dest"), 7000),true);
	dataView.setUint8(11, 1);//位置
	dataView.setUint8(12, 1);//模式
	dataView.setUint8(13, 0x00); //标识
	dataView.setUint8(14, 0x00);//版本协议
	dataView.setUint8(15, 0x00); //版本协议
	dataView.setUint8(16, 0x00);//性别 年龄
	dataView.setUint8(17, util.safe(wx.getStorageSync("weight"), 70));//体重
	dataView.setUint8(18, util.safe(wx.getStorageSync("height"), 170));//身高
	dataView.setUint8(19, 0);//体重

	util.dumpArrayBuffer(dataView);

	wx.writeBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: g_services,
		characteristicId: g_characteristics_write,
		value: buffer,
		success: function (res) {
			console.log("sync write 同步参数....", res);

		},
		fail: function (res) {
			console.log("写入数据失败 when 同步参数", res);
		}
	});

}
function readPowerUsed() {
	bleCommNotifyRegister();
	loadHistorying=false;
	let buffer = new ArrayBuffer(20);
	let dataView = new DataView(buffer);
	for (var n = 0; n < 20; n++) {
		dataView.setUint8(n, 0x00);
	}
	dataView.setUint8(0, 0x5a);
	dataView.setUint8(1, 0x0d);
	dataView.setUint8(2, 0x00);
	dataView.setUint8(3, 0x80);
	util.dumpArrayBuffer(dataView);
	console.log("g_deviceId=" + g_deviceId + " g_services=" + g_services + " g_characteristics_write=" + g_characteristics_write);

	wx.notifyBLECharacteristicValueChanged({
		deviceId: g_deviceId,
		serviceId: g_services,
		characteristicId: g_characteristics_notify,
		state: true,
		success: function (res) {

			console.log("-------succed----", res);
		},
		fail: function (res) {
			console.log("-------failure----", res);
			// fail
		}
	});

	wx.writeBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: g_services,
		characteristicId: g_characteristics_write,
		value: buffer,
		success: function (res) {
			console.log("sync write 电源....", res);

		},
		fail: function (res) {
			console.log("写入数据失败 read power:", res);
		}
	});
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
var currDate;
var currTotal=0;
var currNumber=0;
function processSleepToday(dataView) {
//	console.log("处理睡眠数据....");
	/*
	if (dataView.getUint8(3) == 0) {//没有睡眠数据可以同步
		if (loadHistorying == false) {
			
			var syncFlag = wx.getStorageSync("sync_flag");
			console.log("syncFlag=", syncFlag);
			if (syncFlag == null || syncFlag == "") {
				syncStepHistory();
			}
			else {
				if (syncFlag != util.getDateOffset(0, "yyyy-MM-dd")) {
					syncStepHistory();
				}
			}
		}
		else {
		
			wx.setStorageSync("sync_flag", util.getDateOffset(0, "yyyy-MM-dd"));
		}
		syncTodayHb();
		return ;
	}*/
//	console.log("睡眠》》》》序列号：" + dataView.getUint8(2));
	if (dataView.getUint8(2) == 1) {
		/*
		console.log("包长度:" + "---" + dataView.getUint16(3));
		console.log("包序号:" + dataView.getUint16(5));

		console.log("间隔:" + dataView.getUint8(13));
		console.log("条数:" + dataView.getUint8(14));
		console.log("标志:" + dataView.getUint8(15));
		*/
		var seq = dataView.getUint16(5);
		currNumber = dataView.getUint8(14);
		currDate = util.sprintf("%d-%02d-%02d", dataView.getUint8(10) + 2000, dataView.getUint8(11), dataView.getUint8(12));
		console.log("日期:" + currDate);
		currTotal = 0;
		bufferStepToday = new ArrayBuffer(1024);
		dataViewStepToday = new DataView(bufferStepToday);

	}
	else if (dataView.getUint8(2) == 0xFF || dataView.getUint8(2) == 0xFE) {

		console.log("debug...........0");
		var len = dataView.byteLength - 3;
		for (var n = 0; n < len; n++) {
			dataViewStepToday.setUint8(currTotal + n, dataView.getUint8(3 + n));
		}

		if (currNumber==0)
			currNumber = currTotal+len;
		console.log("debug...........1..." + currNumber);
		var detail = new Array();
		var total = 0;
		var deep=0;
		var shallow=0;
		util.dumpArrayBuffer(dataViewStepToday,"所有数据");
		for (var n = 0; n < currNumber/4; n++) {
			var beginTime = dataViewStepToday.getUint16(4 * n);
			var dur = dataViewStepToday.getUint8(4 * n+2);
			var status = dataViewStepToday.getUint8(4 * n + 3);
			console.log("beginTime=" + util.toHourMinute(beginTime)+" dur="+dur+" status="+status);
			if (dur>0)
				detail.push(beginTime + "," + dur + "," + status);
			if (status==0){
				deep=deep+dur;
			}
			else
				shallow = shallow+dur;
			//if (step >= 0xFF00)
			//	step = 0;
			//detail.push(step);
			total = total + dur;
			//console.log(currTotal+"---"+n+"----loop-----");
		}

		var item = {};
		item.time = 0;
		item.type = 48;
		item.sleep = total;
		item.detail = detail;
		item.deep=deep;
		item.shallow = shallow;

		wx.setStorageSync("today_sleep", item);
		console.log("debug...........3");
		console.log("----设置当天->>>>>", item);
		wx.request({
			url: util.getUrl('ble.php?action=save_today_sleep_data'),
			data: {
				step_data: util.objToBase64(item),
				run_date: currDate,
				uid: wx.getStorageSync('serverId')
			},
			method: 'POST',
			header: { 'content-type': 'application/x-www-form-urlencoded' },
			success: function (res) {
				console.log("save--processStepToday--", res);
			}
		});
		getApp().globalData.indexPage.showHistoryData(util.getDateOffset(0, "yyyy-MM-dd"));
		if (supportHb==false){
			wx.hideLoading();
		}
		syncTodayHb();
	//	syncTodaySleep();
		return;

		//util.dumpArrayBuffer(dataViewStepToday);
	}
	else {
		for (var n = 0; n < 17; n++) {
			var seq = 17 * (dataView.getUint8(2) - 2);
			dataViewStepToday.setUint8(seq + n, dataView.getUint8(3 + n));
		}
		currTotal = currTotal + 17;
	}

}

function processHbAll(dataView) {
	console.log("处理心率数据....");
	if (dataView.getUint8(2) == 1) {
		var seq = dataView.getUint16(5);
		currNumber = dataView.getUint8(14);
		currDate = util.sprintf("%d-%02d-%02d", dataView.getUint8(10) + 2000, dataView.getUint8(11), dataView.getUint8(12));
		console.log("心率>>>>>日期:" + currDate + " 条数:" + currNumber);
		currTotal = 0;
		bufferStepToday = new ArrayBuffer(1024);
		dataViewStepToday = new DataView(bufferStepToday);
		currDay++;
	}
	else if (dataView.getUint8(2) == 0xFF || dataView.getUint8(2) == 0xFE) {
	
		var len = dataView.byteLength - 3;
		for (var n = 0; n < len; n++) {
			dataViewStepToday.setUint8(currTotal + n, dataView.getUint8(3 + n));
		}

		if (currNumber == 0)
			currNumber = currTotal + len;
		console.log("debug...........总共的数据量=" + currNumber);

	//	util.dumpArrayBuffer(dataViewStepToday,"ok....");
	    var hb=[];
		var col=[];
		var val=[];
		for (var n = 0; n < currNumber; n++) {
			var beginTime = dataViewStepToday.getUint16(3 * n);
			var dur = dataViewStepToday.getUint8(3 * n + 2);
			if (beginTime>0){
				console.log(util.toHourMinute(beginTime) + "---" + n + "----loop-----" + dur);
				hb.push(beginTime+":"+dur);
				col.push(util.toHourMinute(beginTime));
				val.push(dur);
			}

		}
		if (currDate == util.getDateOffset(0, "yyyy-MM-dd")){
			getApp().globalData.indexPage.drawHistoryHeartRateCanvas(col,val);
		}
		else{
			getApp().globalData.indexPage.drawHistoryHeartRateCanvas([],[]);
		}
		
		if (hb.length>0){
			var item = {};
			item.date = currDate;
			item.detail = hb.join(";");

			wx.setStorageSync("hb-" + currDate, item);
			wx.request({
				url: util.getUrl('ble.php?action=save_hb_data'),
				data: {
					hb_data: util.objToBase64(item),
					run_date: currDate,
					uid: wx.getStorageSync('serverId')
				},
				method: 'POST',
				header: { 'content-type': 'application/x-www-form-urlencoded' },
				success: function (res) {
				
				}
			});
		}
		console.log(currDay+"--同步的天数情况--"+allDays);
		if (currDay==allDays){
			syncTodayBp();
		}
	//	getApp().globalData.indexPage.showHistoryData(util.getDateOffset(0, "yyyy-MM-dd"));
		wx.hideLoading();
		return;

		//util.dumpArrayBuffer(dataViewStepToday);
	}
	else {
		for (var n = 0; n < 17; n++) {
			var seq = 17 * (dataView.getUint8(2) - 2);
			dataViewStepToday.setUint8(seq + n, dataView.getUint8(3 + n));
		}
		currTotal = currTotal + 17;
	}

}
function processBpAll(dataView) {
	console.log("处理血压数据....");
	if (dataView.getUint8(2) == 1) {
		var seq = dataView.getUint16(5);
		currNumber = dataView.getUint8(14);
		currDate = util.sprintf("%d-%02d-%02d", dataView.getUint8(10) + 2000, dataView.getUint8(11), dataView.getUint8(12));
		console.log("血压>>>>>>日期:" + currDate + " 条数:" + currNumber);
		currTotal = 0;
		bufferStepToday = new ArrayBuffer(1024);
		dataViewStepToday = new DataView(bufferStepToday);
	}
	else if (dataView.getUint8(2) == 0xFF || dataView.getUint8(2) == 0xFE) {

		var len = dataView.byteLength - 3;
		for (var n = 0; n < len; n++) {
			dataViewStepToday.setUint8(currTotal + n, dataView.getUint8(3 + n));
		}

		if (currNumber == 0)
			currNumber = currTotal + len;
		console.log("debug...........总共的数据量=" + currNumber);

		var detail = new Array();
		var total = 0;
		var deep = 0;
		var shallow = 0;
		util.dumpArrayBuffer(dataViewStepToday, "ok....");
		for (var n = 0; n < currNumber; n++) {
			var high = dataViewStepToday.getUint8(2 * n);
			var low = dataViewStepToday.getUint8(2 * n + 1);
		//	if (beginTime > 0)
				console.log(high + "---" + n + "----loop-----" + low);
		}
		return;
		var item = {};
		item.time = 0;
		item.type = 48;
		item.sleep = total;
		item.detail = detail;
		item.deep = deep;
		item.shallow = shallow;

		wx.setStorageSync("today_sleep", item);
		console.log("debug...........3");
		console.log("----设置当天->>>>>", item);
		wx.request({
			url: util.getUrl('ble.php?action=save_today_sleep_data'),
			data: {
				step_data: util.objToBase64(item),
				run_date: currDate,
				uid: wx.getStorageSync('serverId')
			},
			method: 'POST',
			header: { 'content-type': 'application/x-www-form-urlencoded' },
			success: function (res) {
				console.log("save--processStepToday--", res);
			}
		});
		getApp().globalData.indexPage.showHistoryData(util.getDateOffset(0, "yyyy-MM-dd"));
		wx.hideLoading();
		return;

		//util.dumpArrayBuffer(dataViewStepToday);
	}
	else {
		for (var n = 0; n < 17; n++) {
			var seq = 17 * (dataView.getUint8(2) - 2);
			dataViewStepToday.setUint8(seq + n, dataView.getUint8(3 + n));
		}
		currTotal = currTotal + 17;
	}

}
function processStepToday(dataView) {
	//	let dataView = new DataView(val);

	console.log("》》》》序列号："+dataView.getUint8(2));
	if (dataView.getUint8(2) == 1) {
		console.log("包长度:" +  "---" + dataView.getUint16(3));
		console.log("包序号:" + dataView.getUint16(5));
	
		console.log("间隔:" + dataView.getUint8(13));
		console.log("条数:" + dataView.getUint8(14));
		console.log("标志:" + dataView.getUint8(15));
		var seq = dataView.getUint16(5);
		currNumber = dataView.getUint8(14);
		currDate = util.sprintf("%d-%02d-%02d", dataView.getUint8(10) + 2000, dataView.getUint8(11), dataView.getUint8(12));
		console.log("日期:"+currDate);
		currTotal = 0;
		bufferStepToday = new ArrayBuffer(1024);
		dataViewStepToday = new DataView(bufferStepToday);

	}
	else if (dataView.getUint8(2) == 0xFF || dataView.getUint8(2) == 0xFE) {

		console.log("debug...........0");
		var len = dataView.byteLength-3;
		for (var n = 0; n < len; n++) {
			dataViewStepToday.setUint8(currTotal+n, dataView.getUint8(3 + n));
		}
		console.log("debug...........1");
		var detail=new Array();
		var total=0;
		for (var n = 0; n < currNumber;n++){
			var step = dataViewStepToday.getUint16(2 * n);
			if (step>=0xFF00)
				step=0;
			detail.push(step);
			total=total+step;
			//console.log(currTotal+"---"+n+"----loop-----");
		}
		console.log("debug...........2");
		var item = {};
		item.time = 0;
		item.type= 48;
		item.step = total;
		item.detail=detail;
		wx.setStorageSync("today", item);
		console.log("debug...........3");
		console.log("----设置当天->>>>>", item);
		wx.request({
			url: util.getUrl('ble.php?action=save_today_step_data'),
			data: {
				step_data: util.objToBase64(item),
				run_date: currDate,
				uid: wx.getStorageSync('serverId')
			},
			method: 'POST',
			header: { 'content-type': 'application/x-www-form-urlencoded' },
			success: function (res) {
				console.log("save--processStepToday--", res);
			}
		});
		getApp().globalData.indexPage.showHistoryData(util.getDateOffset(0, "yyyy-MM-dd"));
	
		syncTodaySleep();
		return ;
	
		//util.dumpArrayBuffer(dataViewStepToday);
	}
	else{
		for(var n=0;n<17;n++){
			var seq = 17 * (dataView.getUint8(2)-2);
			dataViewStepToday.setUint8(seq + n, dataView.getUint8(3+n));
		}
		currTotal=currTotal+17;
	}

	return 0;
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


//	isNeedSyncHistory=true;

}
function bleCommNotifyRegister() {

	wx.onBLECharacteristicValueChange(function (res) {
	//	console.log(`---(^_^)` + syncDataType+`---characteristic ${res.characteristicId} has changed, now is ${res.value}`)
		
		let dataView = new DataView(res.value);
		util.dumpArrayBuffer(dataView, syncDataType);

		if (dataView.getUint8(0) == 0x5B && dataView.getUint8(1) == 0x0D && dataView.getUint8(2) == 0x00 &&  dataView.getUint8(3) == 0x80 ){
			 //电量
			getApp().globalData.indexPage.setData({
				power_ps: parseInt(dataView.getUint8(4, true)),
				power_text: parseInt(dataView.getUint8(4, true)),
			});
			setSyncConfig();
		}
		else if (dataView.getUint8(0) == 0x5B && dataView.getUint8(1) == 0x01 && dataView.getUint8(2) == 0x00 ) {
			console.log("sw版本:" + dataView.getUint16(11));
			console.log("hw版本:" + dataView.getUint16(13));
			var t=util.sprintf("%c%c%c%c%c", dataView.getUint8(15), dataView.getUint8(16), dataView.getUint8(17), dataView.getUint8(18),
				dataView.getUint8(19));
			wx.setStorageSync("sw_version", dataView.getUint16(11));
			wx.setStorageSync("hw_version", dataView.getUint16(13));
			wx.setStorageSync("model", t);
			syncTodayDate();
		}
		else if (dataView.getUint8(0) == 0x5A && dataView.getUint8(1) == 0x05){//当前步数同步
			if (syncDataType=="step") //步数
				processStepToday(dataView);
			else if (syncDataType == "sleep")//睡眠
				processSleepToday(dataView);
			else if (syncDataType == "hb")//心率
				processHbAll(dataView);
			else if (syncDataType == "bp")//血压
				processBpAll(dataView);
			return ;
		}
		else if (dataView.getUint8(0) == 0x5A && dataView.getUint8(1) == 0x07) {//当天睡眠同步
			console.log("--sleep----");
			processSleepToday(dataView);
			return;
		}
		else if (dataView.getUint8(0) == 0x5B && dataView.getUint8(1) == 0x07) {//当天无睡眠同步
		//	console.log("--sleep----");
			allDays = dataView.getInt16(3);
			if (allDays==0){
				syncTodayHb();
			}
			//processSleepToday(dataView);
			return;
		}

		else if (dataView.getUint8(0) == 0x5B && dataView.getUint8(1) == 0x20) {//当前心率
			allDays=dataView.getInt16(3);
			if (allDays==0){
				syncTodayBp();
			}
			console.log("心率天数:" + allDays);
		//	processSleepToday(dataView);
			return;
		}
		else if (dataView.getUint8(0) == 0x5B && dataView.getUint8(1) == 0x1D) {//当前心率
			allDays = dataView.getInt16(3);
			if (allDays == 0) {
			
			}
			console.log("血压天数:" + allDays);
			//	processSleepToday(dataView);
			return;
		}
		else if (dataView.getUint8(0) == 0x5A && dataView.getUint8(1) == 0x0D 
			 && dataView.getUint8(2) == 0x00 && dataView.getUint8(3) == 0x02) {
			var low = -1;
			var high = -1;
			var hb = dataView.getUint8(4);
		
			getApp().globalData.indexPage.showDynHbBp(hb, low, high);
			return;
		}
		else if (dataView.getUint8(0) == 0x5A && dataView.getUint8(1) == 0x0D
			&& dataView.getUint8(2) == 0x00 && dataView.getUint8(3) == 0x06) {
			var low = dataView.getUint8(4);
			var high = dataView.getUint8(5);
			var hb = -1;

			getApp().globalData.indexPage.showDynHbBp(hb, low, high);
			return;
		}
		return ;
		 if (res.characteristicId.indexOf("2A35") > 0) { //手工测试心率和血压
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
			}
			else {
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

function syncTodayDate() {
	syncDataType = "step";
	console.log("开始同步当前的数据.....");
	let buffer = new ArrayBuffer(20);
	let dataView = new DataView(buffer);
	for (var n = 0; n < 20; n++) {
		dataView.setUint8(n, 0x00);
	}
	dataView.setUint8(0, 0x5A);
	dataView.setUint8(1, 0x03);
	dataView.setUint8(2, 0x00);
	var now = new Date();
	dataView.setUint8(3, now.getFullYear() - 2000);
	dataView.setUint8(4, now.getMonth() + 1);
	dataView.setUint8(5, now.getDate());

	dataView.setUint8(6, now.getFullYear() - 2000);
	dataView.setUint8(7, now.getMonth() + 1);
	dataView.setUint8(8, now.getDate());


	wx.writeBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: g_services,
		characteristicId: g_characteristics_write,
		value: buffer,
		success: function (res) {
			console.log("sync write 同步当天步数....", res);

		},
		fail: function (res) {
			console.log("写入数据失败:", res);
		}
	});
	//读取当前的数据

}
function syncTodaySleep() {
	syncDataType = "sleep";
	console.log("开始当天的睡眠数据.....");
	let buffer = new ArrayBuffer(20);
	let dataView = new DataView(buffer);
	for (var n = 0; n < 20; n++) {
		dataView.setUint8(n, 0x00);
	}
	dataView.setUint8(0, 0x5A);
	dataView.setUint8(1, 0x07);
	dataView.setUint8(2, 0x00);
	
//	var now = new Date((new Date().getTime() - parseInt(1) * 3600 * 24 * 1000));
	var now = new Date();
	dataView.setUint8(3, now.getFullYear() - 2000);
	dataView.setUint8(4, now.getMonth() + 1);
	dataView.setUint8(5, now.getDate());

	var now = new Date();
//	var now = new Date((new Date().getTime() + parseInt(1) * 3600 * 24 * 1000));
	dataView.setUint8(6, now.getFullYear() - 2000);
	dataView.setUint8(7, now.getMonth() + 1);
	dataView.setUint8(8, now.getDate());

	util.dumpArrayBuffer(dataView,"发送数据");
	wx.writeBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: g_services,
		characteristicId: g_characteristics_write,
		value: buffer,
		success: function (res) {
			console.log("sync write 同步睡眠数据....", res);
		},
		fail: function (res) {
			console.log("写入睡眠数据失败:", res);
		}
	});


}
function syncTodayHb() {
	if (supportHb==false)
		return false;
	syncDataType = "hb";
	console.log("开始当天的心率数据.....");
	currDay = 0;
	allDays = 0;

	let buffer = new ArrayBuffer(20);
	let dataView = new DataView(buffer);
	for (var n = 0; n < 20; n++) {
		dataView.setUint8(n, 0x00);
	}
	dataView.setUint8(0, 0x5A);
	dataView.setUint8(1, 0x20);
	dataView.setUint8(2, 0x00);

	var now = new Date((new Date().getTime() - parseInt(7) * 3600 * 24 * 1000));
	dataView.setUint8(3, now.getFullYear() - 2000);
	dataView.setUint8(4, now.getMonth() + 1);
	dataView.setUint8(5, now.getDate());
	dataView.setUint8(6, 0);
	dataView.setUint8(7, 0);

	var now = new Date();
	dataView.setUint8(8, now.getFullYear() - 2000);
	dataView.setUint8(9, now.getMonth() + 1);
	dataView.setUint8(10, now.getDate());
	dataView.setUint8(11,23);
	dataView.setUint8(12, 59);



	wx.writeBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: g_services,
		characteristicId: g_characteristics_write,
		value: buffer,
		success: function (res) {
			console.log("sync write 同步心率数据....", res);

		},
		fail: function (res) {
			console.log("写入心率数据失败:", res);
		}
	});
}
function syncTodayBp() {
	if (supportHb==false)
		return ;
	syncDataType = "bp";
	currDay=0;
	allDays=0;
	console.log("开始当天的血压数据.....");
	let buffer = new ArrayBuffer(20);
	let dataView = new DataView(buffer);
	for (var n = 0; n < 20; n++) {
		dataView.setUint8(n, 0x00);
	}
	dataView.setUint8(0, 0x5A);
	dataView.setUint8(1, 0x1D);
	dataView.setUint8(2, 0x00);
	
	var now = new Date((new Date().getTime() - parseInt(7) * 3600 * 24 * 1000));
	dataView.setUint8(3, now.getFullYear() - 2000);
	dataView.setUint8(4, now.getMonth() + 1);
	dataView.setUint8(5, now.getDate());
	dataView.setUint8(6, 0);
	dataView.setUint8(7, 0);


	var now = new Date();
	dataView.setUint8(8, now.getFullYear() - 2000);
	dataView.setUint8(9, now.getMonth() + 1);
	dataView.setUint8(10, now.getDate());
	dataView.setUint8(11, 23);
	dataView.setUint8(12, 59);



	wx.writeBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: g_services,
		characteristicId: g_characteristics_write,
		value: buffer,
		success: function (res) {
			console.log("sync write 同步血压数据....", res);

		},
		fail: function (res) {
			console.log("写入血压数据失败:", res);
		}
	});
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
			
			console.log("save--showAndSaveStepData--", res);

		}
	});
}
function endHeartBeatTest() {
	console.log("开始测量心率.....");
	let buffer = new ArrayBuffer(20);
	let dataView = new DataView(buffer);
	for (var n = 0; n < 20; n++) {
		dataView.setUint8(n, 0x00);
	}
	dataView.setUint8(0, 0x5A);
	dataView.setUint8(1, 0x0D);
	dataView.setUint8(2, 0x00);
	dataView.setUint8(3, 0x84);
	dataView.setUint8(4, 0);//开关
	dataView.setUint16(5, 1);
	dataView.setUint16(7, 120);
	dataView.setUint8(9, 0x02);

	wx.writeBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: g_services,
		characteristicId: g_characteristics_write,
		value: buffer,
		success: function (res) {
			console.log("sync write心率数据....", res);

		},
		fail: function (res) {
			console.log("写入心率数据失败:", res);
		}
	});
}

function beginHeartBeatTest() {
	console.log("开始测量心率.....");
	let buffer = new ArrayBuffer(20);
	let dataView = new DataView(buffer);
	for (var n = 0; n < 20; n++) {
		dataView.setUint8(n, 0x00);
	}
	dataView.setUint8(0, 0x5A);
	dataView.setUint8(1, 0x0D);
	dataView.setUint8(2, 0x00);
	dataView.setUint8(3, 0x84);
	dataView.setUint8(4, 1);//开关
	dataView.setUint16(5, 1);
	dataView.setUint16(7, 200);
	dataView.setUint8(9, 0x02);

	wx.writeBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: g_services,
		characteristicId: g_characteristics_write,
		value: buffer,
		success: function (res) {
			console.log("sync write心率数据....", res);

		},
		fail: function (res) {
			console.log("写入心率数据失败:", res);
		}
	});
}

function endBpTest() {
	console.log("开始测量血压.....");
	let buffer = new ArrayBuffer(20);
	let dataView = new DataView(buffer);
	for (var n = 0; n < 20; n++) {
		dataView.setUint8(n, 0x00);
	}
	dataView.setUint8(0, 0x5A);
	dataView.setUint8(1, 0x0D);
	dataView.setUint8(2, 0x00);
	dataView.setUint8(3, 0x8B);
	dataView.setUint8(4, 0);//开关
	dataView.setUint16(5, 1);
	dataView.setUint16(7, 120);
	dataView.setUint8(9, 0x02);

	wx.writeBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: g_services,
		characteristicId: g_characteristics_write,
		value: buffer,
		success: function (res) {
			console.log("sync write心率数据....", res);

		},
		fail: function (res) {
			console.log("写入心率数据失败:", res);
		}
	});
}

function beginBpTest() {
	console.log("开始血压心率.....");
	let buffer = new ArrayBuffer(20);
	let dataView = new DataView(buffer);
	for (var n = 0; n < 20; n++) {
		dataView.setUint8(n, 0x00);
	}
	dataView.setUint8(0, 0x5A);
	dataView.setUint8(1, 0x0D);
	dataView.setUint8(2, 0x00);
	dataView.setUint8(3, 0x8B);
	dataView.setUint8(4, 1);//开关
	dataView.setUint16(5, 1);
	dataView.setUint16(7, 0);
	dataView.setUint8(9, 0x02);

	wx.writeBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: g_services,
		characteristicId: g_characteristics_write,
		value: buffer,
		success: function (res) {
			console.log("sync write心率数据....", res);

		},
		fail: function (res) {
			console.log("写入心率数据失败:", res);
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
var loadHistorying=false;
function syncStepHistory() {
	if (loadHistorying==true){
		return ;
	}
	wx.showLoading({
		title: '同步历史数据...',
	});
	setTimeout(endSync,10*1000);
	loadHistorying=true;
	readHistoryType = 0;
	console.log("开始同步当前的数据.....");
	let buffer = new ArrayBuffer(20);
	let dataView = new DataView(buffer);
	for (var n = 0; n < 20; n++) {
		dataView.setUint8(n, 0x00);
	}
	dataView.setUint8(0, 0x5A);
	dataView.setUint8(1, 0x03);
	dataView.setUint8(2, 0x00);
//	var now = new Date();
	var now = new Date((new Date().getTime() - 1 * 3600 * 24 * 1000));
	dataView.setUint8(3, now.getFullYear() - 2000);
	dataView.setUint8(4, now.getMonth() + 1);
	dataView.setUint8(5, now.getDate());
	console.log("begin date.....====" + (now.getFullYear() - 2000) + '-' + (now.getMonth() + 1) + '-' + now.getDate());

	var now = new Date((new Date().getTime() - 7 * 3600 * 24 * 1000));
	dataView.setUint8(6, now.getFullYear() - 2000);
	dataView.setUint8(7, now.getMonth() + 1);
	dataView.setUint8(8, now.getDate());
	console.log("end date.....====" + (now.getFullYear() - 2000) +'-'+ (now.getMonth() + 1)+'-' + now.getDate());


	wx.writeBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: g_services,
		characteristicId: g_characteristics_write,
		value: buffer,
		success: function (res) {
			console.log("sync write 同步历史步数....", res);

		},
		fail: function (res) {
			console.log("写入数据失败:", res);
		}
	});	

	return;
}
function findAllServerice()
{
	wx.getBLEDeviceServices({
		deviceId: g_deviceId,
		success: function (res) {
			for (var n = 0; n < res.services.length; n++) {
				console.log("发现服务...." + res.services[n].uuid + " obj", res);
				wx.getBLEDeviceCharacteristics({
					deviceId: g_deviceId,
					serviceId: res.services[n].uuid,
					success: function (res) {
						console.log("发现特征值",res);
						//readPowerUsed();
						//read_time();
					}
				});
				
			}
		}
	});	
}
function beginService() {
	console.log("beginService---------^_^");
	//	findAllServerice();
	//	return ;
	wx.getBLEDeviceServices({
		deviceId: g_deviceId,
		success: function (res) {
			wx.getBLEDeviceCharacteristics({
				deviceId: g_deviceId,
				serviceId: g_services,
				success: function (res) {
					//console.log("发现特征值",res);
					readPowerUsed();
				}
			})
		}
	});
	return;
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
	let buffer = new ArrayBuffer(20);
	let dataView = new DataView(buffer);
	for (var n = 0; n < 20; n++) {
		dataView.setUint8(n, 0x00);
	}
	dataView.setUint8(0, 0x5A);
	dataView.setUint8(1, 0x0C);
	dataView.setUint8(2, 0x00);
	dataView.setUint8(3, 0x06);

	wx.writeBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: g_services,
		characteristicId: g_characteristics_write,
		value: buffer,
		success: function (res) {
			console.log("写入查找设备指令....", res);

		},
		fail: function (res) {
			console.log("写入数据失败:", res);
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
			wx.showLoading({
				title: '正在同步数据...',
			})
			console.log(res)
			isConnect = 1;
			beginService();
			//findService();

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
		console.log(`device ${res.deviceId} state has changed, >>>connected: ${res.connected}`,res)
		if (res.connected == false) {
			isConnect = 0;
			console.log("设置连接失败....");
			getApp().globalData.indexPage.setConnectStatus(0);
		}
		else {
			isConnect = 1;
			console.log("设置连接成功....");
			getApp().globalData.indexPage.setConnectStatus(1);
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
	beginBpTest: beginBpTest,
	endBpTest: endBpTest,
	findDevice: findDevice,
	saveAllConfig: saveAllConfig,
	disConnect: disConnect

}