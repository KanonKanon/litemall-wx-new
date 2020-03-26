// pages/ucenter/couponDetail/couponDetail.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  felters:{

  },

  /**
   * 页面的初始数据
   */
  data: {
    couponData:{
      addTime:"2020-02-24 09:08:17",
      days:100,
      deleted:false,
      desc:"测试券测试券测试券",
      discount:1000,
      goodsType:1,
      goodsValue:[],
      id:21,
      limit:1,
      min:1,
      name:"测试券",    
      status:0,
      tag:"测试",
      timeType:0,
      total:10,
      type:0,
      updateTime:"2020-02-24 16:03:30"
    },
    id:21,
    hasLogin:false,
    bgUrl:'https://litemall.bingold.cn/wx/storage/fetch/u32fvljsiba55n3508zb.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        id:options.id
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getCouponData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.checkLogin()
  },
  /**
   * 获取优惠券数据
   */
  getCouponData() {
    const func=(res)=>{
      console.log(res)
      if(res.errno===0){
        this.setData({
          couponData:res.data
        })
      }
      else{
        util.showError(res.errmsg)
      }
    }
    const data={
      couponId:this.data.id
    }
    util.request(api.CouponDetail,data).then(func).catch((e)=>{
      util.showError(e)
    })
  },
  checkLogin() {
    var hasLogin = wx.getStorageSync('hasLogin')
    if (hasLogin != '') {
      this.data.hasLogin = hasLogin;
      this.setData({
        hasLogin: hasLogin
      })
    }

  },

  goLogin() {
    if (this.data.hasLogin === false) {
      wx.showModal({
        title: '未登录',
        content: '没有登录，部分功能会受到限制哦！',
        showCancel: true,
        confirmText: '去登录',
        cancelText: '不登录',
        success: function (res) {
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
   *领取优惠券
   */
  getCoupon() {
    this.goLogin();
    let couponId = this.data.id
    util.request(api.CouponReceive, {
      couponId: couponId
    }, 'POST').then(res => {
      if (res.errno === 0) {
       wx.showModal({
         title: '信息提示',
         content: '领取成功',
         showCancel:false,
         success(res){
           if(res.confirm){
             wx.navigateTo({
               url: '../../index/index',
             })
           }
         }
       })
      } else {
        util.showErrorToast(res.errmsg);
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