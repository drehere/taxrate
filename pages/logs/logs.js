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
  onClearClick:function(){
    logger.clear()
    this.setData({
      logs:[]
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
