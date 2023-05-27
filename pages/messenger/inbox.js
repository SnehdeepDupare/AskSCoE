import Head from "next/head";
import React from "react";
import Sidebar from "../../components/Sidebar";
import ChatPanel from "./ChatPanel";
import ChatSidebar from "./ChatSidebar";
import DefaultPanel from "./DefaultPanel";
import LogoutModal from "../../components/LogoutModal";

function messenger() {
  return (
    <div className="bg-[#121212] text-white h-screen flex">
      <Head>
        <title>Chat @AskSCoE </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid grid-cols-10">
        <Sidebar />
        <ChatSidebar />
        <DefaultPanel />

        {/* <ChatPanel /> */}
        <LogoutModal />
      </main>
    </div>
  );
}

export default messenger;
