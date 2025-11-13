// Vi bruger module.css for at undgå globale konflikter
import styles from "./review.module.css";

const Review = ({ review }) => {
  return (
    <article className={styles.review}>
      <header className={styles.title}>
        <p>
          {review.name}, {review.age} år
        </p>
        <p>Har været på {review.stay}</p>
      </header>

      <p className={styles.desc}>{review.review}</p>
    </article>
  );
};

export default Review;
