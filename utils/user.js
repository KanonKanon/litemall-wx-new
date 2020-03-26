/**
 * 用户相关服务
 */
const util = require('../utils/util.js');
const api = require('../config/api.js');
const app = getApp();



/**
 * Promise封装wx.checkSession
 */
function checkSession() {
  return new Promise(function(resolve, reject) {
    wx.checkSession({
      success: function() {
        resolve(true);
      },
      fail: function() {
        reject(false);
      }
    })
  });
}

/**
 * Promise封装wx.login
 */
function login() {
  return new Promise(function(resolve, reject) {
    wx.login({
      success: function(res) {
        if (res.code) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function(err) {
        reject(err);
      }
    });
  });
}

/**
 * 调用微信登录
 */
function loginByWeixin(userInfo) {

  return new Promise(function(resolve, reject) {
    return login().then((res) => {
      //登录远程服务器
      util.request(api.AuthLoginByWeixin, {
        code: res.code,
        userInfo: userInfo
      }, 'POST').then(res => {
        if (res.errno === 0) {
          //存储用户信息
          wx.setStorageSync('userInfo', res.data.userInfo);
          wx.setStorageSync('token', res.data.token);
          resolve(res);
        } else {
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    })
  });
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function(resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
      checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });
    } else {
      reject(false);
    }
  });
};
//获取钱数据 检测是否绑定会员卡  success表示请求成功后才执行的代码
function getWallet(success = () => {}) {
  let centerUserInfo = null
  if (wx.getStorageSync("centerUserInfo") == "") {
    this.getUserCenterData(() => {
      centerUserInfo = wx.getStorageSync("centerUserInfo")
    });

  } else {
    centerUserInfo = wx.getStorageSync("centerUserInfo")
  }
  var data = {
    prepaidCard: centerUserInfo.prepaidCard
  }
  var func = (res) => {
    if (res.errno == 0) {
      wx.setStorageSync("wallet", res.data);
      wx.setStorageSync("isBindCard", true);
      success();
    } else {
      wx.showModal({
        title: '信息提示',
        content: "商城还没有绑定会员卡，赶快绑定吧！",
        showCancel: false,
        success(v) {
          if (v.confirm) {
            wx.setStorageSync("isBindCard", false);
          }
        }
      })

    }

  }
  util.request(api.Wallet, data).then(func);
};
//获取会员数据
function getUserCenterData(success = () => {}, fail = () => {}) {
  var that = this;
  let userInfo = wx.getStorageSync("userInfo")
  var data = {
    userPhone: userInfo.userPhone
  }
  var func = (res) => {
    if (res.errno === 0) {
      wx.setStorageSync("centerUserInfo", res.data)
      success()
    } else {
      fail();
      console.log(res.errmsg)
    }
  }
  util.request(api.User, data).then(func);
};
/**
 * 检测是否绑定电话
 */
function checkedBindPhone() {
  let userInfo = wx.getStorageSync("userInfo");
  if (userInfo.userPhone) {
    if (!wx.getStorageSync('customMemberData')){
      this.getCustomMemberData();
    }
    if (!wx.getStorageSync("centerUserInfo")){
      const success = () => {
        wx.setStorageSync('isStarShineMember', true);
        console.log("已获取星光会员中心数据")
      }
      const fail = () => {
        wx.setStorageSync('isStarShineMember', false);
       
      }
      this.getUserCenterData(success, fail) //已经绑定手机就要获取数据，判断是否绑定随享卡
      
    }
    return true
  } else {
    wx.navigateTo({
      url: '/userCenterPages/bindPhone/bindPhone',
    })
    return false
  }


}

/**
 * 检查用户是否分销员
 */
function checkedDistribution(success = () => {}) {
  var func = (res) => {
    // console.log(res)
    if (res.errno == 0) {
      let distributorData = res.data;
      wx.setStorageSync('distributorData', distributorData);
      success();
    } else {
      console.log(res.errmsg)
    }
  }
  util.request(api.DistributionCheck).then(func)
}

/**
 * 获取通用会员信息
 */
function getCustomMemberData(success = () => {}) {
  var func = (res) => {
    //  console.log(res)
    if (res.errno == 0) {
      if (res.data.length) {
        wx.setStorageSync('customMemberData', res.data)
        wx.setStorageSync('isMember', true)
        console.log("已获取通用会员数据")
        success()
      }
    } else {
      util.showError(res.errmsg)
    }
  }
  util.no_loading_request(api.MemberDetail).then(func);
}
/**
 * 成为通用版会员
 */
function becomeMember(success = () => {}) {
  var func = (res) => {
    console.log(res)
    if (res.errno == 0) {
      console.log("成为通用会员")
      wx.showModal({
        title: '信息提示',
        content: '操作成功,已成为会员！',
        showCancel: false
      })
      success()
    } else {
      util.showError(res.errmsg)
    }
  }
  var userInfo = wx.getStorageSync("userInfo");
  var realName = wx.getStorageSync('realName');
  if (realName === "") {
    util.showError('请输入真实姓名')
    return
  }
  var data = {
    userPhone: userInfo.userPhone,
    userName: realName
  }
  util.no_loading_request(api.MemberBecome, data, 'POST').then(func);
}

module.exports = {
  loginByWeixin: loginByWeixin,
  checkLogin: checkLogin,
  getUserCenterData: getUserCenterData,
  getWallet: getWallet,
  checkedBindPhone: checkedBindPhone,
  checkedDistribution: checkedDistribution,
  getCustomMemberData,
  becomeMember,
};