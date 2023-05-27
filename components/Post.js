import { Popover, Transition } from "@headlessui/react";
import {
  BookmarkIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
  SwitchHorizontalIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import {
  HeartIcon as HeartIconFilled,
  BookmarkIcon as BookmarkIconFilled,
} from "@heroicons/react/solid";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { Fragment, forwardRef, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import { CommentModalState, postIdState } from "../atoms/CommentAtom";
import { userState } from "../atoms/userAtom";
import { db } from "../firebase";

const Post = forwardRef(
  ({ id, post, postPage, username, userImg, question, img }, ref) => {
    const [open, setOpen] = useRecoilState(CommentModalState);
    const [postId, setPostId] = useRecoilState(postIdState);
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [liked, setLiked] = useState(false);
    const router = useRouter();
    const [currentUser] = useRecoilState(userState);
    const [saves, setSaves] = useState([]);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    const functionList = [
      {
        name: "Delete Post",
        icon: TrashIcon,
      },
    ];

    useEffect(() => {
      try {
        onSnapshot(
          query(
            collection(db, "posts", id, "comments"),
            orderBy("timestamp", "desc")
          ),
          (snapshot) => setComments(snapshot.docs)
        );
      } catch (error) {
        console.log(error);
      }
    }, [db, id]);

    useEffect(
      () =>
        onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
          setLikes(snapshot.docs)
        ),
      [db, id]
    );

    useEffect(
      () =>
        setLiked(
          likes.findIndex((like) => like.id === currentUser?.uid) !== -1
        ),
      [likes]
    );

    const likePost = async () => {
      if (liked) {
        await deleteDoc(doc(db, "posts", id, "likes", currentUser.uid));
      } else {
        await setDoc(doc(db, "posts", id, "likes", currentUser.uid), {
          username: currentUser.name,
          email: currentUser.email,
        });
      }
    };

    useEffect(
      () =>
        onSnapshot(collection(db, "posts", id, "saves"), (snapshot) =>
          setSaves(snapshot.docs)
        ),
      [db, id]
    );

    useEffect(
      () =>
        setSaved(
          saves.findIndex((save) => save.id === currentUser?.uid) !== -1
        ),
      [saves]
    );

    const savePost = async () => {
      if (loading) return;
      const savingToast = toast.loading("Saving...");
      setLoading(true);

      try {
        if (saved) {
          toast.success("Removed from Saved", {
            id: savingToast,
          });
          setLoading(false);

          await deleteDoc(doc(db, "users", currentUser?.uid, "saved", id));
          await deleteDoc(doc(db, "posts", id, "saves", currentUser.uid));
        } else {
          toast.success("Post Saved", {
            id: savingToast,
          });
          setLoading(false);

          await setDoc(doc(db, "users", currentUser?.uid, "saved", id), {
            id: post.id,
            username: post.username,
            question: post.question,
            userImg: post.profileImg,
            // img: post.image,
            question: post.question,
            timestamp: post.timestamp,
          });

          await setDoc(doc(db, "posts", id, "saves", currentUser.uid), {
            username: currentUser.name,
            email: currentUser.email,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <div
        className="p-3 flex cursor-pointer border-b border-gray-700 text-white hover:bg-[#080808] "
        onClick={() => router.push(`/post/${id}`)}
        ref={ref}
      >
        {!postPage && (
          <img
            src={userImg}
            alt=""
            className="h-11 w-11 rounded-full mr-4"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/profile/${username}`);
            }}
          />
        )}
        <div className="flex flex-col space-y-2 w-full">
          <div className={`flex ${!postPage && "justify-between"}`}>
            {postPage && (
              <img
                src={userImg}
                alt="Profile Pic"
                className="h-11 w-11 rounded-full mr-4"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/profile/${username}`);
                }}
              />
            )}
            <div className="">
              <div className="inline-block group">
                <h4
                  className={`font-bold text-[15px] sm:text-base ${
                    !postPage && "inline-block"
                  }`}
                >
                  {username}
                </h4>
              </div>{" "}
              ·{" "}
              <span className=" text-sm sm:text-[15px] text-gray-400">
                <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
              </span>
              {!postPage && (
                <p className=" text-[15px] sm:text-base mt-0.5">{question}</p>
              )}
            </div>
            <div className="icon group flex-shrink-0 ml-auto">
              {/* <DotsHorizontalIcon className="h-5" /> */}
              <Popover.Group className="hidden lg:flex lg:gap-x-12">
                <Popover className="relative">
                  <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                    <DotsHorizontalIcon
                      className="h-5 w-5 flex-none text-white group-hover:text-hotred"
                      aria-hidden="true"
                    />
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute -right-2  z-10 mt-3 w-[200px] overflow-hidden rounded-3xl bg-gray-500 shadow-lg ring-1 ring-gray-900/5">
                      <div className="p-4">
                        {functionList.map((item) => (
                          <div
                            key={item.name}
                            className=" relative flex items-center gap-x-4 rounded-lg text-sm  hover:bg-gray-800 "
                          >
                            <div className="flex flex-none group items-center justify-center rounded-lg  ">
                              <item.icon
                                className="h-6 w-6 text-white group-hover:text-red-700"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="flex-auto group-hover:text-red-700">
                              {item.name}
                              {/* <span className="absolute inset-0" /> */}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Popover.Panel>
                  </Transition>
                </Popover>
              </Popover.Group>
            </div>
          </div>
          {postPage && <p className="mt-0.5 text-xl">{question}</p>}
          <img
            src={img}
            alt=""
            className="rounded-2xl max-h-[700px] object-cover mr-2"
          />
          <div
            className={`flex justify-between w-10/12 ${postPage && "mx-auto"}`}
          >
            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => {
                // e.stopPropagation();
                setPostId(id);
                setOpen(true);
              }}
            >
              <div className="icon group-hover:bg-red-400 group-hover:bg-opacity-10 group-hover:text-hotred">
                <ChatIcon className="h-5 " />
              </div>
              {comments.length > 0 && (
                <span className=" text-sm">{comments.length}</span>
              )}
            </div>

            {currentUser?.uid === post?.id ? (
              <div
                className="flex items-center space-x-1 group"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteDoc(doc(db, "posts", id));
                  router.push("/");
                }}
              >
                <div className="icon group-hover:bg-red-600/10">
                  <TrashIcon className="h-5 group-hover:text-red-600" />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-1 group">
                <div className="icon group-hover:bg-green-500/10">
                  <SwitchHorizontalIcon className="h-5 group-hover:text-green-500" />
                </div>
              </div>
            )}

            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => {
                e.stopPropagation();
                likePost();
              }}
            >
              <div className="icon group-hover:bg-pink-600/10">
                {liked ? (
                  <HeartIconFilled className="h-5 text-pink-600" />
                ) : (
                  <HeartIcon className="h-5 group-hover:text-pink-600" />
                )}
              </div>
              {likes.length > 0 && (
                <span
                  className={`group-hover:text-pink-600 text-sm ${
                    liked && "text-pink-600"
                  }`}
                >
                  {likes.length}
                </span>
              )}
            </div>

            <div className="icon group">
              <ShareIcon className="h-5 group-hover:text-hotred" />
            </div>

            <div
              className="icon group"
              onClick={(e) => {
                e.stopPropagation();
                savePost();
              }}
            >
              <div className="icon">
                {saved ? (
                  <BookmarkIconFilled className="h-5" />
                ) : (
                  <BookmarkIcon className="h-5 group-hover:text-hotred" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default Post;
