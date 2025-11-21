// src/components/stayDetails/StayDetails.jsx

// React hooks:
// - useState: gemmer data for det valgte ophold
// - useEffect: henter data fra API, når komponenten loader / id ændrer sig
import { useEffect, useState } from "react";

// React Router hooks:
// - useParams: henter :id fra URL’en (fx /stay/123)
// - useNavigate: bruges til at sende brugeren videre programmatisk
import { useParams, useNavigate } from "react-router-dom";

// PageHeader bruges som hero/cover-billede på toppen af siden
import PageHeader from "../../components/pageHeader/PageHeader";

// Genbrugelig knap-komponent i jeres design
import Button from "../../components/button/Button";

// CSS module – gør at styling er scoped til kun denne komponent
import styles from "./stayDetails.module.css";

const StayDetails = () => {
  // State der holder det ophold vi henter fra API
  const [stay, setStay] = useState(null);

  // Henter id fra URL’en
  const { id } = useParams();

  // Bruges til navigation (fx når man klikker "Book nu")
  const navigate = useNavigate();

  // Funktion der henter ét ophold ud fra id
  const fetchStayById = async () => {
    try {
      // Henter data fra API’et med det valgte id
      const response = await fetch(
        `https://glamping-rqu9j.ondigitalocean.app/stay/${id}`
      );

      // Konverterer til JSON
      const data = await response.json();

      // API returnerer et array i data.data → vi tager første element
      setStay(data.data[0]);
    } catch (error) {
      // Hvis API fejler, logger vi fejlen i console
      console.log(error);
    }
  };

  // useEffect kører når siden loader + hver gang id ændrer sig
  useEffect(() => {
    fetchStayById();
  }, [id]);

  // Hvis stay endnu ikke er hentet → vis loading tekst
  if (!stay) {
    return <p className={styles.stayDetails}>Indlæser ophold...</p>;
  }

  // Når man klikker "Book nu":
  // 1) gemmer vi opholdets id + titel i localStorage
  // 2) sender brugeren til kontakt-siden
  // Contact.jsx bruger "selectedStay" til at auto-vælge ophold i dropdown
  const handleBookNow = () => {
    // Brug det id-felt som findes i API’et
    const payload = {
      id: stay._id ?? stay.id,
      title: stay.title,
    };

    // Gem opholdsinfo i localStorage (samme key som Contact.jsx forventer)
    localStorage.setItem("selectedStay", JSON.stringify(payload));

    // Navigér til kontakt-siden
    navigate("/contact");
  };

  return (
    <>
      {/* =====================================================
          HERO / HEADER
          - Stort cover-billede fra API
          - Titel fra opholdets data
          - Ingen "Book nu" button i hero på denne side
          ===================================================== */}
      <PageHeader
        titleOne={stay.title}
        button={false}
        bgImg={stay.image}
      />

      {/* =====================================================
          INFO-SEKTION (teal box under hero)
          - Matcher designet fra figma/vanilla
          - Indeholder beskrivelse, includes og pris
          ===================================================== */}
      <article className={styles.stayDetails}>
        {/* Undertitel – fallback hvis API mangler subtitle */}
        <h2 className={styles.title}>
          {stay.subtitle || "Tag væk en weekend, med én du holder af"}
        </h2>

        <div className={styles.info}>
          {/* Opholdets beskrivelse */}
          <p className={styles.desc}>{stay.description}</p>

          {/* Includes-liste vises kun hvis API leverer en liste */}
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

          {/* Pris vises kun hvis price findes */}
          {stay.price && <p className={styles.price}>Pris {stay.price},-</p>}
        </div>

        {/* =====================================================
            BOOK NU KNAP
            - Klik gemmer ophold til localStorage
            - Sender videre til /contact
            ===================================================== */}
        <div className={styles.buttonWrap}>
          <Button buttonText="Book nu" onClick={handleBookNow} />
        </div>
      </article>
    </>
  );
};

export default StayDetails;
