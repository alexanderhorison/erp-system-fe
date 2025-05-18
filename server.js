// Load environment variables from .env file
require('dotenv').config()

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// Default port is 3001, but use PORT from .env if available
const port = parseInt(process.env.PORT || '3001', 10)

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(port, err => {
    if (err) throw err
    if (dev) {
      console.log(`> Ready on http://localhost:${port}`)
    } else {
      console.log(`> Production server running on port ${port}`)
    }
  })
})
