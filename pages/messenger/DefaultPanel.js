import { ChatIcon } from "@heroicons/react/outline";
import React from "react";

function DefaultPanel() {
  return (
    <div className="col-span-5 my-6 rounded-r-xl border-gray-100 border-[1px] bg-black overflow-hidden flex flex-col justify-center">
      <div className="flex flex-col items-center justify-center ">
        <ChatIcon className="h-[120px]" />
        <p className="text-lg">Click on a chat to view messages</p>
      </div>
    </div>
  );
}

export default DefaultPanel;
