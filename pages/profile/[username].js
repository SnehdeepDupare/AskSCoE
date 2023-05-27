import { ArrowLeftIcon } from "@heroicons/react/outline";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { SearchUserState } from "../../atoms/SearchUserAtom";
import { userState } from "../../atoms/userAtom";
import MiniProfile from "../../components/Miniprofile";
import Post from "../../components/Post";
import Sidebar from "../../components/Sidebar";
import { ChatContext } from "../../context/ChatContext";
import { db } from "../../firebase";
import LogoutModal from "../../components/LogoutModal";

function Profile() {
  const [user, setUser] = useRecoilState(SearchUserState);
  const [posts, setPosts] = useState([]);
  const [currentUser] = useRecoilState(userState);
  const { data } = useContext(ChatContext);

  const router = useRouter();
  const { username } = router.query;
  console.log(username);
  useEffect(() => {
    const handleSearch = async () => {
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );

      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
          console.log(user);
        });
      } catch (error) {
        console.log(error);
      }
    };
    handleSearch();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"), where("id", "==", user?.uid));
        onSnapshot(q, (snapshot) => {
          setPosts(snapshot.docs);
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [db, user]);

  // useEffect(() => {
  //   try {
  //     const q = query(collection(db, "posts"), where("id", "==", user?.uid));
  //     onSnapshot(q, (querySnapshot) => {
  //       const posts = [];
  //       querySnapshot.forEach((doc) => {
  //         posts.push(doc.data());
  //       });
  //       setPosts(posts);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [db, user]);

  return (
    <div className="bg-black text-white h-screen flex">
      <Head>
        <title>{user?.username} - Profile </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid grid-cols-10">
        <Sidebar />
        <div className="min-w-fit overflow-y-scroll border-r scrollbar-none col-span-5 w-full">
          {/* HEADER */}
          <div className="sticky flex items-center bg-black top-0 z-1000 py-4 px-5 border-b font-bold text-white text-xl gap-x-4">
            <div
              className="hover:bg-[#121212] cursor-pointer rounded-full w-9 h-9 flex items-center justify-center xl:px-0"
              onClick={() => router.push("/")}
            >
              <ArrowLeftIcon className="h-5 cursor-pointer" />
            </div>

            <div className="flex flex-col ">
              {user?.username}
              <span className="text-sm font-normal">{posts?.length} posts</span>
            </div>
          </div>

          {/* Profile pic container */}
          <div className="p-2">
            <img src={user?.userImg} className="rounded-full" />
          </div>
          <div className="border-b p-2">
            <h1>{user?.username}</h1>
            <h1>{user?.email}</h1>
            {!currentUser?.uid == user?.uid && (
              <button
                className=" bg-hotred rounded-full p-2"
                onClick={() => router.push(`/messenger/chat/${data.chatId}`)}
              >
                Message
              </button>
            )}
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

export default Profile;
