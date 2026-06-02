// src/components/stayDetails/StayDetails.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/pageHeader/PageHeader";
import styles from "./stayDetails.module.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3042';

const emptyForm = { name: '', email: '', checkIn: '', checkOut: '', guests: 1, message: '' };

const StayDetails = () => {
  const [stay, setStay] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formState, setFormState] = useState('idle'); // idle | sending | success | error
  const [formError, setFormError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchStay = async () => {
      try {
        const response = await fetch(`${BASE_URL}/stays/${id}`);
        const data = await response.json();
        setStay(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStay();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setFormState('sending');
    setFormError(null);
    try {
      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          stayId: stay._id ?? stay.id,
          stayTitle: stay.title,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          guests: Number(form.guests) || 1,
          message: form.message.trim(),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Booking mislykkedes');
      }
      setFormState('success');
      setForm(emptyForm);
    } catch (err) {
      setFormState('error');
      setFormError(err.message);
    }
  };

  if (!stay) {
    return <p className={styles.stayDetails}>Indlaerer ophold...</p>;
  }

  return (
    <>
      <PageHeader
        titleOne={stay.title}
        button={false}
        bgImg={stay.image}
      />

      <article className={styles.stayDetails}>
        <h2 className={styles.title}>
          {stay.subtitle || "Tag vaek en weekend, med en du holder af"}
        </h2>

        <div className={styles.info}>
          <p className={styles.desc}>{stay.description}</p>

          {Array.isArray(stay.includes) && stay.includes.length > 0 && (
            <>
              <p className={styles.includeTitle}>Opholdet indeholder:</p>
              <ul className={styles.included}>
                {stay.includes.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {stay.price && <p className={styles.price}>Pris {stay.price},-</p>}
        </div>
      </article>

      <section className={styles.bookingSection}>
        <h2 className={styles.bookingTitle}>Book dette ophold</h2>

        {formState === 'success' ? (
          <p className={styles.bookingSuccess}>
            Din booking er modtaget! Vi vender tilbage sa hurtigt som muligt.
          </p>
        ) : (
          <form onSubmit={handleBookSubmit} className={styles.bookingForm}>
            {formState === 'error' && (
              <p className={styles.bookingError}>{formError}</p>
            )}

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Navn *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Dit fulde navn"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">E-mail *</label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  required
                  pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                  title="Indtast en gyldig e-mailadresse"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="din@email.dk"
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="checkIn">Check-in *</label>
                <input
                  id="checkIn"
                  name="checkIn"
                  type="date"
                  required
                  value={form.checkIn}
                  onChange={handleChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="checkOut">Check-ud *</label>
                <input
                  id="checkOut"
                  name="checkOut"
                  type="date"
                  required
                  value={form.checkOut}
                  onChange={handleChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="guests">Gaester *</label>
                <input
                  id="guests"
                  name="guests"
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={form.guests}
                  onChange={handleChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Besked (valgfri)</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                placeholder="Saerlige oensker eller spoergsmaal..."
                className={styles.formTextarea}
              />
            </div>

            <button
              type="submit"
              disabled={formState === 'sending'}
              className={styles.formSubmit}
            >
              {formState === 'sending' ? 'Sender...' : 'Send booking'}
            </button>
          </form>
        )}
      </section>
    </>
  );
};

export default StayDetails;