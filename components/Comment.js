import {
  ChartBarIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
} from "@heroicons/react/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import { postIdState } from "../atoms/CommentAtom";
import { db } from "../firebase";
import { userState } from "../atoms/userAtom";

function Comment({ comment, commentId, originalPostId }) {
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [postId, setPostId] = useRecoilState(postIdState);
  const router = useRouter();
  const [currentUser] = useRecoilState(userState);

  useEffect(() => {
    onSnapshot(
      collection(db, "posts", originalPostId, "comments", commentId, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db, originalPostId, commentId]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1);
  }, [likes]);

  async function likeComment() {
    if (hasLiked) {
      await deleteDoc(
        doc(
          db,
          "posts",
          originalPostId,
          "comments",
          commentId,
          "likes",
          currentUser?.uid
        )
      );
    } else {
      await setDoc(
        doc(
          db,
          "posts",
          originalPostId,
          "comments",
          commentId,
          "likes",
          currentUser?.uid
        ),
        {
          username: currentUser?.username,
          email: currentUser?.email,
        }
      );
    }
  }

  return (
    <div className="p-3 flex cursor-pointer border-b border-gray-700">
      <img
        src={comment?.userImage}
        alt=""
        className="h-11 w-11 rounded-full mr-4"
      />
      <div className="flex flex-col space-y-2 w-full">
        <div className="flex justify-between">
          <div className="">
            <div className="inline-block group">
              <h4 className="font-bold sm:text-base inline-block group-hover:underline">
                {comment?.username}
              </h4>
            </div>{" "}
            ·{" "}
            <span className="text-gray-400 text-sm">
              <Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
            </span>
            <p className=" mt-0.5 max-w-lg overflow-auto text-[15px] sm:text-base">
              {comment?.comment}
            </p>
          </div>
          <div className="icon group flex-shrink-0">
            <DotsHorizontalIcon className="h-5 group-hover:text-hotred" />
          </div>
        </div>

        <div className=" flex justify-between w-10/12">
          <div className="icon group">
            <ChatIcon className="h-5 group-hover:text-hotred" />
          </div>

          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              likeComment();
            }}
          >
            <div className="icon group-hover:bg-pink-600/10">
              {hasLiked ? (
                <HeartIconFilled className="h-5 text-pink-600" />
              ) : (
                <HeartIcon className="h-5 group-hover:text-pink-600" />
              )}
            </div>
            {likes.length > 0 && (
              <span
                className={`group-hover:text-pink-600 text-sm ${
                  hasLiked && "text-pink-600"
                }`}
              >
                {likes.length}
              </span>
            )}
          </div>

          <div className="icon group">
            <ShareIcon className="h-5 group-hover:text-hotred" />
          </div>
          <div className="icon group">
            <ChartBarIcon className="h-5 group-hover:text-hotred" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
