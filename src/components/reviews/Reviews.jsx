import { useState, useEffect } from "react";
import Review from "../review/Review";
import styles from "./reviews.module.css";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          "https://glamping-rqu9j.ondigitalocean.app/reviews"
        );
        const data = await response.json();
        setReviews(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className={styles.reviewsSection}>
      {/* Beige header-boks */}
      <div className={styles.headingBox}>
        <h2>
          Vores gæster
          <br />
          udtaler
        </h2>
      </div>

      {/* Liste med kort */}
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
