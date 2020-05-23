// pages/newCategory/newCategory.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaObj:{},
    areaKey:'',
    shopIndex: 0,
    isAdSale: false,
    detailList: [],
    secKillList: [],
    scroll_x: true,
    shop: {},
    shopList: [],
    categoryList: [], //分类列表
    navList: [],
    goodsList: [],
    id: 0,
    currentCategory: {},
    currentSubCategoryList: [],
    page: 1,
    size: 100,
    selectIndex: 0,
    catalogListGoods: [],
    catalogId: "id1005000",
    scroll_y: true,
    goods: {},
    groupon: [], //该商品支持的团购规格
    grouponLink: {}, //参与的团购
    attribute: [],
    issueList: [],
    specificationList: [],
    productList: [],
    checkedSpecText: '选择 款式',
    tmpSpecText: '选择 款式',
    checkedSpecPrice: 0,
    openAttr: false,
    isGroupon: false, //标识是否是一个参团购买
    soldout: false, //是否售空
    number: 1,
    hasLogin: false,
    searchKey: ''
  },

  //获取带区域的店铺列表
  getAllShopList(){
    const that=this
    util.request(api.StoreAllList).then(res=>{
      if(res.errno===0){
        that.setData({
          areaObj:res.data
        })
      }
    })
  },

  inputFocus() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  /**
   * 选择区域
   */
  tapArea(e){
    const {key,item} = e.currentTarget.dataset
    this.setData({
      areaKey:key,
      shopList:item
    })
  },
  /**
   * 选择店铺
   */
  tapShop(e) {
    console.log(e)
    const {
      id,
      item
    } = e.currentTarget.dataset
    this.setData({
      shopIndex: id,
      shop:item
    })
    wx.setStorageSync("shop", item)

  },

  cancelShop() {
    this.setData({
      isAdSale: false,
      shopIndex:0,
      shop:{},
      areaKey:'',
      shopList:[]
    })
    wx.removeStorageSync("shop")

  },

  confirmShop() {
    if (!this.data.shopIndex) {
      util.showError('请选择分店！')
      return
    }
    this.setData({
      isAdSale: false
    })
    const id = this.data.goodsId
    wx.navigateTo({
      url: '../prePayGoods/goods?id=' + id,
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
  dealValueList(specificationList, productList) {
    let newValList = []
    let valList = specificationList[0].valueList
    productList.forEach(v => {
      for (var i in valList) {
        if (valList[i].value == v.specifications[0]) {
          newValList.push(valList[i])
          break;
        }
      }
    })
    specificationList[0].valueList = newValList;
  },

  /**
   * 获取秒杀商品列表
   */
  getSecKillList() {
    var that = this;
    var query = {
      storeId: that.data.shop.id
    }
    var func = (res) => {
      // console.log(res)
      if (res.errno == 0) {
        this.setData({
          secKillList: res.data
        })
        var templist = []
        this.data.secKillList.forEach(v => {
          var data = {
            storeId: that.data.shop.id,
            skId: v.skId
          }
          var func = (res) => {
            console.log(res)
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
              res.data.productList.forEach(m => {
                desc.totalGoods += m.number
              })
              res.data['desc'] = desc;
              templist.push(res.data)
              that.data.detailList = templist
              that.setData({
                detailList: that.data.detailList
              })
              setTimeout(() => {
                that.allItemCountTime();
              }, 500)

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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAllShopList()
    this.getCatalog()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.checkLogin();
    if (!this.data.catalogListGoods.length) {
      this.getCatalogListGoods();
    }
    this.checkShop()
    if (this.data.hasLogin) {
      this.getSecKillList();
    }

  },

  /**
   * 检测是否选择了店铺
   */
  checkShop() {
    if (wx.getStorageSync('shop') != "") {
      let shop = wx.getStorageSync('shop')
      this.setData({
        shop: shop
      })
    }
    if (wx.getStorageSync("checkedAddress") != "") {
      let temp = wx.getStorageSync("checkedAddress")
      this.setData({
        shop: {
          id: temp.id,
          name: temp.shopName,
          addr: temp.addr
        }
      })
      //客户选择了店铺，就要重置默认店铺
      wx.setStorageSync('shop', "")
    }
    // //获取店铺列表
    // if (this.data.shopList.length == 0 && JSON.stringify(this.data.shop) == "{}") {
    //   this.getShopList()
    // }
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
                      let templist = util.insertSort(res2.data)
                      that.setData({
                        shopList: templist,
                        shop: templist[0]
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
                  let templist = util.insertSort(res2.data)
                  that.setData({
                    shopList: templist,
                    shop: templist[0]
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
   * 检查是否预售商品
   */
  checkAdSale(id) {
    const data = {
      goodsId: id
    }
    this.setData({
      goodsId:id
    })
    util.request(api.CartIsAdvanceSale, data).then(res => {
      console.log(res)
      if (res.errno === 0) {
        if (res.data) {
          this.setData({
            isAdSale: true,
            adSaleInfo: res.data,
            shopIndex:0,
            shopList:[],
            areaKey:''
          })
          wx.setStorageSync('isAdSale', true)
          // wx.navigateTo({
          //   url: '../prePayGoods/goods?id='+id,
          // })
        } else {
          this.setData({
            isAdSale: false
          })
          wx.setStorageSync('isAdSale', false)
          wx.navigateTo({
            url: '../goods/goods?id=' + id,
          })
        }
      } else {
        util.showError('checkAdSale: ' + JSON.stringify(res))
      }
    })
  },



  /**
   * 跳转
   */
  jumpTo: function(e) {
    console.log(e)
    var that = this
    var item = e.currentTarget.dataset.item;
    var id = e.currentTarget.dataset.id;
    if (item.skId) {
      wx.navigateTo({
        url: '../../userCenterPages/secKillDetail/secKillDetail?storeId=' + that.data.shop.id + '&skId=' + item.skId
      })
    } else {
      that.checkAdSale(id)
      // wx.navigateTo({
      //   url: '../goods/goods?id=' + id,
      // })
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

  /**
   * 滚动事件
   */
  scroll: function(e) {
    let classes = {};
    classes['0'] = 0;
    //计算分类占用滚动条的区间
    for (let i in this.data.catalogListGoods) {
      // classes[parseInt(i)+1] = classes[i] + Math.ceil(this.data.catalogListGoods[i].goodsVoList.length/2)*138
      classes[parseInt(i) + 1] = classes[i] + this.data.catalogListGoods[i].goodsVoList.length * 90 + 35
    }

    for (let i in classes) {
      if (e.detail.scrollTop < classes[i]) {
        this.setData({
          selectIndex: i - 1
        })
        break;
      }
    }

  },

  buyGoods: function(e) {
    console.log(e);
    this.setData({
      id: e.currentTarget.dataset.id
    })
    this.getGoodsInfo()
  },
  // 获取商品信息
  getGoodsInfo: function() {
    var that = this;
    util.request(api.GoodsDetail, {
      id: that.data.id,
      storeId: that.data.shop.id
    }).then(function(res) {
      console.log(res)
      if (res.errno === 0) {
        //处理多个规格问题
        that.dealValueList(res.data.specificationList, res.data.productList)

        let _specificationList = res.data.specificationList
        // 如果仅仅存在一种货品，那么商品页面初始化时默认checked
        if (_specificationList.length == 1) {
          if (_specificationList[0].valueList.length == 1) {
            _specificationList[0].valueList[0].checked = true

            that.setData({
              checkedSpecText: _specificationList[0].valueList[0].value,
              tmpSpecText: _specificationList[0].valueList[0].value,
            });
          }
        }
        console.log(res.data);
        that.setData({
          goods: res.data.info,
          attribute: res.data.attribute,
          specificationList: res.data.specificationList,
          productList: res.data.productList,
          checkedSpecPrice: res.data.info.retailPrice,
          groupon: res.data.groupon,
          salesVolume: res.data.salesVolume,

        });
        console.log(that.data.openAttr)
        that.setData({
          openAttr: !that.data.openAttr
        })
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
        //检测规格信息变动
        that.changeSpecInfo();

      }
    });
  },

  closeAttr: function() {
    this.setData({
      openAttr: false
    })
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
          goodsId: this.data.goods.id,
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

      //验证团购是否有效
      let checkedGroupon = this.getCheckedGrouponValue();

      //立即购买
      util.request(api.CartFastAdd, {
          goodsId: this.data.goods.id,
          number: this.data.number,
          productId: checkedProduct.id
        }, "POST")
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

  // 规格选择
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

  //获取选中的规格信息
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
      if (!checkedProductArray || checkedProductArray.length <= 0) {
        this.setData({
          soldout: true
        });
        console.error('规格所对应货品不存在');
        return;
      }

      let checkedProduct = checkedProductArray[0];
      if (checkedProduct.number > 0) {
        this.setData({
          checkedSpecPrice: checkedProduct.price,
          soldout: false
        });
      } else {
        this.setData({
          checkedSpecPrice: this.data.goods.retailPrice,
          soldout: true
        });
      }

    } else {
      this.setData({
        checkedSpecText: '选择 款式 ',
        checkedSpecPrice: this.data.goods.retailPrice,
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
   * 输入搜索关键字
   */
  inputSearchKey(e) {
    this.setData({
      searchKey: e.detail
    })
  },
  /**
   * 清空搜索关键字
   */
  clearKey() {
    this.setData({
      searchKey: ''
    })
  },

  /**
   * 查找商品
   */
  searchGood(e) {
    const key = this.data.searchKey
    let id = ''
    for (let item of this.data.catalogListGoods) {
      for (let good of item.goodsVoList) {
        if (good.name.indexOf(key) > -1) {
          id = good.id
          break
        }
      }
      if (id) {
        break
      }
    }
    id = "id" + id
    console.log("id: " + id)
    this.setData({
      catalogId: id
    })
  },


  /**
   * 选择分类
   */
  selectCate: function(e) {
    console.log(e.target.dataset);
    this.setData({
      selectIndex: e.target.dataset.index,
      catalogId: "id" + e.target.dataset.id
    })
  },
  getCurrentCategory: function(id) {
    let that = this;
    util.request(api.CatalogCurrent, {
        id: id
      })
      .then(function(res) {
        console.log(res)
        that.setData({
          currentCategory: res.data.currentCategory,
          currentSubCategoryList: res.data.currentSubCategory
        });
      });
  },
  getCatalog: function() {

    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.CatalogList).then(function(res) {
      // console.log(res);
      that.setData({
        categoryList: res.data.categoryList,
        currentCategory: res.data.currentCategory,
        currentSubCategoryList: res.data.currentSubCategory
      });
      wx.hideLoading();
    });

  },
  getCategoryInfo: function() {
    let that = this;
    util.request(api.GoodsCategory, {
        id: this.data.id
      })
      .then(function(res) {
        if (res.errno == 0) {
          console.log(res);
          that.setData({
            navList: res.data.brotherCategory,
            currentCategory: res.data.currentCategory
          });

          // 当id是L1分类id时，这里需要重新设置成L1分类的一个子分类的id
          if (res.data.parentCategory.id == that.data.id) {
            that.setData({
              id: res.data.currentCategory.id
            });
          }

          //nav位置
          let currentIndex = 0;
          let navListCount = that.data.navList.length;
          for (let i = 0; i < navListCount; i++) {
            currentIndex += 1;
            if (that.data.navList[i].id == that.data.id) {
              break;
            }
          }
          if (currentIndex > navListCount / 2 && navListCount > 5) {
            that.setData({
              scrollLeft: currentIndex * 60
            });
          }
          that.getGoodsList();

        } else {
          //显示错误信息
        }

      });
  },
  getGoodsList: function() {
    var that = this;

    util.request(api.GoodsList, {
        categoryId: that.data.id,
        page: that.data.page,
        size: that.data.size
      })
      .then(function(res) {
        console.log(res)
        that.setData({
          goodsList: res.data.goodsList,
        });
      });
  },
  /**
   * 获取大分类与其中的商品信息
   */
  getCatalogListGoods: function() {
    var that = this;
    var func = res => {
      console.log(res)
      if (res.errno == 0) {
        //改变顺序 会员福利提前
        const templist = res.data
        const last = res.data[res.data.length - 1]
        templist.unshift(last)
        templist.splice(templist.length - 1, 1)
        that.setData({
          catalogListGoods: templist
        })

        // that.setData({
        //   catalogListGoods: res.data
        // })

        // that.getSecKillList()
      }
    }
    util.request(api.CatalogListGoods).then(func).catch(err => {
      console.log(err);
    })
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
    this.getCatalogListGoods()
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