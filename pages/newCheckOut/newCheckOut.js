// pages/newCheckOut/newCheckOut.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['广东省', '佛山市', '顺德区'],
    customItem: '全部',
    getGoodType: '',
    getGoodTypes: ['到店自提', '邮寄快递'],
    checkedAddress: {},
    getGoodDate: '',
    timeList: [],
    number: 0,
    skuId: 0,
    checkedProduct: {},
    message: '',
    shop: {},
    shopList: [],
    isSelectAddress: false,
    fastAddress: {},
    offlineAddressId: 0,
    checkUserInfo:{}
  },

  checkIsSelectAddress() {
    let isSelectAddress = wx.getStorageSync('isSelectAddress')
    console.log("isSelectAddress " + isSelectAddress)
    if (isSelectAddress != '') {
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
    if (this.data.isSelectAddress === false) {
      return
    }
    let offlineAddressId = wx.getStorageSync('offlineAddressId')
    if(!offlineAddressId){
      return
    }
    let func = (res) => {
      if (res.errno === 0) {
        console.log(res.data)
        this.setData({
          fastAddress: res.data
        })
      } else {
        util.showError('getFastAddress ' + res.errmsg)
      }
    }
    util.request(api.AddressDetail, {
      id: offlineAddressId
    }).then(func)
  },

  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },

  submitOrder: function() {
    const that = this

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

    if (this.data.offlineAddressId <= 0 && this.data.getGoodType === "邮寄快递") {
      util.showErrorToast('请选择收货地址');
      return false;
    }

    let checkoutData = wx.getStorageSync("checkoutData")

    var orderData = {
      skId:checkoutData.skId,
      serialnumber: checkoutData.serialnumber,
      deliveryTime: this.data.getGoodDate,
      message: this.data.message,
    }
    console.log(orderData)
    wx.setStorageSync("orderData", orderData);
    util.request(api.OffMmaSkSubmit, orderData, 'POST').then(res => {
      if (res.errno === 0) {
        // 下单成功，重置couponId
        try {
          wx.setStorageSync('couponId', 0);
        } catch (error) {
          wx.showModal({
            title: '信息提示',
            content: error,
          })
        }
        const orderId = res.data.orderId;
        wx.setStorageSync("orderId", orderId)
        wx.navigateTo({
          url: '../../userCenterPages/selectPay/selectPay',
        })
      } else {
        wx.showModal({
          title: '信息提示',
          content: res.errmsg,
        })
      }
    })



  },

  /**
   * 获取时间列表
   */
  getTimeList: function() {
    var that = this;
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
  },
  //显示弹出层
  showPopup: function() {
    var that = this;
    wx.showActionSheet({
      itemList: that.data.timeList,
      success: function(e) {
        console.log(e.tapIndex) //item项下的key或index
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
        console.log(e.tapIndex) //item项下的key或index
        that.setData({
          getGoodType: that.data.getGoodTypes[e.tapIndex]
        })
      }
    })
  },

  /**
   * 选择地址
   */
  selectAddress() {
    wx.navigateTo({
      url: '../../userCenterPages/selectAddress/selectAddress'
    })
  },

  //选择时间
  bindDateChange: function(e) {
    this.setData({
      getGoodDate: e.detail.value
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
  /**
   * 检测是否选择了店铺
   */
  checkShop() {
    //获取店铺列表
    if (this.data.shopList.length == 0 && JSON.stringify(this.data.shop) == "{}") {
      this.getShopList()
    }
    
  },

  //跳转选择快递地址
  goAddress() {
    wx.navigateTo({
      url: "/pages/ucenter/address/address"
    });
  },

  /**
   * 获取店铺地址
   */
  getShopList: function() {
    var that = this;
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.userLocation" 这个 scope
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              wx.getLocation({
                type: 'wgs84',
                success(res) {
                  console.log(res);
                  const latitude = res.latitude; //纬度
                  const longitude = res.longitude; //经度

                  var data = {
                    cur_lat: latitude,
                    cur_lng: longitude,
                    shop: res2.data[0]
                  }
                  var func = (res2) => {
                    console.log(res2)
                    if (res2.errno == 0) {
                      var citys = [];
                      res2.data.forEach((v) => {
                        if (citys.indexOf(v.city) == -1) {
                          citys.push(v.city);
                        }
                      })
                      that.setData({
                        shopList: res2.data,
                        shop: res2.data[0]
                      })
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
            }
          })
        } else {
          wx.getLocation({
            type: 'wgs84',
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
                console.log(res2)
                if (res2.errno == 0) {
                  var citys = [];
                  res2.data.forEach((v) => {
                    if (citys.indexOf(v.city) == -1) {
                      citys.push(v.city);
                    }
                  })
                  
                  that.setData({
                    shopList: res2.data,
                  })
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
        }
      }
    })


  },
  /**
   * 
   */
  getUserInfo(){
    let centerUserInfo = wx.getStorageSync("centerUserInfo")
    let customUserInfo = wx.getStorageSync("customMemberData")
    let wxUserInfo = wx.getStorageSync("userInfo")
    let checkUserInfo={}
    if(centerUserInfo){
      checkUserInfo = centerUserInfo
    }
    else{
      if(customUserInfo){
        checkUserInfo = customUserInfo
      }
      else{
        checkUserInfo = {
          userName:wxUserInfo.nickName,
          userPhone:wxUserInfo.userPhone
        }
      }
    }
    if(checkUserInfo){
      this.setData({
        checkUserInfo
      })
    }

  },

  //获取店铺数据
  getShopData(){
    let shopList = this.data.shopList.length ? this.data.shopList : app.globalData.tempShopList
    let shopname = wx.getStorageSync("shopName")
    let shop = {}
    shopList.map(s=>{
      if(s.name===shopname){
        shop = s
      }
    })
    shop.isDefault = true
    this.setData({
      shop:shop
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getTimeList()
    this.checkShop()
    let checkoutData= wx.getStorageSync('checkoutData')
    if (checkoutData){
      this.setData({
        checkoutData
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      checkedProduct: this.data.checkedProduct
    })

  },
  /**
   * 检查可选的提货方式
   */
  checkGetGoodType() {
    let deliveryWay = wx.getStorageSync("deliveryWay")
    if (deliveryWay) {
      if (deliveryWay === 1) {
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
    } else {
      this.setData({
        getGoodTypes: ['到店自提', '邮寄快递'],
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getUserInfo()
    this.getShopData()
    this.getFastAddress()
    this.checkGetGoodType()

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