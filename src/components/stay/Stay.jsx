import { useNavigate } from "react-router-dom";
import Button from "../button/Button";
import styles from "./stay.module.css";

const Stay = ({ stay }) => {
  const navigate = useNavigate();

  return (
    <figure className={styles.stay}>
      {/* Toppens beige titelboks */}
      <figcaption className={styles.caption}>
        <p className={styles.title}>{stay.title}</p>
        <p className={styles.titleTwo}>{stay.numberOfPersons} personer</p>
        <p className={styles.titleTwo}>Fra {stay.price}</p>
      </figcaption>

      {/* Kvadratisk billede */}
      <img className={styles.image} src={stay.image} alt={stay.title} />

      {/* Knap nederst */}
      <div className={styles.buttonWrap}>
        <Button
          buttonText="Læs mere"
          onClick={() => navigate(`/stay/${stay._id}`)}
        />
      </div>
    </figure>
  );
};

export default Stay;
