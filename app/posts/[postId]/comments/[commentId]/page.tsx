"use client";

import { ClipLoader } from "react-spinners";

import usePost from "@/hooks/usePost";

import Header from "@/components/Header";
import Form from "@/components/Form";
import PostItem from "@/components/posts/PostItem";
import CommentFeed from "@/components/posts/CommentFeed";
import useComment from "@/hooks/useComment";
import CommentItem from "@/components/posts/CommentItem";

const CommentView = ({ params }) => {
  const postId = params?.postId;
  const commentId = params?.commentId;

  const { data: fetchedComment, isLoading } = useComment(
    postId as string,
    commentId as string
  );

  if (isLoading || !fetchedComment) {
    return (
      <div className="flex justify-center items-center h-full">
        <ClipLoader color="lightblue" size={80} />
      </div>
    );
  }

  return (
    <>
      <Header showBackArrow label="Tweet" />
      <CommentFeed comments={fetchedComment} />
    </>
  );
};

export default CommentView;
