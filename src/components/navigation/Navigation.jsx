import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./navigation.module.css";
import logo from "/logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  const menuRef = useRef(null);
  const burgerRef = useRef(null);

  const isHome = pathname === "/";

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
      <header
        className={`${styles.topbar} ${
          pathname === "/" ? styles.homeNav : ""
        }`}
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

      <nav
        id="mobileMenu"
        ref={menuRef}
        className={`${styles.mobileMenu} ${isOpen ? styles.active : ""}`}
        aria-hidden={!isOpen}
        onClick={(e) => {
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

        <NavLink
          to="/activities"
          className={({ isActive }) =>
            `${styles.menuLink} ${isActive ? styles.menuLinkActive : ""}`
          }
          onClick={closeMenu}
        >
          Aktiviteter
        </NavLink>

        {/* 🔹 NYT PUNKT: Min liste */}
        <NavLink
          to="/liked"
          className={({ isActive }) =>
            `${styles.menuLink} ${isActive ? styles.menuLinkActive : ""}`
          }
          onClick={closeMenu}
        >
          Min liste
        </NavLink>
      </nav>
    </>
  );
};

export default Navigation;
