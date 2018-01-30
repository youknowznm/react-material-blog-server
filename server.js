const http = require('http')
const url = require('url')
var proxyaddr = require('proxy-addr')

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

class Server {
  constructor() {
    this.routes = []
    const methods = ['get', 'post', 'put', 'delete', 'options', 'all']
    methods.forEach((method) => {
      this[method] = (path, fn) => {
        this.routes.push({
          method,
          path,
          fn
        })
      }
    })
    this.initServer = this.initServer.bind(this)
  }
  initServer (req, res) {
    console.log(1, this.routes);
    const method = req.method.toLowerCase()
    const pathname = url.parse(req.url, true).pathname
    passRouter(this.routes, method, pathname)(req, res)
  }
  listen(port = 4000, host = 'localhost') {
    http
      .createServer(this.initServer)
      .listen(port, host, () => {
        console.log(`Server running at ${host}\:${port}.`)
      })
  }
  use(path, fn) {
    this.routes.push({
      method: 'use',
      path,
      fn,
    })
  }
}

var server = new Server()

server.use('/g', (req, res, next) => {
  console.log(url.parse(req.url).query);
  if (url.parse(req.url).query === 'fuck=shit') {
    next()
  } else {
    res.writeHead(404, {'Content-Type': 'text/html;charset=utf-8;'});
    res.end('对不起，你没有相应权限');
  }
})

server.get('/', (req, res) => {
  // console.log();
  res.end('shou ye')
})

server.get('/g', (req, res) => {
  // console.log();
  res.end('gg')
})


server.listen()
