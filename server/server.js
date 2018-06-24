
const config=require('../config/config.js')

const server={}
server._baseurl =config.isDebug?'http://localhost:8089/bitmain/':'https://www.demon-yu.com/bitmain/'


server.login=function(obj){
  wx.request({
    url: this._baseurl+'login?',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    data: obj.data,
    success: function(data){
      if (data['statusCode'] == 200 && data['data']['status'] == 0){
        obj.success(data['data']['data'])
      }else{
        obj.fail()
      }
    },
    fail:obj.fail,
    complete: obj.complete
  })
}
server.registerInfo=function(obj){
  const openID = getApp().globalData['wxLoginInfo']['openID']
  wx.request({
    url: this._baseurl +'registerUserInfo?',
    method:'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded', // 默认值
      'openID': openID
    },
    data: obj.data,
    success: function (data) {
      if (data['statusCode'] == 200 && data['data']['status'] == 0) {
        obj.success(data['data']['data'])
      } else {
        obj.fail()
      }
    },
    fail: obj.fail,
    complete: obj.complete
  })
}

server.calculate=function(obj){
  const openID = getApp().globalData['wxLoginInfo']['openID']
  wx.request({
    url: this._baseurl + 'calculate?',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded', // 默认值
      'openID': openID
    },
    data: obj.data,
    success: function (data) {
      if (data['statusCode'] == 200 && data['data']['status']==0) {
        obj.success(data['data']['data'])
      } else {
        obj.fail()
      }
    },
    fail: obj.fail,
    complete: obj.complete
  })
}

module.exports = server
