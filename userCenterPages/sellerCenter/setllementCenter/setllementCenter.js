// userCenterPages/sellerCenter/setllementCenter/setllementCenter.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    centerInfo:{
      balance:0
    }
  },

/**
 * 获取数据
 */
  getCenterInfo(){
    var that =this
    var func=(res)=>{
      console.log(res)
      if(res.errno==0){
        if(res.data){
          that.setData({
            centerInfo: res.data
          })
        }
      
      }
      else{
        util.showError(res.errmsg);
      }
    }

    util.request(api.DistributionBalanceInfo).then(func);

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getCenterInfo();
  },
  /**
   * 跳转到收支明细
   */
  goToPaymentDetail:function(){
    wx.navigateTo({
      url: '/userCenterPages/sellerCenter/setllementCenter/paymentDetail/paymentDetail',
    })
  },
  goToGetMoneyRecord:function(){
    wx.navigateTo({
      url: '/userCenterPages/sellerCenter/setllementCenter/getMoneyRecord/getMoneyRecord',
    })
  },

  /**
   * 跳转到提现
   */
  goToGetMoney:function(){
    wx.navigateTo({
      url: '/userCenterPages/sellerCenter/setllementCenter/getMoney/getMoney',
    })
  },

  /**
    * 跳转到首页
    */
  goToIndex: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  /**
   * 跳转到分享商品页
   */
  shareGoods: function () {
    wx.navigateTo({
      url: '',
    })
  },
  /**
   * 跳转到结算中心
   */
  payCenter: function () {
    wx.navigateTo({
      url: '',
    })
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
    this.getCenterInfo();
    wx.stopPullDownRefresh()
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