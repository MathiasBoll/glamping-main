import { useNavigate } from "react-router";
import Button from "../button/Button";
import styles from "./stay.module.css";

const Stay = ({ stay }) => {
  console.log(stay);

  const navigate =useNavigate()

  return (
    <figure className={styles.stay}>
      <figcaption>
        <p className={styles.title}>{stay.title}</p>
        <p className={styles.titleTwo}>{stay.numberOfPersons} Personer</p>
        <p className={styles.titleTwo}>Fra {stay.price}</p>
      </figcaption>
      <img src={stay.image} alt={stay.title} />
      <div>
        <Button buttonText='Læs mere' onClick={() => navigate(`/stay/${stay._id}`)} 
          />
      </div>
    </figure>
  );
};

export default Stay;
