"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SessionUser } from "@/types/user";
import { deletePost, getOrganizationPosts, getUserPosts } from "@/data/post";
import { PostDialog } from "./create-post";
import { RotatingLines } from "react-loader-spinner";
import { FeedPostType } from "@/types/post";
import { Post } from "./post";


export function PostFeed({ user,showCreateOption,showOnlyUsers }: { user: SessionUser,showCreateOption:boolean,showOnlyUsers?:boolean }) {
  const [posts, setPosts] = useState<FeedPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        // const data = await getOrganizationPosts(user,page);
        let data;
        if(showOnlyUsers){
          data = await getUserPosts(user,page)
        }else{
          data = await getOrganizationPosts(user,page);
          if(data && data.error){
            setError(data.error)
            return
          }
        }

        
        const fetchedPosts = data.posts;
        //setPosts(prevPosts=>[...prevPosts,...fetchedPosts as any]);
        setPosts((prevPosts) => {
          const newPosts = [...prevPosts, ...fetchedPosts as any];
          // Remove duplicate posts by checking the ID
          return Array.from(new Set(newPosts.map(post => post.id))).map(id => newPosts.find(post => post.id === id));
        });


        if(fetchedPosts && fetchedPosts.length<20){
          setShowMore(false);
        }else{
          setShowMore(true)
        }
      } catch (err) {
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [page]);



  const observer = useRef<IntersectionObserver | null>(null);// Intersection Observer to observe the last element

  const lastPostRef=useCallback((node: HTMLDivElement | null)=>{
    if(loading) return;
 // If int. Observer exists of old last element, then remove it
    if(observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting && showMore){
        setPage(prevPage=>prevPage+1);
      }
    })
    if (node  && observer.current) observer.current.observe(node);

  },[loading,showMore])



  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter((post) => post.id !== postId));
      return true;
    } catch (err) {
      console.error("Failed to delete post:", err);
      throw err;
    }
  };

  return (
    <div className="">
      {showCreateOption && <PostDialog posts={posts} setPosts={setPosts}>
        <div className="mt-1 py-3 text-center cursor-pointer bg-slate-400 hover:bg-slate-500 transition-colors rounded-lg text-white font-semibold">
          Create a New Post{" "}
        </div>
      </PostDialog>}

        <div className="max-w-2xl mx-auto mt-8 space-y-6 flex flex-col">
          {posts && posts.length !== 0 ? (
            posts.map((post,index) =>{ 
              if(posts.length === index+1){

                return <Post
                ref={lastPostRef}
                key={post.id}
                post={post}
                user={user}
                posts={posts}
                setPosts={setPosts}
                handleDelete={handleDelete}
              />
              }

              return <Post
                key={post.id}
                post={post}
                user={user}
                posts={posts}
                setPosts={setPosts}
                handleDelete={handleDelete}
              />
            })
          ) : (
            !loading && <p className="text-center text-sm text-gray-400">
              No Posts to Display
            </p>
          )}

          
          {loading && (
            <div className=" flex justify-center h-10 ">
              <RotatingLines strokeColor="gray" visible={true} />
            </div>
          )}
          {posts && posts.length !== 0 && !showMore && (
            <p className="text-sm text-gray-500 text-center">No More Entries</p>
          )}
        </div>
   
        {error && <div className="text-red-500 text-center py-2">{error}</div>}

    </div>
  );
}
