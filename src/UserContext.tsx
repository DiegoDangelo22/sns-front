import { createContext, useContext, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';

const UserContext = createContext();

export const UserProvider = ({ children }:any) => {
  const [userId, setUserId]:any = useState('');

  useEffect(()=>{
    console.log(userId)
  }, [userId!==''])

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      const decoded:{id:string} = jwt_decode(token);
      setUserId(decoded.id);
    }
  }, [userId!=='']);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token") {
        const token = event.newValue;
        if (token !== null) {
          const decoded:{id:string} = jwt_decode(token);
          setUserId(decoded.id);
        } else {
          setUserId('');
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [userId!=='']);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = ():any => {
  return useContext(UserContext);
};