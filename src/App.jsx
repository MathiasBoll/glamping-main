import { useRoutes } from "react-router";
import "./App.css";

import Home from "./pages/Home.jsx";
import Stays from "./pages/Stays.jsx";
import Activities from "./pages/Activities.jsx";
import ActivityDetails from "./pages/ActivityDetails.jsx";
import LikedActivities from "./pages/LikedActivities.jsx";

import StayDetails from "./components/stayDetails/StayDetails";
import Navigation from "./components/navigation/Navigation";
import Footer from "./components/footer/Footer";

function App() {
  const routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/stays", element: <Stays /> },
    { path: "/stay/:id", element: <StayDetails /> },
    { path: "/activities", element: <Activities /> },
    { path: "/activity/:id", element: <ActivityDetails /> },
    { path: "/liked", element: <LikedActivities /> }, // 🔹 NY
  ]);

  return (
    <div className="app">
      <Navigation />
      <main>{routes}</main>
      <Footer />
    </div>
  );
}

export default App;
