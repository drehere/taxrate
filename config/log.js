const logger={}
logger.console = function (...args){
  let log=wx.getStorageSync("logs")||[]
  log.push(args.map(it=>{
    if(typeof it == 'object'){
      return JSON.stringify(it)
    }else{
      return it
    }

  }).join(" "))
  wx.setStorageSync('logs', log)
  console.log(...args)
}
logger.logs=()=> wx.getStorageSync("logs") || []
logger.clear=()=> wx.setStorageSync('logs', [])
module.exports=logger