//server.js
//1. Required necessary modules
const express = require('express')
const http = require('http')
const WebSocket = require('ws')

const port = process.env.PORT || 8080;

//2. Create an express app and an HTTP server
const app = express();
const server = http.createServer(app);

//3. Create a WebSocket server by passing it the HTTP server
const wsServer = new WebSocket.Server({server});

//4. Serve static files from the 'public' directory
app.use(express.static('public'));

//5. This is the core of our WebSocket Logic

wsServer.on('connection',(ws)=>{
console.log('✅ Client connected.');

//Handle message received from a client
    ws.on('message',(message)=>{
    console.log(`➡️ Received message: ${message}`);

    //The "broadcast" logic: Send the received message to all connected clients
    console.log('📢 Broadcasting message to all clients...');
    wsServer.clients.forEach((client)=>{
        //Check if the client is still open before sending
        if (client.readyState == WebSocket.OPEN){
            client.send(message.toString());
        }
    });
});

//Handle client disconnection
wsServer.on('close',()=>{
    console.log('❌ Client disconnected.');
})
})

//6. Start the server
server.listen(port, ()=>{
    console.log(`🚀 Server is listening on http://localhost:${port}`);
})