import loginBg from '../assets/loginBg.jpg';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from "../AuthContext.tsx";
import { v4 as uuidv4 } from 'uuid';

const LoginForm = ({ setLogin }:any) => {
    const { isLoggedIn, logIn, email, setEmail, password, setPassword } = useAuth();

    return <div className="bg-gray-900 flex-grow flex justify-center items-center">
    <div className="bg-slate-100 w-4/5 h-4/5 pl-8 pt-8 rounded flex flex-col gap-4 bg-cover bg-center" style={{backgroundImage: `url('${loginBg}')`}}>
        <input type="email" placeholder="Email" className="bg-gray-700 text-white p-2 rounded w-52 border-2 focus:border-red-500 outline-none" autoFocus onChange={(e)=>setEmail(e.target.value)}/>
        <input type="password" placeholder="Password" className="bg-gray-700 text-white p-2 rounded w-52 border-2 focus:border-red-500 outline-none" onChange={(e)=>setPassword(e.target.value)}/>
        <input type="submit" value="Login" className="bg-gray-700 text-white p-2 rounded w-52 border-2 uppercase font-semibold hover:bg-red-500 cursor-pointer focus:border-red-500 outline-none" onClick={!isLoggedIn ? logIn : null}/>
        <div className="w-52 text-center text-white">
            <a onClick={()=>setLogin(false)}>Not registered yet?<br/>Click here!</a>
        </div>
    </div>
</div>
}

const RegisterForm = ({ setLogin }:any) => {
    const URL = import.meta.env.VITE_APP_URL;
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const avatar = 'public/images/newuseravatar.png';
    const tag = `${uuidv4()}`;

    const handleRegister = async () => {
        try {
            const response = await axios.post(`${URL}users/signup`, {name, surname, email, password, avatar, tag});
            console.log(response)
        } catch (error) {
            console.error("Error al registrar el usuario", error);
        }
    }

    return <div className="bg-gray-900 flex-grow flex justify-center items-center">
    <div className="bg-slate-100 w-4/5 h-4/5 pl-8 pt-8 rounded flex flex-col gap-4 bg-cover bg-center" style={{backgroundImage: `url('${loginBg}')`}}>
        <input type="text" placeholder="Name" value={name} className="bg-gray-700 text-white p-2 rounded w-fit border-2 focus:border-red-500 outline-none" autoFocus onChange={(e)=>{setName(e.target.value)}} />
        <input type="text" placeholder="Surname" value={surname} className="bg-gray-700 text-white p-2 rounded w-fit border-2 focus:border-red-500 outline-none" onChange={(e)=>setSurname(e.target.value)} />
        <input type="email" placeholder="Email" value={email} className="bg-gray-700 text-white p-2 rounded w-fit border-2 focus:border-red-500 outline-none" onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} className="bg-gray-700 text-white p-2 rounded w-fit border-2 focus:border-red-500 outline-none" onChange={(e)=>setPassword(e.target.value)} />
        <input type="submit" value="Signup" className="bg-gray-700 text-white p-2 rounded w-52 border-2 uppercase font-semibold hover:bg-red-500 cursor-pointer focus:border-red-500 outline-none" onClick={handleRegister}/>
        <div className="w-52 text-center text-white">
            <a onClick={()=>setLogin(true)}>Already have an account?<br/>Click here!</a>
        </div>
    </div>
  </div>
}

const Login = () => {
    const [login, setLogin] = useState(true);
    return <>
        {login ? <LoginForm setLogin={setLogin}/> : <RegisterForm setLogin={setLogin}/>}
    </>
}

export default Login