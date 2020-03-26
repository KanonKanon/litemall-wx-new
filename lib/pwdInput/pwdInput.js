Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {            
      type: String,    
      value: "输入支付密码"     
    },
    
    // 弹窗确认按钮文字
    btn_name: {
      type: String,
      value: '确认支付'
    },
   
    confirm:{
      type:Function
    },
    bindinput:{
      type:Function
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    flag: true,
    length:6,
    dot_len:0,
    pwd:"",
    isShowNum:false,
    isFocus:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapContainer:function(){
      this.setData({
        isFocus:true
      })
    },
    showNum:function(){
      var isShow=this.data.isShowNum
      isShow=!isShow;
      this.setData({
        isShowNum:isShow
      })
    },
    //隐藏弹框
    hideInput: function () {
      this.setData({
        flag: !this.data.flag,
        isFocus:false
      })
    },
    //展示弹框
    showInput() {
      this.setData({
        flag: !this.data.flag,
        pwd:"",
        dot_len:0,
        isShowNum:false,
        isFocus:true
      })
    },
    /*
    * triggerEvent 用于触发事件
    */
    bindtap:function(){
      this.triggerEvent("confirm")
    },
    pwdInput:function(e){
      this.triggerEvent("bindinput",e)
      
      this.setData({
        dot_len:e.detail.value.length,
        pwd:e.detail.value
      })
      if(e.detail.value.length==6){
        this.bindtap()
      }
    }
  }
})