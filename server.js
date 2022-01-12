const http = require('http')
const services = require('./services')
const url = require('url')
const textBody = require('body')
const jsonBody = require('body/json')
const formBody = require('body/form')
const anyBody = require('body/any')

const server = http.createServer()
server.on('request', (req, res) => {
    const parsedUrl = url.parse(req.url, true)
    
    if (req.method === "GET"
        && parsedUrl.pathname === "/metadata") {
            const { id } = parsedUrl.query
            const metadata = services.fetchImageMetadata(id)
            console.log(req.headers)
    }
    const body = []
    req.on('data', chunk => {
        body.push(chunk)
    }).on('end', () => {
        const parsedJSON = JSON.parse(Buffer.concat(body))
        const userName = parsedJSON[0]['userName']
        services.createUser(userName)
    })
})

server.listen(5000)