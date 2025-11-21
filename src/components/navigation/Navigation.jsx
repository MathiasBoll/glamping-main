// src/components/navigation/Navigation.jsx

// React-hooks til state, refs og lifecycle-effekter
import { useEffect, useRef, useState } from "react";
// NavLink bruges til styling af aktive links, useLocation til at tjekke nuværende route
import { NavLink, useLocation } from "react-router-dom";
import styles from "./navigation.module.css";
import logo from "/logo.png";

const Navigation = () => {
  // Styrer om burgermenuen er åben
  const [isOpen, setIsOpen] = useState(false);

  // Bruges til at tjekke om vi er på forsiden (hero har ikke logo i top)
  const { pathname } = useLocation();

  // Refs til fokus-håndtering (ESC lukker menu og sætter fokus tilbage)
  const menuRef = useRef(null);
  const burgerRef = useRef(null);

  const isHome = pathname === "/";

  // Åbn/luk/toggle burger-menu
  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  /* ---------------------------------------------------------
     Lås scroll på body når menuen er åben
     Dette matcher moderne mobile design patterns
     --------------------------------------------------------- */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* ---------------------------------------------------------
     Luk menu med Escape-tasten
     Og sæt fokus tilbage på burger-knappen (accessibility)
     --------------------------------------------------------- */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        burgerRef.current?.focus(); // fokus tilbage på burger-knap
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* -----------------------------------------------------
         Topbar – har baggrundsbillede på forsiden
         På indersider vises logo i venstre side
      ----------------------------------------------------- */}
      <header
        className={`${styles.topbar} ${
          pathname === "/" ? styles.homeNav : ""
        }`}
      >
        {/* Skjul logo på forsiden — det ligger i hero-billedet */}
        {!isHome && (
          <NavLink
            to="/"
            className={styles.topbarLogo}
            aria-label="Gå til forside"
            onClick={closeMenu}
          >
            <img
              src={logo}
              alt="Gittes Glamping"
              className={styles.topbarLogoImg}
            />
          </NavLink>
        )}

        {/* Burger-menu knap */}
        <button
          ref={burgerRef}
          className={styles.burger}
          aria-label={isOpen ? "Luk menu" : "Åbn menu"}
          aria-expanded={isOpen}
          aria-controls="mobileMenu"
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* -----------------------------------------------------
         Selve mobilmenuen
         Klik på overlay-lag lukker menuen
      ----------------------------------------------------- */}
      <nav
        id="mobileMenu"
        ref={menuRef}
        className={`${styles.mobileMenu} ${isOpen ? styles.active : ""}`}
        aria-hidden={!isOpen}
        onClick={(e) => {
          // hvis man klikker uden for menuen (overlay) → luk
          if (e.target === e.currentTarget) closeMenu();
        }}
      >
        {/* Luk-knap (kryds) */}
        <button
          className={styles.closeBtn}
          aria-label="Luk menu"
          onClick={closeMenu}
        >
          &times;
        </button>

        {/* -----------------------------------------------------
           NavLinks – alle sider i navigationen
        ----------------------------------------------------- */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${styles.menuLink} ${isActive ? styles.menuLinkActive : ""}`
          }
          onClick={closeMenu}
        >
          Forside
        </NavLink>

        <NavLink
          to="/stays"
          className={({ isActive }) =>
            `${styles.menuLink} ${isActive ? styles.menuLinkActive : ""}`
          }
          onClick={closeMenu}
        >
          Ophold
        </NavLink>

        <NavLink
          to="/activities"
          className={({ isActive }) =>
            `${styles.menuLink} ${isActive ? styles.menuLinkActive : ""}`
          }
          onClick={closeMenu}
        >
          Aktiviteter
        </NavLink>

        <NavLink
          to="/liked"
          className={({ isActive }) =>
            `${styles.menuLink} ${isActive ? styles.menuLinkActive : ""}`
          }
          onClick={closeMenu}
        >
          Min liste
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `${styles.menuLink} ${isActive ? styles.menuLinkActive : ""}`
          }
          onClick={closeMenu}
        >
          Kontakt
        </NavLink>

        {/* Mine beskeder – gemte formular-beskeder */}
        <NavLink
          to="/messages"
          className={({ isActive }) =>
            `${styles.menuLink} ${isActive ? styles.menuLinkActive : ""}`
          }
          onClick={closeMenu}
        >
          Mine beskeder
        </NavLink>
      </nav>
    </>
  );
};

export default Navigation;
