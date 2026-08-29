import { Link } from "react-router-dom";

function CounsellorCard({ counsellor }) {
    return (
        <article className="counsellor-card">
            <div className="counsellor-card-image">
                <span>
                    {counsellor.name.charAt(0)}
                </span>
            </div>

            <div className="counsellor-card-content">
                <p className="counsellor-card-specialty">
                    {counsellor.specialty}
                </p>

                <h3>{counsellor.name}</h3>

                <p className="counsellor-card-footer">
                    {counsellor.description}
                </p>

                <div className="counsellor-card-footer">
                    <span>
                        {counsellor.experience} years experience
                    </span>

                    <Link to={`/counsellors/${counsellor.id}`}>
                        View Profile
                    </Link>
                </div>
            </div>
        </article>
    );
}


export default CounsellorCard;