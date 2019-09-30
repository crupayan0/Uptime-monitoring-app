const http = require('http')
const url = require('url')
const stringDecoder = require('string_decoder').StringDecoder

const server = http.createServer((_req, res) => {
    //Parse url
    const parsedUrl = url.parse(_req.url)
    const path = parsedUrl.pathname 
    const trimmedPath = path.replace(/^\/+|\/+$/g, '')
    const queryStringObj = parsedUrl.query

    //Method
    const method = _req.method.toUpperCase()

    //Headers
    const headers = _req.headers

    //Payloads, if any
    const decoder = new stringDecoder('utf-8')
    let buffer = ''
    _req.on('data', (data) => buffer += decoder.write(data))
    _req.on('end', () => {
        buffer += decoder.end()
        //Terminal Test
        // console.log('Path received: ', trimmedPath)
        // console.log('Method: ', method)
        // console.log('Query: ', queryStringObj)
        // console.log('Headers: ', headers)
        // console.log('Payloads: ', buffer)
        
        //Choose the handler
        var chosenHandler = typeof(router[trimmedPath]) == 'undefined' ? handlers.notFound : router[trimmedPath]

        
        
        var data = {
            'trimmedPath' : trimmedPath,
            'queryString' : queryStringObj,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        }
        console.log(data)

        chosenHandler(data, (statusCode, payload) => {
            statusCode = typeof(statusCode) == 'number' ? statusCode : 100
            payload = typeof(payload) == 'object' ? payload : {}

            let payloadString = JSON.stringify(payload)
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode)
            res.end(payloadString)
        })
    })


 
})

server.listen(9000, () => console.log('Server is listening to port 9000'))

//Handlers
var handlers = {}

//Sample Handler
handlers.sample = (data, callback) => callback(800, {'name' : 'sample'})

//NotFound Handler
handlers.notFound = (data, callback) => callback(404)

//Router
var router = {
    'sample' : handlers.sample
}