// userCenterPages/sellerCenter/setllementCenter/selectAcount/selectAcount.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankCardInfo:{},
    useWeiXinWallet:false,
    userInfo:{}
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
    if(wx.getStorageSync("userInfo")!=""){
      let userInfo = wx.getStorageSync("userInfo")
      this.setData({
        userInfo:userInfo
      })
    }


    if (wx.getStorageSync("useWeiXinWallet")!=""){
      let useWeiXinWallet = wx.getStorageSync("useWeiXinWallet")
      this.setData({
        useWeiXinWallet:useWeiXinWallet
      })
    }

    if(wx.getStorageSync("bankCardInfo")!=""){
      let bankCardInfo = wx.getStorageSync("bankCardInfo")
      this.setData({
        bankCardInfo:bankCardInfo
      })
    }
  },
/**
 * 设置银行卡
 */
  setCard:function(){
    wx.navigateTo({
      url: '/userCenterPages/sellerCenter/setllementCenter/setCard/setCard',
    })
  },

  setWeiXin:function(){
    let userInfo=wx.getStorageSync("userInfo")
    wx.showActionSheet({
      itemList: [userInfo.nickName,"提现到该账户"],
      success(res) {
        wx.setStorageSync("useWeiXinWallet",true)
        wx.redirectTo({
          url: '/userCenterPages/sellerCenter/setllementCenter/getMoney/getMoney',
        })
      },
      fail(res) {
        console.log(res.errMsg)
        wx.setStorageSync("useWeiXinWallet", false)
      }
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