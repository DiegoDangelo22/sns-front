import { useSearchContext } from '../SearchContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../UserContext';

const SearchResults = () => {
    const URL = import.meta.env.VITE_APP_URL;
    const {searchResults} = useSearchContext();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query')
    const {userId} = useUserContext();
    let navigate = useNavigate();

    const addFriend = async (friendId:number) => {
        try {
            await axios.post(`${URL}users/friends/add`, {
                userId: userId,
                friendId: friendId
            })
            alert("Solicitud enviada correctamente")
        } catch (error:any) {
            alert(error.response.data)
        }
    }

    return (
        <div className='bg-gray-900 grow'>
            <div className='bg-red-500 mx-auto my-10 w-2/4 text-white text-center rounded'>
                <h2 className='font-bold text-3xl'>Search results</h2>
                <h2 className='text-xl'>Your search: {query}</h2>
                <ul className='text-xl'>
                    {searchResults.map((result:any, index:any) => {
                        return (
                            <div className='flex' key={index}>
                                <div className='h-fit'>
                                    <div className='w-32 h-32 rounded border-8 border-red-500 relative overflow-hidden'>
                                        <img src={URL+result.avatar} alt="Avatar" className='absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2 text-red-500 rounded-md cursor-pointer' onClick={()=>navigate(`/profile/${result.id}`)} />
                                    </div>
                                    <div className='mb-2'>
                                        <button onClick={()=>addFriend(result.id)}>Add friend</button>
                                    </div>
                                </div>
                                <div className='h-32 flex items-center'>
                                    <li>{result.name} {result.surname}</li>
                                </div>
                            </div>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default SearchResults