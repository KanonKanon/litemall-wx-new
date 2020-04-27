// userCenterPages/sellerCenter/promotionGoods/promotionGoods.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    labelIndex: 1,
    goodsList: []
  },

  /**
   * 获取商品列表
   */
  getGoodsList() {
    var that = this
    var func = (res) => {
      console.log(res)
      if (res.errno == 0) {
        that.setData({
          goodsList: res.data,
          tempList: res.data
        })
      }
    }
    util.request(api.DistributionGoodsList).then(func)
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
    this.getGoodsList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 跳转商品详情页
   */
  goToDetail(e) {
    console.log(e);
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../../../pages/goods/goods?id=' + item.goodsId,
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
  /**
   * 搜索事件
   */
  onSearch: function(e) {
    let tempList = this.data.tempList
    let key = e.detail
    let finishList=[]
    console.log(e.detail)
    tempList.map(v=>{
      if(v.name.indexOf(key)>-1){
        finishList.push(v)
      }
    })
    this.setData({
      goodsList:finishList
    })

  },
  /**
   * 取消搜索事件
   */
  onCancel: function(e) {

  },

  /**
   * 选择标签
   */
  selectLabel: function(e) {
    this.setData({
      labelIndex: e.currentTarget.dataset.index
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