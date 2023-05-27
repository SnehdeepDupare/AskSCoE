import Link from "next/link";
import React, { useEffect } from "react";
import SidebarOption from "./SidebarOption";
import {
  CogIcon,
  HomeIcon,
  BellIcon,
  BookmarkIcon,
  ChatIcon,
  UserIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";
import name_transparent_2 from "../public/images/name_transparent_2.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRecoilState } from "recoil";
import { userState } from "../atoms/userAtom";
import { LogoutModalState } from "../atoms/logoutAtom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function Sidebar() {
  const router = useRouter();
  const [open, setOpen] = useRecoilState(LogoutModalState);
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  // console.log(currentUser);

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

  function onSignOut() {
    signOut(auth);
    setCurrentUser(null);
    router.push("/auth/signin");
  }

  return (
    <div className=" bg-black border-r md:px-5 flex flex-col justify-between col-span-2 h-screen scroll">
      <div>
        <div
          onClick={() => router.push("/")}
          className="relative lg:inline-grid w-full h-16 cursor-pointer"
        >
          <Image
            src={name_transparent_2.src}
            alt="logo"
            fill
            className="object-contain invert"
          />
        </div>
        <Link href="/">
          <SidebarOption Icon={HomeIcon} text="Home" />
        </Link>
        <Link href="/notifications">
          <SidebarOption Icon={BellIcon} text="Notifications" />
        </Link>
        <Link href="/messenger/inbox">
          <SidebarOption Icon={ChatIcon} text="Messages" />
        </Link>
        <Link href="/saved">
          <SidebarOption Icon={BookmarkIcon} text="Saved" />
        </Link>
        <Link href="/spaces/">
          <SidebarOption Icon={UserGroupIcon} text="Spaces" />
        </Link>
        <Link href="/profile">
          <SidebarOption Icon={UserIcon} text="Profile" />
        </Link>
        <Link href="/settings">
          <SidebarOption Icon={CogIcon} text="Settings" />
        </Link>

        {/* <button className="bg-hotred hover:bg-red-500 w-full font-extrabold text-white mt-5 p-4 rounded-full transition-colors duration-100 ease-in-out">
          Post Question
        </button> */}
      </div>

      <div
        onClick={() => setOpen(true)}
        className="flex items-center justify-center md:justify-start mb-2 rounded-full p-3 cursor-pointer hover:bg-[#121212] transition-colors duration-100 ease-in-out "
      >
        <img
          src={currentUser?.userImg}
          className="h-10 w-10 mr-2 rounded-full flex-shrink-0"
        />
        <h2 className="text-white font-bold hidden md:inline">
          {currentUser?.username}
        </h2>
      </div>
    </div>
  );
}

export default Sidebar;
