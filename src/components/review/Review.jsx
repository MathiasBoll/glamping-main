// Review.jsx
// --------------------------------------------------------------
// Denne komponent viser en enkelt bruger-anmeldelse.
// Komponenten modtager et "review"-objekt som prop,
// og udskriver navn, alder, hvilket ophold personen har prøvet,
// samt selve anmeldelsesteksten.
//
// Vi bruger CSS Modules (review.module.css)
// for at undgå globale konflikter i styling.
// --------------------------------------------------------------

import styles from "./review.module.css";

const Review = ({ review }) => {
  return (
    <article className={styles.review}>
      
      {/* Headeren viser hvem brugeren er + hvilket ophold de har prøvet */}
      <header className={styles.title}>
        <p>
          {review.name}, {review.age} år
        </p>
        <p>Har været på {review.stay}</p>
      </header>

      {/* Selve anmeldelsesteksten */}
      <p className={styles.desc}>{review.review}</p>
    </article>
  );
};

export default Review;
