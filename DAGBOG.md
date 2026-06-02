# Glamping Projekt – Dagbog / Handoff

## Sidst arbejdet: 1. juni 2026

---

## Hvad er bygget (✅ færdigt)

- **Admin backoffice** med login + beskyttet rute (`/backoffice`, `/backoffice/login`)
  - Credentials: `admin` / `glamping2026`
  - SessionStorage-baseret auth (`src/utils/adminAuth.js`)
- **4 tabs i backoffice:** Aktiviteter | Ophold | Anmeldelser | Beskeder
  - Fuld CRUD på alle 4 (tilføj, rediger, slet)
- **Navigation + Footer** skjules automatisk på `/backoffice/*` routes
  - Fikser at knapper i backoffice-headeren ikke kunne klikkes
- **Kontaktformular** poster til både ekstern API og lokal backend
- **"Mine beskeder"** fjernet fra frontend navigation og routes (bruges kun i backoffice)
- **Backend reply-endpoint** tilføjet: `PATCH /admin/messages/:id/reply`
- **`replyToMessage()`** service-funktion tilføjet i `messageAdminService.js`

---

## I gang / halvt færdigt (⚠️)

### Svar på beskeder – TabBeskeder.jsx
Backend og service er klar. Mangler kun **UI'et** i `TabBeskeder.jsx`:

- **Hvad der skal bygges:**
  - "Svar"-knap på hver besked
  - Åbner et inline textarea under beskeden
  - "Send svar" gemmer svaret via `PATCH /admin/messages/:id/reply`
  - Viser svaret efterfølgende under beskeden med dato
  - Markerer automatisk status som "besvaret"

- **Filer der er klar:**
  - Backend: `Gittes-glamping-backend/server.js` – endpoint `PATCH /admin/messages/:id/reply` ✅
  - Service: `src/services/messageAdminService.js` – `replyToMessage(id, reply)` ✅
  - UI: `src/components/admin/TabBeskeder.jsx` – **mangler reply-UI** ❌

---

## Næste opgaver (prioriteret rækkefølge)

1. **Færdiggør reply-UI i TabBeskeder.jsx** ← start her
2. **isActive toggle på aktiviteter** – skjul/vis på frontend uden at slette
   - Backend: `PATCH /activities/:id/visibility` (eller brug `PUT` med `isActive`)
   - Frontend: toggle-knap i `TabActiviteter.jsx`
   - Public `/activities` skal kun vise `isActive === true`
3. **isActive toggle på ophold** – samme princip som aktiviteter
4. **Subscribers / nyhedsbrev**
   - Footer: email-felt + tilmeld-knap
   - Backend: `POST /subscribers`, `GET /admin/subscribers`, `DELETE /admin/subscribers/:id`
   - Backoffice: ny tab "Abonnenter" eller section i settings

---

## Filstruktur (relevante filer)

```
glamping-main/
  src/
    App.jsx                         ← routes + skjul nav på /backoffice
    utils/adminAuth.js              ← credentials (glamping2026)
    services/
      apiClient.js                  ← BASE_URL http://localhost:3042
      messageAdminService.js        ← getAdminMessages, updateMessageStatus, replyToMessage, deleteMessage
      activityAdminService.js
      stayAdminService.js
      reviewAdminService.js
    components/admin/
      TabBeskeder.jsx               ← ⚠️ mangler reply-UI
      TabActiviteter.jsx
      TabOphold.jsx
      TabAnmeldelser.jsx
    pages/
      Backoffice.jsx
      Backoffice.module.css
      BackofficeLogin.jsx

Gittes-glamping-backend/
  server.js                         ← alle endpoints inkl. /admin/messages/:id/reply
  messages.json                     ← data store
  activities.json
  stays.json
  reviews.json
```

---

## Prompt til i morgen

Kopier denne ind som første besked:

---

> Vi arbejder på Gittes Glamping – et React + Vite frontend (port 5173) og Express backend (port 3042, JSON file store).
> 
> **Start her:** Færdiggør reply-UI i `src/components/admin/TabBeskeder.jsx`.
> 
> Backend-endpoint er klar: `PATCH /admin/messages/:id/reply` – modtager `{ reply: "string" }`, gemmer `reply`, `repliedAt` og sætter `status: 'besvaret'`.
> Service-funktion er klar: `replyToMessage(id, reply)` i `src/services/messageAdminService.js`.
> 
> **UI der skal bygges i TabBeskeder.jsx:**
> - "Svar"-knap på hver besked-række
> - Klikker man åbner et inline textarea under beskeden (ikke modal)
> - "Send svar"-knap kalder `replyToMessage`, lukker textarea, opdaterer listen
> - Hvis beskeden allerede har et svar (`msg.reply`), vises svaret under beskeden med `msg.repliedAt` dato
> - Al tekst på dansk
> - Samme styling som resten af backoffice (brug `styles` fra `Backoffice.module.css`)
> 
> **Efter det er færdigt, fortsæt med:**
> 1. isActive toggle på aktiviteter (skjul/vis fra backoffice, public viser kun aktive)
> 2. isActive toggle på ophold
> 3. Subscriber-signup i footer + abonnenter-tab i backoffice
> 
> Se `c:\Users\Mathi\OneDrive\Skrivebord\glamping-main\DAGBOG.md` for fuld oversigt.

---
