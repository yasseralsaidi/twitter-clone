

import useSWR from 'swr';

import fetcher from '@/libs/fetcher';

const useComments = (userId?: string, postId?: string) => {
  const url = userId ? `/api/posts?userId=${userId}` : `/api/posts/${postId}/comments`;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useComments;
