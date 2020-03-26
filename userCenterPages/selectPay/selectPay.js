// userCenterPages/selectPay/selectPay.js
const util = require("../../utils/util.js");
const api = require("../../config/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio:'yufu',
    //支付方式
    selections: [{
      title: "微信支付",
      value: "weixin",
      checked: true
    }, {
      title: "随享卡支付",
      value: "yufu",
      checked: false
    }],
    selectValue: 'weixin',
    pwd: "",
    isHidePwdInput: true,
    isStarShineMember:false,
    isCanPay:true,
    cd_time:10,
    actualPrice:0
  },



  onClick(e){
    console.log(e)
    this.setData({
      radio:e.currentTarget.dataset.name
    })
  },
  /**
   * 防止多次点击确认支付按钮
   */
  preventDoublePay(){
    let that=this;
    this.setData({
      isCanPay:false
    })
    let timer= setInterval(()=>{
      that.data.cd_time-=1;
      that.setData({
        cd_time:that.data.cd_time
      })
      if(that.data.cd_time<0){
        that.data.cd_time=10;
        that.setData({
          isCanPay:true
        })
        clearInterval(timer);
      }
    },1000)
  },

  hidePopWin: function() {
    this.setData({
      isHidePwdInput: true
    })
  },
  showPopWin: function() {
    this.setData({
      isHidePwdInput: false
    })
  },
  //任意点击隐藏输入面板
  tapPanel: function() {
    this.hidePopWin()
  },
  //输入事件
  bindInput: function(e) {
    this.setData({
      pwd: e.detail.detail.value,
    })
  },
  //阻止点击
  catch: function() {},

  bindConfirm: function() {
    this.pwdInput.hideInput();
    this.yufuPay();
  },

  //选择支付
  radioChange: function(e) {
    console.log(e);
    this.setData({
      radio:e.detail
    })
  },
  //确认支付
  confirmPay: function() {
    //防止多次点击支付
    this.preventDoublePay()

    // if (this.data.selectValue == "weixin") {
    //   this.weixinPay()
    // } else if (this.data.selectValue == "yufu") {
    //   this.pwdInput.showInput();
    // }
    if (this.data.radio == "weixin") {
      this.weixinPay()
    } else if (this.data.radio == "yufu") {
      this.pwdInput.showInput();
    }
  },
  //微信支付
  weixinPay: function() {
    let that=this;
    let orderId = null;
    if (wx.getStorageSync("orderId") != "") { //有orderId表示下单后未付款成功的订单
      orderId = wx.getStorageSync("orderId");
      util.request(api.OrderPrepay, {
        orderId: orderId
      }, 'POST').then(function(res) {
        if (res.errno === 0) {
          const payParam = res.data;
          console.log("支付过程开始");
          wx.requestPayment({
            'timeStamp': payParam.timeStamp,
            'nonceStr': payParam.nonceStr,
            'package': payParam.packageValue,
            'signType': payParam.signType,
            'paySign': payParam.paySign,
            'success': function(res) {
              console.log("支付过程成功");
              wx.setStorageSync("orderId", "")
              wx.redirectTo({
                url: '/pages/payResult/payResult?status=1&orderId=' + orderId
              });
            },
            'fail': function(res) {
              console.log("支付过程失败");
              wx.setStorageSync('payErrmsg', res.errmsg)
              wx.redirectTo({
                url: '/pages/payResult/payResult?status=0&orderId=' + orderId
              });
            },
            'complete': function(res) {
              console.log("支付过程结束")
            }
          });
        } else {
          console.log(res)
          wx.setStorageSync('payErrmsg', res.errmsg)
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=0&orderId=' + orderId
          });
         
        }
      });

    }

  },
  //预付卡支付
  yufuPay: function() {
    let that=this;
    let orderId = null;
    if (wx.getStorageSync("orderId") != "") {
      orderId = wx.getStorageSync("orderId");
      util.request(api.CardPay, {
        orderId: orderId,
        password: this.data.pwd
      }, 'POST').then(function(res) {
        if (res.errno === 0) {
          wx.setStorageSync("orderId", "")
          wx.showModal({
            title: '信息提示',
            content: '支付成功',
            confirmText:"继续逛",
            cancelText:"查看订单",
            success(v){
              if (v.confirm) {
                wx.reLaunch({
                  url: '../../pages/index/index',
                })
              }
              if(v.cancel){
                 wx.reLaunch({
                  url: '../../pages/ucenter/index/index',
                })
              }
            }

          })
        } else {
          wx.setStorageSync('payErrmsg', res.errmsg)
          wx.reLaunch({
            url: '/pages/payResult/payResult?status=0&orderId=' + orderId
          });
        }
      });
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  getOrderData(){
    let orderId=wx.getStorageSync("orderId")
    console.log("orderId: "+ orderId)
    let func=(res)=>{
      if(res.errno===0){
       console.log(res.data)
       this.setData({
         actualPrice: res.data.orderInfo.actualPrice
       })
      }
      else{
        util.showError(res.errmsg)
      }
    }
    util.request(api.OrderDetail,{orderId}).then(func)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.pwdInput = this.selectComponent("#pwdinput");
    this.getOrderData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
   this.checkStarShineMember();
  },
  /**
   * 检查是否是星光会员
   */
  checkStarShineMember(){
    let isStarShineMember = wx.getStorageSync("isStarShineMember");
    this.setData({
      isStarShineMember: isStarShineMember
    })
    if(!isStarShineMember){
      this.setData({
        radio:'weixin'
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})