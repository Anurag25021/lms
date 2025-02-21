import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Loading = () => {
  const {path}=useParams()
  const navigate =useNavigate();

  useEffect(()=>{
    if(path){
      const timer=setTimeout(()=>{
        navigate('/${path')
      },5000) 
      return ()=> clearTimeout(timer);
    }
  },[])
  return (
    
  )
}

export default Loading