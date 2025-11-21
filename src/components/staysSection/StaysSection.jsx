// src/components/staysSection/StaysSection.jsx

import { useEffect, useState } from "react";
import Stay from "../stay/stay";

/*
  StaysSection
  -----------------------------------------------------
  Denne komponent henter alle ophold fra API'et og
  viser dem i en liste. Hvert ophold bliver vist som
  et <Stay>-kort, som er ansvarlig for selve layoutet.
*/
const StaysSection = () => {
  // stays = liste af ophold fra API
  // setStays = opdaterer stays
  const [stays, setStays] = useState([]);

  /*
    fetchStays()
    ---------------------------------------------------
    Asynkron funktion der henter data fra backend-API’et.
    Hvis API-kaldet lykkes, gemmes resultatet i state.
    Hvis noget går galt, logges fejlen i konsollen.
  */
  const fetchStays = async () => {
    try {
      const response = await fetch(
        "https://glamping-rqu9j.ondigitalocean.app/stays"
      );

      const data = await response.json();

      console.log(data); // Debug: viser hvad API’et returnerer

      setStays(data.data); // Gemmer listen af ophold i state
    } catch (error) {
      console.log("Fejl ved hentning af ophold:", error);
    }
  };

  /*
    useEffect()
    ---------------------------------------------------
    Et React-hook der sikrer, at fetchStays() kun
    bliver kørt én gang når komponenten loader.
    Den tomme afhængighedsliste [] betyder:
    "kør kun ved første render".
  */
  useEffect(() => {
    fetchStays();
  }, []);

  return (
    <section className="container">
      {/* Title fjernet da stays-styling håndterer egne overskrifter */}
      <h1></h1>

      {/*
        Vi mapper stays-arrayet og viser et <Stay>-kort
        for hvert element.

        key={stay._id} giver React en unik identifikator,
        så listen kan opdateres effektivt.
      */}
      {stays.map((stay) => (
        <Stay stay={stay} key={stay._id} />
      ))}
    </section>
  );
};

export default StaysSection;
