const app = getApp()
const getApi = getApp().globalData.getApi
const utils = require('../../utils/util.js');

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

  onLoad: function(options) {
    let phone = options.phone,
      prepaidCard = options.prepaidCard;
    this.setData({
      phone: phone,
      prepaidCard: prepaidCard
    })
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
    var that = this
    wx.showLoading({
      title: '正在发送',
      mask: true
    })
    wx.request({
      header: {
        "Content-Type": "application/json"
      },
      method: 'POST',
      url: getApi + 'login/sendCodeWithout',
      data: {
        phone: that.data.phone,
      },
      success: function(res) {
        wx.hideLoading()
        if (res.data.state) {
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
          var errMsg = res.data.errMsg
          showErr(errMsg)
        }
      }
    })
  },

  submit: function() {
    var psw = this.data.psw
    var pswEnsure = this.data.pswEnsure
    var code = this.data.code
    if (code == null || code == "") {
      showErr("验证码不能为空")
      return
    }
    if (psw != pswEnsure) {
      showErr("两次输入的密码不相同")
      return
    }
    if (psw == null || psw == "") {
      showErr("密码不能为空")
      return
    }

    let url ='login/forgetPayPassword';
    let data = {
      prepaidCard: this.data.prepaidCard,
      phone: this.data.phone,
      psw: psw,
      code: code,
      thirdSession: wx.getStorageSync('thirdSession')
    };

    let func = function(res) {
      if (res.data.state) {

        utils.success();
        wx.navigateTo({ //打开新页面
          url: '../setPwd/setPwd'
        })
      } else {
        var errMsg = res.data.errMsg
        showErr(errMsg)
        return
      }

    };
    utils.request(url, data, func);
  }


})

function showErr(errMsg) {
  wx.showModal({
    title: "发生错误",
    content: errMsg,
    showCancel: false,
    confirmText: "确定"
  })
}