import { useState } from "react";
import Button from "../button/Button";
import styles from "./pageHeader.module.css";

const PageHeader = ({ logo, titleOne, titleTwo, button }) => {
  /* State variabel der deklares med Reacts indbyggede hook: useState. Dens initialvalue/standardværdi/defaultvalue er false */
  const [open, setOpen] = useState(false);

  // Funktion der setter state til dens modsatte, nuværende værdi.
  const toggle = () => {
    setOpen(!open);
  };

  return (
    <header className={styles.header}>
      {/* Hvis logo er true, skal <img/> vises/renderes. Hvis den er false (eller undefined eller null) skal den ikke. */}
      {logo && <img src={logo} alt='logo' />}

      <h1>
        {titleOne} <span>{titleTwo}</span>
      </h1>

      {/* Følgende er en betinget rendering (conditional rendering).
      Hvis button er true, skal <Button/>-komponenten renderes*/}

      {/* Vi sender 3 props videre med komponenten: Én til teksten, én til funktionen og én til dens style  */}

      {button && (
        <Button buttonText='Book nu' onClick={toggle} variant='transparent' />
      )}
    </header>
  );
};

export default PageHeader;
