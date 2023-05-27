import {
  ChatIcon,
  EmojiHappyIcon,
  PhotographIcon,
} from "@heroicons/react/outline";
import {
  arrayUnion,
  Timestamp,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import React, { useContext, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../../atoms/userAtom";
import { ChatContext } from "../../context/ChatContext";
import { db, storage } from "../../firebase";
import Messages from "./Messages";
import { v4 as uuid } from "uuid";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import Moment from "react-moment";

function ChatPanel({ ChatPage }) {
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const { data } = useContext(ChatContext);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const filePickerRef = useRef(null);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, `chats/${data.chatId}/${uuid()}`);
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                sender: currentUser.username,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          sender: currentUser.username,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

  const handleKey = (e) => {
    if (!text.trim()) {
    } else {
      e.code === "Enter" && handleSend();
    }
  };

  return (
    <div className="col-span-5 my-6 rounded-r-xl border-gray-100 border-[1px] bg-black overflow-hidden flex flex-col">
      {/* {!ChatPage && (
        <div className="flex flex-col items-center justify-center ">
          <ChatIcon className="h-[120px]" />
          <p className="text-lg">Click on a chat to view messages</p>
        </div>
      )} */}

      {/* // Header */}
      <div className="border-b px-6 py-2 flex items-center ">
        <img src={data.user?.userImg} className="h-7 rounded-full mr-2" />
        <div className="flex flex-col items-start">
          <p>{data.user?.username}</p>
          <span className="text-xs text-gray-500">
            last active:{" "}
            <Moment fromNow>{data.user?.lastLogin?.toDate()}</Moment>
          </span>
        </div>
      </div>

      {/* // Messages */}
      <Messages />

      {/* // Input */}
      <div className="bg-black sticky bottom-0 flex items-center p-3 gap-x-4 z-50">
        <EmojiHappyIcon className="h-9 cursor-pointer" />
        <input
          type="text"
          placeholder="Type Something..."
          className="w-full bg-black p-2 border-gray-500 border-[1px] rounded-full "
          onKeyDown={handleKey}
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <div
          className="h-9 w-9 cursor-pointer flex items-center justify-center rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          <PhotographIcon className=" " />
          <input
            type="file"
            hidden
            ref={filePickerRef}
            onChange={(e) => {
              setImg(e.target.files[0]);
            }}
          />
        </div>

        <button
          disabled={!text.trim()}
          className="text-hotred cursor-pointer hover:text-red-600 disabled:cursor-default"
          onClick={handleSend}
          type="submit"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPanel;
