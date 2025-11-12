import { useState, useEffect } from "react";
import Review from "../review/Review";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

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

  // Indbygget hook fra React der sørger for, at funktionen kun køre én gang når komponenten renderes/mountes.
  // Medmindre der tilføjes en afhængighed.
  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className='container'>
      {reviews.map((review, index) => (
        <Review review={review} key={index} />
      ))}
    </div>
  );
};

export default Reviews;
