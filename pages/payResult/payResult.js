var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp();
Page({
  data: {
    status: false,
    orderId: 0,
    errmsg: ''
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.orderId,
      status: options.status === '1' ? true : false
    })
  },
  onReady: function() {

  },
  onShow: function() {
    // 页面显示
    var payErrmsg = wx.getStorageSync("payErrmsg")
    console.log(payErrmsg)
    if (payErrmsg != "") {
      this.setData({
        errmsg: payErrmsg
      })
    }

  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  },
  /**
   * 跳转到订单页
   */
  goToOrder(e) {
    let showType = e.currentTarget.dataset.showType;
    console.log(e)
    wx.setStorageSync('tab', showType)
    wx.switchTab({
      url: '../ucenter/index/index',
    })
    // wx.navigateTo({
    //   url: "../ucenter/order/order"
    // })
  },

  /**
   * 再付款
   */
  payOrder() {
    let that = this;
    wx.setStorageSync("orderId", this.data.orderId)
    wx.navigateTo({
      url: '../../userCenterPages/selectPay/selectPay',
    })

  }
})