// pages/enjoyStar/enjoyStar.js
const app = getApp()
const api = require("../../../config/api.js");
var utils = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    enjoyInfoList: [
    ],
  },

  getEnjoyStarList: function() {
    var that = this;
    //请求得到星享金列表
    var func = (res) => {
      if (res.errno == 0) {
        let centerUserInfo = wx.getStorageSync("centerUserInfo")
        res.data.forEach((v) => {
          if(centerUserInfo.isy==2){
            v.xxjComm = centerUserInfo.commissionRate
          }
          else{
            v.xxjComm=0
          }
          
        })
        that.setData({
          enjoyInfoList: res.data
        })
      } else {
        wx.showModal({
          title: '信息提示',
          content: res.errmsg,
          showCancel: false
        })
      }
    }
    utils.request(api.EnjoyStarList).then(func);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getEnjoyStarList()
  },
  //订单查询
  orderQuery: function() {
    var that=this;
    var func=(res)=>{
      if(res.errno==0){
        wx.setStorageSync("orderList", res.data)
        wx.navigateTo({
          url: '../enjoyStarQuery/enjoyStarQuery',
        })
      }
      else{
        wx.showModal({
          title: '信息提示',
          content: res.errmsg,
        })
      }
    }
    utils.request(api.EnjoyStarOrderList).then(func);
    
  },

  //下一步
  submit: function(e) {
    var id = parseInt(e.currentTarget.id)
    var data = JSON.stringify(this.data.enjoyInfoList[id])
    wx.setStorageSync("enjoyInfo", data)
    wx.navigateTo({ //打开新页面
      url: '../enjoyStarItem/enjoyStarItem'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }

})