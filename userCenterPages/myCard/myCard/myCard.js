const app = getApp();
const utils = require('../../../utils/util.js');
const api = require("../../../config/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canSeeNum: false,
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
  onPullDownRefresh: function() {

  },

  //获取钱包数据
  getWallet: function() {
    if (wx.getStorageSync("isShowNum") != "") {
      let isShowNum = wx.getStorageSync("isShowNum")
      let wallet = wx.getStorageSync("wallet");
      this.setData({
        canSeeNum: isShowNum,
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