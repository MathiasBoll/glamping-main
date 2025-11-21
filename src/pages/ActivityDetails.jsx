import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // <- vigtigt: dom-versionen
import styles from "../components/activities/activities.module.css";
import heroImg from "../assets/image_04.jpg"; // kano-hero til single-siden

const API_URL = "https://glamping-rqu9j.ondigitalocean.app/activities/";

const ActivityDetails = () => {
  const { id } = useParams();

  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error" | "not-found"
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(API_URL);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();
        const list = json?.data || [];

        const found = list.find((item) => item._id === id);

        if (!found) {
          setStatus("not-found");
          return;
        }

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
      {/* HERO – helt separat fra forsiden/ophold */}
      <section className={styles.activityHero}>
        <img src={heroImg} alt="Aktiviteter hos Gittes Glamping" />
        <h1 className={styles.activityHeroTitle}>Aktivitet</h1>
      </section>

      {/* LOADING / FEJL / IKKE FUNDET */}
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

      {/* SELVE ENKELT-KORTET */}
      {status === "ready" && activity && (
        <section className={styles.activitySingle}>
          <div className={styles.singleTitle}>{activity.title}</div>

          <img
            src={activity.image}
            alt={activity.title}
            className={styles.singleImage}
          />

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
