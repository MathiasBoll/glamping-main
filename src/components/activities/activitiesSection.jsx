// ==========================================================================
// src/components/activities/ActivitiesSection.jsx
// --------------------------------------------------------------------------
// Denne komponent fungerer som en wrapper der modtager en liste af aktiviteter
// og renderer et ActivityCard for hver. 
// Den bruges på hovedsiden for aktiviteter samt andre steder hvor en liste 
// af aktivitetskort skal vises.
// ==========================================================================

import ActivityCard from "./ActivityCard";
import styles from "./activities.module.css";

const ActivitiesSection = ({ activities }) => {
  return (
    // Container der styrer layoutet af alle aktivitetskort
    // (grid eller stacked — styres i activities.module.css)
    <section className={styles.activityCardContainer}>
      
      {/* 
        Vi mapper over API-dataen med activities.map() 
        og sender hver aktivitet ind i ActivityCard–komponenten.
        _id bruges som key, fordi det er unikt for hver aktivitet.
      */}
      {activities.map((activity) => (
        <ActivityCard 
          key={activity._id} 
          activity={activity} 
        />
      ))}
    </section>
  );
};

export default ActivitiesSection;
