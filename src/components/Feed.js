import React, { useEffect, useState } from 'react'
import "../css/Feed.css"
import db from '../firebase'
import Askbox from './Askbox'
import Post from './Post'

function Feed() {

    const [posts, setPosts] = useState([])

    useEffect(() => {
        db.collection('questions')
            .orderBy('timestamp', 'desc')
            .onSnapshot(snapshot => setPosts(snapshot.docs.map((doc) => ({
                id: doc.id,
                question: doc.data(),
            }))
            )
            );
    }, []);

    return (
        <div className='feed'>
            <Askbox />
            {posts.map(({ id, question }) => (
                <Post
                    key={id}
                    Id={id}
                    imageUrl={question.imageUrl}
                    question={question.question}
                    timestamp={question.timestamp}
                    askscoeUser={question.user}
                />
            ))}
        </div>
    )
}

export default Feed
