 //index.js
//获取应用实例
var util = require('../../utils/util.js');
var ble = require('../../utils/ble_api.js');
var Charts = require('../../utils/wxcharts.js');
var debug_ui = false;
var hb_times = 0;
var stepImage = null; //步数画图
var sleepImage = null;//睡眠画图
var hbField = null;
var hbArrayData = null; //测量心率原始数据
var bpMaxArrayData = null;//高血压
var bpMinArrayData = null; //低血压
var isSync=false;

var canvasWidth=util.isAndroid()?340:380;
//var canvasWidth = 380;
//左右滑动
var touchDot = 0;//触摸时的原点
var time = 0;//  时间记录，用于滑动时且时间小于1s则执行左右滑动
var interval = "";// 记录/清理 时间记录
var nth = 0;// 设置活动菜单的index
var nthMax = 5;//活动菜单的最大个数
var tmpFlag = true;// 判断左右华东超出菜单最大值时不再执行滑动事件
var moveType=0;//判断方向


var app = getApp()
Page({

	data: {
		motto: 'index',
		userInfo: {},
		currDateShow: '',
		currWeekShow: "星期",
		brand_icon:'../../images/disconnect.png',
		isConnect: 0,
		step_total: "-",// 总的步数
		step_ps: '-',//步数的百分比
		step_dest: 7000,//步数目标
		step_dist: '-', //距离
		step_cal: '-',
		step_time: "-:-:-",
		sleep_total: "-",
		good_sleep_time: "-",
		bad_sleep_time: "-",
		sober_sleep_time: '-',
		hb_last: '-',
		hb_max: '-',
		hb_min: '-',
		hb_avg: '-',
		bp_max: "-/-",//最高血压
		bp_min: "-/-",//最小血压
		bp_avg: "-/-",//
		bp_last: "-/-",
		hb_text: "心率测试",
		bp_text: "血压测试",
		power_ps: 0,
		power_text: 0,
		canvasWidth: 360,
		sleep_width:200,
		end: 0,
		scrollTop: 0,
		scrollHeight:0,
		posType:""
	},
	showDetail: function (data) {
		console.log("this is ok.." + data);
	},
	canvasTap: function (e) {

		wx.navigateTo({
			url: 'step_history?uid=' + wx.getStorageSync('serverId')
		})
		/*
		wx.showToast({
			title: '正在处理.....',
		})
		*/
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
		moveType=0; 
		interval = setInterval(function () {
			time++;
		}, 100);
	},
	// 触摸移动事件
	touchMove: function (e) {
		var touchMove = e.touches[0].pageX;
	//	console.log("touchMove:" + touchMove + " touchDot:" + touchDot + " diff:" + (touchMove - touchDot));
		// 向左滑动   
		if (touchMove - touchDot <= -40 && time < 10) {
			//nth < nthMax
			if (tmpFlag && nth >=0) { //每次移动中且滑动时不超过最大值 只执行一次
		//		this.getNews(name); // 获取新闻列表
		//		this.setData({ menu: tmp }); // 更新菜单

				moveType=1;
				return ;
			}
		}
		// 向右滑动
		if (touchMove - touchDot >= 40 && time < 10) {
			if (tmpFlag && nth >=0) {

				moveType = 2;
				// this.prepDateTap();
				return;
			//	this.getNews(name); // 获取新闻列表
			//	this.setData({ menu: tmp }); // 更新菜单
			}
		}
		// touchDot = touchMove; //每移动一次把上一次的点作为原点（好像没啥用）
	},
	// 触摸结束事件
	touchEnd: function (e) {
		if (moveType == 1 || moveType==2){
			if (moveType==2){
				console.log("向右滑动");
				wx.showToast({
					title: '向右滑动'
				})
			}
			else{
				console.log("向左滑动.");
				wx.showToast({
					title: '向左滑动'
				})
			}
			
		}
		clearInterval(interval); // 清除setInterval
		time = 0;
		moveType = 0;
		tmpFlag = true; // 回复滑动事件
	},
	connect_action: function () {
		console.log("ok....." + this.data.isConnect);
		if (this.data.isConnect == 0) {
			wx.navigateTo({
				url: 'connect_error',
			})
		}
		else {
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
	findDevice: function (val) {
		ble.findDevice(val);
	},
	disConnect: function () {
		wx.closeBLEConnection({
			deviceId: app.data.currDeviceId,
			success: function (res) {
				wx.showToast({
					title: '关闭蓝牙成功!',
				});
				console.log(res)
			},
			fail:function(res){
				wx.showToast({
					title: '关闭蓝牙失败!',
				});
			}
		});
		return ;
		ble.disConnect();
	},
	heartBeatTest: function () {
		console.log("heartBeat test...");
		if (isSync==true){
			wx.showToast({
				title: '设备正在连接过程中...'
			})
			return ;
		}
		if (this.data.isConnect == 0) {
			wx.showToast({
				title: '设备还未连接，请先连接设备！'
			})
			return;
		}
		hbField = null;
		hbArrayData = null; //测量心率原始数据
		bpMaxArrayData = null;//高血压
		bpMinArrayData = null; //低血压

		if (hb_times == 0) {
			hb_times = 120;
			ble.beginHeartBeatTest();
			this.setData({
				hb_last: "数据采集中..."
			});
			this.setData({
				bp_last: "数据采集中..."
			});
			wx.showToast({
				title: '开始测试心率...',
			});
		}
		else {
			hb_times = 0;
			wx.showToast({
				title: '停止测试心率...',
			});
			this.setData({
				hb_text: "测量心率",
				bp_text: "血压测试",
				bp_last: '',
				hb_last: ''
			});
			
			ble.endHeartBeatTest();

		}
	},
	bpTest: function () {
		console.log("heartBeat test...");
		if (isSync == true) {
			wx.showToast({
				title: '设备正在连接过程中...'
			})
			return;
		}
		if (this.data.isConnect == 0) {
			wx.showToast({
				title: '设备还未连接，请先连接设备！'
			})
			return;
		}
		hbField = null;
		hbArrayData = null; //测量心率原始数据
		bpMaxArrayData = null;//高血压
		bpMinArrayData = null; //低血压

		if (hb_times == 0) {
			hb_times = 120;
			ble.beginBpTest();
			this.setData({
				hb_last: "数据采集中..."
			});
			this.setData({
				bp_last: "数据采集中..."
			});
			wx.showToast({
				title: '开始测试心率...',
			});
		}
		else {
			hb_times = 0;
			wx.showToast({
				title: '停止测试心率...',
			});
			this.setData({
				hb_text: "测量心率",
				bp_text: "血压测试",
				bp_last: '',
				hb_last: ''
			});

			ble.endBpTest();

		}	
	},
	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
	//	this.reConnect();
		console.log("onPullDownRefresh.....");
	},
	onReachBottom:function(){
		console.log("--------onReachBottom--------");
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
	//	console.log("time=" + d);
		return parseInt(parseInt(d) / 1000);
	},
	saveConfig: function (key, val) {
		var config = wx.getStorageSync("config");
		config[key] = val;
		wx.setStorageSync("config", config);

		console.log("--------uploadConfig-----------");
		wx.request({
			url: util.getUrl('setting.php?action=save_all_setting'),
			data: {
				model: wx.getStorageSync("model"),
				mac: wx.getStorageSync("mac"),
				hw_version: wx.getStorageSync("hw_version"),
				sw_version: wx.getStorageSync("sw_version"),
				manufacturer: wx.getStorageSync("manufacturer"),
				power: wx.getStorageSync("power"),
				device_id: app.data.currDeviceId,
				uid: wx.getStorageSync('serverId'),
				config: util.objToBase64(wx.getStorageSync("config"))
			},
			method: 'POST',
			header: { 'content-type': 'application/x-www-form-urlencoded' },
			success: function (res) {
				console.log("save----", res);
			}
		}); 
		ble.saveAllConfig();
	},
	setConnectStatus:function(status){

		this.setData({
			isConnect:status,
			brand_icon: status == true ? '../../images/'+getApp().globalData.currDevice.icon:'../../images/disconnect.png'
		});
	},
	onTimer: function () {
		var that = this;
	//	this.drawSleepCanvas(null, null, null);
		if (getApp().globalData.needReconnect==1){
			getApp().globalData.needReconnect=0;
			getApp().globalData.indexPage.showHistoryData(util.getDateOffset(0, "yyyy-MM-dd"));
			var obj = wx.getStorageSync("curr_devices");
			console.log("-------------", obj);
			wx.setNavigationBarTitle({
				title: "HiSport (" + obj.brand + ")"
			})
			console.log("设置标题:" + "HiSport (" + obj.brand + ")");
			setTimeout(this.reConnect,1000);
		}


		if (ble.getConnectState() != that.data.isConnect) {
			console.log(ble.getConnectState() + "--------------set------------" + that.data.isConnect);
			this.setConnectStatus(ble.getConnectState());
		}
		if (hb_times > 0) {
			that.setData({
				hb_text: hb_times,
				bp_text: hb_times
			});
			if (hb_times == 1) {
				hb_times = 0;
				wx.showToast({
					title: '停止测试心率...',
				});
				this.setData({
					hb_text: "测量心率",
					bp_text: "血压测试"
				});
				ble.endHeartBeatTest();
				
				return ;
			}
			hb_times = hb_times - 1;
		}
	},
	showCurrStepInfo: function (step, time) {
		this.setData({
			step_total: step,
			step_ps: parseInt(step * 100 / this.data.step_dest),
			step_dist: util.calcOdo(step),
			step_cal: util.calcCalorie(step),
			step_time: util.toHourMinute(time)
		});
	},

	//显示动态心率
	showDynHbBp: function (hb, maxBp, minBp) {
		if (hbField == null) {
			hbField = new Array();
			for (var n = 0; n < 30; n++) {
				hbField.push(n);
			}
			hbArrayData = new Array();
			bpMaxArrayData = new Array();
			bpMinArrayData = new Array();
		}


		if (hbArrayData.length > 30)
			hbArrayData.shift();
		hbArrayData.push(hb);
		if (bpMaxArrayData.length > 30)
			bpMaxArrayData.shift();
		bpMaxArrayData.push(maxBp);
		if (bpMinArrayData.length > 30)
			bpMinArrayData.shift();
		bpMinArrayData.push(minBp);
		if (minBp==-1){
			this.setData({
				hb_last: hb,
				hb_max: util.max(hbArrayData),
				hb_avg: util.avg(hbArrayData),
				hb_min: util.min(hbArrayData),

			});
		}
		else{
			this.setData({
				hb_last: hb,
				bp_last: maxBp + "/" + minBp,
				hb_max: util.max(hbArrayData),
				hb_avg: util.avg(hbArrayData),
				hb_min: util.min(hbArrayData),
				bp_max: util.max(bpMaxArrayData) + "/" + util.max(bpMinArrayData),
				bp_avg: util.max(bpMaxArrayData) + "/" + util.max(bpMinArrayData),
				bp_min: util.min(bpMaxArrayData) + "/" + util.min(bpMinArrayData)
			});
		}

		if (hb!=-1){
			console.log(" main index===hb" + hb + " maxBp=" + maxBp + " minBp=" + minBp);
			new Charts({
				canvasId: 'heartrateCanvas',
				type: 'line',
				categories: hbField,
				series: [{
					name: '时间段心率详细情况',
					data: hbArrayData
				}],
				yAxis: {
					format: function (val) {
						return val + 'bpm';
					}
				},
				width: canvasWidth,
				height: 200,
				dataLabel: false
			});
		}
		if (minBp != -1) {
			new Charts({
				canvasId: 'bpCanvas',
				type: 'line',
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
				width: canvasWidth,
				height: 200,
				dataLabel: false
			});
		}
		return;
	},
	showHistoryData: function (pDate) {
		//show step data....
	
		var stepData = getApp().getDeviceHisData(pDate, "step");
		var sleepData = getApp().getDeviceHisData(pDate, "sleep");
		var hb = getApp().getDeviceHisData(pDate, "hb");
		var bp = getApp().getDeviceHisData(pDate, "bp");

		console.log("===============================================" + isSync);
		isSync = false;
		wx.hideNavigationBarLoading();

		console.log("============开始画图============================");
		console.log("===============================================" + isSync);
		console.log("所有数据:", wx.getStorageSync(getApp().data.currDeviceId));
		console.log(pDate+"---显示历史----", stepData, sleepData,hb,bp);
		console.log(pDate + "---当前设备----", getApp().globalData.currDevice);

		if (stepData == null || stepData.hasOwnProperty("step") == false) {
			this.showCurrStepInfo(0);
			this.drawStepCanvas(24, new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
		}
		else {
			this.showCurrStepInfo(stepData.step, stepData.hasOwnProperty("time") ? stepData.time : 0);
			if (stepData.hasOwnProperty("detail")){
				this.drawStepCanvas(stepData.type,stepData.detail);
			}
				
		}

		if (sleepData == null || sleepData=="") {
			console.log("睡眠是0");
			this.drawSleepCanvas(null,null,null);
			this.setData({
				sleep_total: 0,
				good_sleep_time: 0,
				bad_sleep_time: 0,
				sober_sleep_time: 0
			});
		}
		else {
			console.log("睡眠是有志");
			
			if (getApp().globalData.currDevice.brand=="Koomii"){
				var sleepCol=[];
				//var sleepData = sleepData.detail;
				for(var n3=0;n3<24;n3++){
					if (n3%2==0){
						sleepCol.push(n3/2+":00");
					}
					else{
						sleepCol.push("");
					}
				}
			
				this.setData({
					sleep_width: 360,
					sleep_total: util.toHourMinute(parseInt((sleepData.endTime - sleepData.startTime)/60)),
					good_sleep_time: util.toHourMinute(parseInt(sleepData.deep)),
					bad_sleep_time: util.toHourMinute(sleepData.restless),
					sober_sleep_time: util.toHourMinute(sleepData.runMin)
				});
				new Charts({
						canvasId: 'sleepCanvas',
						//type: 'column',
						type: 'line',
						categories: sleepCol,
						series: [{
							name: '翻身数量统计',
							data: sleepData.detail
						}],
						yAxis: {
							format: function (val) {
								return val + '次';
							}
						},
						width: canvasWidth,
						height: 200,
						dataLabel: false
				});

			}
			else{
				/*item.runMin = dataViewStep.getUint16(n * 64 + 8, true);
				item.restless = dataViewStep.getUint16(n * 64 + 10, true);
				item.deep = (item.endTime - item.startTime) / 60 - item.runMin - item.restless;*/
				this.setData({
					sleep_total: util.toHourMinute(sleepData.sleep),
					good_sleep_time: util.toHourMinute(sleepData.deep),
					bad_sleep_time: util.toHourMinute(sleepData.shallow),
					sober_sleep_time: util.toHourMinute(0)
				});
				var sleepCol = new Array();
				var sleepVal = new Array();
				var sleepStauts = new Array();
				var prevDay = util.getPrevDate(pDate,-1);
				var prevSleep = getApp().getDeviceHisData(prevDay,"sleep");
				if (prevSleep!=null && prevSleep!=''){
					for (var n = 0; n < prevSleep.detail.length; n++) {
						var str = "" + prevSleep.detail[n];
						var f = str.split(',');
						if (f[0] < 60 * 21)
							continue;
						sleepCol.push(f[0]);
						console.log("前一天睡眠时间段:" + util.toHourMinute(f[0]));
						sleepVal.push(f[1]);
						sleepStauts.push(f[2]);
					}		
				}
				console.log("prevDay=====" + prevDay);
				for (var n = 0; n < sleepData.detail.length; n++) {
					var str = "" + sleepData.detail[n];
					var f = str.split(',');
					if (f[0]>60*8)
						continue;
					sleepCol.push(f[0]);
					console.log("睡眠时间段:" + util.toHourMinute(f[0]));
					sleepVal.push(f[1]);
					sleepStauts.push(f[2]);
				}
				this.drawSleepCanvas(sleepCol, sleepVal, sleepStauts);
			}

		}

	
		if (hb!=null){

			var col=[];
			var data=[];
			var arr=hb.detail.split(";");
			for(var n=0;n<arr.length;n++){
				var f=arr[n].split(":");
				col.push(util.toHourMinute(f[0]));
				data.push(f[1]);
			}
			this.drawHistoryHeartRateCanvas(col,data);
		}

		if (bp != null) {

			var col = [];
			var high = [];
			var low = [];

			var arr = bp.detail.split(";");
			for (var n = 0; n < arr.length; n++) {
				var f = arr[n].split(":");
				if (f.length==2){
					col.push("");
					high.push(f[0]);
					low.push(f[1]);
				}
				else{
					col.push(util.toHourMinute(f[0]));
					high.push(f[1]);
					low.push(f[2]);
				}
			}
			this.drawBpCanvas(col, high,low);
		}

	
	},
	prepDateTap: function () {
		var pDate = util.getPrevDate(this.data.currDateShow, -1);
		this.setData({
			currDateShow: pDate,
			currWeekShow: util.getWeekName(pDate)
		});
		this.showHistoryData(pDate);

		console.log("begin-----date....", wx.getStorageSync("step-" + pDate));
	},
	nextDateTap: function () {
		if (util.getDateOffset(0, "yyyy-MM-dd") == this.data.currDateShow) {
			wx.showToast({
				title: '已经最后一天',
			})
			return;
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
	drawBpCanvas: function (col,high,low) {
		//return ;
		if (col==null || col.length==0){
			console.log("血压历史数据为0");
			col=new Array();
			col.push("-");
			high = new Array();
			high.push(0);
			low = new Array();
			low.push(0);

		}
		else{
			var maxBp = high[high.length - 1];
			var minBp = low[low.length - 1];

			this.setData({
				bp_last: maxBp + "/" + minBp,
				bp_max: util.max(high) + "/" + util.max(low),
				bp_avg: util.max(high) + "/" + util.max(low),
				bp_min: util.min(high) + "/" + util.min(low)
			});
		}

		new Charts({
			canvasId: 'bpCanvas',
			type: 'line',
			categories: col,
			series: [{
				name: '高压(收缩压)',
				data: high
			}, {
				name: '低压(舒张压)',
				data: low
			}],
			yAxis: {
				format: function (val) {
					return val + 'mmHg';
				}
			},
			width: canvasWidth,
			height: 200,
			dataLabel: false
		});
		return;
	},
	drawHistoryHeartRateCanvas: function (col,hist) {
		var last=0;
		if (col==null ||hist==null)
		return ;
		if (hist.length>0){
			last=hist[hist.length-1];
		}
		this.setData({
			hb_last: last,
			hb_max: util.max(hist),
			hb_avg: util.avg(hist),
			hb_min: util.min(hist)
		});
	

		new Charts({
			canvasId: 'heartrateCanvas',
			type: 'line',
			categories: col,
			series: [{
				name: '历史心率',
				data: hist
			}],
			yAxis: {
				format: function (val) {
					return val + 'bpm';
				}
			},
			width: canvasWidth,
			height: 200,
			dataLabel: false
		});
		return;
	},
	drawHeartRateCanvas: function () {
		new Charts({
			canvasId: 'heartrateCanvas',
			type: 'line',
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
			width: canvasWidth,
			height: 200,
			dataLabel: false
		});
		return;
	},
	drawStepCanvas: function (otype,stepData) {

		if (stepImage != null) {
			console.log("步数初始化....设置数据.", stepData);
			stepImage.updateData(stepData);
		}
		else {
			var timeCol;
			if (otype==24){
				timeCol = ['0:00', '', '', '',
					'4:00', '', '', '',
					'8:00', '', '', '',
					'12:00', '', '', '',
					'16:00', '', '', '',
					'20:00', '', '', ''];
			}
			else{
				timeCol = ['0:00', '', '', '', '2:00', '', '','',
					'4:00', '', '', '', '6:00', '', '', '', 
					'8:00', '', '', '', '10:00', '', '', '', 
					'12:00', '', '', '', '14:00', '', '', '', 
					'16:00', '', '', '', '18:00', '', '', '', 
					'20:00', '', '', '', '22:00', '', '', ''];
				if (stepData.length!=48){
					var need = 48 - stepData.length;
					for (var n = 0; n <need ;n++){
						stepData.push(0);
					}
				}
				console.log("timeCol=" + timeCol.length+" step="+stepData.length);
			}
			new Charts({
				canvasId: 'setpCanvas',
				//type: 'column',
				type: 'line',
				categories: timeCol,
				series: [{
					name: '时间段步数详细信息',
					data: stepData
				}],
				yAxis: {
					format: function (val) {
						return val + '步';
					}
				},
				width: canvasWidth,
				height: 200,

				dataLabel: false
			});
		}
		return;
	},
	drawSleepCanvas: function (sleepCol, sleepData,sleepStatus) {
		this.setData({
			sleep_width:200
		});
		const ctx = wx.createCanvasContext('sleepCanvas');
		console.log("睡眠数据:sleepCol", sleepCol, sleepData, sleepStatus);

		var height = 200;
		var width = 200;
		// 设置文字对应的半径
		var R = width / 2 - 60;
		// 把原点的位置移动到屏幕中间，及宽的一半，高的一半
		ctx.translate(width / 2, height / 2);
		// 设置线条的粗细，单位px
		ctx.setLineWidth(16);
		// 开始路径
		ctx.beginPath();

		ctx.setStrokeStyle('#f6f8f8');
		ctx.arc(0, 0, width / 2 - 35, 0, 2 * Math.PI, false);
		ctx.stroke();
	

		// 运动一个圆的路径
		// arc(x,y,半径,起始位置，结束位置，false为顺时针运动)
		if (sleepCol != null && sleepCol.length>0){
			for (var n = 0; n < sleepCol.length; n++) {
				var h = 10;
				ctx.save();
				ctx.beginPath();

				if (sleepStatus[n]==0)
					ctx.setStrokeStyle('#34A2FB');//深睡
				else
					ctx.setStrokeStyle('#63BEFD'); //潜睡
				var offset = 0;
				
				if (sleepCol[n]<180)
					offset = ((Math.PI * 2) * (parseInt(sleepCol[n]) +540)) / 720;
				else
					offset = (Math.PI * 2) * (parseInt(sleepCol[n]) - 180) / 720;

			//	console.log(util.sprintf("循环: col=%d time=%s dur=%d status=%d offset=%s Math.PI=%s", sleepCol[n], util.toHourMinute(sleepCol[n]), sleepData[n], sleepStatus[n], offset, Math.PI));
				ctx.arc(0, 0, width / 2 - 35, offset, offset + (2 * Math.PI)*sleepData[n]/ 720, false);
				ctx.stroke();
			}
		}
		ctx.setStrokeStyle('black');
		ctx.setFontSize(14);
		// 圆的起始位置是从3开始的，所以我们从3开始填充数字
		var hours = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];
		hours.forEach(function (hour, i) {
			var rad = (2 * Math.PI / 12) * i;
			var x = R * Math.cos(rad);
			var y = R * Math.sin(rad);
			// 因为微信小程序不支持BaseLine这个属性，所以这里我们只能自己手动调整位置
			if (hour == 12) {
				ctx.fillText(hour, x - 11, y + 6);
			} else if (hour == 6) {
				ctx.fillText(hour, x - 5, y + 6);
			} else {
				ctx.fillText(hour, x - 6, y + 6);
			}
		})

		for (let i = 0; i < 60; i++) {
			var rad = 2 * Math.PI / 60 * i;
			var x = (R + 15) * Math.cos(rad);
			var y = (R + 15) * Math.sin(rad);
			ctx.beginPath();
			// 每5个点一个比较大
			if (i % 5 == 0) {
				ctx.arc(x, y, 2, 0, 2 * Math.PI, false);
			} else {
				ctx.arc(x, y, 1, 0, 2 * Math.PI, false);
			}
			ctx.setFillStyle('black');
			ctx.fill();
		}
		ctx.closePath();
		var now = new Date();
		var hour = now.getHours();
		var minute = now.getMinutes();
		var second = now.getSeconds();
		// 保存画之前的状态
		ctx.save();
		ctx.beginPath();
		// 根据小时数确定大的偏移
		var rad = 2 * Math.PI / 12 * hour;
		// 根据分钟数确定小的偏移
		var mrad = 2 * Math.PI / 12 / 60 * minute;
		// 做旋转
		ctx.rotate(rad + mrad);
		ctx.setLineWidth(8);
		// 设置线条结束样式为圆
		ctx.setLineCap('round');
		// 时针向后延伸8个px；
		ctx.moveTo(0, 8);
		// 一开始的位置指向12点的方向，长度为R/2
		ctx.lineTo(0, -R / 2);
		ctx.stroke();
		ctx.closePath();
		// 返回画之前的状态
		ctx.restore();
		ctx.save();
		ctx.beginPath();
		// 根据分钟数确定大的偏移
		var rad = 2 * Math.PI / 60 * minute;
		// 根据秒数确定小的偏移
		var mrad = 2 * Math.PI / 60 / 60 * second;
		ctx.rotate(rad + mrad);
		// 分针比时针细
		ctx.setLineWidth(6);
		ctx.setLineCap('round');
		ctx.moveTo(0, 10);
		// 一开始的位置指向12点的方向，长度为3 * R / 4
		ctx.lineTo(0, -3 * R / 4);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
		//var second = 40;
		ctx.save();

		//画秒针
		var msecond = 0;
		ctx.save();
		ctx.beginPath();
		// 根据秒数确定大的偏移
		var rad = 2 * Math.PI / 60 * second;
		// 1000ms=1s所以这里多除个1000
		var mrad = 2 * Math.PI / 60 / 1000 * msecond;
		ctx.rotate(rad + mrad);
		ctx.setLineWidth(4);
		// 设置线条颜色为红色，默认为黑色
		ctx.setStrokeStyle('red');
		ctx.setLineCap('round');
		ctx.moveTo(0, 12);
		ctx.lineTo(0, -R);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
		//画中间灰色的圆圈
		ctx.beginPath();
		ctx.arc(0, 0, 8, 0, 2 * Math.PI, false);
		ctx.setFillStyle('lightgrey');
		ctx.fill();
		ctx.closePath();


		ctx.draw();
		return;

	},

	topLoad:function(e){
		console.log("let upper...");
	},
	bindDownLoad:function(e){
		console.log("let lower...");
	},
	reConnect: function () {

/*
		wx.navigateTo({
			url: 'test?uid=' + wx.getStorageSync('serverId')
		})
		return ;
		*/


		if (app.data.currDeviceId.length > 0){
			wx.showToast({
				title: '开始连接设备',
			});

			console.log("------------开始同步----------"+isSync);
			if (isSync == true) {
				wx.showToast({
					title: '同步中',
					duration: 1000
				})
				return ;
			}
			if (isSync == false) {
				isSync = true;
			}

			wx.showNavigationBarLoading();
			wx.showLoading({
				title: '正在连接设备',
			})
			console.log("currDeviceId====.." + app.data.currDeviceId);
			ble.init(0);
			ble.run(app.data.currDeviceId);
		}
		else {
			wx.navigateTo({
				url: '../my/ble_connect',
			})
			return ;
			wx.showToast({
				title: '还没有绑定设备!请先绑定设备...',
			})
		}
	},
	drawTitle:function (){
		const ctx = wx.createCanvasContext('titleCanvas');

		ctx.setFillStyle('red');
		
		ctx.fillRect(0, 0, wx.getSystemInfoSync().screenWidth, 60);
		ctx.draw();
		return ;
		ctx.setLineWidth(16);
		// 开始路径
		//ctx.beginPath();


		ctx.setStrokeStyle('#f00');
		ctx.rect(0, 0, 200, 40);
		ctx.stroke();
		//ctx.closePath();
		ctx.draw();
	},
	onLoad: function (opt) {
		console.log('index ...onLoad...',opt);
		if (getApp().data.isHalt) {
			console.log('onLoad halt');
			return;
		}

	//	this.setData({
		//	scrollHeight: wx.getSystemInfoSync().windowHeight
	//	});

		//this.drawTitle();
		var obj = wx.getStorageSync("curr_devices");
		console.log("-------init------",obj);
		if (obj==null || obj==''){
			wx.setNavigationBarTitle({
				title: "HiSport(未绑定设备)",
			})		
		}
		else{
			wx.setNavigationBarTitle({
				title: "HiSport (" + obj.brand + ")",
			})
			getApp().globalData.currDevice = obj;
			getApp().setDeviceId(obj.device_id);
		}

		getApp().get_open_id();

		var that = this;
		var now = new Date();
		var pDate = util.sprintf("%d-%02d-%02d", now.getFullYear(), now.getMonth() + 1, now.getDate());
		//var currDevice
		that.setData({
			step_dest: wx.getStorageSync('dest'),
			currDateShow: pDate,
			//brand_icon: getApp().globalData.currDevice.icon,
			currWeekShow: util.getWeekName(pDate)
		});
		getApp().globalData.indexPage = this;


		if (debug_ui == false) {
			console.log("currDeviceId" + app.data.currDeviceId);
			if (app.data.currDeviceId != '' && app.data.currDeviceId.length > 0) {
				ble.init(0);
				ble.run(app.data.currDeviceId);
			}
			setInterval(this.onTimer, 1000);
		}

		this.drawSleepCanvas(null, null, null);
		
		this.drawStepCanvas(24,new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
		
		this.drawHeartRateCanvas();
		this.drawBpCanvas(null,null,null);
		

		this.showHistoryData(util.getDateOffset(0, "yyyy-MM-dd"));

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
	}
})
