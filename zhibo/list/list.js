// zhibo/list/list.js
const api = require("../../config/api.js")
const app = getApp()
const util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zhiBoList:[],
    status:{
      101: '直播中',
      102: '未开始',
      103: '已结束',
      104: '禁播',
      105: '暂停中',
      106: '异常',
      107: '已过期',
    },

    goods:[{
      cover_img: "http://mmbiz.qpic.cn/mmbiz_jpg/YmKMGNPa9OXdqgXVpgwyqqa7lXxCrVMkTRoQYPyJn3gQFOxOiaebicW0ypBxXrs7PLyzsNgiaXe6N9XsLK2d6KqKQ/0",
      url: "pages/goods/goods?id=1181015",
      price: 1100,
      name: "测试商品1"
    },{
        cover_img: "http://mmbiz.qpic.cn/mmbiz_jpg/YmKMGNPa9OXdqgXVpgwyqqa7lXxCrVMkTRoQYPyJn3gQFOxOiaebicW0ypBxXrs7PLyzsNgiaXe6N9XsLK2d6KqKQ/0",
        url: "pages/goods/goods?id=1181015",
        price: 1100,
        name: "测试商品2"
    },
      {
        cover_img: "http://mmbiz.qpic.cn/mmbiz_jpg/YmKMGNPa9OXdqgXVpgwyqqa7lXxCrVMkTRoQYPyJn3gQFOxOiaebicW0ypBxXrs7PLyzsNgiaXe6N9XsLK2d6KqKQ/0",
        url: "pages/goods/goods?id=1181015",
        price: 1100,
        name: "测试商品1"
      },
      {
        cover_img: "http://mmbiz.qpic.cn/mmbiz_jpg/YmKMGNPa9OXdqgXVpgwyqqa7lXxCrVMkTRoQYPyJn3gQFOxOiaebicW0ypBxXrs7PLyzsNgiaXe6N9XsLK2d6KqKQ/0",
        url: "pages/goods/goods?id=1181015",
        price: 1100,
        name: "测试商品1"
      },]
  },
  /**
   * 测试商品列表样式
   */
  testGoods(){
    let list = this.data.zhiBoList
    list.map(item=>{
      item.goods = this.data.goods
    })

    this.setData({
      zhiBoList:list
    })
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
    this.getZhiBoList()
  },
  /**
   * 获取直播室列表
   */
  getZhiBoList(){
    util.request(api.LiveGetInfo).then(res=>{
      console.log(res)
      if(res.data.errcode===0){
        this.setData({
          zhiBoList: res.data.room_info
        })

        // this.testGoods()
      }
      else{
        util.showError('getZhiBoList: '+JSON.stringify(res.data.errmsg))
      }
     
    })
    .catch(res=>{
      console.log("liveGetInfo: "+JSON.stringify(res))
    })
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
    this.getZhiBoList()
    wx.stopPullDownRefresh();
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