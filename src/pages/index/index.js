//index.js
//获取应用实例
var util = require('../../utils/util.js');
var ble = require('../../utils/ble_api.js');
var Charts = require('../../utils/wxcharts.js');
var debug_ui=true;

var app = getApp()
Page({

	data: {
		motto: 'index',
		userInfo: {},
		currDateShow:'',
		isConnect: 0,
		step_total:1600,// 总的步数
		step_ps:40,//步数的百分比
		step_dest:7000,//步数目标
		step_dist:1314, //距离
		step_cal:183,
		step_time:"10:00:00",
		sleep_total:"3.5", 
		good_sleep_time:3.5,
		bad_sleep_time:2.0,
		sober_sleep_time:1.0,
		end:0
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
	prepDateTap:function(){
		console.log("prep date");
	},
	nextDateTap: function () {
		console.log("next date");
	},
	bindDateChange: function (e) {
		this.setData({
			currDateShow: e.detail.value
		})
	},  
	drawHeartRateCanvas: function () {
		new Charts({
			canvasId: 'heartrateCanvas',
			type: 'column',
			categories: ['0:00', '', '', '',
				'4:00', '', '', '',
				'8:00', '', '', '',
				'12:00', '', '', '',
				'16:00', '', '', '',
				'20:00', '', '', '',
				'24:00'],
			series: [{
				name: '时间段步数详细信息',
				data: [0, 0, 4000, 8000, 4, 13000]
			}],
			yAxis: {
				format: function (val) {
					return val + '步';
				}
			},
			width: 360,
			height: 200,
			dataLabel: false
		});
		return;
	},
	drawStepCanvas:function(){
		new Charts({
			canvasId: 'setpCanvas',
			type: 'column',
			categories: ['0:00', '', '', '', 
					'4:00',  '', '', '', 
					'8:00', '', '', '', 
				'12:00', '', '', '',
				'16:00', '', '', '', 
				'20:00', '', '', '',
				'24:00'],
			series: [{
				name: '时间段步数详细信息',
				data: [0, 0, 4000, 8000, 4, 13000]
			}],
			yAxis: {
				format: function (val) {
					return val + '步';
				}
			},
			width: 360,
			height: 200,
			dataLabel: false
		});
		return ;
	},
	drawSleepCanvas: function () {
		new Charts({
			canvasId: 'sleepCanvas',
			type: 'column',
			categories: ['20:00', '', '', '',
				'0:00', '', '', '',
				'4:00', '', '', '',
				'8:00', '', '', '',
				'12:00', '', '', '',
				'16:00'],
			series: [{
				name: '翻身数量统计',
				data: [0, 0, 4000, 8000, 4, 13000]
			}],
			yAxis: {
				format: function (val) {
					return val + '步';
				}
			},
			width: 360,
			height: 200,
			dataLabel: false
		});
		return;
	},
	onLoad: function () {
		console.log('onLoad');

		var that = this;
		var now = new Date();
		that.setData({
			currDateShow: util.sprintf("%d-%02d-%02d", now.getFullYear(), now.getMonth() + 1, now.getDate())
		});
		console.log("getTimeDiff=" + this.getTimeDiff());
		if (debug_ui==false){
			ble.init(0);
			wx.getStorage({
				key: 'curr_device_id',
				success: function (res) {
					console.log(res);
					ble.run(res.data);
				}
			});
			setInterval(this.onTimer, 1000);
		}

	
		this.drawStepCanvas();
		this.drawSleepCanvas();
		this.drawHeartRateCanvas();
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
