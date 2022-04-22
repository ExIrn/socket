const { Server } = require('socket.io')

exports.socketConnection = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: '*',
        },
    })

    const namespace = io.of('/chat')
    // namespace diatas kayak endpoint jadi event yg bisa akses namespace itu saja yg bisa masuk, lihat dibawah ini

    namespace.on('connection', (socket) => {
        console.log('socket connect to server!')
        //event LISTENER
        //buat nge join client2 ke dalam room yang dipilih
        socket.on("JOIN_ROOM", (room) =>{

            if(room.lastRoom){
                console.log("LEAVE ROOM " + room.lastRoom)
                socket.leave(room.lastRoom)
                
                const isRoomAvailable = socket.nsp.adapter.rooms.get(room.lastRoom)
                if(isRoomAvailable){
                //get users left in last room
                const userOnlineInRoom = socket.nsp.adapter.rooms.get(room.lastRoom).size.toString();
                socket.nsp.to(room.lastRoom).emit('RECEIVE_USERS_ONLINE_IN_ROOM', userOnlineInRoom)
                }
                
            }


            //logic database dan logic dll bisa di taruh disini get data
            console.log("ROOM", room)
            socket.join(room.currentRoom)
            console.log('user with id ' + socket.id + " join to room " + room.currentRoom)


            //buat ngitung jumlah orang online di room
            const userOnlineInRoom = socket.nsp.adapter.rooms.get(room.currentRoom).size.toString();
            console.log("USERS ONLINE IN ROOM ", userOnlineInRoom )
            socket.nsp.to(room.currentRoom).emit('RECEIVE_USERS_ONLINE_IN_ROOM', userOnlineInRoom)

        })
        socket.on("SEND_MESSAGE", (dataMessage) => {
            console.log("DATA MESSAGE", dataMessage)


            


            // namespace.emit("RECEIVE_MESSAGE", dataMessage ) //data yang udah ditangkep server, akan di kirim balik ke client
            // socket.emit("RECEIVE_MESSAGE", dataMessage ) ===== namnya basic emit
            // kalo socket.emit hanya 1 client, kalo pakai namespace.emit dapat mengirim ke banyak client -global message (pembuktian buka browser dan incognito)

            //broadcast si sender tidak dapat data yang dia kirim, cuma orang yang dia kirim yang dapet
            // socket.broadcast.emit("RECEIVE_MESSAGE", dataMessage)


            //emit to joined room (buat ngelempar pesan yang hanya ada di suatu room terpilih)
            socket.nsp.to(dataMessage.room).emit("RECEIVE_MESSAGE", dataMessage) //karna di payload sudah ada room, maka bisa digunakan

            
            
        })
       
        socket.on('IS_TYPING', (data) => {
            socket.broadcast.to(data.room).emit('RECEIVE_TYPING', data.isTyping)
        })

    })
};