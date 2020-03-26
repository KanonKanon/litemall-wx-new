// userCenterPages/selectAddress/selectAddress.js
const util = require("../../utils/util.js");
const api = require("../../config/api.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityVal: "佛山市",
    shopList: [],
    citys: []
  },
  getTempShopList() {
    const that = this
    if (!that.data.shopList.length) {
      let citys = that.getCitys(app.globalData.tempShopList)
      that.setData({
        shopList: app.globalData.tempShopList,
        citys: citys
      })
    }
  },

  //选择城市
  areaSelect: function(e) {
    console.log(e);
    this.setData({
      cityVal: this.data.citys[parseInt(e.detail.value)]
    })
  },
  //搜索
  onSearch: function(e) {
    var templist = this.data.shopList;
    var resaultlist = [];
    if (e.detail == "") {
      this.getShopList()
    } else {
      var key = e.detail;
      var item
      this.data.shopList.forEach(v => {
        item = JSON.stringify(v)
        if (item.indexOf(key) > -1) {
          resaultlist.push(v)
        }
      })
      this.setData({
        shopList: resaultlist
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },


  onClick: function(e) {
    console.log(e)
    var item = e.currentTarget.dataset.item;
    let centerUserInfo = wx.getStorageSync("centerUserInfo");
    let addr = item.city + item.area + item.addr;
    var checkedAddress = {
      id: item.id,
      name: centerUserInfo.userName,
      isDefault: true,
      mobile: centerUserInfo.userPhone,
      shopName: item.name,
      address: addr
    }
    wx.setStorageSync("checkedAddress", checkedAddress);

    wx.navigateBack({
      delta: 1
    })
  },
  onReady() {
    this.getShopList();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function() {
    setTimeout(() => {
      this.getTempShopList()
    }, 2000)
  },

  getShopList: function() {
    const that = this;
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.userLocation" 这个 scope
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
                    cur_lng: longitude
                  }
                  var func = (res2) => {
                    if (res2.errno == 0) {

                      let citys = that.getCitys(res2.data)
                      const tempList = util.insertSort(res2.data)
                      console.log(tempList)
                      that.setData({
                        shopList: tempList,
                        citys: citys
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
                },
                fail(res) {
                  that.setData({
                    shopList: app.globalData.tempShopList
                  })
                }
              })
            }
          })
        } else {
          wx.getLocation({
            // type: 'wgs84',
            success(res) {
              console.log(res);
              const latitude = res.latitude; //纬度
              const longitude = res.longitude; //经度

              var data = {
                cur_lat: latitude,
                cur_lng: longitude
              }
              var func = (res2) => {
                console.log(res2)
                if (res2.errno == 0) {
                  let citys = that.getCitys(res2.data)
                  let tempList = util.insertSort(res2.data)
                  console.log(tempList)
                  that.setData({
                    shopList: tempList,
                    citys: citys
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
            },
            fail(res) {
              that.setData({
                shopList: app.globalData.tempShopList
              })
            }
          })
        }
      }
    })


  },

  getCitys(list) {
    let citys = [];
    list.forEach((v) => {
      if (citys.indexOf(v.city) === -1) {
        citys.push(v.city);
      }
    })
    return citys
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