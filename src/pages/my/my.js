//index.js
//获取应用实例
var util = require('../../utils/util.js');
var app = getApp()
var device_num=1;
Page({
	data: {
		motto: '我的',
		userInfo: {},
		currUtil:"公制",
		currDest:7000,
		utilArray:[
			"公制", 
			"英制"
		],
		destArray: [
			"1000",
			"2000",
			"3000",
			"4000",
			"5000",
			"6000",
			"7000",
			"8000",
			"9000",
			"10000",
			"11000",
			"12000",
			"13000",
			"14000",
			"15000",
			"16000",
			"17000",
			"18000",
			"19000",
			"21000",
			"22000",
			"23000",
			"24000",
			"25000",
			"26000",
			"27000",
			"28000",
			"29000",
			"30000",
			"31000",
			"32000",
			"33000",
			"34000",
			"35000",
			"36000",
			"37000",
			"38000",
			"39000",
			"50000",
			"60000",
			"70000",
			"83000",
			"90000",
			"100000"
		],
		items: [
			{ "id": 1, "name": "连接设备", "keywords": "连接设备", "img": "../../images/band.png" },
			{ "id": 2, "name": "我的设备", "keywords": device_num+"个设备", "img": "../../images/user1.png" },
			{ "id": 3, "name": "个人信息", "keywords":"身高/体重等", "img": "../../images/setting_blue.png" },
			
			{ "id": 4, "name": "我的排名", "keywords": "无", "img": "../../images/rank.png" },
			{ "id": 5, "name": "运动目标", "keywords": "7000", "img": "../../images/target_big.png" },
			{ "id": 6, "name": "计量单位", "keywords": "公制", "img": "../../images/unit.png" },
			{ "id": 7, "name": "关于", "keywords": "", "img": "../../images/about_blue.png" }

		]
	},
	bindUtilPickerChange: function (e) {
		var that=this;
		this.setData({
			currUtil: that.data.utilArray[e.detail.value]
		});
		wx.showLoading({
			title: '正在保存数据...',
		});
		wx.request({
			url: util.getUrl('ble.php?action=save_util'),
			data: {
				util:e.detail.value,
				uid: wx.getStorageSync('serverId')
			},
			method: 'POST',
			header: { 'content-type': 'application/x-www-form-urlencoded' },
			success: function (res) {
				wx.hideLoading();
			}
		});
	},
	bindDestPickerChange:function(e){
		var that = this;
		this.setData({
			currDest: that.data.destArray[e.detail.value]
		});
		wx.showLoading({
			title: '正在保存数据...',
		});

		getApp().globalData.indexPage.setData({
			step_dest: that.data.destArray[e.detail.value]
		});
		wx.request({
			url: util.getUrl('ble.php?action=save_dest'),
			data: {
				dest: that.data.destArray[e.detail.value],
				uid: wx.getStorageSync('serverId')
			},
			method: 'POST',
			header: { 'content-type': 'application/x-www-form-urlencoded' },
			success: function (res) {
				wx.hideLoading();
			}
		});
	},
	showDetail: function (event) {
		//  util.dump_obj(data.target);
		if (event.currentTarget.dataset.id == 0) {
			wx.navigateTo({
				url: 'ble_connect',
			})
		}
		else if (event.currentTarget.dataset.id == 1) {
			wx.navigateTo({
				url: 'my_device',
			})
		}
		else if (event.currentTarget.dataset.id == 2) {
			wx.navigateTo({
				url: 'person',
			})
		}
		console.log("this is ok.." + event.currentTarget.dataset.id);
	},
	//事件处理函数
	bindViewTap: function () {
		wx.navigateTo({
			url: '../logs/logs'
		})
	},
  onShow:function(){
    wx.setNavigationBarTitle({
      title: '我的',
    })
  },
	onLoad: function () {
		console.log('onLoad')
		device_num=app.data.allDevice.length;
		var that = this
		//调用应用实例的方法获取全局数据
		app.getUserInfo(function (userInfo) {
			//更新数据
			that.setData({
				userInfo: userInfo
			})
		})
	}
})
