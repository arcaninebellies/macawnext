"use client";

import { useEffect, useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { BellIcon } from "@heroicons/react/24/outline";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import { RiLogoutCircleLine, RiCompass3Line } from "react-icons/ri";
import { CameraIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsBookmark } from "react-icons/bs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
        setIsOpen(false);
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
              <div className="mt-4 p-4 hover:bg-slate-900 hover:rounded-xl">
                <Link href="/dashboard" className="flex flex-row  items-end">
                  <HomeIcon className="h-7 w-7" />
                  <p className="text-lg">Dashboard</p>
                </Link>
              </div>

              <div className="mt-4 p-4 hover:bg-slate-900 hover:rounded-xl">
                <Link href="/explore" className="flex flex-row  items-end">
                  <RiCompass3Line className="h-7 w-7" />
                  <p className="text-lg">Explore</p>
                </Link>
              </div>

              <div className="mt-4 p-4 hover:bg-slate-900 hover:rounded-xl">
                <Link
                  href={`/@${user.username}`}
                  className="flex flex-row items-end"
                >
                  <UserCircleIcon className="h-7 w-7" />
                  <p className="text-lg">Profile</p>
                </Link>
              </div>

              <div className="mt-4 p-4 hover:bg-slate-900 hover:rounded-xl">
                <Link href="/settings" className="flex flex-row items-end">
                  <Cog6ToothIcon className="h-7 w-7" />
                  <p className="text-lg">Settings</p>
                </Link>
              </div>

              <div
                className="mt-4 p-4 flex flex-row items-center cursor-pointer  hover:bg-slate-900 hover:rounded-xl"
                onClick={() => signOut()}
              >
                <RiLogoutCircleLine className="h-7 w-7" />
                <p className="text-lg">Sign Out</p>
              </div>

              <div className="mt-4 p-4 relative  hover:bg-slate-900 hover:rounded-xl">
                <Link href="/notifications" className="flex flex-row items-end">
                  <BellIcon className="h-7 w-7" />
                  {user._count.notifications > 0 && (
                    <div className="absolute -top-2 left-6 rounded-full bg-slate-700 px-2">
                      {user._count.notifications}
                    </div>
                  )}
                  <p className="text-lg">Notifications</p>
                </Link>
              </div>

              <div className="mt-4 p-4 hover:bg-slate-900 hover:rounded-xl">
                <Link href="/bookmarks" className="flex flex-row items-end">
                  <BsBookmark className="h-7 w-7" />
                  <p className="text-lg">Bookmarks</p>
                </Link>
              </div>

              <div className="mt-4 p-4 relative  hover:bg-slate-900 hover:rounded-xl">
                <Link href="/directs" className="flex flex-row items-end">
                  <ChatBubbleBottomCenterTextIcon className="h-7 w-7" />
                  <p className="text-lg">Directs</p>
                </Link>
              </div>
              <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
                <DialogTrigger className="w-full">
                  <div
                    className="mt-4 p-4 cursor-pointer flex flex-row  items-end  hover:bg-slate-900 hover:rounded-xl"
                    onClick={openModal}
                  >
                    <PencilSquareIcon className="h-7 w-7" />{" "}
                    <p className="text-lg">New Post</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-slate-950">
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
                    {post.replaceAll(" ", "").length === 0 ? (
                      <button
                        type="button"
                        className=" bg-slate-800/70 p-4 my-1 w-full m-4"
                        onClick={makePost}
                        disabled
                      >
                        Post
                      </button>
                    ) : (
                      <button
                        type="button"
                        className=" bg-slate-800 p-4 my-1 w-full m-4"
                        onClick={makePost}
                      >
                        Post
                      </button>
                    )}
                    {280 - post.length > 20 ? (
                      <p className="text-teal-400"> {280 - post.length}</p>
                    ) : (
                      <p className="text-rose-400"> {280 - post.length}</p>
                    )}
                    <label htmlFor="image">
                      <CameraIcon className="h-7 w-7" />
                    </label>
                    <input
                      type="file"
                      name="image"
                      id="image"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleImageChange}
                      className="hidden file:bg-gray-800 file:text-white file:border file:border-none w-full border border-gray-700 cursor-pointer bg-gray-50 dark:bg-gray-700"
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
                </DialogContent>
              </Dialog>
              <Link
                href={`/@${user.username}`}
                className="flex flex-row mt-4 p-4 "
              >
                <div className="flex justify-center flex-col">
                  <Image
                    src={`/avatars/${user.avatar}`}
                    alt="a"
                    height={30}
                    width={30}
                    className="rounded-full mr-1"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-bold text-lg">
                    {user.displayname ? user.displayname : user.username}
                  </p>
                  <p className="text-slate-500">@{user.username}</p>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-row inset-0 sticky md:hidden justify-center items-center bg-gray-950 w-full">
        {user && (
          <>
            <div>
              <Link href="/dashboard" className="flex flex-row  items-end">
                <HomeIcon className="h-7 w-7" />
              </Link>
            </div>

            <div>
              <Link
                href={`/@${user.username}`}
                className="flex flex-row items-end"
              >
                <UserCircleIcon className="h-7 w-7" />
              </Link>
            </div>

            <div>
              <Link href="/settings" className="flex flex-row items-end">
                <Cog6ToothIcon className="h-7 w-7" />
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
                <BellIcon className="h-7 w-7" />
                {user._count.notifications > 0 && (
                  <div className="absolute -top-2 left-6 rounded-full bg-slate-700 px-2">
                    {user._count.notifications}
                  </div>
                )}
              </Link>
            </div>

            <div>
              <Link href="/directs" className="flex flex-row items-end">
                <ChatBubbleBottomCenterTextIcon className="h-7 w-7" />
              </Link>
            </div>

            <div onClick={openModal}>
              <PencilSquareIcon className="h-7 w-7" />{" "}
            </div>
          </>
        )}
      </div>
    </>
  );
}
