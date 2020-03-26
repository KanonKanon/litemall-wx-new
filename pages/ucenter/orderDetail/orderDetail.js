var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    getGoodType:'',
    active:1,
    orderId: 0,
    orderInfo: {},
    orderGoods: [],
    expressInfo: {},
    flag: false,
    handleOption: {},
    goods: {},
    relatedGoods:[],
    steps: [
      {
        text: '买家下单',
       
      },
      {
        text: '商家接单',
       
      },
      {
        text: '买家提货',
       
      },
      {
        text: '交易完成',
       
      }
    ]
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    this.getOrderDetail();
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getOrderDetail();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

/**
 * 加载页面时切换步骤条
 */
  selectSteps:function(){
    if (this.data.handleOption.confirm){
      this.setData({
        active:1
      })
    }
    else if (this.data.handleOption.comment){
      this.setData({
        active: 2
      })
    }
    else if (this.data.handleOption.delete){
      this.setData({
        active: 3
      })
    }
  },

  expandDetail: function () {
    let that = this;
    this.setData({
      flag: !that.data.flag
    })
  },
  getOrderDetail: function () {
    wx.showLoading({
      title: '加载中',
    });

    let that = this;
    util.request(api.OrderDetail, {
      orderId: that.data.orderId
    }).then(function (res) {
      console.log(res);
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          orderInfo: res.data.orderInfo,
          orderGoods: res.data.orderGoods,
          handleOption: res.data.orderInfo.handleOption,
          // expressInfo: res.data.expressInfo
        });
        that.getGoodsRelated();
      }
      wx.hideLoading();
    });
  },
  
  /**
   *  获取推荐商品
   */
  getGoodsRelated: function () {
    let that = this;
    util.request(api.GoodsRelated, {
      id: that.data.orderGoods[0].goodsId
    }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          relatedGoods: res.data.goodsList,
        });
      }
    });
  },

  /**
   * 拨打电话
   */
  callCusPhone(e) {
    wx.makePhoneCall({
      // phoneNumber: 需要拨打的电话，若固定-可写死；若变化-从后台获取
      phoneNumber: e.currentTarget.dataset.phone,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },

/**
 * 复制订单编号到粘贴板
 */
  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: JSON.stringify(e.currentTarget.dataset.text),
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },

  // “去付款”按钮点击效果
  payOrder: function () {
    let that = this;
    wx.setStorageSync("orderId", this.data.orderId);
    if (this.data.orderInfo.actualPrice == 0) {
      util.request(api.zeroPay, {
        orderId: this.data.orderId,
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
  // “取消订单”点击效果
  cancelOrder: function () {
    let that = this;
    let orderInfo = that.data.orderInfo;

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
              util.redirect('/pages/ucenter/order/order');
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },
  // “取消订单并退款”点击效果
  refundOrder: function () {
    let that = this;
    let orderInfo = that.data.orderInfo;

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
              util.redirect('/pages/ucenter/order/order');
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },
  // “删除”点击效果
  deleteOrder: function () {
    let that = this;
    let orderInfo = that.data.orderInfo;

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
              util.redirect('/pages/ucenter/order/order');
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },
  // “确认收货”点击效果
  confirmOrder: function () {
    let that = this;
    let orderInfo = that.data.orderInfo;

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
              util.redirect('/pages/ucenter/order/order');
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
 

  onShow: function () {
    // 页面显示
    this.selectSteps();
   
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})