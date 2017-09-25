// pages/index/hw_setting.js
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  array: [],
  pickIndex: 0,
  data: {
    items: [
      { "id": "hb_interal", "name": "心率检查间隔", "keywords": "60", "img": "../../../images/hrm_timer.png", "onoff": 1 },
      { "id": "hb_warn", "name": "心率报警", "keywords": "120次/分", "img": "../../../images/hrm_alarm.png", "onoff": 1 },
      { "id": "bp_warn", "name": "血压报警", "keywords": "140/90毫米汞柱", "img": "../../../images/bp_alarm.png", "onoff": 1 }
    ]
  },
  switch2Change: function (e) {
    getApp().globalData.indexPage.saveConfig(e.target.id, e.detail.value == true ? 1 : 0);
    return;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("run onLoad....");
  },
  bindPickerChange: function (e) {

    var myData = this.data.items;
    myData[0].keywords = parseInt(e.detail.value) + 10;
    this.setData({
      items: myData
    });
    getApp().globalData.indexPage.saveConfig(e.target.id, parseInt(e.detail.value) + 10);
    console.log(e.target.id + '-----picker发送选择改变，携带值为', e.detail.value);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("run onLoad....");

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.setNavigationBarTitle({
      title: '心率',
    })
    var tmp = new Array();
    for (var n = 10; n <= 120; n++) {
      tmp.push(n);
    }
    var myData = this.data.items;
    var config = wx.getStorageSync("config");
    for (var n = 0; n < myData.length; n++) {
      if (n == 0) {
        myData[n].keywords = util.safeGet(config, myData[n].id, "60");
      }
      else {
        console.log(myData[n].id + "-----开关值-----" + util.safeGet(config, myData[n].id, 1), config);
        myData[n].onoff = util.safeGet(config, myData[n].id, 1);
      }
    }

    this.setData({
      array: tmp,
      items: myData
    });
    this.setData({
      pickIndex: util.safeGet(config, myData[0].id, "60") - 10
    });
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