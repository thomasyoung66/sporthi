// pages/my/ble_connect.js
var util = require('../../utils/util.js');
var app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {

		devices: null,
		deviceconnected:false

	},

	onLoad: function (options) {
		var app = getApp();
		console.log("my---------", app.data.allDevice);
		this.setData({
			devices: app.data.allDevice
		});
	},
	activeDevice:function (e){
		var that=this;
		wx.showModal({
			title: '系统提问',
			content: '是否将当前设备设置为选中状态?',
			confirmText: "是",
			cancelText: "否",
			success: function (res) {
				wx.request({
					url: util.getUrl('ble.php?action=active_device'),
					data: {
						uid: wx.getStorageSync('serverId'),
						deviceId: e.target.id
					},
					method: 'POST',
					header: { 'content-type': 'application/x-www-form-urlencoded' },
					success: function (res) {
						console.log("save----", res);
						wx.closeBLEConnection({
							deviceId: app.data.currDeviceId,
							success: function (res) {
								console.log("关闭蓝牙:",res);
							}
						});
						getApp().setAllDevice(res.data.devices);
						that.setData({
							devices: app.data.allDevice
						});


						/*
						wx.closeBLEConnection({
							success: function (res) {
								console.log(res)
							}
						})*/
						getApp().globalData.needReconnect = 1;
						getApp().globalData.backToIndex=1;
						wx.navigateBack();
					}
				});
			}
		});

	},
	unBindDevice:function(e){
		var that = this;
		wx.showModal({
			title: '系统提问',
			content: '是否删除当前设备?',
			confirmText: "是",
			cancelText: "否",
			success: function (res) {
				wx.request({
					url: util.getUrl('ble.php?action=delete_device'),
					data: {
						uid: wx.getStorageSync('serverId'),
						deviceId: e.target.id
					},
					method: 'POST',
					header: { 'content-type': 'application/x-www-form-urlencoded' },
					success: function (res) {
						console.log("save---", res);
						//
						wx.removeStorageSync(e.target.id);
						getApp().setAllDevice(res.data.devices);
						that.setData({
							devices: app.data.allDevice
						});
						getApp().globalData.backToIndex = 1;
						wx.navigateBack();
					}
				});
			}
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},
	unBind:function(){
		console.log("this is ok.....................");
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		wx.setNavigationBarTitle({
			title: '我的设备列表',
		})
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