// src/pages/Activities.jsx
import { useLoaderData } from "react-router";
import ActivitiesSection from "../components/activities/activitiesSection";
import styles from "../components/activities/activities.module.css";
import heroKano from "../assets/image_04.jpg";

const Activities = () => {
    const activities = useLoaderData();

    return (
        <article className={styles.activityContainer}>
            <section className={styles.activityHero}>
                <img src={heroKano} alt="Aktiviteter hos Gittes Glamping" />
                <h1 className={styles.activityHeroTitle}>Aktiviteter</h1>
                <div className={styles.activityHeroDesc}>
                    <h2>Ingen skal kede sig hos Gitte</h2>
                    <p>
                        Glamping er mere end blot en indkvartering - det er en mulighed for
                        at fordybe dig i naturen og skabe minder, der varer livet ud.
                    </p>
                </div>
            </section>
            <ActivitiesSection activities={activities} />
        </article>
    );
};

export default Activities;