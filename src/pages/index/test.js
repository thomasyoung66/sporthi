//var wxCharts = require('wxcharts.js');
var wxCharts = require('../../utils/wxcharts.js');
// pages/index/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
      series: [{
        name: '成交量1',
        data: [0.15, 0.2, 0.45, 0.37, 0.4, 0.8],
        format: function (val) {
          return val.toFixed(2) + '万';
        }
      }, {
        name: '成交量2',
        data: [0.30, 0.37, 0.65, 0.78, 0.69, 0.94],
        format: function (val) {
          return val.toFixed(2) + '万';
        }
      }],
      yAxis: {
        title: '成交金额 (万元)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: 300,
      height: 200
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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