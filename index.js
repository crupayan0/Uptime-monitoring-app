// Dependencies
const http = require('http')
const url = require('url')
const stringDecoder = require('string_decoder').StringDecoder

// Server responds to all requests with a string
const server = http.createServer((req, res) => {
    // Get the url and parse it
    const parsedUrl = url.parse(req.url, true)

    // Get the path
    const path = parsedUrl.pathname
    const trimmedpath = path.replace(/^\/+|\/+$/g, '')

    // Get the HTTP method
    const method = req.method.toUpperCase()

    // Get the query string
    const queryStringObject = parsedUrl.query

    // Get the headers
    const headers = req.headers
    
    // Get the payloads, if any
    const decoder = new stringDecoder('utf-8')
    let buffer = ''
    req.on('data', (data) => buffer += decoder.write(data))
    req.on('end', () => {
        buffer += decoder.end()

        //Choose the handler
        var chosenHandler = typeof(router[trimmedpath]) == 'undefined' ? handlers.notFound : router[trimmedpath]

        //Construct the data object to be sent to the handler
        var data = {
            'trimmedPath' : trimmedpath,
            'queryString' : queryStringObject,
            'method' : method,
            'headers' : headers, 
            'payload' : buffer
        }

        // Route the request to the handler
        chosenHandler(data, function(statusCode, payload) {
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200
            payload = typeof(payload) == 'object' ? payload : {}

            var payloadString = JSON.stringify(payload)

            res.writeHead(payloadString)
            // Send the response
            res.end('Response: ', statusCode, payloadString)


        })

        
        // Log the request path
        // console.log('Path received: ', trimmedpath)
        // console.log('Method: ', method)
        // console.log('Query: ', queryStringObject)
        // console.log('Headers: ', headers)
        // console.log('Payloads: ', buffer)
        // console.log(typeof(router[trimmedpath]))

    })

    
})

// Server listens on port 8100
server.listen(8500, () => console.log('Server is running on port 8500'))

//Defining handlers
var handlers = {}

//Sample handler
handlers.sample = (data, callback) => {
    callback(706, {'name' : 'sample'})
}
//NotFound Handler
handlers.notFound = (data, callback) => {
    callback(404)
}

//Defining request routers
var router = {
    'sample' : handlers.sample
}