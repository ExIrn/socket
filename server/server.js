const express = require('express')
const app = express()
const http = require('http')

const cors = require('cors')

// enable cors
app.use(cors)

// const { Server } = require('socket.io')
const { socketConnection } = require('./handler/socketHandler')



const server = http.createServer(app).listen("8080", () =>{
    console.log("Server connect to port 8080");
});

// enable socket
socketConnection(server)