import styles from "./footer.module.css";
import logo from "/logo.png";
import facebookIcon from "/src/assets/icons/square-facebook.svg";
import instagramIcon from "/src/assets/icons/square-instagram.svg";


const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>

        {/* Sociale medier */}
        <div className={styles.footerSocial}>
          <a className={styles.footerIcon} href="/">
            <img src={facebookIcon} alt="Facebook" />
          </a>

          <a className={styles.footerIcon} href="/">
            <img src={instagramIcon} alt="Instagram" />
          </a>
        </div>

        {/* Brand */}
        <div className={styles.footerBrand}>
          <a href="/">
            <img src={logo} alt="Gittes Glamping logo" className={styles.footerLogo} />
          </a>
          <span className={styles.footerText}>Gittes Glamping</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
