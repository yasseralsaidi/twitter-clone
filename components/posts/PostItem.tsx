import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineDelete,
} from "react-icons/ai";
import { VscEdit } from "react-icons/vsc";
import { formatDistanceToNowStrict } from "date-fns";
import useLoginModal from "@/hooks/useLoginModal";
import useCurrentUser from "@/hooks/useCurrentUser";
import useLike from "@/hooks/useLike";
import Avatar from "../Avatar";
import axios from "axios";
import toast from "react-hot-toast";
import usePosts from "@/hooks/usePosts";
import usePost from "@/hooks/usePost";

interface PostItemProps {
  postData: Record<string, any>;
  userId?: string;
}

const PostItem: React.FC<PostItemProps> = ({ postData = {}, userId }) => {
  const postId = postData.id;
  const router = useRouter();
  const { mutate: mutatePosts } = usePosts();
  const { mutate: mutatePost } = usePost(postId as string);
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const { data: currentUser } = useCurrentUser();
  const { hasLiked, toggleLike } = useLike({ postId: postId, userId });

  const editPost = async (event) => {
    event.stopPropagation();
    alert("edit post");
  };

  const deletePost = async (event) => {
    event.stopPropagation();
    try {
      const url = `/api/deletePost?postData=${JSON.stringify(postData)}`;
      await axios.delete(url);
      toast.success("post deleted");
      mutatePosts();
      mutatePost();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const goToUser = useCallback(
    (event) => {
      event.stopPropagation();
      router.push(`/users/${postData.user.id}`);
    },
    [router, postData.user.id]
  );

  const goToPost = useCallback(() => {
    router.push(`/posts/${postData.id}`);
  }, [router, postData.id]);

  const onLike = useCallback(
    async (event) => {
      event.stopPropagation();

      if (!currentUser) {
        return loginModal.onOpen();
      }

      toggleLike();
    },
    [loginModal, currentUser, toggleLike]
  );

  const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;

  const createdAt = useMemo(() => {
    if (!postData?.createdAt) {
      return null;
    }

    return formatDistanceToNowStrict(new Date(postData.createdAt));
  }, [postData.createdAt]);

  return (
    <div
      onClick={goToPost}
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
        <Avatar userId={postData.user.id} />
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
              {postData.user.name}
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
              @{postData.user.username}
            </span>
            <span className="text-neutral-500 text-sm">{createdAt}</span>
          </div>
          <div className="text-white mt-1">{postData.body}</div>

          <div className="flex flex-row items-center mt-3 gap-10">
            <div
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
              <AiOutlineMessage size={20} />
              <p>{postData.comments?.length || 0}</p>
            </div>

            <div
              onClick={onLike}
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
              <LikeIcon color={hasLiked ? "red" : ""} size={20} />
              <p>{postData.likedIds.length}</p>
            </div>

            <div
              onClick={editPost}
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
              onClick={deletePost}
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

export default PostItem;

export const stopEventPropagationTry = (event) => {
  if (event.target === event.currentTarget) {
    event.stopPropagation();
  }
};
