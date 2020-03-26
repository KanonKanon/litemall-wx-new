const app = getApp();
const getApi = getApp().globalData.getApi;
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prepaidCard: null,
    cardPwd: null,
    phone: null,
    psw: null,

    events: ['cardVerified', 'registered'],
    step: 0,

    flag: false,
    currentTime: '获取验证码',
    codeDis: true,
    //控制电话能否输入
    phoneDis: false
  },

  cardInput: function(e) {
    this.setData({
      prepaidCard: e.detail.value
    })
  },
  cardPwdInput: function(e) {
    this.setData({
      cardPwd: e.detail.value
    })
  },
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    });
    if (this.data.phone.length == 11) {
      this.setData({
        codeDis: false
      })
    } else {
      this.setData({
        codeDis: true
      })
    }
  },
  pswInput: function(e) {
    this.setData({
      psw: e.detail.value
    })
  },
  //输入验证码
  codeInput: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  //再次输入密码
  pswTest: function(e) {
    this.setData({
      pswTest: e.detail.value
    })
  },

  //卡密验证
  cardVerified: function() {
    let that = this;
    let prepaidCard = this.data.prepaidCard;
    let cardPwd = this.data.cardPwd;

    if (prepaidCard == null || prepaidCard == "") {
      utils.showErr("随享卡号不能为空!");
      return
    }
    if (cardPwd == null || cardPwd == "") {
      utils.showErr("密码不能为空!");
      return
    }

    let url = 'login/cardVerified';

    let data = {
      thirdSession: wx.getStorageSync('thirdSession'),
      prepaidCard: prepaidCard,
      paidPsw: cardPwd
    };

    let func = (res) => {
      if (res.data.state) {
        this.setData({
          step: 1
        })
      } else {
        let errMsg = res.data.errMsg;
        if (errMsg == "true") {
          wx.redirectTo({
            url: '../setPwd/setPwd'
          });
          return;
        }
        utils.showErr(errMsg);
      }
    };

    utils.request(url, data, func);


  },

  /**
   *
   * 发送验证码
   *
   */
  sendCode: function() {

    let that = this;
    let url = 'login/sendCode';

    let data = {
      phone: this.data.phone,
    };

    let func = (res) => {
      if (res.data.state) {
        utils.sendCode(that)
      } else {
        let errMsg = res.data.errMsg;
        utils.showErr(errMsg);
        that.setData({
          phoneDis: false,
        })
      }
    };

    utils.request(url, data, func);

  },

  /**
   *
   * 忘记密码
   *
   */
  forget: function() {
    let prepaidCard = this.data.prepaidCard;
    if (prepaidCard == null || prepaidCard == "") {
      utils.showErr("随享卡号不能为空!");
      return
    }

    let data = {
      prepaidCard: prepaidCard
    };
    let func = (res) => {
      if (res.data.state) {
        wx.navigateTo({
          url: '../forgetPayPwd/forgetPayPwd?phone=' + res.data.obj + '&prepaidCard=' + this.data.prepaidCard
        })
      } else {
        let errMsg = res.data.errMsg;
        utils.showErr(errMsg)
      }
    };
    utils.post('login/toForget', data, func);
  },

  /**
   *
   * 登陆
   *
   */
  registered: function() {
    let that = this;
    let code = this.data.code;
    let psw = this.data.psw;
    let pswTest = this.data.pswTest;
    let prepaidCard = this.data.prepaidCard;
    let cardPwd = this.data.cardPwd;
    let phone = this.data.phone;

    if (code == null || code == "") {
      utils.showErr("验证码不能为空");
      return
    }
    if (psw != pswTest) {
      utils.showErr("两次输入的密码不相同");
      return
    }
    if (psw == null || psw == "") {
      utils.showErr("密码不能为空");
      return
    }

    let url = 'login/registered';

    let data = {
      thirdSession: wx.getStorageSync('thirdSession'),
      psw: psw,
      phone: phone,
      prepaidCard: prepaidCard,
      paidPsw: cardPwd,
      code: code
    };

    let func = (res) => {
      console.log(res);
      if (res.data.state) {
        app.globalData.userInfo = res.data;
        console.log(app.globalData.userInfo);
        wx.redirectTo({
          url: '../index/index'
        })
      } else {
        let errMsg = res.data.errMsg;
        utils.showErr(errMsg);
      }
    };

    utils.request(url, data, func);
  }



});