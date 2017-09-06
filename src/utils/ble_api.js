var g_ble_type=0;
var ble_km = require('ble_koomii.js');

function init(ble_type)
{
	g_ble_type = ble_type;
	switch(g_ble_type){
		case 0:
			ble_km.openBleDevice();
			break;
		default:
			break;
	}
	
}
function getConnectState()
{
	switch (g_ble_type) {
		case 0:
			return ble_km.getConnectState();
		default:
			break;
	}
}
function run(deviceId)
{
	switch (g_ble_type) {
		case 0:
			ble_km.initBle(deviceId);
			break;
		default:
			break;
	}
	
}
module.exports = {
	init:init,
	getConnectState: getConnectState,
	run:run

}