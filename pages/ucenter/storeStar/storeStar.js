const utils = require('../../../utils/utils.js');
const app = getApp();
const getApi = getApp().globalData.getApi;
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    onLoad: function (options) {
        let centerUserInfo = wx.getStorageSync("centerUserInfo")
        let prepaidCard = centerUserInfo.prepaidCard;
        let path = "https://usercenter.bingold.cn/bsDemo/bs/bs-cardPage?cardId=" + prepaidCard;
        // let cardId = options.cardId
        // let path = "https://usercenter.bingold.cn/bsDemo/bs/bs-cardPage?cardId=" + cardId;
        this.setData({
            path: path,
        })
    }
});