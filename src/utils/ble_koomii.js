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
function mytest() {


	console.log("---------------begin-------------------------");

	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("180A"),
		characteristicId: getCharacter("2A27"),
		success: function (res) {
			console.log('蓝牙返回成功:readBLECharacteristicValue:', res);
			wx.onBLECharacteristicValueChange(function (res) {

				console.log(`^_^characteristic ${res.characteristicId} has changed, now is ${res.value}`)
				//    console.log('characteristic value comed:', res)
				let dataView = new DataView(res.value);
				for (var n = 0; n < dataView.byteLength; n++) {
					console.log("=" + dataView.getInt8(n));
				}

			});
		},
		fail: function (res) {
			console.log('蓝牙返回错误:readBLECharacteristicValue:', res);
		}
	});

}
function mytest1() {


	console.log("---------------begin-------------------------");

	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("180A"),
		characteristicId: getCharacter("2A28"),
		success: function (res) {
			console.log('蓝牙返回成功:readBLECharacteristicValue:', res);
			wx.onBLECharacteristicValueChange(function (res) {

				console.log(`^_^characteristic ${res.characteristicId} has changed, now is ${res.value}`)
				//    console.log('characteristic value comed:', res)
				let dataView = new DataView(res.value);
				for (var n = 0; n < dataView.byteLength; n++) {
					console.log("=" + dataView.getInt8(n));
				}

			});
		},
		fail: function (res) {
			console.log('蓝牙返回错误:readBLECharacteristicValue:', res);
		}
	});

}
function read_time() {


	console.log("---------------begin-read_time------------------------");

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

	// dataView.setUint8(4, 0x2A);
	// dataView.setUint8(5, 0x00);
	set_times=0;
	console.log("devcice=" + g_deviceId + "----g_services=" + g_services + "-----g_characteristics=" + 	g_characteristics);
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
			
			//bleReadCallback();
			//bleReadCallback();
			if (set_times==0){
				set_times=1;
				console.log('写入数据：writeBLECharacteristicValue success', res);
				syncRunStep();
			}
		
			// setTimeout(bleReadCallback,1000);
			//   ();
		},
		fail: function (res) {
			console.log("写入数据失败:", res);
		}
	})

}
function readMacAddr()
{
	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("180F"),
		characteristicId: getCharacter("2A25"),
		success: function (res) {
			console.log("----------mac---------", res)
			if (res.value) {
				let dataView = new DataView(res.value);
				var ps = dataView.getInt8(0, true);
			}


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
			// success
			readMacAddr();
			
			wx.readBLECharacteristicValue({
				deviceId: g_deviceId,
				serviceId: getServerId("180F"),
				characteristicId: getCharacter("2A19"),
				success: function (res) {
					console.log("----------power", res)
					if (res.value){
						let dataView = new DataView(res.value);
						var ps = dataView.getInt8(0, true);
					}

				
				}
			});
			console.log("readPowerUsed -------succed----", res);
		},
		fail: function (res) {
			console.log("readPowerUsed-------failure----", res);
			// fail
		}
	});
	return ;
}
var total=0;
function bleCommNotifyRegister()
{

}
function initCharacteristic180A()
{
	wx.getBLEDeviceCharacteristics({
		deviceId: g_deviceId,
		serviceId: getServerId("180F"),
		success: function (res) {
			readPowerUsed();
		},
		fail: function (res) {
			console.log('180A蓝牙返回错误:readBLECharacteristicValue:', res);
		}
	});
}
function syncRunStep()
{
	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("FFC0"),
		characteristicId: getCharacter("FF11"),
		success: function (res) {
			console.log(total+'蓝牙返回成功:readBLECharacteristicValue:', res);
			total++;
			wx.onBLECharacteristicValueChange(function (res) {

				console.log(`---(^_^)---characteristic ${res.characteristicId} has changed, now is ${res.value}`)
				//    console.log('characteristic value comed:', res)
				let dataView = new DataView(res.value);
				if (res.characteristicId.indexOf("2A19")>0){
					console.log("--------------"+dataView.getUint8(0,true));
					getApp().globalData.indexPage.setData({
						power_ps: parseInt(dataView.getUint8(0, true))
					});
					return ;
				}
				console.log("total=" + dataView.getUint32(0, true));
				var ps =  dataView.getInt8(4, true) < 0 ? dataView.getUint32(10, true)*100 / 7000 : dataView.getInt8(4, true);
				getApp().globalData.indexPage.setData({
					step_total: dataView.getUint32(10, true),
					step_ps:parseInt(ps)
				});
				var str="";
				for (var n = 0; n < dataView.byteLength; n++) {
					str = str + " " + dataView.getInt8(n);
				}
				initCharacteristic180A();
				
				var h1 = wx.getStorageSync("step-" + util.getDateOffset(-1,"yyyy-MM-dd"));
				var h2 = wx.getStorageSync("step-" + util.getDateOffset(-2, "yyyy-MM-dd"));

				if (h1==null&&h2==null){
					syncStepHistory();
				}
				else{
					console.log("不需要同步历史数据");
				}
				
				console.log("syncStep=" +str );
			});
		},
		fail: function (res) {
			console.log('蓝牙返回错误:readBLECharacteristicValue:', res);
		}
	});



}
function readHistoryStepSleepCmd()
{
	let buffer = new ArrayBuffer(20);
	let dataView = new DataView(buffer);
	for (var n = 0; n < 20; n++) {
		dataView.setUint8(n,0x00);
	}
	dataView.setUint8(0,0x01);
	dataView.setUint8(1,0x02);
	dataView.setUint8(2,0x20);


	wx.writeBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: getServerId("FFC0"),
		characteristicId: getCharacter("FF12"),
		value: buffer,
		success: function (res) {
			console.log("sync write....", res);

			// setTimeout(bleReadCallback,1000);
			//   ();
		},
		fail: function (res) {
			console.log("写入数据失败:", res);
		}
	})
}
var ddd=0;
let bufferStep;
let dataViewStep;
var stepDataJson={};//
var sleepDataJson = {};

let bufferStepToday;
let dataViewStepToday;


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
function syncStepHistory()
{
	wx.showLoading({
		title: '同步历史数据...',
	});
	wx.onBLECharacteristicValueChange(function (res) {
		if (!res.value){
			return ;
		}
		if (res.characteristicId.indexOf("FF13") > 0) {
			console.log(ddd + `>>>yls-begin>>>>>characteristic ${res.characteristicId} has changed, now is ${res.value}`);
			let dataView = new DataView(res.value);

			var total = dataView.getUint16(0, true);
			var seq = dataView.getUint16(2, true) - 1;
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
						item.h0 =  dataViewStepToday.getUint16(n * 64 + 12, true);
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
							var pDate = util.getDataFrom1970(runDate, "yyyy-MM-dd");
							stepDataJsonToday[pDate] = item;
							console.log("^_^---step data=" + item.step);
							wx.setStorageSync("step-" + pDate, JSON.stringify(item));
						}
						else if (valate == 0x45678901) {
							console.log("^_^---sleep data=" + item.step);
							var pDate = util.getDataFrom1970(runDate, "yyyy-MM-dd");
							sleepDataJsonToday[pDate] = item;
							wx.setStorageSync("sleep-" + pDate, JSON.stringify(item));

						}
						else {
							console.log("unused data......^_^");
						}
					}
				}
				console.log("run---run---" + JSON.stringify(stepDataJsonToday));

			}
		}
		else if (res.characteristicId.indexOf("FF21")>0){
			let dataView = new DataView(res.value);

			var total = dataView.getUint16(0, true);
			var seq = dataView.getUint16(2, true)-1;
			
			if (seq==0){
				console.log("begin--------"+16*total);
				bufferStep= new ArrayBuffer(16*total);
				dataViewStep = new DataView(bufferStep);
			}
			//console.log(total + "-------seq------------" + seq);
			for(var n=4;n<20;n++){
				dataViewStep.setUint8(seq * 16 + n-4, dataView.getUint8(n));
			}

			if (seq==(total-1)){

				for (var n = 0; n<(16 * total)/64;n++){

					var runDate = dataViewStep.getUint32(n * 64,true);
					if (util.isValDate(runDate)){
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

						if (valate == 0x34567890){
							item.runTime = dataViewStep.getUint32(n * 64 + 4, true);
							item.step = dataViewStep.getUint32(n * 64 + 8, true);

							var pDate = util.getDataFrom1970(runDate, "yyyy-MM-dd");
							stepDataJson[pDate] = item;

							//console.log("^_^---step data=" + item.step);
							wx.setStorageSync("step-" + pDate,item);
						}
						else if (valate == 0x45678901){
							item.startTime = dataViewStep.getUint32(n * 64 + 0, true);
							item.endTime = dataViewStep.getUint32(n * 64 + 4, true);
							item.runMin = dataViewStep.getUint16(n * 64 + 8, true);
							item.restless = dataViewStep.getUint16(n * 64 + 10, true);
				 	item.deep = (item.endTime - item.startTime) / 60 - item.runMin - item.restless;


							//item.runTime = dataViewStep.getUint32(n * 64 + 4, true);
							//item.step = dataViewStep.getUint32(n * 64 + 8, true);

							var pDate = util.getDataFrom1970(runDate, "yyyy-MM-dd");
							//console.log("^_^---sleep data=" + item.step);
							sleepDataJson[pDate] = item;
							wx.setStorageSync("sleep-" + pDate, item);
						}
						else{
							console.log("unused data......^_^");
						}
					}
				}
				showAndSaveStepData();
			}
		}
		ddd++;
	});

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

			readHistoryStepSleepCmd();
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


function findMe() {

	wx.getBLEDeviceServices({
		// 这里的 deviceId 需要在上面的 getBluetoothDevices中获取
		deviceId: g_deviceId,
		success: function (res) {

			g_services = res.services[1].uuid;
			for (var n = 0; n < res.services.length; n++) {
				g_services = "" + res.services[n].uuid;
				console.log("service uuid=" + g_services);
				if (g_services.indexOf("FFC0") > 0)
					break;
				/*
				wx.getBLEDeviceCharacteristics({
				  // 这里的 deviceId 需要在上面的 getBluetoothDevices
				  deviceId: res.services[n].uuid,
				  // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
				  serviceId: g_services,
				  success: function (res1) {
				    console.log(g_services+" 列表:",res1);
				  }
				})*/
			}
			//   setTimeout(getDeviceName,2000);
			//  console.log('device services:', g_services);
			//return ;

			setTimeout(function () {
				g_services = serverId180A;
				wx.getBLEDeviceCharacteristics({
					// 这里的 deviceId 需要在上面的 getBluetoothDevices
					deviceId: g_deviceId,
					// 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
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

						mytest();
						mytest1();
						read_time();
						return;
						console.log('000000000000' + g_services);
						console.log("结果:", res);
						console.log("总：" + res.characteristics.length);
						g_characteristics = res.characteristics[1].uuid;
						wx.onBLECharacteristicValueChange(function (characteristic) {
							console.log('数据好:characteristic value comed:', characteristic.value)
							//{value: ArrayBuffer, deviceId: "D8:00:D2:4F:24:17", serviceId: "ba11f08c-5f14-0b0d-1080-007cbe238851-0x600000460240", characteristicId: "0000cd04-0000-1000-8000-00805f9b34fb-0x60800069fb80"}
							/**
							 * 监听cd04cd04中的结果
							 */


						});
						return;
						for (var n = 0; n < res.characteristics.length; n++) {
							console.log("====" + res.characteristics[n].uuid);
							g_characteristics = res.characteristics[4].uuid;
							wx.notifyBLECharacteristicValueChanged({
								deviceId: g_deviceId,
								serviceId: g_services,
								characteristicId: res.characteristics[n].uuid,
								state: true,
								success: function (res) {
									// success
									/*
									console.log('notifyBLECharacteristicValueChanged success', res);
									let dataView = new DataView(res.value);
									for (var n = 0; n < 20; n++) {
									  console.log("=" + dataView.getInt8(n));
									}*/
								},
								fail: function (res) {
									// fail
								},
								complete: function (res) {
									// complete
								}
							});
						}
						console.log("end 总：" + res.characteristics.length);
						setTimeout(readVersion, 2000);
						return;
						wx.notifyBLECharacteristicValueChanged({
							deviceId: g_deviceId,
							serviceId: g_services,
							characteristicId: cd2,
							state: true,
							success: function (res) {
								// success
								console.log('notifyBLECharacteristicValueChanged success', res);
							},
							fail: function (res) {
								// fail
							},
							complete: function (res) {
								// complete
							}
						})
						/*
						console.log('device getBLEDeviceCharacteristics:', res.characteristics)
						for (var i = 0; i < 5; i++) {
						  if (res.characteristics[i].uuid.indexOf("cd20") != -1) {
						    that.setData({
							cd20: res.characteristics[i].uuid,
							characteristics20: res.characteristics[i]
						    });
						  }
						  if (res.characteristics[i].uuid.indexOf("cd01") != -1) {
						    that.setData({
							cd01: res.characteristics[i].uuid,
							characteristics01: res.characteristics[i]
						    });
						  }
						  if (res.characteristics[i].uuid.indexOf("cd02") != -1) {
						    that.setData({
							cd02: res.characteristics[i].uuid,
							characteristics02: res.characteristics[i]
						    });
						  } if (res.characteristics[i].uuid.indexOf("cd03") != -1) {
						    that.setData({
							cd03: res.characteristics[i].uuid,
							characteristics03: res.characteristics[i]
						    });
						  }
						  if (res.characteristics[i].uuid.indexOf("cd04") != -1) {
						    that.setData({
							cd04: res.characteristics[i].uuid,
							characteristics04: res.characteristics[i]
						    });
						  }
						}
						console.log('cd01= ' + that.data.cd01 + 'cd02= ' + that.data.cd02 + 'cd03= ' + that.data.cd03 + 'cd04= ' + that.data.cd04 + 'cd20= ' + that.data.cd20);
						*/
						/**
						 * 回调获取 设备发过来的数据
						 */
						wx.onBLECharacteristicValueChange(function (characteristic) {
							console.log('characteristic value comed:', characteristic.value)
							//{value: ArrayBuffer, deviceId: "D8:00:D2:4F:24:17", serviceId: "ba11f08c-5f14-0b0d-1080-007cbe238851-0x600000460240", characteristicId: "0000cd04-0000-1000-8000-00805f9b34fb-0x60800069fb80"}
							/**
							 * 监听cd04cd04中的结果
							 */
							if (characteristic.characteristicId.indexOf("cd01") != -1) {
								const result = characteristic.value;
								const hex = that.buf2hex(result);
								console.log(hex);
							}
							if (characteristic.characteristicId.indexOf("cd04") != -1) {
								const result = characteristic.value;
								const hex = that.buf2hex(result);
								console.log(hex);
								that.setData({ result: hex });
							}

						})
						/**
						 * 顺序开发设备特征notifiy
						 */
						wx.notifyBLECharacteristicValueChanged({
							deviceId: g_deviceId,
							serviceId: g_services,
							characteristicId: cd0,
							state: true,
							success: function (res) {
								// success
								console.log('notifyBLECharacteristicValueChanged success', res);
							},
							fail: function (res) {
								// fail
							},
							complete: function (res) {
								// complete
							}
						})
						wx.notifyBLECharacteristicValueChanged({
							deviceId: g_deviceId,
							serviceId: g_services,
							characteristicId: cd1,
							state: true,
							success: function (res) {
								// success
								console.log('notifyBLECharacteristicValueChanged success', res);
							},
							fail: function (res) {
								// fail
							},
							complete: function (res) {
								// complete
							}
						})
						wx.notifyBLECharacteristicValueChanged({
							deviceId: g_deviceId,
							serviceId: g_services,
							characteristicId: cd2,
							state: true,
							success: function (res) {
								// success
								console.log('notifyBLECharacteristicValueChanged success', res);
							},
							fail: function (res) {
								// fail
							},
							complete: function (res) {
								// complete
							}
						})

						wx.notifyBLECharacteristicValueChanged({
							// 启用 notify 功能
							// 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
							deviceId: g_deviceId,
							serviceId: g_services,
							characteristicId: cd3,
							state: true,
							success: function (res) {
								console.log('notifyBLECharacteristicValueChanged success', res)
							}
						})

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
/*
function notifyBLECharacteristicValueChanged() {
	//onBLECharacteristicValueChange
	wx.notifyBLECharacteristicValueChanged({
		state: true, // 启用 notify 功能
		deviceId: g_deviceId,
		serviceId: g_services,
		characteristicId: g_characteristics,
		success: function (res) {
			console.log("启用notify", res);

			readVersion();
			//  readVersion();
		}
	})
}*/
function bleReadCallback() {


	console.log("---------------begin-------------------------");

	wx.readBLECharacteristicValue({
		deviceId: g_deviceId,
		serviceId: g_services,
		characteristicId: g_characteristics,
		success: function (res) {
			console.log('蓝牙返回成功:readBLECharacteristicValue:', res);
			wx.onBLECharacteristicValueChange(function (res) {

				console.log(`^_^characteristic ${res.characteristicId} has changed, now is ${res.value}`)
				//    console.log('characteristic value comed:', res)
				let dataView = new DataView(res.value);
				for (var n = 0; n < 20; n++) {
					console.log("=" + dataView.getInt8(n));
				}

			});
		},
		fail: function (res) {
			console.log('蓝牙返回错误:readBLECharacteristicValue:', res);
		}
	});
}
function readVersion() {
	let buffer = new ArrayBuffer(20)
	let dataView = new DataView(buffer)
	dataView.setUint8(0, 0);
	for (var n = 0; n < 20; n++) {
		dataView.setUint8(n, 0);
	}

	dataView.setUint16(0, 0x1800);
	dataView.setUint16(2, 0x2A00);
	dataView.setUint16(4, 0x2A00);

	// dataView.setUint8(4, 0x2A);
	// dataView.setUint8(5, 0x00);

	console.log("devcice=" + g_deviceId + "----g_services=" + g_services + "-----g_characteristics=" + g_characteristics);
	wx.writeBLECharacteristicValue({
	
		deviceId: g_deviceId,
	
		serviceId: g_services,
		characteristicId: g_characteristics,
	
		value: buffer,
		success: function (res) {
			console.log('写入数据：writeBLECharacteristicValue success', res)
			//bleReadCallback();
			bleReadCallback();
			// setTimeout(bleReadCallback,1000);
			//   ();
		},
		fail: function (res) {
			console.log("写入数据失败:", res);
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
			findMe();
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
	getConnectState: getConnectState
}