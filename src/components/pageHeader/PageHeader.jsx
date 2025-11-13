import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../button/Button";
import styles from "./pageHeader.module.css";

const PageHeader = ({ logo, titleOne, titleTwo, button }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate(); // ← REACT ROUTER NAVIGATION

  const handleClick = () => {
    setOpen(!open);
    navigate("/stays"); // ← SEND BRUGEREN TIL /stays
  };

  return (
    <header className={styles.header}>
      {/* Logo vises kun hvis der gives et logo-prop */}
      {logo && <img src={logo} alt="logo" />}

      <h1>
        {titleOne} <span>{titleTwo}</span>
      </h1>

      {/* Hvis button er true → vis knap */}
      {button && (
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
