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
		height:170,
		weight:70,
		heightArray: [],
		weightArray: [],
		heightIndex:0,
		weightIndex:0,
		phone:"",
		items: [
			{ "id": 1, "name": "身高", "keywords": "连接设备", "img": "../../images/band.png" },
			{ "id": 2, "name": "体重", "keywords": "", "img": "../../images/user.png" },
			{ "id": 3, "name": "电话号码", "keywords":"身高/体重等", "img": "../../images/setting_blue.png" },

		]
	},
	bindHeightPickerChange: function (e) {
		var that=this;

		wx.showLoading({
			title: '正在保存数据...',
		});
		this.setData({
			height: that.data.heightArray[e.detail.value]
		});
		wx.setStorageSync("height", that.data.heightArray[e.detail.value]);
		wx.request({
			url: util.getUrl('ble.php?action=save_height'),
			data: {
				height: that.data.heightArray[e.detail.value],
				uid: wx.getStorageSync('serverId')
			},
			method: 'POST',
			header: { 'content-type': 'application/x-www-form-urlencoded' },
			success: function (res) {
				wx.hideLoading();
			}
		});
	},
	findHeightIndex:function(v){
		for(var n=0;n<this.data.heightArray.length;n++){
			if (this.data.heightArray[n]==v){
				return n;
			}
		}
		return 0;
	},
	findWeightIndex: function (v) {
		for (var n = 0; n < this.data.weightArray.length; n++) {
			if (this.data.weightArray[n] == v) {
				return n;
			}
		}
		return 0;
	},
	bindWeightPickerChange:function(e){
		var that = this;

		wx.showLoading({
			title: '正在保存数据...',
		});
		wx.setStorageSync("weight", that.data.weightArray[e.detail.value]);
		this.setData({
			weight: that.data.weightArray[e.detail.value]
		});
		wx.request({
			url: util.getUrl('ble.php?action=save_weight'),
			data: {
				weight: that.data.weightArray[e.detail.value],
				uid: wx.getStorageSync('serverId')
			},
			method: 'POST',
			header: { 'content-type': 'application/x-www-form-urlencoded' },
			success: function (res) {
				wx.hideLoading();
			}
		});
	},
	bindPhoneInput:function (e){
		if (e.detail.value.length<11){

			console.log("e.detail.value=====" + e.detail.value);
			return ;
		}
		wx.showLoading({
			title: '正在保存数据...',
		});
		wx.request({
			url: util.getUrl('ble.php?action=save_phone'),
			data: {
				phone: e.detail.value,
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
		return ;
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
		console.log("this is ok.." + event.currentTarget.dataset.id);
	},
	//事件处理函数
	bindViewTap: function () {
		wx.navigateTo({
			url: '../logs/logs'
		})
	},
	onLoad: function () {
		console.log('onLoad')
		var that=this;
		var ha=new Array();
		var wa = new Array();

		for(var n=50;n<250;n++){
			ha.push(n);
		}
		for (var n = 30; n < 250; n++) {
			wa.push(n);
		}
		this.setData({
			height:wx.getStorageSync("height"),
			weight: wx.getStorageSync("weight"),
			phone: wx.getStorageSync("phone"),
			heightArray:ha,
			weightArray:wa
		})
		this.setData({
			heightIndex: that.findHeightIndex(wx.getStorageSync("height")),
			weightIndex: that.findWeightIndex(wx.getStorageSync("weight"))
		})
	}
})
