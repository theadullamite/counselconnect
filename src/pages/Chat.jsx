import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function Chat() {
  const { conversationId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [conversation, setConversation] = useState(null);

  useEffect(() => {
    async function loadConversation() {
      if (!user || !conversationId) {
        return;
      }

      const { data, error } = await supabase
        .from("conversations")
        .select(
          `
          *,
          client:profiles!conversations_client_id_fkey (
            full_name
          ),
          counsellor:profiles!conversations_counsellor_id_fkey (
            full_name
          )
          `,
        )
        .eq("id", conversationId)
        .single();

      if (error) {
        console.error("Error loading conversation:", error);
        setErrorMessage(error.message);
        return;
      }

      setConversation(data);
    }

    loadConversation();
  }, [user, conversationId]);

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

  async function sendMessage(event) {
    event.preventDefault();

    const trimmedMessage = newMessage.trim();

    if (!trimmedMessage || !user || !conversationId) {
      return;
    }

    setSendingMessage(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: trimmedMessage,
      })
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      setErrorMessage(error.message);
      setSendingMessage(false);
      return;
    }

    setMessages((currentMessages) => [...currentMessages, data]);
    setNewMessage("");
    setSendingMessage(false);
  }

  const otherPersonName =
    user?.id === conversation?.client_id
      ? conversation?.counsellor?.full_name
      : conversation?.client?.full_name;

  const otherPersonRole =
    user?.id === conversation?.client_id ? "Counsellor" : "Client";

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <section className="dashboard-header">
          <span className="section-eyebrow">Messages</span>

          <h1>
            {otherPersonName
              ? `Chat with ${otherPersonName}`
              : "Chat"}
          </h1>

          <p>
            {otherPersonName
              ? `${otherPersonRole} · Communicate securely through CounselConnect.`
              : "Communicate securely through CounselConnect."}
          </p>
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

          <form className="chat-form" onSubmit={sendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
              placeholder="Type a message..."
              disabled={sendingMessage}
            />

            <button
              type="submit"
              disabled={sendingMessage || !newMessage.trim()}
            >
              {sendingMessage ? "Sending..." : "Send"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}