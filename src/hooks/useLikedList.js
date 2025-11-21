// src/hooks/useLikedList.js
import { useLocalStorage } from "@uidotdev/usehooks";

const STORAGE_KEY = "likedList";

export function useLikedList() {
  const [likedList, setLikedList] = useLocalStorage(STORAGE_KEY, []);

  const isLiked = (id) => likedList.some((a) => a._id === id);

  const toggleLike = (activity) => {
    setLikedList((prev) => {
      const exists = prev.some((a) => a._id === activity._id);
      if (exists) {
        return prev.filter((a) => a._id !== activity._id);
      }
      return [...prev, activity];
    });
  };

  return { likedList, isLiked, toggleLike };
}
