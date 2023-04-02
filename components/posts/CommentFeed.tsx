"use client";

import CommentItem from "./CommentItem";

interface CommentFeedProps {
  comments?: Record<string, any>[];
}

const CommentFeed: React.FC<CommentFeedProps> = ({ comments = [] }) => {
  return (
    <>
      {comments.map((comment: Record<string, any>) => (
        <CommentItem key={comment.id} commentData={comment} />
      ))}
    </>
  );
};

export default CommentFeed;
