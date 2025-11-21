// src/pages/Contact.jsx
import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/pageHeader/PageHeader";
import styles from "./Contact.module.css";

const STORAGE_KEY = "sentMessages";
const SELECTED_STAY_KEY = "selectedStay";

const emptyForm = {
  name: "",
  email: "",
  category: "",
  message: "",
};

const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ '\-]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Contact = () => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const [successName, setSuccessName] = useState(""); // 👈 nyt navn til succes-besked

  // Helpers til besked-liste
  const readMessages = () =>
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  const writeMessages = (arr) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

  // Hent antal beskeder til linket "Se mine beskeder (X)"
  useEffect(() => {
    setMsgCount(readMessages().length);
  }, []);

  // Hydrate dropdown fra evt. valgt ophold (selectedStay)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SELECTED_STAY_KEY);
      if (!stored) return;

      const stay = JSON.parse(stored);
      if (!stay || !stay.id || !stay.title) return;

      setForm((prev) => ({
        ...prev,
        category: `stay:${stay.id}|${stay.title}`,
      }));

      // kun én gang – derefter fjernes den
      localStorage.removeItem(SELECTED_STAY_KEY);
    } catch {
      // ignorer JSON-fejl
    }
  }, []);

  // Pæn label-tekst til category (bruges når vi gemmer)
  const categoryLabel = useMemo(() => {
    if (!form.category) return "";
    if (form.category.startsWith("stay:")) {
      const [, title] = form.category.split("|");
      return title || "Booking";
    }
    if (form.category === "booking") return "Booking";
    if (form.category === "spørgsmål") return "Generelt spørgsmål";
    if (form.category === "andet") return "Andet";
    return form.category;
  }, [form.category]);

  // Validering af ét felt
  const validateField = (name, value) => {
    const v = value.trim();

    switch (name) {
      case "name":
        if (!v) return "Skriv dit navn.";
        if (v.length < 2) return "Navn skal være mindst 2 tegn.";
        if (!namePattern.test(v)) return "Navn må kun indeholde bogstaver.";
        return "";
      case "email":
        if (!v) return "Skriv din email.";
        if (!emailPattern.test(v))
          return "Indtast en gyldig email (fx navn@domæne.dk).";
        return "";
      case "category":
        if (!v) return "Vælg et emne for din henvendelse.";
        return "";
      case "message":
        if (!v) return "Skriv en besked.";
        if (v.length < 10) return "Beskeden skal være mindst 10 tegn.";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(false);

    const newErrors = {};
    Object.entries(form).forEach(([name, value]) => {
      const msg = validateField(name, value);
      if (msg) newErrors[name] = msg;
    });
    setErrors(newErrors);

    // Hvis der er fejl → fokusér første felt med fejl
    const firstErrorKey = Object.keys(newErrors)[0];
    if (firstErrorKey) {
      const el = document.querySelector(`[name="${firstErrorKey}"]`);
      if (el && typeof el.focus === "function") el.focus();
      return;
    }

    // GEM navnet til success-boksen før vi nulstiller formularen
    const cleanName = form.name.trim();
    setSuccessName(cleanName);

    // Ingen fejl → gem besked
    const entry = {
      name: cleanName,
      email: form.email.trim(),
      subject: categoryLabel || "Ingen emne",
      message: form.message.trim(),
      ts: Date.now(),
    };

    const list = readMessages();
    list.push(entry);
    writeMessages(list);
    setMsgCount(list.length);

    setSubmitted(true);
    setForm(emptyForm);
  };

  return (
    <>
      {/* HERO – bruger PageHeader, som vælger kontakt-hero via path */}
      <PageHeader titleOne="Kontakt" titleTwo="Gitte" />

      <main className={styles.contactMain}>
        <section className={styles.contactIntro}>
          <h2>
            Vil du booke et ophold?
            <br />
            Eller har du blot et spørgsmål?
          </h2>
          <p>
            Så tøv ikke med at tage kontakt til os herunder. Vi bestræber os på
            at svare på henvendelser indenfor 24 timer, men op til ferie kan der
            være travlt, og svartiden kan derfor være op til 48 timer.
          </p>
        </section>

        <form
          className={styles.contactForm}
          noValidate
          onSubmit={handleSubmit}
        >
          {/* Navn */}
          <div className={styles.field}>
            <label className="sr-only" htmlFor="cf-name">
              Navn
            </label>
            <input
              id="cf-name"
              name="name"
              type="text"
              placeholder="Navn"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="name"
            />
            {errors.name && (
              <small className={styles.fieldError}>{errors.name}</small>
            )}
          </div>

          {/* Email */}
          <div className={styles.field}>
            <label className="sr-only" htmlFor="cf-email">
              Email
            </label>
            <input
              id="cf-email"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
            />
            {errors.email && (
              <small className={styles.fieldError}>{errors.email}</small>
            )}
          </div>

          {/* Kategori (inkl. auto-fyldt ophold) */}
          <div className={styles.field}>
            <label className="sr-only" htmlFor="cf-cat">
              Hvad drejer henvendelsen sig om?
            </label>
            <select
              id="cf-cat"
              name="category"
              value={form.category}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            >
              {!form.category && (
                <option value="">
                  Hvad drejer henvendelsen sig om?
                </option>
              )}

              {/* hvis valgt ophold → tilføj som option */}
              {form.category.startsWith("stay:") && (
                <option value={form.category}>
                  {categoryLabel || "Valgt ophold"}
                </option>
              )}

              <option value="booking">Booking</option>
              <option value="spørgsmål">Generelt spørgsmål</option>
              <option value="andet">Andet</option>
            </select>
            {errors.category && (
              <small className={styles.fieldError}>{errors.category}</small>
            )}
          </div>

          {/* Besked */}
          <div className={styles.field}>
            <label className="sr-only" htmlFor="cf-msg">
              Besked
            </label>
            <textarea
              id="cf-msg"
              name="message"
              placeholder="Besked (Skriv datoer, hvis det drejer sig om booking)"
              value={form.message}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4}
            />
            {errors.message && (
              <small className={styles.fieldError}>{errors.message}</small>
            )}
          </div>

          {/* Submit */}
          <div className={styles.submitWrap}>
            <button type="submit" className={styles.formButton}>
              INDSEND
            </button>
          </div>

          {submitted && (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>✓</div>
              <p className={styles.successLine}>
                Hej{successName ? ` ${successName}` : ""},
              </p>
              <p className={styles.successLine}>Tak for din besked!</p>
              <p className={styles.successLine}>Du hører fra os snarest.</p>
            </div>
          )}
        </form>

        {/* Link til “Mine beskeder” */}
        <div className={styles.contactTools}>
          <a href="/messages" className={styles.msgLink}>
            Se mine beskeder ({msgCount})
          </a>
        </div>
      </main>
    </>
  );
};

export default Contact;
