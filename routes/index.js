const fs = require('fs')

const routeFuncs = fs.readdirSync(__dirname)

const useAllRoutes = (app) => {
  routeFuncs.forEach((thisRouteFileName) => {
    if (thisRouteFileName !== 'index.js') {
      console.log(`### using route "${thisRouteFileName}". ###`)
      require(`./${thisRouteFileName}`)(app)
    }
  })
}


module.exports = useAllRoutes
