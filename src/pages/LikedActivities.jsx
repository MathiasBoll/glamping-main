// src/pages/LikedActivities.jsx
import { useEffect, useState } from "react";
import ActivityCard from "../components/activities/ActivityCard";
import styles from "./LikedActivities.module.css";

// hero-billede (bål med skumfidus)
import likedHeroImg from "../assets/image_05.jpg";

const STORAGE_KEY = "likedList";

const LikedActivities = () => {
  const [liked, setLiked] = useState([]);

  const loadLiked = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setLiked(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      console.error("[LikedActivities] Kunne ikke læse likedList", err);
      setLiked([]);
    }
  };

  useEffect(() => {
    loadLiked();

    // hvis du har flere tabs åbne, opdater når localStorage ændres
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) loadLiked();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const count = liked.length;

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
              onToggleLike={loadLiked} // opdater listen når man unliker
            />
          ))
        )}
      </section>
    </article>
  );
};

export default LikedActivities;
