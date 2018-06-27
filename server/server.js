const config = require('../config/config.js')
const logger = require('../config/log.js')
const server = {}
server._baseurl = config.isDebug ? 'http://localhost:8089/bitmain/' : 'https://www.demon-yu.com/bitmain/'


server.login = function(obj) {
  server._request({
    url: 'login?'
  }, obj)
}
server.registerInfo = function(obj) {
  const openID = getApp().context.getLoginInfo()['openID']
  server._request({
    openID: openID,
    url: 'registerUserInfo?'
  }, obj)

}

server.calculate = function(obj) {
  const openID = getApp().context.getLoginInfo()['openID']
  server._request({
    openID: openID,
    url: 'calculate?'
  }, obj)
}

server.uploadShareInfo = function(obj) {
  const openID = getApp().context.getLoginInfo()['openID']
  server._request({
    openID: openID,
    url: 'uploadShareInfo?'
  }, obj)
}


server._request = function(innerData, obj) {
  const openID = innerData["openID"]
  var header = {
    'content-type': 'application/x-www-form-urlencoded'
  }
  if (openID != null) {
    header['openID'] = openID
  }
  wx.request({
    url: this._baseurl + innerData['url'],
    method: 'POST',
    header: header,
    data: obj.data,
    success: function(data) {
      if (data['statusCode'] == 200 && data['data']['status'] == 0) {
        obj['success'] && obj['success'](data['data']['data'])
      } else {
        obj['fail'] && obj['fail']()
      }
    },
    fail: obj.fail,
    complete: obj.complete
  })
}


server.getRankList = function(obj) {
  const openID = getApp().context.getLoginInfo()['openID']
  server._request({
    openID: openID,
    url: 'getRankList?'
  }, obj)
}

module.exports = server