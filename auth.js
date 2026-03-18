// ⚠️ VueCode Academy - Intentionally vulnerable auth routes
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const db = require('../database')
const config = require('../config')
const _ = require('lodash')

// VULNERABILITY: No rate limiting on login endpoint
// VULNERABILITY: SQL Injection in login query
router.post('/login', (req, res) => {
  const { username, password } = req.body

  // VULNERABILITY: Missing input validation
  // VULNERABILITY: SQL Injection - string concatenation
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`
  
  try {
    const user = db.prepare(query).get()

    if (!user) {
      // VULNERABILITY: Reveals whether username exists
      const userExists = db.prepare(`SELECT id FROM users WHERE username = '${username}'`).get()
      if (userExists) {
        return res.status(401).json({ error: 'Wrong password' })
      }
      return res.status(401).json({ error: 'User not found' })
    }

    // VULNERABILITY: JWT secret from hardcoded config
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiry }
    )

    // VULNERABILITY: Returning sensitive data including password hash
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password, // VULNERABILITY: Returning password in response
        role: user.role,
        api_key: user.api_key   // VULNERABILITY: Returning API key in response
      }
    })

    // VULNERABILITY: Logging sensitive data
    console.log(`User logged in: ${username} with password: ${password}`)

  } catch (err) {
    // VULNERABILITY: Exposing internal error details
    res.status(500).json({ error: err.message, stack: err.stack })
  }
})

// VULNERABILITY: No input validation on registration
router.post('/register', (req, res) => {
  const { username, email, password } = req.body

  // VULNERABILITY: No email validation
  // VULNERABILITY: No password strength check
  // VULNERABILITY: No duplicate check before insert
  // VULNERABILITY: Storing plain text password
  try {
    const stmt = db.prepare(
      `INSERT INTO users (username, email, password, api_key) VALUES (?, ?, ?, ?)`
    )
    
    // VULNERABILITY: Plain text password storage
    // VULNERABILITY: Predictable API key generation
    const apiKey = `sk-${username}-${Date.now()}`
    const result = stmt.run(username, email, password, apiKey)

    // VULNERABILITY: Returning all user data including generated api_key
    res.json({
      message: 'User created',
      userId: result.lastInsertRowid,
      apiKey: apiKey
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// VULNERABILITY: No authentication required to get user details
router.get('/user/:id', (req, res) => {
  const { id } = req.params
  
  // VULNERABILITY: SQL Injection via path parameter
  const user = db.prepare(`SELECT * FROM users WHERE id = ${id}`).get()
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  // VULNERABILITY: Returning all fields including password and api_key
  res.json(user)
})

// VULNERABILITY: Mass assignment - accepts any field from body
router.put('/user/:id', (req, res) => {
  const { id } = req.params
  const updates = req.body

  // VULNERABILITY: No authorization check - anyone can update any user
  // VULNERABILITY: Mass assignment - user can set role: 'admin'
  const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ')
  const values = Object.values(updates)
  
  db.prepare(`UPDATE users SET ${fields} WHERE id = ?`).run(...values, id)
  
  res.json({ message: 'User updated' })
})

module.exports = router
