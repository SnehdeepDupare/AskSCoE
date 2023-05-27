import { useRouter } from "next/router";
import React, { useState } from "react";

function SpaceCard({ id, ownerName, title, description }) {
  const router = useRouter();

  return (
    <div
      className="border rounded-xl cursor-pointer h-[200px] hover:bg-[#121212] flex flex-col"
      onClick={() => router.push(`/spaces/${title}`)}
    >
      {/* Card Header */}
      <div className="p-2 border-b w-full">
        <span className="text-lg font-medium">{title}</span>
      </div>

      {/* Card Body */}
      <div className="p-2 flex flex-col justify-between h-full truncate whitespace-normal overflow-hidden text-ellipsis">
        <p className=" overflow-hidden">{description}</p>

        <span className="text-xs text-end text-gray-500">
          ~Created by {ownerName}
        </span>
      </div>
    </div>
  );
}

export default SpaceCard;
