const http = require('http')
const url = require('url')

const lazy = function* (arr) {
  yield* arr
}

const passRouter = (allRoutes, targetMethod, targetPath) => (req, res) => {
  const lazyRoutes = lazy(allRoutes)
  ;(function next () {
    const thisRoute = lazyRoutes.next().value
    // 1 - 已经遍历结束
    if (thisRoute === undefined) {
      res.end(`Cannot ${targetMethod} ${targetPath}`)
      return
    }
    const {method, path, fn} = thisRoute
    // 2 - 匹配到了符合的路由
    if ([targetMethod, 'all'].includes(method) && [targetPath, '*'].includes(path)) {
      fn(req, res)
      return
    }
    // 3 - 匹配到了中间件
    if (method === 'use' && [targetPath, '/'].includes(path)) {
      fn(req, res, next)
      return
    }
    next()
  }())
}

const HTTP_METHODS = ['get', 'post', 'put', 'delete', 'options', 'all']

class MiniExpress {
  constructor() {
    this.routes = []
    HTTP_METHODS.forEach((method) => {
      this[method] = (path, fn) => {
        this.routes.push({method, path, fn})
      }
    })
    this.requestListener = this.requestListener.bind(this)
  }
  requestListener (req, res) {
    const method = req.method.toLowerCase()
    const pathname = url.parse(req.url).pathname
    passRouter(this.routes, method, pathname)(req, res)
  }
  listen(port = 4000, host = 'localhost') {
    http
      .createServer(this.requestListener)
      .listen(port, host, () => {
        console.log(`### Mini-express running at ${host}\:${port}. ###`)
      })
  }
  use(path, fn) {
    this.routes.push({method: 'use', path, fn})
  }
}

module.exports = MiniExpress
