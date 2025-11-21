// src/App.jsx
import { useRoutes } from "react-router";
import "./App.css";

import Home from "./pages/Home.jsx";
import Stays from "./pages/Stays.jsx";
import Activities from "./pages/Activities.jsx";
import ActivityDetails from "./pages/ActivityDetails.jsx";
import StayDetails from "./components/stayDetails/StayDetails";
import LikedActivities from "./pages/LikedActivities.jsx";
import Contact from "./pages/Contact.jsx";
import Messages from "./pages/Messages.jsx";

import Navigation from "./components/navigation/Navigation";
import Footer from "./components/footer/Footer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/stays", element: <Stays /> },
    { path: "/stay/:id", element: <StayDetails /> },
    { path: "/activities", element: <Activities /> },
    { path: "/activity/:id", element: <ActivityDetails /> },
    { path: "/liked", element: <LikedActivities /> },
    { path: "/contact", element: <Contact /> },
    { path: "/messages", element: <Messages /> },
  ]);

  return (
    <div className="app">
      <Navigation />
      <ToastContainer position="top-center" theme="colored" />
      <main>{routes}</main>
      <Footer />
    </div>
  );
}

export default App;
