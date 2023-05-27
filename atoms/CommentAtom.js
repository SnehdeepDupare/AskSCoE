import { atom } from "recoil";

export const CommentModalState = atom({
  key: "CommentModalState",
  default: false,
});

export const postIdState = atom({
  key: "postIdState",
  default: " ",
});
