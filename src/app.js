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
    console.log("我的..." + util.getBit(2, 1) + "--" + util.getBit(2,0));
    var a = util.setBit(0,1);
    a = util.setBit(a, 0);
    console.log("aaaa==="+a);
	//	return ;
		var s=[1,2,3,4,5,6];
    for(var n=0;n<s.length;n++){
      //console.log("loop----"+s[n]);
    }

	},
  initData:function(){
    var obj=wx.getStorageSync("config");
    console.log("config-----",obj);
    if (obj == null || obj.hasOwnProperty("notice_onoff")==false){
        var config=new Object();
        config.notice_onoff=1;
        config.notice_time = "9:00~23:00";
        config.notice_phone = 1;
        config.notice_msg = 1;
        config.notcie_wx = 1;
        config.notice_qq = 1;
        config.notice_facebook = 1;
        config.notice_twitter = 1;
        config.notice_whatsapp = 1;
        wx.setStorageSync("config", config);
    }
    if (obj.hasOwnProperty("alarm1")==false){
      var config = wx.getStorageSync("config");
      config.alarm1=0;
      config.alarm2=0;
      config.alarm3=0;
      config.alarm1time = "6:00";
      config.alarm2time = "12:00";
      config.alarm3time = "22:30";
      config.alarm1week= "";
      config.alarm2week = "";
      config.alarm3week = "";

      wx.setStorageSync("config", config);
    }
  },
	onLaunch: function () {
		//调用API从本地缓存中获取数据
		var logs = wx.getStorageSync('logs') || []
		
		//logs.unshift(Date.now())
		wx.setStorageSync('logs', logs)
		wx.showToast({
			title: 'app start...'
		});
		//this.get_open_id();
		// this.getUserInfo(null);
    this.initData();
		this.myTest();
    var str = "9:00~12:00";
    var arr=str.split(/:|~/);
    //console.log("------"+str.split("\:\~"));
    for(var n=0;n<arr.length;n++){
      console.log("array-----"+arr[n]);
    }

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
				wx.setStorageSync('dest', res.data.dest);
				wx.setStorageSync('util', res.data.util);
				wx.setStorageSync('height', res.data.height);
				wx.setStorageSync('weight', res.data.weight);
				wx.setStorageSync('phone', res.data.phone);

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
		console.log("get_open_id====begin....");
		if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 1)) && (!userInfo.nickName)) {
			console.log("get_open_id====begin....login");
			wx.login({
				success: function (res) {
					console.log("get_open_id====begin....login...succeed!",res);
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
						//console.log("res.code =" + res.code);

						wx.request({
							url: util.getUrl('wx/login.php?action=get_open_id&code=') + res.code + '&grant_type=authorization_code',
							data: {},
							method: 'GET',
							success: function (res) {
								console.log("kkkkk----", res);
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
			console.log("get_open_id====end....");
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
