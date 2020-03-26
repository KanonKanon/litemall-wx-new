const utils = require('../../utils/util.js');
const app = getApp();
const getApi = getApp().globalData.getApi;

Page({
    /**
     *
     * 登陆
     *
     */
    login: function () {
        let url = 'login/setLoginPwd';
        let data = {
            thirdSession: wx.getStorageSync('thirdSession'),
            psw: this.data.psw
        };
        let func = (res) => {
            if (res.data.state) {
                wx.redirectTo({
                    url: '../index/index'
                })
            } else {
                let errMsg = res.data.errMsg;
                utils.showErr(errMsg)
            }
        };
        //发起登陆请求
        utils.request(url, data, func);

    },



    /**
     *
     * 密码输入
     *
     * @param e 事件
     */
    pwdInput: function (e) {
        this.setData({
            psw: e.detail.value
        })
    },


    data: {},


});
