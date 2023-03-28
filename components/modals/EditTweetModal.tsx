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

const EditTweetModal = () => {
  const postId = useEditTweetModal().postId;
  const commentId = useEditTweetModal().commentId;
  const isComment = useEditTweetModal().isComment;
  const { data: currentPostData } = usePost(postId);
  const { data: currentCommentData } = useComment(postId, commentId);
  const editTweetModal = useEditTweetModal();
  const { mutate: mutatePost } = usePost(postId);
  const { mutate: mutatePosts } = usePosts();
  const { mutate: mutateComment } = useComment(postId, commentId);

  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    !isComment
      ? setContent(currentPostData?.body)
      : setContent(currentCommentData?.body);
  }, [currentCommentData?.body, currentPostData?.body, isComment]);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = !isComment ? "/api/updatePost" : "/api/updateComment";

      await axios.patch(url, {
        content,
        currentPostData,
        currentCommentData,
      });

      !isComment
        ? toast.success("post updated!")
        : toast.success("comment updated!");
      mutatePost();
      mutatePosts();
      mutateComment();
      editTweetModal.onClose();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [
    content,
    currentCommentData,
    currentPostData,
    editTweetModal,
    isComment,
    mutateComment,
    mutatePost,
    mutatePosts,
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
      title="Edit Tweet"
      actionLabel="Edit"
      onClose={editTweetModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
};

export default EditTweetModal;
