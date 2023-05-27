import React, { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import {
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { userState } from "../atoms/userAtom";
import { db, storage } from "../firebase";

function SpaceInput() {
  const [currentUser] = useRecoilState(userState);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const router = useRouter();
  const { title } = router.query;

  const sendPost = async () => {
    if (loading) return;
    const postingToast = toast.loading("Uploading...");
    setLoading(true);

    const docRef = await addDoc(collection(db, "spaces", title, "posts"), {
      id: currentUser.uid,
      username: currentUser.name,
      profileImg: currentUser.userImg,
      question: input,
      timestamp: serverTimestamp(),
    });

    const imageRef = ref(storage, `spaces/${title}/${docRef.id}/image`);

    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "spaces", title, "posts", docRef.id), {
          image: downloadURL,
        });
      });
    }

    toast.success("Posted!", {
      id: postingToast,
    });
    setLoading(false);
    setInput("");
    setSelectedFile(null);
  };

  const addImageToPost = (e) => {
    const addImgToast = toast.loading("Uploading Image...");

    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };

    toast.success("Image Uploaded", {
      id: addImgToast,
    });
  };

  return (
    <div
      className={`border-b border-gray-700 p-3 flex space-x-3 overflow-y-auto scrollbar-hide ${
        loading && "opacity-60"
      }`}
    >
      <img
        src={currentUser?.userImg}
        alt=""
        className="h-11 w-11 rounded-full cursor-pointer"
      />
      <div className="divide-y divide-gray-700 w-full">
        <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your Query here..."
            rows="2"
            className="bg-transparent outline-1 rounded-xl p-2 text-white text-lg focus:ring-white placeholder-gray-500 tracking-wide w-full min-h-[50px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#353535]"
          />

          {selectedFile && (
            <div className="relative">
              <div
                className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                onClick={() => setSelectedFile(null)}
              >
                <XIcon className="text-white h-5" />
              </div>
              <img
                src={selectedFile}
                alt=""
                className="rounded-2xl max-h-80 object-contain"
              />
            </div>
          )}
        </div>
        {!loading && (
          <div className="flex items-center justify-between pt-2.5">
            <div className="flex items-center">
              <div
                className="icon"
                onClick={() => filePickerRef.current.click()}
              >
                <PhotographIcon className="text-white hover:text-hotred h-[22px]" />
                <input
                  type="file"
                  ref={filePickerRef}
                  hidden
                  onChange={addImageToPost}
                />
              </div>

              {/* <div className="icon rotate-90">
                <ChartBarIcon className="text-hotred h-[22px]" />
              </div> */}

              <div
                className="icon"
                //   onClick={() => setShowEmojis(!showEmojis)}
              >
                <EmojiHappyIcon className="text-white hover:text-hotred h-[22px]" />
              </div>

              {/* <div className="icon">
                <CalendarIcon className="text-hotred h-[22px]" />
              </div> */}

              {/* {showEmojis && (
                <EmojiPicker
                  onEmojiSelect={addEmoji}
                  style={{
                    position: "absolute",
                    marginTop: "465px",
                    marginLeft: -40,
                    maxWidth: "320px",
                    borderRadius: "20px",
                  }}
                  theme="dark"
                />
              )} */}
            </div>
            <button
              className="bg-hotred text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-red-500 disabled:hover:bg-red-700 disabled:opacity-50 disabled:cursor-default"
              disabled={!input.trim() && !selectedFile}
              onClick={sendPost}
            >
              Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpaceInput;
