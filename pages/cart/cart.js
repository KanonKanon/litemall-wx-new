var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../utils/user.js');

var app = getApp();

Page({
  data: {
    newGoods:[],
    relatedGoods: [],
    cartGoods: [],
    cartTotal: {
      "goodsCount": 0,
      "goodsAmount": 0.00,
      "checkedGoodsCount": 0,
      "checkedGoodsAmount": 0.00
    },
    isEditCart: false,
    checkedAllStatus: true,
    editCartList: [],
    hasLogin: false
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function() {
    // 页面渲染完成
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getCartList();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  goLogin() {
    if (!this.data.hasLogin) {
      wx.showModal({
        title: '未登录',
        content: '没有登录，部分功能会受到限制哦！',
        showCancel: true,
        confirmText: '去登录',
        cancelText:'不登录',
        success: function (res) {
          if(res.confirm){
            wx.navigateTo({
              url: "/pages/auth/login/login"
            });
          }
        },
        
      })

    }
  },
  checkLogin() {
    var hasLogin = wx.getStorageSync('hasLogin')
    if (hasLogin != '') {
      this.data.hasLogin=hasLogin
      this.setData({
        hasLogin: hasLogin
      })
    }
   
  },
  onShow: function() {
    this.checkLogin();
    // 页面显示
    if (this.data.hasLogin) {
      if(!this.data.cartList){
        this.getCartList();
      }
      if(this.data.newGoods.length==0){
        this.getIndexData();
      }
      if(this.data.cartGoods.length!=0){
        this.getGoodsRelated()
      }
     
    }


  },
  /**
   * 获得新品数据
   */
  getIndexData: function () {
    let that = this;
    util.request(api.IndexUrl).then(function (res) {
      // console.log(res);
      if (res.errno === 0) {
        that.setData({
          newGoods: res.data.newGoodsList,
        });
        that.getGoodsRelated();
      }
    });
   
  },
  /**
   *  获取推荐商品
   */
  getGoodsRelated: function () {
    let that = this;
    let id = that.data.cartGoods.length?that.data.cartGoods[0].goodsId:that.data.newGoods[0].id;
    util.request(api.GoodsRelated, {
      id: id
    }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          relatedGoods: res.data.goodsList,
        });
      }
    });
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  
  getCartList: function() {
    let that = this;
    util.request(api.OffCartIndex).then(function(res) {
      console.log(res)
      if (res.errno === 0) {
        that.setData({
          cartGoods: res.data.cartList,
          cartTotal: res.data.cartTotal
        });

        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      }
    });
  },
  isCheckedAll: function() {
    //判断购物车商品已全选
    return this.data.cartGoods.every(function(element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
  },
  doCheckedAll: function() {
    let checkedAll = this.isCheckedAll()
    this.setData({
      checkedAllStatus: this.isCheckedAll()
    });
  },
  checkedItem: function(event) {
    let itemIndex = event.target.dataset.itemIndex;
    let that = this;

    let productIds = [];
    productIds.push(that.data.cartGoods[itemIndex].productId);
    if (!this.data.isEditCart) {
      util.request(api.CartChecked, {
        productIds: productIds,
        isChecked: that.data.cartGoods[itemIndex].checked ? 0 : 1
      }, 'POST').then(function(res) {
        if (res.errno === 0) {
          that.setData({
            cartGoods: res.data.cartList,
            cartTotal: res.data.cartTotal
          });
        }

        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      });
    } else {
      //编辑状态
      let tmpCartData = this.data.cartGoods.map(function(element, index, array) {
        if (index == itemIndex) {
          element.checked = !element.checked;
        }

        return element;
      });

      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }
  },
  getCheckedGoodsCount: function() {
    let checkedGoodsCount = 0;
    this.data.cartGoods.forEach(function(v) {
      if (v.checked === true) {
        checkedGoodsCount += v.number;
      }
    });
    console.log(checkedGoodsCount);
    return checkedGoodsCount;
  },
  checkedAll: function() {
    let that = this;

    if (!this.data.isEditCart) {
      var productIds = this.data.cartGoods.map(function(v) {
        return v.productId;
      });
      util.request(api.CartChecked, {
        productIds: productIds,
        isChecked: that.isCheckedAll() ? 0 : 1
      }, 'POST').then(function(res) {
        if (res.errno === 0) {
          console.log(res.data);
          that.setData({
            cartGoods: res.data.cartList,
            cartTotal: res.data.cartTotal
          });
        }

        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      });
    } else {
      //编辑状态
      let checkedAllStatus = that.isCheckedAll();
      let tmpCartData = this.data.cartGoods.map(function(v) {
        v.checked = !checkedAllStatus;
        return v;
      });

      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }

  },
  editCart: function() {
    var that = this;
    if (this.data.isEditCart) {
      this.getCartList();
      this.setData({
        isEditCart: !this.data.isEditCart
      });
    } else {
      //编辑状态
      let tmpCartList = this.data.cartGoods.map(function(v) {
        v.checked = false;
        return v;
      });
      this.setData({
        editCartList: this.data.cartGoods,
        cartGoods: tmpCartList,
        isEditCart: !this.data.isEditCart,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }

  },
  updateCart: function(productId, goodsId, number, id) {
    let that = this;

    util.request(api.CartUpdate, {
      productId: productId,
      goodsId: goodsId,
      number: number,
      id: id
    }, 'POST').then(function(res) {
      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });

  },
  cutNumber: function(event) {

    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let number = (cartItem.number - 1 > 1) ? cartItem.number - 1 : 1;
    cartItem.number = number;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateCart(cartItem.productId, cartItem.goodsId, number, cartItem.id);
  },
  addNumber: function(event) {
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let number = cartItem.number + 1;
    cartItem.number = number;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateCart(cartItem.productId, cartItem.goodsId, number, cartItem.id);

  },

  /**
   *检查限制配送方式 
   */
  checkedDeliveryWay(){
    let cartGoods=this.data.cartGoods
    let tempList = []
    for(let item of cartGoods){
      if(tempList.indexOf(item.deliveryWay)===-1){
        tempList.push(item.deliveryWay)
      }
    }
    if(tempList.indexOf(1)>-1 && tempList.indexOf(2)>-1){
      wx.showModal({
        title: '信息提示',
        content: '您同时选择了两种不同配送方式（只可自提，只可快递）的商品，请修改后再下单！',
      })
      return false
    }
    else{
      return true
    }
  },

  checkoutOrder: function() {

    //检查限制配送方式
    if(!this.checkedDeliveryWay()){
      return
    }

    //获取已选择的商品
    let that = this;

    var checkedGoods = this.data.cartGoods.filter(function(element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });

    if (checkedGoods.length <= 0) {
      return false;
    }

    // storage中设置了cartId，则是购物车购买
    try {
      wx.setStorageSync('cartId', 0);
      wx.navigateTo({
        url: '/pages/checkout/checkout'
      })
    } catch (e) {}

  },
  deleteCart: function() {
    //获取已选择的商品
    let that = this;

    let productIds = this.data.cartGoods.filter(function(element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });

    if (productIds.length <= 0) {
      return false;
    }

    productIds = productIds.map(function(element, index, array) {
      if (element.checked == true) {
        return element.productId;
      }
    });


    util.request(api.CartDelete, {
      productIds: productIds
    }, 'POST').then(function(res) {
      if (res.errno === 0) {
        console.log(res.data);
        let cartList = res.data.cartList.map(v => {
          v.checked = false;
          return v;
        });

        that.setData({
          cartGoods: cartList,
          cartTotal: res.data.cartTotal
        });
      }

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });
  }
})