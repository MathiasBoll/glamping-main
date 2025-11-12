import InfoSection from "../components/infoSection/InfoSection";
import PageHeader from "../components/pageHeader/PageHeader";
import Reviews from "../components/reviews/Reviews";
import logo from "/logo.png";

const Home = () => {
  return (
    <article>
      {/* Headeren på forsiden - i modsætning til på undersiden - indeholder logo og knap.
      Vi sender derfor props/properties/egenskaber med <PageHeader/>-komponenten,
      der viser dem hvis de har en værdi.
      */}
      <PageHeader logo={logo} titleOne='Gittes' titleTwo='Glamping' button />
      <InfoSection />
      <Reviews />
    </article>
  );
};

export default Home;
