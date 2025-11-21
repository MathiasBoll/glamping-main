// Import af komponenter der bruges på siden
import InfoSection from "../components/infoSection/InfoSection";
import PageHeader from "../components/pageHeader/PageHeader";
import StaysSection from "../components/staysSection/StaysSection";

/*
  Stays.jsx fungerer som en **parent/overordnet side-komponent**.
  Den samler tre child-komponenter:
  - PageHeader: viser hero-billedet og sidens titel
  - InfoSection: info-tekst om ophold (her med overrides)
  - StaysSection: liste over glamping-ophold hentet fra API

  Parent-komponenten er ansvarlig for at bestemme,
  hvordan disse child-komponenter sættes sammen.
*/

const Stays = () => {
  return (
    <article>
      {/* 
        PageHeader uden props → PageHeader selv finder ud af,
        at siden er en "stays"-side ud fra URL'en,
        og viser hero med teksten: "Vores ophold".
      */}
      <PageHeader />

      {/*
        InfoSection med override-props:
        - titleOverride: erstatter API- eller fallback-teksten med vores egen
        - bodyOverride: erstatter standardbrødtekst
        - showImage={false}: skjuler runde Gitte-billedet
        - showButton={false}: skjuler CTA-knappen ("Se ophold")
        
        Denne InfoSection fungerer som introduktion til ophold-siden.
      */}
      <InfoSection
        titleOverride="Vi har ophold til enhver smag"
        bodyOverride={`Vores glampingophold er skabt til at tilbyde en kombination af eventyr og afslapning. Det er den ideelle flugt fra byens støj og stress, og det perfekte sted at genoplade batterierne i en naturskøn indstilling.
        
Book dit ophold i dag og giv dig selv lov til at fordybe dig i naturen og nyde luksus i det fri. Vi ser frem til at byde dig velkommen til en oplevelse fyldt med komfort, eventyr og skønhed.`}
        showImage={false}
        showButton={false}
      />

      {/*
        StaysSection:
        Henter alle stays fra API'et
        og viser dem som Stay-kort (child-komponenten "Stay").
      */}
      <StaysSection />
    </article>
  );
};

export default Stays;
