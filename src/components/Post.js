import { Avatar } from '@mui/material'
import React, { useEffect, useState } from 'react'
import "../css/Post.css"
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import Modal from 'react-modal';
import { SaveAltOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { selectQuestionId, selectQuestionName, setQuestionInfo } from '../features/questionSlice';
import db from '../firebase';
import { selectUser } from '../features/userSlice';
import firebase from 'firebase/compat/app'

Modal.setAppElement('#root');

function Post({ Id, question, imageUrl, timestamp, askscoeUser }) {

    const user = useSelector(selectUser)
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch()

    const questionId = useSelector(selectQuestionId)
    const questionName = useSelector(selectQuestionName)
    const [reply, setReply] = useState("")

    const [getReply, setGetReply] = useState([])

    useEffect(() => {
        if (questionId) {
            db.collection('questions').doc(questionId).collection('reply').orderBy('timestamp', 'desc').onSnapshot(snapshot => setGetReply(snapshot.docs.map((doc) => ({
                id: doc.id,
                replies: doc.data()
            }))))
        }
    })

    const handleReply = (e) => {
        e.preventDefault()

        if (questionId) {
            db.collection('questions').doc(questionId).collection('reply').add({
                questionId: questionId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                reply: reply,
                user: user
            })

            console.log(questionId, questionName)
            setReply("")
            setOpenModal(false)
        }
    }

    return (
        <div className='post'
            onClick={() => dispatch(setQuestionInfo({
                questionId: Id,
                questionName: question
            }))}
        >
            <div className='post_header'>
                <Avatar
                    src={askscoeUser.photo}
                />
                <h4>
                    <span>{askscoeUser.displayName ? askscoeUser.displayName : askscoeUser.email}</span>
                </h4>
                <span>Branch</span>
                <span>-Year</span>
                <span>{new Date(timestamp?.toDate()).toLocaleString()}</span>
            </div>

            <div className='post_body'>
                <div className='post_question'>
                    <span>{question}</span>
                </div>

                <img src={imageUrl} alt='' />

                <div className='post_reply'>{
                    getReply.map(({ id, replies }) => (
                        <p
                            key={id}
                            style={{
                                position: "relative",
                                paddingBottom: "5px"
                            }}
                        >
                            {
                                Id === replies.questionId ? (<span>
                                    {replies.reply}
                                    <br />
                                    <span
                                        style={{
                                            positon: "absolute",
                                            fontSize: "small",
                                            display: "flex",
                                            right: "0px"

                                        }}>

                                        <span
                                            style={{
                                                color: "green"
                                            }}>
                                            {
                                                replies.user.displayName ? replies.user.displayName : replies.user.email
                                            } on {new Date(replies.timestamp?.toDate()).toLocaleString()}
                                        </span>
                                    </span>
                                </span>

                                ) : (
                                    ""
                                )}

                        </p>

                    ))
                }

                </div>

                <div className='post_footer'>
                    <div className='post_like'>
                        <FavoriteBorderOutlinedIcon />
                        Like

                    </div>
                    <div className='post_reply'
                        onClick={() => setOpenModal(true)}
                    >
                        <ChatBubbleOutlineOutlinedIcon />
                        Reply
                    </div>
                    <Modal
                        isOpen={openModal}
                        onRequestClose={() => setOpenModal(false)}
                        shouldCloseOnOverlayClick={false}
                        style={{
                            overlay: {
                                backgroundColor: "rgba(0,0,0,0)",
                                width: 700,
                                height: 600,
                                zIndex: "10000",
                                top: "52%",
                                left: "50%",
                                marginTop: "-250px",
                                // marginLeft: "-350px"
                                // boxShadow: "4px 4px 4px  rgba(0,0,0,1)"
                            }
                        }}>

                        <div className='modal_question'>
                            <span>replying to</span>
                            <h3>{question}</h3>
                            <p>
                                asked by{" "}
                                <span className='name'>
                                    {askscoeUser.displayName ? askscoeUser.displayName : askscoeUser.email}
                                </span>{" "}
                                {""}
                                on {" "}
                                <span className='name'>
                                    {new Date(timestamp?.toDate()).toLocaleString()}
                                </span>
                            </p>
                        </div>

                        <div className='modal_reply'>
                            <textarea
                                required
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="Enter Reply"
                                type="text"
                            />
                        </div>

                        <div className='modal_button'>
                            <button className='cancel' onClick={() => setOpenModal(false)}>Cancel</button>
                            <button type="submit" className='add'
                                onClick={handleReply}
                            >Post Reply</button>

                        </div>


                    </Modal>

                    <div className='post_save'>
                        <SaveAltOutlined />
                        Save
                    </div>

                </div>
            </div>
        </div >
    )
}

export default Post
