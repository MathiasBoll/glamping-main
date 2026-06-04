// src/components/reviews/Reviews.jsx
import Review from "../review/Review";
import styles from "./reviews.module.css";

// reviews-prop leveres af Home.jsx via useLoaderData()
const Reviews = ({ reviews = [] }) => {
    return (
        <section className={styles.reviewsSection}>
            <div className={styles.headingBox}>
                <h2>
                    Vores gaester
                    <br />
                    udtaler
                </h2>
            </div>
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