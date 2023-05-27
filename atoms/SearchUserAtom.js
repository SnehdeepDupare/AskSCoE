import { atom } from "recoil";
export const SearchUserState = atom({
  key: "searchUserState", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});