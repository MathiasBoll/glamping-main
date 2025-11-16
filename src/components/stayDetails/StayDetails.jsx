// src/pages/stayDetails/StayDetails.jsx (eller hvor din fil ligger)
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/pageHeader/PageHeader";
import Button from "../../components/button/Button";
import styles from "./stayDetails.module.css";

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

  if (!stay) {
    return <p className={styles.stayDetails}>Indlæser ophold...</p>;
  }

  return (
    <>
      {/* HERO med stort billede og titel */}
   
<PageHeader
  titleOne={stay.title}
  button={false}
  
  bgImg={stay.image}
/>

      {/* TEAL INFO-SEKTIONEN UNDER HERO */}
      <article className={styles.stayDetails}>
        <h2 className={styles.title}>
          {stay.subtitle || "Tag væk en weekend, med én du holder af"}
        </h2>

        <div className={styles.info}>
          <p className={styles.desc}>{stay.description}</p>

          {/* Opholdet indeholder – hvis API’et har en includes-liste */}
          {Array.isArray(stay.includes) && stay.includes.length > 0 && (
            <>
              <p className={styles.includeTitle}>Opholdet indeholder:</p>
              <ul className={styles.included}>
                {stay.includes.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {/* Pris */}
          {stay.price && (
            <p className={styles.price}>Pris {stay.price},-</p>
          )}
        </div>

        <div className={styles.buttonWrap}>
          <Button buttonText="Book nu" />
        </div>
      </article>
    </>
  );
};

export default StayDetails;
