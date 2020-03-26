const app = getApp();
const api = require("../../../config/api.js");
const utils = require('../../../utils/util.js');
const user=require("../../../utils/user.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    enjoyInfo: {},
    userInfo: {},
    totalCommission:0,
    wallet:{}
  },
  //刷新佣金数据
  refreshCommission: function() {
    var totalCommission = this.data.enjoyInfo.enjoyGold*0.01 * this.data.num * this.data.enjoyInfo.enjoyWeight*this.data.enjoyInfo.xxjComm;
    this.setData({
      totalCommission: totalCommission
    })
    wx.setStorageSync("totalCommission", totalCommission);
  },
  /**
   * 生命周期函数--监听页面加载
   */
 
  onShow:function(){
    var that=this;
    user.getWallet(()=>{
      let wallet=wx.getStorageSync("wallet");
      console.log(wallet)
      that.setData({
        wallet:wallet
      })
    })
  },
  onReady: function() {
    var that = this;
    let enjoyInfo = JSON.parse(wx.getStorageSync("enjoyInfo"));
    let userInfo = wx.getStorageSync("userInfo");
    that.setData({
      enjoyInfo: enjoyInfo,
      userInfo: userInfo,
    });
    that.refreshCommission();
  },

  inputNum: function(e) {
    let num = e.detail.value;
    if (num * this.data.enjoyInfo.enjoyGold*this.data.enjoyInfo.enjoyWeight> 5000) {
      wx.showModal({
        title: '信息提示',
        content: "金额不能大于5000",
        showCancel:false
      })
      return
    }
    else{
      this.setData({
        num:num
      })
    }
    this.refreshCommission();

  },

  /* 点击减号 */
  bindMinus: function() {
    let num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    let minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
    this.refreshCommission();
  },
  /* 点击加号 */
  bindPlus: function() {
    let num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    if (num * this.data.enjoyInfo.enjoyGold * this.data.enjoyInfo.enjoyWeight > 5000) {
      wx.showModal({
        title: '信息提示',
        content: "金额不能大于5000",
        showCancel: false
      })
      return
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    let minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
    this.refreshCommission();
  },

  //确定下单
  bindtap: function() {
    var actualMoney =this.data.enjoyInfo.enjoyGold * this.data.num * this.data.enjoyInfo.enjoyWeight
    const wallet = this.data.wallet
    if (actualMoney > (wallet.canUseBalance * 0.01+wallet.prepayPoint*0.01/40))
    {
      wx.showModal({
        title: '提示信息',
        content: '可用余额不足',
        showCancel:false,
      })
      return;
    }

    let url = api.EnjoyStarOrder;
    var that = this;
    let data={
      enjoyId:this.data.enjoyInfo.enjoyId,
      buyNum:this.data.num
    }
    var func=(res)=>{
      if(res.errno==0){
        wx.setStorageSync("orderNumber", res.data)
        wx.navigateTo({ //打开新页面
          url: "../enjoyStarOrder/enjoyStarOrder"
        })
      }
      else{
        wx.showModal({
          title: '提示信息',
          content: res.errmsg,
          showCancel:false
        })
      }
    }
    utils.request(url,data,"POST").then(func)
   
  }

});