function trycatch(cb) {
  return function(target) {
    return class extends target {
      constructor() {
        super()
        for (let key in this.methods) {
          let beforeMethod = this.methods[key]
          this.methods[key] = async (...args) => {
            try {
              await beforeMethod.apply(this, ...args)
            } catch (error) {
              cb(error)
            }
          }
        }
        Object.getOwnPropertyNames(target.prototype).forEach(item => {
          if (item !== 'constructor') {
            this[item] = async (...args) => {
              try {
                await target.prototype[item].apply(this, ...args)
              } catch (error) {
                cb(error)
              }
            }
          }
        })
      }
    }
  }
}
module.exports = trycatch