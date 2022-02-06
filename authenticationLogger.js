function authLogger(req, res, next) {
    console.log('Authenticating...')
    next()
}

module.exports = authLogger