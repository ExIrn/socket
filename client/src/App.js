import './App.css';
import io from 'socket.io-client'
import {useEffect, useState} from 'react'
function App() {

  const [socket, setSocket] = useState(null)

  //buat state buat nampung message yang akan di kirim ke server
  const[message, setMessage] = useState({}); // bentuknya object ada kurawalnya
  const[messages, setMessages] = useState([]); //bentuknya array karna buat render isi chatnya
  //const[room, setRoom] = useState(); buat nampung room first make
  const[room, setRoom] = useState({lastRoom: "", currentRoom: ""});// second make tambahan lastroom
  const[isTyping, setIsTyping] = useState(false);
  const [countOnlineInRoom, setCountOnlineInRoom] = useState(0)
  const [countOnlineInApp, setCountOnlineInApp] = useState(0)

  useEffect(() => {
    const newSocket = io.connect('http://localhost:8080/chat')

    newSocket.on('connect', () => {
      console.log('Socket Connected') //buat ngecek aja
    })
    //kita set socketnya
    setSocket(newSocket)

  }, [])

  useEffect(()=>{
    if(message.message){
      socket.emit("IS_TYPING", {isTyping: true, room: room.currentRoom})
    }else if(socket){ //else if socket yg ini buat menghindari error karna if diatas itu baru mau buat 
      socket.emit('IS_TYPING', {isTyping: false, room: room.currentRoom})
    }
  }, [message]) //array message setiap ada perubaahan pada State message akan aktif useEffect diatas

  const handleSendMessage = () => {
    const payload = {...message, room: room.currentRoom}
    console.log(payload)
    socket.emit("SEND_MESSAGE", payload)
    setMessage((prev) => ({ ...prev, message: "" }));
  }

  const handleJoinRoom = () => {
    socket.emit("JOIN_ROOM", room)
    setRoom((prev) => ({...prev, lastRoom: room.currentRoom}))
  }

  useEffect(() =>{
    if(socket){
    socket.on("RECEIVE_MESSAGE", (dataMessage) =>{
      console.log("RECEIVE_MESSAGE", dataMessage)
      //hasil receive ini di tampung di array messages di useState diatas
      setMessages((prev) => [...prev, dataMessage])
    })
    socket.on('RECEIVE_TYPING', (isTyping) => {
      setIsTyping(isTyping)
    })
    socket.on('RECEIVE_USERS_ONLINE_IN_ROOM', (usersOnlineInRoom) =>{
      setCountOnlineInRoom(usersOnlineInRoom)
    })
  }
  }, [socket]) // biar bisa ke listen terus dari server socket nya karena state socket berubah

  return (
    <div className="App">
      <div>User Online in App: {countOnlineInApp}</div>
      <div>User Online in Room: {countOnlineInRoom}</div>
      {isTyping && <span>Someine typing message....</span>}
      <div>
      <input placeholder='room' onChange={(e) => setRoom((prev) => ({...prev, currentRoom: e.target.value}))}
        />
      <button onClick={handleJoinRoom}>JOIN ROOM</button>
      </div>
      


     <input placeholder='username' onChange={(e) => {
       setMessage((prev) => ({...prev, username: e.target.value}));
       }}
       />
     <input placeholder='type message...' onChange={(e) => {
       setMessage((prev) => ({...prev, message: e.target.value}));
       }}
     />
     <button onClick={handleSendMessage}>Send Message</button>

       <div>
        <ul>
          {
            messages.map((message,index) => {
              return <li key={index}>{message.message}</li>;
            })
          }
        </ul>

       </div>




    </div>
  );
}

export default App;
