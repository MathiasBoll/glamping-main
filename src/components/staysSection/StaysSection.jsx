// src/components/staysSection/StaysSection.jsx
import Stay from "../stay/stay";

// stays-prop leveres af Stays.jsx via useLoaderData()
const StaysSection = ({ stays = [] }) => {
    return (
        <section className="container">
            <h1></h1>
            {stays.map((stay) => (
                <Stay stay={stay} key={stay._id} />
            ))}
        </section>
    );
};

export default StaysSection;