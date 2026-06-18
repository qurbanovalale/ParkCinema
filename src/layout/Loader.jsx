import React from 'react'
import Navbar from '../components/Navbar'
import Foooter from '../components/Foooter'

function Loader() {
  return (
    <>
    <div className='bg-black w-full h-screen'>
        <div className='flex justify-center items-center h-[100vh]'>
            <img src="https://new.parkcinema.az/_next/image?url=%2Fanimations%2Floading.gif&w=1920&q=75" alt="" />
        </div>
    </div>
    </>
  )
}

export default Loader
