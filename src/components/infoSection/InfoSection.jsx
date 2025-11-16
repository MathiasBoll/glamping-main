import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../button/Button";
import styles from "./infoSection.module.css";
import gitte from "../../assets/gitte.jpg";

const InfoSection = ({
  titleOverride,
  bodyOverride,
  ctaOverride,
  showImage = true,
  showButton = true,
}) => {
  const navigate = useNavigate();

  // Fallback-indhold hvis API fejler
  const fallback = {
    title: "Kom og prøv glamping hos Gitte",
    body: `Vi er stolte af at byde dig velkommen til Gitte’s Glamping, hvor
hjertevarme og omsorg møder naturens skønhed og eventyr. Vores
dedikerede team, anført af Gitte selv, er her for at skabe den perfekte
ramme om din luksuriøse udendørsoplevelse. Vi stræber efter at skabe
minder og fordybelse, uanset om du besøger os som par, familie eller
soloeventyrer. Vi tilbyder en bred vifte af aktiviteter og
arrangementer, der passer til alle aldre og interesser. Udforsk naturen,
slap af ved bålet, del historier med nye venner, eller find indre ro med
vores wellnessaktiviteter.`,
    ctaText: "Se vores ophold",
    image: gitte,
  };

  const [content, setContent] = useState(fallback);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://glamping-rqu9j.ondigitalocean.app/about/"
        );
        if (!res.ok) throw new Error("API-fejl");

        const json = await res.json();
        const first = json?.data?.[0];

        if (first) {
          setContent((prev) => ({
            title: first.title || prev.title,
            body: first.body || prev.body,
            ctaText: first.ctaText || prev.ctaText,
            image: prev.image,
          }));
        }
      } catch (err) {
        console.warn("[InfoSection] API fejlede – bruger fallback:", err);
      }
    };

    fetchData();
  }, []);

  // Brug overrides hvis de er givet – ellers brug content fra API/fallback
  const title = titleOverride ?? content.title;
  const body = bodyOverride ?? content.body;
  const ctaText = ctaOverride ?? content.ctaText;

  return (
    <section className={styles.infoSection}>
      <h2>{title}</h2>
      <p>{body}</p>

      {showImage && <img src={content.image} alt="Gitte" />}

      {showButton && (
        <Button
          buttonText={ctaText}
          onClick={() => navigate("/stays")}
        />
      )}
    </section>
  );
};

export default InfoSection;
