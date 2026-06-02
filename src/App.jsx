// src/App.jsx

// useRoutes gør det muligt at definere alle routes i én samlet konfiguration
import { useRoutes, useLocation } from "react-router";

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
import Backoffice from "./pages/Backoffice.jsx";
import BackofficeLogin from "./pages/BackofficeLogin.jsx";
import BeskyttetRute from "./components/admin/BeskyttetRute.jsx";
import Backend from "./pages/Backend";

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
<<<<<<< HEAD
    { path: "/", element: <Home /> },                 // Forside
    { path: "/stays", element: <Stays /> },           // Oversigt over ophold
    { path: "/stay/:id", element: <StayDetails /> },  // Single stay side

    { path: "/activities", element: <Activities /> },           // Aktivitetsoversigt
    { path: "/activity/:id", element: <ActivityDetails /> },    // Single aktivitet

    { path: "/liked", element: <LikedActivities /> }, // Gemte (likede) aktiviteter

    { path: "/contact", element: <Contact /> },       // Kontaktformular

    // Backoffice er beskyttet — kræver login via /backoffice/login
    { path: "/backoffice/login", element: <BackofficeLogin /> },
    {
      element: <BeskyttetRute />,
      children: [
        { path: "/backoffice", element: <Backoffice /> },
      ],
    },

    { path: "/backend", element: <Backend /> },
  ]);

  const { pathname } = useLocation();
  const isBackoffice = pathname.startsWith('/backoffice');

  return (
    <div className="app">
      {/* Navigation og Footer skjules på backoffice-sider */}
      {!isBackoffice && <Navigation />}

      <ToastContainer position="top-center" theme="colored" />

      <main>{routes}</main>

      {!isBackoffice && <Footer />}
    </div>
  );
}

export default App;
