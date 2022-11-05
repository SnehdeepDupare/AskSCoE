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
import { motion } from "framer-motion";
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore'

Modal.setAppElement('#root');

function Post({ Id, question, imageUrl, timestamp, askscoeUser }) {

    const user = useSelector(selectUser)
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch()

    // Logic for question
    const questionId = useSelector(selectQuestionId)
    const questionName = useSelector(selectQuestionName)
    // Logic for reply
    const [reply, setReply] = useState("")
    const [getReply, setGetReply] = useState([])
    // Logic for likes
    const [likes, setLikes] = useState([]);
    const [hasLiked, setHasLiked] = useState(false);


    // useEffect(() =>
    //     onSnapshot(collection(db, 'questions', Id, 'likes'), (snapshot) =>
    //         setLikes(snapshot.docs)
    //     ),
    //     [db, Id]
    // );

    // useEffect(() =>
    //     setHasLiked(
    //         likes.findIndex((like) => like.id === user?.user?.uid) !== -1
    //     ),
    //     [likes]
    // );


    // const likePost = async () => {
    //     if (hasLiked) {
    //         await deleteDoc(doc(db, 'questions', Id, 'likes', user.uid));
    //     } else {
    //         await setDoc(doc(db, 'questions', Id, 'likes', user.uid), {
    //             username: user.displayName,
    //         }); 
    //     }
    // };

    // console.log(hasLiked);

    useEffect(() => {
        if (questionId) {
            db.collection('questions').doc(questionId).collection('reply').orderBy('timestamp', 'desc').onSnapshot(snapshot => setGetReply(snapshot.docs.map((doc) => ({
                id: doc.id,
                replies: doc.data()
            }))))
        }
    }, [])

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
        <motion.div
            initial={{
                opacity: 0,
                x: 300
                // scale:0
            }}
            animate={{
                opacity: 1,
                x: 0,
                // scale:1,
                transition: {
                    duration: 0.7
                }
            }}
            className='post'
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
                {/* <span>Branch</span>
                <span>-Year</span> */}
                <span className='post_timestamp'>{new Date(timestamp?.toDate()).toLocaleString()}</span>
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
                    {/* <div className='post_like' onClick={likePost}>
                        <FavoriteBorderOutlinedIcon />
                        Like
                    </div> */}
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
                            <span style={{fontSize:'13px', color:'gray'}}>replying to</span>
                            <h3>{question}</h3>
                            <p>
                                <span style={{fontSize:'13px', color:'gray'}}>asked by{" "}</span> 
                                <span className='name' >
                                    {askscoeUser.displayName ? askscoeUser.displayName : askscoeUser.email}
                                </span>{" "}
                                {""}
                                <span style={{fontSize:'13px', color:'gray'}}>on {" "}</span>
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
        </motion.div >
    )
}

export default Post
