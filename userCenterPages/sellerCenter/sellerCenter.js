// userCenterPages/sellerCenter/sellerCenter.js
var api = require("../../config/api.js");
var util = require("../../utils/util.js");
var user = require("../../utils/user.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    sellerCenterData: {
      profit:0,
      profitYes:0,
      offlineYes:0,
      balance:0,
      invitation:0,
      order:0,
      offline:0
    }
  },

  /**
   * 获取分销中心数据 
   */
  getSellerCenterData() {
    var that = this;
   
    var func = (res) => {
      console.log(res)
      if (res.errno == 0) {
        if(res.data){
          that.setData({
            sellerCenterData: res.data
          })
        }
      }
      else{
        wx.showModal({
          title: '信息提示',
          content: res.errmsg,
          showCancel:false
        })
      }
    }

    util.request(api.DistributionIndex, {}).then(func);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var userInfo = wx.getStorageSync("userInfo");
    console.log(userInfo);
    this.setData({
      userInfo: userInfo
    })
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getSellerCenterData();
  },

  goToInvitationCard: function() {
    wx.navigateTo({
      url: '/userCenterPages/sellerCenter/invitationCard/invitationCard',
    })
  },
  /**
   * 跳转到常见问题
   */
  goToProblem: function() {
    wx.navigateTo({
      url: '/userCenterPages/sellerCenter/problems/problems',
    })
  },

  /**
   * 跳转到我的客户
   */
  goToClient: function() {
    wx.navigateTo({
      url: '/userCenterPages/sellerCenter/myClient/myClient',
    })
  },
  /**
   * 跳转到我的邀请
   */
  goToMyinvitation: function() {
    wx.navigateTo({
      url: '/userCenterPages/sellerCenter/myInvitation/myInvitation',
    })
  },
  /**
   * 跳转到推广订单页
   */
  goToPromoteOrder: function() {
    wx.navigateTo({
      url: '/userCenterPages/sellerCenter/promoteOrder/promoteOrder',
    })
  },
  /**
   * 跳转到业绩统计页
   */
  goToMyClient: function() {
    wx.navigateTo({
      url: '/userCenterPages/sellerCenter/performanceStatistics/preformanceStatistics',
    })
  },

  /**
   * 跳转到首页
   */
  goToIndex: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  /**
   * 跳转到分享商品页
   */
  goToPromotionGoods: function() {
    wx.navigateTo({
      url: '/userCenterPages/sellerCenter/promotionGoods/promotionGoods',
    })
  },
  /**
   * 跳转到结算中心
   */
  goToSetllementCenter: function() {
    wx.navigateTo({
      url: '/userCenterPages/sellerCenter/setllementCenter/setllementCenter',
    })
  },

  goToMsgCenter: function() {
    wx.navigateTo({
      url: '/userCenterPages/sellerCenter/msgCenter/msgCenter',
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getSellerCenterData();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})