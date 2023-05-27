import Head from "next/head";
import React, { useEffect } from "react";
import name_transparent_2 from "../../public/images/name_transparent_2.png";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/router";
import { userState } from "../../atoms/userAtom";
import { useRecoilState } from "recoil";
import Link from "next/link";

function SignIn() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const auth = getAuth();
  const onGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      const user = auth.currentUser.providerData[0];
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          username: user.displayName,
          userImg: user.photoURL,
          uid: user.uid,
          timestamp: serverTimestamp(),
        });
        setDoc(doc(db, "userChats", user.uid), {});
      } else {
        updateDoc(docRef, {
          lastLogin: serverTimestamp(),
        });
      }

      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    !currentUser ? router.push("/auth/signin") : router.push("/");
  }, [currentUser]);

  return (
    <div className="flex h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-scroll bg-[url('../public/images/bgr.jpg')]">
      <Head>
        <title>Login | AskSCoE</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full max-w-3xl space-y-8 bg-white rounded-2xl py-20 shadow-2xl">
        <div className="">
          <img
            className="mx-auto h-30 w-auto"
            src={name_transparent_2.src}
            alt="Logo"
          />
          <h2 className="mt-2 text-lg text-center ">
            A place to share knowledge and know your Institute well❤️
          </h2>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight ">
            Sign in to your account
          </h2>
        </div>

        <div className="max-w-md mx-auto">
          <button
            onClick={onGoogleClick}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-hotred py-2 px-4 text-sm font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Sign in with Google
          </button>
        </div>
        
        {/* <div className="hover:underline">
          <Link href="/auth/register">Create New Account</Link>
        </div> */}
      </div>
    </div>
  );
}

export default SignIn;
