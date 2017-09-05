//index.js
//获取应用实例
var util = require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    motto: '我的',
    userInfo: {},
    items: [
      { "id": 1, "name": "连接设备", "keywords": "无设备", "img":"../../images/band.png" },
      { "id": 2, "name": "我的排名", "keywords": "无", "img": "../../images/rank.png" },
      { "id": 3, "name": "运动目标", "keywords": "7000", "img": "../../images/target_big.png" },
      { "id": 4, "name": "计量单位", "keywords": "公制", "img": "../../images/unit.png" },
      { "id": 5, "name": "关于", "keywords": "", "img": "../../images/about_blue.png" }

    ]
  },
  showDetail: function (event) {
  //  util.dump_obj(data.target);
    if (event.currentTarget.dataset.id==0){
      wx.navigateTo({
        url: 'ble_connect',
      })
    }
    console.log("this is ok.." + event.currentTarget.dataset.id);
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
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
