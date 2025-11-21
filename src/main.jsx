// src/main.jsx

// StrictMode hjælper med at opdage potentielle fejl i udvikling.
// Det påvirker IKKE produktionen—kun udviklingsmiljøet.
import { StrictMode } from "react";

// createRoot er den moderne måde at “montere” React-appen i DOM’en.
import { createRoot } from "react-dom/client";

// App er vores hovedkomponent, der indeholder hele applikationen.
import App from "./App.jsx";

// BrowserRouter gør det muligt at bruge routing (URL-baseret navigation).
import { BrowserRouter } from "react-router-dom";

/* 
  BrowserRouter skal ligge omkring hele App.

  Det betyder:
  - at alle child-komponenter får adgang til routing-funktioner
    (useNavigate, NavLink, useParams, useLocation m.fl.)
  - at appen reagerer på ændringer i URL’en uden at reloade siden
  - at vores <Navigation />, <PageHeader /> osv. kan bruge routerens data

  Hvis BrowserRouter IKKE lå yderst:
  → ingen navigation
  → ingen dynamiske sider
  → ingen single-view (stay/activity details)
*/

// Vi finder HTML-elementet med id="root" og “mount’er” React i det.
// createRoot er React 18’s nye metode, som giver performance-fordele.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Routeren omringer hele appen og giver adgang til routes overalt */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
