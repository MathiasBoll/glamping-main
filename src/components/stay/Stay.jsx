import { useNavigate } from "react-router-dom";
import Button from "../button/Button";
import styles from "./stay.module.css";

const Stay = ({ stay }) => {
  const navigate = useNavigate();

  return (
    <figure className={styles.stay}>
      {/* TOP: beige titelboks */}
      <figcaption className={styles.caption}>
        <p className={styles.title}>{stay.title}</p>
        <p className={styles.titleTwo}>{stay.numberOfPersons} personer</p>
        <p className={styles.titleTwo}>Fra {stay.price}</p>
      </figcaption>

      {/* MIDT: billede */}
      <img className={styles.image} src={stay.image} alt={stay.title} />

      {/* BUND: teal bar med beige knap */}
      <div className={styles.bottomBar}>
        <Button
          buttonText='Læs mere'
          onClick={() => navigate(`/stay/${stay._id}`)}
        />
      </div>
    </figure>
  );
};

export default Stay;
