// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

/* BrowserRouter skal være 'container' for App (altså hele projektet).
   Den fungerer som en 'provider', der sørger for at render forskelligt
   indhold (komponenter) baseret på URL'en.
*/

// Her hentes html-elementet med id'et 'root' fra DOM'en, og React kobles på.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
