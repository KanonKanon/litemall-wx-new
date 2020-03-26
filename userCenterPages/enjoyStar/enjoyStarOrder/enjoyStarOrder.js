const utils = require('../../../utils/util.js');
const app = getApp();
const api = require("../../../config/api.js");
const user = require("../../../utils/user.js");
/**
 *
 * 询问是否继续购买
 *
 * @param that
 */
const ask = (that) => {
  let func2 = (that, num, moneyCount) => {
    let enjoyInfo = that.data.enjoyInfo;
    if (that.data.isAsk) {
      wx.showModal({
        title: '提示',
        content: '当天已购买' + num + '笔星享金,共' + moneyCount + '元,需要继续购买吗?',
        success: function(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../enjoyStarItem/enjoyStarItem?enjoyInfo=' + JSON.stringify(enjoyInfo)
            });
          } else if (res.cancel) {
            wx.redirectTo({
              url: '../../pages/index/index'
            });
          }
        }
      })
    } else {
      wx.redirectTo({
        url: '../../pages/index/index'
      });
    }
  }
  let userId = that.data.userInfo.id;
  let url = 'wxEnjoyStar/askAfterPayAnOrder';
  let data = {
    userId: userId
  };
  let func = (res) => {
    if (res.data.state) {
      let num = res.data.num;
      let moneyCount = res.data.moneyCount;
      func2(that, num, moneyCount);
    }
  };
  utils.request(url, data, "POST").then(func);

};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    point: 0,
    isPoint: true,
    isBankShow: true,
    isShow: true,
    isShow2: true,
    title: '请输入支付密码',
    isAsk: false,
    userInfo: {},
    orderData: {},
    wallet: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onReady: function() {
    this.refresh();
    this.pwdinput = this.selectComponent("#pwdinput")
  },
  onShow: function() {
    this.refresh();
    var wallet = wx.getStorageSync("wallet");
    this.setData({
      wallet: wallet
    })
  },
  refresh: function() {
    var that = this;
    let orderNumber = wx.getStorageSync("orderNumber");
    var data = {
      orderNumber: orderNumber
    }
    var func = (res) => {
      if (res.errno == 0) {
        that.setData({
          orderData: res.data
        })
      } else {
        wx.showModal({
          title: '信息提示',
          content: res.errmsg,
        })
      }
    }

    utils.request(api.EnjoyStarOrderDetail, data).then(func);

  },

  confirm2: function() {
    this.setData({
      isShow2: true,
      isShow: false
    })
  },

  /**
   *
   * 提现
   *
   */
  confirm: function() {
    this.pwdinput.hideInput();
    let that = this;
    wx.showLoading({
      title: "请稍候",
    });
    if (this.data.payPwd == null || this.data.payPwd == '') {
      wx.showModal({
        title: '信息提示',
        content: "密码不能为空",
        showCancel: false
      })
      wx.hideLoading();
      return;
    }
    var orderNum = wx.getStorageSync("orderNumber");
    var data = {
      orderNumber: orderNum,
      cardPassword: this.data.payPwd,
      integralDeductible: this.data.point
    }
    var func = (res) => {
      if (res.errno == 0) {
        wx.showModal({
          title: "操作成功",
          content: '是否继续购买？',
          success(res) {
            if (res.confirm) {
              wx.redirectTo({
                url: "../enjoyStarItem/enjoyStarItem"
              })
            }
            if (res.cancel) {
              wx.reLaunch({
                url: '../../../pages/ucenter/index/index'
              })
            }
          }
        })
      } else {
        wx.showModal({
          title: '信息提示',
          content: res.errmsg,
          showCancel: false,
          success(v) {
            if (v.success) {
              wx.redirectTo({
                url: '../../../pages/ucenter/index/index'
              })
            }
          }
        })
      }
    }
    utils.request(api.EnjoyStarPay, data, "POST").then(func);

  },


  inputBankName: function(e) {
    this.setData({
      bankName: e.detail.value
    })
  },

  inputBankCard: function(e) {
    this.setData({
      bankCard: e.detail.value
    })
  },

  switchChange: function(e) {
    this.setData({
      isPoint: !e.detail.value,
      point: 0
    })
  },

  inputPoint: function(e) {
    let tem = this.data.wallet.prepayPoint / 100 / 40;
    if (e.detail.value <= tem) {
      this.setData({
        point: e.detail.value,
      })
    } else {
      utils.showError("预付积分不足")
    }
  },

  inputPsw: function(e) {
    this.setData({
      payPwd: e.detail.detail.value
    })
  },

  cancel: function() {
    this.setData({
      isShow: true,
      isBankShow: true
    })
  },

  cancel2: function() {
    this.setData({
      isShow2: true
    })
  },

  /**
   *
   * 绑定银行卡
   *
   */
  bankConfirm: function() {
    let url = 'myCard/updateUser';

    let data = {
      id: app.globalData.userInfo.id,
      openingBank: this.data.bankName,
      bankCard: this.data.bankCard
    }

    let func = (res) => {
      if (res.data) {
        app.globalData.userInfo.bankName = this.data.bankName;
        app.globalData.userInfo.bankCard = this.data.bankCard;
        this.setData({
          isBankShow: true,
          isShow: false
        })

      } else {
        utils.showError(res.errmsg);
      }
    }

    utils.request(url, data, func);
  },

  //提现
  submit: function() {
    this.pwdinput.showInput();
  },

})