// pages/ucenter/records/rechargerecord/rechargerecord.js
var util = require('../../../../utils/util.js')
var api = require('../../../../config/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    offlineList: [],
    onlineList:[],
    dataQuery: {
      prepaidCard: '',
      page: 1,
      limit: 20,
      sort: 'id',
      order: ''
    },
    activeName: "",
    tabName:'offline'

  },
  /**
   *
   */
  tabChange(e){
   this.setData({
     tabName:e.detail.name
   })
  },
  formatType(type){
    if(type===1){
      return "优先享"
    }
    else if(type===2){
      return "可用余额"
    }
    else if (type === 3) {
      return "奖励积分"
    }
    else if (type === 4) {
      return "消费积分"
    }
    else if (type === 5) {
      return "安享积存金"
    }
    else if (type === 6) {
      return "诚意金"
    }
  },
  onChange(e) {
    this.setData({
      activeName: e.detail
    });
  },

  getList() {
    const func = (res) => {
      console.log(res)
      if (res.errno === 0) {
        if(this.data.isBottom){
          if(res.data.online.length){
            this.setData({
              onlineList: this.data.onlineList.concat(res.data.online),
              isBottom: false
            })
          }
          if(res.data.offline.length){
            this.setData({
              offlineList: this.data.offlineList.concat(res.data.offlineList),
              isBottom: false
            })
          }
          
        }
        else{
          this.setData({
            onlineList:res.data.online,
            offlineList:res.data.offline
          })
          
        }
        wx.hideLoading()
        
      }
      else{
        util.showError(res.errmsg)
      }
    }
    const userCenterInfo = wx.getStorageSync('centerUserInfo')
    console.log(userCenterInfo);
    console.log(this.data.dataQuery)
    this.data.dataQuery.prepaidCard = userCenterInfo.prepaidCard
    util.request(api.OfflineUcRechargeList,this.data.dataQuery).then(func)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
    this.data.dataQuery.page=1
    this.getList()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.showLoading({
      title: '请稍候',
    })
    this.setData({
      isBottom:true
    })
    this.data.dataQuery.page++
    this.getList()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})