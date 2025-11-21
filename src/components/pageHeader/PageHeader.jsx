// src/components/pageHeader/PageHeader.jsx

// useState: bruges her til at styre klik på "Book nu"-knappen (bonus/fremtidig logik)
// useLocation: bruges til at finde ud af hvilken side vi er på (pathname)
// useNavigate: gør det muligt at navigere programmatisk ved klik
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Genbruger jeres Button-komponent
import Button from "../button/Button";

// CSS module for PageHeader-styling
import styles from "./pageHeader.module.css";

// Hero-billeder (fallbacks) til de relevante sider
import homeBg from "../../assets/image_00.jpg";
import staysBg from "../../assets/image_01.jpg";
import activitiesBg from "../../assets/image_02.jpg";
import contactBg from "../../assets/image_03.jpg"; // hero til kontakt + beskeder

// Logo til forsiden
import logoMark from "/logo.png";

/*
  HEADER_CONFIG:
  Et objekt der definerer hvilke titler,
  hero-billeder og elementer der skal vises
  på de forskellige routes.

  Vi bruger det sådan, at PageHeader automatisk
  ændrer sig afhængigt af hvilken side brugeren er på.
*/
const HEADER_CONFIG = {
  home: {
    bgImg: homeBg,
    titleOne: "Gittes",
    titleTwo: "Glamping",
    showLogo: true,     // kun forsiden viser logoet i hero
    showButton: true,   // forsiden har "Book nu"
  },
  stays: {
    bgImg: staysBg,
    titleOne: "Vores",
    titleTwo: "ophold",
    showLogo: false,
    showButton: false,
  },
  activities: {
    bgImg: activitiesBg,
    titleOne: "Aktiviteter",
    titleTwo: "",
    showLogo: false,
    showButton: false,
  },
  contact: {
    bgImg: contactBg,
    titleOne: "Kontakt",
    titleTwo: "Gitte",
    showLogo: false,
    showButton: false, // ingen Book nu på kontakt
  },
  messages: {
    bgImg: contactBg,   // samme hero som kontakt
    titleOne: "Mine",
    titleTwo: "beskeder",
    showLogo: false,
    showButton: false, // ingen Book nu på beskeder
  },
};

/*
  getPageKey:
  En lille helper-funktion der oversætter pathname
  (fx "/activities") til en nøgle vi kan bruge i HEADER_CONFIG.
*/
function getPageKey(pathname) {
  if (pathname === "/" || pathname === "/index") return "home";

  if (pathname.startsWith("/stays") || pathname.startsWith("/ophold")) {
    return "stays";
  }

  if (pathname.startsWith("/activities") || pathname.startsWith("/aktiviteter")) {
    return "activities";
  }

  if (pathname.startsWith("/contact") || pathname.startsWith("/kontakt")) {
    return "contact";
  }

  if (pathname.startsWith("/messages") || pathname.startsWith("/beskeder")) {
    return "messages";
  }

  // fallback (hvis ingen match)
  return "home";
}

/*
  PageHeader-komponenten:
  - Viser hero-billede + titel på alle sider
  - Skifter automatisk ud fra path + HEADER_CONFIG
  - Kan override title/bg/button via props hvis man vil
*/
const PageHeader = ({ titleOne, titleTwo, button, bgImg }) => {
  const [open, setOpen] = useState(false); // lokal state (bruges ved Book nu klik)
  const navigate = useNavigate();          // bruges til navigation på knapklik
  const { pathname } = useLocation();      // giver os aktuel route

  // Finder korrekt config til siden
  const key = getPageKey(pathname);
  const conf = HEADER_CONFIG[key];

  /*
    Hvis titleOne sendes som prop, bruger vi den
    i stedet for default fra config.
  */
  const hasCustomTitleOne = titleOne !== undefined;

  const finalTitleOne = hasCustomTitleOne ? titleOne : conf.titleOne;
  const finalTitleTwo =
    hasCustomTitleOne && titleTwo === undefined
      ? ""                // hvis kun titleOne gives → ingen span
      : titleTwo ?? conf.titleTwo;

  // Tillader override af button/bg via props
  const showButton = button ?? conf.showButton;
  const usedBg = bgImg ?? conf.bgImg;

  /*
    handleClick:
    - toggler open state (til evt. senere brug)
    - navigerer til ophold-siden (booking flow)
  */
  const handleClick = () => {
    setOpen(!open);
    navigate("/stays");
  };

  return (
    <header
      className={styles.header}
      style={{ backgroundImage: `url(${usedBg})` }}
    >
      {/* Logo vises kun hvis config siger showLogo = true (kun forsiden) */}
      {conf.showLogo && (
        <img
          src={logoMark}
          alt="Gittes Glamping"
          className={styles.heroLogo}
        />
      )}

      {/* Hero-titel */}
      <h1 className={styles.title}>
        {finalTitleOne}
        {finalTitleTwo && (
          <span className={styles.titleTwo}>{finalTitleTwo}</span>
        )}
      </h1>

      {/* "Book nu" knap – vises kun når showButton er true */}
      {showButton && (
        <Button
          buttonText="Book nu"
          onClick={handleClick}
          variant="transparent"
        />
      )}
    </header>
  );
};

export default PageHeader;
