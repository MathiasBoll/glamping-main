// src/pages/Activities.jsx
import { useEffect, useState } from "react";
import ActivitiesSection from "../components/activities/activitiesSection";
import styles from "../components/activities/activities.module.css";
import heroFallback from "../assets/image_04.jpg"; // kano hero

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [heroImg, setHeroImg] = useState(heroFallback);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch("https://glamping-rqu9j.ondigitalocean.app/activities/");
        const json = await res.json();

        const list = json?.data || [];
        setActivities(list);

        if (list.length > 0 && list[0].image) {
          setHeroImg(list[0].image);
        }
      } catch (e) {
        setError(true);
        setHeroImg(heroFallback);
      }
    };

    fetchActivities();
  }, []);

  return (
    <article className={styles.activityContainer}>
      
      {/* HERO */}
      <section className={styles.activityHero}>
        <img src={heroImg} alt="Aktiviteter" />
        <h1 className={styles.activityHeroTitle}>Aktiviteter</h1>
      </section>

      {/* BLÅ TEKSTBOKS */}
      <section className={styles.activityHeroDesc}>
        <h2>Ingen skal kede sig hos Gitte</h2>
        <p>
          Glamping er mere end blot en indkvartering – det er en mulighed
          for at fordybe dig i naturen og skabe minder, der varer livet ud...
        </p>
      </section>

      {/* LISTE */}
      {error ? (
        <p style={{ textAlign: "center", padding: "60px 0" }}>
          Kunne ikke hente aktiviteter.
        </p>
      ) : (
        <ActivitiesSection activities={activities} />
      )}
    </article>
  );
};

export default Activities;
