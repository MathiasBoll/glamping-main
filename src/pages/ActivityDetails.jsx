// src/pages/ActivityDetails.jsx

// React hooks til state og side-effects (API-kald)
import { useEffect, useState } from "react";

// useParams bruges til at læse :id fra URL’en (react-router-dom version)
import { useParams } from "react-router-dom";

// CSS-modul, så styling kun gælder for aktivitetsdelen
import styles from "../components/activities/activities.module.css";

// Fast hero-billede til single-siden (ikke hentet fra API)
import heroImg from "../assets/image_04.jpg";

// API endpoint til at hente alle aktiviteter
const API_URL = "https://glamping-rqu9j.ondigitalocean.app/activities/";

/*
  ActivityDetails viser én aktivitet baseret på URL-id:
    - Henter alle aktiviteter fra API’et
    - Finder den aktivitet der matcher id’et
    - Viser loading/fejl/not-found states på en brugervenlig måde

  Der bruges:
    ✓ useParams – til at få id fra URL’en
    ✓ useState – til status + den fundne aktivitet
    ✓ useEffect – til at hente data ved load og når id ændres
*/
const ActivityDetails = () => {
  // id kommer fra route: /activity/:id
  const { id } = useParams();

  /*
    status styrer hvilken UI vi viser:
      "loading"  → mens vi henter
      "ready"    → aktivitet fundet
      "error"    → API-fejl
      "not-found"→ id findes ikke i listen
  */
  const [status, setStatus] = useState("loading");
  const [activity, setActivity] = useState(null);

  // Hent aktivitet hver gang id ændrer sig
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(API_URL);

        // Hvis API svarer med fejlstatus → kast fejl
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();
        const list = json?.data || [];

        // Find aktiviteten der matcher URL-id’et
        const found = list.find((item) => item._id === id);

        // Hvis ikke fundet → not-found state
        if (!found) {
          setStatus("not-found");
          return;
        }

        // Hvis fundet → gem data og sæt ready
        setActivity(found);
        setStatus("ready");
      } catch (err) {
        console.error("[ActivityDetails] API-fejl:", err);
        setStatus("error");
      }
    };

    fetchActivity();
  }, [id]);

  return (
    <div className={styles.singlePage}>
      {/* =============================
          HERO SEKTION (single)
          ============================= */}
      <section className={styles.activityHero}>
        <img src={heroImg} alt="Aktiviteter hos Gittes Glamping" />
        <h1 className={styles.activityHeroTitle}>Aktivitet</h1>
      </section>

      {/* =============================
          STATUS UI (loading/fejl)
          ============================= */}
      {status === "loading" && (
        <p className={styles.singleMessage}>Henter aktiviteten...</p>
      )}

      {status === "error" && (
        <p className={styles.singleMessage}>Kunne ikke hente aktiviteten.</p>
      )}

      {status === "not-found" && (
        <p className={styles.singleMessage}>
          Kunne ikke finde aktiviteten.
        </p>
      )}

      {/* =============================
          SELVE AKTIVITETS-KORTET
          ============================= */}
      {status === "ready" && activity && (
        <section className={styles.activitySingle}>
          {/* Beige titelboks */}
          <div className={styles.singleTitle}>{activity.title}</div>

          {/* Aktivitetsbillede fra API */}
          <img
            src={activity.image}
            alt={activity.title}
            className={styles.singleImage}
          />

          {/* Info-boks med dato/tid/beskrivelse */}
          <div className={styles.singleInfo}>
            <p className={styles.singleDay}>{activity.date}</p>
            <p className={styles.singleTime}>kl. {activity.time}</p>

            <p className={styles.singleDescription}>
              {activity.description}
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

export default ActivityDetails;
