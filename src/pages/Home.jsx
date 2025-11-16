import InfoSection from "../components/infoSection/InfoSection";
import PageHeader from "../components/pageHeader/PageHeader";
import Reviews from "../components/reviews/Reviews";

const Home = () => {
  return (
    <article>
      <PageHeader />
      <InfoSection />
      <Reviews />
    </article>
  );
};

export default Home;
