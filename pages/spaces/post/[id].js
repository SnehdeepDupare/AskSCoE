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
import { SpaceCommentModalState } from "../../../atoms/SpaceAtom";
import { userState } from "../../../atoms/userAtom";
import { Toaster } from "react-hot-toast";
import { db } from "../../../firebase";
import SpaceCommentModal from "../../../components/SpaceCommentModal";
import Sidebar from "../../../components/Sidebar";
import SpacePost from "../../../components/SpacePost";
import LogoutModal from "../../../components/LogoutModal";

function spacePostPage() {
  const router = useRouter();
  const { title, id } = router.query;
  const [open, setOpen] = useRecoilState(SpaceCommentModalState);
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const [currentUser, setcurrentUser] = useRecoilState(userState);

  useEffect(() => {
    try {
      onSnapshot(doc(db, "spaces", title, "posts", id), (snapshot) => {
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
          collection(db, "spaces", title, "posts", id, "comments"),
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
              <SpacePost
                id={id}
                username={post?.username}
                userImg={post?.profileImg}
                img={post?.image}
                question={post?.question}
                timestamp={post?.timestamp}
                post={post}
                spacePostPage
              />
            </div>

            {/* {comments.length > 0 && (
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
            )} */}
          </div>

          {open && <SpaceCommentModal />}
          <LogoutModal />
          <Toaster />
        </main>
      </div>
    </div>
  );
}

export default spacePostPage;
