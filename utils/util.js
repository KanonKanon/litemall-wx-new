var api = require('../config/api.js');
var app = getApp();

/**
 *
 * 插入排序
 * @param {Array} arr
 *  @returns sorted arr
 */
function insertSort(arr) {
  let length = arr.length;
  for (let i = 1; i < length; i++) {
    let temp = arr[i];
    let j = i;
    for (; j > 0; j--) {
      if (temp.distance >= arr[j - 1].distance) {
        break;      // 当前考察的数大于前一个数，证明有序，退出循环
      }
      arr[j] = arr[j - 1]; // 将前一个数复制到后一个数上
    }
    arr[j] = temp;  // 找到考察的数应处于的位置
  }
  return arr;
}



//希尔排序
function shellSort(arr) {
  for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    // 内层循环与插入排序的写法基本一致，只是每次移动的步长变为 gap
    for (let i = gap; i < arr.length; i++) {
      let j = i;
      let temp = arr[j]
      for (; j > 0; j -= gap) {
        if (temp.distance >= arr[j - gap].distance) {
          break;
        }
        arr[j] = arr[j - gap];
      }
      arr[j] = temp;
    }
  }
  return arr;
}

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
  wx.showLoading({
    title: '请稍候',
  })
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-Litemall-Token': wx.getStorageSync('token')
      },
      success: function(res) {
        wx.hideLoading()
        if (res.statusCode == 200) {

          if (res.data.errno == 501) {
            // 清除登录相关内容
            try {
              wx.removeStorageSync('userInfo');
              wx.removeStorageSync('token');
              wx.removeStorageSync('hasLogin');
            } catch (e) {
              // Do something when catch error
            }
            wx.showModal({
              title: '未登录',
              content: '登录信息过期了，请重新登录',
              showCancel: true,
              confirmText: '去登录',
              cancelText: '不登录',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: "/pages/auth/login/login"
                  });
                }
              }
            })
           
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }

      },
      fail: function(err) {
        reject(err)
      }
    })
  });
}
/**
 * 封封微信的的request
 */
function no_loading_request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-Litemall-Token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.statusCode == 200) {

          if (res.data.errno == 501) {
            // 清除登录相关内容
            try {
              wx.removeStorageSync('userInfo');
              wx.removeStorageSync('token');
              wx.removeStorageSync('hasLogin');
            } catch (e) {
              // Do something when catch error
            }
            // 切换到登录页面
            // wx.navigateTo({
            //   url: '/pages/auth/login/login'
            // });
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }

      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}

function redirect(url) {

  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: '/pages/auth/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}
function showError(msg){
  wx.showModal({
    title: '信息提示',
    content: msg,
    showCancel:false
  })
}
/**
   * 获取日期，today:"2018-8-8",不传表示今天，addDayCount:-1昨天，0今天，1明天 ； 返回日期字符串
   */
function getDateStr(today, addDayCount) {
  var date;
  if (today) {
    date = new Date(today);
  } else {
    date = new Date();
  }
  date.setDate(date.getDate() + addDayCount); //获取AddDayCount天后的日期 
  var y = date.getFullYear();
  var m = date.getMonth() + 1; //获取当前月份的日期 
  var d = date.getDate();
  if (m < 10) {
    m = '0' + m;
  };
  if (d < 10) {
    d = '0' + d;
  };
  console.log(y + "-" + m + "-" + d)
  return y + "-" + m + "-" + d;
}

/*删除数组中的某一个对象
_arr:数组
_obj:需删除的对象
*/
function removeArrayItem(_arr, _obj) {
  var length = _arr.length;
  for (var i = 0; i < length; i++) {
    if (_arr[i] == _obj) {
      if (i == 0) {
        _arr.shift(); //删除并返回数组的第一个元素
        return _arr;
      }
      else if (i == length - 1) {
        _arr.pop();  //删除并返回数组的最后一个元素
        return _arr;
      }
      else {
        _arr.splice(i, 1); //删除下标为i的元素
        return _arr;
      }
    }
  }
}
/**
 * 判断两个复杂对象 是否相等，相等返回true,不相等返回false;
 */
function isObjectValueEqual(a, b) {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
  if (aProps.length != bProps.length) {
    return false;
  }
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i]

    var propA = a[propName]
    var propB = b[propName]
    if ((typeof (propA) === 'object')) {
      if (this.isObjectValueEqual(propA, propB)) {
        return true
      } else {
        return false
      }
    } else if (propA !== propB) {
      return false
    } else { }
  }
  return true
}

module.exports = {
  formatTime,
  request,
  redirect,
  showErrorToast,
  showError,
  getDateStr,
  removeArrayItem,
  no_loading_request,
  shellSort,
  insertSort
}