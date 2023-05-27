import { RefreshIcon } from "@heroicons/react/outline";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { db } from "../firebase";
import Input from "./Input";
import Post from "./Post";
import FlipMove from "react-flip-move";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // const refresh = () => {
  //   const refreshToast = toast.loading("Refreshing Page...");
  //   setLoading(true);

  //   router.reload();

  //   toast.success("Page Refreshed", {
  //     id: refreshToast,
  //   });
  //   setLoading(false);
  // };

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      ),
    []
  );

  return (
    <div className="min-w-fit overflow-y-scroll md:border-r scrollbar-none col-span-8 w-full md:col-span-5">
      {/* HEADER */}
      <div className="sticky bg-black top-0 z-10 py-4 px-5 border-b flex justify-between items-center">
        <h1 className="font-bold text-white text-2xl">Home</h1>
        {/* <RefreshIcon
          className="text-white cursor-pointer h-7 w-7"
          // onClick={refresh}
        /> */}
      </div>

      {/* ASKBOX */}
      <Input />
      {/* <Askbox /> */}

      {/* POSTS */}
      <div>
        <FlipMove>
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
        </FlipMove>
      </div>
    </div>
  );
}

export default Feed;
