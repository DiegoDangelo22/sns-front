import axios from "axios";

export const detail = async (userId:any) => {
    const URL = import.meta.env.VITE_APP_URL;
    
    try {
        if(userId!==''){
            const userDetails = await axios.get(`${URL}users/detail/`+userId);
            return(userDetails);
        }
    } catch (error) {
        console.error(error);
    }
}