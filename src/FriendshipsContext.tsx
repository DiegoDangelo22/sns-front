import { createContext, useContext, useEffect, useState } from "react";
import { useUserContext } from "./UserContext";
import { DeleteFriendship, GetFriendships } from "./services/FriendshipsService";

const FriendshipContext = createContext();

export const FriendshipProvider = ({children}:any) => {
    const {userId} = useUserContext();
    const [friendships, setFriendships]: any = useState([]);
    const [profileFriendships, setProfileFriendships]: any = useState([]);
    
      const getFriendships = async () => {
        if (userId !== "") {
          const friendships = await GetFriendships(userId);
          setFriendships(friendships);
        }
      };

      const getProfileFriendships = async (profileId:any) => {
        if (profileId != userId) {
          const friendships = await GetFriendships(profileId);
          setProfileFriendships(friendships);
        } else {
          const friendships = await GetFriendships(userId);
          setProfileFriendships(friendships);
        }
      };

      const handleDeleteFriendship = async (friend:any) => {
        await DeleteFriendship(userId, friend)
        getProfileFriendships(userId);
        getFriendships();
      }

      useEffect(()=>{
        getFriendships();
      }, [userId])

      return (
        <FriendshipContext.Provider value={{friendships, getFriendships, setFriendships, handleDeleteFriendship, getProfileFriendships, profileFriendships}}>
            {children}
        </FriendshipContext.Provider>
      )
};

export const useFriendshipContext = ():any => {
    return useContext(FriendshipContext)
};