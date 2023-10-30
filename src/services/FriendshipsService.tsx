import axios from "axios";

const URL = import.meta.env.VITE_APP_URL;

export const GetFriendships = async (userId:any) => {
    try {
        if(userId!==''){
            const friendships = await axios.get(`${URL}users/friendships/${userId}`);
            return(friendships.data)
        }
    } catch (error) {
        console.error(error);
    }
}

export const DeleteFriendship = async (userId:any, friendId:any) => {
    try {
        const deletedFriend = await axios.post(`${URL}users/friends/delete`, {
            userId,
            friendId
        })
        return(deletedFriend.data)
    } catch (error) {
        console.error(error);
    }
}

export const AcceptFriendship = async (userId:any, friendId:any) => {
    try {
        await axios.post(`${URL}users/friends/accept`, {
            userId: userId,
            friendId: friendId
        })
        return('Friendship accepted')
    } catch (error) {
        console.error(error);
    }
}

export const DeclineFriendship = async (userId:any, friendId:any) => {
    try {
        await axios.post(`${URL}users/friends/decline`, {
            userId: userId,
            friendId: friendId
        })
        return('Friendship declined')
    } catch (error) {
        console.error(error);
    }
}