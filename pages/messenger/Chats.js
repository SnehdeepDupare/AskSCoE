import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import { userState } from "../../atoms/userAtom";
import { ChatContext } from "../../context/ChatContext";
import { db } from "../../firebase";

function Chats() {
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const { dispatch } = useContext(ChatContext);
  const router = useRouter();
  const { data } = useContext(ChatContext);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const getChats = () => {
      onSnapshot(doc(db, "userChats", currentUser?.uid), (doc) => {
        setChats(doc.data());
      });
    };

    currentUser?.uid && getChats();
  }, [db, currentUser]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
    router.push(`/messenger/chat/${data.chatId}`);
  };
  // console.log(chats);

  return (
    <div className="mt-2">
      {Object.entries(chats) == 0 ? (
        <div className="flex items-center justify-center mt-48">
          <p className="">Search a user to send a message :)</p>
        </div>
      ) : (
        <>
          {Object.entries(chats)
            ?.sort((a, b) => b[1].date - a[1].date)
            .map((chat) => (
              <div
                className=" flex items-center gap-4 p-2 cursor-pointer hover:bg-[#121212]"
                key={chat[0]}
                onClick={() => handleSelect(chat[1].userInfo)}
              >
                <img
                  src={chat[1]?.userInfo?.userImg}
                  className="h-12 rounded-full "
                />
                <div className="flex flex-col w-full">
                  <p className="text-sm font-bold">
                    {chat[1]?.userInfo?.username}
                  </p>
                  <div className="flex justify-between text-gray-500">
                    <span className="text-xs">
                      {" "}
                      {chat[1]?.lastMessage?.text}
                    </span>
                    <span className="text-xs">
                      {chat[1]?.lastMessage?.text ? (
                        <Moment fromNow>{chat[1]?.date?.toDate()}</Moment>
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
}

export default Chats;
