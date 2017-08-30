//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'index',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
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
  addTap:function(){
    console.log("我的按钮刘测试-begin");
    this.getList();
    console.log("我的按钮刘测试-end");
    //alert("add....");
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
