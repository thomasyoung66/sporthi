// pages/index/hw_setting.js
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */

  data: {
    items: [
    
      { "id": 1, "name": "提醒", "keywords": "连接设备", "img": "../../images/band.png" },
      { "id": 2, "name": "闹钟", "keywords": "个设备", "img": "../../images/user1.png" },
      { "id": 3, "name": "久坐", "keywords": "身高/体重等", "img": "../../images/setting_blue.png" },

      { "id": 4, "name": "心率", "keywords": "无", "img": "../../images/rank.png" },
      { "id": 5, "name": "寻找设备", "keywords": "7000", "img": "../../images/target_big.png" },
      { "id": 6, "name": "计量单位", "keywords": "公制", "img": "../../images/unit.png" },
      { "id": 7, "name": "断开连接", "keywords": "", "img": "../../images/about_blue.png" },
      { "id": 8, "name": "软件版本", "keywords": "", "img": "../../images/about_blue.png" },
      { "id": 9, "name": "硬件版本", "keywords": "", "img": "../../images/about_blue.png" },
      { "id": 10, "name": "设备信息", "keywords": "", "img": "../../images/about_blue.png" }




    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("run onLoad....");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("run onLoad....");
    var myData = this.data.items;
    for(var n=0;n<myData.length;n++){
      if (myData[n].id==9)
        myData[n].keywords="测试";
    }
    this.setData({
      items: myData
    });
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
 
    console.log("run  onShow....");
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
    console.log("run  unloadShow....");
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