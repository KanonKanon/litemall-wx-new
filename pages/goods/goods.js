var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../utils/user.js');

Page({
  data: {
    isAdSale:false, //是否预售商品
    isDistributor: false,
    isExtension: false,
    isDrawed: false,
    canvasWidth: 0,
    canvasHeight: 0,
    windowWidth: 0,
    backgroundUrl: "",
    avatarUrl: '',
    wxCodeUrl: '',
    hasLogin: false,
    isHideTxtCode: true,
    isHideCode: true,
    isHideCenter: true,

    labelList: ["企业认证", "店铺认证", "担保交易", "线下门店"],
    shopList: [],
    shop: {},
    storeId:0,
    circular: true,
    id: 0,
    goods: {},
    groupon: [], //该商品支持的团购规格
    grouponLink: {}, //参与的团购
    attribute: [],
    issueList: [],
    comment: [],
    brand: {},
    specificationList: [],
    productObj: {},
    relatedGoods: [],
    cartGoodsCount: 0,
    userHasCollect: 0,
    number: 1,
    checkedSpecText: '选择 款式',
    tmpSpecText: '选择 款式',
    checkedSpecPrice: 0,
    openAttr: false,
    openShare: false,
    noCollectImage: '/static/images/icon_collect.png',
    hasCollectImage: '/static/images/icon_collect_checked.png',
    collectImage: '/static/images/icon_collect.png',
    shareImage: '',
    isGroupon: false, //标识是否是一个参团购买
    soldOut: false,
    canWrite: false, //用户是否获取了保存相册的权限
    imgHeights: [],
    current: 0,
    salesVolume: 0,
    totalGoods: 0,
    offsetH: 10, //修正不同手机canvas的高度
    wareHouse:[], // 店铺仓库,
    serialnumber:''
  },

  touchStart() {},
  touchMove() {},
  touchEnd() {},

  /**
   * 检查是否预售商品
   */
  checkAdSale(){
    const data = {
      goodsId:this.data.id
    }
    util.request(api.CartIsAdvanceSale,data).then(res=>{
      console.log(res)
      if(res.errno===0){
        if(res.data){
          this.setData({
            isAdSale: true,
            adSaleInfo:res.data
          })
          wx.setStorageSync('isAdSale', true)
        }
        else{
          this.setData({
            isAdSale:false
          })
        }
       
        
      }
      else{
       
        util.showError('checkAdSale: '+JSON.stringify(res))
      }
    })
  },

  autoBuy() {
    let that = this
    console.log("isOffline: "+this.data.goods.isOffline)
    if (this.data.goods.isOffline) {
      
      //验证团购是否有效
      let checkedGroupon = this.getCheckedGrouponValue();
      
      let serialnumber = wx.getStorageSync("sn")
      console.log("sn :" + serialnumber)
      const data = {
        goodsId: this.data.goods.id,
        serialnumber: serialnumber
      }
      
      console.log("cartFastAdd data:"+JSON.stringify(data))
      //立即购买
      util.request(api.OffCartFastadd, data, "POST")
        .then(function(res) {
          if (res.errno == 0) {
            // 如果storage中设置了cartId，则是立即购买，否则是购物车购买
            try {
              wx.setStorageSync('cartId', res.data);
              wx.setStorageSync('grouponRulesId', checkedGroupon.id);
              wx.setStorageSync('grouponLinkId', that.data.grouponLink.id);
              wx.navigateTo({
                url: '/pages/checkout/checkout'
              })
            } catch (e) {
              console.log("offCartFastAdd requert: " + JSON.stringify(e))
            }

          } else {
           wx.showModal({
             title: '信息提示',
             content:"OffCartFastadd :" + JSON.stringify(res),
             showCancel:false
           })
          }
        });
    }

  },

  /**
   * 成为下线或客人
   */
  becomeClient() {
    let options = wx.getStorageSync("options")
    let scene = null
    let userId = null
    let goodsId = null
    if (options.scene) {
      scene = decodeURIComponent(options.scene);
      console.log("scene: " + scene)
      //scene : userId,0,goods,1234
      let params = scene.split(',');
      userId = Number(params[1])
      goodsId = Number(params[3])
      this.setData({
        id: goodsId
      })
      this.getGoodsInfo()
    }

    if (this.data.hasLogin) {
      //解析通过二维码进入小程序的链接,
      if (options.scene) {
        if (userId != 0) {
          var func = (res) => {
            if (res.errno == 0) {
              console.log('成为' + userId + '的下线');
              wx.removeStorageSync('options')
            } else {
              console.log("DistributionAdd request: "+ JSON.stringify(res))
            }
          }
          util.request(api.DistributionAdd, {
            parentId: userId
          }, 'POST').then(func);
        } else {
          console.log('不是分销员链接')
        }
      }

    }

  },


  /**
   * 跳转到套餐详情页
   */
  goToDiscountPackage() {
    wx.navigateTo({
      url: '../../userCenterPages/discountPackage/discountPackage',
    })
  },
  checkLogin() {
    var hasLogin = wx.getStorageSync('hasLogin')
    if (hasLogin) {
      this.setData({
        hasLogin: true
      })
    } else {
      this.setData({
        hasLogin: false
      })
      this.goLogin()
    }
  },
  goLogin() {
    if (!this.data.hasLogin) {
      wx.showModal({
        title: '未登录',
        content: '没有登录，部分功能会受到限制哦！',
        showCancel: true,
        confirmText: '去登录',
        cancelText: '不登录',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "/pages/auth/login/login"
            });
          }
        }

      })

    }
  },

  /**
   * 检测是否售完
   */
  checkedSoldOut() {
    const that = this
    let total = 0;
    let pObj = that.data.productObj
    // console.log(pObj)
    for (let key of Object.keys(pObj)) {
      for(let item of pObj[key]){
        for(let key in item){
          total += item[key].length
        }
      }
    }
    console.log("total: "+total)
    if (total) {
      that.setData({
        soldOut: false,
        totalGoods: total,
        specNumber: total,
        checkedSpecPrice:that.data.goods.retailPrice
      })
    } else {
      that.setData({
        soldOut: true,
        totalGoods: total,
        specNumber: total,
        checkedSpecPrice: that.data.goods.retailPrice
      })
    }
    console.log("soldOut: "+this.data.soldOut)
    console.log("totalGoods: "+this.data.totalGoods)
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
    var that = this;
    var myCanvasWidth, myCanvasHeight;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
        myCanvasWidth = res.windowWidth - that.shiftW(260)
        myCanvasHeight = res.windowHeight - that.shiftH(660 + (that.data.windowHeight > 700 ? that.data.offsetH : 0))
        that.setData({
          canvasWidth: myCanvasWidth,
          canvasHeight: myCanvasHeight
        })
      },
    })

  },


  getBackgroundPic() {
    var that = this;
    var func = (res) => {
      // console.log("getBackgroundPic: "+JSON.stringify(res))
      if (res.errno == 0) {
        that.setData({
          backgroundUrl: res.data
        })
      }
    }
    var data = {
      path: 'pages/index/index',
      goodsId: this.data.id
    }
    // console.log("GetGoodsQR data: "+JSON.stringify(data))
    util.request(api.GetGoodsQR, data).then(func)
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
          wxCodeUrl: res.data,
        })
      }
    }
    var data = {
      path: 'pages/index/index',
      goodsId: this.data.id
    }
    // console.log(data)
    util.request(api.GetGoodsQROnly, data).then(func)
  },
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
    // console.log(that.data.canvasWidth);
    const picurl = that.data.openShare ? that.data.shareImage : that.data.backgroundUrl
    // console.log(picurl)
    wx.downloadFile({
      url: picurl,
      success(res) {
        // console.log(res)
        //原图比例：805 X 1118 => 490 X 680
        ctx.drawImage(res.tempFilePath, (that.data.canvasWidth - that.shiftW(490)) / 2, that.shiftH(0), that.shiftW(490), that.shiftH(680));
        //不要第二步
        ctx.draw()
        wx.hideLoading();
        that.data.isDrawed = true

        // that.drawWxcode(ctx); //第二步
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
        ctx.drawImage(res.tempFilePath, that.data.canvasWidth, that.shiftH(480), that.shiftW(180), that.shiftH(180))
        ctx.draw()
        wx.hideLoading();
        that.data.isDrawed = true
      }
    })
  },
  /**
   * 把canvas转成图片
   */
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
            fail: function(err) {}
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
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res2) {
            // console.log(res2)
            wx.hideLoading();
            wx.showToast({
              title: '保存成功',
              duration: 3000
            });
          },
          fail(res2) {
            util.showError(JSON.stringify(res2))
            wx.hideLoading()
          }
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }

    })

  },


  /**
   * 检查是否分销员
   */
  checkedDistributor() {
    if (this.data.hasLogin) {
      let distributorData = wx.getStorageSync('distributorData');
      // console.log(distributorData)
      this.setData({
        isDistributor: distributorData.isDistributor
      })
    }

  },

  /**
   * 保存图片按钮方法
   */
  saveImg() {
    let that = this;
    console.log(1)
    wx.getSetting({
      success: function(res) {
        //不存在相册授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function() {
              that.savePhoto();
              that.setData({
                isPic: false
              })
            },
            fail: function(err) {
              that.setData({
                isPic: true
              })
            }
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
            wx.hideLoading()
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
    wx.hideLoading()
  },

  /**
   * 关闭分享弹窗
   */
  closeWxCode: function() {
    this.setData({
      isHideCode: true
    })
    wx.hideLoading()
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
    this.drawCanvas()
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
    if (this.data.wxCodeUrl === "") {
      this.getWxCode();
    }
    if (this.data.backgroundUrl === "") {
      this.getBackgroundPic()
    }
  },
  /**
   * 关闭分销员中心
   */
  closeCenter: function() {
    this.setData({
      isHideCenter: true
    })
  },


  /**
   * 检测是否选择了店铺
   */
  checkShop() {
    let tempShop = wx.getStorageSync('shop');

    if (tempShop) {
      this.setData({
        shop: tempShop,
        storeId:tempShop.id
      })
    }
    let temp = wx.getStorageSync("checkedAddress")

    if (temp != "") {
      this.setData({
        shop: {
          id: temp.id,
          name: temp.shopName,
          addr: temp.address
        },
        storeId:temp.id
      })
    }

  
  },
  /**
   * 获取区域数据
   */
  getAreaList: function() {
    const pObj = this.data.productObj
    const areaList = Object.keys(pObj)
    let newList = []
    for (let item of areaList){
      let area ={}
      area.checked=false
      area.name = item
      newList.push(area)
    }
    this.setData({
      areaList:newList
    })
  },

  imgLoad: function(e) {
    var imgW = e.detail.width;
    var imgH = e.detail.height;
    var rate = imgW / imgH;
    var newH = 750 / rate
    this.data.imgHeights[e.target.dataset.index] = newH
    this.data.imgHeights[0] = newH;
    this.setData({
      imgHeights: this.data.imgHeights
    })
  },

  swiperChange: function(e) {
    this.setData({
      current: e.detail.current
    })
  },
  // 页面分享
  onShareAppMessage: function() {
    let that = this;
    let distributorData = wx.getStorageSync('distributorData')
    console.log('onshareAppMessage')
    // console.log(distributorData)
    if (distributorData.isDistributor) {
      return {
        title: that.data.goods.name,
        desc: '唯爱与美食不可辜负',
        path: '/pages/index/index?goodId=' + this.data.id + '&userId=' + distributorData.userId
      }
    } else {
      return {
        title: that.data.goods.name,
        desc: '唯爱与美食不可辜负',
        path: '/pages/index/index?goodId=' + this.data.id
      }
    }

  },

  shareFriendOrCircle: function() {
    //var that = this;
    if (this.data.openShare === false) {
      this.setData({
        openShare: !this.data.openShare
      });
    } else {
      return false;
    }

  },
  handleSetting: function(e) {
    var that = this;
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
      wx.showModal({
        title: '警告',
        content: '不授权无法保存',
        showCancel: false
      })
      that.setData({
        canWrite: false
      })
    } else {
      wx.showToast({
        title: '保存成功'
      })
      that.setData({
        canWrite: true
      })
    }
  },
  // 保存分享图
  saveShare: function() {
    let that = this;
    wx.downloadFile({
      url: that.data.shareImage,
      success: function(res) {
        // console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(res) {
            wx.showModal({
              title: '存图成功',
              content: '图片成功保存到相册了，可以分享到朋友圈了',
              showCancel: false,
              confirmText: '好的',
              confirmColor: '#a78845',
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                }
              }
            })
          },
          fail: function(res) {
            console.log('fail')
          }
        })
      },
      fail: function() {
        console.log('fail')
      }
    })
  },

  //从分享的团购进入
  getGrouponInfo: function(grouponId) {
    let that = this;
    util.request(api.GroupOnJoin, {
      grouponId: grouponId
    }).then(function(res) {
      if (res.errno === 0) {
        that.setData({
          grouponLink: res.data.groupon,
          id: res.data.goods.id
        });
        //获取商品详情
        that.getGoodsInfo();
      }
    });
  },

  /**
   * 获取商品信息
   */
  getGoodsInfo: function() {
    const that = this;
    util.request(api.OffGoodsDetail, {
      goodsId: that.data.id
    }).then(function(res) {
      // console.log(res)
      if (res.errno === 0) {
        that.setData({
          goods: res.data.info,
          attribute: res.data.attribute,
          issueList: res.data.issue,
          comment: res.data.comment,
          brand: res.data.brand,
          // specificationList: res.data.specificationList,
          productObj: res.data.productList?res.data.productList:{},
          userHasCollect: res.data.userHasCollect,
          shareImage: res.data.shareImage,
          groupon: res.data.groupon,
          salesVolume: res.data.salesVolume,
          isExtension: res.data.isExtension
        });

        //保存可选提货方式 0所有方式 1只可到店自提，2只可快递
        wx.setStorageSync("deliveryWay", that.data.goods.deliveryWay)

        //检测库存
        that.checkedSoldOut()

        //获取有库存的区域列表
        that.getAreaList()


        //如果是通过分享的团购参加团购，则团购项目应该与分享的一致并且不可更改
        if (that.data.isGroupon) {
          let groupons = that.data.groupon;
          for (var i = 0; i < groupons.length; i++) {
            if (groupons[i].id != that.data.grouponLink.rulesId) {
              groupons.splice(i, 1);
            }
          }
          groupons[0].checked = true;
          //重设团购规格
          that.setData({
            groupon: groupons
          });

        }

        if (res.data.userHasCollect == 1) {
          that.setData({
            collectImage: that.data.hasCollectImage
          });
        } else {
          that.setData({
            collectImage: that.data.noCollectImage
          });
        }

        //显示详情信息
        WxParse.wxParse('goodsDetail', 'html', res.data.info.detail, that);
        
        //如果是线下商品直接下单
        that.autoBuy()

        //获取推荐商品
        that.getGoodsRelated();

       

      }
    });
  },

  /**
   * 获取推荐商品
   */
  getGoodsRelated: function() {
    let that = this;
    util.request(api.GoodsRelated, {
      id: that.data.id
    }).then(function(res) {
      if (res.errno === 0) {
        that.setData({
          relatedGoods: res.data.goodsList,
        });
      }
    });
  },

  /**
   * 团购选择
   */
  clickGroupon: function(event) {
    let that = this;

    //参与团购，不可更改选择
    if (that.data.isGroupon) {
      return;
    }

    let specName = event.currentTarget.dataset.name;
    let specValueId = event.currentTarget.dataset.valueId;

    let _grouponList = this.data.groupon;
    for (let i = 0; i < _grouponList.length; i++) {
      if (_grouponList[i].id == specValueId) {
        if (_grouponList[i].checked) {
          _grouponList[i].checked = false;
        } else {
          _grouponList[i].checked = true;
        }
      } else {
        _grouponList[i].checked = false;
      }
    }

    this.setData({
      groupon: _grouponList,
    });
  },
  /**
   *区域选择
   */
  clickArea(e){
    const areaName = e.target.dataset.areaname
    const index = e.target.dataset.index
    const areaList = this.data.areaList
    let templist = this.data.productObj[areaName]
    let shopList = []
    for(let item of templist){
      for(let key in item){
        let shop = {}
        shop.name = key
        shop.checked =false
        shopList.push(shop)
      }
    }
    for(let item of areaList){
      item.checked=false
    }
    areaList[index].checked = true
    
    this.setData({
      shopList,
      areaList,
      areaName,
      wareHouse:[]
    })
  },

  /**
   * 仓库选择
   */
  clickWareHouse: function(e) {
    // console.log(e)
    const index =e.target.dataset.index
    const shopname = e.target.dataset.shopname
    const pObj = this.data.productObj
    const areaList =this.data.areaList
    const shoplist = this.data.shopList
    for(let shop of shoplist){
      shop.checked=false
    }
    shoplist[index].checked=true

    const tempList = pObj[this.data.areaName]
    let  wareHouse = tempList[index][shopname]
    // console.log("wareHouse: "+JSON.stringify(wareHouse))
    for(let item of wareHouse){
      item.checked=false
    }
    wareHouse[0].checked=true

    this.setData({
      wareHouse:wareHouse,
      shopList:shoplist,
      specNumber:1,
      checkedSpecPrice:Math.round(wareHouse[0].price),
      serialnumber: wareHouse[0].serialnumber
    })
  },

  /**
   * 选择具体规格
   */
  clickSpec(e){
    // console.log(e)
    const index =parseInt(e.target.dataset.index)
    let wareHouse= this.data.wareHouse
    for(let item of wareHouse){
      item.checked=false
    }
    // console.log(wareHouse)
    wareHouse[index].checked=true
    this.setData({
      wareHouse:wareHouse,
      specNumber:1,
      checkedSpecPrice:Math.round(wareHouse[index].price),
      serialnumber: wareHouse[index].serialnumber
    })
  },

  /**
   * 获取选中的团购信息
   */
  getCheckedGrouponValue: function() {
    let checkedValues = {};
    let _grouponList = this.data.groupon;
    for (let i = 0; i < _grouponList.length; i++) {
      if (_grouponList[i].checked) {
        checkedValues = _grouponList[i];
      }
    }
    return checkedValues;
  },

  onLoad: function(options) {
    
    if (options.scene) {
      wx.setStorageSync('options', options)
    }
    // 自动设置画布大小
    this.customCanvas();
    //检查是否分销员的链接，如果是就成为他的下线
    if (options.userId) {
      console.log('分销员链接')
      console.log("userId: "+JSON.stringify(options.userId))
      var func = (res) => {
        if (res.errno == 0) {
          console.log("DistributionAdd: " +JSON.stringify(res))
        } else {
          console.log("DistributionAdd fail:"+JSON.stringify(res))
        }
      }
      var data = {
        parentId: options.userId
      }
      util.request(api.DistributionAdd, data, 'POST').then(func);

    }
    

    // 页面初始化 options为页面跳转所带来的参数
    if (options.id) {
      this.setData({
        id: parseInt(options.id)
      });
      this.getGoodsInfo();
      this.checkAdSale()
    }

    if (options.grouponId) {
      this.setData({
        isGroupon: true,
      });
      this.getGrouponInfo(options.grouponId);
    }
    let that = this;

  },
  /**
   * 获取购物车中商品数量
   */
  getCartCount(){
    let that = this;
    util.request(api.OffCartGoodscount).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          cartGoodsCount: res.data
        });
      }
    });
  },

  onShow: function() {
    let that = this;
    this.getCartCount()
    //如果是扫码进入就要3秒内禁止后面的代码执行
    if (wx.getStorageSync("isScanCode")) {
      setTimeout(() => {
        wx.removeStorageSync('isScanCode')
      }, 3000)
      return
    }
    // 页面显示
    this.checkLogin()

    //为了同步其它显示选择店铺问题
    this.checkShop();

    this.checkedDistributor();

    //相册授权
    wx.getSetting({
      success: function (res) {
        // console.log(res)
        //不存在相册授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function () {
              that.setData({
                canWrite: true
              })
            },
            fail: function (err) {
              that.setData({
                canWrite: false
              })
            }
          })
        } else {
          that.setData({
            canWrite: true
          });
        }
      }
    })


  },

  //添加或是取消收藏
  addCollectOrNot: function() {
    this.checkLogin()
    if (!this.data.hasLogin) {
      return
    }
    let that = this;
    util.request(api.CollectAddOrDelete, {
        type: 0,
        valueId: this.data.id
      }, "POST")
      .then(function(res) {
        let _res = res;
        if (_res.errno == 0) {
          if (_res.data.type == 'add') {
            that.setData({
              collectImage: that.data.hasCollectImage
            });
          } else {
            that.setData({
              collectImage: that.data.noCollectImage
            });
          }

        } else {
          wx.showToast({
            image: '/static/images/icon_error.png',
            title: _res.errmsg,
            mask: true
          });
        }

      });

  },

  //立即购买（先自动加入购物车）
  addFast: function() {
    this.checkLogin()
    if (!this.data.hasLogin) {
      return
    }
    var that = this;
    if (this.data.openAttr == false) {
      //打开规格选择窗口
      this.setData({
        openAttr: !this.data.openAttr
      });
    } else {

      //提示选择完整规格
      if (!this.data.wareHouse.length) {
        wx.showToast({
          image: '/static/images/icon_error.png',
          title: '请选择完整规格'
        });
        return false;
      }

      //验证团购是否有效
      let checkedGroupon = this.getCheckedGrouponValue();

      //立即购买
      util.request(api.OffCartFastadd, {
          goodsId: this.data.goods.id,
          serialnumber:this.data.serialnumber
        }, "POST")
        .then(function(res) {
          // console.log(res)
          if (res.errno == 0) {
            // 如果storage中设置了cartId，则是立即购买，否则是购物车购买
            try {
              wx.setStorageSync('cartId', res.data);
              wx.setStorageSync('grouponRulesId', checkedGroupon.id);
              wx.setStorageSync('grouponLinkId', that.data.grouponLink.id);
              wx.navigateTo({
                url: '/pages/checkout/checkout'
              })
            } catch (e) {}

          } else {
            wx.showToast({
              image: '/static/images/icon_error.png',
              title: res.errmsg,
              mask: true
            });
          }
        });
    }


  },

  //添加到购物车
  addToCart: function() {
    this.checkLogin()
    if (!this.data.hasLogin) {
      return
    }
    if(this.isAdSale){
      util.showError('这是预售商品，不能添加购物车')
      return
    }


    var that = this;
    if (this.data.soldOut) {
      wx.showToast({
        image: '/static/images/icon_error.png',
        title: '没有库存'
      });
      return
    }
    if (this.data.openAttr == false) {
      //打开规格选择窗口
      this.setData({
        openAttr: !this.data.openAttr
      });
    } else {
      //提示选择完整规格
      if (!this.data.wareHouse.length) {
        wx.showToast({
          image: '/static/images/icon_error.png',
          title: '请选择完整规格'
        });
        return false;
      }
      //添加到购物车
      util.request(api.OffCartAdd, {
          goodsId: this.data.goods.id,
          serialnumber: this.data.serialnumber
        }, "POST")
        .then(function(res) {
          let _res = res;
          if (_res.errno == 0) {
            wx.showToast({
              title: '添加成功'
            });
            that.setData({
              // openAttr: !that.data.openAttr,
              cartGoodsCount: _res.data
            });
            if (that.data.userHasCollect == 1) {
              that.setData({
                collectImage: that.data.hasCollectImage
              });
            } else {
              that.setData({
                collectImage: that.data.noCollectImage
              });
            }
          } else {
            wx.showToast({
              image: '/static/images/icon_error.png',
              title: _res.errmsg,
              mask: true
            });
          }

        });
    }

  },

  cutNumber: function() {
    this.setData({
      number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
    });
  },
  addNumber: function() {
    this.setData({
      number: this.data.number + 1
    });
  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  },
  switchAttrPop: function() {
    if (this.data.openAttr == false) {
      this.setData({
        openAttr: !this.data.openAttr
      });
    }
  },
  closeAttr: function() {
    this.setData({
      openAttr: false,
    });
  },
  closeShare: function() {
    this.setData({
      openShare: false,
    });
  },
  openCartPage: function() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },
  onReady: function() {
    // 页面渲染完成

  }

})