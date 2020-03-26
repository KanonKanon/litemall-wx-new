const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
const utils = require("../../utils/utils.js");
const WxParse = require("../../lib/wxParse/wxParse.js");
//获取应用实例
const app = getApp();

Page({
  data: {
    skHeightList: [],
    detailList: [],
    secKillList: [],
    isDrawed: false,
    notScroll: true,
    canvasWidth: 0,
    canvasHeight: 0,
    windowWidth: 0,
    windowHeight: 0,
    backgroundUrl: "https://litemall.bingold.cn/wx/storage/fetch/kcrlkai6znvpm55wy0ab.jpg",
    avatarUrl: '',
    wxCodeUrl: "",
    hasLogin: false,
    isHideTxtCode: true,
    isHideCode: true,
    isHideCenter: true,
    shop: {},
    shopList: [],
   
    indexList: {},
    circular: true, //轮播图无缝循环
    newGoods: [],
    hotGoods: [],
    topics: [],
    brands: [],
    groupons: [],
    floorGoods: [],
    banner: [],
    channel: [],
    coupon: [],
    goodsCount: 0,
    //所有图片的高度  
    imgheights: [],
    //图片宽度 
    imgwidth: 750,
    //默认  
    current: 0,
    picHeights: [],
    picwidth: 750,
    isDistributor: false, //是否分销员
    offsetH: 260, //修正不同手机canvas的高度
    layerModel: false
  },

  changeModalCancel() {
    this.setData({
      layerModel: false
    })
  },

  getTempShopList() {
    const that = this
    if (!that.data.shopList.length) {
      that.setData({
        shopList: app.globalData.tempShopList,
        shop: app.globalData.tempShopList[0]
      })
      wx.setStorageSync('shop', app.globalData.tempShopList[0])
    }
  },


  /**
   * 跳转秒杀详情
   */
  goToSkDetail(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../../userCenterPages/secKillDetail/secKillDetail?storeId=' + this.data.shop.id + "&skId=" + item.maskGoods.id,
    })
  },

  /**
   * 倒计时
   */
  countTime(endtime, item, finish = () => {}) {
    var that = this;
    var date = new Date();
    var now = date.getTime();
    var endDate = new Date(endtime); //设置开始时间
    var end = endDate.getTime();
    var leftTime = end - now; //时间差                              
    var d, h, m, s, ms;
    if (leftTime >= 0) {
      d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
      h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
      m = Math.floor(leftTime / 1000 / 60 % 60);
      s = Math.floor(leftTime / 1000 % 60);
      ms = Math.floor(leftTime % 1000);
      ms = ms < 100 ? "0" + ms : ms
      s = s < 10 ? "0" + s : s
      m = m < 10 ? "0" + m : m
      h = h < 10 ? "0" + h : h
      d = d < 10 ? "0" + d : d
      item.desc.day = d;
      item.desc.hour = h;
      item.desc.min = m;
      item.desc.sec = s;
      that.setData({
        detailList: that.data.detailList
      })
    } else {
      finish();
    }

  },

  /**
   * 所有秒杀商品一起计时
   */
  allItemCountTime() {
    var that = this;
    for (var i in this.data.detailList) {
      ((v) => {
        var timer = setInterval(() => {
          that.countTime(v.maskGoods.startTime, v, () => {
            v.desc.canBuy = true;
            that.setData({
              detailList: that.data.detailList
            })
            var timer2 = setInterval(() => {
              that.countTime(v.maskGoods.endTime, v, () => {
                v.desc.isfinish = true;
                v.desc.canBuy = false;
                v.desc.day = "00"
                v.desc.hour = "00"
                v.desc.min = "00"
                v.desc.sec = "00"
                that.setData({
                  detailList: that.data.detailList
                })
                clearInterval(timer2)
              })
            }, 1000)
            clearInterval(timer);
          })
        }, 1000)
      })(this.data.detailList[i])
    }

  },

  /**
   * 获取秒杀商品列表
   */
  getSecKillList() {
    var that = this;
    // console.log(that.data.shop)
    var query = {
      storeId: that.data.shop.id
    }
    var func = (res) => {
      // console.log(res)
      if (res.errno == 0) {
        if (res.data.length === 0) {
          // console.log("in true")
          that.setData({
            detailList: []
          })
          return
        } else {
          // console.log("in false")
          that.setData({
            secKillList: res.data
          })
        }
        var templist = []
        this.data.secKillList.forEach(v => {
          var data = {
            storeId: that.data.shop.id,
            skId: v.skId
          }
          var func = (res) => {
            // console.log(res)
            if (res.errno == 0) {
              var desc = {
                totalGoods: 0,
                isfinish: false,
                canBuy: false,
                day: '00',
                hour: '00',
                min: '00',
                sec: '00',
              }
              const plength = res.data.productList.length
              const pList = res.data.productList
              for (let i = 0; i < plength; i++) {
                desc.totalGoods += pList[i].number
              }
              res.data['desc'] = desc;
              templist.push(res.data)
              that.setData({
                detailList: templist
              })
              setTimeout(() => {
                that.allItemCountTime();
              }, 1000)

            } else {
              util.showError(res.errmsg)
            }

          }
          util.request(api.MaSkDetail, data).then(func)
        })
      }

    }
    util.request(api.MaSkList, query).then(func);


  },

  touchStart() {},
  touchMove() {},
  touchEnd() {},
  /**
   * 绘图
   */
  drawCanvas: function() {
    if (this.data.isDrawed) return
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
    var ctx = wx.createCanvasContext('shareCanvas');
    console.log("canvasWidth" + JSON.stringify(that.data.canvasWidth));
    wx.downloadFile({
      url: that.data.backgroundUrl,
      success(res) {
        console.log("downloadFile:" + JSON.stringify(res))
        ctx.drawImage(res.tempFilePath, (that.data.canvasWidth - that.shiftW(480)) / 2, that.shiftH(0), that.shiftW(480), that.shiftH(770 - (that.data.windowHeight > 750 ? that.data.offsetH : 0)));
        that.drawWxcode(ctx); //第二步
      },
      fail(res) {
        console.log("downloadfile: " + JSON.stringify(res.errmsg));
      }
    })

  },

  /**
   * 画二维码
   */
  drawWxcode(ctx) {
    var that = this;
    wx.downloadFile({
      url: that.data.wxCodeUrl,
      success(res) {
        ctx.drawImage(res.tempFilePath, (that.data.canvasWidth - that.shiftW(300)) / 2, that.shiftH(200), that.shiftW(300), that.shiftH(300))
        ctx.draw()
        try {
          wx.hideLoading()
        } catch (e) {
          console.log("drawWxCode: " + JSON.stringify(res))
        }
        that.data.isDrawed = true;
      }
    })
  },

  saveCanvasToPic() {
    let that = this;
    wx.getSetting({
      success: function(res) {
        //不存在相册授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function() {
              that.savePic();
            },
            fail: function(err) {
              console.log("saveCanvasToPic: " + JSON.stringify(err))

            }
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
      canvasId: 'shareCanvas',
      success: function(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            // console.log(res)
            wx.showToast({
              title: '保存成功',
            });
            try {
              wx.hideLoading()
            } catch (e) {
              console.log("hideLoading: " + JSON.stringify(e))
            }
          },
          fail(res) {
            console.log("saveImageToPhotosAlbum: " + JSON.stringify(res.errMsg))
            try {
              wx.hideLoading()
            } catch (e) {
              console.log("hideLoading: " + JSON.stringify(e))
            }
          }
        })
      }
    })

  },


  /**
   * 检查是否分销员
   */
  checkedDistributor() {
    var func = () => {
      let distributorData = wx.getStorageSync('distributorData');
      this.setData({
        isDistributor: distributorData.isDistributor
      })
    }
    user.checkedDistribution(func)
  },

  /**
   * 保存图片按钮方法
   */
  saveImg() {
    let that = this;
    // console.log(1)
    wx.getSetting({
      success: function(res) {
        //不存在相册授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function() {
              that.savePhoto();
            },
            fail: function(err) {}
          })
        } else {
          that.savePhoto();
        }
      }
    })
  },

  /**
   * 保存图片方法
   */
  savePhoto: function() {
    var that = this;
    wx.showLoading({
      title: '请稍候',
    })
    wx.downloadFile({
      url: that.data.wxCodeUrl,
      success: function(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1500
            })
            try {
              wx.hideLoading()
            } catch (e) {
              console.log("hideLoading: " + JSON.stringify(e))
            }
          }
        })
      }
    })
  },


  /**
   * 关闭文本图片弹窗
   */
  closeTxtCode: function() {
    this.setData({
      isHideTxtCode: true
    })
    try {
      wx.hideLoading()
    } catch (e) {
      console.log("hideLoading: " + JSON.stringify(e))
    }

  },

  /**
   * 关闭分享弹窗
   */
  closeWxCode: function() {
    this.setData({
      isHideCode: true
    })
    try {
      wx.hideLoading()
    } catch (e) {
      console.log("hideLoading: " + JSON.stringify(e))
    }
  },
  /**
   * 打开小程序码 分享
   */
  showWxCode: function() {
    this.setData({
      isHideCode: false
    })
  },
  /**
   * 打开文字图片分享
   */
  showTxtCode: function() {
    this.setData({
      isHideTxtCode: false
    })
    this.drawCanvas();
  },

  /***
   * 跳转分销员中心
   */
  goSellerCenter: function() {
    wx.navigateTo({
      url: '/userCenterPages/sellerCenter/sellerCenter',
    })
  },

  /**
   * 分销员分享页
   */
  showShare: function() {
    this.setData({
      isHideCenter: false
    })
    if (this.data.wxCodeUrl == "") {
      this.getWxCode();
    }

  },
  closeCenter: function() {
    this.setData({
      isHideCenter: true
    })
  },



  /**
   * 选择店铺
   */
  selectShop: function() {
    wx.navigateTo({
      url: '/userCenterPages/selectAddress/selectAddress',
    })
  },


  /**
   * 获取所有店铺的列表
   */
  getShopList: function(defeat = () => {}, lose = () => {}) {
    var that = this;
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.userLocation" 这个 scope
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              wx.getLocation({
                // type: 'wgs84',
                success(res) {
                  const latitude = res.latitude; //纬度
                  const longitude = res.longitude; //经度

                  var data = {
                    cur_lat: latitude,
                    cur_lng: longitude,
                    idList: ""
                  }
                  var func = (res2) => {
                    if (res2.errno == 0) {
                      var citys = [];
                      res2.data.forEach((v) => {
                        if (citys.indexOf(v.city) == -1) {
                          citys.push(v.city);
                        }
                      })

                      let tempdata = util.insertSort(res2.data)
                      that.setData({
                        shopList: tempdata,
                        shop: tempdata[0]
                      })
                      wx.setStorageSync('shop', res2.data[0])
                      defeat()
                    } else {
                      wx.showModal({
                        title: '信息提示',
                        content: res2.errmsg,
                        showCancel: false
                      })
                    }
                  }
                  util.request(api.StoreList, data).then(func);
                },
                fail(res) {
                  lose()
                  this.setData({
                    shopList: app.globalData.tempShopList,
                    shop: app.globalData.tempShopList[0]
                  })
                }
              })
            }
          })
        } else {
          wx.getLocation({
            // type: 'wgs84',
            success(res) {
              // console.log(res);
              const latitude = res.latitude; //纬度
              const longitude = res.longitude; //经度

              var data = {
                cur_lat: latitude,
                cur_lng: longitude,
                idList: ""
              }
              var func = (res2) => {
                // console.log(res2)
                if (res2.errno == 0) {
                  var citys = [];
                  res2.data.forEach((v) => {
                    if (citys.indexOf(v.city) == -1) {
                      citys.push(v.city);
                    }
                  })

                  let tempdata = util.insertSort(res2.data)
                  that.setData({
                    shopList: tempdata,
                    shop: tempdata[0]
                  })
                  wx.setStorageSync('shop', that.data.shop)
                  defeat()
                } else {
                  wx.showModal({
                    title: '信息提示',
                    content: res2.errmsg,
                    showCancel: false
                  })
                }
              }
              util.request(api.StoreList, data).then(func);
            },
            fail(res) {
              lose()
              that.setData({
                shopList: app.globalData.tempShopList,
                shop: app.globalData.tempShopList[0]
              })
            }
          })
        }
      }
    })


  },


  picload: function(e) {
    //获取图片真实宽度
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比
      ratio = imgwidth / imgheight;
    //计算的高度值
    var viewHeight = (750 / e.target.dataset['length']) / ratio;
    var imgheight = viewHeight
    var picheights = this.data.picHeights
    //把每一张图片的高度记录到数组里
    picheights[e.target.dataset['index']] = imgheight; // 改了这里 赋值给当前 index
    this.setData({
      picHeights: picheights,
    })
  },
  imageLoad: function(e) {
    //获取图片真实宽度
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比
      ratio = imgwidth / imgheight;
    //计算的高度值
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight
    var imgheights = this.data.imgheights
    //把每一张图片的高度记录到数组里
    imgheights[e.target.dataset['index']] = imgheight; // 改了这里 赋值给当前 index
    this.setData({
      imgheights: imgheights,
    })
  },

  /**
   * 处理所有图片的自匹配问题，因不同页面要作小调整
   */
  allPicLoad: function(e) {
    //获取图片真实宽度
    // console.log(e)
    let index = e.currentTarget.dataset.index
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比
      ratio = imgwidth / imgheight;
    //计算的高度值
    var viewHeight = 750 / ratio;
    this.data.skHeightList[index] = viewHeight;
    this.setData({
      skHeightList: this.data.skHeightList
    })


  },


  bindchange: function(e) {
    this.setData({
      current: e.detail.current
    })
  },
  //解析html
  htmlParse: function() {
    var html = "<div> <h1 style='font-weight:bold;'>第一组件</h1></div>"
    WxParse.wxParse('goodsDetail', 'html', html, this);
  },


  onShareAppMessage: function() {
    var distributorData = wx.getStorageSync('distributorData')
    if (distributorData.isDistributor) {
      return {
        title: '星光珠宝',
        desc: '新版星商城',
        path: '/pages/index/index?userId=' + distributorData.userId
      }
    } else {
      return {
        title: '星光珠宝',
        desc: '新版星商城',
        path: '/pages/index/index'
      }
    }
  },

  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.checkShop()
    this.getIndexData();
    this.getSecKillList();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  /**
   * 获得首页数据
   */
  getIndexData: function() {
    let that = this;
    util.request(api.IndexUrl).then(function(res) {
      // console.log(res);
      if (res.errno === 0) {
        that.setData({
          indexList: res.data.indexList,
          newGoods: res.data.newGoodsList,
          hotGoods: res.data.hotGoodsList,
          topics: res.data.topicList,
          brands: res.data.brandList,
          floorGoods: res.data.floorGoodsList,
          banner: res.data.banner,
          groupons: res.data.grouponList,
          channel: res.data.channel,
          coupon: res.data.couponList
        });
      }
    });
    util.request(api.GoodsCount).then(function(res) {
      that.setData({
        goodsCount: res.data.goodsCount
      });
    });
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
   * 使canvas自适应屏幕宽度
   */
  customCanvas() {
    const that = this;
    let myCanvasWidth, myCanvasHeight;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
        myCanvasWidth = res.windowWidth - that.shiftW(260)
        myCanvasHeight = res.windowHeight - that.shiftH(550 + (that.data.windowHeight > 750 ? that.data.offsetH : 0))
        that.setData({
          canvasWidth: myCanvasWidth,
          canvasHeight: myCanvasHeight
        })
      },
    })

  },
  /**
   * 获取小程序码
   */
  getWxCode() {
    var that = this;
    var func = (res) => {
      // console.log(res)
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

  onLoad: function(options) {
    this.explainWXCode(options)

    //解析来自商品详情页给个人分享的链接。
    //这个goodId的值存在则证明首页的开启来源于分享,同时可以通过获取到的goodId的值跳转导航到对应的详情页
    if (options.goodId) {
      wx.navigateTo({
        url: '../goods/goods?id=' + options.goodId
      });
    }
    
    // // 页面初始化 options为页面跳转所带来的参数
    // if (options.scene) {
    //   //这个scene的值存在则证明首页的开启来源于朋友圈分享的图,同时可以通过获取到的goodId的值跳转导航到对应的详情页
    //   var scene = decodeURIComponent(options.scene);
    //   console.log("scene:" + scene);

    //   let info_arr = [];
    //   info_arr = scene.split(',');
    //   let _type = info_arr[0];
    //   let id = info_arr[1];

    //   if (_type == 'goods') {
    //     wx.navigateTo({
    //       url: '../goods/goods?id=' + id
    //     });
    //   } else if (_type == 'groupon') {
    //     wx.navigateTo({
    //       url: '../goods/goods?grouponId=' + id
    //     });
    //   } else {
    //     wx.navigateTo({
    //       url: '../index/index'
    //     });
    //   }
    // }

    // // 页面初始化 options为页面跳转所带来的参数
    // if (options.grouponId) {
    //   //这个pageId的值存在则证明首页的开启来源于用户点击来首页,同时可以通过获取到的pageId的值跳转导航到对应的详情页
    //   wx.navigateTo({
    //     url: '../goods/goods?grouponId=' + options.grouponId
    //   });
    // }

    // 页面初始化 options为页面跳转所带来的参数
    // if (options.goodId) {
    //   //这个goodId的值存在则证明首页的开启来源于分享,同时可以通过获取到的goodId的值跳转导航到对应的详情页
    //   wx.navigateTo({
    //     url: '../goods/goods?id=' + options.goodId
    //   });
    // }

    // // 页面初始化 options为页面跳转所带来的参数
    // if (options.orderId) {
    //   //这个orderId的值存在则证明首页的开启来源于订单模版通知,同时可以通过获取到的pageId的值跳转导航到对应的详情页
    //   wx.navigateTo({
    //     url: '../ucenter/orderDetail/orderDetail?id=' + options.orderId
    //   });
    // }

    // 自动设置画布大小
    this.customCanvas();
    this.getIndexData();
  },
  onReady: function() {
    // 页面渲染完成
  },
  goLogin() {
    if (this.data.hasLogin === false) {
      wx.showModal({
        title: '未登录',
        content: '没有登录，部分功能会受到限制哦！',
        showCancel: true,
        confirmText: '去登录',
        cancelText: '不登录',
        success: function(res) {
          if (res.confirm) {
            if (wx.getStorageSync("isGoLogin")){
              wx.showModal({
                title: '信息提示',
                content: '网速有点慢，请不要重复点击！',
                showCancel:false
              })
              return
            }
            wx.setStorageSync("isGoLogin", true)
            wx.navigateTo({
              url: "/pages/auth/login/login"
            });
          }
        }
      })
    }
  },
  checkLogin() {
    var hasLogin = wx.getStorageSync('hasLogin')
    if (hasLogin) {
      this.data.hasLogin = hasLogin;
      this.setData({
        hasLogin: hasLogin
      })
    } else {
      this.goLogin()
    }

  },
  onShow: function() {
    this.gotoGoodsPage() //二维码跳转
    this.gotoCouponPage() //二维码跳转

    //如果是扫码进入就要3秒内禁止后面的代码执行
    if(wx.getStorageSync("isScanCode")){
      setTimeout(()=>{
        wx.removeStorageSync('isScanCode')
      },3000)
      return
    }

    this.checkLogin();
    //如果分销员推广页打开了，就把它关闭
    if (this.data.isHideCenter == false) {
      this.setData({
        isHideCenter: true
      })
    }
    //检查是否选择了店铺
    this.checkShop();
    // 页面显示
    // this.htmlParse();
    setTimeout(() => {
      this.becomeClient()
    }, 100);

    setTimeout(() => {
      if (this.data.hasLogin) {
        this.checkedDistributor();
      }
    }, 1000)

    setTimeout(() => {
      if (this.data.hasLogin) {
        this.getSecKillList();
      }
    }, 2000)

    setTimeout(()=>{
      this.getTempShopList()
    },2000)

  },
  /**
   * 解释二维码
   */
  explainWXCode(options) {
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      //扫二维码进入小程序的
      wx.setStorageSync("isScanCode", true)
      //scene : userId,0,goods,1181041
      //scene : couponId,1
      let params = scene.split(',');
      console.log("params: " + JSON.stringify(params))
      try {
        for (let i = 0; i < params.length; i++) {
          if (params[i] === "couponId") {
            wx.setStorageSync("couponId", params[i + 1])
          }
          if (params[i] === "userId") {
            wx.setStorageSync("userId", params[i + 1])
          }
          if (params[i] === "goodsId") {
            wx.setStorageSync("goodsId", params[i + 1])
          }
          if ([params[i] === "s"]) {
            const storeId =Number(params[i + 1])
            let shoplist = app.globalData.tempShopList

            for (let shop of shoplist) {
              if (shop.id === storeId) {
                wx.removeStorageSync('checkedAddress')
                wx.setStorageSync('shop', shop)
                this.setData({
                  shop: shop
                })
              }
            }
          }
        }
        if (options.userId) { //直接对个人分享商品
          wx.setStorageSync("userId", options.userId)
        }
       

      } catch (e) {
        console.log("explainWXCode: " + JSON.stringify(e))
      }
    }

  },

  gotoCouponPage() {
    let couponId = wx.getStorageSync("couponId")
    try {
      if (couponId) {
        wx.navigateTo({
          url: '../ucenter/couponDetail/couponDetail?id=' + couponId
        })
        wx.removeStorageSync("couponId")
      }
    } catch (e) {
      console.log("gotoCouponPage: " + JSON.stringify(e))
    }

  },

  gotoGoodsPage() {
    let goodsId = wx.getStorageSync("goodsId")
    console.log("goodsId: "+goodsId)
    try {
      if (goodsId) {
        wx.navigateTo({
          url: '../goods/goods?id=' + goodsId
        })
        wx.removeStorageSync('goodsId')
      }
    } catch (e) {
      console.log("gotoGoodsPage: " + JSON.stringify(e))
    }

  },

  /**
   * 成为下线或客人
   */
  becomeClient() {
    let userId = wx.getStorageSync("userId") //二维码的分享图 无论首页还是商品页的。
    if (this.data.hasLogin) {
      try {
        if (userId) {
          console.log('userId: ' + JSON.stringify(userId))
          var func = (res) => {
            if (res.errno == 0) {
              console.log('成为' + userId + '的下线');
              wx.removeStorageSync("userId")
            } else {
              console.log("becomeClient: " + JSON.stringify(res))
            }
          }
          util.request(api.DistributionAdd, {
            parentId: userId
          }, 'POST').then(func);
        } else {
          console.log('不是分销员链接')
        }
      } catch (e) {
        console.log("becomeClient catch: " + JSON.stringify(e))
      }
    }

  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭

  },
  /**
   * 检测是否选择了店铺
   */
  checkShop() {
    const that = this
    if (wx.getStorageSync('shop') != "") {
      let shop = wx.getStorageSync("shop");
      this.setData({
        shop: shop
      })
    }

    if (wx.getStorageSync("checkedAddress") != "") {
      let temp = wx.getStorageSync("checkedAddress")
      console.log("checkedAddress: " + JSON.stringify(temp))
      let tempshop = {
        id: temp.id,
        name: temp.shopName,
        addr: temp.address
      }
      this.setData({
        shop: tempshop
      })
      //客户选择了店铺，就要重置默认店铺
      wx.setStorageSync('shop', tempshop)
    }

    //获取店铺列表
    if (!this.data.shopList.length) {
      this.getShopList(() => {
        app.globalData.tempShopLit=that.data.shopList
      })
    }
  },

  getCoupon(e) {
    this.goLogin();

    let couponId = e.currentTarget.dataset.index
    util.request(api.CouponReceive, {
      couponId: couponId
    }, 'POST').then(res => {
      if (res.errno === 0) {
        wx.showToast({
          title: "领取成功"
        })
      } else {
        util.showErrorToast(res.errmsg);
      }
    })
  },
})