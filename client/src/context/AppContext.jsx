import { useNavigate } from "react-router-dom";

import  { createContext, useContext, useState, useEffect } from "react";
import {dummyChats, dummyUserData} from "./../assets/assets.js"
const AppContext = createContext()
import axios from 'axios';
import toast from "react-hot-toast";
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
export const AppContextProvider = ({ children }) => {
    console.log(import.meta.env.VITE_SERVER_URL);
    
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem("theme" || "light"));
    const [token, setToken] = useState(localStorage.getItem('token', null));
    const [loadingUser, setLoadingUser] = useState(true);

    const fetchUser = async () => {
        try {
            const {data} = await axios.get('/api/user/data', { headers: { Authorization: token } });
            if (data.success) {
                console.log("setting",data.data);
                
                setUser(data.data);        
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message)
            
        }
        finally {
            setLoadingUser(false);
        }
        
    }

    const createNewChat = async () => {
        try {
            if (!user) toast('login to create new chat');
            navigate('/');
            const response = await axios.get('/api/chat/create', { headers: { Authorization: token } });
            await fetchUserChats();

            
        } catch (error) {
            toast.error(error.message);
        }
        
    }
    useEffect(() => {
        if (token) { fetchUser(); }
        else { setUser(null); setLoadingUser(false); }
        
     }, []);
    
    const fetchUserChats = async () => {
            try {
                const response = await axios.get('/api/chat/get', { headers: { Authorization: token } });
                if (response.success) {
                    setChats(response.data);
                    
                    // if user has no chats add new one
                    if (data?.length === 0) {
                        await createNewChat();
                        await fetchUserChats();
                        
                    } else {
                        setSelectedChat(response.data[0]);
                    }

                }
                else toast(response.message)
            } catch (error) {
                toast.error(error.message)
            }
    }

    useEffect(
        () => {
            if (user) fetchUserChats();
            else { setChats([]); setSelectedChat(null) }
        }, [user])

    useEffect(
        () => {
            if (theme === 'dark') { document.documentElement.classList.add('dark'); }
            else document.documentElement.classList.remove('dark');
            localStorage.setItem('theme',theme)
        }
        , [theme])
    const value = { navigate, user, setUser, fetchUser, chats, setChats, selectedChat, setSelectedChat, theme,setTheme,createNewChat,loadingUser,token,setToken,axios,fetchUserChats };
    return(<AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>)
}

export default function useAppContext() { return useContext(AppContext); }