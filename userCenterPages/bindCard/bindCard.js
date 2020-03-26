// userCenterPages/bindCard/bindCard.js
const api=require("../../config/api.js");
const app=getApp();
const utils=require("../../utils/util.js");
const user=require("../../utils/user.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bindType:"pwd",
    cardNum:"",
    password:"",
    code:"",
    sendDisable:false,
    count:60

  },
  //绑定操作
  bindConfirm:function(){
    if(this.data.cardNum==""){
      wx.showModal({
        title: '信息提示',
        content: '预付卡号不能为空',
        showCancel:false
      })
      return;
    }
    else if(this.data.cardNum.length!=19){
      wx.showModal({
        title: '信息提示',
        content: '预付卡号不足19位',
        showCancel: false
      })
      return;
    }
    else if (this.data.password=="" && this.data.bindType=="pwd") {
      wx.showModal({
        title: '信息提示',
        content: '密码不能为空',
        showCancel: false
      })
      return;
    }
    else if (this.data.password.length != 6 && this.data.bindType == "pwd") {
      wx.showModal({
        title: '信息提示',
        content: '密码位数不足6位',
        showCancel: false
      })
      return;
    }
    else if (this.data.code == "" && this.data.bindType == "code") {
      wx.showModal({
        title: '信息提示',
        content: '验证码不能为空',
        showCancel: false
      })
      return;
    }
    
    
    var data={};
    if(this.data.bindType=="pwd"){
       data={
         prepaidCard:this.data.cardNum,
         password:this.data.password
       }
    }
    else if (this.data.bindType=="code"){
      data={
        prepaidCard: this.data.cardNum,
        code: this.data.code
      }
    }

    var func=(res)=>{
      if(res.errno==0){
        user.getUserCenterData();
        wx.showModal({
          title: '信息提示',
          content: '操作成功',
          showCancel:false,
          success:function(res){
            if(res.confirm){
              wx.reLaunch({
                url: '../../pages/ucenter/index/index',
              })
            }
          }
        })
      }
      else{
        wx.showModal({
          title: '错误提示',
          content: res.errmsg,
          showCancel:false
        })
      }
    }
    utils.request(api.Bing,data,"POST").then(func);
  },
  //计时
  countTime:function(){
    this.setData({
      sendDisable:true
    })
    var that=this;
    var timer=setInterval(()=>{
      that.data.count--;
      if(that.data.count<=0){
        that.data.count=60;
        that.setData({
          sendDisable:false,
          count:that.data.count
        })
        clearInterval(timer);
      }
      that.setData({
        count:that.data.count
      })
    },1000)
  },

  //获取验证码
  getCode:function(){
    this.countTime();
    let userInfo=wx.getStorageSync("userInfo")
    var data={
      mobile:userInfo.userPhone
    }
    var func =(res)=>{
      if(res.errno==0){
        wx.showToast({
          title: '已发送验证码',
          duration:2000
        })
      }
      else{
        wx.showModal({
          title: '错误提示',
          content: res.errmsg,
          showCancel:false
        })
      }
    }
    utils.request(api.RegCaptcha,data,"POST").then(func);
  },
  //预卡号输入
  cardInput:function(e){
    this.setData({
      cardNum:e.detail
    })
  },
  //密码输入
  pwdInput:function(e){
    this.setData({
      password: e.detail
    })
  },
  //验证码输入
  codeInput:function(e){
    this.setData({
      code: e.detail
    })
  },
//绑定方式选择
  radioChange:function(e){
    this.setData({
      bindType:e.detail.value
    })
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