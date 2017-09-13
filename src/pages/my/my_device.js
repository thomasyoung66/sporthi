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