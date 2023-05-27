import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import SpaceInput from "../../components/SpaceInput";
import { Toaster } from "react-hot-toast";
import SpacePost from "../../components/SpacePost";

function spacePage() {
  const router = useRouter();
  const { title } = router.query;
  const [spaceData, setSpaceData] = useState();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    try {
      onSnapshot(doc(db, "spaces", title), (snapshot) => {
        if (snapshot.exists()) {
          setSpaceData(snapshot.data());
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [db, title]);

  useEffect(() => {
    const fetchSpacePosts = async () => {
      try {
        const q = query(
          collection(db, "spaces", title, "posts"),
          orderBy("timestamp", "desc")
        );
        // onSnapshot(q, (snapshot) => {
        //   const posts = [];
        //   snapshot.forEach((doc) => {
        //     posts.push(doc.data());
        //   });
        //   setPosts(posts);
        // });

        onSnapshot(q, (snapshot) => {
          setPosts(snapshot.docs);
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchSpacePosts();
  }, []);

  return (
    <div className="bg-black text-white h-screen">
      <Head>
        <title>{title} - Spaces</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid grid-cols-10 h-screen">
        <Sidebar />

        <div className="min-w-fit col-span-8 w-full overflow-y-scroll scrollbar-thin scrollbar-thumb-[#1f1f1f]">
          {/* HEADER */}
          <div className="sticky flex items-center bg-black top-0 z-1000 py-4 px-5 border-b font-bold text-white text-xl gap-x-4">
            <div
              className="hover:bg-[#1b1b1b] cursor-pointer rounded-full w-9 h-9 flex items-center justify-center xl:px-0"
              onClick={() => router.back()}
            >
              <ArrowLeftIcon className="h-5 cursor-pointer" />
            </div>
            Spaces
          </div>

          <div className="border-r w-[75%]">
            {/* Space Info */}
            <div className="border m-5 bg-[#121212] rounded-xl p-2 flex flex-col">
              <div className="">
                <span className="font-bold text-xl">{title}</span>
                <p className="mt-1">{spaceData?.description}</p>
              </div>
              <span className="text-xs text-end text-gray-500">
                ~Created by {spaceData?.ownerName}
              </span>
            </div>

            {/* Create New Post in Space */}
            <div className="border-t">
              <SpaceInput />
            </div>

            {posts.map((post) => (
              <SpacePost
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
      </main>
      <Toaster />
    </div>
  );
}

export default spacePage;
