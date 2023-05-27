import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useRef, useState } from "react";
import { SpaceModalState } from "../atoms/CreateSpaceAtom";
import { useRecoilState } from "recoil";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { userState } from "../atoms/userAtom";
import { toast } from "react-hot-toast";

function CreateSpaceModal() {
  const [SpaceModalOpen, setSpaceModal] = useRecoilState(SpaceModalState);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const [loading, setLoading] = useState(false);

  const createSpace = async () => {
    if (loading) return;
    const creatingSpaceToast = toast.loading("Creating New Space...");
    setLoading(true);

    const d = doc(db, "spaces", title);
    const docRef = await getDoc(d);
    if (docRef.exists()) {
      console.log("doc already exists");
    } else {
      await setDoc(doc(db, "spaces", title), {
        ownerId: currentUser.uid,
        ownerName: currentUser.username,
        title: title,
        description: description,
        createdAt: serverTimestamp(),
      });
    }

    toast.success("New Space Created!", {
      id: creatingSpaceToast,
    });

    setLoading(false);
    setTitle("");
    setDescription("");
    setSpaceModal(false);
  };

  return (
    <Transition.Root show={SpaceModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setSpaceModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
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
                <div className="flex items-center px-5 py-3 border-b border-gray-700">
                  <span className="text-lg">Create New Space</span>
                </div>

                <div className="p-5 flex flex-col gap-y-4">
                  <input
                    className="bg-transparent outline-none border-b border-gray-700 w-full p-2 text-lg"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <textarea
                    className="w-full bg-transparent outline-none border-b border-gray-700 p-2 text-lg overflow-y-auto scrollbar-thin scrollbar-thumb-[#353535]"
                    placeholder="Enter short description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="bg-black px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-hotred px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-0 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-red-700"
                    disabled={!title.trim() && !description.trim()}
                    onClick={createSpace}
                  >
                    Create!
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-black px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-[#1b1b1b] focus:outline-none focus:ring-0 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setSpaceModal(false);
                      setTitle("");
                      setDescription("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default CreateSpaceModal;
