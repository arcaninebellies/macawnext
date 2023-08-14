"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Post from "../utils/Post";
import InfiniteScroll from "react-infinite-scroll-component";
import { PusherClient } from "@/pusher";

interface User {
  id: number;
  email: string;
  username: string;
  displayname: string;
  description: string;
  avatar: string;
  banner: string;
  posts: Post[];
}

interface Post {
  id: number;
  author: User;
  content: string;
  createdAt: string;
  isRepost: boolean;
  postCreatedAt: string;
  likes: Like[];
  reposts: Repost[];
}

interface Like {
  author: User;
  post: Post;
}

interface Repost {
  author: User;
  post: Post;
}

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]!);
  const [skip, setSkip] = useState(0);

  const getData = () => {
    if (session) {
      fetch(`/api/dashboard?skip=${skip}`)
        .then((res) => res.json())
        .then((data) => {
          setPosts([...posts.concat(data.posts)]);
          setSkip(skip + 1);
        });
    }
  };
  useEffect(() => {
    getData();
  }, [session]);

  useEffect(() => {
    if (session?.user?.email) {
      const channel = PusherClient.subscribe(`dashboard-${session.user.email}`);
      channel.bind("new message", (data) => {
        console.log("new!");
        const posts_ = posts;
        posts_.unshift(data.post);
        setPosts(posts_);
      });
    }
  }, [session]);
  return (
    <>
      {posts && (
        <>
          <InfiniteScroll
            dataLength={posts.length}
            next={getData}
            hasMore={true}
            loader={<div>Loading</div>}
          >
            {posts.map((post, i) => (
              <Post post={post} key={i} />
            ))}
          </InfiniteScroll>
        </>
      )}
    </>
  );
}
