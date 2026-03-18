// ⚠️ VueCode Academy - Intentionally vulnerable Express application
// This app is for educational purposes only - DO NOT use in production!

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const config = require('./config')
const db = require('./database')

const app = express()

// VULNERABILITY: CORS wildcard - allows any origin
app.use(cors({ origin: '*' }))

// VULNERABILITY: No request size limit
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// VULNERABILITY: Exposing server information
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Express/4.17.1')
  res.setHeader('Server', 'Academy-Server/1.0')
  next()
})

// VULNERABILITY: No security headers (missing helmet)
// Missing: X-Frame-Options, X-XSS-Protection, Content-Security-Policy etc.

app.use(express.static('public'))

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

// VULNERABILITY: Admin panel with weak authentication
app.get('/api/admin/users', (req, res) => {
  const token = req.headers.authorization

  try {
    const decoded = jwt.verify(token, config.jwt.secret)
    // VULNERABILITY: Only checks if token is valid, not if user is admin
    const users = db.prepare('SELECT * FROM users').all()
    res.json(users) // VULNERABILITY: Returns passwords and api_keys
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' })
  }
})

// VULNERABILITY: Debug endpoint left in production
app.get('/api/debug', (req, res) => {
  res.json({
    config: config,           // VULNERABILITY: Exposes all config including secrets
    env: process.env,         // VULNERABILITY: Exposes all environment variables
    nodeVersion: process.version,
    platform: process.platform
  })
})

// VULNERABILITY: No rate limiting on any endpoint
// VULNERABILITY: No request logging for security audit
// VULNERABILITY: Error handler exposes stack traces
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: err.message,
    stack: err.stack,        // VULNERABILITY: Stack trace exposed to client
    config: config           // VULNERABILITY: Config exposed on error
  })
})

// VULNERABILITY: Hardcoded port, no graceful shutdown
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`VueCode Academy app running on port ${PORT}`)
  // VULNERABILITY: Logging sensitive config on startup
  console.log('JWT Secret:', config.jwt.secret)
  console.log('Admin password:', config.admin.password)
})

module.exports = app
