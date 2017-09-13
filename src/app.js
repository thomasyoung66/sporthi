//app.js
var util = require('utils/util.js')

App({
	data:{
		currDeviceId:"", //当前设备
		allDevice:{}
	
	},
	globalData:{
		indexPage: null,
		uid:null
	},
	getTimeDiff: function () {
		var begin = new Date().getTime();
		var end = new Date("1970/01/01 00:00:00").getTime();
		var d = begin - end;
		console.log("time=" + d);
		return parseInt(parseInt(d) / 1000);
	},
	getDataFrom1900: function(sec)
	{
		var d= new Date((new Date("1970/01/01 00:00:00").getTime() + sec * 1000));
		return d.getFullYear()+"-"+(d.getMonth() + 1)+"-"+ d.getDate();

		//.Format("yyyy-MM-dd hh:mm:ss");
	},
	myTest:function (){
		var di = this.getTimeDiff();
		console.log("diff="+di);
		console.log(util.getDateOffset(-3,"yyyy-MM-dd"));
		return ;
		var s="1234";
		var a=s.split(";");
		for(var n=0;n<a.length;n++){
			console.log("---------"+a[n]);
		}
	},
	onLaunch: function () {
		//调用API从本地缓存中获取数据
		var logs = wx.getStorageSync('logs') || []
		
		//logs.unshift(Date.now())
		wx.setStorageSync('logs', logs)
		this.get_open_id();
		// this.getUserInfo(null);
		this.myTest();

	},
	save_userinfo_server: function () {
		// user
		 var that=this;

		console.log("data===" + util.objToBase64(wx.getStorageSync("user")));
		console.log("data===" + util.objToBase64(wx.getStorageSync("userInfo")));
		wx.request({
			url: util.getUrl('wx/login.php?action=save_userinfo'),
			data: {
				user: util.objToBase64(wx.getStorageSync("user")),
				userInfo: util.objToBase64(wx.getStorageSync("userInfo"))

			},
			method: 'POST',
			header: { 'content-type': 'application/x-www-form-urlencoded' },
			success: function (res) {
				console.log("save----", res);
				//global data....
				wx.setStorageSync('serverId', res.data.id);
				
				wx.setStorageSync('match_rule', res.data.match_rule);
				wx.setStorageSync('devices', res.data.devices);
				that.data.allDevice = res.data.devices;
				for(var n=0;n<res.data.devices.length;n++){
					console.log("loop...." + res.data.devices[n]);
					
					if (res.data.devices[n].select==1){
						that.data.currDeviceId = res.data.devices[n].deviceId;
					}
				}
			}
		});
	},
	get_open_id: function () {
		var that = this
		var user = wx.getStorageSync('user') || {};
		var userInfo = wx.getStorageSync('userInfo') || {};
		if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) && (!userInfo.nickName)) {
			wx.login({
				success: function (res) {
					if (res.code) {
						wx.getUserInfo({
							success: function (res) {
								var objz = {};
								objz.avatarUrl = res.userInfo.avatarUrl;
								//  objz.nickName = res.userInfo.nickName;
								console.log(res);
								wx.setStorageSync('userInfo', res.userInfo);//存储userInfo  
							}
						});
						var d = that.globalData;//这里存储了appid、secret、token串    
						console.log("res.code =" + res.code);

						wx.request({
							url: util.getUrl('wx/login.php?action=get_open_id&code=') + res.code + '&grant_type=authorization_code',
							data: {},
							method: 'GET',
							success: function (res) {
								console.log("kkkkkk----", res);
								var obj = {};
								obj.openid = res.data.openid;
								obj.expires_in = Date.now() + res.data.expires_in;
								//console.log(obj);  
								wx.setStorageSync('user', obj);//存储openid
								that.save_userinfo_server();
							}
						});
					} else {
						console.log('获取用户登录态失败！' + res.errMsg)
					}
				}
			});
		} else {
			that.save_userinfo_server();
			console.log("====================end===========================");
		}
	},
	getUserInfo: function (cb) {
		var that = this;

		if (this.globalData.userInfo) {
			typeof cb == "function" && cb(this.globalData.userInfo)
		} else {
			//调用登录接口
			wx.getUserInfo({
				withCredentials: false,
				success: function (res) {
					//  wx.setStorageSync('userInfo', objz);
					that.globalData.userInfo = res.userInfo
					typeof cb == "function" && cb(that.globalData.userInfo)
				}
			})
		}
	},

	globalData: {
		userInfo: null
	}
})
