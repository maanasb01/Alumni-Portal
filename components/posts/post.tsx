import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Badge } from "../ui/badge";

import Image from "next/image";
import { PostDialog } from "./create-post";

import { FeedPostType } from "@/types/post";
import { SessionUser } from "@/types/user";
import {
  Dispatch,
  forwardRef,
  LegacyRef,
  RefAttributes,
  SetStateAction,
} from "react";
import { ConfirmationDialog } from "../confirmation-dialog";

const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

export const Post = forwardRef(
  (
    {
      post,
      user,
      posts,
      setPosts,
      handleDelete,
    }: {
      post: FeedPostType;
      user: SessionUser;
      posts: FeedPostType[];
      setPosts: Dispatch<SetStateAction<FeedPostType[]>>;
      handleDelete: (id: string) => void;
    },
    ref: LegacyRef<HTMLDivElement> | undefined
  ) => {
    return (
      <div ref={ref} className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {post.author.image ? (
              <Image
                src={post.author.image}
                alt={post.author.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="flex items-center justify-center rounded-full bg-gray-200 h-10 w-10">
                <span className="text-gray-700 font-semibold">
                  {post.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold">{post.author.name}</h2>
              <p className="text-sm text-gray-500">{post.organization.name}</p>
            </div>
          </div>
          {post.authorId === user.id && (
            <div className="flex space-x-2">
              <PostDialog post={post} posts={posts} setPosts={setPosts}>
                <button className="text-gray-500 hover:text-gray-700">
                  <FiEdit size={20} />
                </button>
              </PostDialog>

              <ConfirmationDialog actionFunction={() => handleDelete(post.id)} message="Are you sure you want to delete the post?">
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    
                  >
                    <FiTrash2 size={20} />
                  </button>
              </ConfirmationDialog>
            </div>
          )}
        </div>
        <div className="mt-4">
          {post.type !== "Regular" && (
            <Badge
              className={`inline-block text-xs px-2 py-1 rounded-full ${
                post.type === "Announcement"
                  ? "bg-blue-100 hover:bg-blue-100 text-blue-800"
                  : "bg-red-100 hover:bg-red-100 text-red-800"
              }`}
            >
              {post.type}
            </Badge>
          )}
          <p className="mt-2 text-gray-800">{post.description}</p>
          <div className="mt-2 text-gray-500 text-xs">
            <span>{`Posted on ${formatDate(post.createdAt)}`}</span>
            {post.createdAt < post.updatedAt && (
              <span className="ml-2">
                (edited on {formatDate(post.updatedAt)})
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);
