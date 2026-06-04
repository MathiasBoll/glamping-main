// src/pages/ActivityDetails.jsx
import { useLoaderData } from "react-router";
import styles from "../components/activities/activities.module.css";
import heroImg from "../assets/image_04.jpg";

const ActivityDetails = () => {
    const activity = useLoaderData();

    return (
        <div className={styles.singlePage}>
            <section className={styles.activityHero}>
                <img src={heroImg} alt="Aktiviteter hos Gittes Glamping" />
                <h1 className={styles.activityHeroTitle}>Aktivitet</h1>
            </section>

            <section className={styles.activitySingle}>
                <div className={styles.singleTitle}>{activity.title}</div>
                <img src={activity.image} alt={activity.title} className={styles.singleImage} />
                <div className={styles.singleInfo}>
                    <p className={styles.singleDay}>{activity.date}</p>
                    <p className={styles.singleTime}>kl. {activity.time}</p>
                    <p className={styles.singleDescription}>{activity.description}</p>
                </div>
            </section>
        </div>
    );
};

export default ActivityDetails;