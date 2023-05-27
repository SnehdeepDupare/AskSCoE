import React from "react";

function SidebarOption({ text, Icon }) {
  return (
    <div className="flex items-center justify-center md:justify-start cursor-pointer text-white hover:bg-red-100 rounded-full hover:text-[#E50914] transition-colors duration-100 ease-in-out">
      <Icon className="h-7 w-7 m-4 flex-shrink-0" />
      <h2 className="hidden font-extrabold md:mr-5 text-xl md:inline truncate">{text}</h2>
    </div>
  );
}

export default SidebarOption;
