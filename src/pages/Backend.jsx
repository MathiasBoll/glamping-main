import { useEffect, useState } from "react";
import styles from "./backend.module.css";
import { normalizeActivityTitle } from "../utils/activityTitle";

const API = "http://localhost:3042";
const ADMIN_TOKEN = "glamping-admin-2026";
const AUTH = { Authorization: `Bearer ${ADMIN_TOKEN}` };

const TABS = ["Beskeder", "Anmeldelser", "Aktiviteter", "Ophold", "Bookinger"];

const Backend = () => {
  const [activeTab, setActiveTab] = useState("Beskeder");

  // ── Messages ──
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [showReply, setShowReply] = useState({});

  // ── Reviews ──
  const [reviews, setReviews] = useState([]);

  // ── Activities ──
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    title: "", date: "", time: "", description: "", image: "",
  });

  // ── Stays ──
  const [stays, setStays] = useState([]);
  const [newStay, setNewStay] = useState({
    title: "", numberOfPersons: "", price: "", image: "", teaser: "",
  });

  // ── Bookings ──
  const [bookings, setBookings] = useState([]);

  // ── Fetch on mount ──
  useEffect(() => { fetchMessages(); }, []);
  useEffect(() => {
    if (activeTab === "Anmeldelser") fetchReviews();
    if (activeTab === "Aktiviteter") fetchActivities();
    if (activeTab === "Ophold") fetchStays();
    if (activeTab === "Beskeder") fetchMessages();
    if (activeTab === "Bookinger") fetchBookings();
  }, [activeTab]);

  const fetchMessages = () =>
    fetch(`${API}/admin/messages`, { headers: AUTH }).then(r => r.json()).then(setMessages);
  const fetchReviews = () =>
    fetch(`${API}/admin/reviews`, { headers: AUTH }).then(r => r.json()).then(setReviews);
  const fetchActivities = () =>
    fetch(`${API}/activities`).then(r => r.json()).then(setActivities);
  const fetchStays = () =>
    fetch(`${API}/stays`).then(r => r.json()).then(setStays);
  const fetchBookings = () =>
    fetch(`${API}/admin/bookings`, { headers: AUTH }).then(r => r.json()).then(setBookings);

  // ── Message actions ──
  const updateStatus = (id, status) =>
    fetch(`${API}/admin/messages/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...AUTH },
      body: JSON.stringify({ status }),
    }).then(fetchMessages);

  const sendReply = (id) =>
    fetch(`${API}/admin/messages/${id}/reply`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...AUTH },
      body: JSON.stringify({ reply: replyText[id] }),
    }).then(() => {
      setReplyText(prev => ({ ...prev, [id]: "" }));
      setShowReply(prev => ({ ...prev, [id]: false }));
      fetchMessages();
    });

  const deleteMessage = (id) =>
    fetch(`${API}/admin/messages/${id}`, { method: "DELETE", headers: AUTH }).then(fetchMessages);

  // ── Review actions ──
  const toggleReviewVisibility = (review) =>
    fetch(`${API}/review/${review.id || review._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVisible: !review.isVisible }),
    }).then(fetchReviews);

  const deleteReview = (id) =>
    fetch(`${API}/review/${id}`, { method: "DELETE" }).then(fetchReviews);

  // ── Activity actions ──
  const createActivity = (e) => {
    e.preventDefault();
    fetch(`${API}/activity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newActivity),
    }).then(() => {
      setNewActivity({ title: "", date: "", time: "", description: "", image: "" });
      fetchActivities();
    });
  };

  const deleteActivity = (id) =>
    fetch(`${API}/activity/${id}`, { method: "DELETE" }).then(fetchActivities);

  // ── Stay actions ──
  const createStay = (e) => {
    e.preventDefault();
    fetch(`${API}/stay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStay),
    }).then(() => {
      setNewStay({ title: "", numberOfPersons: "", price: "", image: "", teaser: "" });
      fetchStays();
    });
  };

  const deleteStay = (id) =>
    fetch(`${API}/stay/${id}`, { method: "DELETE" }).then(fetchStays);

  // ── Booking actions ──
  const updateBookingStatus = (id, status) =>
    fetch(`${API}/admin/bookings/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...AUTH },
      body: JSON.stringify({ status }),
    }).then(fetchBookings);

  const deleteBooking = (id) =>
    fetch(`${API}/admin/bookings/${id}`, { method: "DELETE", headers: AUTH }).then(fetchBookings);

  const statusBadgeClass = (status) => {
    if (status === "ny") return styles.badgeNy;
    if (status === "læst") return styles.badgeLaest;
    if (status === "besvaret") return styles.badgeBesvaret;
    if (status === "arkiveret") return styles.badgeArkiveret;
    if (status === "bekræftet") return styles.badgeBesvaret;
    if (status === "aflyst") return styles.badgeArkiveret;
    return "";
  };

  return (
    <div className={styles.backend}>
      <div className={styles.header}>
        <h2>Admin Panel</h2>
      </div>

      <div className={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.content}>

        {/* ── BESKEDER ── */}
        {activeTab === "Beskeder" && (
          <section>
            <h3>Beskeder ({messages.length})</h3>
            {messages.length === 0 && <p className={styles.empty}>Ingen beskeder endnu.</p>}
            {messages.map(m => (
              <div key={m.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.cardName}>{m.name}</span>
                  <span className={styles.cardMeta}>{m.email}</span>
                  {m.category && <span className={styles.cardMeta}>— {m.category}</span>}
                  <span className={`${styles.badge} ${statusBadgeClass(m.status)}`}>{m.status}</span>
                  <span className={styles.cardDate}>{new Date(m.created).toLocaleDateString("da-DK")}</span>
                </div>
                <p className={styles.cardBody}>{m.message}</p>
                {m.reply && (
                  <p className={styles.replyPreview}><strong>Svar:</strong> {m.reply}</p>
                )}
                <div className={styles.cardActions}>
                  <button onClick={() => updateStatus(m.id, "læst")} className={styles.btnSecondary}>Marker læst</button>
                  <button onClick={() => updateStatus(m.id, "arkiveret")} className={styles.btnSecondary}>Arkiver</button>
                  <button
                    onClick={() => setShowReply(prev => ({ ...prev, [m.id]: !prev[m.id] }))}
                    className={styles.btnPrimary}
                  >
                    Svar
                  </button>
                  <button onClick={() => deleteMessage(m.id)} className={styles.btnDanger}>Slet</button>
                </div>
                {showReply[m.id] && (
                  <div className={styles.replyBox}>
                    <textarea
                      value={replyText[m.id] || ""}
                      onChange={e => setReplyText(prev => ({ ...prev, [m.id]: e.target.value }))}
                      placeholder='Skriv svar...'
                      rows={3}
                    />
                    <button onClick={() => sendReply(m.id)} className={styles.btnPrimary}>Send svar</button>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* ── ANMELDELSER ── */}
        {activeTab === "Anmeldelser" && (
          <section>
            <h3>Anmeldelser ({reviews.length})</h3>
            {reviews.length === 0 && <p className={styles.empty}>Ingen anmeldelser endnu.</p>}
            {reviews.map(r => (
              <div key={r.id || r._id} className={`${styles.card} ${!r.isVisible ? styles.cardHidden : ""}`}>
                <div className={styles.cardTop}>
                  <span className={styles.cardName}>{r.name}</span>
                  {r.age && <span className={styles.cardMeta}>{r.age} år</span>}
                  {r.stay && <span className={styles.cardMeta}>— {r.stay}</span>}
                  <span className={`${styles.badge} ${r.isVisible ? styles.badgeBesvaret : styles.badgeArkiveret}`}>
                    {r.isVisible ? "Synlig" : "Skjult"}
                  </span>
                </div>
                <p className={styles.cardBody}>{r.review}</p>
                <div className={styles.cardActions}>
                  <button onClick={() => toggleReviewVisibility(r)} className={styles.btnSecondary}>
                    {r.isVisible ? "Skjul" : "Vis"}
                  </button>
                  <button onClick={() => deleteReview(r.id || r._id)} className={styles.btnDanger}>Slet</button>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ── AKTIVITETER ── */}
        {activeTab === "Aktiviteter" && (
          <section>
            <h3>Aktiviteter ({activities.length})</h3>
            <form onSubmit={createActivity} className={styles.form}>
              <h4>Ny aktivitet</h4>
              <div className={styles.formGrid}>
                <input placeholder='Titel' value={newActivity.title} onChange={e => setNewActivity(p => ({ ...p, title: e.target.value }))} required />
                <input type='date' value={newActivity.date} onChange={e => setNewActivity(p => ({ ...p, date: e.target.value }))} required />
                <input type='time' value={newActivity.time} onChange={e => setNewActivity(p => ({ ...p, time: e.target.value }))} required />
                <input placeholder='Billede URL' value={newActivity.image} onChange={e => setNewActivity(p => ({ ...p, image: e.target.value }))} required />
                <textarea placeholder='Beskrivelse' value={newActivity.description} onChange={e => setNewActivity(p => ({ ...p, description: e.target.value }))} required className={styles.fullWidth} rows={2} />
              </div>
              <button type='submit' className={styles.btnPrimary}>Opret aktivitet</button>
            </form>

            {activities.length === 0 && <p className={styles.empty}>Ingen aktiviteter endnu.</p>}
            {activities.map(a => (
              <div key={a.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.cardName}>{normalizeActivityTitle(a.title)}</span>
                  <span className={styles.cardMeta}>{a.date} kl. {a.time}</span>
                  <span className={`${styles.badge} ${a.isActive ? styles.badgeBesvaret : styles.badgeArkiveret}`}>
                    {a.isActive ? "Aktiv" : "Inaktiv"}
                  </span>
                </div>
                <p className={styles.cardBody}>{a.description}</p>
                <div className={styles.cardActions}>
                  <button onClick={() => deleteActivity(a.id)} className={styles.btnDanger}>Slet</button>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ── OPHOLD ── */}
        {activeTab === "Ophold" && (
          <section>
            <h3>Ophold ({stays.length})</h3>
            <form onSubmit={createStay} className={styles.form}>
              <h4>Nyt ophold</h4>
              <div className={styles.formGrid}>
                <input placeholder='Titel' value={newStay.title} onChange={e => setNewStay(p => ({ ...p, title: e.target.value }))} required />
                <input type='number' placeholder='Antal personer' value={newStay.numberOfPersons} onChange={e => setNewStay(p => ({ ...p, numberOfPersons: e.target.value }))} required />
                <input type='number' placeholder='Pris (kr)' value={newStay.price} onChange={e => setNewStay(p => ({ ...p, price: e.target.value }))} required />
                <input placeholder='Billede URL' value={newStay.image} onChange={e => setNewStay(p => ({ ...p, image: e.target.value }))} required />
                <textarea placeholder='Teaser tekst' value={newStay.teaser} onChange={e => setNewStay(p => ({ ...p, teaser: e.target.value }))} className={styles.fullWidth} rows={2} />
              </div>
              <button type='submit' className={styles.btnPrimary}>Opret ophold</button>
            </form>

            {stays.length === 0 && <p className={styles.empty}>Ingen ophold endnu.</p>}
            {stays.map(s => (
              <div key={s.id || s._id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.cardName}>{s.title}</span>
                  <span className={styles.cardMeta}>{s.numberOfPersons} personer</span>
                  <span className={styles.cardMeta}>{s.price} kr.</span>
                  <span className={`${styles.badge} ${s.isActive ? styles.badgeBesvaret : styles.badgeArkiveret}`}>
                    {s.isActive ? "Aktiv" : "Inaktiv"}
                  </span>
                </div>
                {s.teaser && <p className={styles.cardBody}>{s.teaser}</p>}
                <div className={styles.cardActions}>
                  <button onClick={() => deleteStay(s.id || s._id)} className={styles.btnDanger}>Slet</button>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ── BOOKINGER ── */}
        {activeTab === "Bookinger" && (
          <section>
            <h3>Bookinger ({bookings.length})</h3>
            {bookings.length === 0 && <p className={styles.empty}>Ingen bookinger endnu.</p>}
            {bookings.map(b => (
              <div key={b.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.cardName}>{b.name}</span>
                  <span className={styles.cardMeta}>{b.email}</span>
                  <span className={styles.cardMeta}>— {b.stayTitle}</span>
                  <span className={`${styles.badge} ${statusBadgeClass(b.status)}`}>{b.status}</span>
                  <span className={styles.cardDate}>{new Date(b.created).toLocaleDateString("da-DK")}</span>
                </div>
                <p className={styles.cardBody}>
                  Ind: {b.checkIn} · Ud: {b.checkOut} · {b.guests} gæst(er)
                </p>
                {b.message && <p className={styles.cardBody}><em>{b.message}</em></p>}
                <div className={styles.cardActions}>
                  <button onClick={() => updateBookingStatus(b.id, "bekræftet")} className={styles.btnPrimary}>Bekræft</button>
                  <button onClick={() => updateBookingStatus(b.id, "aflyst")} className={styles.btnSecondary}>Aflys</button>
                  <button onClick={() => deleteBooking(b.id)} className={styles.btnDanger}>Slet</button>
                </div>
              </div>
            ))}
          </section>
        )}

      </div>
    </div>
  );
};

export default Backend;
