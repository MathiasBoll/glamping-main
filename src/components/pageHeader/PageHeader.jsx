import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../button/Button";
import styles from "./pageHeader.module.css";

// PageHeader.jsx
import homeBg from "../../assets/image_00.jpg";
import staysBg from "../../assets/image_01.jpg";
import activitiesBg from "../../assets/image_04.jpg"; // 👈 kano-heroet


// Basis-config afhængigt af side-type
const HEADER_CONFIG = {
  home: {
    bgImg: homeBg,
    titleOne: "Gittes",
    titleTwo: "Glamping",
    showLogo: true,
    showButton: true,
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
};

// Mapper pathname → en key vi kan bruge i config
function getPageKey(pathname) {
  if (pathname === "/" || pathname === "/index") return "home";

  // alle ophold-ruter
  if (
    pathname.startsWith("/stays") ||
    pathname.startsWith("/ophold") ||
    pathname.startsWith("/stay")      // <- single stay
  ) {
    return "stays";
  }

  // alle aktivitets-ruter (liste + single)
  if (
    pathname.startsWith("/activities") ||
    pathname.startsWith("/aktiviteter") ||
    pathname.startsWith("/activity")   // <- SINGLE ACTIVITY
  ) {
    return "activities";
  }

  return "home";
}

const PageHeader = ({ logo, titleOne, titleTwo, button, bgImg }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const key = getPageKey(pathname);
  const conf = HEADER_CONFIG[key];

  // Hvis man giver titleOne som prop, men IKKE titleTwo,
  // tolker vi det som en "fuld" titel uden ekstra span
  const hasCustomTitleOne = titleOne !== undefined;

  const finalTitleOne = hasCustomTitleOne ? titleOne : conf.titleOne;
  const finalTitleTwo =
    hasCustomTitleOne && titleTwo === undefined
      ? "" // ingen span
      : titleTwo ?? conf.titleTwo;

  const showButton = button ?? conf.showButton;
  const usedBg = bgImg ?? conf.bgImg;

  const handleClick = () => {
    setOpen(!open);
    navigate("/stays");
  };

  return (
    <header
      className={styles.header}
      style={{ backgroundImage: `url(${usedBg})` }}
    >
      {/* Logo vises kun hvis både config siger det OG der gives et logo-prop */}
      {conf.showLogo && logo && <img src={logo} alt="logo" />}

      <h1>
        {finalTitleOne}
        {finalTitleTwo && <span>{finalTitleTwo}</span>}
      </h1>

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
