import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./navigation.module.css";
import logo from "/logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  const menuRef = useRef(null);
  const burgerRef = useRef(null);

  // Forside? → ingen logo i topbaren (kun burger)
  const isHome = pathname === "/";

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Lås body-scroll når menuen er åben
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ESC lukker menuen
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        burgerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* TOPBAR (logo + burger) */}
      <header className={`${styles.topbar} ${pathname === "/" ? styles.homeNav : ""}`}
>

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

      {/* OVERLAY-MENU */}
      <nav
        id="mobileMenu"
        ref={menuRef}
        className={`${styles.mobileMenu} ${isOpen ? styles.active : ""}`}
        aria-hidden={!isOpen}
        onClick={(e) => {
          // klik på baggrunden (ikke på links/indhold) → luk
          if (e.target === e.currentTarget) closeMenu();
        }}
      >
        <button
          className={styles.closeBtn}
          aria-label="Luk menu"
          onClick={closeMenu}
        >
          &times;
        </button>

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
      </nav>
    </>
  );
};

export default Navigation;
