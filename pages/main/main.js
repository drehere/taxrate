//index.js
//获取应用实例
const app = getApp()
const server = require('../../server/server.js')
const config = require('../../config/config.js')
const logger = require('../../config/log.js')

Page({
  data: {

    canIUseUserInfo: wx.canIUse('button.open-type.getUserInfo'),
    wxLoginUserInfo: null,

    //表单mvvm数据绑定
    grossPay: 40000,
    fee: 5000,
    // threshold: 5000,
    showRankBtn: getApp().context.isFromGroupWithShareTicket(),
    thresholds: [3500, 5000],
    thresholdsIndex: 0,
    //税率表
    taxRateTable: [{
      mode: 3500,
      desc: "采用旧版税率表,详细请查看相关说明。"
    }, {
      mode: 5000,
      desc: "采用2018年新版税率表，详细请查看相关说明。"
    }],
    //计算结果数据绑定
    showShare: false,
    finalTax: '',
    realSalary: '',
    resultDesc: '',
  },

  // 计算税率
  onSubmit: function(value) {

    let page = this;

    server.calculate({
      data: {
        grossPay: value['grossPay'],
        fee: value['fee'],
        // threshold: value['threshold']
        threshold: page.data.thresholds[page.data.thresholdsIndex]
      },
      success: (res) => {
        this.setData({
          showShare: true,
          finalTax: res['tax'],
          realSalary: res['realSalary'],
          resultDesc: res['resultDesc']
        })
        logger.console('calculate success ', res)
      },
      complete: () => {
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

  onThresholdChnage: function(event) {
    this.setData({
      thresholdsIndex: event.detail.value
    })
  },
  onToRankList: function() {
    wx.navigateTo({
      url: '../rank/rank'
    })
  },

  toCalculationPage: function() {
    wx.navigateTo({
      url: '../calculation/calculation',
    })
  },
  toThresholdPage: function() {
    wx.navigateTo({
      url: '../threshold/threshold',
    })
  },
  toTaxtablePage: function() {
    wx.navigateTo({
      url: '../taxtable/taxtable',
    })
  },

  /**
   * 上传微信用户详细数据
   */
  uploadUserInfo: function(encryptedData, iv, userInfo) {
    server.registerInfo({
      data: {
        encryptedData: encryptedData,
        iv: iv
      },
      success: (res) => {
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
  /**
   * 检查是否需要获取用户详细数据
   */
  checkDetailInfo: function() {
    return app.context.needUploadLoginInfo()
  },


  /**
   * 页面初始化
   */
  onLoad: function() {
    wx.showShareMenu({
      withShareTicket: true,
      success: function() {
        console.info("showShareMenu success ")
      },
      complete: function() {
        console.info("showShareMenu complete ")
      }
    })

  },
  /**
   * 输入框回调
   */
  onBindGrossPayInput: function(res) {
    this.setData({
      grossPay: res['detail']['value']
    })
  },

  onBindFeeInput: function(res) {
    this.setData({
      fee: res['detail']['value']
    })
  },

  /**
   * 授权获取用户信息回调函数
   */
  onUserInfoReady: function(res) {
    logger.console("onUserInfoReady", res, this.data)

    if (!this.checkDetailInfo() && res['detail']['userInfo'] != null) {
      this.uploadUserInfo(res['detail']['encryptedData'], res['detail']['iv'], res['detail'].userInfo)
    }

    this.onSubmit(this.data)
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
  onShareAppMessage: function(options) {
    // return custom share data when user share.
    console.info('onShareAppMessage ', options)
    return {
      title: '翻滚吧个税',
      path: '/pages/index/index',
      imageUrl: '../../resource/share_bg.png',
      success: function(res) {
        logger.console('onShareAppMessage success', res)
        if (res['shareTickets'] != null && res['shareTickets'].length > 0) {
          let ticket = res['shareTickets'][0]
          wx.getShareInfo({
            shareTicket: ticket,
            success: function(res) {
              logger.console("getShareInfo success", res)
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
  }
})