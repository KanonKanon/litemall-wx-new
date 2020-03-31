// userCenterPages/secKillDetail/secKillDetail.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalGoods: 0,
    storeId: 0,
    skId: 0,
    isfinish: false,
    canBuy: false,
    day: '00',
    hour: '00',
    min: '00',
    sec: '00',
    goodsInfo: {
      picUrl: '',
      name: '',
      id: 0,
      retailPrice: 9.8,
    },
    secKillInfo: {
      name: '测试活动',
      tag: '秒杀',
      avgPrice: 1,
      startDate: '2019-8-12 08:33:00',
      endDate: '2019-8-15 14:58:00',
      totalCount: 2,
      specificationList: [{
          name: '1.5-1.8g',
          secPrice: 128,
          secCount: 1
        },
        {
          secPrice: 138,
          name: '1.8-2.3g',
          secCount: 1
        }
      ],
    },

    groupon: [], //该商品支持的团购规格
    grouponLink: {}, //参与的团购
    attribute: [],
    issueList: [],
    specificationList: [],
    productList: [], //各规格产品列表
    checkedSpecText: '选择 款式',
    tmpSpecText: '选择 款式',
    checkedSpecPrice: 0,
    openAttr: false,
    isGroupon: false, //标识是否是一个参团购买
    soldout: false, //是否售空
    number: 1,
  },

  /**
   * 检测是否售完
   */
  checkedSoldOut() {
    var total = 0;
    this.data.productList.forEach((v) => {
      total += v.number
    })

    if (total > 0) {
      this.setData({
        soldout: false,
        totalGoods: total
      })
    } else {
      this.setData({
        soldout: true,
        totalGoods: 0
      })
    }


  },
  /**
   * 规格选择
   */
  clickSkuValue: function(event) {
    let that = this;
    let specName = event.currentTarget.dataset.name;
    let specValueId = event.currentTarget.dataset.valueId;

    //判断是否可以点击

    //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      if (_specificationList[i].name === specName) {
        for (let j = 0; j < _specificationList[i].valueList.length; j++) {
          if (_specificationList[i].valueList[j].id == specValueId) {
            //如果已经选中，则反选
            if (_specificationList[i].valueList[j].checked) {
              _specificationList[i].valueList[j].checked = false;
            } else {
              _specificationList[i].valueList[j].checked = true;
            }
          } else {
            _specificationList[i].valueList[j].checked = false;
          }
        }
      }
    }
    this.setData({
      specificationList: _specificationList,
    });
    //重新计算spec改变后的信息
    this.changeSpecInfo();

    //重新计算哪些值不可以点击
    
  },


  /**
   * 获取选中的规格信息
   */
  getCheckedSpecValue: function() {
    let checkedValues = [];
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      let _checkedObj = {
        name: _specificationList[i].name,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _specificationList[i].valueList.length; j++) {
        if (_specificationList[i].valueList[j].checked) {
          _checkedObj.valueId = _specificationList[i].valueList[j].id;
          _checkedObj.valueText = _specificationList[i].valueList[j].value;
        }
      }
      checkedValues.push(_checkedObj);

    }

    return checkedValues;
  },

  //判断规格是否选择完整
  isCheckedAllSpec: function() {
    return !this.getCheckedSpecValue().some(function(v) {
      if (v.valueId == 0) {
        return true;
      }
    });
  },

  getCheckedSpecKey: function() {
    let checkedValue = this.getCheckedSpecValue().map(function(v) {
      return v.valueText;
    });
    return checkedValue;
  },

  // 规格改变时，重新计算价格及显示信息
  changeSpecInfo: function() {
    let checkedNameValue = this.getCheckedSpecValue();

    //设置选择的信息
    let checkedValue = checkedNameValue.filter(function(v) {
      if (v.valueId != 0) {
        return true;
      } else {
        return false;
      }
    }).map(function(v) {
      return v.valueText;
    });
    if (checkedValue.length > 0) {
      this.setData({
        tmpSpecText: checkedValue.join('　')
      });
    } else {
      this.setData({
        tmpSpecText: '选择 款式'
      });
    }

    if (this.isCheckedAllSpec()) {
      this.setData({
        checkedSpecText: "己选择 " + this.data.tmpSpecText
      });

      // 规格所对应的货品选择以后
      let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey());
      console.log(this.getCheckedSpecKey())
      if (!checkedProductArray || checkedProductArray.length <= 0) {
        this.setData({
          soldout: true
        });
        console.error('规格所对应货品不存在');
        return;
      }

      let checkedProduct = checkedProductArray[0];
      console.log(checkedProduct);
      if (checkedProduct.number > 0) {
        this.setData({
          checkedSpecPrice: checkedProduct.price,
          soldout: false
        });
      } else {
        this.setData({
          checkedSpecPrice: this.data.goodsInfo.retailPrice,
          soldout: true
        });
      }

    } else {
      this.setData({
        checkedSpecText: '选择 款式 ',
        checkedSpecPrice: this.data.goodsInfo.retailPrice,
        soldout: false
      });
    }

  },

  // 获取选中的产品（根据规格）
  getCheckedProductItem: function(key) {
    return this.data.productList.filter(function(v) {

      if (v.specifications.toString() == key.toString()) {
        return true;
      } else {
        return false;
      }
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.storeId) {
      this.data.storeId = options.storeId
    }
    if (options.skId) {
      this.data.skId = options.skId
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    var func = () => {
      var timer = setInterval(() => {
        that.countTime(that.data.secKillInfo.startTime, () => {
          that.setData({
            canBuy: true,
          })
          var timer2 = setInterval(() => {
            that.countTime(that.data.secKillInfo.endTime, () => {
              that.setData({
                canBuy: false,
                isfinish: true,
                day: '00',
                hour: '00',
                min: '00',
                sec: '00',
              })
              clearInterval(timer2)
            })
          }, 1000)
          clearInterval(timer)
        });
        that.checkedSoldOut();
      }, 1000)

    }
    this.getSecKillInfo(func)


  },

  allPicLoad: function (e) {
    //获取图片真实宽度
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比
      ratio = imgwidth / imgheight;
    //计算的高度值
    var viewHeight = 750 / ratio;
    item['viewHeight'] = viewHeight;
    this.data.goodsInfo = item
    this.setData({
      goodsInfo: this.data.goodsInfo
    })
   
  },

  //处理规格面板显示多规格问题
  dealValueList(specificationList, productList) {
    let newValList = []
    let valList = specificationList[0].valueList
    productList.forEach(v => {
      for (let i in valList) {
        if (valList[i].value == v.specifications[0]) {
          newValList.push(valList[i])
          break;
        }
      }
    })
    specificationList[0].valueList = newValList;
  },

  /**
   * 获取活动数据
   */
  getSecKillInfo(finish = () => {}) {
    var that = this;
    var query = {
      storeId: this.data.storeId,
      skId: this.data.skId
    }
    var func = (res) => {
      console.log(res)
      if (res.errno == 0) {
        var avgPrice = 0;
        var totalPrice = 0;
        var totalCount = 0;
        res.data.productList.forEach(v => {
          totalPrice += v.price;
          totalCount += v.number
        })
        avgPrice = totalPrice / res.data.productList.length
        res.data.maskGoods['avgPrice'] = avgPrice
        res.data.maskGoods['totalCount'] = totalCount
        
        //修复多规格问题
        that.dealValueList(res.data.specificationList,res.data.productList)

        that.setData({
          goodsInfo: res.data.info,
          specificationList: res.data.specificationList,
          productList: res.data.productList,
          secKillInfo: res.data.maskGoods,
          issueList:res.data.issue,
        })
        console.log(that.data.specificationList)
        console.log(that.data.productList)

        WxParse.wxParse('goodsDetail', 'html', res.data.info.detail, that);

        finish();
      }
    }
    util.request(api.MaSkDetail, query).then(func);
  },
  /**
   * 检测是否选择了店铺
   */
  checkShop() {
    if (wx.getStorageSync("checkedAddress") != "") {
      let temp = wx.getStorageSync("checkedAddress")
      this.setData({
        shop: {
          id: temp.id,
          name: temp.shopName,
          addr: temp.addr
        }
      })
    }
    //获取店铺列表
    if (this.data.shopList.length == 0 && JSON.stringify(this.data.shop == "{}")) {
      this.getShopList()
    }
  },
  /**
   * 获取所有店铺的列表
   */
  getShopList: function() {
    var that = this;
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.userLocation" 这个 scope
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              wx.getLocation({
                type: 'wgs84',
                success(res) {
                  console.log(res);
                  const latitude = res.latitude; //纬度
                  const longitude = res.longitude; //经度

                  var data = {
                    cur_lat: latitude,
                    cur_lng: longitude,
                    idList: ""
                  }
                  var func = (res2) => {
                    console.log(res2)
                    if (res2.errno == 0) {
                      var citys = [];
                      res2.data.forEach((v) => {
                        if (citys.indexOf(v.city) == -1) {
                          citys.push(v.city);
                        }
                      })
                      that.setData({
                        shopList: res2.data,
                        shop: res2.data[0]
                      })
                      wx.setStorageSync('shop', res2.data[0])
                    } else {
                      wx.showModal({
                        title: '信息提示',
                        content: res2.errmsg,
                        showCancel: false
                      })
                    }
                  }
                  util.request(api.StoreList, data).then(func);
                }
              })
            }
          })
        } else {
          wx.getLocation({
            type: 'wgs84',
            success(res) {
              console.log(res);
              const latitude = res.latitude; //纬度
              const longitude = res.longitude; //经度

              var data = {
                cur_lat: latitude,
                cur_lng: longitude,
                idList: ""
              }
              var func = (res2) => {
                console.log(res2)
                if (res2.errno == 0) {
                  var citys = [];
                  res2.data.forEach((v) => {
                    if (citys.indexOf(v.city) == -1) {
                      citys.push(v.city);
                    }
                  })
                  that.setData({
                    shopList: res2.data,
                    shop: res2.data[0]
                  })
                  wx.setStorageSync('shop', that.data.shop)
                } else {
                  wx.showModal({
                    title: '信息提示',
                    content: res2.errmsg,
                    showCancel: false
                  })
                }
              }
              util.request(api.StoreList, data).then(func);
            }
          })
        }
      }
    })


  },

  /**
   * 倒计时
   */
  countTime(endtime, finish = () => {}) {
    var that = this;
    var date = new Date();
    var now = date.getTime();
    var format = endtime.replace(/-/g, '/')
    var endDate = new Date(format); //设置开始时间
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
      that.setData({
        day: d,
        hour: h,
        min: m,
        sec: s
      })

    } else {
      finish();
    }

  },

  /**
   * 立即抢购
   */
  buyNow() {
    this.setData({
      openAttr: true
    })
  },
  /**
   *原价购买
   */
  toBuy() {
    wx.navigateTo({
      url: '../../pages/goods/goods?id=' + this.data.goodsInfo.id,
    })
  },

  /**
   * 关闭规格选择窗口
   */
  closeAttr: function() {
    this.setData({
      openAttr: false
    })
  },
  /**
   * 增加购买数量
   */
  cutNumber: function() {
    this.setData({
      number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
    });
  },
  /**
   * 减少购买数量
   */
  addNumber: function() {
    this.setData({
      number: this.data.number + 1
    });
  },
  //添加到购物车
  addToCart: function() {
    var that = this;
    if (this.data.openAttr == false) {
      //打开规格选择窗口
      this.setData({
        openAttr: !this.data.openAttr
      });
    } else {

      //提示选择完整规格
      if (!this.isCheckedAllSpec()) {
        wx.showToast({
          image: '/static/images/icon_error.png',
          title: '请选择完整规格'
        });
        return false;
      }

      //根据选中的规格，判断是否有对应的sku信息
      let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey());
      if (!checkedProductArray || checkedProductArray.length <= 0) {
        //找不到对应的product信息，提示没有库存
        wx.showToast({
          image: '/static/images/icon_error.png',
          title: '没有库存'
        });
        return false;
      }

      let checkedProduct = checkedProductArray[0];
      //验证库存
      if (checkedProduct.number <= 0) {
        wx.showToast({
          image: '/static/images/icon_error.png',
          title: '没有库存'
        });
        return false;
      }

      //添加到购物车
      util.request(api.CartAdd, {
          goodsId: this.data.goodsInfo.id,
          number: this.data.number,
          productId: checkedProduct.id
        }, "POST")
        .then(function(res) {
          let _res = res;
          if (_res.errno == 0) {
            wx.showToast({
              title: '添加成功'
            });
            that.setData({
              openAttr: !that.data.openAttr,
              cartGoodsCount: _res.data
            });

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
  //立即购买（先自动加入购物车）
  addFast: function() {
    var that = this;
    if (this.data.openAttr == false) {
      //打开规格选择窗口
      this.setData({
        openAttr: !this.data.openAttr
      });
    } else {

      //提示选择完整规格
      if (!this.isCheckedAllSpec()) {
        wx.showToast({
          image: '/static/images/icon_error.png',
          title: '请选择完整规格'
        });
        return false;
      }

      //根据选中的规格，判断是否有对应的sku信息
      let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey());
      if (!checkedProductArray || checkedProductArray.length <= 0) {
        //找不到对应的product信息，提示没有库存
        wx.showToast({
          image: '/static/images/icon_error.png',
          title: '没有库存'
        });
        return false;
      }

      let checkedProduct = checkedProductArray[0];
      //验证库存
      if (checkedProduct.number <= 0) {
        wx.showToast({
          image: '/static/images/icon_error.png',
          title: '没有库存'
        });
        return false;
      }

      wx.navigateTo({
        url: '/pages/newCheckOut/newCheckOut?number=' + this.data.number + "&checkedProduct=" + JSON.stringify(checkedProduct)
      })


    }


  },

  // 团购选择
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



  //获取选中的团购信息
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})