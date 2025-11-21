// src/pages/LikedActivities.jsx

// Viser alle aktiviteter som brugeren har "liket"
// Disse data gemmes i localStorage via useLocalStorage-hooket

import ActivityCard from "../components/activities/ActivityCard";
import styles from "./LikedActivities.module.css";
import { useLocalStorage } from "@uidotdev/usehooks"; // krav i opgaven

// Hero-billede til siden
import likedHeroImg from "../assets/image_05.jpg";

// Nøgle til localStorage (bruges flere steder i projektet)
const STORAGE_KEY = "likedList";

const LikedActivities = () => {
  /*
    Brug af useLocalStorage-hooket (krav i opgaven):
    - Læser automatisk eksisterende localStorage data
    - Opdaterer localStorage når setLiked kaldes
    - Fungerer som useState, men persisterer data efter refresh
  */
  const [liked, setLiked] = useLocalStorage(STORAGE_KEY, []);

  // Antal liked aktiviteter – bruges i hero overlay
  const count = Array.isArray(liked) ? liked.length : 0;

  /*
    Bliver kaldt fra ActivityCard, som sender en opdateret liste med
    når brugeren liker/unliker en aktivitet.
  */
  const handleToggleLike = (nextList) => {
    setLiked(nextList); // gemmes automatisk i localStorage
  };

  return (
    <article className={styles.page}>
      {/* HERO SEKTION MED BÅL-BILLEDE */}
      <section className={styles.hero}>
        <img src={likedHeroImg} alt="Bål ved Gittes Glamping" />

        {/* Overlay-tekst oven på billedet */}
        <div className={styles.heroOverlay}>
          <h1>Min liste</h1>
          <p>Antal aktiviteter på listen:</p>
          <span className={styles.heroCount}>{count}</span>
        </div>
      </section>

      {/* SELVE LISTEN MED LIKED AKTIVITETER */}
      <section className={styles.listSection}>
        {count === 0 ? (
          // Tom tilstand
          <p className={styles.empty}>
            Du har ikke tilføjet nogen aktiviteter til din liste endnu.
          </p>
        ) : (
          // Render hver liked aktivitet som et ActivityCard
          liked.map((activity) => (
            <ActivityCard
              key={activity._id}
              activity={activity}
              onToggleLike={handleToggleLike} // opdaterer listen
            />
          ))
        )}
      </section>
    </article>
  );
};

export default LikedActivities;
