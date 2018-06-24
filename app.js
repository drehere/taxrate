//app.js
App({
  
  onLaunch: function(res) {
    // 展示本地存储能力
    let app = this;
    // 登录
    console.log("app.js onLaunch",res)

    

  },
  globalData: {
    wxLoginInfo: null,
    isWxLogin: function() {
      return this.wxLoginInfo != null
    },
    hasWxLoginInfo: function() {
      return this.wxLoginInfo != null && this.wxLoginInfo['nickName'] != null && this.wxLoginInfo['nickName'] != ''
    }
  },
  onShow: function(options) {
    // Do something when show.
    console.log("onshow")
  },
  onHide: function() {
    // Do something when hide.
    console.log("onhide")
  },
  onError: function(msg) {
    console.log(msg)
  },
})