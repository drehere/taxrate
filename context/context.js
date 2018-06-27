/**
 * 上下文交互中心
 */

//目前缺少对微信用户信息改变的处理的。目前采用的策略是一个星期的时间从新获取用户信息
const server=require('../server/server.js')
const logger=require('../config/log.js')
const context = function() {
  //进入小程序数据
  this.shareTicket = null
  this.scene = -1
  this.path = null
  //登陆数据
  this.wxLoginInfo = null
  //群组数据
  this.groupID = null
}
context.prototype.fromType = function() {
  return this.scene
}
context.prototype.launch = function(res) {
  res = res || {}
  this.shareTicket = res['shareTicket']
  this.scene = res['scene']
  this.path = res['path']
}
context.prototype.performLogin = function(wxLoginInfo) {
  if (typeof wxLoginInfo != undefined && wxLoginInfo != null) {
    this.wxLoginInfo = wxLoginInfo
  }
  this.syncToLocal()
}
context.prototype.getLoginInfo = function() {
  if (this.wxLoginInfo == null) {
    let storeInfo = wx.getStorageSync('wxLoginInfo')
    if (storeInfo!=''){
      this.wxLoginInfo = storeInfo
    }
  }
  return this.wxLoginInfo;
}
context.prototype.syncToLocal=function(){
  wx.setStorageSync("wxLoginInfo", this.wxLoginInfo)
}

context.prototype.needUploadLoginInfo=function() {
  return this.wxLoginInfo != null && this.wxLoginInfo['nickName'] != null && this.wxLoginInfo['nickName'] != ''
},
context.prototype.isFromGroupWithShareTicket = function() {
  return this.scene == 1044 && this.shareTicket != null
}
context.prototype.uploadShareInfo = function (res){
  server.uploadShareInfo({
    data: {
      iv: res['iv'],
      encryptedData: res['encryptedData'],
    },
    success: function (data) {
      logger.console("uploadShareInfo success ", data)
    }
  })
}


module.exports = context;