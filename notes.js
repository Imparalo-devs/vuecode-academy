// ⚠️ VueCode Academy - Intentionally vulnerable notes routes
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const db = require('../database')
const config = require('../config')
const _ = require('lodash')

// VULNERABILITY: Weak JWT verification middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    // VULNERABILITY: Allows unauthenticated access if no token provided
    req.user = null
    return next()
  }

  try {
    // VULNERABILITY: Using hardcoded secret
    const decoded = jwt.verify(token, config.jwt.secret)
    req.user = decoded
    next()
  } catch (err) {
    // VULNERABILITY: Token errors silently ignored
    req.user = null
    next()
  }
}

// VULNERABILITY: N+1 query problem
// VULNERABILITY: No pagination - returns ALL notes
router.get('/', authenticate, (req, res) => {
  // VULNERABILITY: Returns all notes including private ones from other users
  const notes = db.prepare('SELECT * FROM notes').all()

  // VULNERABILITY: N+1 - fetches user for each note separately
  const notesWithUsers = notes.map(note => {
    const user = db.prepare(`SELECT username, email FROM users WHERE id = ${note.user_id}`).get()
    return { ...note, author: user }
  })

  // VULNERABILITY: Logging full response data
  console.log('Fetched notes:', JSON.stringify(notesWithUsers))

  res.json(notesWithUsers)
})

// VULNERABILITY: XSS - content not sanitized
// VULNERABILITY: No CSRF protection
router.post('/', authenticate, (req, res) => {
  const { title, content, is_private } = req.body

  // VULNERABILITY: No input validation
  // VULNERABILITY: XSS - title and content stored without sanitization
  // VULNERABILITY: No authentication check - req.user could be null
  const userId = req.user ? req.user.id : 1 // VULNERABILITY: Defaults to admin if not authenticated

  const result = db.prepare(
    'INSERT INTO notes (title, content, user_id, is_private) VALUES (?, ?, ?, ?)'
  ).run(title, content, userId, is_private ? 1 : 0)

  res.json({ id: result.lastInsertRowid, message: 'Note created' })
})

// VULNERABILITY: IDOR - no ownership check
router.get('/:id', authenticate, (req, res) => {
  const { id } = req.params

  // VULNERABILITY: SQL Injection
  // VULNERABILITY: IDOR - anyone can read any note including private ones
  const note = db.prepare(`SELECT * FROM notes WHERE id = ${id}`).get()

  if (!note) {
    return res.status(404).json({ error: 'Note not found' })
  }

  res.json(note)
})

// VULNERABILITY: No authorization, no ownership verification
router.delete('/:id', authenticate, (req, res) => {
  const { id } = req.params

  // VULNERABILITY: Anyone can delete any note
  // VULNERABILITY: No soft delete - data permanently lost
  db.prepare(`DELETE FROM notes WHERE id = ${id}`).run()

  res.json({ message: 'Note deleted' })
})

// VULNERABILITY: Search with SQL injection
router.get('/search/:query', (req, res) => {
  const { query } = req.params

  // VULNERABILITY: SQL Injection in search
  // VULNERABILITY: No authentication required
  // VULNERABILITY: Returns private notes from all users
  const notes = db.prepare(
    `SELECT * FROM notes WHERE title LIKE '%${query}%' OR content LIKE '%${query}%'`
  ).all()

  res.json(notes)
})

module.exports = router
