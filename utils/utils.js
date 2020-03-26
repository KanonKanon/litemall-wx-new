const app = getApp();
const getApi = getApp().globalData.getApi;
const getNewApi = getApp().globalData.getNewApi; 

const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n
};

/**
 *
 * 错误信息提示
 *
 */
const showErr = errMsg => {
  errMsg = errMsg.toString();
  wx.showModal({
    tittle: "发生错误",
    content: errMsg,
    showCancel: false,
    confirmText: "确定"
  })
};

/**
 *
 * 刷新信息
 *
 */
const reflash = (that) => {
  wx.showNavigationBarLoading(); //在标题栏中显示加载
  wx.request({
    url: getApi + 'login/reflash',
    data: {
      thirdSession: wx.getStorageSync('thirdSession'),
    },
    success: function(res) {
      if (res.data.state) {
        app.globalData.userInfo = res.data;
        that.setData({
          userInfo: app.globalData.userInfo
        });
        // 積分同步
        syncPoint(res.data.phone, res.data.consumePoint);
      } else {
        let errMsg = res.data.errMsg;
        showErr(errMsg)
      }
    },
    complete: function() {
      wx.hideNavigationBarLoading(); //完成停止加载
      wx.stopPullDownRefresh(); //停止下拉刷新
    }
  })
};

/**
 *
 * 封装一个showLoading
 *
 */
const loading = () => {
  wx.showLoading({
    title: "请稍候",
    mask: true
  });
};

/**
 *
 * 封装了微信调接口的GET方法
 *
 * @param url 接口的resultMapping
 * @param data 传的数据对象
 * @param func success后的回调函数
 */
const getRequest = (url, data, func) => {
  loading();
  url = url.toString();
  wx.request({
    data: data,
    url: getApi + url,
    success: function(res) {
      wx.hideLoading();
      func(res);
    }
  })
};

/**
 *
 * 封装了微信调接口的POST方法
 *
 * @param url 接口的resultMapping
 * @param data 传的数据对象
 * @param func success后的回调函数
 */
const request = (url, data, func) => {
  loading();
  url = url.toString();
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    data: data,
    success: function(res) {
      wx.hideLoading();
      func(res);
    }
  })
};

/**
 *
 * 封装了微信调接口的POST方法
 *
 * @param url 接口的resultMapping
 * @param data 传的数据对象
 * @param func success后的回调函数
 */
const post = (url, data, func) => {
  loading();
  url = url.toString();
  wx.request({
    url: url,
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: data,
    success: function (res) {
      wx.hideLoading();
      func(res);
    }
  })
};

/**
 *
 * 成功的标识
 *
 */
const success = () => {
  wx.showToast({
    title: '成功',
    icon: 'success',
    duration: 2000
  })
};

/**
 *
 * 登陆获取相关信息
 *
 * @param that
 * @param url
 * @param data
 * @param func
 */
const login = () => {
  let that = this;
  loading();
  wx.login({
    success: function(res) {
      wx.hideLoading();
      if (res.code) {
        let url = 'login/getInfo';

        let data = {
          code: res.code
        };

        //临时函数
        let func = (res) => {
          console.log(res);
          app.globalData.thirdSession = res.data.thirdSession;
          wx.setStorageSync('thirdSession', res.data.thirdSession);
          console.log("已完成登陆");
          if (!res.data.state) {
            wx.redirectTo({
              url: '/pages/register/register'
            })
          }
        };

        getRequest(url, data, func);
      } else {
        showErr('获取用户登录态失败！' + res.errMsg)
      }
    },
    fail: function() {
      that.login();
    }
  })
};

/**
 *
 * 倒计时,60s
 *
 * @param that
 */
const sendCode = (that) => {
  that.setData({
    phoneDis: true,
    codeDis: true,
    currentTime: 60
  });
  let time = setInterval(() => {
    let currentTime = that.data.currentTime;
    currentTime--;
    that.setData({
      currentTime: currentTime
    });
    if (currentTime == 0) {
      clearInterval(time);
      that.setData({
        phoneDis: false,
        codeDis: false,
        currentTime: "获取验证码",
        flag: true
      })
    }
  }, 1000)
};

/**
 *
 * 判断是否为空
 *
 * @param obj
 * @returns {boolean}
 */
const isNull = (obj) => {
  return (obj == null || obj === '' || obj === "");
};

/**
 *
 * 隐私信息*号化
 *
 * @param str
 * @returns {string}
 */
const secretStr = (str) => {
  let prefix = str.slice(0, 3);
  let suffix = str.slice(str.length - 4, str.length);
  let length = str.length - 7;
  let tem = '';
  for (let i = 0; i < length; i++) {
    tem += '*'
  }
  return prefix + tem + suffix;
};

/**
 *
 * 时间格式转换未yyyy-MM-dd
 *
 * @param date
 */
const dateFormat = (date) => {
  date = date.toString();
  let yyyy = date.slice(0, 4);
  let MM = date.slice(4, 6);
  let dd = date.slice(6, 8);
  return yyyy + "-" + MM + "-" + dd;
};

/**
 * 与当前时间作比较,如果当前时间超过传入的时间,返回true
 *
 * @param date yyyy-MM-dd
 * @flag 1:当天不包括传入时间,即当天必须在传入时间之后;2:当天包含传入时间
 */
const judgDate = (date, flag) => {
  date = date.toString();
  let now = new Date;
  let yyyy = date.slice(0, 4);
  let y = now.getFullYear();
  let MM = date.slice(5, 7);
  let M = now.getMonth() + 1;
  let dd = date.slice(8, 10);
  let d = now.getDate();
  now = y * 10000 + M * 100 + d * 1;
  date = yyyy * 10000 + MM * 100 + dd * 1;
  return flag == 1 ? now > date : now < date;
};

const syncPoint = (phone, consumePoint) => {
  wx.request({
    url: getNewApi + 'push/customerPointsSync',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      phone: phone,
      consumePoint: consumePoint
    },
    success: function(res) {
      wx.hideLoading();
      (res) => {
        if (res.state) {} else {
          showErr(res.errMsg);
        }
      };
    }
  })
}

module.exports = {
  post: post,
  formatTime: formatTime,
  showErr: showErr,
  reflash: reflash,
  loading: loading,
  request: request,
  success: success,
  login: login,
  sendCode: sendCode,
  isNull: isNull,
  getRequest: getRequest,
  secretStr: secretStr,
  dateFormat: dateFormat,
  judgDate: judgDate,
  syncPoint: syncPoint
};