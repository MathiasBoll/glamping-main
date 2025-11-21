// Henter React Hooks til state og side-effects
import { useState, useEffect } from "react";
import Review from "../review/Review";          // Enkelt review-kort
import styles from "./reviews.module.css";      // Modul-specifik styling

const Reviews = () => {
  // ===============================================================
  // STATE: reviews
  // - Et array med anmeldelser hentet fra API'et.
  // - Starter tomt og fyldes ved første render via useEffect.
  // ===============================================================
  const [reviews, setReviews] = useState([]);

  // ===============================================================
  // useEffect → Henter data fra API'et når komponenten loader
  // - Fetch kaldes KUN én gang (tom dependency-array [])
  // - Henter /reviews endpoint fra glamping-API'et
  // - Hvis success → gemmer data i state
  // - Hvis fejl → logger til konsollen
  // ===============================================================
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          "https://glamping-rqu9j.ondigitalocean.app/reviews"
        );
        const data = await response.json();

        // API’et returnerer { data: [...] }
        setReviews(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReviews();
  }, []);

  return (
    // ===============================================================
    // HOVED-SEKTION: indeholder overskrift + liste af anmeldelser
    // ===============================================================
    <section className={styles.reviewsSection}>
      
      {/* Beige header-boks med overskrift – matcher designet */}
      <div className={styles.headingBox}>
        <h2>
          Vores gæster
          <br />
          udtaler
        </h2>
      </div>

      {/* ===========================================================
          Liste af anmeldelseskort
          - <ul> bruges for semantik
          - Hvert review vises via Review-komponenten
         =========================================================== */}
      <ul className={styles.reviewList}>
        {reviews.map((review, index) => (
          <li key={index} className={styles.card}>
            <Review review={review} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Reviews;
