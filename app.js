const server = require('./server')

server.get('/', (req, res) => {
  res.end('oh yeah')
})

server.listen(4000, 'localhost')
