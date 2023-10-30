import axios from "axios";
// import { useUserContext } from "../UserContext";

export const updatePostsByUser = async (postId:any, avatar:any) => {
    const URL = import.meta.env.VITE_APP_URL;
    // const {userId} = useUserContext();

    try {
        // if(userId!==''){
            const posts = await axios.put(`${URL}posts/update/${postId}`, {avatar});
            return(posts.data)
        // }
    } catch (error) {
        console.error(error);
    }

    return [];
}