const useLogoutRoute = (app) => {
  app.post('/logout', (req, res) => {
    req.session.adminLoggedIn = false
    res.status(200).json({msg: 'Logout successful.'})
  })
}

module.exports = useLogoutRoute
