import Head from "next/head";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useRouter } from "next/router";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/outline";
import SpaceCard from "../../components/SpaceCard";
import { useRecoilState } from "recoil";
import { SpaceModalState } from "../../atoms/CreateSpaceAtom";
import CreateSpaceModal from "../../components/CreateSpaceModal";
import LogoutModal from "../../components/LogoutModal";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { Toaster } from "react-hot-toast";

function Spaces() {
  const [SpaceModalOpen, setSpaceModal] = useRecoilState(SpaceModalState);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    onSnapshot(
      query(collection(db, "spaces"), orderBy("createdAt", "desc")),
      (snapshot) => {
        setCards(snapshot.docs);
      }
    );
  }, []);

  const router = useRouter();
  return (
    <div className="bg-black text-white h-screen flex">
      <Head>
        <title>Spaces - AskSCoE</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid grid-cols-10">
        <Sidebar />

        <div className="min-w-fit col-span-8 w-full overflow-y-scroll scrollbar-thin scrollbar-thumb-[#1f1f1f]">
          {/* HEADER */}
          <div className="sticky flex items-center bg-black top-0 z-1000 py-4 px-5 border-b font-bold text-white text-xl gap-x-4">
            <div
              className="hover:bg-[#1b1b1b] cursor-pointer rounded-full w-9 h-9 flex items-center justify-center xl:px-0"
              onClick={() => router.push("/")}
            >
              <ArrowLeftIcon className="h-5 cursor-pointer" />
            </div>
            Spaces
          </div>

          <div className="border bg-[#121212] m-5 rounded-xl p-2 w-[75%]">
            <span className="font-bold text-xl">Spaces</span>
            <p className="mt-1">
              A dedicated space for discusstion of specific topics!
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 px-5 gap-5">
            <div
              onClick={(e) => setSpaceModal(true)}
              className="border rounded-xl cursor-pointer h-[200px] flex items-center justify-center hover:bg-[#121212]"
            >
              <PlusIcon className="h-10" />
            </div>

            {cards.map((card) => (
              <SpaceCard
                key={card.id}
                title={card.data().title}
                description={card.data().description}
                ownerName={card.data().ownerName}
              />
            ))}
          </div>
        </div>
        <CreateSpaceModal />
        <LogoutModal />
        <Toaster />
      </main>
    </div>
  );
}

export default Spaces;
