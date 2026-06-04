// src/pages/Stays.jsx
import { useLoaderData } from "react-router";
import InfoSection from "../components/infoSection/InfoSection";
import PageHeader from "../components/pageHeader/PageHeader";
import StaysSection from "../components/staysSection/StaysSection";

const Stays = () => {
    const stays = useLoaderData();

    return (
        <article>
            <PageHeader />
            <InfoSection
                titleOverride="Vi har ophold til enhver smag"
                bodyOverride="Vores glampingophold er skabt til at tilbyde en kombination af eventyr og afslapning."
                showImage={false}
                showButton={false}
            />
            <StaysSection stays={stays} />
        </article>
    );
};

export default Stays;