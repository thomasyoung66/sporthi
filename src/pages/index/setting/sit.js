// pages/index/hw_setting.js
var util = require('../../../utils/util.js');

Page({
  data: {
    multiIndex: [0, 0, 0, 0],
    multiArray: [['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
    ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23',
      '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47',
      '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'],
    ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'], ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23',
      '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47',
      '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
    ],
    items: [

      { "id": "sit_week", "name": "", "keywords": "设备提醒开关", "img": "../../../images/longsit_week.png", "w0": 1, "w1": 1, "w2": 1, "w3": 0, "w4": 1, "w5": 1, "w6": 1,"index":[1,1,1,1]},
      { "id": "sit_morning", "name": "上午", "keywords": "9:00~12:00", "img": "../../../images/longsit_morning.png", "bh": "09", "bm": "00", "eh": "12", "em": "00", "index": [1, 1, 1, 1] },
      { "id": "sit_afternoon", "name": "下午", "keywords": "13:00~18:00", "img": "../../../images/longsit_afternoon.png", "bh": "14", "bm": "00", "eh": "18", "em": "00", "index": [1, 1, 1, 1]  },

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
  },
  checkboxChange: function (e) {
    console.log(e.target.id + '  >>>>checkbox发生change事件，携带value值为：', e.detail.value.join(","));
    getApp().globalData.indexPage.saveConfig("sit_week", util.fixWeekDate(e.detail.value));
    return;
  },
  switch2Change: function (e) {
    getApp().globalData.indexPage.saveConfig(e.target.id, e.detail.value == true ? 1 : 0);
    return;
  },
  bindMultiPickerChange: function (e) {
    console.log(e.target.id+'-----picker发送选择改变，携带值为', e.detail.value);
    var myData = this.data.items;
    var v = e.detail.value;
    if (e.target.id =="sit_morning"){
      myData[1].bh = util.sprintf("%02d",v[0]);
      myData[1].bm = util.sprintf("%02d",v[1]);
      myData[1].eh = util.sprintf("%02d",v[2]);
      myData[1].em = util.sprintf("%02d",v[3]);
    }
    if (e.target.id == "sit_afternoon") {
      myData[2].bh = util.sprintf("%02d",v[0]);
      myData[2].bm = util.sprintf("%02d",v[1]);
      myData[2].eh = util.sprintf("%02d",v[2]);
      myData[2].em = util.sprintf("%02d",v[3]);
    }
    getApp().globalData.indexPage.saveConfig(e.target.id, util.sprintf("%02d:%02d~%02d:%02d", v[0], v[1], v[2], v[3]));
    this.setData({
      items: myData
    });
  },
  onShow: function () {
    var that = this;
    wx.setNavigationBarTitle({
      title: '久坐'
    })
    var config=wx.getStorageSync("config");
    var myData = this.data.items;
    var weekString=""+util.safeGet(config,"sit_week","1,1,1,1,1,1,0");
    console.log("13:00~18:00===",config);
    var w = weekString.split(',');
    myData[0].w0 = w[0];
    myData[0].w1 = w[1];
    myData[0].w2 = w[2];
    myData[0].w3 = w[3];
    myData[0].w4 = w[4];
    myData[0].w5 = w[5];
    myData[0].w6 = w[6];
    myData[1].keywords = util.safeGet(config,"sit_morning","9:00~12:00");
    myData[2].keywords = util.safeGet(config, "sit_afternoon", "14:00~18:00");
    myData[1].index = myData[1].keywords.split(/:|~/);
    myData[2].index = myData[2].keywords.split(/:|~/);
    var tmp = myData[1].keywords.split(/:|~/);
    myData[1].bh=tmp[0];
    myData[1].bm = tmp[1];
    myData[1].eh = tmp[2];
    myData[1].em = tmp[3];
    console.log("begin====", tmp);
    var tmp = myData[2].keywords.split(/:|~/);
    myData[2].bh = tmp[0];
    myData[2].bm = tmp[1];
    myData[2].eh = tmp[2];
    myData[2].em = tmp[3];
    console.log("end====", tmp);

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