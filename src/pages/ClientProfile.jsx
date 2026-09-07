import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

function ClientProfile() {
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setLoadingProfile(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error loading client profile:", error);
        setErrorMessage(error.message);
        setLoadingProfile(false);
        return;
      }

      setFullName(data.full_name || "");
      setLoadingProfile(false);
    }

    loadProfile();
  }, [user]);

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setErrorMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating client profile:", error);
      setErrorMessage(error.message);
      setSaving(false);
      return;
    }

    setMessage("Profile updated successfully.");
    setSaving(false);
  }

  if (loadingProfile) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-container">
          <p>Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <section className="dashboard-header">
          <span className="section-eyebrow">My Profile</span>

          <h1>Manage your profile</h1>

          <p>
            Update your profile information so your CounselConnect account
            stays up to date.
          </p>
        </section>

        <section className="profile-management-card">
          <form onSubmit={handleSubmit}>
            <div className="profile-form-group">
              <label htmlFor="fullName">Full Name</label>

              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            </div>

            {errorMessage && (
              <p className="dashboard-error">{errorMessage}</p>
            )}

            {message && <p>{message}</p>}

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default ClientProfile;