import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useAuth } from "./AuthContext.tsx";

export const ProtectedRoute = ({children}:any)=>{
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(()=>{
        if (!isLoggedIn) {
            navigate("/login");
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [isLoggedIn, navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }
        return children;
}