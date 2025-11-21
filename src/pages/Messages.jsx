// src/pages/Messages.jsx
import { useEffect, useState } from "react";
import PageHeader from "../components/pageHeader/PageHeader";
import styles from "./Messages.module.css";

const STORAGE_KEY = "sentMessages";

const loadMessages = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const saveMessages = (arr) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

const Messages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const list = loadMessages();
    // seneste først
    list.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    setMessages(list);
  }, []);

  const refresh = () => {
    const list = loadMessages();
    list.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    setMessages(list);
  };

  const handleDeleteOne = (idx) => {
    const full = loadMessages();
    if (idx < 0 || idx >= full.length) return;
    full.splice(idx, 1);
    if (full.length) saveMessages(full);
    else localStorage.removeItem(STORAGE_KEY);
    refresh();
  };

  const handleDeleteAll = () => {
    if (!window.confirm("Vil du slette alle sendte beskeder?")) return;
    localStorage.removeItem(STORAGE_KEY);
    refresh();
  };

  return (
    <>
      <PageHeader titleOne="Mine" titleTwo="beskeder" bgImg={null} />

      <main className={styles.messagesMain}>
        <div id="messages" className={styles.messagesInner}>
          {messages.length === 0 ? (
            <div className={styles.msgEmpty}>
              <h2>Mine beskeder</h2>
              <p>Du har ingen gemte beskeder endnu.</p>
            </div>
          ) : (
            <div className={styles.msgList}>
              <div className={styles.msgHead}>
                <h2>Mine beskeder</h2>
                <div className={styles.msgActions}>
                  <span className={styles.count}>
                    {messages.length} besked
                    {messages.length === 1 ? "" : "er"}
                  </span>
                  <button
                    type="button"
                    className={styles.deleteAllButton}
                    onClick={handleDeleteAll}
                  >
                    Slet alle
                  </button>
                </div>
              </div>

              {messages.map((msg, index) => (
                <div key={index} className={styles.msgItem}>
                  <h3>{msg.subject || "Ingen emne"}</h3>
                  <p>
                    <strong>Navn:</strong> {msg.name || "-"}
                  </p>
                  <p>
                    <strong>Email:</strong> {msg.email || "-"}
                  </p>
                  <p>
                    <strong>Besked:</strong> {msg.message || "-"}
                  </p>
                  <p className={styles.msgTs}>
                    {new Date(msg.ts || Date.now()).toLocaleString("da-DK")}
                  </p>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleDeleteOne(index)}
                    >
                      Slet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Messages;
