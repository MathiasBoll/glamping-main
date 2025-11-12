const Stay = ({ stay }) => {
  console.log(stay);
  return (
    <figure>
      <img src={stay.image} alt={stay.title} />
    </figure>
  );
};

export default Stay;
