// userCenterPages/sellerCenter/invitationCard/invitationCard.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    canvasWidth: 0,
    canvasHeight: 0,
    windowWidth: 0,
    backgroundUrl: "https://litemall.bingold.cn/wx/storage/fetch/45h652f98ixofgo11j77.png",
    avatarUrl: '',
    wxCodeUrl: "",
  },
  /**
   * 使canvas自适应屏幕宽度
   */
  customCanvas() {
    var that = this;
    var myCanvasWidth, myCanvasHeight;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth:res.windowWidth,
          windowHeight:res.windowHeight
        })
        myCanvasWidth = res.windowWidth - that.shiftW(90)
        myCanvasHeight = res.windowHeight -that.shiftH(380)
        
        that.setData({
          canvasWidth: myCanvasWidth,
          canvasHeight: myCanvasHeight
        })
      },
    })

  },
  /**
   * 修正Canvas 输入的数
   */
  shiftW(w) {
    var v = 750 / this.data.windowWidth;
    return w / v
  },
  shiftH(h) {
    var v = 1334 / this.data.windowHeight;
    return h / v
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWxCode()
    this.customCanvas()
  },
  /**
  * 获取小程序码
  */
  getWxCode() {
    var that = this;
    var func = (res) => {
      console.log(res)
      if (res.errno == 0) {
        that.setData({
          wxCodeUrl: res.data
        })
      }
    }
    var data = {
      path: 'pages/index/index'
    }
    util.request(api.DistributionGetQR, data).then(func)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    if (wx.getStorageSync("userInfo") != "") {
      var userInfo = wx.getStorageSync("userInfo");
      console.log(userInfo);
      this.setData({
        userInfo: userInfo
      })
    }
    setTimeout(() => {
      that.drawCanvas()
    }, 1000)

  },

  /**
   * 绘图
   */
  drawCanvas: function () {
    var that = this;

    this.drawBg();
    wx.showLoading({
      title: '绘图中。。。',
    })
  },
  /**
   * 画背景
   */
  drawBg() {
    var that = this;
    var ctx = wx.createCanvasContext('myCanvas');
    wx.downloadFile({
      url: that.data.backgroundUrl,
      success(res) {
        console.log(res)
        ctx.drawImage(res.tempFilePath, (that.data.canvasWidth -that.shiftW(650)) / 2, that.shiftH(0),that.shiftW(650),that.shiftH(936));
        that.drawAvatar(ctx);//第二步
      }
    })

  },
  /**
   * 画头像名字
   */
  drawAvatar(ctx) {
    var that = this;
    var picW =this.shiftW(150);
    var picH =this.shiftH(150);
    var offsetY =this.shiftH(90);
    var startX = (that.data.canvasWidth -picW) / 2;
    var startY = picW / 2 + offsetY
    var arcX = startX + picW / 2;
    var arcY = startY + picH / 2;
    var arcR = picW / 2-5;

    wx.downloadFile({
      url: that.data.userInfo.avatarUrl,
      type: 'jpg',
      success(res) {
        ctx.save() //保存当前的绘图上下文。
        ctx.beginPath() //开始创建一个路径
        ctx.arc(arcX, arcY, arcR, 0, 2 * Math.PI, false) //画一个圆形裁剪区域
        ctx.clip() //裁剪
        ctx.drawImage(res.tempFilePath, startX, startY, picW, picH) //绘制图片
        ctx.restore() //恢复之前保存的绘图上下文
        ctx.setFontSize(20)
        ctx.fillText(that.data.userInfo.nickName, (that.data.canvasWidth - ctx.measureText(that.data.userInfo.nickName).width) / 2, that.shiftH(370))

        that.drawWxcode(ctx);//第三步
      }
    })
  },
  /**
   * 画二维码
   */
  drawWxcode(ctx){
    var that=this;
    wx.downloadFile({
      url: that.data.wxCodeUrl,
      success(res){
        ctx.drawImage(res.tempFilePath, (that.data.canvasWidth - that.shiftW(350)) / 2, that.shiftH(500) ,that.shiftW(350),that.shiftH(350))
        ctx.draw()
        wx.hideLoading();
      }
    })
  },

  saveImg() {
    let that = this;
    wx.getSetting({
      success: function (res) {
        //不存在相册授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function () {
              that.savePic();
            },
            fail: function (err) { }
          })
        } else {
          that.savePic();
        }
      }
    })
  },


  /**
   * 保存图片
   */
  savePic() {
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            console.log(res)
            wx.hideLoading();
            wx.showToast({
              title: '保存成功',
            });
          },
          fail() {
            wx.hideLoading()
          }
        })
      }
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