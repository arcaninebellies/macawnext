"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { BellIcon } from "@heroicons/react/24/outline";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import { CameraIcon } from "@heroicons/react/24/solid";
import { FaRegCompass } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  id: number;
  username: string;
  avatar: string;
  displayname: string;
  _count: {
    notifications: number;
  };
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [preview, setPreview] = useState("");
  const [image, setImage] = useState("");
  const { data: session } = useSession();
  const [post, setPost] = useState("");
  const notify = () => toast.success("Post made!", { theme: "dark" });

  useEffect(() => {
    if (session) {
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => {
          setUser(data.user);
        });
    }
  }, [session]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleImageChange = (e) => {
    setPreview(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 280) {
      e.preventDefault();
      setPost(post.slice(0, 280));
      return false;
    }
    setPost(e.target.value);
  };

  const makePost = async () => {
    const form = new FormData();
    if (image) form.append("image", image);
    form.append("post", post);
    setIsOpen(false);
    fetch("/api/post", {
      method: "POST",
      body: form,
    })
      .then((res) => res.json())
      .then((data) => {
        setPost("");
        notify();
      });
  };

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className="inset-0 flex flex-col p-4 sticky h-screen hidden lg:block">
        {user && (
          <>
            <div>
              <div className="mt-10">
                <Link href="/dashboard" className="flex flex-row  items-end">
                  <HomeIcon className="h-10 w-10" />
                  <p className="text-xl">Home</p>
                </Link>
              </div>

              <div className="mt-10">
                <Link href="/explore" className="flex flex-row  items-end">
                  <FaRegCompass className="h-10 w-10" />
                  <p className="text-xl">Explore</p>
                </Link>
              </div>

              <div className="mt-10">
                <Link
                  href={`/@${user.username}`}
                  className="flex flex-row items-end"
                >
                  <UserCircleIcon className="h-10 w-10" />
                  <p className="text-xl">Profile</p>
                </Link>
              </div>

              <div className="mt-10">
                <Link href="/settings" className="flex flex-row items-end">
                  <Cog6ToothIcon className="h-10 w-10" />
                  <p className="text-xl">Settings</p>
                </Link>
              </div>

              <div className="mt-10 relative">
                <Link href="/notifications" className="flex flex-row items-end">
                  <BellIcon className="h-10 w-10" />
                  {user._count.notifications > 0 && (
                    <div className="absolute -top-2 left-6 rounded-full bg-slate-700 px-2">
                      {user._count.notifications}
                    </div>
                  )}
                  <p className="text-xl">Notifications</p>
                </Link>
              </div>

              <div className="mt-10 relative">
                <Link href="/directs" className="flex flex-row items-end">
                  <ChatBubbleBottomCenterTextIcon className="h-10 w-10" />

                  <p className="text-xl">Directs</p>
                </Link>
              </div>

              <div
                className="mt-10 cursor-pointer flex flex-row  items-end"
                onClick={openModal}
              >
                <PencilSquareIcon className="h-10 w-10" />{" "}
                <p className="text-xl">New Post</p>
              </div>
            </div>
            <Link href={`/@${user.username}`} className="flex flex-row mt-10">
              <div className="flex justify-center flex-col">
                <Image
                  src={`/avatars/${user.avatar}`}
                  alt="a"
                  height={40}
                  width={40}
                  className="rounded-full mr-1"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-bold">
                  {user.displayname ? user.displayname : user.username}
                </p>
                <p className="text-slate-500">@{user.username}</p>
              </div>
            </Link>
          </>
        )}
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="flex bg-slate-950  text-white justify-center items-center flex-col h-full w-full max-w-md transform overflow-hidden rounded-2xl  p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-medium leading-6"
                    >
                      New Post
                    </Dialog.Title>
                    <div className="mt-2 w-full">
                      <textarea
                        id="content"
                        name="content"
                        rows={4}
                        value={post}
                        onChange={handleChange}
                        placeholder="What is happening?"
                        className="resize-none w-full border-none focus:border-none bg-slate-800 text-white outline-none focus:outline-none focus:ring-0"
                      />
                    </div>

                    <div className="mt-4 flex flex-col w-full justify-center items-center">
                      <button
                        type="button"
                        className=" bg-slate-800 p-4 my-1 w-full m-4"
                        onClick={makePost}
                      >
                        Post
                      </button>
                      {280 - post.length > 20 ? (
                        <p className="text-teal-400"> {280 - post.length}</p>
                      ) : (
                        <p className="text-rose-400"> {280 - post.length}</p>
                      )}
                      <label htmlFor="image">
                        <CameraIcon className="h-10 w-10" />
                      </label>
                      <input
                        type="file"
                        name="image"
                        id="image"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleImageChange}
                        className="hidden file:bg-gray-800 file:text-white file:border file:border-none block w-full border border-gray-700 cursor-pointer bg-gray-50 dark:bg-gray-700"
                      />
                      {preview && (
                        <Image
                          src={preview}
                          alt={"lol"}
                          height={100}
                          width={100}
                        />
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
      <div className="flex flex-row inset-0 sticky md:hidden justify-center items-center bg-gray-950 w-full">
        {user && (
          <>
            <div>
              <Link href="/dashboard" className="flex flex-row  items-end">
                <HomeIcon className="h-10 w-10" />
              </Link>
            </div>

            <div>
              <Link
                href={`/@${user.username}`}
                className="flex flex-row items-end"
              >
                <UserCircleIcon className="h-10 w-10" />
              </Link>
            </div>

            <div>
              <Link href="/settings" className="flex flex-row items-end">
                <Cog6ToothIcon className="h-10 w-10" />
              </Link>
            </div>

            <Link href={`/@${user.username}`} className="flex flex-row">
              <div className="flex justify-center flex-col">
                <Image
                  src={`/avatars/${user.avatar}`}
                  alt="a"
                  height={60}
                  width={60}
                  className="rounded-full mr-1"
                />
              </div>
            </Link>

            <div>
              <Link href="/notifications" className="flex flex-row items-end">
                <BellIcon className="h-10 w-10" />
                {user._count.notifications > 0 && (
                  <div className="absolute -top-2 left-6 rounded-full bg-slate-700 px-2">
                    {user._count.notifications}
                  </div>
                )}
              </Link>
            </div>

            <div>
              <Link href="/directs" className="flex flex-row items-end">
                <ChatBubbleBottomCenterTextIcon className="h-10 w-10" />
              </Link>
            </div>

            <div onClick={openModal}>
              <PencilSquareIcon className="h-10 w-10" />{" "}
            </div>
          </>
        )}
      </div>
    </>
  );
}
