var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var user = require('../../../utils/user.js');
var utils = require('../../../utils/util.js');

var app = getApp();
Page({
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成

  },
  onReady: function() {

  },
  onShow: function() {
    // 页面显示
    wx.removeStorageSync("isGoLogin")
  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  },
  wxLogin: function(e) {
    var that = this;
    if (e.detail.userInfo == undefined) {
      app.globalData.hasLogin = false;
      util.showErrorToast('微信登录失败');
      return;
    }
    user.checkLogin().catch(() => {
      user.loginByWeixin(e.detail.userInfo).then(res => {
        app.globalData.hasLogin = true;
        console.log(res)
        //测试没有绑定手机
        // res.data.userInfo.userPhone=""
        wx.setStorageSync("hasLogin", app.globalData.hasLogin)
        wx.setStorageSync("userInfo", res.data.userInfo)
        wx.showToast({
          title: '登陆成功',
          duration: 1000
        });
        wx.navigateBack({
          delta:1,
          complete:function(){
            setTimeout(()=>{
              user.checkedBindPhone();
              user.checkedDistribution();
            },500)
          }
        })
       

      }).catch((err) => {
        console.log(err)
        app.globalData.hasLogin = false;
        util.showError('微信登录失败');
      });

     
    });
  },
  accountLogin: function() {
    wx.navigateTo({
      url: "/pages/auth/accountLogin/accountLogin"
    });
  },

})