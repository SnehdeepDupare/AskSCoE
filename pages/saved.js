import { ArrowLeftIcon, BookmarkIcon } from "@heroicons/react/outline";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../atoms/userAtom";
import MiniProfile from "../components/Miniprofile";
import Post from "../components/Post";
import Sidebar from "../components/Sidebar";
import { db } from "../firebase";
import LogoutModal from "../components/LogoutModal";
import { Toaster } from "react-hot-toast";

function saved() {
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSaved = async () => {
      onSnapshot(
        query(
          collection(db, "users", currentUser?.uid, "saved"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      );
    };
    fetchSaved();
  }, [db, currentUser]);

  // console.log(posts);

  // useEffect(() => {
  //   const fetchSaved = async () => {
  //     const q = query(collection(db, "users", currentUser?.uid, "saved posts"));
  //     const u = onSnapshot(q, (querySnapshot) => {
  //       const postss = [];
  //       querySnapshot.forEach((doc) => {
  //         postss.push(doc.data());
  //         console.log(postss);
  //         setPosts(postss);
  //       });
  //     });
  //   };
  //   fetchSaved();
  // }, []);

  return (
    <div className="bg-black text-white h-screen flex">
      <Head>
        <title>{currentUser?.username} - Saved </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid grid-cols-10">
        <Sidebar />
        <div className="min-w-fit overflow-y-scroll border-r scrollbar-none col-span-8 md:col-span-5 w-full">
          {/* HEADER */}
          <div className="sticky flex items-center bg-black top-0 z-50 py-4 px-5 border-b font-bold text-white text-xl gap-x-4">
            <div
              className="hover:bg-[#1b1b1b] cursor-pointer rounded-full w-9 h-9 flex items-center justify-center xl:px-0"
              onClick={() => router.push("/")}
            >
              <ArrowLeftIcon className="h-5 cursor-pointer" />
            </div>
            Saved
          </div>

          {/* Saved Posts */}
          <div className="">
            {posts.length == 0 ? (
              <div className="text-white h-full flex items-center justify-center flex-col text-xl">
                Nothing Here!
                <div className="rounded-full flex items-center justify-center p-4 border mt-2">
                  <BookmarkIcon className="h-12" />
                </div>
              </div>
            ) : (
              <>
                {posts.map((post) => (
                  <Post
                    key={post.id}
                    id={post.id}
                    username={post.data().username}
                    userImg={post.data().userImg}
                    img={post.data().image}
                    question={post.data().question}
                    timestamp={serverTimestamp}
                    post={post.data()}
                  />
                ))}
              </>
            )}
          </div>
        </div>
        <Toaster />
        <MiniProfile />
        <LogoutModal />
      </main>
    </div>
  );
}

export default saved;
