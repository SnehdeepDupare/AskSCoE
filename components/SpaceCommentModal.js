import { Dialog, Transition } from "@headlessui/react";
import {
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import { userState } from "../atoms/userAtom";
import { spacePostIdState } from "../atoms/SpacePostAtom";
import { SpaceCommentModalState } from "../atoms/SpaceAtom";
import { db } from "../firebase";

function SpaceCommentModal() {
  const [open, setOpen] = useRecoilState(SpaceCommentModalState);
  const [postId, setPostId] = useRecoilState(spacePostIdState);
  const [post, setPost] = useState();
  const [comment, setComment] = useState("");
  const router = useRouter();
  const [currentUser] = useRecoilState(userState);
  const { title } = router.query;

  useEffect(
    () =>
      onSnapshot(doc(db, "spaces", title, "posts", postId), (snapshot) => {
        setPost(snapshot.data());
      }),
    [db]
  );

  const sendComment = async (e) => {
    e.preventDefault();
    const commentToast = toast.loading("Posting Reply...");

    await addDoc(collection(db, "posts", postId, "comments"), {
      comment: comment,
      username: currentUser.username,
      userImage: currentUser.userImg,
      timestamp: serverTimestamp(),
    });

    toast.success("Reply Sent Successfully!", {
      id: commentToast,
    });
    setOpen(false);
    setComment("");

    router.push(`/spaces/post/${postId}`);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-50 inset-0 pt-8" onClose={setOpen}>
        <div className="flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full bg-black text-white ">
              <div className="flex items-center px-1.5 py-2 border-b border-gray-700">
                <div
                  className="hover:bg-[#1b1b1b] rounded-full w-9 h-9 flex items-center justify-center xl:px-0"
                  onClick={() => setOpen(false)}
                >
                  <XIcon className="h-[22px]  cursor-pointer" />
                </div>
              </div>
              <div className="flex px-4 pt-5 pb-2.5 sm:px-6">
                <div className="w-full">
                  <div className=" flex gap-x-3 relative">
                    <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-400" />
                    <img
                      src={post?.profileImg}
                      alt=""
                      className="h-11 w-11 rounded-full"
                    />
                    <div>
                      <div className="inline-block group">
                        <h4 className="font-bold  inline-block text-[15px] sm:text-base">
                          {post?.username}
                        </h4>
                      </div>{" "}
                      ·{" "}
                      <span className=" text-sm sm:text-[15px]">
                        <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
                      </span>
                      <p className=" text-[15px] sm:text-base">
                        {post?.question}
                      </p>
                      <img
                        src={post?.image}
                        className="rounded-2xl object-cover mt-2 max-h-[250px]"
                      />
                    </div>
                  </div>

                  <div className="mt-7 flex space-x-3 w-full">
                    <img
                      src={currentUser?.userImg}
                      alt=""
                      className="h-11 w-11 rounded-full"
                    />
                    <div className="flex-grow mt-2">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Reply..."
                        rows="2"
                        className="bg-transparent border outline-none p-2 rounded-2xl text-lg placeholder-gray-500 tracking-wide w-full min-h-[80px]"
                      />

                      <div className="flex items-center justify-between pt-2.5">
                        <div className="flex items-center">
                          <div className="icon">
                            <PhotographIcon className="text-white h-[22px]" />
                          </div>

                          <div
                            className="icon"
                            // onClick={() => setShowEmojis(!showEmojis)}
                          >
                            <EmojiHappyIcon className="text-white h-[22px]" />
                          </div>
                          {/* {showEmojis && (
                            <EmojiPicker
                              onEmojiSelect={addEmoji}
                              theme="dark"
                            />
                          )} */}
                        </div>
                        <button
                          className="bg-hotred text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-red-500 disabled:hover:bg-red-800 disabled:opacity-50 disabled:cursor-default"
                          type="submit"
                          disabled={!comment.trim()}
                          onClick={sendComment}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default SpaceCommentModal;
