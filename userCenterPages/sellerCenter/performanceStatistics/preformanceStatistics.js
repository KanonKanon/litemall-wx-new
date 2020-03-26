// userCenterPages/sellerCenter/performanceStatistics/preformanceStatistics.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 3,
    isHidePop: true,
    achievementsData: {}
  },

  

  /**
   * 业绩统计数据 
   */
  getAchievementsData() {
    var that = this;
    var query = {}
    if (this.data.index == 1) {
      query.startDate = util.getDateStr('', -1)+" 00:00:00"
      query.endDate = util.getDateStr('', 0) + " 00:00:00"
    } else if (this.data.index == 2) {
      query.startDate = util.getDateStr('', -7) + " 00:00:00"
      query.endDate = util.getDateStr('', 0) + " 00:00:00"
    } else if (this.data.index == 3) {
      query.startDate = ""
      query.endDate = ""
    }

    var func = (res) => {
      console.log(res)
      if (res.errno == 0) {
        that.setData({
          achievementsData: res.data
        })
      } else {
        wx.showModal({
          title: '信息提示',
          content: res.errmsg,
        })
      }
    }
    util.request(api.DistributionAchievements, query).then(func)

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
    this.getAchievementsData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 显示弹出页
   */
  showPop: function() {
    this.setData({
      isHidePop: false
    })
  },
  hidePop: function() {
    this.setData({
      isHidePop: true,
    })
  },
  /**
   * 显示数据
   */
  showData: function(e) {
    this.setData({
      index: e.currentTarget.dataset.index
    })
    this.getAchievementsData();
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
  /**
   * 跳转到我的客户
   */
  goToMyclient: function() {
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
   * 跳转到邀请奖励订单页
   */
  goToRewardOrder: function() {
    wx.navigateTo({
      url: '/userCenterPages/sellerCenter/rewardOrder/rewardOrder',
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