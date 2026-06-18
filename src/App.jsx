
import { Route, Routes } from "react-router-dom"
import Header from './components/Header';
import Main from "./components/Main";
import Detail from "./layout/Detail";
import Foooter from "./components/Foooter";
import Admin from "./layout/Admin";
import Profile from "./layout/Profile";
import { Toaster } from 'react-hot-toast'
import MainLayout from "./layout/MainLayout";

function App() {

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<Main />} />
          <Route path="/movie/:id" element={<Detail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}

export default App
