import axios from "axios";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { useUserContext } from "../UserContext.tsx";
import Friends from "./Friends.tsx";

const socket = io("http://localhost:3000", {
  autoConnect: true
});

const Chat = () => {
  const URL = import.meta.env.VITE_APP_URL;
  const {userId} = useUserContext();
  const [messages, setMessages]:any = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [userData, setUserData]:any = useState({});
  const [friendData, setFriendData]:any = useState({});
  const [friendId, setFriendId]:any = useState('');
  const [unreadMessages, setUnreadMessages]:any = useState([]);
  const [closedChat, setClosedChat] = useState(true);
  const [closedFL, setClosedFL] = useState(false);

  const getUserData = async () => {
    if (userId !== '') {
      const userData = await axios.get(`${URL}users/detail/${userId}`);
      setUserData(userData.data);
    }
  }

  const getFriendData = async (friendId:any) => {
    const friendData = await axios.get(`${URL}users/detail/${friendId}`);
    setFriendData(friendData.data);
  }

  const getMessages = async (friendId:any) => {
    const messages = await axios.get(`${URL}messages/list/${userId}/${friendId}`);
    getFriendData(friendId);
    setMessages(messages.data);
    setFriendId(friendId);
  }

  const receiveMessage = (message:any) => {
    setMessages((state:any) => [...state, message]);
  }

  const getUnreadMessages = async () => {
    const res = await axios.get(`${URL}messages/unreadMessages`);
    let unread = res.data.filter((msg:any)=>msg.toFriendId==userId);
    setUnreadMessages(unread)
  }

  useEffect(() => {
    getUserData()
    getUnreadMessages()
  }, [userId])

  const saveMessage = async () => {
    await axios.post((`${URL}messages/create`), {
      message: inputMessage,
      userId: userId,
      friendId: friendId,
      readed: 0
    })
    socket.emit("unread_message");
  }
  
  const sendMessage = (e:any) => {
    e.preventDefault()
    const newMessage = {
      message: inputMessage,
      fromUserId: userData.id,
      toFriendId: friendId,
      createdAt: new Date().toISOString(),
      readed: 0
    };
    setInputMessage("");
    socket.emit("direct_message", newMessage);
    console.log(newMessage)
    saveMessage()
  };

  useEffect(() => {
    socket.on("direct_message", receiveMessage)
    socket.on('unread_message', (data)=>setUnreadMessages((prev:any) => [...prev, data]))
    return () => {
      socket.off("direct_message", receiveMessage);
      socket.off('unread_message', getUnreadMessages)
    };
  }, []);

  const setMessageAsRead = async (userId:any, friendId:any) => {
    await axios.patch((`${URL}messages/readed/${userId}/${friendId}`))
  }

  const requestDirectMessage = (friendId:any) => {
    socket.emit('leave');
    socket.off('direct_message_started');
    socket.disconnect()
    socket.open()
    socket.emit('direct_message_request', {userId, friendId});
    socket.once('direct_message_started', ({room}) => {
      alert(`You have joined room ${room}`)
    })
  };

  useEffect(() => {    
    let unreadMessagesFromFriend = unreadMessages.filter((msg:any)=>msg.fromUserId == friendId);
    let unreadMessagesFromOtherFriends = unreadMessages.filter((msg:any)=>msg.fromUserId !== friendId);
    unreadMessagesFromFriend.forEach((e:any)=>{
      if(e.toFriendId == userId){
        setMessageAsRead(e.fromUserId, e.toFriendId)
        setUnreadMessages(unreadMessagesFromOtherFriends)
      }
    })
  }, [messages, friendId, unreadMessages])

  useEffect(()=>{
    const scrollHeight = document.querySelector('#chat')!.scrollHeight;
    document.querySelector('#chat')!.scrollTo({top:scrollHeight});
  }, [friendId])

  useEffect(()=>{
    const closeFL:any = document.querySelector("#closeFL");
    closeFL.style.writingMode = 'vertical-lr';
    closeFL.style.textOrientation = 'upright';
  }, [])

  const handleCloseFL = () => {
    if(closedFL===false){
        setClosedFL(true);
    } else {
      setClosedFL(false);
    }
  }

  const handleCloseChat = () => {
    if(closedChat===true){
      setClosedChat(false);
    } else {
      setClosedChat(true);
    }
  }

  return (
    <div id="chatContainer" className={`${closedChat?"h-0":"h-2/4"} flex mt-auto fixed w-fit bottom-0 right-0`}>
      <div id="closeFL" className={`${closedChat?"hidden":null} flex justify-center relative w-8 h-2/5 items-center bg-red-500 self-center rounded-l-lg`}>
          <button className="text-white absolute uppercase" onClick={handleCloseFL}>Friends</button>
      </div>
    <Friends requestDirectMessage={requestDirectMessage} getMessages={getMessages} unreadMessages={unreadMessages} closedChat={closedChat} closedFL={closedFL}/>
    <div className="relative">
        <div className="absolute -top-8 flex justify-center w-full">
          <button className="text-white bg-red-500 rounded-t-lg uppercase py-1 px-2" onClick={handleCloseChat}>{closedChat?"Open Chat":"Close Chat"}</button>
        </div>
        <form onSubmit={sendMessage} className={`${closedChat?"h-0":"h-full"} flex flex-col bg-gray-300 border-l-2 border-t-2 border-gray-900 max-w-md`}>
    <div id="chat" className={`${closedChat?"h-0":"h-5/6"} bg-gray-300 p-4 overflow-y-auto break-all`}>
      <div className="flex flex-col justify-between gap-2">
        {messages.map((message:any, index:any) => (
          <div key={index} className={`rounded ${message.fromUserId === userData.id ? "bg-red-600 text-white p-2 ml-auto" : "bg-sky-200 p-2 mr-auto"}`}>
            <b>{message.fromUserId===userData.id?userData.name:friendData.name}</b>: {message.message}
          </div>
        ))}
      </div>
    </div>
    <div className="flex m-2">
        <input type="text" value={inputMessage} onChange={(e)=>setInputMessage(e.target.value)} className="w-4/5 rounded-tl rounded-bl outline-none border-2 border-r-0 focus:border-red-600 p-2"/>
        <button className="bg-red-600 text-white w-1/5 rounded-tr rounded-br">Send</button>
      </div>
    </form>
    </div>
    </div>
  );
};

export default Chat;
