import React, { useState } from "react"
import Sidebar from "./components/Sidebar.jsx";
import { Route, Routes, useLocation } from "react-router-dom"
import ChatBox from "./components/ChatBox.jsx"
import Credit from "./pages/Credits.jsx"
import Community from "./pages/Community.jsx";
import { assets } from "./assets/assets.js";
import './assets/prism.css';
import Loading from "./pages/Loading.jsx";
import Login from "./pages/Login.jsx";
import useAppContext from "./context/AppContext.jsx";
import {Toaster} from 'react-hot-toast'
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let { user,loadingUser } = useAppContext();
  // user = null;
  
  const { pathName } = useLocation()
  if (pathName === '/loading' || loadingUser) return <Loading />

  
  return (
    <>
    <Toaster/>
  
      {!isMenuOpen && <img src={assets.menu_icon} className="absolute top-3  left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert" onClick={(e) => setIsMenuOpen(true)} />}

      {
        user ?
          (    <div className="dark:bg-gradient-to-r from-[#242124] to-[#000000] dark:text-white">
        
        <div className='flex h-screen w-screen '>
            <Sidebar isMenuOpen = {isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path="/" element={<ChatBox />} />
              <Route path="/credits" element={<Credit />} />
              <Route path="/community" element={<Community />} />
              <Route path="/loading" element={<Loading />} />              
              <Route path="/login" element={<Login/>}/>
            
            </Routes>
        </div>
        

          </div>)
          :
          (
            <div className="bg-gradient-to-b from-[#242124] to-[##000000] flex items-center justify-center h-screen w-screen">
                <Login />
          </div>
          )
      }
      
  
    </>
  )
}

export default App;