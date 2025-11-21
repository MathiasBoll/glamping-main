// src/pages/Messages.jsx
// ------------------------------------------------------------
// "Mine beskeder"-siden
// - Henter brugerens sendte beskeder fra localStorage
// - Viser dem i kort (nyeste først)
// - Giver mulighed for at slette én besked eller alle
// ------------------------------------------------------------

import { useEffect, useState } from "react";
import PageHeader from "../components/pageHeader/PageHeader";
import styles from "./Messages.module.css";

// Nøgle til localStorage (samme som Contact.jsx gemmer i)
const STORAGE_KEY = "sentMessages";

// Henter beskeder fra localStorage.
// Hvis der ikke findes noget, returnerer vi en tom liste.
const loadMessages = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

// Gemmer en opdateret beskedliste tilbage i localStorage.
const saveMessages = (arr) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

const Messages = () => {
  // State til beskederne, som vises på siden.
  const [messages, setMessages] = useState([]);

  // useEffect kører én gang når komponenten mountes:
  // 1) hent beskeder
  // 2) sorter nyeste først
  // 3) gem i state
  useEffect(() => {
    const list = loadMessages();

    // Sortering: seneste besked øverst
    list.sort((a, b) => (b.ts || 0) - (a.ts || 0));

    setMessages(list);
  }, []);

  // Helper der genindlæser listen efter sletning
  const refresh = () => {
    const list = loadMessages();
    list.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    setMessages(list);
  };

  // Slet én besked ud fra index
  const handleDeleteOne = (idx) => {
    const full = loadMessages();

    // Guard: hvis index er udenfor listen
    if (idx < 0 || idx >= full.length) return;

    // Fjern den valgte besked
    full.splice(idx, 1);

    // Hvis der stadig er beskeder → gem listen
    // Ellers fjern helt nøglen fra localStorage
    if (full.length) saveMessages(full);
    else localStorage.removeItem(STORAGE_KEY);

    // Opdater UI
    refresh();
  };

  // Slet alle beskeder
  const handleDeleteAll = () => {
    // Konfirmation før alt slettes
    if (!window.confirm("Vil du slette alle sendte beskeder?")) return;

    localStorage.removeItem(STORAGE_KEY);
    refresh();
  };

  return (
    <>
      {/* Hero (samme hero-billede som Kontakt via PageHeader-config) */}
      <PageHeader titleOne="Mine" titleTwo="beskeder" />

      <main className={styles.messagesMain}>
        <div id="messages" className={styles.messagesInner}>
          {/* Tom tilstand */}
          {messages.length === 0 ? (
            <div className={styles.msgEmpty}>
              <h2>Mine beskeder</h2>
              <p>Du har ingen gemte beskeder endnu.</p>
            </div>
          ) : (
            // Liste med besked-kort
            <div className={styles.msgList}>
              {/* Header over listen */}
              <div className={styles.msgHead}>
                <h2>Mine beskeder</h2>

                {/* Actions: tæller + slet alle */}
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

              {/* Kort for hver besked */}
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

                  {/* Timestamp – vises som dansk dato/tid */}
                  <p className={styles.msgTs}>
                    {new Date(msg.ts || Date.now()).toLocaleString("da-DK")}
                  </p>

                  {/* Slet-knap for den enkelte besked */}
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
