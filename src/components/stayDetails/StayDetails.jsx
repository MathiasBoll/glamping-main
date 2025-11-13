import { useEffect, useState } from "react";
import styles from "./stayDetails.module.css";
import { useParams } from "react-router";
import PageHeader from "../../components/pageHeader/PageHeader";

const StayDetails = () => {
  const [stay, setStay] = useState([]);

  const { id } = useParams();
  const fetchStayById = async () => {
    try {
      const response = await fetch(
        `https://glamping-rqu9j.ondigitalocean.app/stay/${id}`
      );

      const data = await response.json();

      setStay(data.data[0]);
      //   setReviews(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Indbygget hook fra React der sørger for, at funktionen kun køre én gang når komponenten renderes/mountes.
  // Medmindre der tilføjes en afhængighed.
  useEffect(() => {
    fetchStayById();
  }, []);

  console.log(stay);

  return (
    <article className={styles.stayDetails}>
      <PageHeader titleOne={stay.title} />
    </article>
  );
};

export default StayDetails;
