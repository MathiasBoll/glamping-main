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

  // Helper: læs / skriv besked-listen
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

      // vi laver en “syntetisk kategori”-værdi
      setForm((prev) => ({
        ...prev,
        category: `stay:${stay.id}|${stay.title}`,
      }));

      localStorage.removeItem(SELECTED_STAY_KEY);
    } catch {
      // ignorer fejl
    }
  }, []);

  // Udled “viste” kategori-tekst (bruges når vi gemmer til messages)
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

  // Validering af enkelt felt
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

    // live-validering
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
    // Ingen fejl → gem besked
    const entry = {
      name: form.name.trim(),
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
      {/* HERO – genbruger PageHeader */}
      <PageHeader
        titleOne="Kontakt"
        titleTwo="Gitte"
        bgImg={null} // PageHeader vælger selv kontakt-hero via path
      />

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

          {/* Kategori */}
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
            >
              {!form.category && (
                <option value="">
                  Hvad drejer henvendelsen sig om?
                </option>
              )}
              {/* hvis der tidligere var valgt ophold → bevar den som option */}
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
          <button type="submit" className="btn">
            INDSEND
          </button>

          {submitted && (
            <p className={styles.successText}>
              Tak! Din besked er sendt ✅
            </p>
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
