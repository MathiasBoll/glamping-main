import { useEffect, useState } from "react";
import Stay from "../stay/stay";

const StaysSection = () => {
  const [stays, setStays] = useState([]);

  const fetchStays = async () => {
    try {
      const response = await fetch(
        "https://glamping-rqu9j.ondigitalocean.app/stays"
      );

      const data = await response.json();

      console.log(data);

      setStays(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Indbygget hook fra React der sørger for, at funktionen kun køre én gang når komponenten renderes/mountes.
  // Medmindre der tilføjes en afhængighed.
  useEffect(() => {
    fetchStays();
  }, []);

  return (
    <section className='container'>
      <h1>STAYS</h1>
      {stays.map((stay) => (
        <Stay stay={stay} key={stay._id} />
      ))}
    </section>
  );
};

export default StaysSection;
