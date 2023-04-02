"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import Avatar from "../Avatar";
import useComment from "@/hooks/useComment";
import axios from "axios";
import toast from "react-hot-toast";
import usePosts from "@/hooks/usePosts";
import usePost from "@/hooks/usePost";
import { VscEdit } from "react-icons/vsc";
import { AiOutlineDelete } from "react-icons/ai";
import useEditTweetModal from "@/hooks/useEditTweetModal";

interface CommentItemProps {
  commentData: Record<string, any>;
}

const CommentItem: React.FC<CommentItemProps> = ({ commentData = {} }) => {
  const postId = commentData.postId;
  const commentId = commentData.id;

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { mutate: mutatePosts } = usePosts();
  const { mutate: mutatePost } = usePost(postId as string);
  const { mutate: mutateComment } = useComment(postId, commentId);
  const [body, setBody] = useState("");
  const editTweetModal = useEditTweetModal();

  const goToUser = useCallback(
    (ev: any) => {
      ev.stopPropagation();

      router.push(`/users/${commentData.user.id}`);
    },
    [router, commentData.user.id]
  );

  const editComment = async (event) => {
    event.stopPropagation();
    editTweetModal.isComment = true;
    editTweetModal.postId = postId;
    editTweetModal.commentId = commentData.id;
    return editTweetModal.onOpen();
  };

  const deleteComment = async () => {
    try {
      const url = `/api/deleteComment?commentData=${JSON.stringify(
        commentData
      )}`;
      await axios.delete(url);
      toast.success("comment deleted");
      mutatePosts();
      mutatePost();
      mutateComment();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const createdAt = useMemo(() => {
    if (!commentData?.createdAt) {
      return null;
    }

    return formatDistanceToNowStrict(new Date(commentData.createdAt));
  }, [commentData.createdAt]);

  return (
    <div
      onClick={() => router.push(`/posts/${postId}/comments/${commentId}`)}
      className="
        border-b-[1px] 
        border-neutral-800 
        p-5 
        cursor-pointer 
        hover:bg-neutral-900 
        transition
      "
    >
      <div className="flex flex-row items-start gap-3">
        <Avatar userId={commentData.user.id} />
        <div>
          <div className="flex flex-row items-center gap-2">
            <p
              onClick={goToUser}
              className="
                text-white 
                font-semibold 
                cursor-pointer 
                hover:underline
            "
            >
              {commentData.user.name}
            </p>
            <span
              onClick={goToUser}
              className="
                text-neutral-500
                cursor-pointer
                hover:underline
                hidden
                md:block
            "
            >
              @{commentData.user.username}
            </span>
            <span className="text-neutral-500 text-sm">{createdAt}</span>
          </div>
          <div className="text-white mt-1">{commentData.body}</div>
          <div className="flex flex-row items-center mt-3 gap-10">
            <div
              onClick={editComment}
              className="
                flex 
                flex-row 
                items-center 
                text-neutral-500 
                gap-2 
                cursor-pointer 
                transition 
                hover:text-sky-500
            "
            >
              <VscEdit size={20} />
            </div>
            <div
              onClick={deleteComment}
              className="
                flex 
                flex-row 
                items-center 
                text-neutral-500 
                gap-2 
                cursor-pointer 
                transition 
                hover:text-red-500
            "
            >
              <AiOutlineDelete size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
