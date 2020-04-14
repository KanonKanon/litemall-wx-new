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
    var that=this
    var func=(res)=>{
      console.log(res)
      if(res.errno==0){
        wx.showModal({
          title: '信息提示',
          content: '操作成功',
          showCancel:false,
          success(v){
            if(v.confirm){
              wx.navigateBack({
                delta:1
              })
            }
          }
        })
        
       
      }
      else{
        util.showError(res.errmsg)
      }
    }
    var data={
      value:this.data.money
    }
    util.request(api.DistributionBalanceTx,data,'POST').then(func)
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