import { ArrowLeftIcon } from "@heroicons/react/outline";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { postIdState } from "../atoms/CommentAtom";
import { userState } from "../atoms/userAtom";
import MiniProfile from "../components/Miniprofile";
import Post from "../components/Post";
import Sidebar from "../components/Sidebar";
import { db } from "../firebase";
import LogoutModal from "../components/LogoutModal";

function profile() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);

  const [postId, setPostId] = useRecoilState(postIdState);

  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchUser = async () => {
          const docRef = doc(db, "users", auth.currentUser.providerData[0].uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCurrentUser(docSnap.data());
          }
        };
        fetchUser();
      }
    });
  }, []);

  // useEffect(
  //   () =>
  //     onSnapshot(
  //       query(collection(db, "posts"), where("id", "==", currentUser?.uid)),
  //       (snapshot) => {
  //         setPosts(snapshot.docs);
  //       }
  //     ),
  //   [db, currentUser]
  // );
  // console.log(currentUser);

  useEffect(() => {
    const fetchPosts = async () => {
      onSnapshot(
        query(collection(db, "posts"), where("id", "==", currentUser?.uid)),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      );
    };
    fetchPosts();
  }, [db, currentUser]);

  return (
    <div className="bg-black text-white h-screen flex">
      <Head>
        <title>{currentUser?.username} - Profile </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid grid-cols-10">
        <Sidebar />
        <div className="min-w-fit overflow-y-scroll border-r scrollbar-none col-span-8 md:col-span-5 w-full">
          {/* HEADER */}
          <div className="sticky flex items-center bg-black top-0 z-1000 py-4 px-5 border-b font-bold text-white text-xl gap-x-4">
            <div
              className="hover:bg-[#1b1b1b] cursor-pointer rounded-full w-9 h-9 flex items-center justify-center xl:px-0"
              onClick={() => router.push("/")}
            >
              <ArrowLeftIcon className="h-5 cursor-pointer" />
            </div>

            <div className="flex flex-col ">
              {currentUser?.username}
              <span className="text-sm font-normal">{posts?.length} posts</span>
            </div>
          </div>

          {/* Profile pic container */}
          <div className="p-2">
            <img src={currentUser?.userImg} className="rounded-full" />
          </div>
          <div className="border-b p-2">
            <h1>{currentUser?.username}</h1>
            <h1>{currentUser?.email}</h1>
          </div>

          <div>
            {posts.map((post) => (
              <Post
                key={post.id}
                id={post.id}
                username={post.data().username}
                userImg={post.data().profileImg}
                img={post.data().image}
                question={post.data().question}
                timestamp={serverTimestamp}
                post={post.data()}
              />
            ))}
          </div>
        </div>
        <MiniProfile />
        <LogoutModal />
      </main>
    </div>
  );
}

export default profile;
