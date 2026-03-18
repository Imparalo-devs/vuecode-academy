// ⚠️ VueCode Academy - Intentionally vulnerable configuration
// This file demonstrates hardcoded secrets anti-pattern

const config = {
  jwt: {
    // VULNERABILITY: Hardcoded JWT secret
    secret: 'superSecret123',
    expiry: '24h'
  },
  database: {
    path: './academy.db'
  },
  api: {
    // VULNERABILITY: Hardcoded API keys
    stripeKey: 'sk_test_academy_1234567890',
    sendgridKey: 'SG.academy_hardcoded_key_here',
    googleMapsKey: 'AIzaSy_academy_hardcoded'
  },
  admin: {
    // VULNERABILITY: Hardcoded admin credentials
    username: 'admin',
    password: 'admin123'
  },
  bcrypt: {
    // VULNERABILITY: Salt rounds too low
    saltRounds: 1
  }
}

module.exports = config
