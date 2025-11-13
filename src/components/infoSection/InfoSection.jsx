import Button from "../button/Button";
import styles from "./infoSection.module.css";
import gitte from "../../assets/gitte.jpg";

const InfoSection = () => {
  return (
    <section className={styles.infoSection}>
      <h2>Kom og prøv glamping hos Gitte</h2>
      <p>
        Vi er stolte af at byde dig velkommen til Gitte’s Glamping, hvor
        hjertevarme og omsorg møder naturens skønhed og eventyr. Vores
        dedikerede team, anført af Gitte selv, er her for at skabe den perfekte
        ramme om din luksuriøse udendørsoplevelse. Vi stræber efter at skabe
        minder og fordybelse, uanset om du besøger os som par, familie eller
        soloeventyrer. Vi tilbyder en bred vifte af aktiviteter og
        arrangementer, der passer til alle aldre og interesser. Udforsk naturen,
        slap af ved bålet, del historier med nye venner, eller find indre ro med
        vores wellnessaktiviteter.
      </p>
      <img src={gitte} alt='gitte' />
      <Button buttonText={"Se vores ophold"} />
    </section>
  );
};

export default InfoSection;
