/**
@author youknowznm
https://github.com/youknowznm/mini-express
*/

const http = require('http')
const url = require('url')

// 创建一个 MiniExpress 类
class MiniExpress {
  constructor() {
    this.routes = []
    // 把常用的 http 方法动词存入一个数组，最后加上 Express 风格的 'all'，可匹配所有方法
    const HTTP_METHODS = ['get', 'post', 'put', 'delete', 'options', 'all']
    // 遍历方法名的数组，给本类添加同名的成员方法
    // 该方法接受 path 和 handler 两个参数，在被调用时推入一个路由对象至路由数组
    HTTP_METHODS.forEach((method) => {
      this[method] = (path, handler) => {
        this.routes.push({method, path, handler})
      }
    })
    // 类的实例中的 this 默认不会指向实例本身，修改之（常写 React 的你是不是感觉很亲切）
    this.requestListener = this.requestListener.bind(this)
  }
  // 使用路由迭代器进行路由的遍历
  getRouterHandler (targetMethod, targetPath) {
    const generator = function* (arr) {
      yield* arr
    }
    const routeIterator = generator(this.routes)
    return (req, res) => {
      ;(function next () {
        const thisRoute = routeIterator.next().value
        // 1 - 已经遍历结束
        if (thisRoute === undefined) {
          res.writeHead(404, {'Content-Type': 'text/plain'})
          res.end(`ROUTER UNFOUND: [${targetMethod} ${targetPath}]`)
          return
        }
        const {method, path, handler} = thisRoute
        // 2 - 匹配到了符合的路由
        if ([targetMethod, 'all'].includes(method) && [targetPath, '*'].includes(path)) {
          handler(enhanceReq(req), enhanceRes(res))
          return
        }
        // 3 - 匹配到了中间件
        if (method === 'use' && [targetPath, '/'].includes(path)) {
          // 传递 next 方法给监听函数，在其内部可进行条件判断，决定是否把执行权交回 routeIterator
          handler(enhanceReq(req), enhanceRes(res), next)
          return
        }
        next()
      }())
    }
  }
  // 定义对所有请求的监听函数，用作 http.createServer() 的参数
  requestListener (req, res) {
    const method = req.method.toLowerCase()
    const pathname = url.parse(req.url).pathname
    this.getRouterHandler(method, pathname)(req, res)
  }
  // 默认在本地的4000端口监听。服务器就绪后打印 log
  listen(port = 4000, host = 'localhost') {
    http
      .createServer(this.requestListener)
      .listen(port, host, () => {
        console.log(`### Mini-express running at ${host}\:${port}. ###`)
      })
  }
  use(path, handler) {
    this.routes.push({method: 'use', path, handler})
  }
}

// 增强 req，可按需添加其它方法
const enhanceReq = (req) => {
  // 获取请求 url 的参数对象
  req.query = (() => {
    const urlObj = url.parse(req.url)
    const queryObj = {}
    const queryString = urlObj.query
    if (typeof queryString === 'string') {
      const searchArr = queryString.split('&')
      searchArr.forEach((i) => {
        var pair = i.split('=')
        queryObj[pair[0]] = pair[1]
      })
    }
    return queryObj
  })()
  return req
}

// 增强 res，可按需添加其它方法
const enhanceRes = (res) => {
  // 设置状态码
  res.status = (statusCode) => {
    res.statusCode = statusCode
    return res
  }
  // 以 json 结束响应
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data))
  }
  return res
}

module.exports = MiniExpress
