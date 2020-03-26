const app = getApp();
const api = require("../../../config/api.js");
const utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [{
      name: '请输入原密码',
      value: null
    }, {
      name: '请输入新密码',
      value: null
    }, {
      name: '再次输入确认',
      value: null
    }],
    event: [{
      name: "修改登陆密码",
      value: "updatePwd"
    }, {
      name: "修改支付密码",
      value: "updateAllinpayPwd"
    }]
  },

  /**
   *
   * 输入数据
   *
   */
  input: function(e) {
    let i = e.currentTarget.id;
    let obj = this.data.info;
    obj[i].value = e.detail.value;
    this.setData({
      info: obj
    })

  },

  /**
   *
   * 修改密码
   *
   */
  bindViewTap: function() {
    let oldPwd = this.data.info[0].value;
    let newPwd = this.data.info[1].value;
    let newPwdAgain = this.data.info[2].value;

    if (newPwd != newPwdAgain) {
      wx.showModal({
        title: '信息提示',
        content: '"两次输入的密码不一致"',
      })

      return;
    }
    if (oldPwd == '' || oldPwd == "" || oldPwd == null) {
      wx.showModal({
        title: '信息提示',
        content: '原密码不能为空',
      })

      return
    }
    if (newPwd == '' || newPwd == "" || newPwd == null) {
      wx.showModal({
        title: '信息提示',
        content: '新密码不能为空',
      })
      return
    }

    let url = api.Reset;

    let data = {
      oldPassword: oldPwd,
      newPassword: newPwd
    };
    let func = (res) => {
      if (res.errno == 0) {
        wx.showModal({
          title: '提示信息',
          content: "操作成功",
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.redirectTo({ //打开新页面
                url: '../myCard/myCard'
              })
            }
          }
        })

      } else {
        wx.showModal({
          title: '信息提示',
          content: res.errmsg,
          showCancel:false,
        })
      }
    };

    utils.request(url, data, "POST").then(func);

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

})