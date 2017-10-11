var g_ble_type = 0;
var ble_km = require('ble_koomii.js');
var ble_movnow = require('ble_movnow.js');

//var g_movnow_service="0000FEE8-0000-1000-8000-00805F9B34FB";
var g_movnow_service="0000FCFA-0000-1000-8000-00805F9B34FB";

var g_movnow_characteristics_notify = "000001D4-0000-1000-8000-00805F9B34FB";
var g_movnow_characteristics_write = "000000D4-0000-1000-8000-00805F9B34FB";

var g_movnow_m5_service = "0000FEE9-0000-1000-8000-00805F9B34FB";
var g_movnow_m5_characteristics_notify = "D44BC439-ABFD-45A2-B575-925416129601";
var g_novmow_m5_characteristics_write =  "D44BC439-ABFD-45A2-B575-925416129600";

/*

var g_movnow_m5_service = "0000FFB0-0000-1000-8000-00805F9B34FB";
var g_movnow_m5_characteristics_notify = "D44BC439-ABFD-45A2-B575-925416129601";
var g_novmow_m5_characteristics_write =  "D44BC439-ABFD-45A2-B575-925416129600";
*/

function init(ble_type) {
	var obj=wx.getStorageSync("curr_devices");

	console.log("初始化:",obj);
	console.log("---------------",obj.parser);

	g_ble_type = obj.parser;
	if (obj.name=="M5"){
		console.log("这是一个m5的设备....");
	}
	switch (g_ble_type) {
		case "ble_koomii":
			console.log("------old---------", obj.parser);
			ble_km.openBleDevice();
			break;
		case "ble_movnow":
			console.log("------new---------", obj.parser);

			ble_movnow.openBleDevice();
			
			break;
		default:
			break;
	}

}
function getConnectState() {
	switch (g_ble_type) {
		case "ble_koomii":
			return ble_km.getConnectState();
		case "ble_movnow":
			return ble_movnow.getConnectState();
		default:
			break;
	}
}
function run(deviceId) {

	switch (g_ble_type) {
		case "ble_koomii":
			ble_km.initBle(deviceId);
			break;
		case "ble_movnow":
			var obj = wx.getStorageSync("curr_devices");
			console.log("当前设备:",obj);
			if (obj.name == "M5") {
				ble_movnow.initBle(deviceId,g_movnow_m5_service, g_movnow_m5_characteristics_notify, g_novmow_m5_characteristics_write,true);
			}
			else {
				ble_movnow.initBle(deviceId,g_movnow_service, g_movnow_characteristics_notify, g_movnow_characteristics_write,false);
			}
			break;
		default:
			break;
	}

}
function beginHeartBeatTest() {
	switch (g_ble_type) {
		case "ble_koomii":
			return ble_km.beginHeartBeatTest();
		case "ble_movnow":
			return ble_movnow.beginHeartBeatTest();

		default:
			break;
	}
}
function endHeartBeatTest() {
	switch (g_ble_type) {
		case "ble_koomii":
			return ble_km.endHeartBeatTest();
		case "ble_movnow":
			return ble_movnow.endHeartBeatTest();
		default:
			break;
	}
}
function beginBpTest() {
	switch (g_ble_type) {
		case "ble_koomii":
			return ble_km.beginHeartBeatTest();
		case "ble_movnow":
			return ble_movnow.beginBpTest();

		default:
			break;
	}
}
function endBpTest() {
	switch (g_ble_type) {
		case "ble_koomii":
			return ble_km.endHeartBeatTest();
		case "ble_movnow":
			return ble_movnow.endBpTest();
		default:
			break;
	}
}
function findDevice(val) {
	switch (g_ble_type) {
		case "ble_koomii":
			return ble_km.findDevice(val);
		case "ble_movnow":
			return ble_movnow.findDevice(val);
		default:
			break;
	}
}
function saveAllConfig() {
	switch (g_ble_type) {
		case "ble_koomii":
			return ble_km.saveAllConfig();
		case "ble_movnow":
			return ble_movnow.saveAllConfig();
		default:
			break;
	}
}
function disConnect()
{
	switch (g_ble_type) {
		case "ble_koomii":
			return ble_km.disConnect();
		case "ble_movnow":
			return ble_movnow.disConnect();
		default:
			break;
	}	
}
module.exports = {
	init: init,
	getConnectState: getConnectState,
	run: run,
	beginHeartBeatTest: beginHeartBeatTest,
	endHeartBeatTest: endHeartBeatTest,
	beginBpTest: beginBpTest,
	endBpTest: endBpTest,
	findDevice: findDevice,
	saveAllConfig: saveAllConfig,
	disConnect: disConnect
}