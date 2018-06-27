//app.js

const logger=require('./config/log.js')
const server=require('./server/server.js')
const context=require('./context/context.js')
App({
  
  onLaunch: function(res) {
    // 展示本地存储能力
    let app = this
    // 登录
    logger.console('App onLaunch',res)
    //获取分享的shareTicket
    app.globalData['shareTicket'] = res['shareTicket']
    const con=new context()
    con.launch(res)
    app.context = con
  },
  globalData: {
    wxLoginInfo: null,
    isWxLogin: function() {
      return this.wxLoginInfo != null
    },
   
    shareTicket:null
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