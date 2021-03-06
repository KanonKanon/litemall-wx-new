// userCenterPages/sellerCenter/setllementCenter/paymentDetail/paymentDetail.js
var util = require('../../../../utils/util.js');
var api = require('../../../../config/api.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordList:[
    {
      addTime:"2019-8-30",
      describe:'提现',
      value:1
    }
    ]
  },
/**
 *获取数据
 */
getRecordList(){
  var that=this;
  var func=(res)=>{
    console.log(res)
    if(res.errno==0){
      that.setData({
        recordList:res.data
      })
    }
    else{
      util.showError(res.errmsg)
    }
  }
  
  util.request(api.DistributionBalanceRecordList).then(func)
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
    this.getRecordList()
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
  goToPromotionGoods: function () {
    wx.navigateTo({
      url: '/userCenterPages/sellerCenter/promotionGoods/promotionGoods',
    })
  },
  /**
   * 跳转到结算中心
   */
  goToSetllementCenter: function () {
    wx.navigateTo({
      url: '/userCenterPages/sellerCenter/setllementCenter/setllementCenter',
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