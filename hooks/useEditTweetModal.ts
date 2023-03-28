import { create } from 'zustand';

interface EditTweetModalStore {
  isComment: boolean;
  postId: string;
  commentId: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useEditTweetModal = create<EditTweetModalStore>((set) => ({
  isComment: false,
  postId: "",
  commentId: "",
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useEditTweetModal;
