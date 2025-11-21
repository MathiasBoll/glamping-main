// ===============================================================
// Stay.jsx – komponent til visning af ét opholdskort
//
// Bruges på /stays-siden til at vise hvert ophold i API’et.
// Kortet følger det fælles visuelle tema:
// - Beige top med titel og facts
// - Billede i midten
// - Teal bund med “Læs mere”-knap
//
// Komponenten modtager ét stay-objekt som prop og bruger
// react-router-dom til at navigere til enkeltvisningen.
//
// Hooks brugt:
// - useNavigate → navigation til /stay/:id
//
// Design og struktur matcher det udleverede layout 1:1.
// ===============================================================

import { useNavigate } from "react-router-dom";
import Button from "../button/Button";          // Reusable knap-komponent
import styles from "./stay.module.css";         // Modulbaseret styling (CSS modules)

const Stay = ({ stay }) => {
  const navigate = useNavigate();               // hook til navigation

  return (
    <figure className={styles.stay}>
      
      {/* =========================================================
         TOPSEKTION: Beige titelboks
         Indeholder:
         - Navn på ophold
         - Antal personer
         - Pris
         Matchende design med de diagonale hjørner.
         ========================================================= */}
      <figcaption className={styles.caption}>
        <p className={styles.title}>{stay.title}</p>
        <p className={styles.titleTwo}>{stay.numberOfPersons} personer</p>
        <p className={styles.titleTwo}>Fra {stay.price}</p>
      </figcaption>

      {/* =========================================================
         MIDTERSEKTION: Billede af selve opholdet
         object-fit håndteres i CSS så alle kort ser ens ud.
         ========================================================= */}
      <img
        className={styles.image}
        src={stay.image}
        alt={stay.title}
      />

      {/* =========================================================
         BUNDSEKTION: Teal bar + beige "Læs mere"-knap
         Knappen bruger Button-komponenten og navigerer
         til single view → /stay/:id
         ========================================================= */}
      <div className={styles.bottomBar}>
        <Button
          buttonText="Læs mere"
          onClick={() => navigate(`/stay/${stay._id}`)}
        />
      </div>
    </figure>
  );
};

export default Stay;
