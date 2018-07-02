const logger={}
function getFunctionName(func) {
  　　if (typeof func == 'function' || typeof func == 'object') {
    　　　　var name = ('' + func).match(/function\s*([\w\$]*)\s*\(/);
  　　}
  　　return name && name[1];
}
logger.console = function (...args){
  let log=wx.getStorageSync("logs")||[]
  log.push(args.map(it=>{
    if(typeof it == 'object'){
      return JSON.stringify(it)
    }else{
      return it
    }
  }).join(" "))
  // console.trace()
  wx.setStorageSync('logs', log)
  // console.group(getFunctionName[arguments.callee.caller])
  console.group()
  console.log(...args)
  console.groupEnd()
}
logger.logs=()=> wx.getStorageSync("logs") || []
logger.clear=()=> wx.setStorageSync('logs', [])
module.exports=logger