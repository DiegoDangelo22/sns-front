import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import axios from 'axios';
import { useSearchContext } from '../SearchContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const SearchBar = () => {
    const { isLoggedIn } = useAuth();
    const URL = import.meta.env.VITE_APP_URL;
    const {setSearchResults} = useSearchContext();
    const [searchTerm, setSearchTerm] = useState('');
    let navigate = useNavigate();

    const handleSearch = async () => {
        try {
            if(searchTerm!==''){
                const response = await axios.get(`${URL}users/friends/search?term=${searchTerm}`);
                setSearchResults(response.data);
                navigate(`/search?query=${searchTerm}`)
            } else {
                alert("Ingresá el usuario que querés buscar")
            }
        } catch (error) {
            console.error(error);
        }
    }

return (
    <>
    { isLoggedIn ?
        <div className='flex items-center gap-2'>
        <div>
            <input className='rounded-md outline-none px-2 py-1' type="text" onChange={(e)=>setSearchTerm(e.target.value)} />
        </div>
        <div className='relative right-[15%]'>
            <button type="button" className='text-black' onClick={handleSearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
        </div>
    </div> : <></>
    }
    </>
)
}

export default SearchBar