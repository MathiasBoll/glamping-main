// ============================================================================
// src/components/footer/Footer.jsx
// ----------------------------------------------------------------------------
// Denne komponent viser footeren nederst på siden.
// Footeren indeholder sociale medier, logo, navn på brandet
// og tilmelding til nyhedsbrev.
// Layout og farver styres via footer.module.css (CSS Modules).
// ============================================================================
import { useState } from "react";
import styles from "./footer.module.css";
import { subscribeNewsletter } from "../../services/subscriberAdminService";

// Logo og ikon-assets importeres direkte – Vite håndterer filstierne.
import logo from "/logo.png";
import facebookIcon from "/src/assets/icons/square-facebook.svg";
import instagramIcon from "/src/assets/icons/square-instagram.svg";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', text }
  const [sending, setSending] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setFeedback(null);
    try {
      await subscribeNewsletter(email.trim());
      setFeedback({ type: "success", text: "Tak! Du er nu tilmeldt nyhedsbrevet." });
      setEmail("");
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("409") || msg.toLowerCase().includes("allerede")) {
        setFeedback({ type: "error", text: "Denne e-mail er allerede tilmeldt." });
      } else {
        setFeedback({ type: "error", text: "Tilmelding mislykkedes. Prøv igen senere." });
      }
    } finally {
      setSending(false);
    }
  };

  return (
    // Ydre wrapper for hele footeren
    <footer className={styles.footer}>
      <div className={styles.footerInner}>

        {/* --------------------------------------------------------------------
            Nyhedsbrev-sektion
           -------------------------------------------------------------------- */}
        <div className={styles.newsletter}>
          <p className={styles.newsletterTitle}>Tilmeld dig vores nyhedsbrev</p>
          <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
            <input
              type="email"
              className={styles.newsletterInput}
              placeholder="Din e-mailadresse"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={sending}
            />
            <button
              type="submit"
              className={styles.newsletterBtn}
              disabled={sending}
            >
              {sending ? "Tilmelder..." : "Tilmeld"}
            </button>
          </form>
          {feedback && (
            <p className={feedback.type === "success" ? styles.newsletterSuccess : styles.newsletterError}>
              {feedback.text}
            </p>
          )}
        </div>

        {/* --------------------------------------------------------------------
            Sociale medier sektion
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
