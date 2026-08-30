import CounsellorCard from "../components/CounsellorCard";
import counsellors from "../data/counsellors";
import "./Counsellors.css";

function Counsellors() {
    return (
        <main className="counsellors-page">

            <section className="counsellors-header">
                <div className="section-container">
                    <span className="section-eyebrow">
                        Find your counsellor
                    </span>

                    <h1>
                        Find the right support for you.
                    </h1>

                    <p>
                        Explore our counsellors and find someone whose
                        experience and areas of expertise match your needs.
                    </p>
                </div>
            </section>

            <section className="counsellors-directory">
                <div className="section-container">

                    <div className="counsellors-grid">
                        {counsellors.map((counsellor) => (
                            <CounsellorCard 
                            key={counsellor.id}
                            counsellor={counsellor}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Counsellors;