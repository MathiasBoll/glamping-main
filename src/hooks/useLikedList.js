// src/hooks/useLikedList.js

// Hook fra @uidotdev/usehooks bruges til at synkronisere state med localStorage,
// så "likedList" automatisk gemmes og hentes på tværs af sessions.
import { useLocalStorage } from "@uidotdev/usehooks";

// Nøglen vi gemmer listen af likede aktiviteter under i localStorage
const STORAGE_KEY = "likedList";

/*
  useLikedList()
  -----------------------------------------------------------
  Custom React Hook der håndterer hele "like"-systemet for
  aktiviteter i app’en.

  Hooket tilbyder:
    - likedList:   Selve listen af likede aktiviteter
    - isLiked():   Tjekker om en aktivitet allerede er liket
    - toggleLike(): Tilføjer eller fjerner en aktivitet fra listen

  Fordele:
    ✓ Logikken ligger ét sted.
    ✓ Kan bruges af alle komponenter uden dobbeltkode.
    ✓ Gemmer automatisk data i localStorage.
*/
export function useLikedList() {
  // useLocalStorage fungerer som useState — men gemmer værdien i localStorage
  const [likedList, setLikedList] = useLocalStorage(STORAGE_KEY, []);

  /*
    isLiked(id)
    ---------------------------------------------------------
    Returnerer true/false om aktiviteten allerede findes i listen.
    Bruges blandt andet til at farve hjerte-ikonet.
  */
  const isLiked = (id) => likedList.some((a) => a._id === id);

  /*
    toggleLike(activity)
    ---------------------------------------------------------
    Hvis aktiviteten findes → fjern den
    Hvis den ikke findes → tilføj den

    setLikedList updaterer både React state og localStorage.
  */
  const toggleLike = (activity) => {
    setLikedList((prev) => {
      const exists = prev.some((a) => a._id === activity._id);

      // Fjern aktivitet hvis den er i listen
      if (exists) {
        return prev.filter((a) => a._id !== activity._id);
      }

      // Ellers tilføj den
      return [...prev, activity];
    });
  };

  // Hooket returnerer funktionerne og listen
  return { likedList, isLiked, toggleLike };
}
