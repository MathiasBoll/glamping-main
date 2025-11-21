// src/pages/Contact.jsx

/*
  Kontakt-siden indeholder:
    - Kontaktformular med validering (react-hook-form + yup)
    - POST til opgavens API endpoint
    - Gemmer også beskeden i localStorage → bruges på “Mine beskeder”-siden
    - Personlig success-boks under formularen
    - Modal feedback med SweetAlert2
    - Toast feedback med react-toastify

  Hooks/teknikker fra opgaven:
    ✓ useState (success / counter)
    ✓ useEffect (hydrate + counter)
    ✓ useMemo (label-tekst til dropdown)
    ✓ react-hook-form
    ✓ yup validation
    ✓ sweetalert2 modal
    ✓ react-toastify feedback
*/

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/pageHeader/PageHeader";
import styles from "./Contact.module.css";

// UI-feedback (toast i toppen af siden)
import { toast } from "react-toastify";

// Form-håndtering + schema-validering
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Modal-feedback efter submit
import Swal from "sweetalert2";

// Ikon til success-boks
import { FiCheckCircle } from "react-icons/fi";

// LocalStorage keys (samme nøgle som Messages-siden bruger)
const STORAGE_KEY = "sentMessages";
const SELECTED_STAY_KEY = "selectedStay";

// Kontakt-endpoint fra opgaven
const CONTACT_API_URL = "https://glamping-rqu9j.ondigitalocean.app/contact";

// Regex til navne-validering (kun bogstaver + mellemrum + bindestreg)
const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ '\-]+$/;

/* 
  Yup schema:
  - matcher kravene fra vanilla-versionen
  - giver brugervenlige fejlbeskeder
*/
const schema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Skriv dit navn.")
    .min(2, "Navn skal være mindst 2 tegn.")
    .matches(namePattern, "Navn må kun indeholde bogstaver."),
  email: yup
    .string()
    .trim()
    .required("Skriv din email.")
    .email("Indtast en gyldig email (fx navn@domæne.dk)."),
  category: yup
    .string()
    .trim()
    .required("Vælg et emne for din henvendelse."),
  message: yup
    .string()
    .trim()
    .required("Skriv en besked.")
    .min(10, "Beskeden skal være mindst 10 tegn."),
});

// Hjælpefunktioner til localStorage (Mine beskeder)
const readMessages = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const writeMessages = (arr) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

const Contact = () => {
  /*
    msgCount → viser hvor mange beskeder der er gemt i localStorage
    submitted / successName → bruges til den personlige tak-boks under formularen
  */
  const [msgCount, setMsgCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [successName, setSuccessName] = useState("");

  /*
    useForm med yupResolver:
      - register binder inputs til RHF
      - handleSubmit styrer submit
      - reset nulstiller felter
      - setValue bruges til “book nu → kontakt” feature
      - watch lytter på category feltet
  */
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      category: "",
      message: "",
    },
  });

  // Bruges til at holde øje med hvad brugeren har valgt i dropdown
  const watchedCategory = watch("category");

  // Ved load: opdater counter til “Mine beskeder”
  useEffect(() => {
    setMsgCount(readMessages().length);
  }, []);

  /*
    Hydrate dropdown:
    Hvis brugeren kommer fra “Book nu”-knappen på et ophold,
    ligger opholdet i localStorage som selectedStay.
    Vi sætter det automatisk som valgt kategori.
  */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SELECTED_STAY_KEY);
      if (!stored) return;

      const stay = JSON.parse(stored);
      if (!stay || !stay.id || !stay.title) return;

      // syntetisk value gemmer både id + titel
      const value = `stay:${stay.id}|${stay.title}`;
      setValue("category", value, { shouldValidate: true });

      // fjernes så det kun sker én gang
      localStorage.removeItem(SELECTED_STAY_KEY);
    } catch {
      // Ignorer evt. JSON-fejl
    }
  }, [setValue]);

  /*
    categoryLabel:
    "stay:xxxx|Titel" bliver vist som titel,
    ellers normal label til gemning på Messages-siden.
  */
  const categoryLabel = useMemo(() => {
    if (!watchedCategory) return "";

    if (watchedCategory.startsWith("stay:")) {
      const [, title] = watchedCategory.split("|");
      return title || "Booking";
    }
    if (watchedCategory === "booking") return "Booking";
    if (watchedCategory === "spørgsmål") return "Generelt spørgsmål";
    if (watchedCategory === "andet") return "Andet";

    return watchedCategory;
  }, [watchedCategory]);

  /*
    onSubmit:
      1) Byg payload til API
      2) POST
      3) Gem i localStorage (Mine beskeder)
      4) Vis personlig tak + reset form
      5) Modal feedback (SweetAlert2)
      6) Toast feedback (react-toastify)
  */
  const onSubmit = async (data) => {
    setSubmitted(false);

    // Payload til API (samme struktur som opgaven forventer)
    const payload = {
      name: data.name.trim(),
      email: data.email.trim(),
      category: categoryLabel || "Ingen emne",
      message: data.message.trim(),
    };

    // 1) POST til kontakt-API
    try {
      const res = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Kontakt-API fejlede");
      }
    } catch (err) {
      console.error("Fejl ved afsendelse til API:", err);

      // Fejl feedback med modal
      await Swal.fire({
        icon: "error",
        title: "Ups...",
        text: "Noget gik galt under afsendelsen. Prøv igen om lidt.",
        confirmButtonColor: "#839B97",
      });
      return;
    }

    // 2) Gem beskeden lokalt til “Mine beskeder”
    const entry = { ...payload, ts: Date.now() };
    const list = readMessages();
    list.push(entry);
    writeMessages(list);
    setMsgCount(list.length);

    // 3) Personlig tak-besked
    setSuccessName(payload.name);
    setSubmitted(true);

    // 4) Reset formularen
    reset({ name: "", email: "", category: "", message: "" });

    // 5) Modal success-feedback
    await Swal.fire({
      icon: "success",
      title: "Tak for din besked!",
      text: "Vi vender tilbage hurtigst muligt.",
      confirmButtonColor: "#839B97",
    });

    // 6) Lille toast som ekstra feedback
    toast.success("Din besked er sendt ✉️");
  };

  return (
    <>
      {/* HERO (styres af PageHeader config) */}
      <PageHeader titleOne="Kontakt" titleTwo="Gitte" />

      <main className={styles.contactMain}>
        {/* Intro-tekst over formularen */}
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

        {/* Kontaktformular */}
        <form
          className={styles.contactForm}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* === Navn === */}
          <div className={styles.field}>
            <label className="sr-only" htmlFor="cf-name">
              Navn
            </label>
            <input
              id="cf-name"
              placeholder="Navn"
              autoComplete="name"
              {...register("name")}
            />
            {errors.name && (
              <small className={styles.fieldError}>
                {errors.name.message}
              </small>
            )}
          </div>

          {/* === Email === */}
          <div className={styles.field}>
            <label className="sr-only" htmlFor="cf-email">
              Email
            </label>
            <input
              id="cf-email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <small className={styles.fieldError}>
                {errors.email.message}
              </small>
            )}
          </div>

          {/* === Kategori dropdown === */}
          <div className={styles.field}>
            <label className="sr-only" htmlFor="cf-cat">
              Hvad drejer henvendelsen sig om?
            </label>

            <select id="cf-cat" {...register("category")}>
              {/* placeholder-option kun hvis der ikke er valgt noget */}
              {!watchedCategory && (
                <option value="">
                  Hvad drejer henvendelsen sig om?
                </option>
              )}

              {/* hvis valgt ophold fra Book nu → vis det som første valg */}
              {watchedCategory?.startsWith("stay:") && (
                <option value={watchedCategory}>
                  {categoryLabel || "Valgt ophold"}
                </option>
              )}

              <option value="booking">Booking</option>
              <option value="spørgsmål">Generelt spørgsmål</option>
              <option value="andet">Andet</option>
            </select>

            {errors.category && (
              <small className={styles.fieldError}>
                {errors.category.message}
              </small>
            )}
          </div>

          {/* === Besked === */}
          <div className={styles.field}>
            <label className="sr-only" htmlFor="cf-msg">
              Besked
            </label>
            <textarea
              id="cf-msg"
              rows={4}
              placeholder="Besked (Skriv datoer, hvis det drejer sig om booking)"
              {...register("message")}
            />
            {errors.message && (
              <small className={styles.fieldError}>
                {errors.message.message}
              </small>
            )}
          </div>

          {/* === Submit-knap === */}
          <div className={styles.submitWrap}>
            <button
              type="submit"
              className={styles.formButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sender..." : "INDSEND"}
            </button>
          </div>

          {/* === Personlig success-boks under formularen === */}
          {submitted && (
            <div className={styles.successBox}>
              <FiCheckCircle className={styles.successIcon} />
              <p className={styles.successLine}>
                Hej{successName ? ` ${successName}` : ""}, 
              </p>
              <p className={styles.successLine}>Tak for din besked!</p>
              <p className={styles.successLine}>Du hører fra os snarest.</p>
            </div>
          )}
        </form>

        {/* Link til “Mine beskeder” + counter */}
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
