//logs.js
const util = require('../../utils/util.js')
const logger=require('../../config/log.js')
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (logger.logs()).map(log => {
        return log
      })
    })
  },
  onShow:function(){
    this.setData({
      logs: (logger.logs()).map(log => {
        return log
      })
    })
  }
})
