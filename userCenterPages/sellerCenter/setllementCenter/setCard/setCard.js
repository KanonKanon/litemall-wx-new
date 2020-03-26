// userCenterPages/sellerCenter/setllementCenter/setCard/setCard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankName:'请选择银行',
    bankList:['中国银行','农业银行','工商银行','建设银行','广发银行'],
    bankCardNum:"",
    name:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let bankCardInfo=wx.getStorageSync("bankCardInfo")
    if (bankCardInfo!=""){
      this.setData({
        bankName:bankCardInfo.bankName,
        bankCardNum:bankCardInfo.bankCardNum,
        name:bankCardInfo.name
      })
    }
  },

/**
 * 输入银行卡号
 */
  bankCardNumChange:function(e){
    this.setData({
      bankCardNum:e.detail.value
    })
  },
/**
 * 输入入姓名
 */
  nameChange:function(e){
    this.setData({
      name:e.detail.value
    })
  },
  /**
   * 检测输入是否为空
   */
  checkedEmpty(){
    if(this.data.bankCardNum==""||this.data.bankCardNum.length!=19){
      wx.showModal({
        title: '信息提示',
        content: '请输入正确的银行卡号',
        showCancel:false
      })
      return true;
    }

    if(this.data.name==""){
      wx.showModal({
        title: '信息提示',
        content: '请输入姓名',
        showCancel:false
      })
      return true
    }
    return false
  },

  /**
   * 完成填写
   */
  finish:function(){
    if(this.checkedEmpty()){
      return;
    }

    var bankCardInfo={
      name:this.data.name,
      bankName:this.data.bankName,
      bankCardNum:this.data.bankCardNum
    }
    wx.setStorageSync("bankCardInfo", bankCardInfo)

    wx.navigateBack({
      delta:1
    })


  },
  /**
   * 选择银行
   */
  selectBank:function(e){
    var index=e.detail.value;
    console.log(e)
    this.setData({
      bankName: this.data.bankList[index],
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})