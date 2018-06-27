const server = require('../../server/server.js')
const logger = require('../../config/log.js')
Page({
  //index
  login: function() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        logger.console("wx.login", res)
        server.login({
          data: {
            code: res.code
          },
          success: (data) => {
            //getApp().globalData.wxLoginInfo = data
            logger.console(" server.login success", data)
            this.toMain(data)
          },
          fail: () => {
            this.toLoginError()
          }
        })
      },
      fail: () => {
        console.log("wx.login error")
        this.toLoginError()
      }
    })
  },
  toLoginError: function() {
    wx.hideLoading()
    wx.showToast({
      title: 'sorry,无法使用哦',
    })
  },
  toMain: function(data) {
    //如果有shareticket，获取下分享的数据下，在跳转
    let app = getApp()
    app.context.performLogin(data)
    if (app.context.shareTicket != null) {
      wx.getShareInfo({
        shareTicket: app.context.shareTicket,
        success: function(res) {
          logger.console("getShareInfo success", res)
          server.uploadShareInfo({
            data: {
              iv: res['iv'],
              encryptedData: res['encryptedData'],
            },
            success: function(data) {
              logger.console("uploadShareInfo success ", data)
              app.context.groupID = data['groupID']
            },
            complete: function() {
              wx.hideLoading()
              wx.switchTab({
                url: '../main/main',
              })
            }
          })
        },
        fail: function() {
          wx.hideLoading()
          wx.switchTab({
            url: '../main/main',
          })
        }
      })
    }else{
      wx.hideLoading()
      wx.switchTab({
        url: '../main/main',
      })
    }
  },

  /**
   * 初始化
   */
  onLoad: function(options) {
    //判断登陆状态。
    wx.checkSession({
      success: () => {
        let wxLoginInfo = getApp().context.getLoginInfo()
        logger.console("onLoad checkSession success", wxLoginInfo)
        if (wxLoginInfo == null) {
          this.login()
        } else {
          this.toMain(wxLoginInfo);
        }
      },
      fail: () => {
        this.login()
        logger.console("onLoad checkSession fail")
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.showLoading({
      title: '登陆中...',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})