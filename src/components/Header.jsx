import React from 'react'
import Slider from '../layout/Slider'
import Navbar from './Navbar'
import Lay from './Lay'

function Header() {
  return (
    <div className="relative h-screen w-full" >
      <Slider />
      <Navbar transparent />
      <Lay />
    </div>
  )
}

export default Header
