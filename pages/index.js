import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useRecoilState } from "recoil";
import { userState } from "../atoms/userAtom";
import CommentModal from "../components/CommentModal";
import Feed from "../components/Feed";
import LogoutModal from "../components/LogoutModal";
import MiniProfile from "../components/Miniprofile";
import Sidebar from "../components/Sidebar";
import { db } from "../firebase";
import CreateSpaceModal from "../components/CreateSpaceModal";

export default function Home() {
  const router = useRouter();
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

  useEffect(() => {
    !currentUser ? router.push("/auth/signin") : router.push("/");
  }, [currentUser]);

  return (
    <div className="bg-black h-screen flex">
      <Head>
        <title>AskSCoE</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Toaster />
      <main className="grid grid-cols-10">
        <Sidebar />
        <Feed />
        <MiniProfile />

        <CommentModal />
        <LogoutModal />
        <CreateSpaceModal />
      </main>
    </div>
  );
}
