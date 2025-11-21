// src/pages/Home.jsx

// Import af sektioner som tilsammen udgør forsiden
import InfoSection from "../components/infoSection/InfoSection";
import PageHeader from "../components/pageHeader/PageHeader";
import Reviews from "../components/reviews/Reviews";

/*
  Home-siden er meget simpel:
  - Øverst vises PageHeader (hero-sektionen)
  - Derefter InfoSection (intro-tekst + billede + CTA-knap)
  - Nederst Reviews (udtalelser fra gæster)
*/

const Home = () => {
  return (
    <article>
      {/* HERO / forsideheader */}
      <PageHeader />

      {/* Info-sektion med tekst, billede og “Se vores ophold” knap */}
      <InfoSection />

      {/* Sektion med gæsteanmeldelser hentet fra API */}
      <Reviews />
    </article>
  );
};

export default Home;
