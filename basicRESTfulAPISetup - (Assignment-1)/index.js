/*
*   Main api file
*/
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// Create a server
const server = http.createServer((req, res)=>{

    // Parse the request
    let parsedURL = url.parse(req.url,true);

    //Get the request data
    let reqMethod = req.method.toLocaleLowerCase();
    let reqQueryParams = parsedURL.query;

    // Get the request data
    let strDecoder = new StringDecoder('utf-8');
    let reqData = '';
    req.on('data', (data)=>{
        reqData += strDecoder.write(data);
    });

    // end the data adding
    req.on('end',()=>{
        reqData += strDecoder.end();

        // Prepare the request data
        let reqPayload = {
            'path': parsedURL.pathname.replace(/^\/+|\/+$/g,''),
            'method': reqMethod,
            'payload': reqData,
            'query': reqQueryParams
        };

        // Get the request path and call the router
        let chosenHandler = typeof(router[reqPayload.path]) !== 'undefined' ? router[reqPayload.path]: handler.notFound404;

        // Call the chosen router
        chosenHandler(reqPayload, function(statusCode, data){
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode ? statusCode : 404);
            // Send response
            res.end(typeof(data) == 'object' ? JSON.stringify(data) : {});
        });

    });

});

const handler = {};

handler.notFound404 = (data, callback) => {
    callback( 404, {"code":404,"status":"failure","message":"Route not found"} );
}

handler.sample = (data, callback) => {
    data.welcomeMessage = "Welcome! Hello World";
    callback( 200, data );
}

const router = {
    'hello': handler.sample,
    '404': handler.notFound404
}

// Listen to a port
server.listen(config.port);
console.log('Server listening to ',config.envName,' port ',config.port);
