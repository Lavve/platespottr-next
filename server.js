// server.js (CommonJS-style)
const { readFileSync } = require('fs')
const { createServer } = require('https')
const path = require('path')
const { parse } = require('url')
const next = require('next')

const dev = true
const hostname = '0.0.0.0'
const port = 3030
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

const httpsOptions = {
  key: readFileSync(path.join(__dirname, './certs/192.168.1.221-key.pem')),
  cert: readFileSync(path.join(__dirname, './certs/192.168.1.221.pem')),
}

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(port, hostname, () => {
    console.log(`✅ HTTPS server running at https://192.168.1.221:${port}`)
  })
})
