// src/components/pageHeader/PageHeader.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../button/Button";
import styles from "./pageHeader.module.css";

import homeBg from "../../assets/image_00.jpg";
import staysBg from "../../assets/image_01.jpg";
import activitiesBg from "../../assets/image_02.jpg";
import contactBg from "../../assets/image_03.jpg"; // 👈 hero til kontakt + beskeder

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
  contact: {
    bgImg: contactBg,
    titleOne: "Kontakt",
    titleTwo: "Gitte",
    showLogo: false,
    showButton: false, // 👈 ingen Book nu
  },
  messages: {
    bgImg: contactBg,          // 👈 samme billede som kontakt
    titleOne: "Mine",
    titleTwo: "beskeder",
    showLogo: false,
    showButton: false,         // 👈 ingen Book nu
  },
};

// Mapper pathname → en key vi kan bruge i config
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

  return "home";
}

const PageHeader = ({ logo, titleOne, titleTwo, button, bgImg }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const key = getPageKey(pathname);
  const conf = HEADER_CONFIG[key];

  const hasCustomTitleOne = titleOne !== undefined;

  const finalTitleOne = hasCustomTitleOne ? titleOne : conf.titleOne;
  const finalTitleTwo =
    hasCustomTitleOne && titleTwo === undefined
      ? ""
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
