import Image from "next/image";
import { useRouter } from "next/router";
import name_transparent_2 from "../../public/images/name_transparent_2.png";
import React, { useContext, useState } from "react";
import Chats from "./Chats";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useRecoilState } from "recoil";
import { userState } from "../../atoms/userAtom";
import { ChatContext } from "../../context/ChatContext";

function ChatSidebar() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [user, setUser] = useState("");
  const [currentUser, setcurrentUser] = useRecoilState(userState);
  const [err, setErr] = useState(false);

  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("username", "==", username));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
      console.log(err);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    //check whether the user group exists, if not create
    const combinedId =
      currentUser?.uid > user?.uid
        ? currentUser?.uid + user?.uid
        : user?.uid + currentUser?.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      // to create receiver doc in db

      if (!res.exists()) {
        // create a chat collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        // create user chats
        await updateDoc(doc(db, "userChats", currentUser?.uid), {
          [combinedId + ".userInfo"]: {
            uid: user?.uid,
            username: user?.username,
            userImg: user?.userImg,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user?.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser?.uid,
            username: currentUser?.username,
            userImg: currentUser?.userImg,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log(error);
    }

    setUser(null);
    setUsername("");
  };
  return (
    <div className="col-span-3 my-6 ml-10 rounded-l-xl border-gray-100 border-[1px] border-r-0 bg-black">
      {/* Header */}
      <div className="border-b p-4 text-center font-bold">
        {currentUser?.username}
      </div>

      {/* Search */}
      <div className="m-2 ">
        <input
          type="text"
          placeholder="Search"
          className="bg-black p-2 border-gray-500 border-[1px] w-full rounded-2xl"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div
          className=" flex items-center border-b gap-4 p-2 cursor-pointer hover:bg-[#121212]"
          onClick={handleSelect}
        >
          <img src={user?.userImg} className="h-12 rounded-full" />
          <p className="text-sm font-bold">{user?.username}</p>
        </div>
      )}

      {/* Chats */}
      <Chats />
    </div>
  );
}

export default ChatSidebar;
