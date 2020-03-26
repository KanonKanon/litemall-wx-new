const app = getApp()
const getApi = getApp().globalData.getApi

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

  pswInput: function (e) {
    this.setData({
      psw: e.detail.value
    })
  },

  pswEnsureInput: function (e) {
    this.setData({
      pswEnsure: e.detail.value
    })
  },

  codeInput: function (e) {
    this.setData({
      code: e.detail.value
    })
  },


  sendCode: function () {
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
      url: getApi + 'login/sendCodeByOpenId',
      data: {
        thirdSession: wx.getStorageSync('thirdSession'),
      },
      success: function (res) {
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

  submit: function () {
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
    wx.showLoading({
      title: '请稍后',
    })
    wx.request({
      header: {
        "Content-Type": "application/json"
      },
      method: 'POST',
      url: getApi + 'login/forgetPassword',
      data: {
        thirdSession: wx.getStorageSync('thirdSession'),
        psw: psw,
        code: code
      },
      success: function (res) {
        wx.hideLoading()

        if (res.data.state) {

          app.globalData.userInfo = res.data

          wx.redirectTo({
            url: '../index/index'
          })
        }
        else {
          var errMsg = res.data.errMsg
          showErr(errMsg)
          return
        }
      }
    })
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