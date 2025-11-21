import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../button/Button";
import styles from "./infoSection.module.css";
import gitte from "../../assets/gitte.jpg";

/**
 * InfoSection
 * ----------------------------------------------------------------------------
 * Denne komponent bruges på forsiden til at vise en præsentation af Gitte
 * og glamping-stedet. Den kan modtage "overrides", så indhold nemt kan ændres
 * fra parent-komponenten, men forsøger først at hente rigtigt indhold fra API’et.
 *
 * PRIORITET FOR INDHOLD:
 *   1) Overrides fra props
 *   2) API-data (hvis det lykkes)
 *   3) Fallback-tekst (hvis API fejler)
 *
 * Hooks:
 *   - useState         → håndtering af API-data og fallback
 *   - useEffect        → data-fetch ved load
 *   - useNavigate      → routing til opholdssiden via CTA-knap
 */
const InfoSection = ({
  titleOverride,
  bodyOverride,
  ctaOverride,
  showImage = true,
  showButton = true,
}) => {
  const navigate = useNavigate();

  /**
   * Default fallback-data
   * --------------------------------------------------------------------------
   * Bruges hvis API’et ikke svarer eller returnerer tomt indhold.
   * Matcher teksten fra det udleverede design.
   */
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
    image: gitte, // fallback-billede
  };

  // content indeholder enten API-data eller fallback
  const [content, setContent] = useState(fallback);

  /**
   * Henter tekstindhold fra API’et ved første render
   * --------------------------------------------------------------------------
   * Hvis API’et fejler → bruges fallback-teksten.
   * Hvis API’et lykkes → opdateres titel, body og CTA.
   * Billedet kommer altid fra assets-mappen (ikke API).
   */
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
            image: prev.image, // API leverer ikke billeder
          }));
        }
      } catch (err) {
        console.warn("[InfoSection] API fejlede – bruger fallback:", err);
      }
    };

    fetchData();
  }, []);

  // Her styres hvilke værdier der faktisk vises (override > API > fallback)
  const title = titleOverride ?? content.title;
  const body = bodyOverride ?? content.body;
  const ctaText = ctaOverride ?? content.ctaText;

  return (
    <section className={styles.infoSection}>
      {/* Titel i Zen Loop – kommer fra override/API/fallback */}
      <h2>{title}</h2>

      {/* Beskrivende tekstfelt */}
      <p>{body}</p>

      {/* Portræt-billede af Gitte (kan slås fra via prop) */}
      {showImage && <img src={content.image} alt="Gitte" />}

      {/* Knap → sender bruger til /stays */}
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
