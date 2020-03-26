const app = getApp()
const getApi = getApp().globalData.getApi
Page({

    /**
     * 页面的初始数据
     */
    data: {
        recharges: [
            // '2800',
            // '3800'
            '4680'
        ],
        actualRecharges: [
            // '2968',
            // '4028'
            '4980'
        ],
        recharge: '4680',
        actualRecharge: '4980',
    },
    rechargeSelect: function (e) {
        var id = e.currentTarget.id
        var recharge = this.data.recharges[id]
        var actualRecharge = this.data.actualRecharges[id]
        this.setData({
            recharge: recharge,
            actualRecharge: actualRecharge

        })
    },
    /**
     *
     * 封装的函数
     *
     */
    request: function (orderNumber) {
        var that = this
        wx.request({
            url: getApi + 'myCard/cardRecharge',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                recharge: that.data.actualRecharge,
                thirdSession: that.data.thirdSession,
                type: '2',
                orderNumber: orderNumber
            }, success: function (res) {
                var errmsg = res.data.errMsg
                if (res.data.state) {
                    console.log(res)
                    wx.showToast({
                        title: '成功',
                        icon: 'success',
                        duration: 2000
                    })
                    app.globalData.userInfo.canUseBalance = res.data.canUseBalance;
                    app.globalData.userInfo.prepayPoint = res.data.prepayPoint;
                    wx.redirectTo({
                        url: '../../pages/index/index'
                    })
                }
                else {

                    wx.showModal({
                        title: "发生错误",
                        content: errmsg,
                        showCancel: false,
                        confirmText: "确定"
                    })
                }
            }
        })
    },

    /**
     *
     * 充值积分
     *
     * @param orderNumber
     */
    requestPoint: function () {
        var that = this
        wx.request({
            url: getApi + 'myCard/pointRecharge',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                recharge: '3000',
                thirdSession: that.data.thirdSession,
                type: '4',
            }, success: function (res) {
                var errmsg = res.data.errMsg
                if (res.data.state) {
                    console.log(res)
                    wx.showToast({
                        title: '成功',
                        icon: 'success',
                        duration: 2000
                    })
                    app.globalData.userInfo.canUseBalance = res.data.canUseBalance;
                    app.globalData.userInfo.prepayPoint = res.data.prepayPoint;
                    wx.redirectTo({
                        url: '../../pages/index/index'
                    })
                }
                else {

                    wx.showModal({
                        title: "发生错误",
                        content: errmsg,
                        showCancel: false,
                        confirmText: "确定"
                    })
                }
            }
        })
    },

    /**
     *
     * 发起微信支付
     *
     */
    bindViewTap: function () {
        var that = this
        wx.request({
            url: getApi + 'myCard/wxCardRecharge',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            data: {
                recharge: that.data.recharge,
                thirdSession: that.data.thirdSession,
                type: '1'
            },
            success: function (res) {
                var orderNumber = res.data.orderNumber
                var errmsg = res.data.errMsg
                if (res.data.state) {
                    wx.requestPayment({
                        'timeStamp': res.data.timeStamp,
                        'nonceStr': res.data.nonceStr,
                        'package': res.data._package,
                        'signType': 'MD5',
                        'paySign': res.data.paySign,
                        'success': function (res) {
                            if (res.errMsg == 'requestPayment:ok') {
                                // that.request(orderNumber);
                                // that.requestPoint();
                                wx.redirectTo({
                                    url: '../../pages/index/index'
                                })
                            }

                        }
                    })
                } else {
                    wx.showModal({
                        title: "发生错误",
                        content: errmsg,
                        showCancel: false,
                        confirmText: "确定"
                    })
                }
            }
        })
    }
    ,
    // bindViewTap: function () {
    //   var that = this
    //   wx.request({
    //     url: getApi + 'myCard/cardRecharge',
    //     method: 'POST',
    //     header: {
    //       'content-type': 'application/json'
    //     },
    //     data: {
    //       recharge: that.data.recharge,
    //       thirdSession: that.data.thirdSession,
    //       type: '1'
    //     },
    //     success: function (res) {
    //       var errmsg = res.data.errmsg;
    //       if (res.data.state) {
    //         console.log(res)
    //         wx.showToast({
    //           title: '成功',
    //           icon: 'success',
    //           duration: 2000
    //         })
    //         app.globalData.userInfo.canUseBalance = res.data.canUseBalance;
    //         app.globalData.userInfo.prepayPoint = res.data.prepayPoint;
    //         wx.redirectTo({
    //           url: '../../pages/index/index'
    //         })
    //       }
    //       else {

    //         wx.showModal({
    //           title: "发生错误",
    //           content: errmsg,
    //           showCancel: false,
    //           confirmText: "确定"
    //         })
    //       }
    //     }
    //   })
    // },

    onLoad: function (options) {
        this.setData({
            userInfo: app.globalData.userInfo,
            thirdSession: app.globalData.thirdSession,
        })
    }
    ,


})