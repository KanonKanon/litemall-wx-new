const app = getApp();
const api = require("../../../config/api.js");
const utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    psw: null,
    pswEnsure: null,
    code: null,

    flag: false,
    currentTime: '获取验证码',
    codeDis: false,
  },
  pswInput: function(e) {
    this.setData({
      psw: e.detail.value
    })
  },

  pswEnsureInput: function(e) {
    this.setData({
      pswEnsure: e.detail.value
    })
  },

  codeInput: function(e) {
    this.setData({
      code: e.detail.value
    })
  },


  sendCode: function() {
    var userInfo = wx.getStorageSync("centerUserInfo")
    var that = this
    var url = api.RegCaptcha;
    var data = {
      mobile: userInfo.userPhone,
    };
    var func = (res) => {
      wx.hideLoading()
      if (res.errno == 0) {
        that.setData({
          codeDis: true,
          currentTime: 60
        })
        var time = setInterval(() => {
          var currentTime = that.data.currentTime
          currentTime--
          that.setData({
            currentTime: currentTime
          })
          if (currentTime == 0) {
            clearInterval(time)
            that.setData({
              codeDis: false,
              currentTime: "获取验证码",
              flag: true
            })
          }
        }, 1000)
      } else {
        wx.showModal({
          title: '信息提示',
          content: res.errmsg,
          showCancel: false
        })
      }
    }

    utils.request(url, data, "POST").then(func);

  },

  submit: function() {
    var psw = this.data.psw
    var pswEnsure = this.data.pswEnsure
    var code = this.data.code
    if (code == null || code == "") {
      wx.showModal({
        title: '信息提示',
        content: "验证码不能为空",
        showCancel: false
      })
      return
    }
    if (psw != pswEnsure) {
      wx.showModal({
        title: '信息提示',
        content: "两次输入的密码不相同",
        showCancel: false
      })
      return
    }
    if (psw == null || psw == "") {
      wx.showModal({
        title: '信息提示',
        content: "密码不能为空",
        showCancel: false
      })
      return
    }

    var url = api.Reset;
    var data = {
      newPassword: psw,
      code: code
    };
    var func = (res) => {
      if (res.errno == 0) {
        wx.showModal({
          title: '提示信息',
          content: '操作成功',
          showCancel: false,
          success(v) {
            if (v.confirm) {
              wx.navigateTo({ //打开新页面
                url: '../myCard/myCard'
              })
            }
          }
        })

      } else {
        wx.showModal({
          title: '提示信息',
          content: res.errmsg,
          showCancel: false
        })
      }

    }
    
    utils.request(url,data,"POST").then(func);

  }


})