// pages/index/hw_setting.js
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */

  data: {
    items: [
    
      { "id": 1, "name": "提醒", "keywords": "设备提醒开关", "img": "../../images/band.png",right:0 },
      { "id": 2, "name": "闹钟", "keywords": "设置闹钟", "img": "../../images/clock_big.png", right: 0 },
      { "id": 3, "name": "久坐", "keywords": "久坐设置", "img": "../../images/reminder_sit.png", right: 0 },
      { "id": 4, "name": "心率", "keywords": "心率参数", "img": "../../images/hrm_blue.png", right: 0 },
      { "id": 5, "name": "寻找设备", "keywords": "", "img": "../../images/find_big.png", right: 0 },
      { "id": 6, "name": "断开连接", "keywords": "", "img": "../../images/disconnect_blue.png", right: 0 },
      { "id": 7, "name": "软件版本", "keywords": "", "img": "../../images/about_blue.png", right: 1 },
      { "id": 8, "name": "硬件版本", "keywords": "", "img": "../../images/info.png", right: 1 },
      { "id": 9, "name": "设备信息", "keywords": "", "img": "../../images/connect_ok.png", right: 1 }




    ]
  },
  showDetail: function (event) {
    //  util.dump_obj(data.target);

    if (event.currentTarget.dataset.id == 0) {
      wx.navigateTo({
        url: 'setting/notice',
      })
    }
    else if (event.currentTarget.dataset.id == 1) {
      wx.navigateTo({
        url: 'setting/alarm',
      })
    }
    else if (event.currentTarget.dataset.id == 2) {
      wx.navigateTo({
        url: 'setting/sit',
      })
    }
    else if (event.currentTarget.dataset.id == 3) {
      wx.navigateTo({
        url: 'setting/hb',
      })
    }
    else if (event.currentTarget.dataset.id == 4) {
      getApp().globalData.indexPage.findDevice(2);
    }
    else
      wx.showToast({
        title: 'select=' + event.currentTarget.dataset.id,
      });
    
    console.log("this is ok.." + event.currentTarget.dataset.id);
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
      title: '设备信息设置',
    })
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