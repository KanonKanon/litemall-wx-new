// userCenterPages/sellerCenter/setllementCenter/getMoney/getMoney.js
var util = require('../../../../utils/util.js');
var api = require('../../../../config/api.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    useWeiXinWallet:false,
    centerInfo:{},
    money:0

  },
/**
 * 输入提现金额
 */
  moneyInput(e){
    this.setData({
      money:e.detail.value
    })
  },


  /**
   * 获取数据
   */
  getCenterInfo() {
    var that = this
    var func = (res) => {
      console.log(res)
      if (res.errno == 0) {
        that.setData({
          centerInfo: res.data
        })
      }
      else {
        util.showError(res.errmsg);
      }
    }

    util.request(api.DistributionBalanceInfo).then(func);

  },

/**
 * 提现操作
 */
  getMoney(){
    if(this.data.money==""){
      util.showError("请输入提现金额！")
      return
    }
    let data = { timeStamp: "1586835661", package: "sendid=18b2e897ed0a89800fe544886300721946f5c1e002d…601fde97bef0d20ec6&mchid=10072459&spid=1225778602", paySign: "D5632CAF6E4F1BD79A1321D965DD07F4", signType: "MD5", nonceStr: "Y3lSqfV9c9lZcI07gHmoHQKeO9Nnn1EZ" }
    wx.sendBizRedPacket({
      timeStamp: data.timeStamp, // 支付签名时间戳，
      nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
      package: data.package, //扩展字段，由商户传入
      signType: data.signType, // 签名方式，
      paySign: data.paySign, // 支付签名
      success: function (v) {
        util.showError('操作成功')
      },
      fail: function (v) { },
      complete: function (v) { }
    })
    var that=this
    // var func=(res)=>{
    //   console.log(res)
    //   if(res.errno==0){
    //     let data = res.data
    //     wx.sendBizRedPacket({
    //       timeStamp: data.timeStamp, // 支付签名时间戳，
    //       nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
    //       package: data.package, //扩展字段，由商户传入
    //       signType: data.signType, // 签名方式，
    //       paySign: data.paySign, // 支付签名
    //       success: function (v) {
    //         util.showError('操作成功')
    //       },
    //       fail: function (v) { },
    //       complete: function (v) { }
    //     })
    //     wx.showModal({
    //       title: '信息提示',
    //       content: '操作成功',
    //       showCancel:false,
    //       success(v){
    //         if(v.confirm){
    //           wx.navigateBack({
    //             delta:1
    //           })
    //         }
    //       }
    //     })
    //     let data = res.data
       
    //   }
    //   else{
    //     util.showError(res.errmsg)
    //   }
    // }
    // var data={
    //   value:this.data.money
    // }
    // util.request(api.DistributionBalanceTx,data,'POST').then(func)
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
    this.getCenterInfo()
  },
  /**
   * 跳转到选择账户
   */
  goToSelectAcount:function(){
    wx.navigateTo({
      url: '/userCenterPages/sellerCenter/setllementCenter/selectAcount/selectAcount',
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