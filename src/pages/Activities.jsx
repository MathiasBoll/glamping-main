// src/pages/Activities.jsx
import { useEffect, useState } from "react";
import ActivitiesSection from "../components/activities/activitiesSection";
import styles from "../components/activities/activities.module.css";

// FAST hero-billede (kanoen) – ikke fra API
import heroKano from "../assets/image_04.jpg";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(
          "https://glamping-rqu9j.ondigitalocean.app/activities/"
        );

        if (!res.ok) {
          throw new Error("API-fejl");
        }

        const json = await res.json();
        const list = json?.data || [];
        setActivities(list);
        setError(null);
      } catch (err) {
        console.error("[Activities] API-fejl:", err);
        setError("Kunne ikke hente aktiviteterne.");
      }
    };

    fetchActivities();
  }, []);

  return (
    <article className={styles.activityContainer}>
      {/* HERO */}
      <section className={styles.activityHero}>
        <img src={heroKano} alt="Aktiviteter hos Gittes Glamping" />
        <h1 className={styles.activityHeroTitle}>Aktiviteter</h1>

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

      {/* LISTE MED KORT */}
      <ActivitiesSection activities={activities} />

      {error && (
        <p className={styles.activityError}>{error}</p>
      )}
    </article>
  );
};

export default Activities;
