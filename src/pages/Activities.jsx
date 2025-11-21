// src/pages/Activities.jsx

// React hooks til state og data-fetching
import { useEffect, useState } from "react";

// Komponent der renderer listen af aktivitet-kort
import ActivitiesSection from "../components/activities/activitiesSection";

// CSS-modul med al styling til aktiviteter
import styles from "../components/activities/activities.module.css";

// Fast hero-baggrund (kano-billede) – kommer ikke fra API’et
import heroKano from "../assets/image_04.jpg";

/*
  Activities-siden viser:
    - Et statisk hero med billede + intro-tekst
    - En liste af aktivitetskort hentet fra API
    - Fejlbesked hvis data ikke kan hentes

  Der bruges:
    ✓ useState – til data og fejlbeskeder
    ✓ useEffect – til at hente data ved første load
    ✓ fetch() – til at hente aktiviteter fra API’et
*/
const Activities = () => {
  // Liste over aktiviteter hentet fra API’et
  const [activities, setActivities] = useState([]);

  // Fejltekst hvis API-kaldet fejler
  const [error, setError] = useState(null);

  /*
    Fetch aktiviteter når komponenten loader.
    useEffect kører kun én gang pga. tom dependency-array.
  */
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(
          "https://glamping-rqu9j.ondigitalocean.app/activities/"
        );

        // Hvis API’et svarer med fejlstatus → kast fejl
        if (!res.ok) {
          throw new Error("API-fejl");
        }

        const json = await res.json();
        const list = json?.data || [];

        // Gem aktiviteter i state
        setActivities(list);
        setError(null);
      } catch (err) {
        console.error("[Activities] API-fejl:", err);

        // Sæt venlig fejlbesked til UI
        setError("Kunne ikke hente aktiviteterne.");
      }
    };

    fetchActivities();
  }, []);

  return (
    <article className={styles.activityContainer}>
      {/* =============================
          HERO SEKTION
          ============================= */}
      <section className={styles.activityHero}>
        {/* Hero-billede */}
        <img src={heroKano} alt="Aktiviteter hos Gittes Glamping" />

        {/* Hero-overskrift oven på billedet */}
        <h1 className={styles.activityHeroTitle}>Aktiviteter</h1>

        {/* Hero-intro med tekstboks i blå baggrund */}
        <div className={styles.activityHeroDesc}>
          <h2>Ingen skal kede sig hos Gitte</h2>
          <p>
            Glamping er mere end blot en indkvartering – det er en mulighed for
            at fordybe dig i naturen og skabe minder, der varer livet ud. Uanset
            om du foretrækker en eventyrlig kanotur, en oplysende naturvandring,
            hjertevarmt samvær omkring bålet, smagfulde oplevelser som
            vinsmagning eller morgenyoga, der giver dig en chance for at finde
            indre ro og balance i naturens skød – vil vi hos Gittes Glamping
            imødekomme dine ønsker.
          </p>
        </div>
      </section>

      {/* =============================
          LISTE MED AKTIVITET-KORT
          ============================= */}
      <ActivitiesSection activities={activities} />

      {/* Fejlbesked hvis API'et fejler */}
      {error && (
        <p className={styles.activityError}>{error}</p>
      )}
    </article>
  );
};

export default Activities;
