// src/components/activities/activitiesSection.jsx
import ActivityCard from "./ActivityCard";
import styles from "./activities.module.css";

const ActivitiesSection = ({ activities }) => {
  return (
    <section className={styles.activityCardContainer}>
      {activities.map((activity) => (
        <ActivityCard key={activity._id} activity={activity} />
      ))}
    </section>
  );
};

export default ActivitiesSection;
