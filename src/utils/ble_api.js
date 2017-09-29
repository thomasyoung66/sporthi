var g_ble_type = 0;
var ble_km = require('ble_koomii.js');

function init(ble_type) {
	g_ble_type = ble_type;
	switch (g_ble_type) {
		case 0:
			ble_km.openBleDevice();
			break;
		default:
			break;
	}

}
function getConnectState() {
	switch (g_ble_type) {
		case 0:
			return ble_km.getConnectState();
		default:
			break;
	}
}
function run(deviceId) {
	switch (g_ble_type) {
		case 0:
			ble_km.initBle(deviceId);
			break;
		default:
			break;
	}

}
function beginHeartBeatTest() {
	switch (g_ble_type) {
		case 0:
			return ble_km.beginHeartBeatTest();
		default:
			break;
	}
}
function endHeartBeatTest() {
	switch (g_ble_type) {
		case 0:
			return ble_km.endHeartBeatTest();
		default:
			break;
	}
}
function findDevice(val) {
	switch (g_ble_type) {
		case 0:
			return ble_km.findDevice(val);
		default:
			break;
	}
}
function saveAllConfig() {
	switch (g_ble_type) {
		case 0:
			return ble_km.saveAllConfig();
		default:
			break;
	}
}
function disConnect()
{
	switch (g_ble_type) {
		case 0:
			return ble_km.disConnect();
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
	findDevice: findDevice,
	saveAllConfig: saveAllConfig,
	disConnect: disConnect

}