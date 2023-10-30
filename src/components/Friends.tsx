import { useState, useEffect } from "react";
import { useUserContext } from "../UserContext.tsx";
import { AcceptFriendship, DeclineFriendship } from "../services/FriendshipsService.tsx";
import { detail } from "../services/security/User.ts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useFriendshipContext } from "../FriendshipsContext.tsx";

const Friends = ({requestDirectMessage, getMessages, unreadMessages, closedChat, closedFL}:any) => {
  const URL = import.meta.env.VITE_APP_URL;
  const [friendsData, setFriendsData]: any = useState([]);
  const [friendshipsData, setFriendshipsData]: any = useState([]);
  const { userId } = useUserContext();
  const { friendships, getFriendships } = useFriendshipContext();

  const handleClick = async (friendId: any) => {
    await requestDirectMessage(friendId);
    await getMessages(friendId);
  };

  const pendingFriendRequests = friendships.filter((friendRequest:any) => friendRequest.status === "pending");
  const friends = friendships.filter((friendRequest:any) => friendRequest.status === "accepted");

  const getFriendshipsData = async () => {
    if (userId !== "") {
        pendingFriendRequests.forEach(async (request: any) => {
            if (request.userId !== userId) {
                const friendshipsData: any = await detail(request.userId);
                setFriendshipsData((state:any) => [friendshipsData.data, ...state]);
              } else if (request.friendId !== userId) {
                const friendshipsData: any = await detail(request.friendId);
                setFriendshipsData((state:any) => [friendshipsData.data, ...state]);
              }
        })
    }
  }

  const getFriendsData = async () => {
    if (userId !== "") {
        friends.forEach(async (f: any) => {
            if (f.userId !== userId) {
                const friendsData: any = await detail(f.userId);
                setFriendsData((state:any) => [friendsData.data, ...state]);
            } else if (f.friendId !== userId) {
                const friendsData: any = await detail(f.friendId);
                setFriendsData((state:any) => [friendsData.data, ...state]);
            }
        })
    }
  }

  useEffect(() => {
    getFriendships();
  }, [friendships.length]);

  useEffect(() => {
    getFriendshipsData();
  }, [pendingFriendRequests.length]);
  
  useEffect(() => {
    getFriendsData();
    return () => {
      setFriendsData([])
    }
  }, [friends.length]);

  const acceptFriendship = async (friendId:any) => {
    const response = await AcceptFriendship(friendId, userId);
    console.log(response);
    setFriendshipsData([])
    getFriendships();
  }

  const declineFriendship = async (friendId:any) => {
    const response = await DeclineFriendship(friendId, userId);
    console.log(response);
    setFriendshipsData([]);
    getFriendships();
  }

  return (
    <div id="friendsContainer" className={`${closedChat?"hidden":null} ${closedFL?"hidden":null} flex flex-col bg-gray-300 overflow-y-auto h-full border-l-2 border-gray-900`}>
        {pendingFriendRequests.length === 0 ? 
        <>
            <p className="bg-gray-900 text-white px-2">Pending friend requests</p>
            <p className="p-2">There aren't pending friend requests</p>
        </> : 
        <div className="flex flex-col gap-2 mb-2">
          <p className="bg-gray-900 text-white px-2">Pending friend requests</p>
          {friendshipsData.map((friend:any) => (
            <div key={`friend-${friend.id}`} className="flex items-center justify-between h-10 pl-2">
            <div className="w-10 min-w-[40px] h-full bg-gray-200 rounded border-2 border-red-500 relative overflow-hidden">
              <img src={URL + friend.avatar} className="absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2" alt="Avatar"/>
            </div>
            <ul className="list-none grow px-2 capitalize">
              <li key={`super-${friend.id}`} >{friend.name} {friend.surname}</li>
            </ul>
            {pendingFriendRequests.map((pfr:any) => (
              friend.id == pfr.userId && pfr.friendId == userId ?
                <div key={pfr.userId} className="flex h-full">
                  <button className="bg-green-400 rounded-full w-10 h-10 mr-2" onClick={()=>acceptFriendship(pfr.userId)} aria-description="Accept"><FontAwesomeIcon icon={faUserPlus} /></button>
                  <button className="bg-red-500 rounded-full w-10 h-10 mr-2" onClick={()=>declineFriendship(pfr.userId)} aria-description="Decline"><FontAwesomeIcon icon={faXmark} /></button>
                </div>:null))}
            </div>))}
        </div>}
        {friendsData.length === 0 ? 
        <>
            <p className="bg-gray-900 text-white px-2">Friends</p>
            <p className="p-2">You have no friends! 😭</p>
        </> : 
        <div className="flex flex-col gap-2 mb-2">
        <p className="bg-gray-900 text-white px-2">Friends</p>
            {
                friendsData.map((friend:any) => {
                      {let unreadMsgs = unreadMessages.filter((msg:any)=>msg.fromUserId===friend.id)
                      return <div key={friend.id} className="flex items-center justify-between h-10 pl-2">
                      <div className="w-10 h-full bg-gray-200 rounded border-2 border-red-500 relative overflow-hidden">
                        <img src={URL + friend.avatar} className="absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2" alt="Avatar"/>
                      </div>
                      <ul className="list-none grow pl-2 capitalize">
                        <li key={friend.id} onClick={()=>{
                          handleClick(friend.id);
                        }}>{friend.name} {friend.surname}</li>
                      </ul>
                      {unreadMsgs.length===0?
                      <></>:
                      <div className="bg-red-500 w-5 h-2/4 p-3 rounded-full mx-2 flex items-center justify-center text-white text-xs font-bold">
                        <p>{unreadMsgs.length}</p>
                      </div>}
                    </div>
                }})
            }
        </div>
        }
    </div>
  )}

export default Friends;