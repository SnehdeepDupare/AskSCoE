import { ArrowLeftIcon } from "@heroicons/react/outline";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { CommentModalState } from "../../atoms/CommentAtom";
import { userState } from "../../atoms/userAtom";
import Comment from "../../components/Comment";
import CommentModal from "../../components/CommentModal";
import MiniProfile from "../../components/Miniprofile";
import Post from "../../components/Post";
import Sidebar from "../../components/Sidebar";
import { db } from "../../firebase";
import LogoutModal from "../../components/LogoutModal";
import { Toaster } from "react-hot-toast";

function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [open, setOpen] = useRecoilState(CommentModalState);
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const [currentUser, setcurrentUser] = useRecoilState(userState);

  useEffect(() => {
    try {
      onSnapshot(doc(db, "posts", id), (snapshot) => {
        setPost(snapshot.data());
      });
    } catch (error) {
      console.log(error);
    }
  }, [db]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  );

  return (
    <div>
      <div className="bg-black text-white h-screen">
        <Head>
          <title>
            {post?.username} on AskSCoE: "{post?.question}"
          </title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="grid grid-cols-10 h-screen">
          <Sidebar />

          <div className="flex-grow border-r col-span-8 md:col-span-5 scrollbar-none overflow-y-auto">
            <div className="flex items-center px-1.5 py-2 border-b bg-black font-semibold text-xl gap-x-4 sticky top-0 z-1000 ">
              <div
                className="hover:bg-[#1b1b1b] cursor-pointer rounded-full w-9 h-9 flex items-center justify-center xl:px-0"
                onClick={() => router.back()}
              >
                <ArrowLeftIcon className="h-5 cursor-pointer" />
              </div>
              Post
            </div>

            <div>
              <Post
                id={id}
                username={post?.username}
                userImg={post?.profileImg}
                img={post?.image}
                question={post?.question}
                timestamp={post?.timestamp}
                post={post}
                postPage
              />
            </div>

            {comments.length > 0 && (
              <div className="pb-72">
                {comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    commentId={comment.id}
                    originalPostId={id}
                    comment={comment.data()}
                  />
                ))}
              </div>
            )}
          </div>
          {/* <MiniProfile /> */}
          <MiniProfile />

          {open && <CommentModal />}
          <LogoutModal />
          <Toaster />
        </main>
      </div>
    </div>
  );
}

export default PostPage;
