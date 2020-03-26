// userCenterPages/sellerCenter/promoteOrder/promoteOrder.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 3,
    dataList: [

      // {
      //   userName:"shicake",
      //   state:0,
      //   orderSn:'44111244456',
      //   addTime:"2019-7-29 00:00:00",
      //   actualPrice:588,
      //   commission:23.45,
      //   goodsList:[{
      //     picUrl:"",
      //     goodsName:"银河天星",
      //     stock:1,
      //     goodsCommissionRate:0.02,
      //     goodsCommission:15.3,
      //   }]
      // },
      // {
      //   userName: "shicake",
      //   state: 0,
      //   orderSn: '44111244456',
      //   addTime: "2019-7-29 00:00:00",
      //   actualPrice: 588,
      //   commission: 23.45,
      //   goodsList: [{
      //     picUrl: "",
      //     goodsName: "银河天星",
      //     stock: 1,
      //     goodsCommissionRate: 0.02,
      //     goodsCommission: 15.3,
      //   }]
      // }
    ]
  },
/**
 * 获取数据
 */
  getDataList(){
    var that = this;
    var query = {}
    if (this.data.time == 1) {
      query.startDate = util.getDateStr('', -1) + ' 00:00:00'
      query.endDate = util.getDateStr('', 0) + ' 00:00:00'
    } else if (this.data.time == 2) {
      query.startDate = util.getDateStr('', -7) + ' 00:00:00'
      query.endDate = util.getDateStr('', 0) + ' 00:00:00'
    } else if (this.data.time == 3) {
      query.startDate = ""
      query.endDate = ""
    }

    var func = (res) => {
      console.log(res)
      if (res.errno == 0) {
        that.setData({
          dataList: res.data
        })
      } else {
        wx.showModal({
          title: '信息提示',
          content: res.errmsg,
        })
      }
    }
    util.request(api.DistributionOrderList, query).then(func)
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
this.getDataList();
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
 * 显示数据
 */
  showData: function (e) {
    this.setData({
      time: e.currentTarget.dataset.index
    })
    this.getDataList();
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