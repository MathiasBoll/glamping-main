import { useEffect, useState } from "react";
import styles from "./stayDetails.module.css";
import { useParams } from "react-router-dom"; // 👈 vigtig: react-router-dom
import PageHeader from "../../components/pageHeader/PageHeader";

const StayDetails = () => {
  const [stay, setStay] = useState(null);
  const { id } = useParams();

  const fetchStayById = async () => {
    try {
      const response = await fetch(
        `https://glamping-rqu9j.ondigitalocean.app/stay/${id}`
      );
      const data = await response.json();
      setStay(data.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStayById();
  }, [id]);

  console.log(stay);

  // Indtil data er hentet
  if (!stay) {
    return <p className={styles.stayDetails}>Indlæser ophold...</p>;
  }

  return (
    <article className={styles.stayDetails}>
      <PageHeader
        titleOne={stay.title}      // fuld titel
        button={false}             // ingen "Book nu" knap i hero, hvis du ikke vil
        logo={false}               // intet hero-logo på single-siden
        bgImg={stay.image}         // skift til den property du har i API'et (fx stay.hero_image)
      />

      {/* Her kan du senere vise mere info om opholdet */}
      {/* <p>{stay.description}</p> osv. */}
    </article>
  );
};

export default StayDetails;
