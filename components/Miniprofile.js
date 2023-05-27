import { getAuth, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../atoms/userAtom";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import { SearchUserState } from "../atoms/SearchUserAtom";
import { Router, useRouter } from "next/router";
import Spaces from "./Spaces";

function MiniProfile() {
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const auth = getAuth();
  const [username, setUsername] = useState("");
  const [user, setUser] = useRecoilState(SearchUserState);
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [err, setErr] = useState(false);

  useEffect(() => {
    onSnapshot(
      query(collection(db, "spaces"), orderBy("createdAt", "desc"), limit(3)),
      (snapshot) => {
        setCards(snapshot.docs);
      }
    );
  }, []);

  function onSignOut() {
    signOut(auth);
    setCurrentUser(null);
  }

  const handleSearch = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
        console.log(user);
      });
    } catch (err) {
      console.log(err);
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    setUser(SearchUserState);
    router.push(`/profile/${user?.username}`);
  };

  return (
    <div className="hidden md:flex col-span-3 mt-2 mx-10 text-white  flex-col ">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-black py-2 px-4 border-gray-500 border-[1px] rounded-full"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        {/* <XIcon className="h-5 cursor-pointer z-10 " /> */}
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div
          className={`flex items-center gap-4 mt-1 p-2 cursor-pointer rounded-b-xl bg-[#121212] hover:bg-[#1b1b1b]}`}
          onClick={handleSelect}
        >
          <img src={user?.userImg} className="h-12 rounded-full" />
          <p className="text-sm font-bold">{user.username}</p>
        </div>
      )}

      {/* <div className="flex items-center mt-[200px] justify-between col-span-2">
        <img
          className="rounded-full border p-[2px] w-16 h-16"
          src={currentUser?.userImg}
        />

        <div className="flex=1 mx-4">
          <h2 className="text-white font-bold">{currentUser?.username}</h2>
          <h3 className="text-sm text-gray-400">WEB DEVELOPER</h3>
        </div>

        <button
          onClick={onSignOut}
          className="text-red-500 hover:text-red-400 text-sm font-semibold"
        >
          Sign Out
        </button>
      </div> */}
      <div className="mt-[150px]">
        <span className="font-extrabold text-xl py-2 px-3">Spaces</span>

        <div className="rounded-xl overflow-hidden">
          {cards.map((card) => (
            <Spaces
              key={card.id}
              title={card.data().title}
              description={card.data().description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MiniProfile;
