const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const path = require('path');

app.use(express.static('public'));
app.get('/',(req,res)=>{
    res.sendFile(__dirname +'/public/index3.html')
});
const waitingUsersvc = [];
let roomCounter = 1;



io.on('connection', (socket) => {
    console.log("a user connected", socket.id);

socket.on('addlistvc',(data)=>{
    console.log(data);
    if (waitingUsersvc.length > 0 ) {
        const partnerSocketId = waitingUsersvc.pop();
        const roomName = `room-${roomCounter}`;

        socket.join(roomName);
        const partnerSocket = io.sockets.sockets.get(partnerSocketId);
        partnerSocket.join(roomName);
        socket.room = roomName;
        partnerSocket.room = roomName;
        console.log('user joined in vc a room',socket.id,partnerSocket.id);
        console.log(waitingUsersvc);
        io.to(socket.room).emit('partnerjoined', roomName);

        roomCounter++;}
    else{
        waitingUsersvc.push(socket.id);
        console.log('user joined in waiting vc  list',socket.id);
        console.log(waitingUsersvc);
        }
});z
socket.on('ice-candidate',(candidate)=>{
    socket.to(socket.room).emit('new-ice-candidate',candidate)
});
// Listen for incoming ICE candidates from the server
socket.on('new-ice-candidate', async (candidate) => {
    console.log(candidate);
    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  });  
 socket.on('offer', (offer)=>{
    // console.log(data)
    socket.to(socket.room).emit('rcvoffer',offer)});
        // {
            // type: 'offer',
            // sdp : 'v=0\r\no=- 1579826908186225739 2 IN IP4 127.0.0.1\r\ns…3f569bc202 b4207a2b-9f05-4586-9e3f-b4ddad198897\r\n'
          
socket.on('answer',(answer)=>{
    console.log(answer);
    socket.to(socket.room).emit('rcvanswer',answer);
});
socket.on('disconnect',()=>{
    console.log( `${socket.id} disconnected`)
    socket.leave(socket.room)
    // partnerSocket.leave(socket.room)
    const index = waitingUsersvc.indexOf(socket.id);
    if (index !== -1) {
        waitingUsersvc.splice(index, 1);
    }

})
});   


const PORT = process.env.PORT || 300;
server.listen(PORT, () => {
    console.log("server listening on 300");
});