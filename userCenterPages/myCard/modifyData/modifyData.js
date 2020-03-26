const app = getApp()
const getApi = getApp().globalData.getApi;
const utils = require('../../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    centerUserInfo: {},
    userInfo: {},
    area:"",
    //自己添加
    updateUserInfo: [{
        name: '联系地址',
        value: null
      },
      {
        name: '开户行',
        value: null
      },
      {
        name: '银行卡号码',
        value: null
      },
      {
        name: '邮箱',
        value: null
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var that = this

  },
  onShow: function() {
    var centerUserInfo = wx.getStorageSync("centerUserInfo");
    var userInfo = wx.getStorageSync("userInfo");
    this.setData({
      centerUserInfo: centerUserInfo,
      userInfo: userInfo
    })
  },
  /**
   *
   * input
   *
   */
  input: function(e) {
    var i = e.currentTarget.id
    var obj = this.data.updateUserInfo
    obj[i].value = e.detail.value
    this.setData({
      updateUserInfo: obj
    })
  },
  pikerChange:function(e){
    this.setData({
      area:e.detail.value.join(" ")
    })
  },

  /**
   *
   * 提交表单
   *
   */
  submit: function() {
    var area = this.data.province + '省' + this.data.city + '市' + this.data.district
    var that = this
    wx.showLoading({
      title: '正在提交',
    })
    wx.request({
      header: {
        "Content-Type": "application/json"
      },
      method: 'POST',
      url: getApi + 'myCard/updateUser',
      data: {
        area: area,
        address: that.data.updateUserInfo[0].value,
        openingBank: that.data.updateUserInfo[1].value,
        bankCard: that.data.updateUserInfo[2].value,
        userEmail: that.data.updateUserInfo[3].value,
        id: that.data.userInfo.id
      },
      success: function(res) {
        var errMsg = res.data.errMsg
        wx.hideLoading()
        if (res.data.state) {
          wx.showToast({
            title: "修改成功",
            icon: 'success',
            duration: 2000
          })
          wx.redirectTo({
            url: '../myCard/myCard'
          })
        } else {
          wx.showModal({
            tittle: "发生错误",
            content: errMsg,
            showCancel: false,
            confirmText: "确定"
          })
        }
      }

    })
  },


  selectedProvince: function(e) {
    //获取省份列表
    var arrayTemp1 = [];
    var arrayTemp = this.data.citylist[e.detail.value].c;
    if (arrayTemp[0].a) {
      for (var i = 0; i < arrayTemp.length; i++) {
        arrayTemp1.push(arrayTemp[i].n);
      }
      //更新市显示
      this.setData({
        province: this.data.arrayProvince[e.detail.value],
        indexProvince: e.detail.value,
        arrayCity: arrayTemp1,
        city: '市',
        district: '区',
      })
    }
    //直辖市
    else {
      for (var i = 0; i < arrayTemp.length; i++) {
        arrayTemp1.push(arrayTemp[i].n);
      }
      //更新市显示
      this.setData({
        province: '直辖市',
        indexProvince: -1,
        city: this.data.arrayProvince[e.detail.value],
        district: '区',
        arrayDistrict: arrayTemp1,
      })
    }
  },
  selectedCity: function(e) {
    //获取区列表
    var arrayTemp1 = [];
    var arrayTemp = this.data.citylist[this.data.indexProvince].c[e.detail.value].a;

    for (var i = 0; i < arrayTemp.length; i++) {
      arrayTemp1.push(arrayTemp[i].s);
    }

    //更新区显示
    this.setData({
      city: this.data.arrayCity[e.detail.value],
      indexCity: e.detail.value,
      arrayDistrict: arrayTemp1,
      district: '区',
    })
  },
  selectedDistrict: function(e) {
    var arrayTemp1 = [];
    //直辖市
    if (this.data.indexProvince === -1) {
      //更新区显示
      this.setData({
        district: this.data.arrayDistrict[e.detail.value],
        indexDistrict: e.detail.value,
      })
    }
    //省
    else {
      //获取省份列表
      var arrayTemp = this.data.citylist[this.data.indexProvince].c[this.data.indexCity].a;

      //更新区显示
      this.setData({
        district: arrayTemp[e.detail.value].s,
        indexDistrict: e.detail.value,
      })
    }
  },

})