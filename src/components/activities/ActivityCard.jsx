// src/components/activities/ActivityCard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./activities.module.css";

const STORAGE_KEY = "likedList";

const ActivityCard = ({ activity }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setIsLiked(saved.some((a) => a._id === activity._id));
  }, [activity._id]);

  const toggleLike = () => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    let next;

    if (isLiked) {
      next = saved.filter((a) => a._id !== activity._id);
    } else {
      const exists = saved.some((a) => a._id === activity._id);
      next = exists ? saved : [...saved, activity];
    }

    if (next.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    setIsLiked((prev) => !prev);
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

        {/* Like-knap – nu placeret i den teal boks */}
        <button
          className={`${styles.likeBtn} ${isLiked ? styles.liked : ""}`}
          onClick={toggleLike}
          aria-label={
            isLiked
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
    </div>
  );
};

export default ActivityCard;
