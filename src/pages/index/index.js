//index.js
//获取应用实例
var util = require('../../utils/util.js');
var ble = require('../../utils/ble_api.js');
var Charts = require('../../utils/wxcharts.js');
var debug_ui=false;

var app = getApp()
Page({

	data: {
		motto: 'index',
		userInfo: {},
		currDateShow:'',
		currWeekShow:"星期",
		isConnect: 0,
		step_total:"-",// 总的步数
		step_ps:'-',//步数的百分比
		step_dest:7000,//步数目标
		step_dist:'-', //距离
		step_cal:'-',
		step_time:"-:-:-",
		sleep_total:"-", 
		good_sleep_time:"-",
		bad_sleep_time:"-",
		sober_sleep_time:'-',
		hb_last:'-',
		hb_max:'-',
		hb_min:'-',
		hb_avg:'-',
		bp_max:"-/-",//最高血压
		bp_min:"-/-",//最小血压
		bp_avg:"-/-",//
		bp_last:"-/-",
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
	heartBeatTest:function(){
		console.log("heartBeat test...");
		wx.showToast({
			title: '开始测试心率...',
		});
	},
	bpTest: function () {
		console.log("bp test...");
		wx.showToast({
			title: '开始测试血压...',
		});
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
	showHistoryData: function (pDate)
	{
		//show step data....
		var stepData = wx.getStorageSync("step-" + pDate);
		if (stepData != null) {
			console.log("stepData.step===", stepData);
			this.setData({
				step_total: stepData.step,
				step_ps: parseInt(stepData.step * 100 / this.data.step_dest),
				step_dist: util.calcOdo(stepData.step),
				step_cal:util.calcCalorie(stepData.step)
			});
		
			var stepHour = new Array(stepData.h0, stepData.h1, stepData.h2, stepData.h3,
				stepData.h4, stepData.h5, stepData.h6, stepData.h7,
				stepData.h8, stepData.h9, stepData.h10, stepData.h11,
				stepData.h12, stepData.h13, stepData.h14, stepData.h15,
				stepData.h16, stepData.h17, stepData.h18, stepData.h19,
				stepData.h20, stepData.h21, stepData.h22, stepData.h23);
			this.drawStepCanvas(stepHour);
		}
		var sleepData = wx.getStorageSync("sleep-" + pDate);
		console.log("------>>>>>>", sleepData);
		if (sleepData == null || sleepData==""){
			this.drawSleepCanvas(new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
			this.setData({
				sleep_total: 0,
				good_sleep_time: 0,
				bad_sleep_time: 0,
				sober_sleep_time: 0
			});
		}
		else{
				/*item.runMin = dataViewStep.getUint16(n * 64 + 8, true);
				item.restless = dataViewStep.getUint16(n * 64 + 10, true);
				item.deep = (item.endTime - item.startTime) / 60 - item.runMin - item.restless;*/
			this.setData({
				sleep_total: util.toHourMinute(sleepData.deep + item.restless),
				good_sleep_time: util.toHourMinute(sleepData.deep),
				bad_sleep_time: util.toHourMinute(item.restless),
				sober_sleep_time: util.toHourMinute(item.runMin)
			});
			var sleepHour = new Array(sleepData.h0, sleepData.h1, sleepData.h2, sleepData.h3,
				sleepData.h4, sleepData.h5, sleepData.h6, sleepData.h7,
				sleepData.h8, sleepData.h9, sleepData.h10, sleepData.h11,
				sleepData.h12, sleepData.h13, sleepData.h14, sleepData.h15,
				sleepData.h16, sleepData.h17, sleepData.h18, sleepData.h19,
				sleepData.h20, sleepData.h21, sleepData.h22, sleepData.h23);
			this.drawStepCanvas(sleepHour);
		}
		
	},
	prepDateTap:function(){
		var pDate = util.getPrevDate(this.data.currDateShow,-1);
		this.setData({
			currDateShow: pDate,
			currWeekShow: util.getWeekName(pDate)
		});
		this.showHistoryData(pDate);
	
		console.log("begin-----date....", wx.getStorageSync("step-" + pDate));
	},
	nextDateTap: function () {
		if (util.getDateOffset(0, "yyyy-MM-dd") == this.data.currDateShow){
			wx.showToast({
				title: '数据已经是最后一天！',
			})
			return ;
		}
		var pDate = util.getPrevDate(this.data.currDateShow, 1);
		this.setData({
			currDateShow: pDate,
			currWeekShow: util.getWeekName(pDate)
		});

		this.showHistoryData(pDate);
	},
	bindDateChange: function (e) {
		var pDate = e.detail.value;
		this.setData({
			currDateShow: pDate,
			currWeekShow: util.getWeekName(pDate)
		})
		this.showHistoryData(pDate);
	},  
	drawBpCanvas: function () {
		new Charts({
			canvasId: 'bpCanvas',
			type: 'column',
			categories: ['0:00', '', '', '',
				'4:00', '', '', '',
				'8:00', '', '', '',
				'12:00', '', '', '',
				'16:00', '', '', '',
				'20:00', '', '', '',
				'24:00'],
			series: [{
				name: '低压(舒张压)',
				data: [0]
			}, {
					name: '高压(收缩压)',
				data: [0]
			}],
			yAxis: {
				format: function (val) {
					return val + 'mmHg';
				}
			},
			width: 360,
			height: 200,
			dataLabel: false
		});
		return;
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
				name: '时间段心率详细情况',
				data: [0]
			}],
			yAxis: {
				format: function (val) {
					return val + 'bpm';
				}
			},
			width: 360,
			height: 200,
			dataLabel: false
		});
		return;
	},
	drawStepCanvas:function(stepData){
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
				data: stepData
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
	drawSleepCanvas: function (sleepData) {
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
				data: sleepData
			}],
			yAxis: {
				format: function (val) {
					return val + '次';
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
		var pDate = util.sprintf("%d-%02d-%02d", now.getFullYear(), now.getMonth() + 1, now.getDate());
		that.setData({
			step_dest: wx.getStorageSync('dest'),
			currDateShow: pDate,
			currWeekShow: util.getWeekName(pDate)
		}); 
		getApp().globalData.indexPage=this;

		
		console.log("getTimeDiff=" + this.getTimeDiff());
		if (debug_ui==false){
			console.log("currDeviceId" + app.data.currDeviceId);
			ble.init(0);
			ble.run(app.data.currDeviceId);

			setInterval(this.onTimer, 1000);
		}

	
		this.drawStepCanvas(new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
		this.drawSleepCanvas(new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
		this.drawHeartRateCanvas();
		this.drawBpCanvas();
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
