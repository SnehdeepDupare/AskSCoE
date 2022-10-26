import React from 'react'
import "../css/Askscoe.css"
import Feed from './Feed'
import Sidebar from './Sidebar'

function Askscoe() {
  return (
    <div className='askscoe'>
      <Sidebar />
      <Feed />
    </div>
  )
}

export default Askscoe
