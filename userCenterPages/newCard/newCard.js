// userCenterPages/newCard/newCard.js
let user=require('../../utils/user.js')
let api=require('../../config/api.js')
let app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customMemberData:[]
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCustomMemberData();
  },
/**
 * 获取通用会员数据
 */
  getCustomMemberData(){
    let data=wx.getStorageSync("customMemberData");
    if(data!=""){
      this.setData({
        customMemberData:data
      })
    }
    else{
      //请求数据
      user.getCustomMemberData(this.getCustomMemberData());
    }
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var func=()=>{
      this.getCustomMemberData()
      wx.stopPullDownRefresh();
    }
    //请求数据
    user.getCustomMemberData(func);
   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})