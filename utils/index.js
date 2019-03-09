const wepy = require('wepy')

function merge(options) {
  if ( wepy
    && wepy.default
    && wepy.default.$error
    && wepy.default.$error.compsName
    && wepy.default.$error.methodName
    && wepy.default.$error.options
  ) {
    let config = {}
    for (let key in wepy.default.$error) {
      config[key] = (options && options[key]) || wepy.default.$error[key]
    }
    return {...config, flag: true}
  } else {
    return {...options, flag: false}
  }
}
module.exports = {
  merge
}