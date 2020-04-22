// pages/ucenter/records/anxiangrecord/anxiangrecord.js
var util = require('../../../../utils/util.js')
var api = require('../../../../config/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
     // {
        // id: "XGBG201709200008",
        // id: "XGBG201709200007",
        // goldnetweight: 100,
        // goldsellingprice: 40000,
        // safekeepingbegindt: "2020-03-01 12:12:00",
        // safekeepingenddt: "2021-02-29 12:12:00",
        // storename: "天恩分店",
        // redeemdt:'2021-04-02 10:23:12',
        // redeemflag:true,
        // automaticrenewalflag:true
    //  },
      
    ],
    dataQuery: {
      prepaidCard: '',
      page: 1,
      limit: 20,
      sort: 'id',
      order: ''
    },
    
    activeName: ""

  },
  onChange(e) {
    this.setData({
      activeName: e.detail
    });
  },

//跳转电子合同
  goToContract(e){
    console.log(e)
    const info = JSON.stringify(e.target.dataset.item)
    wx.navigateTo({
      url: './electronicContract/electronicContract?info='+info,
    })
  },

//跳转电子发票
  goToInvoice(e){
    const id = e.target.dataset.item.id
    wx.navigateTo({
      url: './electronicInvoice/electronicInvoice?id=' + id,
    })
  },

  getList() {
    const func = (res) => {
      console.log(res)
      if (res.errno === 0) {
        if (this.data.isBottom) {
          this.setData({
            list: this.data.list.concat(res.data),
            isBottom: false
          })
        }
        else {
          this.setData({
            list:res.data
          })
        }

      }
      else{
        console.log("getList: "+JSON.stringify(res))
      }
    }
    const userCenterInfo = wx.getStorageSync('centerUserInfo')
    console.log(userCenterInfo);
    console.log(this.data.dataQuery)
    this.data.dataQuery.prepaidCard = userCenterInfo.prepaidCard
    util.request(api.OfflineUcGoldSafekeepingList, this.data.dataQuery).then(func)
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
    this.getList()
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
    this.data.dataQuery.page = 1
    this.getList()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      isBottom: true
    })
    this.data.dataQuery.page++
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})