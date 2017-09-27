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

//左右滑动
var time = 0;
var touchDot = 0;//触摸时的原点
var interval = "";
var flag_hd = true;



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
  // 触摸开始事件
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸结束事件
  touchEnd: function (e) {
    var touchMove = e.changedTouches[0].pageX;
    // 向左滑动   
    if (touchMove - touchDot <= -80 && time < 10 && flag_hd == true) {
      flag_hd = false;
      //执行切换页面的方法
      console.log("向右滑动");
     // this.nextDateTap();
      
      //return 

    }
    // 向右滑动   
    if (touchMove - touchDot >= 80 && time < 10 && flag_hd == true) {
      flag_hd = false;
      //执行切换页面的方法
      console.log("向左滑动");
     // this.prepDateTap();
      //return ;
 
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
    flag_hd=true;
  },
  connect_action:function(){
    console.log("ok....." + this.data.isConnect);
    if (this.data.isConnect==0){
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
  findDevice:function(val){
    ble.findDevice(val);
  },
	heartBeatTest:function(){
		console.log("heartBeat test...");
    if (this.data.isConnect==0){
      wx.showToast({
        title: '设备还未连接，请先连接设备！'
      })
      return ;
    }
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
        hb_text:"测量心率",
        bp_text: "血压测试"
      });
      hb_times = 0;
      ble.endHeartBeatTest();
     
    }
	},
	bpTest: function () {
    this.heartBeatTest();
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
    flag_hd = true;    //重新进入页面之后，可以再次执行滑动切换页面代码
    clearInterval(interval); // 清除setInterval
    time = 0;
		console.log("on--show....");
	},

	getTimeDiff: function () {
		var begin = new Date("2017/09/05 11:00:00").getTime();
		var end = new Date("2000/01/01 00:00:00").getTime();
		var d = begin - end;
		console.log("time=" + d);
		return parseInt(parseInt(d) / 1000);
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
		//	type: 'column',
    type:'line',
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


	onLoad: function () {
		console.log('onLoad');

	}
})
