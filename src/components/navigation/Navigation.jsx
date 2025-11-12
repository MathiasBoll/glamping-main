import { NavLink } from "react-router";
import styles from "./navigation.module.css";

/* Når brugeren klikker på fx /stays bliver Stays komponenten/siden vist - uden at siden genindlæses. 
Dvs at det er den samme html side der vises, men indholdet skifter alt efter hvad der står i url'en*/

const Navigation = () => {
  return (
    <nav className={styles.navigation}>
      <ul>
        <li>
          <NavLink to='/'>Forside</NavLink>
        </li>
        <li>
          <NavLink to='/stays'>Ophold</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
