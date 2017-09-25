function openBluetooth () {
  wx.openBluetoothAdapter({
    success: function (res) {
      console.log(res.errMsg)
      wx.showToast({
        title: "初始化蓝牙适配器成功",
        duration: 2000
      })
    },
  })
}

//关闭蓝牙模块  
function closeBluetooth () {
  wx.openBluetoothAdapter()

  wx.closeBluetoothAdapter({
    success: function (res) {
      // success  
      console.log("success" + res)
    }
  })
}
//获取本机蓝牙适配器状态  
function getBluetoothAdapterState() {
  wx.getBluetoothAdapterState({
    success: function (res) {
      // success  
      console.log("getBluetoothAdapterState res:" + res)
      console.log("getBluetoothAdapterState errMsg:" + res.errMsg)
    }
  })
}

//监听蓝牙适配器状态变化事件  
function onBluetoothAdapterStateChange () {
  wx.onBluetoothAdapterStateChange(function (res) {
    console.log(`adapterState changed, now is`, res)
  })
}
// 开始搜寻附近的蓝牙外围设备  
function startBluetoothDevicesDiscovery() {
  wx.startBluetoothDevicesDiscovery({
    success: function (res) {
      console.log("begin-"+res);
      for( var key  in res){
        console.log(key+":"+res[key]);
      }
      console.log("end-" + res);
      onBluetoothDeviceFound();
    }
  })
}

// 停止搜寻附近的蓝牙外围设备  
function stopBluetoothDevicesDiscovery () {
  wx.stopBluetoothDevicesDiscovery({
    success: function (res) {
      console.log(res)
    }
  })
}
//获取所有已发现的蓝牙设备  
function getBluetoothDevices() {
  wx.getBluetoothDevices({
    success: function (res) {
      // success  
      console.log("发现结果："+res);
    },
  })
}

//监听寻找到新设备的事件  
function onBluetoothDeviceFound() {
  wx.onBluetoothDeviceFound(function (res) {
    // callback  
    console.log('发现新蓝牙设备');
    console.log('设备id' + devices.deviceId);
    console.log('设备name' + devices.name);
  })
}
//根据 uuid 获取处于已连接状态的设备  
function getConnectedBluetoothDevices() {
  wx.getConnectedBluetoothDevices({
    success: function (res) {
      console.log(res)
    }
  })
}

//连接低功耗蓝牙设备  
function createBLEConnection() {
  wx.createBLEConnection({
    deviceId: 'AC:BC:32:C1:47:80',
    success: function (res) {
      // success  
      console.log(res)
    },
    fail: function (res) {
      // fail  
    },
    complete: function (res) {
      // complete  
    }
  })
}

//断开与低功耗蓝牙设备的连接  
function closeBLEConnection() {
  wx.closeBLEConnection({
    deviceId: 'AC:BC:32:C1:47:80',
    success: function (res) {
      console.log(res)
    }
  })
}

//监听低功耗蓝牙连接的错误事件，包括设备丢失，连接异常断开等等  
function onBLEConnectionStateChanged() {
  wx.onBLEConnectionStateChanged(function (res) {
    console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
  })
}
//获取蓝牙设备所有 service（服务）  
function getBLEDeviceServices() {
  wx.getBLEDeviceServices({
    deviceId: '48:3B:38:88:E3:83',
    success: function (res) {
      // success  
      console.log('device services:', res.services.serviceId)
    },
    fail: function (res) {
      // fail  
    },
    complete: function (res) {
      // complete  
    }
  })
}

//获取蓝牙设备所有 characteristic（特征值）  
function getBLEDeviceCharacteristics () {
  wx.getBLEDeviceCharacteristics({
    deviceId: '48:3B:38:88:E3:83',
    serviceId: 'serviceId',
    success: function (res) {
      // success  
    },
    fail: function (res) {
      // fail  
    },
    complete: function (res) {
      // complete  
    }
  })
}  
function findDevice(val)
{
  
}

module.exports = {
  openBluetooth: openBluetooth,
  closeBluetooth: closeBluetooth,
  getBluetoothAdapterState: getBluetoothAdapterState,
  onBluetoothAdapterStateChange: onBluetoothAdapterStateChange,
  startBluetoothDevicesDiscovery: startBluetoothDevicesDiscovery,
  stopBluetoothDevicesDiscovery: stopBluetoothDevicesDiscovery,
  getBluetoothDevices: getBluetoothDevices,
  onBluetoothDeviceFound: onBluetoothDeviceFound,
  getConnectedBluetoothDevices: getConnectedBluetoothDevices,

  createBLEConnection: createBLEConnection,
  closeBLEConnection: closeBLEConnection,
  onBLEConnectionStateChanged: onBLEConnectionStateChanged,
  getBLEDeviceServices: getBLEDeviceServices,
  getBLEDeviceCharacteristics: getBLEDeviceCharacteristics,
  findDevice: findDevice
}