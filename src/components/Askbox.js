import { Avatar, Input } from '@mui/material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import "../css/Askbox.css"
import { selectUser } from '../features/userSlice'
import Modal from 'react-modal'
import { ExpandMore, PeopleAltOutlined } from '@mui/icons-material'
import LinkIcon from '@mui/icons-material/Link';
import db from '../firebase'
import firebase from 'firebase/compat/app'
import { motion } from "framer-motion"

function Askbox() {

    const user = useSelector(selectUser);

    const [openModal, setOpenModal] = useState(false);
    const [input, setInput] = useState("");
    const [inputUrl, setInputUrl] = useState("")

    const handleQuestion = (e) => {
        e.preventDefault()

        setOpenModal(false)

        db.collection('questions').add({
            question: input,
            imageUrl: inputUrl,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user: user
        })

        setInput("")
        setInputUrl("")
    }

    return (
        <motion.div className='askbox'
        initial={{
            opacity:0,
            x:300
            // scale:0
        }}
        animate={{
            opacity: 1,
            x:0,
            // scale:1,
            transition:{
                duration: 0.7
            }
        }}>
            <div className='askbox_info'>
                <Avatar
                    src={user.photo}
                />
                <h4>
                    <span> {user.displayName ? user.displayName : user.email}</span>
                </h4>
                {/* <span>Branch</span>
                <span>-Year</span> */}
            </div>
            <div className='askbox_query'>
                <span onClick={() => setOpenModal(true)}>Enter Your Query!!</span>
                <Modal
                    isOpen={openModal}
                    onRequestClose={() => setOpenModal(false)}
                    shouldCloseOnOverlayClick={false}
                    style={{
                        overlay:{
                            backgroundColor: "rgba(0,0,0,0)",
                            width: 700,
                            height: 600,
                            zIndex: "1000",
                            top: "52%",
                            left: "50%",
                            marginTop: "-250px",
                            // marginLeft: "-350px"
                            // boxShadow: "4px 4px 4px  rgba(0,0,0,0.5)"
                        }
                      
                    }}>

                    <div className='modal_title'>
                        <h5>Add Question</h5>
                    </div>

                    <div className='modal_info'>
                        <Avatar
                            className='avatar'
                            src={user.photo} />
                        <span>{user.displayName ? user.displayName : user.email} asked</span>

                        <div className='modal_scope'>
                            <PeopleAltOutlined />
                            <span>Public</span>
                            <ExpandMore />
                        </div>
                    </div>

                    <div className='modal_field'>
                        <Input
                            required
                            type="text"
                            className='modal_inpfield'
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Start your question with 'What', 'How', 'Why', etc."
                        />

                    </div>

                    <div className='modal_fieldlink'>
                        <LinkIcon />
                        <Input
                            type="text" className='modal_linkfield'
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            placeholder="Optional: You can add an Image Url as an attachment for context"
                        />

                    </div>

                    <div className='modal_buttons'>
                        <button className='cancel' onClick={() => setOpenModal(false)}>Cancel</button>
                        <button type="submit" className='add'
                            onClick={handleQuestion}>Post Question</button>

                    </div>
                </Modal>
            </div>
        </motion.div>
    )
}

export default Askbox
