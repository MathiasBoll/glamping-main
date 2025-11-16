import InfoSection from "../components/infoSection/InfoSection";
import PageHeader from "../components/pageHeader/PageHeader";
import StaysSection from "../components/staysSection/StaysSection";

// Stays.jsx er parent/forældre komponenten, fordi den er ansvarlig for PageHeader/child/barns visning
const Stays = () => {
  return (
    <article>
      <PageHeader /> {/* hero: Vores ophold */}

      {/* InfoSection med NY tekst, uden billede og uden knap */}
      <InfoSection
        titleOverride="Vi har ophold til enhver smag"
        bodyOverride={`Vores glampingophold er skabt til at tilbyde en kombination af eventyr og afslapning. Det er den ideelle flugt fra byens støj og stress, og det perfekte sted at genoplade batterierne i en naturskøn indstilling.
        
Book dit ophold i dag og giv dig selv lov til at fordybe dig i naturen og nyde luksus i det fri. Vi ser frem til at byde dig velkommen til en oplevelse fyldt med komfort, eventyr og skønhed.`}
        showImage={false}
        showButton={false}
      />

      <StaysSection />
    </article>
  );
};

export default Stays;
