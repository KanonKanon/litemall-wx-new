// pages/ucenter/records/xiaoshoudanrecord/xiaoshowdanrecord.js
var util = require('../../../../utils/util.js')
var api = require('../../../../config/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      // {
      //   id: YS110992299333933,
      //   gid: 2,
      //   editdt: "2020-03-01 13:12:00",
      //   fundcard: "2230029299322",
      //   factamount: "2000",
      //   saledepartmentname: "天恩分店",
      //   editor: 'amei',
      //   factamount1: 2000,
      //   paymenttype1: '微信支付',
      //   factamount2: 0,
      //   paymenttype2: '',
      //   factamount3: 0,
      //   paymenttype3: '',
      //   factamount4: 0,
      //   paymenttype4: '',
      // },
      // {
      //   id: YS1122828182812121,
      //   gid: 2,
      //   editdt: "2020-03-01 13:12:00",
      //   fundcard: "2230029299322",
      //   factamount: "2000",
      //   saledepartmentname: "天恩分店",
      //   editor: 'amei',
      //   factamount1: 2000,
      //   paymenttype1: '微信支付',
      //   factamount2: 0,
      //   paymenttype2: '',
      //   factamount3: 0,
      //   paymenttype3: '',
      //   factamount4: 0,
      //   paymenttype4: '',
      // }

    ],
    dataQuery: {
      prepaidCard: '',
      page: 1,
      limit: 20,
      sort: 'id',
      order: ''
    },
    activeName: "",
    show: false,
    canvasWidth: 0,
    canvasHeight: 0,
    windowWidth: 0,
    backgroundUrl: "https://litemall.bingold.cn/wx/storage/fetch/ytjc8xhdyawh2knk3sun.jpg",
    detailData: {
      saleList: [{
          salegid: "013",
          serialnumber: "A22837633",
          shortname: '18K钻石戒指',
          weight: 5.32,
          sellingprice: 38000,
          discount: 80, //注意这里是直接在后面加%即可
          fundsellingprice: 30300
        },
        {
          salegid: "012",
          serialnumber: "A22837633",
          shortname: '18K钻石耳环',
          weight: 5.32,
          sellingprice: 12000,
          discount: 80, //注意这里是直接在后面加%即可
          fundsellingprice: 9600
        }
      ]
    },
    selectItem: {}
  },
  touchMove() {},
  touchStart() {},
  touchEnd() {},


  /**
   * 获取具体销售单数据
   */
  getDetailData() {
    const func = (res) => {
      console.log(res)
      if (res.errno === 0) {
        this.setData({
          detailData: res.data
        })
        this.drawCanvas()
      } else {
        util.showError(res.errmsg)
      }
    }
    const data = {
      gid: this.data.selectItem.gid
    }
    util.request(api.OfflineUcSaleGet, data).then(func)
  },
  /**
   * 使canvas自适应屏幕宽度
   */
  customCanvas() {
    var that = this;
    var myCanvasWidth, myCanvasHeight;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          scale:res.windowWidth/750,
        })
        // myCanvasWidth = res.windowWidth - that.shiftW(100)
        // myCanvasHeight = res.windowHeight - that.shiftH(350 + (that.data.windowHeight > 700 ? 120 : 0))
        myCanvasWidth = res.windowWidth - 100*that.data.scale
        myCanvasHeight = res.windowHeight -(260 + (that.data.windowHeight > 700 ? 250 : 0))*that.data.scale
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
   * 绘图
   */
  drawCanvas: function() {
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
        // ctx.drawImage(res.tempFilePath, (that.data.canvasWidth - that.shiftW(680)) / 2, that.shiftH(0), that.shiftW(665), that.shiftH(985 - (that.data.windowHeight > 700 ? 120 : 0)));
        ctx.drawImage(res.tempFilePath, (that.data.canvasWidth - 680 * that.data.scale) / 2, 0, 665 * that.data.scale, 940*that.data.scale);
        //第二步 绘制内容
        that.drawContent(ctx)
      }
    })

  },

  /**
   *绘制文字内容
   */
  drawContent2(ctx) {
    const that = this
    const offsetY =that.data.windowHeight>700?80:0
    //单号
    ctx.save();
    ctx.translate(this.shiftW(535), this.shiftH(100)); //设置画布上的(0,0)位置，也就是旋转的中心点
    ctx.rotate(90 * Math.PI / 180);
    ctx.setFillStyle('#333');
    ctx.setFontSize(8);
    ctx.fillText(that.data.selectItem.id, 0, 0);
    ctx.restore();

    //日期
    const times = that.data.selectItem.editdt.split(/-|:|\s+/)
    console.log(times)
    let tlength = times.length
    for (let i = 0; i < tlength; i++) {
      ctx.save();
      ctx.translate(this.shiftW(540), this.shiftH(665 + i * (that.data.windowHeight>700?45:50)-offsetY)); //设置画布上的(0,0)位置，也就是旋转的中心点
      ctx.rotate(90 * Math.PI / 180);
      ctx.setFillStyle('#333');
      ctx.setFontSize(7);
      ctx.fillText(times[i], 0, 0);
      ctx.restore();
    }

    //店名
    ctx.save();
    ctx.translate(this.shiftW(490), this.shiftH(100)); //设置画布上的(0,0)位置，也就是旋转的中心点
    ctx.rotate(90 * Math.PI / 180);
    ctx.setFillStyle('#333');
    ctx.setFontSize(8);
    ctx.fillText(that.data.selectItem.saledepartmentname, 0, 0);
    ctx.restore();

    //随享卡编号
    ctx.save();
    ctx.translate(this.shiftW(450), this.shiftH(130)); //设置画布上的(0,0)位置，也就是旋转的中心点
    ctx.rotate(90 * Math.PI / 180);
    ctx.setFillStyle('#333');
    ctx.setFontSize(8);
    ctx.fillText(that.data.selectItem.fundcard, 0, 0);
    ctx.restore();

    //商品列表
    const slength = this.data.detailData.saleList.length
    const saleList = this.data.detailData.saleList
    let totalprice = 0
    const offsetX = 30
    const x = 340
    const y = 40
    for (let i = 0; i < slength; i++) {
      totalprice += saleList[i].fundsellingprice
      //产品编号
      ctx.save();
      ctx.translate(this.shiftW(x - i * offsetX), this.shiftH(y)); //设置画布上的(0,0)位置，也就是旋转的中心点
      ctx.rotate(90 * Math.PI / 180);
      ctx.setFillStyle('#333');
      ctx.setFontSize(8);
      ctx.fillText(saleList[i].serialnumber, 0, 0);
      ctx.restore();

      //产品名称
      ctx.save();
      ctx.translate(this.shiftW(x - i * offsetX), this.shiftH(y + 200-offsetY)); //设置画布上的(0,0)位置，也就是旋转的中心点
      ctx.rotate(90 * Math.PI / 180);
      ctx.setFillStyle('#333');
      ctx.setFontSize(8);
      ctx.fillText(saleList[i].shortname, 0, 0);
      ctx.restore();

      //产品重量
      // ctx.save();
      // ctx.translate(this.shiftW(x - i * offsetX), this.shiftH(y + 430)); //设置画布上的(0,0)位置，也就是旋转的中心点
      // ctx.rotate(90 * Math.PI / 180);
      // ctx.setFillStyle('#333');
      // ctx.setFontSize(8);
      // ctx.fillText(saleList[i].weight, 0, 0);
      // ctx.restore();

      //产品折前价
      ctx.save();
      ctx.translate(this.shiftW(x - i * offsetX), this.shiftH(y + 550-offsetY)); //设置画布上的(0,0)位置，也就是旋转的中心点
      ctx.rotate(90 * Math.PI / 180);
      ctx.setFillStyle('#333');
      ctx.setFontSize(8);
      ctx.fillText(saleList[i].sellingprice, 0, 0);
      ctx.restore();

      //产品折扣
      ctx.save();
      ctx.translate(this.shiftW(x - i * offsetX), this.shiftH(y + 690-offsetY)); //设置画布上的(0,0)位置，也就是旋转的中心点
      ctx.rotate(90 * Math.PI / 180);
      ctx.setFillStyle('#333');
      ctx.setFontSize(8);
      ctx.fillText(saleList[i].discount + "%", 0, 0);
      ctx.restore();

      //产品实际价格
      ctx.save();
      ctx.translate(this.shiftW(x - i * offsetX), this.shiftH(y + 800-offsetY)); //设置画布上的(0,0)位置，也就是旋转的中心点
      ctx.rotate(90 * Math.PI / 180);
      ctx.setFillStyle('#333');
      ctx.setFontSize(8);
      ctx.fillText(saleList[i].fundsellingprice, 0, 0);
      ctx.restore();

    }


    //付款方式
    ctx.save();
    ctx.translate(this.shiftW(90), this.shiftH(720-offsetY)); //设置画布上的(0,0)位置，也就是旋转的中心点
    ctx.rotate(90 * Math.PI / 180);
    ctx.setFillStyle('#333');
    ctx.setFontSize(8);
    ctx.fillText("合计", 0, 0);
    ctx.restore();

    //合计
    ctx.save();
    ctx.translate(this.shiftW(90), this.shiftH(840-offsetY)); //设置画布上的(0,0)位置，也就是旋转的中心点
    ctx.rotate(90 * Math.PI / 180);
    ctx.setFillStyle('#333');
    ctx.setFontSize(8);
    ctx.fillText(totalprice, 0, 0);
    ctx.restore();

    //收银员
    ctx.save();
    ctx.translate(this.shiftW(30), this.shiftH(320-offsetY)); //设置画布上的(0,0)位置，也就是旋转的中心点
    ctx.rotate(90 * Math.PI / 180);
    ctx.setFillStyle('#333');
    ctx.setFontSize(8);
    ctx.fillText(that.data.selectItem.editor, 0, 0);
    ctx.restore();


    ctx.draw()
    wx.hideLoading();
  },
   /**
   *绘制文字内容
   */
  drawContent(ctx) {
    const that = this
    //单号
    ctx.save();
    ctx.translate(535*that.data.scale, 100*that.data.scale); //设置画布上的(0,0)位置，也就是旋转的中心点
    ctx.rotate(90 * Math.PI / 180);
    ctx.setFillStyle('#333');
    ctx.setFontSize(8);
    ctx.fillText(that.data.selectItem.id, 0, 0);
    ctx.restore();

    //日期
    const times = that.data.selectItem.editdt.split(/-|:|\s+/)
    console.log(times)
    let tlength = times.length
    for (let i = 0; i < tlength; i++) {
      ctx.save();
      ctx.translate(540 * that.data.scale, (630 + i * 50)*that.data.scale); //设置画布上的(0,0)位置，也就是旋转的中心点
      ctx.rotate(90 * Math.PI / 180);
      ctx.setFillStyle('#333');
      ctx.setFontSize(7);
      ctx.fillText(times[i], 0, 0);
      ctx.restore();
    }

    //店名
    ctx.save();
    ctx.translate(490*that.data.scale, 100*that.data.scale); //设置画布上的(0,0)位置，也就是旋转的中心点
    ctx.rotate(90 * Math.PI / 180);
    ctx.setFillStyle('#333');
    ctx.setFontSize(8);
    ctx.fillText(that.data.selectItem.saledepartmentname, 0, 0);
    ctx.restore();

    //随享卡编号
    ctx.save();
    ctx.translate(450*that.data.scale, 130*that.data.scale); //设置画布上的(0,0)位置，也就是旋转的中心点
    ctx.rotate(90 * Math.PI / 180);
    ctx.setFillStyle('#333');
    ctx.setFontSize(8);
    ctx.fillText(that.data.selectItem.fundcard, 0, 0);
    ctx.restore();

    //商品列表
    const slength = this.data.detailData.saleList.length
    const saleList = this.data.detailData.saleList
    let totalprice = 0
    const offsetX = 30
    const x = 340
    const y = 40
    for (let i = 0; i < slength; i++) {
      totalprice += saleList[i].fundsellingprice
      //产品编号
      ctx.save();
      ctx.translate((x - i * offsetX)*that.data.scale, y*that.data.scale); //设置画布上的(0,0)位置，也就是旋转的中心点
      ctx.rotate(90 * Math.PI / 180);
      ctx.setFillStyle('#333');
      ctx.setFontSize(8);
      ctx.fillText(saleList[i].serialnumber, 0, 0);
      ctx.restore();

      //产品名称
      ctx.save();
      ctx.translate((x - i * offsetX)*that.data.scale, (y + 200)*that.data.scale); //设置画布上的(0,0)位置，也就是旋转的中心点
      ctx.rotate(90 * Math.PI / 180);
      ctx.setFillStyle('#333');
      ctx.setFontSize(8);
      ctx.fillText(saleList[i].shortname, 0, 0);
      ctx.restore();

      //产品重量
      // ctx.save();
      // ctx.translate((x - i * offsetX)*that.data.scale, (y + 430)*that.data.scale); //设置画布上的(0,0)位置，也就是旋转的中心点
      // ctx.rotate(90 * Math.PI / 180);
      // ctx.setFillStyle('#333');
      // ctx.setFontSize(8);
      // ctx.fillText(saleList[i].weight, 0, 0);
      // ctx.restore();

      //产品折前价
      ctx.save();
      ctx.translate((x - i * offsetX)*that.data.scale, (y + 550)*that.data.scale); //设置画布上的(0,0)位置，也就是旋转的中心点
      ctx.rotate(90 * Math.PI / 180);
      ctx.setFillStyle('#333');
      ctx.setFontSize(8);
      ctx.fillText(saleList[i].sellingprice, 0, 0);
      ctx.restore();

      //产品折扣
      ctx.save();
      ctx.translate((x - i * offsetX)*that.data.scale, (y + 690)*that.data.scale); //设置画布上的(0,0)位置，也就是旋转的中心点
      ctx.rotate(90 * Math.PI / 180);
      ctx.setFillStyle('#333');
      ctx.setFontSize(8);
      ctx.fillText(saleList[i].discount + "%", 0, 0);
      ctx.restore();

      //产品实际价格
      ctx.save();
      ctx.translate((x - i * offsetX)*that.data.scale, (y + 800)*that.data.scale); //设置画布上的(0,0)位置，也就是旋转的中心点
      ctx.rotate(90 * Math.PI / 180);
      ctx.setFillStyle('#333');
      ctx.setFontSize(8);
      ctx.fillText(saleList[i].fundsellingprice, 0, 0);
      ctx.restore();

    }


    //付款方式
    ctx.save();
    ctx.translate(90*that.data.scale, 720*that.data.scale); //设置画布上的(0,0)位置，也就是旋转的中心点
    ctx.rotate(90 * Math.PI / 180);
    ctx.setFillStyle('#333');
    ctx.setFontSize(8);
    ctx.fillText("合计", 0, 0);
    ctx.restore();

    //合计
    ctx.save();
    ctx.translate(90*that.data.scale, 840*that.data.scale); //设置画布上的(0,0)位置，也就是旋转的中心点
    ctx.rotate(90 * Math.PI / 180);
    ctx.setFillStyle('#333');
    ctx.setFontSize(8);
    ctx.fillText(totalprice, 0, 0);
    ctx.restore();

    //收银员
    ctx.save();
    ctx.translate(30*that.data.scale, 320*that.data.scale); //设置画布上的(0,0)位置，也就是旋转的中心点
    ctx.rotate(90 * Math.PI / 180);
    ctx.setFillStyle('#333');
    ctx.setFontSize(8);
    ctx.fillText(that.data.selectItem.editor, 0, 0);
    ctx.restore();


    ctx.draw()
    wx.hideLoading();
  },

  /**
   * 关闭文本图片弹窗
   */
  closeTxtCode: function() {
    this.setData({
      show: false
    })
    wx.hideLoading()
  },

  saveImg() {
    wx.showLoading({
      title: '请稍候',
    })
    const that = this;
    wx.getSetting({
      success: function(res) {
        console.log(res)
        //不存在相册授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function() {
              that.savePic();
            },
            fail: function(err) {}
          })
        } else {
          console.log("in false")
          that.savePic()
        }
      }
    })
  },


  /**
   * 保存图片
   */
  savePic() {
    const that = this
    console.log("in savePic")
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function(res) {
        console.log(res)
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
   * 切换记录
   */
  onChange(e) {
    console.log(e)
    const that = this
    const item = that.data.list[Number(e.detail)]
    console.log(item)
    that.setData({
      selectItem: item,
      activeName: e.detail
    })
    console.log(that.data.selectItem)


  },
  getList() {
    const func = (res) => {
      console.log(res)
      if (res.errno === 0) {
        if (this.data.isBottom) {
          let newList= this.data.list.concat(res.data)
          this.setData({
            list:newList,
            isBottom: false

          })
        } else {
          this.setData({
            list:res.data
          })
        }
      }
    }
    const userCenterInfo = wx.getStorageSync('centerUserInfo')
    console.log(userCenterInfo);
    console.log(this.data.dataQuery)
    this.data.dataQuery.prepaidCard = userCenterInfo.prepaidCard
    util.request(api.OfflineUcSaleList, this.data.dataQuery).then(func)
  },

  
  //展示销售单
  showSalePic() {
    this.getDetailData()
    this.setData({
      show: true
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.customCanvas()
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
    this.data.dataQuery.page = 1
    this.getList()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.setData({
      isBottom: true
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