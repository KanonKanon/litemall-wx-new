// userCenterPages/newClient/newClient.js
const user = require('../../utils/user.js')
const api = require('../../config/api.js')
const util = require("../../utils/util.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:"storeOpen",
    dataForm:{
      name:'',
      sex:'男',
      birth:'',
      addr:'',
      idCard:'',
      storeName:'',
      editorName:''
    },
    sexOption: [
      { text: '男', value: '男' },
      { text: '女', value: '女' },
    ],
    shopList:[],
    selectPicUrl:''

  },
  onChange(e){
    console.log(e)
    let dataForm = this.data.dataForm
    if(e.detail.title==="分店引导开卡"){
      dataForm.storeName=""
      dataForm.editorName=""
    }
    else{
      dataForm.storeName = "总部"
      dataForm.editorName = ""
    }
    this.setData({
      dataForm: dataForm,
      active:e.detail.name
    })
  },

  splitBirth(birth){
    let blist = []
    blist.push(birth.slice(0,4))
    blist.push(birth.slice(4,6))
    blist.push(birth.slice(6))
    console.log(blist)
    return blist.join('-')
  },

  reflash(){
    let that = this
    if(this.data.active==="storeOpen"){
      this.setData({
        active:'selfOpen'
      })
      setTimeout(()=>{
        that.setData({
          active:'storeOpen'
        })
      },50)
    }
  },

  chooseImg(){
    const that = this 
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // console.log(res)
        that.setData({
          selectPicUrl:res.tempFilePaths[0]
        })
        const img64 = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
        // console.log(img64)
        util.request(api.OfflineUcOrc,{
           imgBase64:img64
         },'post').then(v=>{
           console.log(v)
           if(v.errno===0){
             const idCardResault = v.data.idCardResult
             const dataform ={
               name: idCardResault.name,
               sex: idCardResault.sex,
               birth:idCardResault.birth,
               addr: idCardResault.address,
               idCard: idCardResault.idCard,
               storeName: '',
               editorName: ''
             }
             console.log(dataform)
             that.setData({
               dataForm:dataform
             })
           }
         })
      }
    })
  },

/**
 * 分店引导确认
 */
  storeConfirm(){
    const dataForm = this.data.dataForm
    if(!dataForm.name){
      util.showError('请输入姓名')
      return
    }
    if(!dataForm.sex){
      util.showError('请选择性别')
      return
    }
    if(!dataForm.idCard){
      util.showError('请输入身份证号')
      return
    }
    if(!dataForm.birth){
      util.showError("请输入生日")
      return
    }
    if (!dataForm.addr) {
      util.showError("请输入住址")
      return
    }
    if (!dataForm.storeName) {
      util.showError("请输入开卡分店")
      return
    }
    if (!dataForm.editorName) {
      util.showError("请输入销售员")
      return
    }

    util.request(api.CloudCardOpen,dataForm,'post').then((res)=>{
      console.log(res)
      if(res.errno==0){
        wx.showModal({
          title: '信息提示',
          content: '操作成功',
          success(v) {
            if (v.confirm) {
              user.checkedBindPhone()
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
      else{
        console.log(res.errmsg)
        util.showError(res.errmsg)
      }
    })
  },

/**
 * 自助开卡确认
 */
  selfConfirm(){
    const dataForm = this.data.dataForm
    if (!dataForm.name) {
      util.showError('请输入姓名')
      return
    }
    if (!dataForm.sex) {
      util.showError('请选择性别')
      return
    }
    if (!dataForm.idCard) {
      util.showError('请输入身份证号')
      return
    }
    if (!dataForm.birth) {
      util.showError("请输入生日")
      return
    }
    if (!dataForm.addr) {
      util.showError("请输入住址")
      return
    }
    
    dataForm.storeName = "总部"
    dataForm.editorName = ""
   

    util.request(api.CloudCardOpen, dataForm, 'post').then((res) => {
      console.log(res)
      if (res.errno == 0) {
        wx.showModal({
          title: '信息提示',
          content: '操作成功',
          success(v){
            if(v.confirm){
              user.getUserCenterData()
              wx.navigateBack({
                delta:1
              })
            }
          }
        })
      }
      else {
        console.log(res.errmsg)
        util.showError(res.errmsg)
      }
    })
  },

  /**
  * 获取所有店铺的列表
  */
  getShopList: function () {
    var that = this;
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.userLocation" 这个 scope
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              wx.getLocation({
                // type: 'wgs84',
                success(res) {
                  const latitude = res.latitude; //纬度
                  const longitude = res.longitude; //经度

                  var data = {
                    cur_lat: latitude,
                    cur_lng: longitude,
                    idList: ""
                  }
                  var func = (res2) => {
                    if (res2.errno == 0) {
                      var citys = [];
                      res2.data.forEach((v) => {
                        if (citys.indexOf(v.city) == -1) {
                          citys.push(v.city);
                        }
                      })

                      let tempdata = util.insertSort(res2.data)
                      let templist = []
                      for (let item of tempdata) {
                        templist.push(item.name)
                      }
                      that.setData({
                        shopList: tempdata,
                      })
                    } else {
                      wx.showModal({
                        title: '信息提示',
                        content: res2.errmsg,
                        showCancel: false
                      })
                    }
                  }
                  util.request(api.StoreList, data).then(func);
                }
              })
            }
          })
        } else {
          wx.getLocation({
            // type: 'wgs84',
            success(res) {
              // console.log(res);
              const latitude = res.latitude; //纬度
              const longitude = res.longitude; //经度

              var data = {
                cur_lat: latitude,
                cur_lng: longitude,
                idList: ""
              }
              var func = (res2) => {
                // console.log(res2)
                if (res2.errno == 0) {
                  var citys = [];
                  res2.data.forEach((v) => {
                    if (citys.indexOf(v.city) == -1) {
                      citys.push(v.city);
                    }
                  })

                  let tempdata = util.insertSort(res2.data)
                  let templist = []
                  for(let item of tempdata){
                    templist.push(item.name)
                  }

                  that.setData({
                    shopList: templist,
                  })
                } else {
                  wx.showModal({
                    title: '信息提示',
                    content: res2.errmsg,
                    showCancel: false
                  })
                }
              }
              util.request(api.StoreList, data).then(func);
            }
          })
        }
      }
    })
  },

  editorInput(e){
    let dataForm = this.data.dataForm
    dataForm.editorName = e.detail
    this.setData({
      dataForm: dataForm
    })
  },

/**
 * 选择生日
 */
  bindDateChange(e){
    console.log(e)
    let dataform = this.data.dataForm
    let values = e.detail.value.split("-")
    dataform.birth = values.join('')
    this.setData({
      dataForm:dataform
    })
  },
  bindStoreChange(e){
    let dataform = this.data.dataForm
    dataform.storeName =this.data.shopList[e.detail.value]
    this.setData({
      dataForm: dataform
    })
  },

  nameInput(e){
    let dataForm=this.data.dataForm
    dataForm.name = e.detail
    this.setData({
      dataForm:dataForm
    })
  },
  addrInput(e){
    // console.log(e)
    let dataForm = this.data.dataForm
    dataForm.addr=e.detail.value
    this.setData({
      dataForm: dataForm
    })
  },
  idCardInput(e) {
    let dataForm = this.data.dataForm
    dataForm.idCard = e.detail
    this.setData({
      dataForm: dataForm
    })
  },

  /**
   * 选择性别
   */
  sexSelect(e){
    console.log(e)
    const dataForm = this.data.dataForm
    dataForm.sex=e.detail
    this.setData({
      dataForm:dataForm
    })
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
    this.getShopList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    wx.stopPullDownRefresh()
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