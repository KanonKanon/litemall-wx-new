// userCenterPages/bindPhone/bindPhone.js
const app=getApp();
const util=require("../../utils/util.js");
const api=require("../../config/api.js");
const user=require("../../utils/user.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  bindPhoneNumber:function(e){
    var that = this;
    if (e.detail.detail.errMsg != "getPhoneNumber:ok") {
      // 拒绝授权
      return;
    }
    // if (!app.globalData.hasLogin) {
    //   wx.showToast({
    //     title: '绑定失败：请先登录',
    //     icon: 'none',
    //     duration: 2000
    //   });
    //   return;
    // }
    let userInfo = wx.getStorageSync("userInfo")
    that.popup.hidePopup();
    util.request(api.AuthBindPhone, {
      iv: e.detail.detail.iv, //电话号在里面
      encryptedData: e.detail.detail.encryptedData
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        userInfo.userPhone = res.data;
        wx.setStorageSync("userInfo", userInfo)
        that.setData({
          userInfo: userInfo
        })
        wx.showToast({
          title: '绑定成功',
          duration: 2000
        })
        wx.navigateBack({
          delta:1,
          success:function(){
            user.checkedBindPhone();
          }
        })
        console.log("跳转返回上一页")

      } else {
        wx.showModal({
          title: '信息提示',
          content: res.errmsg,
          showCancel: false
        })
      }
    });
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
    this.popup=this.selectComponent("#pop")
    this.popup.showPopup();
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