
var session = require('express-session')
var proxyaddr = require('proxy-addr')

const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
const mime = {
  "html": "text/html",
  "css": "text/css",
  "js": "text/javascript",
  "json": "application/json",
  "gif": "image/gif",
  "ico": "image/x-icon",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png"
}
function handleStatic(res, pathname, ext) {
  fs.exists(pathname, (exists) => {
    if(!exists) {
      res.writeHead(404, {'Content-Type': 'text/plain'})
      res.write('The request url' + pathname + 'was not found on this server')
      res.end()
    } else {
      fs.readFile(pathname, (err, file) => {
        if(err) {
          res.writeHead(500, {'Content-Type': 'text/plain'})
          res.end(err)
        } else {
          const contentType = mime[ext] || 'text/plain'
          res.writeHead(200, {'Content-Type': contentType})
          res.write(file)
          res.end()
        }
      })
    }
  })
}
const lazy = function* (arr) {
  yield* arr;
}
const passRouter = (routes, method, path) => (req, res) => {
  const replaceParams = (path) => new RegExp(`\^${path.replace(/:\w[^\/]+/g, '\\w[^\/]+')}\$`);
  const lazyRoutes = lazy(routes);
  (function next () {
    const it = lazyRoutes.next().value;
    if (!it) {
      res.end(`Cannot ${method} ${path}`)
      return;
    } else if (it.method === 'use'
      && (it.path === '/'
      || it.path === path
      || path.startsWith(it.path.concat('/')))) {
      it.fn(req, res, next);
    } else if ((it.method === method
      || it.method === 'all')
      && (it.path === path
      || it.path === '*')) {
      it.fn(req, res);
    } else if ( it.path.includes(':')
      && (it.method === method
      || it.method === 'all')
      && (replaceParams(it.path).test(path))) {
      let index = 0;
      const param2Array = it.path.split('/');
      const path2Array = path.split('/');
      const params = {};
      param2Array.forEach((path) => {
        if(/\:/.test(path)) {
          params[path.slice(1)] = path2Array[index]
        }
        index++
      })
      req.params = params
      it.fn(req, res);
    } else {
      next();
    }
  }());
};
function core() {
  let _static = 'static'
  let app = (req, res) => {
    const method = req.method.toLowerCase()
    const urlObj = url.parse(req.url, true)
    const pathname = urlObj.pathname
    const ext = path.extname(pathname).slice(1)
    if(ext) {
      handleStatic(res, _static + pathname, ext)
    } else {
      passRouter(app.routes, method, pathname)(req, res)
    }
  }
  app.setStatic = (path) => {
    _static = path
  }
  app.routes = []
  const methods = ['get', 'post', 'put', 'options', 'delete', 'all', 'use']
  methods.forEach((method) => {
    app[method] = (path, fn) => {
      app.routes.push({
        method: method,
        path: path,
        fn: fn
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
  app.listen = (port=4000, host='localhost') => {
    http.createServer(app).listen(port, host, () => {
      console.log(`Server running at ${host}\:${port}.`)
      process.setMaxListeners(0)
      process.on('uncaughtException', function(err) {
        console.log(err.stack)
      })
      process.stdin.resume()
      process.on('SIGINT', function() {
        console.log('\n')
        console.log('Good Day!')
        process.exit(2)
      })
    })
  }
  return app
}

const app = core()

app.get('/', (req, res) => {
  console.log('proxyaddr: ', proxyaddr(req, 'loopback'));
  res.end(proxyaddr(req, 'loopback'))
})
app.use(session({
  name: 'rhaegoSessionKey',
  secret: 'key',
  // store: new MongoStore({
  //   mongooseConnection: mongoose.connection
  // }),
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
  currentUserEmail: '',
}))
app.listen()

// module.exports = core
