import React from 'react'
import Foooter from '../components/Foooter'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    return (
        <>
            <main>
                <Outlet />
            </main>
            <Foooter />
        </>
    )
}

export default MainLayout
