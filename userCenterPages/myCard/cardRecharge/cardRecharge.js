const utils = require('../../../utils/util.js');
const app = getApp();
const api = require("../../../config/api.js");
const user = require("../../../utils/user.js");
Page({
  data: {
    recharges: [
      '500',
      '1000',
      '1500',
      '2000',
      '2500',
      '其他'
    ],
    inputShow: true,
    psw: '',
    recharge: '500'
  },

  //输入密码
  pswInput: function(e) {
    this.setData({
      psw: e.detail.value
    })
  },
  //输入金额
  rechargeInput: function(e) {
    console.log(e)
    this.setData({
      recharge: e.detail.value
    })
  },

  rechargeSelect: function(e) {
    console.log(e)
    let id = e.currentTarget.id;
    let recharge = this.data.recharges[id];
    if (recharge == '其他') {
      this.setData({
        inputShow: false,
      })
    } else {
      this.setData({
        inputShow: true,
        recharge: recharge
      })
    }
    console.log(recharge)
  },

  /**
   *
   * 发起微信支付
   *
   */
  bindViewTap: function() {
    let recharge = this.data.recharge;

    if (recharge == '0' || recharge == 0 || recharge == '') {
      utils.showErr("充值金额不能等于0");
      return;
    }
    // 封装数据
    let that = this;
    let userInfo = wx.getStorageSync("userInfo")
    console.log(userInfo)
    let url = api.UnfiedOrder;
    let data = {
      recharge: this.data.recharge * 100,
      type: 2,
    };
    console.log(data)
    // 成功之后的回调函数
    let func = (res) => {
      let that = this;
      let orderNumber = res.orderNumber;
      if (res.errno === 0) {
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data._package,
          'signType': 'MD5',
          'paySign': res.data.paySign,
          'success': function(res) {
            user.getWallet();
            if (res.errMsg == 'requestPayment:ok') {
              wx.showModal({
                title: '提示信息',
                content: '充值成功',
                showCancel: false,
                confirmText: '确定',
                confirmColor: '#3CC51F',
                success: (result) => {
                  if (result.confirm) {
                    wx.reLaunch({
                      url: '../../../pages/ucenter/index/index'
                    })
                  }
                },
              });
            }
          },
          'fail':function(res){
            console.log(res.errMsg)
          }
        })
      } else {
        let errmsg = res.errmsg;
        console.log(res.errmsg)
        wx.showModal({
          title: "提示信息",
          content:"UnfiedOrder"+errmsg,
        })
      }
    };
    utils.request(url, data, "POST").then(func)

  },

  //跳转进来加载用户数据
  onLoad: function(options) {

  },


});