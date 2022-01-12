const http = require('http')
const services = require('./services')
const url = require('url')
const jsonBody = require('body/json')
const fs = require('fs')
const formidable = require('formidable')
const path = require('path')

const server = http.createServer()

server.on('request', (req, res) => {
    const parsedUrl = url.parse(req.url, true)
    
    if (req.method === "GET"
        && parsedUrl.pathname === "/metadata") {
            const { id } = parsedUrl.query
            const metadata = services.fetchImageMetadata(id)
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            const serializedJSON = JSON.stringify(metadata)
            res.write(serializedJSON)
            res.end()
    }

    else if (req.method === "POST"
            && parsedUrl.pathname === "/users") {
                jsonBody(req, res, (err, body) => {
                    if (err) console.log(err)
                    else services.createUser(body['userName'])
                })
    }

    else if (req.method === "POST"
            && parsedUrl.pathname === "/upload") {
                const form = new formidable.IncomingForm({
                    uploadDir: path.join(__dirname, 'uploads'),
                    keepExtensions: true,
                    maxFileSize: 5 * 1024 * 1024,
                    encoding: 'utf-8',
                })
                form.parse(req)
                    .on('fileBegin', (name, file) => {
                        console.log("Upload started")
                    })
                    .on('file', (name, file) => {
                        console.log("Field + file pair recieved")
                    })
                    .on('field', (name, value) => {
                        console.log("Field recieved: ")
                        console.log(name, value)
                    })
                    .on('progress', (bytesReceived, bytesExpected) => {
                        console.log(bytesReceived + ' / ' + bytesExpected)
                    })
                    .on('error', (err) => {
                        console.error(err)
                        req.resume()
                    })
                    .on('aborted', () => {
                        console.error('Request aborted by the user')
                    })
                    .on('end', () => {
                        console.log("Upload completed")
                        res.end("Success")
                    })
            }

    else {
        fs.createReadStream("./static/index.html").pipe(res)
    }
})

server.listen(5000)