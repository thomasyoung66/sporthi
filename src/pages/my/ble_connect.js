// pages/my/ble_connect.js
var util = require('../../utils/util.js');
var app = getApp()
var temp = []
var serviceId = "00002A00-0000-1000-8000-00805F9B34FB"
var characteristicId = "00002A00-0000-1000-8000-00805F9B34FB"
var ble_curr_id = 0;

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isbluetoothready: false,
		defaultSize: 'default',
		primarySize: 'default',
		warnSize: 'default',
		disabled: false,
		plain: false,
		loading: false,
		searchingstatus: false,
		receivedata: '',
		onreceiving: false,
		signal:"",
		devices: null

	},

	onLoad: function (options) {
		// var str = "A13";
		var that = this;
		// // var code = str.charCodeAt();
		// console.log(str.length)
		// console.log(str.charAt(0))
		// wx.showToast({
		//     title: '连接成功',
		//     icon: 'success',
		//     duration: 2000
		// })
		// let buffer = new ArrayBuffer(16)
		// let dataView = new DataView(buffer)
		// dataView.setUint8(1, 6)
		//console.log(dataView.getUint8(1))
		that.switchBlueTooth();
		
	},
	switchBlueTooth: function () {
		var that = this;

		that.setData({
			isbluetoothready: !that.data.isbluetoothready,
		});

		if (that.data.isbluetoothready) {
			wx.openBluetoothAdapter({
				success: function (res) {
					console.log("初始化蓝牙适配器成功")
					wx.onBluetoothAdapterStateChange(function (res) {
						console.log("蓝牙适配器状态变化", res)
						that.setData({
							isbluetoothready: res.available,
							searchingstatus: res.discovering
						})

					})

					var rule = wx.getStorageSync("match_rule");
					console.log("device match rule=", rule);

					wx.onBluetoothDeviceFound(function (devices) {
						console.log('begin-发现新蓝牙设备')
						console.log(devices);
						var item = devices["devices"][0];
						if (item.name==""){
							return ;
						}
						for (var n = 0; n < rule.length;n++){
							var arr = rule[n].sid.split(";");
							for(var p=0;p<arr.length;p++){
								console.log(arr[p]+"-----match----"+item.name);
								if (arr[p]==item.name.substr(0,arr[p].length)){
								
									item.brand = rule[n].brand;
									item.corp = rule[n].corp;

									if (item.name != '') {//name 
										temp.push(item)
										that.setData({
											devices: temp
										});
									}
									break;
								}
							}
						}


						/*
						console.log('begin-发现新蓝牙设备')
						console.log(devices)
						console.log(JSON.stringify(devices));
					      
						console.log('设备id' + item.deviceId)
						console.log('设备name' + item.name)
						console.log('end-发现新蓝牙设备')
						*/
					})
					
					setTimeout(that.searchbluetooth,1000);
				
				},
				fail: function (res) {
					console.log("初始化蓝牙适配器失败");
					wx.showModal({
						title: '提示',
						content: '请检查手机蓝牙是否打开',
						success: function (res) {
							that.setData({
								isbluetoothready: false,
								searchingstatus: false
							})
						}
					})
				}
			})

		} else {
			temp = []
			//先关闭设备连接
			wx.closeBLEConnection({
				deviceId: that.data.connectedDeviceId,
				complete: function (res) {
					console.log(res)
					that.setData({
						deviceconnected: false,
						connectedDeviceId: ""
					})
				}
			})
			wx.closeBluetoothAdapter({
				success: function (res) {
					console.log(res)
					that.setData({
						isbluetoothready: false,
						deviceconnected: false,
						devices: [],
						searchingstatus: false,
						receivedata: ''
					})
				},
				fail: function (res) {
					wx.showModal({
						title: '提示',
						content: '请检查手机蓝牙是否打开',
						success: function (res) {
							that.setData({
								isbluetoothready: false
							})
						}
					})
				}
			})
		}
	},
	searchbluetooth: function () {
		var that = this
		/*
		wx.navigateTo({
		  url: '../index/index',
		});*/
		console.log("begin search ble....."+that.data.searchingstatus);
		temp = []

		if (!that.data.searchingstatus) {
			var that = this
			that.setData({
				searchingstatus: !that.data.searchingstatus
			})
			wx.startBluetoothDevicesDiscovery({
				success: function (res) {
					console.log("开始搜索附近蓝牙设备")
					console.log(res)

				}
			})
		} else {
			wx.stopBluetoothDevicesDiscovery({
				success: function (res) {
					console.log("停止蓝牙搜索")
					console.log(res)
				}
			})
		}
	},
	connectAsk: function (event) {
		var that = this;
		console.log(event.currentTarget);
		ble_curr_id = event.currentTarget.dataset.id;

		serviceId = ble_curr_id;
		characteristicId = ble_curr_id;

		console.log("当前选择===" + ble_curr_id);
		wx.showModal({
			title: '系统提问',
			content: '是否链接到此蓝牙设备',
			confirmText: "是",
			cancelText: "否",
			success: function (res) {
				console.log(res);
				if (res.confirm) {
					that.connectTO(event);
					console.log('用户点击主操作')
				} else {
					//   console.log('用户点击辅助操作')
				}
			}
		});
	},
	connectTO: function (e) {
		var that = this;
		console.log("当前选择222===" + ble_curr_id);
		//  console.log("deviceId="+temp[ble_curr_id].deviceId);
		// console.log("name="+temp[ble_curr_id].deviceId);


		if (that.data.deviceconnected) {
			wx.notifyBLECharacteristicValueChanged({
				state: false, // 停用notify 功能
				deviceId: that.data.connectedDeviceId,
				serviceId: serviceId,
				characteristicId: characteristicId,
				success: function (res) {
					console.log("停用notify 功能")
				}
			})
			wx.closeBLEConnection({
				deviceId: e.currentTarget.id,
				complete: function (res) {
					console.log("断开设备")
					console.log(res)
					that.setData({
						deviceconnected: false,
						connectedDeviceId: "",
						receivedata: ""
					})
				}
			})
		} else {
			wx.showLoading({
				title: '连接蓝牙设备中...',
			})
			wx.createBLEConnection({
				deviceId: serviceId,
				success: function (res) {
					wx.hideLoading()
					wx.showToast({
						title: '连接成功',
						icon: 'success',
						duration: 1000
					})

					var item;
					for(var n=0;n<temp.length;n++){
						if (temp[n].deviceId == serviceId){
							item=temp[n];
							break;
						}
					}
			//		item.brand = rule[n].brand;
			//		item.corp = rule[n].corp;

					wx.request({
						url: util.getUrl('ble.php?action=update_device'),
						data: {
							id: wx.getStorageSync('serverId'),
							deviceId: serviceId,
							brand:item.brand,
							name:item.name,
							corp: item.corp
						},
						method: 'POST',
						header: { 'content-type': 'application/x-www-form-urlencoded' },
						success: function (res) {
							console.log("save----", res);
							//global data....
							if (res.data.code==0)
								wx.setStorageSync('devices', res.data.devices);

						}
					});
					console.log("连接设备成功")
					console.log(res)
					that.setData({
						deviceconnected: true,
						connectedDeviceId: serviceId
					})
					//ssss
					wx.setStorage({
						key: 'curr_device_id',
						data: serviceId
					});

					wx.notifyBLECharacteristicValueChanged({
						state: true, // 启用 notify 功能
						deviceId: that.data.connectedDeviceId,
						serviceId: serviceId,
						characteristicId: characteristicId,
						success: function (res) {
							console.log("启用notify")
						}
					})
				},
				fail: function (res) {
					wx.hideLoading()
					wx.showToast({
						title: '连接设备失败',
						icon: 'success',
						duration: 1000
					})
					console.log("连接设备失败")
					console.log(res)
					that.setData({
						connected: false
					})
				}
			});
			wx.stopBluetoothDevicesDiscovery({
				success: function (res) {
					console.log("停止蓝牙搜索")
					console.log(res)
				}
			})
		}
	},
	formSubmit: function (e) {
		console.log('form发生了submit事件，携带数据为：' + e.detail.value.senddata)
		var senddata = e.detail.value.senddata;
		var that = this;
		let buffer = new ArrayBuffer(senddata.length);
		let dataView = new DataView(buffer);
		for (var i = 0; i < senddata.length; i++) {
			dataView.setUint8(i, senddata.charAt(i).charCodeAt())
		}
		wx.writeBLECharacteristicValue({
			deviceId: that.data.connectedDeviceId,
			serviceId: serviceId,
			characteristicId: characteristicId,
			value: buffer,
			success: function (res) {
				console.log(res)
				console.log('writeBLECharacteristicValue success', res.errMsg)
			}
		})
	},
	formReset: function () {
		console.log('form发生了reset事件')
	},

	getNowFormatDate: function () {
		var date = new Date();
		var seperator1 = "-";
		var seperator2 = ":";
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
			+ " " + date.getHours() + seperator2 + date.getMinutes()
			+ seperator2 + date.getSeconds();
		return currentdate;
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})