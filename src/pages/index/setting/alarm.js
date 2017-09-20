// pages/index/hw_setting.js
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */

  data: {
    items: [
    
      {
        "id": "alarm1", "name": "1", "onoff":0, "val": "0:00", "img": "../../../images/alarm_clock.png", "right": 0,
        "w0": 1, "w1": 1, "w2": 1, "w3": "1", "w4": 1, "w5": 1, "w6": 0},
      {
        "id": "alarm2", "name": "2", "onoff": 0, "val": "0:00", "img": "../../../images/alarm_clock.png", "right": 0,
        "w0": 1, "w1": 1, "w2": 1, "w3": "1", "w4": 1, "w5": 1, "w6": 1
       },
      {
        "id": "alarm3", "name": "3", "onoff": 0,"val": "0:00", "img": "../../../images/alarm_clock.png", "right": 0,
        "w0": 1, "w1": 1, "w2": 1, "w3": "1", "w4": 1, "w5": 1, "w6": 1 },

    ]
  },
  checkboxChange: function (e) {
    console.log(e.target.id + '  >>>>checkbox发生change事件，携带value值为：', e.detail.value.join(","));
    getApp().globalData.indexPage.saveConfig(e.target.id, e.detail.value.join(","));
    return ;
  },
  bindTimeChange: function (e) {
    getApp().globalData.indexPage.saveConfig(e.target.id, e.detail.value);
    var tmp = this.data.items;
    var id = "" + e.target.id;
    for(var n=0;n<tmp.length;n++){
      if (id.indexOf(tmp[n].id)>=0){
        tmp[n].val = e.detail.value;
        break;
      }
    }
    this.setData({
      items: tmp
    });
  },
  switch2Change: function (e) {
    getApp().globalData.indexPage.saveConfig(e.target.id, e.detail.value == true ? 1 : 0);
    return;
    console.log("-----", e);
    var config = wx.getStorageSync("config");
    config[e.target.id] = e.detail.value == true ? 1 : 0;
    wx.setStorageSync("config", config);
    console.log(e.target.id + 'switch1 发生 change 事件，携带值为', e.detail.value);
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
      if (myData[n].id == 7) {
        myData[n].keywords = "" + wx.getStorageSync("hw_version");
      }
      if (myData[n].id == 8) {
        myData[n].keywords = "" + wx.getStorageSync("sw_version");
      }
      if (myData[n].id==9){
          myData[n].keywords = "mac:" + wx.getStorageSync("mac");
          myData[n].keywords1 = "制造商:" + wx.getStorageSync("manufacturer") + " 型号:" + wx.getStorageSync("model");
      }
      
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
    wx.setNavigationBarTitle({
      title: '闹钟1',
    });
    var tmp=this.data.itmes;
    var config=wx.getStorageSync("config");
    for(var n=1;n<=3;n++){
      console.log("config=",config);
      tmp[n-1].val=config["alarm"+n+"time"];
      tmp[n - 1].onoff = config["alarm" + n];

    }
    this.setData({
      items:tmp
    });
    /*
    { "id": "alarm3", "name": "3", "val": "0:00", "img": "../../../images/alarm_clock.png", "right": 0,
        "w0": 1, "w1": 1, "w2": 1, "w3": "1", "w4": 1, "w5": 1, "w6": 1 }
        */

   
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