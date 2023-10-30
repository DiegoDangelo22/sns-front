import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext.tsx";
import SearchBar from "./SearchBar.tsx";
import { useUserContext } from '../UserContext.tsx';

const Header = () => {
    const { isLoggedIn, logOut } = useAuth();
    const { userId } = useUserContext();

    return <div className="flex justify-between px-7 h-20 shrink-0 bg-red-500">
        <h1 className="font-bold text-4xl text-white h-fit my-auto">
            <Link to="/">ViteReactApp</Link>
        </h1>
        <SearchBar/>
        <ul className="flex gap-5 my-auto text-white font-semibold text-lg">
            {isLoggedIn ?
            <>
                <li>
                    <Link to='/home'>Home</Link>
                </li>
                <li>
                    <Link to={`/profile/${userId}`}>Profile</Link>
                </li>
            </> :
            <></>
            }
            <li>
                <Link to='/about'>About</Link>
            </li>
            <li>
                <Link to='/login' onClick={isLoggedIn ? logOut : null}>
                    {isLoggedIn ? "Logout" : "Login"}
                </Link>
            </li>
        </ul>
    </div>
}

export default Header