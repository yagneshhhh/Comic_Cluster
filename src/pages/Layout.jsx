import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Components/Header'
import Iridescence from '../Components/Background/Iridescene'
import Footer from '../Components/Footer'
function Layout() {
  const [enableMouse,setEnableMouse]=useState(false)

  useEffect(()=>
  {
    const update=()=>
    {
      setEnableMouse(window.innerWidth > 768);
    };

    update();
    window.addEventListener('resize',update);
    return ()=>window.removeEventListener('resize',update);
  },[]);
  return (
    <>
    <Iridescence 
      color={[0.6,0.8,1]}
      speed={0.8}
      amplitude={0.08}
      mouseReact={enableMouse}

    />
    <div className='  relative z-10 min-h-screen '>
        <Header/>
        <div className='pt-[100px] w-full px-3 sm:px-4 '>
        <main className='pt-[100px'>
          <Outlet/>
        </main>
        <Footer/>
        </div>
    </div>
    </>
  )
}

export default Layout