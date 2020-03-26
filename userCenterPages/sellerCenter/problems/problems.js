// userCenterPages/sellerCenter/problems/problems.js
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