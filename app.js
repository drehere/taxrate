//app.js

const logger=require('./config/log.js')
const server=require('./server/server.js')
const context=require('./context/context.js')
App({
  
  onLaunch: function(res) {
   
 
  },
  globalData: {
    wxLoginInfo: null,
    isWxLogin: function() {
      return this.wxLoginInfo != null
    },
  },
  onShow: function(options) {
    // Do something when show.
    logger.console("onshow",options)
    //获取分享的shareTicket
    let app=this;
    const con = new context()
    con.launch(options)
    app.context = con
  },
  onHide: function() {
    // Do something when hide.
    console.log("onhide")
  },
  onError: function(msg) {
    console.log(msg)
  },
})