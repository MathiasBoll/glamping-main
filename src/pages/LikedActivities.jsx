// src/pages/LikedActivities.jsx
import ActivityCard from "../components/activities/ActivityCard";
import styles from "./LikedActivities.module.css";
import { useLocalStorage } from "@uidotdev/usehooks";

import likedHeroImg from "../assets/image_05.jpg";

const STORAGE_KEY = "likedList";

const LikedActivities = () => {
  // useLocalStorage så vi opfylder kravet om hook + persistering
  const [liked, setLiked] = useLocalStorage(STORAGE_KEY, []);

  const count = Array.isArray(liked) ? liked.length : 0;

  // Bliver kaldt fra ActivityCard med den nye liste
  const handleToggleLike = (nextList) => {
    setLiked(nextList);
  };

  return (
    <article className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <img src={likedHeroImg} alt="Bål ved Gittes Glamping" />
        <div className={styles.heroOverlay}>
          <h1>Min liste</h1>
          <p>Antal aktiviteter på listen:</p>
          <span className={styles.heroCount}>{count}</span>
        </div>
      </section>

      {/* LISTE */}
      <section className={styles.listSection}>
        {count === 0 ? (
          <p className={styles.empty}>
            Du har ikke tilføjet nogen aktiviteter til din liste endnu.
          </p>
        ) : (
          liked.map((activity) => (
            <ActivityCard
              key={activity._id}
              activity={activity}
              onToggleLike={handleToggleLike}
            />
          ))
        )}
      </section>
    </article>
  );
};

export default LikedActivities;
