const server = require('../../server/server.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  login: function() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        server.login({
          data: {
            code: res.code
          },
          success: (data) => {

            wx.setStorageSync("wxLoginInfo", data)
            getApp().globalData.wxLoginInfo = data
            this.toMain()

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
  toMain: function() {
    wx.hideLoading()
    wx.switchTab({
      url: '../main/main',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.checkSession({
      success: () => {
        let wxLoginInfo = wx.getStorageSync('wxLoginInfo')
        if (wxLoginInfo == null || wxLoginInfo == '') {
          this.login()
        } else {
          getApp().globalData.wxLoginInfo = wxLoginInfo //JSON.parse(wxLoginInfo);
          this.toMain();
        }
      },
      fail: () => {
        this.login()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.showLoading({
      title: '登陆中，请稍后',
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