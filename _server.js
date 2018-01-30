const http = require('http')
const url = require('url')
var proxyaddr = require('proxy-addr')

const lazy = function* (arr) {
  yield* arr
}

const passRouter = (allRoutes, targetMethod, targetPath) => (req, res) => {
  const lazyRoutes = lazy(allRoutes)
  ;(function next () {
    // 当前遍历状态
    const thisRoute = lazyRoutes.next().value

    // 已经遍历结束
    if (thisRoute === undefined) {
      res.end(`Cannot ${method} ${path}`)
      return
    }

    const {method, path, fn} = thisRoute

    // 匹配到了符合的路由
    // 路由path为*时匹配所有请求的方法
    // 路哟method为all时陪陪所有请求的路径
    if ([targetMethod, 'all'].includes(method) && [targetPath, '*'].includes(path)) {
      fn(req, res)
      return
    }

    // 匹配到了中间件
    // || targetPath.startsWith(path.concat('/'))

    if (method === 'use' && [targetPath, '/'].includes(path)) {
    // if (method === 'use'
    //   && (path === '/'
    //   || path === targetPath
    //   || targetPath.startsWith(path.concat('/')))) {
      fn(req, res, next)
      return
    }

    next()
  }())
}

let app = (req, res) => {
  const method = req.method.toLowerCase()
  const urlObj = url.parse(req.url, true)
  const pathname = urlObj.pathname
  passRouter(app.routes, method, pathname)(req, res)
}

app.routes = []

const methods = ['get', 'post', 'put', 'delete', 'options', 'all']

methods.forEach((method) => {
  app[method] = (path, fn) => {
    app.routes.push({
      method,
      path,
      fn
    })
  }
})

app.use = (path, fn) => {
  app.routes.push({
    method: 'use',
    path: path,
    fn: fn
  })
}

app.listen = (port = 4000, host = 'localhost') => {
  http
    .createServer(app)
    .listen(port, host, () => {
      console.log(`Server running at ${host}\:${port}.`)
    })
}

// //////////////


app.use('/g', (req, res, next) => {
  console.log(url.parse(req.url).query);
  if (url.parse(req.url).query === 'fuck=shit') {
    next()
  } else {
    res.writeHead(404, {'Content-Type': 'text/html;charset=utf-8;'});
    res.end('对不起，你没有相应权限');
  }
})

app.get('/', (req, res) => {
  console.log('proxyaddr: ', proxyaddr(req, 'loopback'));
  res.end(proxyaddr(req, 'loopback'))
})



app.get('/g', (req, res) => {
  res.end('gg')
})


// app.use('/blog', (req, res, next) => {
//   if(req.username) {
//     next();
//   } else {
//     res.writeHead(404, {'Content-Type': 'text/html'});
//     res.end('对不起，你没有相应权限');
//   }
// });

app.listen()
