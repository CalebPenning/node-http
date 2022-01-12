const http = require('http')

const request = http.request(
    { hostname: 'www.google.com' },
    (res) => {
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res.headers)

        res.on('data', chunk => {
            console.log("This is a chunk \n")
            console.log(chunk.toString())
        })
    }
)

request.on('error', err => {
    console.error(err)
})

request.end()