import InfoSection from "../components/infoSection/InfoSection";
import PageHeader from "../components/pageHeader/PageHeader";
import StaysSection from "../components/staysSection/StaysSection";

// Stays.jsx er parent/forældre komponenten, fordi den er ansvarlig for PageHeader/child/barns visning
const Stays = () => {
  return (
    <article>
      <PageHeader titleOne='Vores ophold' />
      {/* InfoSection */}
      <InfoSection />
      {/* Stays */}

      <StaysSection/>
    </article>
  );
};

export default Stays;
