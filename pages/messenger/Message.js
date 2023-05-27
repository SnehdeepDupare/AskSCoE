import React, { useContext, useEffect, useRef } from "react";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import { userState } from "../../atoms/userAtom";
import { ChatContext } from "../../context/ChatContext";
import profile from "../../public/images/profile.png";
import { motion } from "framer-motion";

function Message({ message }) {
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const { data } = useContext(ChatContext);
  const scroll = useRef();

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <motion.div
      ref={scroll}
      className={`text-white flex items-center p-2 ${
        message.senderId === currentUser?.uid && "owner"
      }`}
    >
      <img
        src={
          message.senderId === currentUser?.uid
            ? currentUser?.userImg
            : data.user?.userImg
        }
        className="h-6 rounded-full mr-2"
      />

      <div
        className={`flex flex-col ${
          message.senderId === currentUser?.uid && "owner"
        }`}
      >
        <p className="bg-[#121212] p-2 rounded-full max-w-fit">
          {message.text}
        </p>
        <p className="text-[10px] text-gray-500">
          <Moment format="DD/MM/YY HH:mm">{message.date.toDate()}</Moment>
        </p>
        {message.img && (
          <>
            <img src={message.img} className="max-w-[50%] rounded-xl" />
            <Moment format="DD/MM/YY HH:mm">{message.date.toDate()}</Moment>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default Message;
