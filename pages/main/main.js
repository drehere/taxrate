//index.js
//获取应用实例
const app = getApp()
const server = require('../../server/server.js')
const config = require('../../config/config.js')
const logger=require('../../config/log.js')

Page({
  data: {
    canIUseUserInfo: wx.canIUse('button.open-type.getUserInfo'),
    motto: 'Hello World',
    hasUserInfo: false,
    wxLoginUserInfo: null,


    //表单mvvm数据绑定
    btnSubloading: false,
    grossPay: 40000,
    fee: 5000,
    threshold: 5000,
    

    //计算结果数据绑定
    showResult: false,
    finalTax:0,
    realSalary:0,
    resultDesc:null
  },

  //视图绑定的回调函数
  onSubmit: function(obj) {
    let page = this;
    let value = obj.detail.value;
    this.setData({
      btnSubloading: true
    })
    
    server.calculate({
      data:{
        grossPay: value['grossPay'],
        fee: value['fee'],
        threshold: value['threshold']
      },
      success:(res)=>{
        this.setData({
          showResult: true,
          finalTax:res['result'],
          realSalary: res['realSalary'],
          resultDesc: res['resultDesc']
        })
        logger.console('calculate success ',res)
      },
      fail:(res)=>{

      },
      complete:()=>{
        this.setData({
          btnSubloading: false,
         
        })
      }
  
    })
  },
  onReset: function() {
    this.setData({
      grossPay: 0,
      fee: 0,
      threshold: 5000
    })
  },

  
  uploadUserInfo: function(encryptedData, iv) {
    server.registerInfo({
      data: {
        encryptedData: encryptedData,
        iv: iv
      },
      success: (res) => {
        this.setData({
          hasUserInfo: true,
          wxLoginUserInfo: app.globalData.wxLoginInfo
        })
        wx.setStorageSync('wxLoginInfo', app.globalData.wxLoginInfo)
      },
      fail: (res) => {
        log.str
      }
    })
  },
  onReqUserInfoReady: function(res) {
    logger.console(res)
    let wxUserInfo = getApp().globalData.wxLoginInfo
    let userInfo = res['detail'].userInfo
    wxUserInfo['nickName'] = userInfo['nickName']
    wxUserInfo['avatarUrl'] = userInfo['avatarUrl']
    wxUserInfo['city'] = userInfo['city']
    wxUserInfo['country'] = userInfo['country']
    wxUserInfo['gender'] = userInfo['gender']
    wxUserInfo['province'] = userInfo['province']
    this.uploadUserInfo(res['detail']['encryptedData'], res['detail']['iv'])
  },
  onLoadUserInfoReady: function() {
    this.setData({
      hasUserInfo: true,
      wxLoginUserInfo: app.globalData.wxLoginInfo
    })
  },
  checkLogin: function() {
    return app.globalData.isWxLogin()
  },
  checkDetailInfo: function() {
    return app.globalData.hasWxLoginInfo()
  },
  onLoad: function() {
    if (!this.checkLogin()) {
      return;
    }
    if (this.checkDetailInfo()) {
      this.onLoadUserInfoReady()
    } else if (this.data.canIUseUserInfo) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.onUserInfoReady(res)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          this.onUserInfoReady(res)
        }
      })
    }

    wx.showShareMenu({
      withShareTicket:true,
      success:function(){
        console.info("showShareMenu success ")
      },
      complete:function(){
        console.info("showShareMenu complete ")
      }
    })

  },
  onUserInfoReady: function(res) {
    this.onReqUserInfoReady(res)
  },

  onShareClick:function(res){
    
  },

  /**
   * 对页面的初始化渲染操作可以放到这里
   */
  onReady: function() {

  },
  onShow: function() {
    // Do something when page show.
  },
  onHide: function() {
    // Do something when page hide.
  },
  onUnload: function() {
    // Do something when page close.
  },
  onPullDownRefresh: function() {
    // Do something when pull down.
  },
  onReachBottom: function() {
    // Do something when page reach bottom.
  },
  onShareAppMessage: function (options) {
    // return custom share data when user share.
    console.info('onShareAppMessage ',options)
    return {
      title: '个税大比拼',
      path : '/pages/index/index',
      success:function(res){
        logger.console('onShareAppMessage success',res)
      }
    }
  },

  


  onPageScroll: function() {
    // Do something when page scroll
  },
  onTabItemTap(item) {
    console.log(item.index)
    console.log(item.pagePath)
    console.log(item.text)
  },
  // Event handler.
  viewTap: function() {
    this.setData({
      text: 'Set some data for updating view.'
    }, function() {
      // this is setData callback
    })
  },
  customData: {
    hi: 'MINA'
  }
})