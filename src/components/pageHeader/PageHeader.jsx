import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../button/Button";
import styles from "./pageHeader.module.css";

import homeBg from "../../assets/image_00.jpg";
import staysBg from "../../assets/image_01.jpg";

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
};

// Mapper pathname → en key vi kan bruge i config
function getPageKey(pathname) {
  if (pathname === "/" || pathname === "/index") return "home";
  if (pathname.startsWith("/stays") || pathname.startsWith("/ophold"))
    return "stays";
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
