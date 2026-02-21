import { useNavigate } from "react-router-dom";

import  { createContext, useContext, useState, useEffect } from "react";
import {dummyChats, dummyUserData} from "./../assets/assets.js"
const AppContext = createContext()

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem("theme" || "light"));

    const fetchUser = async () => {
        setUser(dummyUserData)
    }
    useEffect(() => { fetchUser();console.log("hello fromside bar");
     }, []);
    
    const fetchUserChats = async () => {
        setChats(dummyChats);
        setSelectedChat(dummyChats[0]);
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
    const value = { navigate, user, setUser, fetchUser, chats, setChats, selectedChat, setSelectedChat, theme,setTheme };
    return(<AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>)
}

export default function useAppContext() { return useContext(AppContext); }