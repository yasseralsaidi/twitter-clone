"use client";

import { signIn } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import usePost from "@/hooks/usePost";
import Input from "../Input";
import Modal from "../Modal";
import useEditTweetModal from "@/hooks/useEditTweetModal";
import axios from "axios";
import usePosts from "@/hooks/usePosts";
import useComment from "@/hooks/useComment";
import useCurrentUser from "@/hooks/useCurrentUser";
import useComments from "@/hooks/useComments";
import { usePathname } from "next/navigation";

export default function EditTweetModal() {
  // const path = usePathname();
  // const postId = path?.split("/")[2] as string;
  // const commentId = path?.split("/")[4] as string;

  const postId = useEditTweetModal().postId;
  const commentId = useEditTweetModal().commentId;
  const isComment = useEditTweetModal().isComment;

  const { data: currentUser } = useCurrentUser();
  const { data: postData } = usePost(postId);
  const { data: commentData } = useComment(postId, commentId);
  const editTweetModal = useEditTweetModal();
  const { mutate: mutatePosts } = usePosts();
  const { mutate: mutatePost } = usePost(postId);
  const { mutate: mutateComments } = useComments();
  const { mutate: mutateComment } = useComment(postId, commentId);

  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    !isComment ? setContent(postData?.body) : setContent(commentData?.body);
  }, [commentData?.body, isComment, postData?.body]);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = !isComment
        ? `/api/posts/${postId}`
        : `/api/posts/${postId}/comments/${commentId}`;

      await axios.patch(url, {
        content,
        postData,
        commentData,
      });

      !isComment
        ? toast.success("post updated!")
        : toast.success("comment updated!");

      mutatePosts();
      mutatePost();
      mutateComments();
      mutateComment();
      editTweetModal.onClose();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [
    commentData,
    commentId,
    content,
    editTweetModal,
    isComment,
    mutateComment,
    mutateComments,
    mutatePost,
    mutatePosts,
    postData,
    postId,
  ]);

  const onToggle = useCallback(() => {
    editTweetModal.onClose();
  }, [editTweetModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        type="textarea"
        placeholder="Content"
        onChange={(e) => setContent(e.target.value)}
        value={content}
        disabled={isLoading}
      />
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={editTweetModal.isOpen}
      title={!isComment ? "Edit Post" : "Edit Comment"}
      actionLabel="Edit"
      onClose={editTweetModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
}
