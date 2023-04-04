
import useSWR from 'swr';

import fetcher from '@/libs/fetcher';

const useComment = (postId: string, commentId: string) => {
  const { data, error, isLoading, mutate } = useSWR(postId ? `/api/posts/${postId}/comments/${commentId}` : null, fetcher);

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useComment;








