// ============================================================================
// src/components/footer/Footer.jsx
// ----------------------------------------------------------------------------
// Denne komponent viser footeren nederst på siden.
// Footeren indeholder sociale medier, logo og navn på brandet.
// Layout og farver styres via footer.module.css (CSS Modules).
// ============================================================================
import styles from "./footer.module.css";

// Logo og ikon-assets importeres direkte – Vite håndterer filstierne.
import logo from "/logo.png";
import facebookIcon from "/src/assets/icons/square-facebook.svg";
import instagramIcon from "/src/assets/icons/square-instagram.svg";

const Footer = () => {
  return (
    // Ydre wrapper for hele footeren
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        
        {/* --------------------------------------------------------------------
            Sociale medier sektion
            - Indeholder klikbare ikoner (Facebook & Instagram)
            - Ikonerne importeres som SVG-filer
            - className styrer størrelser og spacing via CSS Modules
           -------------------------------------------------------------------- */}
        <div className={styles.footerSocial}>
          <a className={styles.footerIcon} href="/">
            <img src={facebookIcon} alt="Facebook" />
          </a>

          <a className={styles.footerIcon} href="/">
            <img src={instagramIcon} alt="Instagram" />
          </a>
        </div>

        {/* --------------------------------------------------------------------
            Branding sektion
            - Viser logoet samt navnet "Gittes Glamping"
            - Linket fører brugeren tilbage til forsiden
            - footerLogo og footerText styres via CSS-modulet
           -------------------------------------------------------------------- */}
        <div className={styles.footerBrand}>
          <a href="/">
            <img
              src={logo}
              alt="Gittes Glamping logo"
              className={styles.footerLogo}
            />
          </a>

          <span className={styles.footerText}>Gittes Glamping</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
