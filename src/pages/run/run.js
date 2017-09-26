// pages/run/run.js
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */

  data: {
    items: [
      /*
      { "id": 1, "name": "连接设备", "keywords": "连接设备", "img": "../../images/band.png" },
      { "id": 2, "name": "我的设备", "keywords": "个设备", "img": "../../images/user1.png" },
      { "id": 3, "name": "个人信息", "keywords": "身高/体重等", "img": "../../images/setting_blue.png" },

      { "id": 4, "name": "我的排名", "keywords": "无", "img": "../../images/rank.png" },
      { "id": 5, "name": "运动目标", "keywords": "7000", "img": "../../images/target_big.png" },
      { "id": 6, "name": "计量单位", "keywords": "公制", "img": "../../images/unit.png" },
      { "id": 7, "name": "关于", "keywords": "", "img": "../../images/about_blue.png" }*/

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
  refreshData:function(){
    var that=this;
    wx.showLoading({
      title: '',
    });
    wx.request({
      url: util.getUrl('ble.php?action=query_order'),
      data: {
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        that.setData({
          items: res.data.items
        })
        wx.hideLoading();
        console.log("save----", res.data);

      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
     wx.setNavigationBarTitle({
        title: '运动排行',
      })
     that.refreshData();

    console.log("run  onShow....");
  },
  praise_action:function(e){
    console.log("-----",e);
    var that=this;
    wx.request({
      url: util.getUrl('ble.php?action=praise'),
      data: {
        uid: wx.getStorageSync('serverId'),
        id:e.target.id
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        that.refreshData();
      }
    });
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