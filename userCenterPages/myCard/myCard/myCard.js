const app = getApp();
const utils = require('../../../utils/util.js');
const api = require("../../../config/api.js");
var util = require('../../../utils/util.js');
var user = require('../../../utils/user.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowNum: false,
    canUseEye: false,
    timeCount: 60,
    wallet: {},
    centerUserInfo: {},
    listService: [{
        id: 'directionForUse',
        name: '会员卡使用说明',
        open: false,
      },
      //  {
      //   id: 'modifyPrepaidCardPwd',
      //   name: '修改登陆密码',
      // },
      {
        id: 'modifyPrepaidCardPwd',
        name: '修改支付密码',
      }, {
        id: 'cardPasswordRest',
        name: '重置支付密码',
      }, {
        id: 'modifyData',
        name: '会员卡资料修改',
        open: false,
      },
      // {
      //   id: 'transactionRecord',
      //   name: '交易记录查询',
      // },
      {
        id: 'cardRecharge',
        name: '会员卡充值',
        open: false,
      }
    ]
  },
  onReady(){
    this.pwdinput = this.selectComponent("#pwdinput")
  },
  //密码输入
  pwdInput: function (e) {
    this.setData({
      paypwd: e.detail.detail.value
    })

  },
  //支付密码输入后执行
  pwdConfirm: function () {
    this.pwdinput.hideInput();
    var centerUserInfo = wx.getStorageSync("centerUserInfo")
    var pwd = this.data.paypwd
    var data = {
      prepaidCard: centerUserInfo.propaidCard,
      password: pwd
    }
    var that = this;
    var func = (res) => {
      if (res.errno == 0) {
        user.getWallet(() => {
          let wallet = wx.getStorageSync("wallet");
          console.log(wallet)
          that.setData({
            wallet: wallet
          })
        })
        this.setData({
          canUseEye: true
        })
        var timer = setInterval(() => {
          that.data.timeCount--;
          if (that.data.timeCount == 0) {
            clearInterval(timer)
            wx.setStorageSync("isShowNum", false)
            that.setData({
              isShowNum: false,
              canUseEye: false,
              timeCount: 60
            })
          }
        }, 1000)
        that.showNum();
      } else {
        wx.showModal({
          title: '信息提示',
          content: res.errmsg,
          showCancel: false
        })
      }
    }
    util.request(api.CardPass, data, "POST").then(func);
  },

  //显示与隐藏数字
  showNum: function () {
    var that = this;
    if (this.data.canUseEye == false) {
      this.pwdinput.showInput();
      return
    }
    var isShow = this.data.isShowNum
    isShow = !isShow;
    wx.setStorageSync("isShowNum", isShow);
    this.setData({
      isShowNum: isShow,
    })
  },


  onPullDownRefresh: function() {

  },

  //获取钱包数据
  getWallet: function() {
    if (wx.getStorageSync("isShowNum") != "") {
      let isShowNum = wx.getStorageSync("isShowNum")
      let wallet = wx.getStorageSync("wallet");
      this.setData({
        wallet: wallet
      })
    }
  },
  //设置用户信息
  setUserInfo: function() {
    let userInfo = wx.getStorageSync("centerUserInfo");
    this.setData({
      centerUserInfo: userInfo
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {
    this.getWallet()
    this.setUserInfo()
  },


});