//index.js
//获取应用实例
var util = require('../../utils/util.js');
var ble = require('../../utils/ble_api.js');
var Charts = require('../../utils/wxcharts.js');
var debug_ui=false;
var hb_times=0;
var stepImage=null; //步数画图
var sleepImage = null;//睡眠画图
var  hbField=null;
var  hbArrayData=null; //测量心率原始数据
var  bpMaxArrayData = null;//高血压
var  bpMinArrayData = null; //低血压



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
    hb_text:"心率测试",
    bp_text: "血压测试",
		power_ps:0,
		power_text:0,
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
  connect_action:function(){
    console.log("ok....." + this.data.isConnect);
    if (this.data.isConnect==1){
      wx.navigateTo({
        url: 'connect_error',
      })
    }
    else{
      wx.navigateTo({
        url: 'hw_setting',
      })  
    }
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

    hbField=null;
    hbArrayData = null; //测量心率原始数据
    bpMaxArrayData = null;//高血压
    bpMinArrayData = null; //低血压

    if (hb_times==0){
      hb_times = 120;
      ble.beginHeartBeatTest();
      this.setData({
        hb_last:"数据采集中..."
      });
      this.setData({
        bp_last: "数据采集中..."
      });
      wx.showToast({
        title: '开始测试心率...',
      });
    }
	  else{
      wx.showToast({
        title: '停止测试心率...',
      });
      this.setData({
        hb_text:"测量心率"
      });
      hb_times = 0;
      ble.endHeartBeatTest();
     
    }
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
    if (hb_times>0){
      that.setData({
        hb_text:hb_times
      });
      if (hb_times==1){
        wx.showToast({
          title: '停止测试心率...',
        });
        this.setData({
          hb_text: "测量心率"
        });
        ble.endHeartBeatTest();
      }
      hb_times = hb_times-1;
    }
	},
	showCurrStepInfo:function (step,time){
		this.setData({
			step_total: step,
			step_ps: parseInt(step * 100 / this.data.step_dest),
			step_dist: util.calcOdo(step),
			step_cal: util.calcCalorie(step),
			step_time:util.toHourMinute(time)
		});
	},
  //显示动态心率
  showDynHbBp:function (hb,maxBp,minBp){
    if (hbField==null){
      hbField=new Array();
      for(var n=0;n<30;n++){
        hbField.push(n);
      }
      hbArrayData=new Array();
      bpMaxArrayData = new Array();
      bpMinArrayData = new Array();

    }

    this.setData({
      hb_last: hb,
      bp_last: maxBp + "/" + minBp
    });
   
    if (hbArrayData.length>30)
      hbArrayData.shift();
    hbArrayData.push(hb);
    if (bpMaxArrayData.length>30)
      bpMaxArrayData.shift();
    bpMaxArrayData.push(maxBp);
    if (bpMinArrayData.length>30)
      bpMinArrayData.shift();
    bpMinArrayData.push(minBp);


    console.log(" main index===hb"+hb+" maxBp="+maxBp+" minBp="+minBp);
    new Charts({
      canvasId: 'heartrateCanvas',
      type: 'column',
      categories: hbField ,
      series: [{
        name: '时间段心率详细情况',
        data: hbArrayData
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

    new Charts({
      canvasId: 'bpCanvas',
      type: 'column',
      categories: hbField,
      series: [{
        name: '低压(舒张压)',
        data: bpMaxArrayData
      }, {
        name: '高压(收缩压)',
        data: bpMinArrayData
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
	showHistoryData: function (pDate)
	{
		//show step data....
		var stepData = wx.getStorageSync("step-" + pDate);
 
		if (util.getDateOffset(0, "yyyy-MM-dd")==pDate){
			stepData = wx.getStorageSync("today");
			console.log("today....",stepData);
		}

    if (stepData == null || stepData.hasOwnProperty("step") == false) {
      console.log("显示历史数据:", stepData);
      wx.showToast({
        title: '读取历史数据' + pDate + '发生错误!'
      });
      return;
    }
    
		console.log(wx.getStorageInfoSync());
		if (stepData != null) {
			console.log("stepData===", stepData);
			this.showCurrStepInfo(stepData.step, stepData.hasOwnProperty("time") ? stepData.time:0);
		
			var stepHour = new Array(stepData.h0, stepData.h1, stepData.h2, stepData.h3,
				stepData.h4, stepData.h5, stepData.h6, stepData.h7,
				stepData.h8, stepData.h9, stepData.h10, stepData.h11,
				stepData.h12, stepData.h13, stepData.h14, stepData.h15,
				stepData.h16, stepData.h17, stepData.h18, stepData.h19,
				stepData.h20, stepData.h21, stepData.h22, stepData.h23);
			this.drawStepCanvas(stepHour);
		}
		var sleepData = wx.getStorageSync("sleep-" + pDate);
    console.log(pDate+"------>>>>>>", sleepData);
		if (sleepData == null || sleepData == "" ){
      console.log("睡眠是0");
			this.drawSleepCanvas(new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
			this.setData({
				sleep_total: 0,
				good_sleep_time: 0,
				bad_sleep_time: 0,
				sober_sleep_time: 0
			});
		}
		else{
      console.log("睡眠是有志");
				/*item.runMin = dataViewStep.getUint16(n * 64 + 8, true);
				item.restless = dataViewStep.getUint16(n * 64 + 10, true);
				item.deep = (item.endTime - item.startTime) / 60 - item.runMin - item.restless;*/
			this.setData({
				sleep_total: util.toHourMinute((sleepData.endTime - sleepData.startTime)/60),
				good_sleep_time: util.toHourMinute(sleepData.deep),
				bad_sleep_time: util.toHourMinute(sleepData.restless),
				sober_sleep_time: util.toHourMinute(sleepData.runMin)
			});
			var sleepHour = new Array(sleepData.h0, sleepData.h1, sleepData.h2, sleepData.h3,
				sleepData.h4, sleepData.h5, sleepData.h6, sleepData.h7,
				sleepData.h8, sleepData.h9, sleepData.h10, sleepData.h11,
				sleepData.h12, sleepData.h13, sleepData.h14, sleepData.h15,
				sleepData.h16, sleepData.h17, sleepData.h18, sleepData.h19,
				sleepData.h20, sleepData.h21, sleepData.h22, sleepData.h23);
      console.log("sleep array:", sleepHour);
			this.drawSleepCanvas(sleepHour);
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
    if (stepImage!=null){
      console.log("步数初始化....设置数据.", stepData);
      stepImage.updateData(stepData);
    }
    else{
      console.log("步数初始化.....");
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
    }
		return ;
	},
	drawSleepCanvas: function (sleepData) {
    if (sleepImage != null) {
      sleepImage.updateData(sleepData);
    }
    else {
		  new Charts({
			canvasId: 'sleepCanvas',
			type: 'column',
			categories: ['20:00', '', '', '',
				'0:00', '', '', '',
				'4:00', '', '', '',
				'8:00', '', '', '',
				'12:00', '', '', '',
				'16:00', '', '', '',],
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
    }
		return;
	},
	onLoad: function () {
		console.log('onLoad');
		getApp().get_open_id();
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
