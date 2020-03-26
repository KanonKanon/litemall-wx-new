var util = require('./utils/util.js');
var api = require('./config/api.js');
var user = require('./utils/user.js');

App({
  onLaunch: function() {
    const updateManager = wx.getUpdateManager();
    wx.getUpdateManager().onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    //检测是否已经登录过了。
    let hasLogin=wx.getStorageSync('hasLogin')
    if(hasLogin!=''){
      this.globalData.hasLogin=hasLogin;
    }
  },
  globalData: {
    hasLogin: false,
    tempShopList: [{
      addr: "大良街道碧鉴路49号",
      area: "顺德区",
      city: "佛山市",
      distance: 5540,
      id: 1,
      name: "碧鉴总店",
      province: "广东省"
    }, {
      addr: "大良新城区大信新都汇一层珠宝区L1036号（即南门入门口处）",
      area: "顺德区",
      city: "佛山市",
      distance: 1085,
      id: 4,
      name: "星汇分店",
      province: "广东省"
    }, {
      addr: "大良东乐路印象城购物广场一层20/21号铺-星光珠宝东新店",
      area: "顺德区",
      city: "佛山市",
      distance: 4476,
      id: 6,
      name: "东新分店",
      province: "广东省"
    }, {
      addr: "大良东乐路印象城购物广场一层星光珠宝东乐分店（HM对面）",
      area: "顺德区",
      city: "佛山市",
      distance: 4508,
      id: 5,
      name: "东乐分店",
      province: "广东省"
    }, {
      addr: "容桂桂洲大道中63号天佑城1层1A011",
      area: "顺德区",
      city: "佛山市",
      distance: 5423,
      id: 8,
      name: "天恩分店",
      province: "广东省"
    }, {
      addr: "容桂桂洲大道中63号天佑城1层1B001",
      area: "顺德区",
      city: "佛山市",
      distance: 5450,
      id: 7,
      name: "天佑分店",
      province: "广东省"
    }, {
      addr: "大良街道华盖路步行街134号",
      area: "顺德区",
      city: "佛山市",
      distance: 6025,
      id: 2,
      name: "华盖分店",
      province: "广东省"
    }, {
      addr: "大良街道凤山中路101号君临购物中心",
      area: "顺德区",
      city: "佛山市",
      distance: 6161,
      id: 3,
      name: "展福分店",
      province: "广东省"
    }, {
      addr: "北滘镇诚德路美的悦然广场一层1018",
      area: "顺德区",
      city: "佛山市",
      distance: 16375,
      id: 12,
      name: "星悦分店",
      province: "广东省"
    }],
  }
})