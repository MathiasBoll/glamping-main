import styles from "./footer.module.css";
import logo from "/logo.png";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.soMe}></div>
      <div>
        <img src={logo} alt='logo' />
        <h5>Gittes Glamping</h5>
      </div>
    </footer>
  );
};

export default Footer;
