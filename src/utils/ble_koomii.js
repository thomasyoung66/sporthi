var g_deviceId = "";
var g_services = null;
var g_characteristics;
var cd0 = null;
var cd1 = null;
var cd2 = null;
var cd3 = null;
var cd4 = null;
var isConnect = 0;
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
				var str="";
				for (var n = 0; n < dataView.byteLength; n++) {
					str = str + " " + dataView.getInt8(n);
				}
				console.log("time=" +str);
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

var set_times=0;
function set_time() {
	let buffer = new ArrayBuffer(4)
	let dataView = new DataView(buffer)
	console.log("---------------begin write_time------------------------" + getTimeDiff());
	dataView.setUint32(0, getTimeDiff(), true);


	set_times=0;
	wx.writeBLECharacteristicValue({
		// 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
		deviceId: g_deviceId,
		// 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
		serviceId: getServerId("FFC0"),
		characteristicId: getCharacter("FF15"),
		//serviceId: g_services,
		// 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
		//  characteristicId: g_characteristics,
		// 这里的value是ArrayBuffer类型
		value: buffer,
		success: function (res) {
			
			if (set_times==0){
				set_times=1;
				console.log('写入数据：writeBLECharacteristicValue success', res);
				syncRunStep();
			}
		
		},
		fail: function (res) {
			console.log("写入数据失败:", res);
		}
	})

}
function readMacAddr()
{
	//读取mac地址
	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("180A"),
		characteristicId: getCharacter("2A25"),
		success: function (res) {
		}
	});	
	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("180A"),
		characteristicId: getCharacter("2A27"),
		success: function (res) {
		}
	});	
	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("180A"),
		characteristicId: getCharacter("2A28"),
		success: function (res) {
		}
	});	
	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("180A"),
		characteristicId: getCharacter("2A29"),
		success: function (res) {
		}
	});
	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("180A"),
		characteristicId: getCharacter("2A24"),
		success: function (res) {
		}
	});

}
function readPowerUsed()
{
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
				}
			});
			console.log("readPowerUsed -------succed----", res);
		},
		fail: function (res) {
			console.log("readPowerUsed-------failure----", res);
		}
	});
	return ;
}
var total=0;

var ddd = 0;
let bufferStep;
let dataViewStep;
var stepDataJson = {};//
var sleepDataJson = {};
var readHistoryType=0;//0 运动计步  1：心率


let bufferStepToday;
let dataViewStepToday;
function processStepToday(dataView)
{
//	let dataView = new DataView(val);

	var total = dataView.getUint16(0, true);
	var seq = dataView.getUint16(2, true) - 1;
  console.log("total="+total+" seq="+seq);
  
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
				var runTime = dataViewStepToday.getUint32(n * 64 + 4, true);
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
          console.log("----设置当天->>>>>",item);
          getApp().globalData.indexPage.showHistoryData(util.getDateOffset(0,"yyyy-MM-dd"));
				}
				else if (valate == 0x45678901) {
				//	console.log("today ^_^---sleep data=" + item.step);
			//		var pDate = util.getDataFrom1970(runDate, "yyyy-MM-dd");
			//		sleepDataJsonToday[pDate] = item;
          console.log("睡眠时间:",item);
          wx.setStorageSync("today",item);

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
  //console.log("processStepHistory-----0");
	let dataView = new DataView(val);
  //console.log("processStepHistory-----1");
	var total = dataView.getUint16(0, true);
  //console.log("processStepHistory-----2");
	var seq = dataView.getUint16(2, true) - 1;

  //console.log(readHistoryType +" readHistoryType, total=" + total+" seq="+seq);
	if (seq == 0) {
		console.log("begin--------" + 16 * total);
		bufferStep = new ArrayBuffer(16 * total);
		dataViewStep = new DataView(bufferStep);
	}
	//console.log(total + "-------seq------------" + seq);
	for (var n = 4; n < 20; n++) {
		dataViewStep.setUint8(seq * 16 + n - 4, dataView.getUint8(n));
	}

	if (seq == (total - 1)) {

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
            item.runTime = dataViewStep.getUint32(n * 64 + 4, true);
            item.step = dataViewStep.getUint32(n * 64 + 8, true);

            var pDate = util.getDataFrom1970(runDate, "yyyy-MM-dd");
            stepDataJson[pDate] = item;

            console.log("^_^---step data=",item.step);
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
            console.log(pDate+"^_^---sleep data=",item);
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
  return ;
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
    var offset=0;
    for (var offset=0; offset < (16 * total);) {
      if (util.isValDate(dataViewStep.getUint32(offset, true))==false) {
        offset = offset + 8 * count + 8;
        continue;
      }
      var currDate = util.getDataFrom1970(dataViewStep.getUint32(offset,true),"yyyy-MM-dd");
      var count = dataViewStep.getUint16(offset+4, true);
      var val = dataViewStep.getUint16(offset + 6, true);
      if (val != 0x9012){
        offset = offset + 8 * count + 8;
        continue;
      }


      for(var n=0;n<count;n++){
        var seq=offset+8+n*8;
        var hour=dataViewStep.getUint8(seq+0,true);
        var min = dataViewStep.getUint8(seq + 1, true);
        var hb = dataViewStep.getUint8(seq + 2, true);
        var max_bp = dataViewStep.getUint8(seq + 3, true);
        var min_bp = dataViewStep.getUint8(seq + 4, true);

        console.log(currDate + " " + hour + ":" + min + " hb=" + hb + " max_bp=" + max_bp + " min_bp=" + min_bp + "  val=" + val + "---" + 0x9012);

      }

      offset =offset+8*count+8;
     
    }//end for
    wx.hideLoading();
  }
}
function bleCommNotifyRegister()
{
	     
	wx.onBLECharacteristicValueChange(function (res) {
		console.log(`---(^_^)---characteristic ${res.characteristicId} has changed, now is ${res.value}`)
		let dataView = new DataView(res.value);


    if (res.characteristicId.indexOf("2A35") > 0) { //产品型号
       var low=dataView.getUint16(1,true);
       var high = dataView.getUint16(3, true);
       var hb = dataView.getUint16(7, true);
       console.log("低压:"+low+" 高压:"+high+" 心率:"+hb);
       getApp().globalData.indexPage.showDynHbBp(hb,low,high);

    }
		else  if (res.characteristicId.indexOf("2A37") > 0) { //产品型号


			console.log(`--666-(^_^)---characteristic ${res.characteristicId} has changed, now is ${res.value}`)
			var str = "";
			for (var n = 0; n < dataView.byteLength; n++) {
				str = str + " " + dataView.getUint8(n);
			}
			console.log("notify data...." + str);

		}
		else if (res.characteristicId.indexOf("2A24") > 0) { //产品型号
			var data = util.arrayBufferToString(dataView);
			console.log("model=" + data);
			wx.setStorageSync("model", data);
		}
		else if (res.characteristicId.indexOf("2A25") > 0){ //读取mac地址
			
			var data = util.arrayBufferToString(dataView);
			console.log("mac=" + data);
			wx.setStorageSync("mac", data);
		}
		else if (res.characteristicId.indexOf("2A27") > 0) { //硬件版本
			var data = util.arrayBufferToString(dataView);
			console.log("hw_version=" +data);
			wx.setStorageSync("hw_version", data);
		}
		else if (res.characteristicId.indexOf("2A28") > 0) {//软件版本
			var data = util.arrayBufferToString(dataView);
			console.log("sw_version=" + data);
			wx.setStorageSync("sw_version", data);
		}
		else if (res.characteristicId.indexOf("2A29") > 0) {//软件版本
			var data = util.arrayBufferToString(dataView);
			console.log("manufacturer=" + data);
			wx.setStorageSync("manufacturer", data);
		}
		else  if (res.characteristicId.indexOf("2A19") > 0) {//电量返回
			console.log("power=" + dataView.getUint8(0, true));
			getApp().globalData.indexPage.setData({
				power_ps: parseInt(dataView.getUint8(0, true)),
				power_text: parseInt(dataView.getUint8(0, true)),

			});
			return;
		}
		else if (res.characteristicId.indexOf("FF11") > 0) {
			console.log("total=" + dataView.getUint32(0, true));

			var str = "";
			for (var n = 0; n < dataView.byteLength; n++) {
				str = str + " " + dataView.getInt8(n);
			}
			initCharacteristic180A();
			var todayData=new Object();

			getApp().globalData.indexPage.showCurrStepInfo(dataView.getUint32(10, true), 
				dataView.getUint32(14, true));
			todayData.step = dataView.getUint32(10, true);
			todayData.h0=0;
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
			todayData.h12= 0;
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
			console.log(dataView.getUint32(14, true)+" ---save today...." , todayData);
			
			var h1 = wx.getStorageSync("step-" + util.getDateOffset(-1, "yyyy-MM-dd"));
			var h2 = wx.getStorageSync("step-" + util.getDateOffset(-2, "yyyy-MM-dd"));

     // syncStepHistory();
     // 
      if (h1 == null || h1.hasOwnProperty("step") == false ) {
				syncStepHistory();
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

		}
		else if (res.characteristicId.indexOf("FF21") > 0) {//读取历史数据
     // console.log(readHistoryType + `>>>yls-begin history>>>>>characteristic ${res.characteristicId} has changed, now is ${res.value}`);
      if (readHistoryType==0)
		  	processStepHistory(res.value);
      else
        processHeartHistory(res.value);
		}
	});
}
function initCharacteristic180A()
{
	wx.getBLEDeviceCharacteristics({
		deviceId: g_deviceId,
		serviceId: getServerId("180F"),
		success: function (res) {
			readMacAddr();
			readPowerUsed();
		},
		fail: function (res) {
			console.log('180A蓝牙返回错误:readBLECharacteristicValue:', res);
		}
	});
}
function syncTodayDate()
{
  //读取当前的数据
  wx.notifyBLECharacteristicValueChanged({
    deviceId: g_deviceId,
    serviceId: getServerId("FFC0"),
    characteristicId: getCharacter("FF13"),
    state: true,
    success: function (res) {
      // success
      wx.readBLECharacteristicValue({
        deviceId: g_deviceId,
        serviceId: getServerId("FFC0"),
        characteristicId: getCharacter("FF13"),
        success: function (res) {
          console.log(total + '蓝牙返回成功:readBLECharacteristicValue:', res);
          total++;
        },
        fail: function (res) {
          console.log('蓝牙返回错误:readBLECharacteristicValue:', res);
        }
      });
      console.log("-------succed----", res);
    },
    fail: function (res) {
      console.log("-------failure----", res);
      // fail
    }
  });
}
function syncRunStep()
{
	bleCommNotifyRegister();
	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("FFC0"),
		characteristicId: getCharacter("FF11"),
		success: function (res) {
			console.log(total+'蓝牙返回成功:readBLECharacteristicValue:', res);
			total++;

		},
		fail: function (res) {
			console.log('蓝牙返回错误:readBLECharacteristicValue:', res);
		}
	});
  syncTodayDate();
}

function showAndSaveStepData()
{
	console.log("stepData...",stepDataJson);
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
			console.log("save----", res);

		}
	});
}
function endHeartBeatTest()
{
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
function beginH()
{

	wx.notifyBLECharacteristicValueChanged({
		deviceId: g_deviceId,
		serviceId: getServerId("1810"),
		characteristicId: getCharacter("2A35"),
  //  serviceId: getServerId("180D"),
  // characteristicId: getCharacter("2A37"),
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
			//		setTimeout(endHeartBeatTest, 120 * 1000);
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
function beginHeartBeatTest()
{
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
	
	wx.getBLEDeviceCharacteristics({
		deviceId: g_deviceId,
		serviceId: getServerId("180D"),
		success: function (res) {
			console.log("init 180D succeed",res);
			beginH();
		},
		fail: function (res) {
			console.log('180A蓝牙返回错误:readBLECharacteristicValue:', res);
		}
	});
	


}

function syncHeartBeatHistory()
{
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
function syncStepHistory()
{
	wx.showLoading({
		title: '同步历史数据...',
	});
  readHistoryType=0;
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
			// success
			console.log("-------succed----", res);

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
	return ;
}

function beginService() {
	wx.getBLEDeviceServices({
		deviceId: g_deviceId,
		success: function (res) {
			g_services = res.services[1].uuid;
			for (var n = 0; n < res.services.length; n++) {
				g_services = "" + res.services[n].uuid;
				console.log("service uuid=" + g_services);
				if (g_services.indexOf("FFC0") > 0)
					break;
			}
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
			console.log("连接设备失败")
			isConnect = 0;
			console.log(res)
		}
	});
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
module.exports = {
	initBle: initBle,
	syncBle: syncBle,
	openBleDevice: openBleDevice,
	getConnectState: getConnectState,
	beginHeartBeatTest: beginHeartBeatTest,
  endHeartBeatTest: endHeartBeatTest
}