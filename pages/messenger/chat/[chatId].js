import React, { useContext } from "react";
import ChatSidebar from "../ChatSidebar";
import Sidebar from "../../../components/Sidebar";
import ChatPanel from "../ChatPanel";
import { ChatContext } from "../../../context/ChatContext";
import { useRouter } from "next/router";
import Head from "next/head";

function ChatPage() {
  const { data } = useContext(ChatContext);
  const router = useRouter();

  const { chatId } = router.query;

  return (
    <div className="bg-[#121212] text-white h-screen flex">
      <Head>
        <title>Chat with {data.user.username}</title>
      </Head>

      <main className="grid grid-cols-10">
        <Sidebar />
        <ChatSidebar />
        <ChatPanel />
      </main>
    </div>
  );
}

export default ChatPage;
