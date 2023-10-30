import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }:any) => {
    const URL = import.meta.env.VITE_APP_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const logIn = async () => {
        const response = await axios.post(`${URL}users/login`, {email, password});
        const token = response.data.token;
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
        navigate('/home');
    };

    const logOut = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, logIn, logOut, email, setEmail, password, setPassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = ():any => {
    return useContext(AuthContext);
};
