// src/pages/Home.jsx
import { useLoaderData } from "react-router";
import InfoSection from "../components/infoSection/InfoSection";
import PageHeader from "../components/pageHeader/PageHeader";
import Reviews from "../components/reviews/Reviews";

const Home = () => {
    const reviews = useLoaderData();

    return (
        <article>
            <PageHeader />
            <InfoSection />
            <Reviews reviews={reviews} />
        </article>
    );
};

export default Home;