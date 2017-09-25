// pages/index/hw_setting.js
var util = require('../../../utils/util.js');

Page({
  data: {
    multiIndex: [0, 0, 0,0],
    multiArray: [['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'], 
      ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23',
        '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47',
        '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'],
      ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'], ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23',
        '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47',
        '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
        ],

    items: [
      { "id": "notice_onoff", "name": "免打扰", "img": "../../../images/do_not_disturb.png", "val": 0,"type":0 },
      { "id": "notice_time", "name": "提醒时段", "img": "../../../images/reminder_time.png", "val": "9:00~23:00", "type": 1 },
      { "id": "notice_phone", "name": "电话", "img": "../../../images/reminder_call.png", "val": 0, "type": 0 },
      { "id": "notice_msg", "name": "短信", "img": "../../../images/reminder_sms.png", "val": 0, "type": 0 },
      { "id": "notcie_wx", "name": "微信", "img": "../../../images/reminder_wechat.png", "val": 0, "type": 0 },
      { "id": "notice_qq", "name": "QQ", "img": "../../../images/reminder_qq.png", "val": 0, "type": 0 },
      { "id": "notice_facebook", "name": "Facebook", "img": "../../../images/reminder_facebook.png", "val": 1, "type": 0 },
      { "id": "notice_twitter", "name": "Twitter", "img": "../../../images/reminder_twitter.png", "val": 1, "type": 0 },
      { "id": "notice_whatsapp", "name": "Whatsapp", "img": "../../../images/reminder_whatapp.png", "val": 1,"type":0 }

    ]
  },
  switch2Change:function(e){
    getApp().globalData.indexPage.saveConfig(e.target.id, e.detail.value == true ? 1 : 0);
    return ;
    console.log("-----",e);
    var config=wx.getStorageSync("config");
    config[e.target.id] = e.detail.value==true?1:0;
    wx.setStorageSync("config", config);
    console.log(e.target.id+'switch1 发生 change 事件，携带值为', e.detail.value);
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
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
      title: '提醒',
    })

    var myData = this.data.items;
    var config=wx.getStorageSync("config");
    for (var n = 0; n < myData.length; n++) {
      myData[n].val=config[myData[n].id];
    }
    console.log("设置数据...", myData);
    this.setData({
      items: myData
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