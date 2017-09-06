//app.js
var util = require('utils/util.js')
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.get_open_id();
    // this.getUserInfo(null);
    console.log("ok....." + util.test());

  },
  save_userinfo_server: function () {
    // user

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
          console.log("====" + JSON.stringify(res));
          wx.setStorageSync('userInfo', objz);
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
