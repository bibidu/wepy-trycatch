const { merge } = require('./utils')

function trycatch(initialOptions) {
  return function(target) {
    /**
     * wrapper by try catch
     * @param {*} method 
     */
    function wrapper(method) {
      return async (...args) => {
        try {
          await method.apply(this, ...args)
        } catch (error) {
          notifyErrorMsg.call(this, error, initialOptions)
        }
      }
    }
    /**
     * push error results to outside
     * @param {*} error 
     * @param {*} initialOptions 
     */
    function notifyErrorMsg(error, initialOptions) {
      const $error = merge(initialOptions)
      let { compsName, methodName, options, flag, hook } = $error 
      if (hook && typeof hook === 'function') {
        options = hook(error.toString(), options)
      }
      if (!flag) {
        this.onErrored && this.onErrored.call(this, options)
        return
      }
      this.$invoke(compsName, methodName, options)
    }
    /**
     * wrapp component of wepy
     */
    return class extends target {
      constructor() {
        super()
        // methods wrapper
        for (let key in this.methods) {
          let beforeMethod = this.methods[key]
          this.methods[key] = wrapper.call(this, beforeMethod)
        }
        // lifecycle wrapper
        Object.getOwnPropertyNames(target.prototype).forEach(item => {
          if (item !== 'constructor' && item !== 'onErrored') {
            this[item] = wrapper.call(this, target.prototype[item])
          }
        })
      }
    }
  }
}
module.exports = trycatch