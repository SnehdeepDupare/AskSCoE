import { useRouter } from "next/router";
import React from "react";

function Spaces({ title, description }) {
  const router = useRouter();

  return (
    <div
      className="text-white flex flex-col cursor-pointer bg-[#121212] hover:bg-[#1b1b1b]"
      onClick={() => router.push(`/spaces/${title}`)}
    >
      <div className="p-3 border-b border-dotted">
        <span className="font-bold text-lg">{title}</span>
        <p className="truncate">{description}</p>
      </div>
    </div>
  );
}

export default Spaces;
