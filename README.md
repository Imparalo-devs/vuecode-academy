# VueCode Academy — Intentionally Vulnerable Application

> ⚠️ **WARNING: This application contains intentional security vulnerabilities.**
> It is designed exclusively for educational purposes as part of the **VueCode Academy** learning path.
> **DO NOT deploy this code in any production environment.**

---

## What is this?

This is the official practice repository for **[VueCode Academy](https://vuecode.dev/academy)** — the free certification program that teaches developers how to identify, analyze, and fix code quality and security issues using the VueCode platform.

This application is a small Node.js/Express REST API with a JavaScript frontend, intentionally built with a wide range of vulnerabilities across all dimensions that VueCode analyzes:

- 🔒 **Security** — SQL injection, hardcoded secrets, missing authentication
- 🏗️ **Architecture** — tight coupling, no separation of concerns, god modules
- 🗄️ **Database** — N+1 queries, missing indexes, plain text passwords
- 💻 **Code Quality** — magic numbers, dead code, no input validation
- ⚙️ **DevOps** — insecure Dockerfile, secrets committed, no CI/CD
- 📦 **Dependencies** — known CVEs in package.json

---

## Vulnerabilities List

This app intentionally contains the following issues — can VueCode find them all?

| # | Vulnerability | Location | Severity |
|---|--------------|----------|----------|
| 1 | SQL Injection in login | `routes/auth.js:16` | 🔴 Critical |
| 2 | SQL Injection in search | `routes/notes.js:67` | 🔴 Critical |
| 3 | Hardcoded JWT Secret | `config.js:5` | 🔴 Critical |
| 4 | Hardcoded API Keys | `config.js:13` | 🔴 Critical |
| 5 | Plain text password storage | `database.js:42` | 🔴 Critical |
| 6 | Secrets in Dockerfile ENV | `Dockerfile:22` | 🔴 Critical |
| 7 | .env file committed to repo | `.env` | 🔴 Critical |
| 8 | IDOR — access any note | `routes/notes.js:55` | 🟠 High |
| 9 | Mass assignment — set role:admin | `routes/auth.js:78` | 🟠 High |
| 10 | No authentication on user endpoint | `routes/auth.js:58` | 🟠 High |
| 11 | Debug endpoint exposes all secrets | `app.js:42` | 🟠 High |
| 12 | XSS — note content not sanitized | `routes/notes.js:40` | 🟠 High |
| 13 | N+1 query on notes list | `routes/notes.js:22` | 🟡 Medium |
| 14 | No pagination on notes endpoint | `routes/notes.js:18` | 🟡 Medium |
| 15 | CORS wildcard | `app.js:14` | 🟡 Medium |
| 16 | Stack traces exposed to client | `app.js:52` | 🟡 Medium |
| 17 | Root user in Docker | `Dockerfile:6` | 🟡 Medium |
| 18 | No rate limiting anywhere | `app.js` | 🟡 Medium |
| 19 | Known CVEs in dependencies | `package.json` | 🟠 High |
| 20 | Sensitive data returned in responses | `routes/auth.js:35` | 🟠 High |

---

## How to run (for Academy exercises)

```bash
# Clone the repository
git clone https://github.com/Imparalo-devs/vuecode-academy
cd vuecode-academy

# Install dependencies
npm install

# Start the application
npm start

# Open the frontend
open http://localhost:3000
```

Requirements: Node.js 14+

---

## How to use in VueCode Academy

1. Go to **[vuecode.dev/academy](https://vuecode.dev/academy)**
2. Enroll in the free learning path
3. Follow the 5-level certification program:
   - **Level 1** — Read & understand the analysis report
   - **Level 2** — Analyze the CVE vulnerabilities
   - **Level 3** — Plan the remediation in the backlog
   - **Level 4** — Fix issues using the integrated editor
   - **Level 5** — Generate and review code documentation
4. Pass the final exam with 70%+ to earn your certificate
5. Share your **VueCode Certified Code Reviewer** badge on LinkedIn

---

## Tech Stack

- **Backend**: Node.js + Express 4.17.1
- **Database**: SQLite via better-sqlite3
- **Auth**: JWT (jsonwebtoken 8.5.1)
- **Frontend**: Vanilla JavaScript SPA

All dependency versions are intentionally outdated to include known CVEs.

---

## About VueCode

**[VueCode](https://vuecode.dev)** is an AI-powered code review platform that uses 7 specialized agents to analyze your repository for security vulnerabilities, architectural issues, database problems, code quality, UX flows, DevOps configuration, and technical debt.

- 🔒 Security Agent
- 🏗️ Architecture Agent
- 🗄️ Database Agent
- 💻 Code Quality Agent
- 🎨 UX/Flow Agent
- ⚙️ DevOps Agent
- 📋 PM/Estimation Agent

**[Try the free demo →](https://vuecode.dev/demo)**
**[Start the Academy →](https://vuecode.dev/academy)**

---

## License

This repository is provided for educational purposes only as part of VueCode Academy.
© RazorVue — [razorvue.com](https://razorvue.com)
