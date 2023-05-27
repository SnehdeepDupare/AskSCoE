import Head from "next/head";
import React from "react";
import Sidebar from "../../components/Sidebar";
import MiniProfile from "../../components/Miniprofile";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Image from "next/image";
import wip from "../../public/images/wip.png";

function index() {
  const router = useRouter();

  return (
    <div className="bg-black text-white h-screen">
      <Head>
        <title>Settings </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid grid-cols-10">
        <Sidebar />
        <div className="min-w-fit overflow-y-scroll border-r scrollbar-none col-span-8 md:col-span-5 w-full">
          {/* Header */}
          <div className="sticky flex items-center bg-black top-0 z-1000 py-4 px-5 border-b font-bold text-white text-xl gap-x-4">
            <div
              className="hover:bg-[#1b1b1b] cursor-pointer rounded-full w-9 h-9 flex items-center justify-center xl:px-0"
              onClick={() => router.push("/")}
            >
              <ArrowLeftIcon className="h-5 cursor-pointer" />
            </div>
            Settings
          </div>

          {/* Body */}
          <div className="flex flex-col items-center mt-5">
            <img src={wip.src} className="object-contain invert max-w-[200px] " />
            <span className="text-lg font-bold">In Development!</span>
          </div>
        </div>
        <MiniProfile />
      </main>
    </div>
  );
}

export default index;
