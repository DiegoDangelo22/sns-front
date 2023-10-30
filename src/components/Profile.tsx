import axios from "axios";
import {useEffect, useRef, useState} from 'react';
import {useUserContext} from '../UserContext'
import { Link, useParams } from "react-router-dom";
import { getPostsByUser } from "../services/GetPostsByUser";
import { updatePostsByUser } from "../services/UpdatePostsByUser";
import { detail } from "../services/security/User";
import { useFriendshipContext } from "../FriendshipsContext";

const Profile = () => {
   const URL = import.meta.env.VITE_APP_URL;
   const [data, setData]:any = useState([]);
   const [selectedFile, setSelectedFile] = useState(null);
   const {userId} = useUserContext();
   const {id} = useParams();
   const [toggleEditDescBtns, setToggleEditDescBtns] = useState(false);
   const [toggleEditTagBtns, setToggleEditTagBtns] = useState(false);
   const descRef:any = useRef(null);
   const editDescBtnRef:any = useRef(null);
   const tagRefContainer:any = useRef(null);
   const tagRef:any = useRef(null);
   const arrobaRef:any = useRef(null);
   const editTagBtnRef:any = useRef(null);
   const [description, setDescription] = useState('');
   const [tag, setTag] = useState('');
   const [friendsData, setFriendsData]: any = useState([]);
   const {handleDeleteFriendship, profileFriendships, getProfileFriendships} = useFriendshipContext();
   
    async function getProfile() {
      try {
        const response = await axios.get(`${URL}users/detail/${id}`);
        setData(response.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    const handleFileChange = (event:any) => {
        const file = event.target.files[0];
        setSelectedFile(file);
      };

    const handleUpload = async (event:any) => {
        event.preventDefault();
    
        if (selectedFile) {
          const formData = new FormData();
          formData.append('avatarToUpload', selectedFile);
    
          try {
            const response = await fetch(`${URL}avatar`, {
              method: 'POST',
              headers: {
                'Access-Control-Allow-Origin': 'http://localhost:5173'
              },
              body: formData
            });
    
            if (response.ok) {
              let responseData = await response.json();
              await axios.patch(`${URL}users/updateAvatar/${userId}`, {
                avatar: responseData.filePath
              })
              setData({
                avatar: responseData.filePath,
                createdAt: data.createdAt,
                email: data.email,
                id: data.id,
                name: data.name,
                password: data.password,
                surname: data.surname,
                updatedAt: data.updatedAt
              })

              getPostsByUser(userId).then((res)=>{
                res.forEach((e:any) => {
                  updatePostsByUser(e.id, responseData.filePath)
                });
              })
            }
          } catch (error) {
            console.error('Error uploading file:', error);
          }
        }
      };

      const handleTagUpdate = async () => {
        await axios.post(`${URL}posts/updatePostContentWithUpdatedUserTags`, {
          oldTag: data.tag,
          newTag: tag
        });
        await axios.patch(`${URL}users/updateTag/${userId}`, {
          tag
        });
        setData({...data, tag});
      }

      const handleTagCancel = () => {
        tagRef.current.textContent = data.tag;
        tagRefContainer.current.className = ''
      }

      const editTag = () => {
        tagRef.current.focus();
      }

      const handleDescriptionUpdate = async () => {
        await axios.patch(`${URL}users/updateDescription/${userId}`, {
          description
        })
        setData({...data, description})
      }

      const handleDescriptionCancel = () => {
        descRef.current.textContent = data.description;
      }

      const editDescription = () => {
          descRef.current.focus();
      }

      useEffect(()=>{
        window.onclick = (e)=>{
          if(e.target!==descRef.current && e.target!==editDescBtnRef.current){
            setToggleEditDescBtns(false)
            handleDescriptionCancel()
            descRef.current.spellcheck = false
          } else {
            setToggleEditDescBtns(true)
          }
          
          if(e.target!==tagRefContainer.current && e.target!==arrobaRef.current && e.target!==tagRef.current && e.target!==editTagBtnRef.current){
            setToggleEditTagBtns(false)
            handleTagCancel()
            tagRef.current.spellcheck = false
          } else {
            setToggleEditTagBtns(true)
          }
        }
      }, [data, descRef, tagRef])

      const friends = profileFriendships.filter((friendRequest:any) => friendRequest.status === "accepted");

      const getFriendsData = async () => {
        if (id !== "") {
          const friendsDataPromises = friends.map(async (f: any) => {
            const friendIdToFetch = f.userId != id ? f.userId : f.friendId;
            const friendsDataResponse:any = await detail(friendIdToFetch);
            return friendsDataResponse.data;
          });
      
          const friendsDataArray = await Promise.all(friendsDataPromises);
      
          setFriendsData(friendsDataArray);
        }
      }

      useEffect(() => {
        getProfileFriendships(id);
        getProfile();
      }, [id]);

      useEffect(() => {
        getFriendsData();
        return () => {
          setFriendsData([])
        }
      }, [friends.length, id]);

      useEffect(() => {
        if(id!=userId){
          descRef.current.contentEditable=false
          if(descRef.current.textContent == ''){
            descRef.current.hidden = true
          }
        }
      }, [descRef.current])

      useEffect(() => {
        if(id!=userId){
          tagRef.current.contentEditable=false
          if(tagRef.current.textContent == ''){
            tagRef.current.hidden = true
          }
        }
      }, [tagRef.current])

   return (
       <div className="bg-gray-900 flex-grow flex justify-center py-10">
        <div className="bg-gray-700 flex gap-20 p-6 rounded">
        <div className="w-fit">
            <div className="w-32 h-32 bg-gray-200 rounded border-4 border-red-500 relative overflow-hidden">
                <img src={URL+data.avatar} className="absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2" alt="Avatar" />
           </div>
           <div className="text-red-500 text-center w-32 py-2">
                {
                  <div key={data.id}>
                    <h2 className="font-extrabold capitalize">{data.name} {data.surname}</h2>
                    <div ref={tagRefContainer}>
                      <span ref={arrobaRef}>@</span>
                      <span className="font-semibold lowercase outline-none break-words" ref={tagRef} contentEditable suppressContentEditableWarning onFocus={()=>{tagRef.current.spellcheck = true; tagRefContainer.current.className = "outline-none border-2 rounded break-all min-w-min w-32 p-2 mt-2 mx-auto"}} onInput={(e:any)=>setTag(e.target.textContent.toLowerCase())}>{data.tag}</span>
                    </div>
                    {id!=userId?
                    <></>:
                    toggleEditTagBtns===false?
                    <button className="text-white" ref={editTagBtnRef} onClick={editTag}>Edit tag</button>:
                    <div className="gap-3 flex justify-center text-white">
                      <button onClick={handleTagUpdate}>Save</button>
                      <button onClick={handleTagCancel}>Cancel</button>
                    </div>
                    }
                    <p className="font-semibold outline-none border-2 rounded mt-4 p-2 break-words" ref={descRef} suppressContentEditableWarning contentEditable onFocus={()=>{descRef.current.spellcheck = true}} onInput={(e:any)=>setDescription(e.target.textContent)}>{data.description}</p>
                    {id!=userId?
                    <></>:
                    toggleEditDescBtns===false?
                      <button className="text-white pt-2" ref={editDescBtnRef} onClick={editDescription}>Edit description</button>:
                      <div className="gap-3 flex justify-center text-white pt-2">
                        <button onClick={handleDescriptionUpdate}>Save</button>
                        <button onClick={handleDescriptionCancel}>Cancel</button>
                      </div>
                    }
                  </div>
                }
           </div>
           {id!=userId?<></>:
            <form onSubmit={handleUpload} encType="multipart/form-data" className="flex flex-col w-32 pt-4 gap-3">
              <label className="text-white text-center cursor-pointer bg-red-500 p-1 rounded">Select image
                <input className="hidden" type="file" onChange={handleFileChange} />
              </label>
              <input type="submit" value="Upload avatar" className="text-white cursor-pointer bg-red-500 p-1 rounded" />
            </form>}
        </div>
        <div>
          <div className="bg-red-500 rounded mb-4">
            <h1 className="text-white w-fit mx-auto">Friends</h1>
          </div>
          {friendsData.length===0?
          <p className="text-white">This user has no friends</p>:
          <div className="flex flex-col gap-4">
            {friendsData.map((friend:any, index:any) => (
            <div key={index} className="flex gap-8 justify-between max-w-xs">
            <Link to={`/profile/${friend.id}`}>
            <div key={friend.id} className="flex items-center justify-between h-fit">
              <div className="w-10 h-10 min-w-[40px] bg-gray-200 rounded border-2 border-red-500 relative overflow-hidden">
                  <img src={URL + friend.avatar} className="absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2" alt="Avatar"/>
              </div>
              <ul className="list-none grow pl-2 text-white capitalize">
                  <li key={friend.id}>{friend.name} {friend.surname}</li>
              </ul>
            </div>
            </Link>
            {id!=userId?<></>:
            <div className="text-white flex items-center">
              <button className="bg-red-500 p-1 rounded" onClick={()=>handleDeleteFriendship(friend.id)}>Delete</button>
            </div>}
            </div>
            ))}
          </div>}
        </div>
        </div>
       </div>
   );
}

export default Profile;