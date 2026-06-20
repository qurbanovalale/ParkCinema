import React from 'react'
import Slider from '../layout/Slider'
import Navbar from './Navbar'

function Header() {
  return (
    <div className="relative  w-full" >
      <Slider />
      <Navbar transparent />
    </div>
  )
}

export default Header
