import React, { useEffect, useRef, useState } from 'react'
import useAppContext from '../context/AppContext'; 
import { assets } from '../assets/assets';
import Message from './Message';
import toast from 'react-hot-toast';
const Chatbox = () => {
  const { navigate, user, setUser, fetchUser, chats, setChats, selectedChat, setSelectedChat, theme,setTheme,createNewChat,loadingUser,token,setToken,axios,fetchUserChats } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('text');
  const [isPublished, setIspublished] = useState(false);
  const containerRef = useRef(null);

  const onSubmit = async (e) => {
try {
  e.preventDefault();
  if (!user) toast('login to send message')
  setLoading(true);
  const promptCopy = prompt;
  setPrompt("");
  setMessages(prev => [...prev, { role: "user", content: promptCopy, timeStamp: Date.now(), isImage: false }]);
  const { data } = await axios.post(`/api/message/${mode}`, { chatId: selectedChat.id, prompt: promptCopy, isPublished }, { headers: { Authorization: token } });
  if (data.success) {
    setMessages(prev => [...prev, data.data]);

    if (mode == 'image') {
      setUser(prev=>({...prev,credits:prev.credits-=2}   )  )
    }
    else {
      setUser(prev=>({...prev,credits:prev.credits-=1}   )  )
    }
    
  }
  else {
    toast.error(data.message || "error from server side");
    setPrompt(promptCopy);
  }
} catch (error) {
  toast.error(error.message || "something went wrong");
  
}
finally {
  setPrompt('');
  setLoading(false);
    }
    
  }
  useEffect
    (() => { setMessages(selectedChat?.messages); console.log("size",!(messages?.length ));
    },
      [selectedChat])

  useEffect(() => {
    if(containerRef.current){containerRef.current.scrollTo({top:containerRef.current.scrollHeight,behaviour:'smooth'})}
  },[messages])
  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40'>

      {/* chat messages */}
      <div className='flex-1 mb-5 overflow-y-scroll' ref={containerRef}>
        {!(messages?.length) &&
          (
            <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
          <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} className='w-full max-w-56 sm:max-w-68' />
          <p className='mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white'>Ask me Anything</p>
          </div>)}

        {messages?.map((message, index) => <Message key={index} message={message} />)}
        
        {/* Three dots loading animation */}

        {
          loading && <div className='loader flex items-center gap-1.5'>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
          </div>
        }
      </div>

      
      {mode === 'image' && (<label className='inline-flex items-center gap-2 mb-3 text-sm mx-auto'>
        <p className='text-xs '>Publish Generated Image to Community</p>
        <input type="checkbox" className='cursor-pointer' checked={isPublished} onChange={(e) => { setIspublished(e.target.checked) }} />
      </label>)}




      {/* prompt input box */}
      <form onSubmit={onSubmit} className='bg-primary/20 dark:bg-[#583C79] border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl  p-3 pl-4 mx-auto  flex gap-4 items-center'>
        
        <select onChange={(e) => setMode(e.target.value)} value={mode} className='text-sm pl-3 pr-2 outline-none'>
          <option  className='dark:bg-purple-900' value="text">Text</option>
          <option  className='dark:bg-purple-900' value="image">Image</option>
        </select>

        <input onChange={(e) => setPrompt(e.target.value)} value={prompt} type="text" placeholder='type your prompt here' required className=' flex-1 w-full text-sm outline-none ' />
        <button disabled={loading}> <img src={loading? assets.stop_icon : assets.send_icon} className='w-8 cursor-pointer' /> </button>
      </form>


    </div>
  )
}

export default Chatbox
