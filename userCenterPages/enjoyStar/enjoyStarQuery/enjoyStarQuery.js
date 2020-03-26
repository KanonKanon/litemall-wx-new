Page({
  data: {
    status: ['已支付', '未支付']
  },
  onLoad: function(options) {
    let enjoyInfos = wx.getStorageSync("orderList"); //解析得到集合
    // console.log('enjoyinfos: '+ JSON.stringify(enjoyInfos))
    this.setData({
      enjoyInfos: enjoyInfos
    })

  },

  bindtap: function(e) {
    let id = e.currentTarget.id;
    let recordInfo = this.data.enjoyInfos[id];
    if (recordInfo.payStatus == 1) {
      return
    }
    wx.setStorageSync("orderNumber", recordInfo.orderNumber)
    
    wx.navigateTo({ //打开新页面
      url: '../enjoyStarOrder/enjoyStarOrder'
    })

  },



})