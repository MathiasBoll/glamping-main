// src/components/activities/ActivityCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./activities.module.css";
import { useLikedList } from "../../hooks/useLikedList";

const ActivityCard = ({ activity, onToggleLike }) => {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  // global liked-liste via useLocalStorage-hook
  const { likedList, isLiked, toggleLike } = useLikedList();
  const liked = isLiked(activity._id);

  const handleLikeClick = () => {
    // opdater localStorage via hook
    toggleLike(activity);

    // giv besked til forælder (LikedActivities) om ny liste
    if (typeof onToggleLike === "function") {
      const next = liked
        ? likedList.filter((a) => a._id !== activity._id)
        : [...likedList, activity];
      onToggleLike(next);
    }
  };

  const handleReadmore = () => {
    setShowMore((prev) => !prev);
  };

  return (
    <div className={styles.activityCard}>
      <div className={styles.activityTitle}>{activity.title}</div>

      <img
        src={activity.image}
        alt={activity.title}
        className={styles.activityImg}
      />

      <div className={styles.activityInfo}>
        <p className={styles.activityDay}>{activity.date}</p>
        <p className={styles.activityTime}>kl. {activity.time}</p>

        {/* Se aktivitet (single-view) */}
        <button
          className={styles.singlePageOpen}
          onClick={() => navigate(`/activity/${activity._id}`)}
        >
          Se Aktivitet
        </button>

        {/* Læs mere toggle */}
        <button className={styles.activityReadmore} onClick={handleReadmore}>
          {showMore ? "Læs mindre" : "Læs mere"}
        </button>

        <p
          className={`${styles.activityReadmoreText} ${
            showMore ? styles.activityReadmoreTextShow : ""
          }`}
        >
          {activity.description}
        </p>
      </div>

      {/* Like-knap */}
      <button
        className={`${styles.likeBtn} ${liked ? styles.liked : ""}`}
        onClick={handleLikeClick}
        aria-label={
          liked
            ? "Fjern aktivitet fra din liste"
            : "Tilføj aktivitet til din liste"
        }
      >
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
