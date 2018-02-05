const useTestRoute = (app) => {
  app.get('/', (req, res) => {
    res.end('INDEX !')
  })
}

module.exports =  useTestRoute
