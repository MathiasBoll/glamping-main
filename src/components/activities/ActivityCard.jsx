// ==========================================================================
// src/components/activities/ActivityCard.jsx
// --------------------------------------------------------------------------
// Dette kort viser én enkelt aktivitet på aktivitetslisten.
// Kortet indeholder:
//  - Titel + billede
//  - Dato og klokkeslæt
//  - “Se aktivitet”-knap (navigerer til single page)
//  - “Læs mere” toggle, der viser/skjuler aktivitetsbeskrivelsen
//  - Like-knap, der bruger et custom hook (useLikedList)
// 
// Kortet bruges både på aktivitetsoversigten og på “Min liste”-siden.
// ==========================================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./activities.module.css";

// Custom hook der indeholder hele like-logikken med useLocalStorage
import { useLikedList } from "../../hooks/useLikedList";

const ActivityCard = ({ activity, onToggleLike }) => {
  const navigate = useNavigate();

  // Styrer om beskrivelsen er synlig (Læs mere-knap)
  const [showMore, setShowMore] = useState(false);

  // Custom hook der håndterer liked-listen via useLocalStorage
  const { likedList, isLiked, toggleLike } = useLikedList();

  // Tjekker om netop denne aktivitet allerede er liket
  const liked = isLiked(activity._id);

  // ------------------------------------------------------------------------
  // Håndterer klik på hjerte-knappen
  // Opdaterer localStorage og kalder evt. callback fra LikedActivities.jsx
  // ------------------------------------------------------------------------
  const handleLikeClick = () => {
    toggleLike(activity); // global update via hook

    // Hvis en parent-komponent ønsker at blive informeret om ændringer
    if (typeof onToggleLike === "function") {
      const next = liked
        ? likedList.filter((a) => a._id !== activity._id)
        : [...likedList, activity];

      onToggleLike(next);
    }
  };

  // Viser/skjuler aktivitetsbeskrivelsen
  const handleReadmore = () => {
    setShowMore((prev) => !prev);
  };

  // ------------------------------------------------------------------------
  // JSX — aktivitetskortet
  // Layout styres i activities.module.css
  // ------------------------------------------------------------------------
  return (
    <div className={styles.activityCard}>
      
      {/* Titel i beige top-bjælke */}
      <div className={styles.activityTitle}>{activity.title}</div>

      {/* Aktivitetens billede */}
      <img
        src={activity.image}
        alt={activity.title}
        className={styles.activityImg}
      />

      {/* Nederste blå infoboks */}
      <div className={styles.activityInfo}>
        <p className={styles.activityDay}>{activity.date}</p>
        <p className={styles.activityTime}>kl. {activity.time}</p>

        {/* Link til single page view */}
        <button
          className={styles.singlePageOpen}
          onClick={() => navigate(`/activity/${activity._id}`)}
        >
          Se Aktivitet
        </button>

        {/* “Læs mere” toggle – åbner/lukker beskrivelsen */}
        <button className={styles.activityReadmore} onClick={handleReadmore}>
          {showMore ? "Læs mindre" : "Læs mere"}
        </button>

        {/* Beskrivelse – vises kun når showMore === true */}
        <p
          className={`${styles.activityReadmoreText} ${
            showMore ? styles.activityReadmoreTextShow : ""
          }`}
        >
          {activity.description}
        </p>
      </div>

      {/* Like-knap (hjerte) i højre hjørne af titelfeltet */}
      <button
        className={`${styles.likeBtn} ${liked ? styles.liked : ""}`}
        onClick={handleLikeClick}
        aria-label={
          liked
            ? "Fjern aktivitet fra din liste"
            : "Tilføj aktivitet til din liste"
        }
      >
        {/* Hjerteikon som SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          width="100%"
          height="100%"
        >
          <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
        </svg>
      </button>
    </div>
  );
};

export default ActivityCard;
