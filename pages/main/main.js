//index.js
//获取应用实例
const app = getApp()
const server = require('../../server/server.js')
const config = require('../../config/config.js')
const logger=require('../../config/log.js')

Page({
  data: {

    canIUseUserInfo: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    wxLoginUserInfo:null,

    //表单mvvm数据绑定
    btnSubloading: false,
    grossPay: 40000,
    fee: 5000,
    threshold: 5000,
    showRankBtn: getApp().context.isFromGroupWithShareTicket(),

    //计算结果数据绑定
    showShare: false,
    finalTax:'',
    realSalary:'',
    resultDesc:'',

    //排行榜数据
    rankUsers:[]

  },

  // 计算税率
  onSubmit: function(obj) {

    

    let page = this;
    let value = obj.detail.value;

    if(value)

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
          showShare: true,
          finalTax:res['tax'],
          realSalary: res['realSalary'],
          resultDesc: res['resultDesc']
        })
        logger.console('calculate success ',res)
      },
      complete:()=>{
        this.setData({
          btnSubloading: false
        })
      }
  
    })
  },
  onReset: function() {
    this.setData({
      grossPay: '',
      fee: '',
      threshold: 5000
    })
  },
  

  onToRankList:function(){
    wx.navigateTo({
      url:'../rank/rank'
    })
  },
  
  /**
   * 上传微信用户详细数据
   */
  uploadUserInfo: function(encryptedData, iv,userInfo) {
    server.registerInfo({
      data: {
        encryptedData: encryptedData,
        iv: iv
      },
      success: (res) => {
        this.onLoadUserInfoReady()
        let wxUserInfo = getApp().context.getLoginInfo()
        wxUserInfo['nickName'] = userInfo['nickName']
        wxUserInfo['avatarUrl'] = userInfo['avatarUrl']
        wxUserInfo['city'] = userInfo['city']
        wxUserInfo['country'] = userInfo['country']
        wxUserInfo['gender'] = userInfo['gender']
        wxUserInfo['province'] = userInfo['province']
        getApp().context.syncToLocal()
      },
      fail: () => {
        logger.console("registerInfo fail")
      }
    })
  },
  onLoadUserInfoReady: function (wxLoginInfo) {
    this.setData({
      hasUserInfo: true,
      wxLoginUserInfo: wxLoginInfo
    })
  },
  /**
   * 检查是否需要获取用户详细数据
   */
  checkDetailInfo: function() {
    return app.context.needUploadLoginInfo()
  },

  onLoad: function() {
    if (this.checkDetailInfo()) {
      this.onLoadUserInfoReady(app.context.getLoginInfo())
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
  /**
   * 授权获取用户信息回调
   */
  onUserInfoReady: function(res) {
    logger.console(res)
    this.uploadUserInfo(res['detail']['encryptedData'], res['detail']['iv'], res['detail'].userInfo)
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
        if (res['shareTickets'] != null && res['shareTickets'].length>0){
          let ticket = res['shareTickets'][0]
          wx.getShareInfo({
            shareTicket: ticket,
            success:function(res){
              logger.console("getShareInfo success",res)
              getApp().context.uploadShareInfo(res)
            }
          })
        }
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