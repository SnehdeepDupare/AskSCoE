import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import "../css/Askscoe.css"
import Feed from './Feed'
import Profile from './Profile'
import Saved from './Saved'
import Settings from './Settings'
import Sidebar from './Sidebar'
import { motion } from 'framer-motion'
import Register from './auth/Register'


function Askscoe({ children }) {
  return (
    <motion.div className='askscoe'
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1,
        transition: {
          duration: 0.8
        }
      }}>
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />


          <Route path="/register" element={<Register />} />


        </Routes>
        {/* <Feed /> */}
        {/* {children} */}
      </BrowserRouter>
    </motion.div>
  )
}

export default Askscoe
