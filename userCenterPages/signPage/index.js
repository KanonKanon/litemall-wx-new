//index.js
//获取应用实例
var user = require("../../utils/user.js");
var utils = require("../../utils/util.js");
var api = require("../../config/api.js");
var app = getApp();
var calendarSignData;
var date;
var calendarSignDay;
Page({
  data: {
    calendarSignData: {},
    calendarSignDay: 0,
    canTapSign: true,
  },
  //导航栏回退按钮事件
  navLeftBtn: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 
   */
  removeDuplicate(list){
    return list.filter((x,i)=>list.indexOf(x)===i)
  },

  //初始化时加载已经签到的日期
  init: function() {
    this.clearData()
    this.drawCalendar()
    //请求已经签到的日期
    var url = api.SignList;
    var that = this;
    var func = function(res) {
      if (res.errno == 0) {
        console.log(res)
        if (res.data.date.length == 0) return;
        res.data.date = that.removeDuplicate(res.data.date)
        res.data.date.forEach(function(v) {
          calendarSignData[v] = v;
        })
        calendarSignDay = res.data.date.length;
        wx.setStorageSync("calendarSignData", calendarSignData);
        wx.setStorageSync("calendarSignDay", calendarSignDay);
        that.setData({
          calendarSignData: calendarSignData,
          calendarSignDay: calendarSignDay
        })
      } else {
        console.log(res)
      }
    }
    utils.request(url).then(func);

  },
  //事件处理函数
  calendarSign: function() {
    //签到请求
    var that = this;
    if (that.data.canTapSign == false) return;
    that.setData({
      canTapSign:false
    })
    var func = function(res) {
      that.setData({
        canTapSign:true
      })
      if (res.errno == 0) {
        calendarSignData[date] = date;
        console.log(calendarSignData);
        var newval = calendarSignDay
        newval = newval + 1;
        calendarSignDay = newval;
        wx.setStorageSync("calendarSignData", calendarSignData);
        wx.setStorageSync("calendarSignDay", calendarSignDay);
        wx.showModal({
          title: '签到成功',
          content: '获得消费积分：' + res.data.point * 0.01 + '分',
          showCancel: false
        })
        that.setData({
          calendarSignData: calendarSignData,
          calendarSignDay: calendarSignDay
        })
        if (wx.getStorageSync('isStarShineMember')){
          user.getWallet();
        }
        that.onPullDownRefresh();

      } else {
        console.log(res)
        wx.showModal({
          title: '信息提示',
          content: res.errmsg,
          showCancel: false,
        });
      }
    }
    utils.request(api.Sign, {}, "POST").then(func);

  },
  //初始化
  drawCalendar: function() {
    var mydate = new Date();
    var year = mydate.getFullYear();
    var month = mydate.getMonth() + 1;
    date = mydate.getDate();
    console.log("date=" + date)
    var day = mydate.getDay();
    console.log(day)
    var nbsp = 7 - ((date - day) % 7) + 1; //所有日期向右移一位。
    // if(nbsp===7){nbsp=0}
    console.log("nbsp" + nbsp);
    var monthDaySize;
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
      monthDaySize = 31;
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
      monthDaySize = 30;
    } else if (month == 2) {
      // 计算是否是闰年,如果是二月份则是29天
      if ((year - 2000) % 4 == 0) {
        monthDaySize = 29;
      } else {
        monthDaySize = 28;
      }
    };
    // 判断是否签到过
    if (wx.getStorageSync("calendarSignData") == null || wx.getStorageSync("calendarSignData") == '') {
      wx.setStorageSync("calendarSignData", new Array(monthDaySize));
    };
    if (wx.getStorageSync("calendarSignDay") == null || wx.getStorageSync("calendarSignDay") == '') {
      wx.setStorageSync("calendarSignDay", 0);
    }
    calendarSignData = wx.getStorageSync("calendarSignData")
    calendarSignDay = wx.getStorageSync("calendarSignDay")
    console.log(calendarSignData);
    console.log(calendarSignDay)
    this.setData({
      year: year,
      month: month,
      nbsp: nbsp,
      monthDaySize: monthDaySize,
      date: date,
      calendarSignData: calendarSignData,
      calendarSignDay: calendarSignDay
    })
  },
  onReady: function() {
    this.init();
  },

  clearData: function() {
    wx.removeStorageSync("calendarSignData")
    wx.removeStorageSync("calendarSignDay")
    this.setData({
      calendarSignData: {},
      calendarSignDay: 0
    })
  },

  //下拉刷新
  onPullDownRefresh:function() {
    this.init()
    wx.stopPullDownRefresh();
  }

})