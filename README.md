# wepy-trycatch
a wepy lib for catch runtime error power by decorator
🔥优雅捕获wepy全局异常

## 特点
- 告别`代码裸奔` or `手动try catch` 💥

## 使用方式
> app.wpy
- compsName: 捕获错误后调用的组件名
- methodName: 捕获错误后调用组件的方法名
- options
  - btnMsg: 按钮文案（本库不作处理，仅传递）
  - msg: 提示文案（本库不作处理，仅传递）
  - callback: 报错页面的回调函数名(本库不作处理，仅传递)
- hook: 
  - 入参: 错误信息error、传递的options
  - 用处: 将错误信息转为错误码......
```
  constructor(){
    super()
    wepy.$error = {
      compsName: 'ErrorModal',
      methodName: 'show',
      options: {
        btnMsg: '重新加载',
        msg: '连接服务器失败',
        callback: 'errHandler'
      },
      // 适用场景：将报错信息转成code
      hook: (error, options) => {
        if (error.includes('timeout')) {
          return {...options, msg: '连接服务器失败(1001)'}
        }
        return options
      }
    }
  }
```

> page.wpy
- `@trycatch`中不传对象时: 使用`app.wpy`中配置的`wepy.$error`参数、回调函数名
- `@trycatch`中传对象时: 使用传入的参数和当前页回调函数名

```
  <template>
    <ErrorModal />
  </template>
  
  </script>
  import ErrorModal from '@/comps/ErrorModal'
  
  @trycatch({
    options: {
      btnMsg: '本页面生效按钮',
      msg: '本页面生效文案',
      callback: 'specialCb'
    }
  })
  export default class Test extends wepy.page {
  
    // 回调函数
    errHandler() {}
    
    // 自定义回调
    specialCb() {}
    
    // 未定义wepy.$error时，可在onErrored中取到错误信息并自行处理
    onErrored(error) {}
  }
  </script>
```
> ErrorModal.wpy
```
  <script>
    export default class ErrorModal extends wepy.component {
      data = {
        errInfo: {
          msg: '报错了，失去联系.',
          btnMsg: '重新登录',
          show: false
        }
      }

      methods = {
        show(errInfo) {
          this.errInfo = {...errInfo, show: true}
        },
        close() {
          this.errInfo = {...this.errInfo, show: false}
          if ( this.errInfo.callback && 
            typeof this.$parent[errInfo.callback] === 'function'
          ) {
            // 执行报错页面的回调并结束整个报错流程
            this.$parent[this.errInfo.callback]()
          }
        }
      }
    }
  </script>
```
