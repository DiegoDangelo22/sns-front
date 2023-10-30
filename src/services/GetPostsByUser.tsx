import axios from "axios";

export const getPostsByUser = async (userId:any) => {
    const URL = import.meta.env.VITE_APP_URL;

    try {
        if(userId!==''){
            const posts = await axios.get(`${URL}posts/detail/${userId}`);
            return(posts.data)
        }
    } catch (error) {
        console.error(error);
    }

    return [];
}