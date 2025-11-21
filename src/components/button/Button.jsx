// ==========================================================================
// src/components/button/Button.jsx
// --------------------------------------------------------------------------
// Genanvendelig knap-komponent til hele projektet.
// Komponenten modtager:
//   • buttonText – den tekst der skal stå på knappen
//   • onClick – funktion der udføres ved klik
//   • variant – styrer hvilken styling (CSS-klasse) der bruges
//
// Varianten bruges fx til "transparent"-knappen i hero-sektionen
// eller standard-knapper i formularer.
//
// Styling ligger i button.module.css som CSS Modules,
// så klassernes navne bliver isoleret og ikke konflikter med andre.
// ==========================================================================

import styles from "./button.module.css";

// Komponenten tager imod props fra dens parent-komponent.
// Default variant = "default", så en almindelig knap fungerer uden ekstra props.
const Button = ({ buttonText, onClick, variant = "default" }) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`} // vælg base-style + variant-style
      onClick={onClick} // callback fra parent (fx navigate eller submit)
    >
      {/* Brug <p> for at matche designets typografi og spacing */}
      <p>{buttonText}</p>
    </button>
  );
};

export default Button;
