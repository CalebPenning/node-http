const http = require('http')
const https = require('https')
const services = require('./services')
const url = require('url')
const textBody = require('body')
const jsonBody = require('body/json')
const formBody = require('body/form')
const anyBody = require('body/any')
const fs = require('fs')

const server = http.createServer()
server.on('request', (req, res) => {
    const parsedUrl = url.parse(req.url, true)
    
    if (req.method === "GET"
        && parsedUrl.pathname === "/metadata") {
            const { id } = parsedUrl.query
            const metadata = services.fetchImageMetadata(id)
            console.log(req.headers)
    }
    else if (req.method === "POST"
            && parsedUrl.pathname === "/users") {
                jsonBody(req, res, (err, body) => {
                    if (err) console.log(err)
                    else services.createUser(body['userName'])
                })
    }
    else {
        res.statusCode = 404
        res.setHeader('x-powered-by', 'Node.js')
        console.log(res)
        res.end()
    }
})

server.listen(5000)