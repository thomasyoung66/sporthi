
var util = require('../../utils/util.js');
var Charts = require('../../utils/wxcharts.js');
Page({

	data: {

	},
	showData:function(data){
		var f=new Array();
		var d=new Array();
		for(var n=0;n<data.length;n++){
			f.push(data[n].sport_date.substr(5));
			d.push(data[n].total_step);
		}
		f.reverse();
		d.reverse();
		new Charts({
			canvasId: 'setpCanvas',
			//type: 'column',
			type: 'line',
			categories:f,
			series: [{
				name: '最近一个月运动历史记录',
				data: d
			}],
			yAxis: {
				format: function (val) {
					return val + '步';
				}
			},
			width: 400,
			height: 240,
			dataLabel: false
		});
	},
	onLoad: function (options) {
		console.log("参数...", options);
		var that=this;
		console.log("run onLoad...." + options.uid);
		wx.setNavigationBarTitle({
			title: options.name + ' 历史运动数据'
		});

		wx.showLoading({
			title: '正在请求数据...'
		});
		wx.request({
			url: util.getUrl('ble.php?action=query_history'),
			data: {
				uid: options.uid
			},
			method: 'POST',
			header: { 'content-type': 'application/x-www-form-urlencoded' },
			success: function (res) {
				console.log("save----", res.data);
				that.showData(res.data.items);
				wx.hideLoading();

			}
		});
	},

	onReady: function () {
		console.log("run onLoad....");
	},

	onShow: function (opt) {
		var that = this;
		console.log("run  onShow....");
	},

	onHide: function () {

	},

	onUnload: function () {
		console.log("run  unloadShow....");
	},

	onPullDownRefresh: function () {

	},


	onReachBottom: function () {

	},
	onShareAppMessage: function () {

	}
})