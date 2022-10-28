import { Avatar } from '@mui/material'
import { motion } from 'framer-motion';
import React from 'react'
import { useSelector } from 'react-redux';
import '../css/Profile.css'
import { selectUser } from '../features/userSlice';

function Profile() {

  const user = useSelector(selectUser);

  return (
    <motion.div className='profile'
      intial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1
      }}>
      <motion.div className='left_info'
        initial={{
          opacity: 0,
          y: -200
        }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5
          }
        }}>

        <div className='profile_info'>
          <span className='profile_key'>Name:</span>
          <span>{user.displayName}</span>
        </div>

        <div className='profile_info'>
          <span className='profile_key'>Branch:</span>
          <span>Information Technology</span>
        </div>

        <div className='profile_info'>
          <span className='profile_key'>Year:</span>
          <span>Third Year</span>
        </div>
      </motion.div>

      <motion.div className='right_info'
        initial={{
          opacity: 0,
          y: -200
        }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            delay: 0.3
          }
        }}>
        <div className='profile_info'>
          <span className='profile_key'>Email:</span>
          <span>{user.email}</span>
        </div>

        <div className='profile_info'>
          <span className='profile_key'>Contact Number:</span>
          <span>88888 88888</span>
        </div>

        <div className='profile_info'>
          <span className='profile_key'>LinkedIn Profile:</span>
          <span>xyz@.com</span>
        </div>

      </motion.div>

      <motion.div className='profile_desc'
        initial={{
          opacity: 0,
          y: -200
        }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            delay: 0.5
          }
        }}>
       
          <Avatar src={user.photo} />
        <div className='desc'>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis voluptas amet, voluptatibus explicabo quam velit aliquid quidem quos, totam tempora eaque sint exercitationem unde alias enim eum ut inventore ipsa. Amet, rerum delectus quidem laboriosam iste dolores inventore, dignissimos unde pariatur tempore ducimus, placeat nisi quibusdam consequuntur eos tempora dolore.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Profile
