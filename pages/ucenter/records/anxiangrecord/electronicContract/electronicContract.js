// pages/ucenter/records/anxiangrecord/electronicContract/electronicContract.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{
        // id: 2233334444334343434,
        // goldnetweight: 100,
        // goldsellingprice: 40000,
        // safekeepingbegindt: "2020-03-01 12:12:00",
        // safekeepingenddt: "2021-02-29 12:12:00",
        // storename: "天恩分店",
        // redeemdt:'2021-04-02 10:23:12',
        // redeemflag:true,
        // automaticrenewalflag:true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userCenterInfo = wx.getStorageSync('centerUserInfo')
    let info = null
    if(options.info){
      info = JSON.parse(options.info)
    }
    
    if(userCenterInfo && info){
      this.setData({
        userCenterInfo,
        info
      })
    }


  
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