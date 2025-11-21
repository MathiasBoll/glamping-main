// src/App.jsx

// useRoutes gør det muligt at definere alle routes i én samlet konfiguration
import { useRoutes } from "react-router";

// Global styling for app-wrapperen
import "./App.css";

// Import af alle sider (pages)
import Home from "./pages/Home.jsx";
import Stays from "./pages/Stays.jsx";
import Activities from "./pages/Activities.jsx";
import ActivityDetails from "./pages/ActivityDetails.jsx";
import StayDetails from "./components/stayDetails/StayDetails";
import LikedActivities from "./pages/LikedActivities.jsx";
import Contact from "./pages/Contact.jsx";
import Messages from "./pages/Messages.jsx";

// Navigation og Footer er globale komponenter på ALLE sider
import Navigation from "./components/navigation/Navigation";
import Footer from "./components/footer/Footer";

// Toast-container til feedback-beskeder (krav i opgaven)
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // useRoutes læser et array af route-objekter og returnerer
  // den komponent som matcher URL’en. Det fungerer som et mini-router-setup.
  const routes = useRoutes([
    { path: "/", element: <Home /> },                 // Forside
    { path: "/stays", element: <Stays /> },           // Oversigt over ophold
    { path: "/stay/:id", element: <StayDetails /> },  // Single stay side

    { path: "/activities", element: <Activities /> },           // Aktivitetsoversigt
    { path: "/activity/:id", element: <ActivityDetails /> },    // Single aktivitet

    { path: "/liked", element: <LikedActivities /> }, // Gemte (likede) aktiviteter

    { path: "/contact", element: <Contact /> },       // Kontaktformular
    { path: "/messages", element: <Messages /> },     // Mine beskeder (fra kontakt)
  ]);

  return (
    // App-wrapper som holder header, main og footer samlet
    <div className="app">

      {/* Navigation ligger altid øverst – også på single-sider */}
      <Navigation />

      {/* Toast-container: bruges til feedback ved fx kontaktform */}
      <ToastContainer position="top-center" theme="colored" />

      {/* Hovedindhold – routes inde i <main> hjælper SEO og struktur */}
      <main>{routes}</main>

      {/* Footer vises på ALLE sider */}
      <Footer />
    </div>
  );
}

export default App;
