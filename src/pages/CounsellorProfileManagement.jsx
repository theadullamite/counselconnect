import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

import { supabase } from "../lib/supabase";

function CounsellorProfileManagement() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  async function saveProfile() {
    setSavingProfile(true);
    setProfileError("");
    setSuccessMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({
        specialty: profile.specialty,
        description: profile.description,
        experience: Number(profile.experience),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating counsellor profile:", error);
      setProfileError(error.message);
      setSavingProfile(false);
      return;
    }

    setProfile((currentProfile) => ({
      ...currentProfile,
      experience: Number(currentProfile.experience),
    }));

    setIsEditing(false);
    setSuccessMessage("Profile updated successfully.");
    setSavingProfile(false);
  }

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setLoadingProfile(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, role, specialty, description, experience")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching counsellor profile:", error);

        setProfileError(error.message);
        setLoadingProfile(false);
        return;
      }

      setProfile(data);
      setLoadingProfile(false);
    }

    fetchProfile();
  }, [user]);

  if (loadingProfile) {
    return <p>Loading profile...</p>;
  }

  if (profileError) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-container">
          <p className="dashboard-error">{profileError}</p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-container">
          <p>Profile not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <section className="dashboard-header">
          <span className="section-eyebrow">My Profile</span>

          <h1>{profile.full_name}</h1>

          <p>Manage your professional information on CounselConnect.</p>
        </section>

        <section className="dashboard-card">
          <h2>Professional Information</h2>

          {successMessage && <p>{successMessage}</p>}

          {!isEditing ? (
            <>
              <p>
                <strong>Specialty:</strong>{" "}
                {profile.specialty || "Not provided"}
              </p>

              <p>
                <strong>Experience:</strong>{" "}
                {profile.experience
                  ? `${profile.experience} years`
                  : "Not provided"}
              </p>

              <p>
                <strong>About:</strong>
              </p>

              <p>{profile.description || "No description provided."}</p>

              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  setSuccessMessage("");
                }}
              >
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="specialty">Specialty</label>

                <input
                  id="specialty"
                  type="text"
                  value={profile.specialty || ""}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      specialty: event.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label htmlFor="experience">Years of Experience</label>

                <input
                  id="experience"
                  type="number"
                  min="0"
                  value={profile.experience || ""}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      experience: event.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label htmlFor="description">Professional Description</label>

                <textarea
                  id="description"
                  rows="6"
                  value={profile.description || ""}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      description: event.target.value,
                    })
                  }
                />
              </div>

              <div className="appointment-actions">
                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={savingProfile}
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSuccessMessage("");
                  }}
                  disabled={savingProfile}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default CounsellorProfileManagement;
