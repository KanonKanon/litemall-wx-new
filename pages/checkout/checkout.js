var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
var user = require('../../utils/user.js');

Page({
  data: {
    region: ['请选'],
    customItem: '全部',
    getGoodType: '',
    getGoodTypes: ['到店自提', '邮寄快递'],
    shop: {},
    shopList: [],
    getGoodDate: "",
    timeList: [],
    checkedGoodsList: [],
    checkedAddress: {},
    availableCouponLength: 0, // 可用的优惠券数量
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00, //快递费
    couponPrice: 0.00, //优惠券的价格
    grouponPrice: 0.00, //团购优惠价格
    orderTotalPrice: 0.00, //订单总价
    actualPrice: 0.00, //实际需要支付的总价
    cartId: 0,
    addressId: 0,
    couponId: 0,
    message: '',
    grouponLinkId: 0, //参与的团购，如果是发起则为0
    grouponRulesId: 0, //团购规则ID
    cur_lat: 0, //纬度
    cur_lng: 0, //经度
    isSelectAddress: false,
    fastAddress: {},
    offlineAddressId: 0,
    hasLogin: false
  },

  checkLogin() {
    var hasLogin = wx.getStorageSync('hasLogin')
    if (hasLogin) {
      this.setData({
        hasLogin: hasLogin
      })
    } else {
      this.goLogin()
    }

  },
  goLogin() {
    if (!this.data.hasLogin) {
      wx.showModal({
        title: '未登录',
        content: '没有登录，部分功能会受到限制哦！',
        showCancel: true,
        confirmText: '去登录',
        cancelText: '不登录',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "/pages/auth/login/login"
            });
          }
        }

      })
    }
  },

  /**
   * 检查可选的提货方式
   */
  checkGetGoodType() {
    let deliveryWay = this.data.checkedGoodsList[0].deliveryWay
    // console.log('deliverWay: ' + deliveryWay)
    if (deliveryWay) {
      if (deliveryWay === 0) {
        this.setData({
          getGoodTypes: ['到店自提', '邮寄快递'],
        })
      } else if (deliveryWay === 1) {
        this.setData({
          getGoodTypes: ['到店自提'],
          getGoodType: '到店自提'
        })
      } else if (deliveryWay === 2) {
        this.setData({
          getGoodTypes: ['邮寄快递'],
          getGoodType: '邮寄快递'
        })
      }
    }
  },

  /**
   *地址输入
   */
  addrInput(e) {
    // console.log(e);
    this.setData({
      detail_addr: e
    })
  },

  /**
   *省市区选择
   */
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },

  //显示弹出层
  showPopup: function() {
    var that = this;
    wx.showActionSheet({
      itemList: that.data.timeList,
      success: function(e) {
        // console.log(e.tapIndex) //item项下的key或index
        that.setData({
          getGoodDate: that.data.timeList[e.tapIndex]
        })
      }
    })
  },
  //显示弹出层
  showPopup2: function() {
    var that = this;
    wx.showActionSheet({
      itemList: that.data.getGoodTypes,
      success: function(e) {
        // console.log("getGoodType: " + e.tapIndex) //item项下的key或index
        wx.setStorageSync('getGoodType', that.data.getGoodTypes[e.tapIndex])
        that.setData({
          getGoodType: that.data.getGoodTypes[e.tapIndex]
        })
      }
    })
  },
  /**
   * 检测是否选择了店铺
   */
  checkShop() {
    console.log("checkshop")
    if (wx.getStorageSync("shop")) {
      let shop = wx.getStorageSync("shop")
      // console.log('shop', JSON.stringify(shop))
      this.setData({
        shop: shop,
        addressId: shop.id
      })
    }

    if (wx.getStorageSync("checkedAddress")) {
      let temp = wx.getStorageSync("checkedAddress")
      console.log("checkedAddress: " + JSON.stringify(temp))

      let shop = {
        id: temp.id,
        name: temp.shopName,
        addr: temp.address
      }
      console.log(shop)
      this.setData({
        shop: shop,
        addressId: temp.id
      })
      // 客户选择了店铺，就要重置默认店铺
      wx.setStorageSync('shop', shop)
    }

    //获取店铺列表
    if (JSON.stringify(this.data.shop) == "{}") {
      this.getShopList()
    }

    wx.removeStorageSync('isSelectAddress');
    wx.removeStorageSync('getGoodType');
    wx.removeStorageSync('addressId')
  },
  /**
   * 获取所有店铺的列表
   */
  getShopList: function() {
    var that = this;
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.userLocation" 这个 scope
    try {
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userLocation']) {
            wx.authorize({
              scope: 'scope.userLocation',
              success() {
                wx.getLocation({
                  // type: 'wgs84',
                  success(res) {
                    console.log(res);
                    const latitude = res.latitude; //纬度
                    const longitude = res.longitude; //经度

                    var data = {
                      cur_lat: latitude,
                      cur_lng: longitude,
                      idList: ""
                    }
                    var func = (res2) => {
                      // console.log(res2)
                      if (res2.errno == 0) {
                        let tempList = util.insertSort(res2.data)
                        that.setData({
                          shopList: tempList,
                          shop: tempList[0],
                          addressId: tempList[0].id
                        })
                        wx.setStorageSync('shop', tempList[0])
                      } else {
                        wx.showModal({
                          title: '信息提示',
                          content: res2.errmsg,
                          showCancel: false
                        })
                      }
                    }
                    util.request(api.StoreList, data).then(func);
                  }
                })
              },
              fail(res) {
                util.showError(JSON.stringify(res))
                that.setData({
                  shopList: app.globalData.tempShopList,
                  shop: app.globalData.tempShopList[0],
                  addressId: app.globalData.tempShopList[0].id
                })
              }
            })
          } else {
            wx.getLocation({
              // type: 'wgs84',
              success(res) {
                // console.log(res);
                const latitude = res.latitude; //纬度
                const longitude = res.longitude; //经度

                var data = {
                  cur_lat: latitude,
                  cur_lng: longitude,
                  idList: ""
                }
                var func = (res2) => {
                  // console.log(res2)
                  if (res2.errno == 0) {
                    let templist = util.insertSort(res2.data)

                    that.setData({
                      shopList: templist,
                      shop: templist[0],
                      addressId: templist[0].id
                    })
                    wx.setStorageSync('shop', templist[0])
                  } else {
                    wx.showModal({
                      title: '信息提示',
                      content: res2.errmsg,
                      showCancel: false
                    })
                  }
                }
                util.request(api.StoreList, data).then(func);
              },
              fail(res) {
                util.showError(JSON.stringify(res))
                that.setData({
                  shopList: app.globalData.tempShopList,
                  shop: app.globalData.tempShopList[0],
                  addressId: app.globalData.tempShopList[0].id
                })
              }
            })
          }
        }
      })

    } catch (err) {
      util.showError(JSON.stringify(err))
      that.setData({
        shopList: app.globalData.tempShopList,
        shop: app.globalData.tempShopList[0],
        addressId: app.globalData.tempShopList[0].id
      })
    }
  },

  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.checkShop();

  },
  goAddress() {
    wx.navigateTo({
      url: "/pages/ucenter/address/address"
    });
  },

  //获取checkout信息
  getCheckoutInfo: function() {
    let that = this;

    let data = {
      cartId: that.data.cartId,
      offlineAddressId: that.data.offlineAddressId,
      couponId: that.data.couponId,
      grouponRulesId: that.data.grouponRulesId
    }
    console.log('getCheckoutinfo data' + JSON.stringify(data))
    util.request(api.OffCartCheckout, data).then(function(res) {
      console.log(res)
      if (res.errno === 0) {
        let centerInfo = wx.getStorageSync("centerUserInfo");
        let customUserInfo = wx.getStorageSync('customMemberData')
        let userInfo = wx.getStorageSync('userInfo')
        let tempAddress = res.data.checkedAddress;
        let newCheckedAddress = tempAddress[0]
        


        

        that.setData({
          checkedGoodsList: res.data.checkedGoodsList,
          checkedAddress: newCheckedAddress,
          fastAddress: res.data.checkedOfflineAddress,
          availableCouponLength: res.data.availableCouponLength,
          actualPrice: res.data.actualPrice,
          couponPrice: res.data.couponPrice,
          grouponPrice: res.data.grouponPrice,
          freightPrice: res.data.freightPrice,
          goodsTotalPrice: res.data.goodsTotalPrice,
          orderTotalPrice: res.data.orderTotalPrice,
          offlineAddressId: res.data.offlineAddressId,
          couponId: res.data.couponId,
          grouponRulesId: res.data.grouponRulesId
        });

        that.getFastAddress()
        that.checkGetGoodType();

      } else {
        util.showError("getCheckoutinfo: " + JSON.stringify(res))
      }
    });


  },
  selectAddress() {
    wx.navigateTo({
      url: '../../userCenterPages/selectAddress/selectAddress'
    })
  },
  selectCoupon() {
    wx.navigateTo({
      url: '/pages/ucenter/couponSelect/couponSelect',
    })
  },
  bindMessageInput: function(e) {
    this.setData({
      message: e.detail.value
    });
  },

  bindPickerChange: function(e) {
    this.setData({
      getGoodDate: this.data.timeList[parseInt(e.detail.value)]
    })
  },

  getTimeList: function() {
    var that = this;
    try {
      var func = function(res) {
        if (res.errno == 0) {
          that.setData({
            timeList: res.data
          })
        } else {
          wx.showModal({
            title: '提示信息',
            content: res.errmsg,
            showCancel: false
          })
        }
      }
      util.request(api.DeliveryList).then(func);

    } catch (err) {
      util.showError("getTimeList: " + JSON.stringify(err))
    }
  },
  onReady: function() {
    // 页面渲染完成
    this.getTimeList();
    let userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo: userInfo
    })
    // console.log("userInfo: " + JSON.stringify(userInfo))
  },
  /**
   * 检查是否选择了快递地址
   */
  checkIsSelectAddress() {
    let isSelectAddress = wx.getStorageSync('isSelectAddress')
    // console.log("isSelectAddress: " + isSelectAddress)
    if (isSelectAddress) {
      this.setData({
        isSelectAddress: true
      })
    }
  },
  /**
   * 获取快递地址
   */
  getFastAddress() {
    this.checkIsSelectAddress()
    if (!this.data.isSelectAddress) {
      return
    }
    try {
      let offlineAddressId = wx.getStorageSync('offlineAddressId')
      if (offlineAddressId) {
        let func = (res) => {
          if (res.errno === 0) {
            // console.log("getFastAddress: " + JSON.stringify(res.data))
            this.setData({
              fastAddress: res.data
            })
            wx.removeStorageSync("offlineAddressId")
          } else {
            util.showError('getFastAddress ' + res.errmsg)
          }
        }
        util.request(api.AddressDetail, {
          id: offlineAddressId
        }).then(func)
      }
    } catch (err) {
      util.showError("getFastAddress: " + JSON.stringify(err))
    }


  },

  onShow: function() {
    // 页面显示
    wx.showLoading({
      title: '加载中...',
    });
    user.checkedBindPhone()
    try {
      var cartId = wx.getStorageSync('cartId');
      if (cartId === "") {
        cartId = 0;
      }

      var couponId = wx.getStorageSync('couponId');
      if (couponId === "") {
        couponId = 0;
      }
      var grouponRulesId = wx.getStorageSync('grouponRulesId');
      if (grouponRulesId === "") {
        grouponRulesId = 0;
      }
      var grouponLinkId = wx.getStorageSync('grouponLinkId');
      if (grouponLinkId === "") {
        grouponLinkId = 0;
      }

      this.setData({
        cartId: cartId,
        couponId: couponId,
        grouponRulesId: grouponRulesId,
        grouponLinkId: grouponLinkId,
      });
      this.getCheckoutInfo();
    } catch (err) {
      // Do something when catch error
      // console.log(err)
      util.showError("onshow: " + JSON.stringify(err))
    }

  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  },
  //选择时间
  bindDateChange: function(e) {
    this.setData({
      getGoodDate: e.detail.value
    })

  },


  submitOrder: function() {
    this.checkLogin()
    if (!this.data.hasLogin) {
      return
    }
    if (this.data.getGoodType === '') {
      wx.showModal({
        title: '提示信息',
        content: '请选择提货方式',
        showCancel: false,
      })
      return
    }
    if (this.data.getGoodDate == "" && this.data.getGoodType === "到店自提") {
      wx.showModal({
        title: '提示信息',
        content: '请选择提货时间',
        showCancel: false
      })
      return
    }

    if (this.data.getGoodType === "邮寄快递") {
      let offlineAddressId = wx.getStorageSync('offlineAddressId')
      this.setData({
        offlineAddressId: offlineAddressId
      })
    }

    if (this.data.offlineAddressId === 0 && this.data.getGoodType === "邮寄快递") {
      util.showErrorToast('请选择收货地址');
      return false;
    }

    let orderData = {
      deliveryTime: this.data.getGoodDate,
      cartId: parseInt(this.data.cartId),
      addressId: parseInt(this.data.addressId),
      offlineAddressId: parseInt(this.data.offlineAddressId),
      couponId: parseInt(this.data.couponId),
      message: this.data.message,
      grouponRulesId: parseInt(this.data.grouponRulesId),
      grouponLinkId: parseInt(this.data.grouponLinkId),
      actualPrice: parseInt(this.data.actualPrice),
    }
    // console.log("orderData" + JSON.stringify(orderData))
    wx.setStorageSync("orderData", orderData);
    try {
      if (this.data.actualPrice == 0) {
        util.request(api.OrderSubmit, orderData, 'POST').then(res => {
          if (res.errno === 0) {
            // 下单成功，重置couponId
            wx.setStorageSync('couponId', 0);

            const orderId = res.data.orderId;
            util.request(api.zeroPay, {
              orderId: orderId,
            }, 'POST').then(function(res2) {
              if (res2.errno === 0) {
                wx.showModal({
                  title: '信息提示',
                  content: '支付成功',
                  showCancel: false,
                  success(v) {
                    if (v.confirm) {
                      wx.reLaunch({
                        url: '../../pages/ucenter/index/index',
                      })
                    }
                  }
                })
              } else {
                util.showError('0元付款请求： ' + JSON.stringify(res2))
              }
            })
          } else {
            util.showError("0元付款时： " + JSON.stringify(res))
          }
        })
      } else {
        let orderData = wx.getStorageSync("orderData")
        util.request(api.OrderSubmit, orderData, 'POST').then(res => {
          if (res.errno === 0) {
            // 下单成功，重置couponId
            wx.setStorageSync('couponId', 0);

            const orderId = res.data.orderId;
            wx.setStorageSync("orderId", orderId)
            wx.navigateTo({
              url: '../../userCenterPages/selectPay/selectPay',
            })
          } else {
            wx.showModal({
              title: '信息提示',
              content: res.errmsg,
              showCancel:false
            })
            // util.showError('非0元付款时: ' + JSON.stringify(res))
          }
        })

      }
    } catch (err) {
      util.showError("submitOrder: " + JSON.stringify(err))
    }
  }
});