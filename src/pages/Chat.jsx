import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

function Chat() {
  const { conversationId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadMessages() {
      if (!user || !conversationId) {
        setLoadingMessages(false);
        return;
      }

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading messages:", error);
        setErrorMessage(error.message);
        setLoadingMessages(false);
        return;
      }

      setMessages(data || []);
      setLoadingMessages(false);
    }

    loadMessages();
  }, [user, conversationId]);

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <section className="dashboard-header">
          <span className="section-eyebrow">Messages</span>

          <h1>Chat</h1>

          <p>Communicate securely with your counsellor.</p>
        </section>

        <section className="chat-container">
          {loadingMessages && <p>Loading messages...</p>}

          {errorMessage && (
            <p className="dashboard-error">{errorMessage}</p>
          )}

          {!loadingMessages &&
            !errorMessage &&
            messages.length === 0 && (
              <p>No messages yet.</p>
            )}

          {!loadingMessages &&
            !errorMessage &&
            messages.length > 0 && (
              <div className="chat-messages">
                {messages.map((message) => (
                  <div className="chat-message" key={message.id}>
                    <p>{message.content}</p>

                    <small>
                      {new Date(message.created_at).toLocaleString()}
                    </small>
                  </div>
                ))}
              </div>
            )}
        </section>
      </div>
    </main>
  );
}

export default Chat;