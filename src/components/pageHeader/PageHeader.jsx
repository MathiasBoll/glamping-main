import { useState } from "react";
import Button from "../button/Button";
import styles from "./pageHeader.module.css";

const PageHeader = ({ logo, titleOne, titleTwo, button }) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen(!open);
  };

  return (
    <header className={styles.header}>
      {/* Logo vises kun hvis der gives et logo-prop */}
      {logo && <img src={logo} alt="logo" />}

      <h1>
        {titleOne} <span>{titleTwo}</span>
      </h1>

      {/* Hvis button er true → vis knap med navigation */}
      {button && (
        <a href="/stays">
          <Button
            buttonText="Book nu"
            onClick={toggle}
            variant="transparent"
          />
        </a>
      )}
    </header>
  );
};

export default PageHeader;
