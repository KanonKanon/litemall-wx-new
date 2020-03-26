var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    orderList: [],
    showType: 0,
    page: 1,
    size: 20,
    totalPages: 1
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this
    try {
      var tab = wx.getStorageSync('tab');

      this.setData({
        showType: tab
      });
    } catch (e) {}

  },
/**
 * 去评论
 */
  goToComment(e){
    let that=this;
    let orderInfo=e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../../commentPost/commentPost?orderId='+orderInfo.id+'&type=0'+'&valueId='+orderInfo.goodsList[0].id,
    })
  },
/**
 *  “确认收货”点击效果
 */
  confirmOrder: function (e) {
    let that = this;
    let orderInfo = e.currentTarget.dataset.item
    wx.showModal({
      title: '',
      content: '确认收货？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.OrderConfirm, {
            orderId: orderInfo.id
          }, 'POST').then(function (res) {
            if (res.errno === 0) {
              wx.showToast({
                title: '确认收货成功！'
              });
              that.getOrderList()
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },
  
  // “取消订单并退款”点击效果
  refundOrder: function (e) {
    let that = this;
    let orderInfo = e.currentTarget.dataset.item;

    wx.showModal({
      title: '',
      content: '确定要取消此订单？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.OrderRefund, {
            orderId: orderInfo.id
          }, 'POST').then(function (res) {
            if (res.errno === 0) {
              wx.showToast({
                title: '取消订单成功'
              });
              
              that.getOrderList()
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },

  // “删除”点击效果
  deleteOrder: function (e) {
    let that = this;
    let orderInfo = e.currentTarget.dataset.item;

    wx.showModal({
      title: '',
      content: '确定要删除此订单？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.OrderDelete, {
            orderId: orderInfo.id
          }, 'POST').then(function (res) {
            if (res.errno === 0) {
              wx.showToast({
                title: '删除订单成功'
              });
              
              that.getOrderList()
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },

  /**
   * “取消订单”点击效果
   */
  cancelOrder: function (e) {
    let that = this;
    let orderInfo = e.currentTarget.dataset.item

    wx.showModal({
      title: '',
      content: '确定要取消此订单？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.OrderCancel, {
            orderId: orderInfo.id
          }, 'POST').then(function (res) {
            if (res.errno === 0) {
              wx.showToast({
                title: '取消订单成功'
              });
              
              that.getOrderList()
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },

  /**
   * “去付款”按钮点击效果
   */
  payOrder: function (e) {
    let that = this;
    let orderInfo=e.currentTarget.dataset.item
    wx.setStorageSync('orderId', orderInfo.id)
    console.log(orderInfo);
    if (orderInfo.actualPrice == 0) {
      util.request(api.zeroPay, {
        orderId: orderInfo.id,
      }, 'POST').then(function (res) {
        console.log(res)
        if (res.errno === 0) {
          wx.showModal({
            title: '信息提示',
            content: '支付成功',
            showCancel: false,
            success(v) {
              if (v.confirm) {
                wx.reLaunch({
                  url: '../index/index',
                })
              }
            }
          })
        }
      })
    }
    else {
      wx.navigateTo({
        url: '../../../userCenterPages/selectPay/selectPay',
      })
    }


  },

  getOrderList() {
    let that = this;
    util.request(api.OrderList, {
      showType: that.data.showType,
      page: that.data.page,
      size: that.data.size
    }).then(function(res) {
      console.log(res)
      if (res.errno === 0) {
        var newList=that.data.orderList;
        newList=res.data.data
        that.setData({
          orderList: newList,
          totalPages: res.data.totalPages
        });
      }
    });
  },
  onReachBottom() {
    if (this.data.totalPages > this.data.page) {
      this.setData({
        page: this.data.page + 1
      });
      this.getOrderList();
    } else {
      wx.showToast({
        title: '没有更多订单了',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
  },
  switchTab: function(event) {
    let showType = event.currentTarget.dataset.index;
    this.setData({
      orderList: [],
      showType: showType,
      page: 1,
      size: 20,
      totalPages: 1
    });
    wx.setStorageSync('tab', showType)
    this.getOrderList();
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    this.getOrderList();
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh(){
    wx.stopPullDownRefresh()
    this.data.page=1;
    this.getOrderList();
  }
})