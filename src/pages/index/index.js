//index.js
//获取应用实例
var util = require('../../utils/util.js');
var ble = require('../../utils/ble_api.js');

var app = getApp()
Page({

	data: {
		motto: 'index',
		userInfo: {},
		isConnect: 0

	},
	showDetail: function (data) {
		console.log("this is ok.." + data);
	},
	//事件处理函数
	bindViewTap: function () {
		wx.navigateTo({
			url: '../logs/logs'
		})
	},
	getList: function () {
		var that = this
		wx.request({
			url: 'https://guns.movnow.com/my.php',
			data: {
			},
			method: 'GET',
			success: function (res) {
				console.log(JSON.stringify(res));

			}
		})
	},
	addTap: function () {
		//alert("add....");
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		console.log("onPullDownRefresh.....");
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		console.log("on--show....");
	},

	getTimeDiff: function () {
		var begin = new Date("2017/09/05 11:00:00").getTime();
		var end = new Date("2000/01/01 00:00:00").getTime();
		var d = begin - end;
		console.log("time=" + d);
		return parseInt(parseInt(d) / 1000);
	},
	onTimer: function () {
		var that = this;
		if (ble.getConnectState() != that.data.isConnect) {
			console.log(ble.getConnectState() + "--------------set------------" + that.data.isConnect);
			that.setData({
				isConnect: ble.getConnectState()
			});
		}
	},
	onLoad: function () {
		console.log('onLoad');

		var that = this;
		console.log("getTimeDiff=" + this.getTimeDiff());
		ble.init(0);
		wx.getStorage({
			key: 'curr_device_id',
			success: function (res) {
				console.log(res);
				ble.run(res.data);
			}
		})

		setInterval(this.onTimer, 1000);

		/*
		  wx.getLocation({
			type: 'wgs84',
			success: function (res) {
			  console.log("地址位置------------");
			  console.log(res);
			  var latitude = res.latitude
			  var longitude = res.longitude
			  var speed = res.speed
			  var accuracy = res.accuracy
			},
			fail:function (res){
			  console.log("获取地理位置失败....");
			}
		  })*/
		/*
		ble.openBluetooth();
		ble.getBluetoothAdapterState();
		ble.startBluetoothDevicesDiscovery();
	   
		//调用应用实例的方法获取全局数据
		app.getUserInfo(function(userInfo){
		  //更新数据
		  that.setData({
			userInfo:userInfo
		  })
		}) */
	}
})
