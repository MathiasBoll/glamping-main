// src/App.jsx
// Layout-komponent — Navigation, Footer og <Outlet /> som pladsholder for den aktive side.
// Alle ruter er defineret i main.jsx via createBrowserRouter.
import { Outlet, useLocation } from "react-router";
import "./App.css";
import Navigation from "./components/navigation/Navigation";
import Footer from "./components/footer/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const { pathname } = useLocation();
    const isBackoffice = pathname.startsWith("/backoffice");

    return (
        <div className="app">
            {/* Navigation og Footer skjules paa backoffice-sider */}
            {!isBackoffice && <Navigation />}

            <ToastContainer position="top-center" theme="colored" />

            {/* <Outlet /> rendrer den side-komponent som matcher URL'en */}
            <main>
                <Outlet />
            </main>

            {!isBackoffice && <Footer />}
        </div>
    );
}

export default App;