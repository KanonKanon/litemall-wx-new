var utils = require("../../../utils/utils.js")
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../utils/user.js');
var app = getApp();

Page({
  data: {
    shopList: [],
    shop: {},
    isMember: false,
    isShowBecome: false,
    isStarShineMember: false, //是否星光会员
    isDistributor: false, //是否分销员
    paypwd: "", //支付密码
    isBindCard: true,
    isShowNum: false,
    isSign: false,
    userLevel: ['一星级会员', '二星级会员', '三星级会员', '四星级会员'],
    level: '',
    userInfo: {
      nickName: '点击登录',
      avatarUrl: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
    },
    order: {
      unpaid: 0,
      unship: 0,
      unrecv: 0,
      uncomment: 0
    },
    wallet: {
      canUseBalance: 0,//可用余额
      enjoyBalance: 0,//优先享
      storeBalance: 0,//安享金
      consumePoint:0,//消费积分
      earnestBalance:0,//股改诚意金
      prepayPoint:0,//预付积分
    },
    hasLogin: false,
    canUseEye: false,
    timeCount: 60,
    centerUserInfo: {},
    thirdSession: ''
  },

  /**
   * 检测是否绑定手机 绑定了返回true  否则返回false
   */
  checkPhone() {
    const userInfo = wx.getStorageSync("userInfo")
    if(userInfo){
      if (!userInfo.userPhone) {
        wx.showModal({
          title: '信息提示',
          content: '商城没有绑定手机号，会员中心功能将不能使用！请重新登录，绑定手机！',
          showCancel: false
        })
        return false
      }
    }
    return true
  },

  //跳转开通随享卡
  goToOpenCard() {
    this.goLogin()
    if (!this.checkPhone()) {
      return
    }
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: '/userCenterPages/newClient/newClient',
      })
    }

  },

  /**
   * 扫一扫
   *
   */
  scan: function() {
    this.goLogin()
    if (!this.checkPhone()) {
      return
    }
    if (this.data.hasLogin) {
      wx.scanCode({
        onlyFromCamera: false,
        success: (res) => {
          console.log(res)
          if (res.path) {
            let path = res.path
            console.log("path: " + path)
            path = path.split("?")
            let url = "/" + path[0]
            let params = path[1].split("=")[1].split(",")
            console.log("params:" + JSON.stringify(params))
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
                  const storeId = Number(params[i + 1])
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
            } catch (e) {
              console.log("explainWXCode: " + JSON.stringify(e))
            }
            console.log("url: "+url)
            wx.switchTab({
              url: url,
            })
            return
          }
          let obj = JSON.parse(res.result);
          console.log(obj)
          let url = api.WxApiRoot + obj.url;
          let data = obj.data;
          let func = (v) => {
            console.log(v)
            if (v.errno === 0) {
              wx.showModal({
                title: '信息提示',
                content: v.data,
                showCancel: false
              })
            } else {
              util.showError(v.errmsg);
            }

          };
          util.request(url, data, 'post').then(func);
        },
        fail(err) {
          console.log("scan: "+JSON.stringify(res))
        }
      })
    }

  },

  /**
   * 获取跳转积分商城使用的ThirdSession
   */
  getThirdSession() {
    util.request(api.ThirdSession).then((res) => {
      if (res.errno === 0) {
        this.setData({
          thirdSession: res.data
        })
      } else {
        util.showError('getThirdSession: ' + JSON.stringify(res))
      }
    })

  },
  /**
   * 跳转积分商城
   */
  rewardShoop: function() {
    if (!this.checkPhone()) {
      return
    }
    util.request(api.ThirdSession).then((res) => {
      if (res.errno === 0) {
        const thirdSession = res.data
        wx.navigateToMiniProgram({
          appId: 'wx01d48d1fa2fdae40',
          path: 'pages/valid/valid',
          extraData: {
            thirdSession: thirdSession,
            serviceUrl: api.WxApiRoot
          },
          envVersion: 'release',
          success(res) {
            wx.showToast({
              title: '跳转成功',
            })
          },
          fail(res) {
            console.log("rewardShoop: " + JSON.stringify(res))
          }
        })

      } else {
        util.showError('getThirdSession: ' + JSON.stringify(res))
      }
    })
  

  },
  /**
   * 跳转有赞的会员中心
   */
  goToOld() {
    if (!this.checkPhone()) {
      return
    }
    wx.navigateToMiniProgram({
      appId: 'wx4ce7f496ab8b6c84',
      path: 'pages/usercenter/dashboard/index',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success(res) {
        wx.showToast({
          title: '跳转成功',
        })
      }
    })
  },
  /**
   * 成为会员弹窗
   */
  showBecome() {
    this.goLogin()
    if (this.data.hasLogin) {
      this.setData({
        isShowBecome: true,
      })
    }

  },

  /***
   * 成为普通会员
   */
  becomeMember() {
    this.setData({
      isShowBecome: false
    })
    let func = () => {
      this.setData({
        isMember: true
      })
      wx.setStorageSync('isMember', true)
      this.onPullDownRefresh();
    }
    user.becomeMember(func);
  },

  /**
   * 用户输入姓名
   */
  userNameInput(e) {
    wx.setStorageSync('realName', e.detail.value)
  },

  /**
   * 检查是否会员
   */
  checkedMember() {
    let isMember = wx.getStorageSync('isMember');
    if (isMember != "") {
      this.setData({
        isMember: isMember
      })
    }

  },

  /**
   * 检查是否星光会员
   */
  checkStarShineMember() {
    let isStarShineMember = wx.getStorageSync('isStarShineMember');
    this.setData({
      isStarShineMember: isStarShineMember
    })
    wx.hideLoading()
  },
  /**
   * 跳转到分销员中心
   */
  goToDistributorCenter: function() {
    if (!this.checkPhone()) {
      return
    }
    wx.navigateTo({
      url: '/userCenterPages/sellerCenter/sellerCenter',
    })
  },
  /**
   * 跳到充值记录
   */
  goToRechargeRecord() {
    wx.navigateTo({
      url: '/pages/ucenter/records/rechargerecord/rechargerecord',
    })
  },
  /**
   * 跳到安享金记录
   */
  goToAnxiangRecord() {
    wx.navigateTo({
      url: '/pages/ucenter/records/anxiangrecord/anxiangrecord',
    })
  },
  /**
   * 跳到优先享记录
   */
  goToYouxianRecord() {
    wx.navigateTo({
      url: '/pages/ucenter/records/youxianrecord/youxianrecord',
    })
  },
  /**
   * 跳转销售单记录
   */
  goToSaleRecord() {
    wx.navigateTo({
      url: '/pages/ucenter/records/xiaoshoudanrecord/xiaoshoudanrecord',
    })
  },
  /**
   * 检测是否选择了店铺
   */
  checkShop() {
    if (wx.getStorageSync('shop') != "") {
      let shop = wx.getStorageSync("shop");
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
      wx.setStorageSync('shop', '')
    }

    //获取店铺列表
    if (this.data.shopList.length == 0 && JSON.stringify(this.data.shop) == "{}") {
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
                // type: 'wgs84',
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
            // type: 'wgs84',
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
   * 成为分销员
   */
  becomeDistributor: function() {
    this.goLogin()
    if (!this.checkPhone()) {
      return
    }
    if (!this.data.hasLogin) {
      return
    }
    if (!this.checkPhone()) {
      return
    }
    var that = this;
    var func = (res) => {
      console.log()
      if (res.errno == 0) {
        wx.showModal({
          title: '信息提示',
          content: '恭喜您，成为光荣的星光分销员！\n 赶快去分享商品，一起赚钱吧！',
          showCancel: false,
          success(v) {
            if (v.confirm) {
              wx.navigateTo({
                url: '../../../userCenterPages/sellerCenter/sellerCenter',
              })
            }
          }
        })
        user.checkedDistribution()
        that.onPullDownRefresh();
      } else {
        console.log(res.errmsg);
      }
    }
    util.request(api.DistributionBecome, {
      storeId: this.data.shop.id
    }, 'POST').then(func)
  },

  /**
   *  检查是否分销员
   */
  checkedDistributor: function() {
    var func = () => {
      let distributorData = wx.getStorageSync('distributorData')
      this.setData({
        isDistributor: distributorData.isDistributor
      })
    }
    user.checkedDistribution(func)

  },

  //密码输入
  pwdInput: function(e) {
    this.setData({
      paypwd: e.detail.detail.value
    })

  },
  //支付密码输入后执行
  pwdConfirm: function() {
    this.pwdinput.hideInput();
    var centerUserInfo = wx.getStorageSync("centerUserInfo")
    var pwd = this.data.paypwd
    var data = {
      prepaidCard: centerUserInfo.propaidCard,
      password: pwd
    }
    var that = this;
    var func = (res) => {
      if (res.errno == 0) {
        user.getWallet(() => {
          let wallet = wx.getStorageSync("wallet");
          console.log(wallet)
          that.setData({
            wallet: wallet
          })
        })
        this.setData({
          canUseEye: true
        })
        var timer = setInterval(() => {
          that.data.timeCount--;
          if (that.data.timeCount == 0) {
            clearInterval(timer)
            wx.setStorageSync("isShowNum", false)
            that.setData({
              isShowNum: false,
              canUseEye: false,
              timeCount: 60
            })
          }
        }, 1000)
        that.showNum();
      } else {
        wx.showModal({
          title: '信息提示',
          content: res.errmsg,
          showCancel: false
        })
      }
    }
    util.request(api.CardPass, data, "POST").then(func);
  },

  //显示与隐藏数字
  showNum: function() {
    var that = this;
    if (this.data.canUseEye == false) {
      this.pwdinput.showInput();
      return
    }
    var isShow = this.data.isShowNum
    isShow = !isShow;
    wx.setStorageSync("isShowNum", isShow);
    this.setData({
      isShowNum: isShow,
    })
  },

  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function() {
    this.popup = this.selectComponent("#pop");
    this.pwdinput = this.selectComponent("#pwdinput")
  },
  checkLogin() {
    var hasLogin = wx.getStorageSync('hasLogin')
    if (hasLogin != '') {
      this.data.hasLogin = hasLogin
      this.setData({
        hasLogin: hasLogin
      })
    }

  },
  checkedUserInfo() {
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.showModal({
        title: '未登录',
        content: '登录信息过期了，请重新登录',
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
      return
    }
    this.setData({
      userInfo: userInfo,
    });
    // console.log(userInfo);
    let centerUserInfo = wx.getStorageSync('centerUserInfo')
    // console.log(centerUserInfo)
    if (centerUserInfo) {
      let level = this.data.userLevel[centerUserInfo.level - 1]
      this.setData({
        level: level,
        centerUserInfo: centerUserInfo
      })
    }

  },
  onShow: function() {
    //获取用户的登录信息
    this.checkLogin()
    if (this.data.hasLogin) {
      var that = this;
      if (wx.getStorageSync("isBindCard") != "") {
        let isBindCard = wx.getStorageSync("isBindCard")
        this.setData({
          isBindCard: isBindCard
        })
      }
      user.getCustomMemberData(this.checkedMember)
      this.getOrder()
      this.checkedDistributor();
      setTimeout(() => {
        that.checkStarShineMember();
        that.checkedUserInfo()
      }, 1000)

    }
    this.checkShop();

  },
  /**
   * 显示订单列表的小数字标签数据
   */
  getOrder() {
    let that = this;
    util.request(api.UserIndex).then(function(res) {
      console.log('order')
      console.log(that.data.order)
      if (res.errno === 0) {
        that.setData({
          order: res.data.order
        });

      } else {
        util.showError(res.errmsg)
      }
    });
  },

  //判断是否绑定手机
  checkBindPhone: function() {
    var userInfo = wx.getStorageSync("userInfo")
    if (!userInfo.userPhone) { //绑定手机
      this.popup.showPopup()
      console.log("需要绑定电话")
    } else {
      if (!wx.getStorageSync("centerUserInfo")) {
        var success = () => {
          this.setData({
            isStarShineMember: true
          })
        }
        var fail = () => {
          this.setData({
            isStarShineMember: false
          })

        }
        user.getUserCenterData(success, fail) //已经绑定手机就要获取数据，判断是否绑定随享卡
        console.log("已获取会员中心数据")
      } else {
        let centerUserInfo = wx.getStorageSync('centerUserInfo')
        console.log(centerUserInfo)
        this.setData({
          centerUserInfo: centerUserInfo,
          isStarShineMember:true
        })
      }
    }
  },

  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭
  },
  //检测缓存是否已经登录
  checkLogin() {
    var hasLogin = wx.getStorageSync('hasLogin')
    if (hasLogin) {
      this.setData({
        hasLogin: hasLogin
      })
    }
  },
  //是否跳转登录界面
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
   * 跳转订单列表页
   */
  goOrder() {
    this.goLogin()
    if (!this.checkPhone()) {
      return
    }
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/order/order"
      });
    }
  },
  /**
   * 确定跳转后显示的订单列表页
   */
  goOrderIndex(e) {
    this.goLogin()
    if (!this.checkPhone()) {
      return
    }
    if (this.data.hasLogin) {
      let tab = e.currentTarget.dataset.index
      let route = e.currentTarget.dataset.route
      try {
        wx.setStorageSync('tab', tab);
      } catch (e) {
        console.log(e)
      }
      wx.navigateTo({
        url: route,
        success: function(res) {},
      })
    }
  },
  /**
   * 跳转优惠券列表
   */
  goCoupon() {
    this.goLogin()
    if (!this.checkPhone()) {
      return
    }
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/couponList/couponList"
      });
    }
  },
  goGroupon() {
    this.goLogin()
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/groupon/myGroupon/myGroupon"
      });
    }

  },
  goCollect() {
    this.goLogin()
    if (!this.checkPhone()) {
      return
    }
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/collect/collect"
      });
    }
  },
  goFeedback(e) {
    this.goLogin()
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/feedback/feedback"
      });
    }
  },
  goFootprint() {
    this.goLogin()
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/footprint/footprint"
      });
    }
  },
  goAddress() {
    this.goLogin()
    if (!this.checkPhone()) {
      return
    }
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/address/address"
      });
    }
  },
  bindPhoneNumber: function(e) {
    var that = this;
    if (e.detail.detail.errMsg != "getPhoneNumber:ok") {
      // 拒绝授权
      return;
    }
    if (!this.data.hasLogin) {
      wx.showToast({
        title: '绑定失败：请先登录',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    let userInfo = wx.getStorageSync("userInfo")
    that.popup.hidePopup();
    util.request(api.AuthBindPhone, {
      iv: e.detail.detail.iv, //电话号在里面
      encryptedData: e.detail.detail.encryptedData
    }, 'POST').then(function(res) {
      if (res.errno === 0) {
        userInfo.userPhone = res.data;
        wx.setStorageSync("userInfo", userInfo)
        that.setData({
          userInfo: userInfo
        })
        wx.showToast({
          title: '绑定成功',
          duration: 2000
        })
        wx.reLaunch({
          url: './index',
        })
        console.log("跳转到会员中心")

      } else {
        wx.showModal({
          title: '信息提示',
          content: res.errmsg,
          showCancel: false
        })
      }
    });
  },
  goAfterSale: function() {
    wx.showToast({
      title: '目前不支持',
      icon: 'none',
      duration: 2000
    });
  },
  aboutUs: function() {
    wx.navigateTo({
      url: '/pages/about/about'
    });
  },
  goHelp: function() {
    wx.navigateTo({
      url: '/pages/help/help'
    });
  },
  exitLogin: function() {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function(res) {
        if (!res.confirm) {
          return;
        }

        util.request(api.AuthLogout, {}, 'POST');
        app.globalData.hasLogin = false;
        wx.removeStorageSync('token');
        wx.removeStorageSync('userInfo');
        wx.clearStorageSync();
        wx.reLaunch({
          url: '/pages/index/index'
        });
      }
    })
  },

  /**
   *
   * 签到
   *
   */
  sign: function() {
    this.goLogin() //未登陆就进入登录界面。
    if (!this.checkPhone()) {
      return
    }
    if (!this.data.hasLogin) {
      return
    }
    wx.navigateTo({
      url: "../../../userCenterPages/signPage/index"
    })


  },
  //会员优先享
  priority: function() {
    this.goLogin() //未登陆就进入登录界面。
    if (!this.data.hasLogin) {
      return
    }
    wx.navigateTo({ //打开新页面
      url: '../../../userCenterPages/priority/priority'
    })
  },

  //我的会员卡
  myCard: function() {
    this.goLogin() //未登陆就进入登录界面。
    if (!this.data.hasLogin) {
      return
    }
    if (this.data.isStarShineMember) {
      wx.navigateTo({ //打开新页面
        url: '../../../userCenterPages/myCard/myCard/myCard'
      })
    } else {
      wx.navigateTo({ //打开新页面
        url: '../../../userCenterPages/newCard/newCard'
      })
    }

  },

  //会员卡充值操作
  cardRecharge: function() {
    this.goLogin() //未登陆就进入登录界面。
    if (!this.data.hasLogin) {
      return
    }
    wx.navigateTo({ //打开新页面
      url: '../../../userCenterPages/myCard/cardRecharge/cardRecharge'
    })
  },

  //星享金操作,使用用户星享金等级换取用户佣金比例
  enjoyStar: function() {
    this.goLogin() //未登陆就进入登录界面。
    if (!this.data.hasLogin) {
      return
    }
    wx.navigateTo({
      url: '../../../userCenterPages/enjoyStar/enjoyStar/enjoyStar',
    })
  },
  bindCard: function() {
    this.goLogin() //未登陆就进入登录界面。
    if (!this.data.hasLogin) {
      return
    }
    wx.navigateTo({
      url: '../../../userCenterPages/bindCard/bindCard',
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    var that = this;
    this.goLogin()
    if (this.data.hasLogin) {
      user.getUserCenterData()
      user.getCustomMemberData()
      this.checkedUserInfo()
      user.checkedBindPhone()
      this.checkedDistributor();
      this.getOrder();
      this.checkedMember();
      this.checkStarShineMember();
      wx.stopPullDownRefresh();
    }
  }
})