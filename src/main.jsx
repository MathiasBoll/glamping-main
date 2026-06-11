// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Stays from "./pages/Stays.jsx";
import Activities from "./pages/Activities.jsx";
import ActivityDetails from "./pages/ActivityDetails.jsx";
import StayDetails from "./components/stayDetails/StayDetails";
import LikedActivities from "./pages/LikedActivities.jsx";
import Contact from "./pages/Contact.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import Backoffice from "./pages/Backoffice.jsx";
import BackofficeLogin from "./pages/BackofficeLogin.jsx";
import BeskyttetRute from "./components/admin/BeskyttetRute.jsx";
import Backend from "./pages/Backend";
import Eksamen from "./pages/Eksamen.jsx";
import {
    reviewsLoader,
    activitiesLoader,
    staysLoader,
    stayDetailsLoader,
    activityDetailsLoader,
    backofficeLoader,
} from "./loaders/DataLoaders.js";

const router = createBrowserRouter([
    {
        element: <App />,
        children: [
            { path: "/", element: <Home />, loader: reviewsLoader },
            { path: "/stays", element: <Stays />, loader: staysLoader },
            { path: "/stay/:id", element: <StayDetails />, loader: stayDetailsLoader },
            { path: "/activities", element: <Activities />, loader: activitiesLoader },
            { path: "/activity/:id", element: <ActivityDetails />, loader: activityDetailsLoader },
            { path: "/liked", element: <LikedActivities /> },
            { path: "/login", element: <UserLogin /> },
            { path: "/contact", element: <Contact /> },
            { path: "/backoffice/login", element: <BackofficeLogin /> },
            {
                element: <BeskyttetRute />,
                children: [
                    { path: "/backoffice", element: <Backoffice />, loader: backofficeLoader },
                ],
            },
            { path: "/backend", element: <Backend /> },
            { path: "/eksamen", element: <Eksamen /> },
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);