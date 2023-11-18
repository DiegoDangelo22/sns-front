import axios from "axios";
import { useUserContext } from "../UserContext.tsx";
import { useEffect, useState } from "react";
import { format, compareDesc } from 'date-fns';
import { getPostsByUser } from "../services/GetPostsByUser.tsx";
import { GetFriendships } from "../services/FriendshipsService.tsx";
import { selectFile, uploadFile } from "../services/UploadFiles.tsx";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhotoFilm } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const URL = import.meta.env.VITE_APP_URL;
    const {userId} = useUserContext();
    const [data, setData]:any = useState([]);
    const [content, setContent]:any = useState('');
    const [tags, setTags]:any = useState([]);
    const [selectedFiles, setSelectedFiles]:any = useState([]);
    const [groupedPosts, setGroupedPosts]:any = useState([]);

    const handlePost = async () => {
        try {
            await axios.get(`${URL}users/detail/${userId}`).then(async (res)=>{
                setContent('');
                let input:any = document.querySelector("#input");
                input.value = '';
                if(selectedFiles.length==0) {
                    let post = await axios.post(`${URL}posts/create`, {content, belongsToUser: userId, userAvatar: res.data.avatar, userName: res.data.name, userSurname: res.data.surname});
                    setData((state:any) => [post.data, ...state]);
                } else {
                    uploadFile(userId).then(async (uploadResponse)=>{uploadResponse.forEach(async (f:any)=>{
                        console.log(uploadResponse)
                        if(uploadResponse.includes("No podés subir archivos .mkv")) {
                            return;
                        } else {
                            let post = await axios.post(`${URL}posts/create`, {content, belongsToUser: userId, userAvatar: res.data.avatar, userName: res.data.name, userSurname: res.data.surname, media: f.URL, mediaType: f.dataType});
                            setData((state:any) => [post.data, ...state]);
                        }
                    })})
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    const fetchPosts = async () => {
        if (userId !== '') {
            let myPosts = await getPostsByUser(userId);
            console.log(myPosts)
            let postsData = myPosts.map((post: any) => ({ ...post, createdAt: new Date(post.createdAt)}));
            
            let friendList = await GetFriendships(userId);
            for (const friend of friendList) {
                let friendsPosts = await getPostsByUser(friend.friendId!==userId?friend.friendId:friend.userId);
                postsData = [...postsData, ...friendsPosts.map((post: any) => ({ ...post, createdAt: new Date(post.createdAt)}))];
            }

            // Ordena las publicaciones por fecha de creación en orden descendente
            postsData.sort((a: any, b: any) => compareDesc(a.createdAt, b.createdAt));
            setData(postsData);
        }
    };

    const fetchUsersTag = async () => {
        const tags = await axios.get(`${URL}users/usersTag`);
        setTags(tags.data);
    }

    const postWithMention = (postContent:string) => {
        let words = postContent.split(" ");
        let updatedWords = words.map((w:any, index) => {
        let matchedTag = tags.find((t:any) => t.userTag && w.startsWith("@"));
            if(matchedTag!=undefined && w.length > matchedTag.userTag.length) {
                return (
                    <span key={index}>
                        <Link to={`/profile/${matchedTag.userId}`} key={index} className="text-red-500">
                            {w.slice(0, matchedTag.userTag.length+1)}
                        </Link>
                        <span key={`postMentionTextWithoutSpace-${index}`}>
                            {w.slice(matchedTag.userTag.length+1)}
                        </span>
                    </span>
                )
            } else {
                return <span key={index}>{w}</span>;
            }
        });

          const spacedContent = updatedWords.map((element, index) => [
            element,
            <span key={`space-${index}`}> </span>, // Whitespace
          ]);

          const contentWithSpaces = spacedContent.reduce((acc, element) => [...acc, ...element], []);

          return contentWithSpaces;
      };


    useEffect(() => {
        fetchPosts();
        fetchUsersTag();
    }, [userId]);

    useEffect(()=>{
        setGroupedPosts(data.reduce((groups:any, post:any) => {
            const key = `${post.belongsToUser}-${post.content}-${post.createdAt.toString().slice(0, -35)}`;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(post);
            return groups;
        }, {}))
    }, [data.length])

    useEffect(()=>{
        console.log(groupedPosts)
    }, [data.length])

    return <div className="bg-gray-900 flex-grow flex flex-col items-center py-12 gap-12">
        <div className="bg-gray-200 w-3/5 h-fit flex flex-col rounded-2xl rounded-tr-3xl">
            <div className="flex w-full h-28">
                <div className="relative w-full">
                    <div className="w-full h-full relative">
                        <textarea id="input" placeholder="Escribí algo..." className="w-full h-full p-2 outline-none bg-transparent resize-none" onChange={(e:any)=>{
                            let input:any = document.querySelector("#input");
                            input.spellcheck = false
                            input.style.scrollbarWidth = 'none'
                            e.target.value = e.target.value.replace(/\s+/g, " ")
                            setContent(e.target.value);
                        }}></textarea>
                </div>
                </div>
                <div className="flex justify-center items-center w-1/6 h-full bg-red-500 rounded-bl-2xl rounded-tr-2xl">
                    <button className="text-white" onClick={handlePost}>Post</button>
                </div>
            </div>
            <div className="m-2">
                <div>
                    <label title="Upload media" className="cursor-pointer bg-red-500 w-5 h-4 p-5 flex justify-center items-center rounded-full">
                        <FontAwesomeIcon icon={faPhotoFilm} style={{color: '#fff'}} />
                        <input className="hidden" id="selectFiles" type="file" multiple accept=".png, .jpg, .mp4, .gif" onChange={(e)=>{setSelectedFiles(selectFile(e))}} />
                    </label>
                </div>
            </div>
        </div>
        <div className="w-3/5 h-fit rounded flex flex-col gap-4">

        {Object.values(groupedPosts).map((group:any, index) => (
                group.length>1?
                <div className="bg-gray-200 flex flex-col rounded" key={index}>
                    <div className="flex">
                    <div className="max-w-[112px] h-fit p-1 pt-4 overflow-hidden mx-3 my-auto">
                        <img src={URL+group[0].userAvatar} alt="Avatar" className="w-full h-auto object-contain rounded-full"></img>
                        <p className="font-semibold text-center pt-1">{group[0].userName} {group[0].userSurname}</p>
                    </div>
                    <div className="break-words w-full ml-1 mr-[1.25rem]">
                        <p className="my-5 mr-5">{postWithMention(group[0].content)}</p>
                        <div className={`grid grid-cols-2 ${group.length>2?"grid-rows-2":''}`}>
                        {group.map((post:any) => (
                            <div key={post.id} className="bg-gray-200 w-full">
                                {post.mediaType === "image/jpeg" || post.mediaType === "image/png" ? <img src={post.media}/>:<></>}
                                {post.mediaType === "video/mp4" ? <video width="400" height="400" controls><source src={post.media} type="video/mp4"></source></video>:<></>}
                            </div>
                        ))}
                        </div>
                    </div>
                    </div>
                    <div className="flex ml-3 mt-4 mb-1">
                        <p className="text-center">{format(new Date(group[0].createdAt), 'dd/MM/yyyy HH:mm:ss')}</p>
                    </div>
                </div>:
                <>
                    {group.map((post:any) => (
                    <div className="bg-gray-200 flex flex-col rounded" key={post.id}>
                        <div className="flex">
                        <div className="max-w-[112px] h-fit p-1 pt-4 overflow-hidden mx-3 my-auto">
                            <img src={URL+post.userAvatar} alt="Avatar" className="w-full h-auto object-contain rounded-full"></img>
                            <p className="font-semibold text-center pt-1">{group[0].userName} {group[0].userSurname}</p>
                        </div>
                        <div className="break-words w-full ml-1 mr-[1.25rem]">
                            <p className="my-5 mr-5">{postWithMention(post.content)}</p>
                            {post.mediaType === 'image/jpeg' || post.mediaType === 'image/png' ? <img src={post.media}/>:<></>}
                            {post.mediaType === 'video/mp4' ? <video width="400" height="400" controls><source src={post.media} type="video/mp4"></source></video>:<></>}
                        </div>
                        </div>
                        <div className="flex ml-3 mt-4 mb-1">
                            <p className="text-center">{format(new Date(post.createdAt), 'dd/MM/yyyy HH:mm:ss')}</p>
                        </div>
                    </div>))}
                </>
            ))}
        </div>
    </div>
}

export default Dashboard