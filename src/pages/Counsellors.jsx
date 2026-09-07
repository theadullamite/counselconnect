import { useEffect, useState } from "react";
import CounsellorCard from "../components/CounsellorCard";
import { supabase } from "../lib/supabase";

import counsellors from "../data/counsellors";

import "./Counsellors.css";

function Counsellors() {
  const [displayCounsellors, setDisplayCounsellors] = useState(counsellors);

  useEffect(() => {
    async function loadCounsellorProfiles() {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, specialty, description, experience")
        .eq("role", "counsellor");

      if (error) {
        console.error("Error loading counsellor profiles:", error);
        return;
      }

      const mergedCounsellors = counsellors.map((counsellor) => {
        const profile = data.find(
          (item) => item.id === counsellor.profileId
        );

        if (!profile) {
          return counsellor;
        }

        return {
          ...counsellor,
          name: profile.full_name,
          specialty: profile.specialty,
          description: profile.description,
          experience: profile.experience,
        };
      });

      setDisplayCounsellors(mergedCounsellors);
    }

    loadCounsellorProfiles();
  }, []);

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
            {displayCounsellors.map((counsellor) => (
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