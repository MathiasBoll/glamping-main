// src/pages/Eksamen.jsx
import { useState } from 'react';

const S = {
    page: { minHeight: '100vh', background: '#1a2e1a', color: '#f5f0e8', fontFamily: "'Segoe UI', Arial, sans-serif", padding: '2rem 1rem 4rem' },
    inner: { maxWidth: '780px', margin: '0 auto' },
    header: { textAlign: 'center', marginBottom: '2.5rem' },
    eyebrow: { fontSize: '1rem', color: '#c8a96e', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 0.4rem' },
    h1: { fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 800, color: '#f5f0e8', margin: '0 0 0.4rem' },
    sub: { color: '#9ab89a', fontSize: '0.9rem', margin: 0 },
    nav: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', margin: '1.5rem 0 2rem' },
    navBtn: { background: '#2a3f2a', border: '1px solid #3a5a3a', color: '#c8a96e', borderRadius: '20px', padding: '0.3rem 1rem', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 700 },
    hr: { border: 'none', borderTop: '1px solid #3a5a3a', margin: '0 0 1.5rem' },
    card: { background: '#2a3f2a', border: '1px solid #3a5a3a', borderRadius: '10px', marginBottom: '1rem', overflow: 'hidden' },
    cardHead: (open) => ({ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem 1.4rem', cursor: 'pointer', userSelect: 'none', background: open ? '#1e331e' : 'transparent' }),
    num: { fontSize: '1.9rem', fontWeight: 800, color: '#c8a96e', minWidth: '2.8rem', lineHeight: 1 },
    title: { flex: 1, fontSize: '1.05rem', fontWeight: 600, color: '#f5f0e8' },
    chevron: (open) => ({ color: '#c8a96e', fontSize: '1.1rem', transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }),
    body: { padding: '0 1.4rem 1.4rem' },
    answer: { lineHeight: 1.75, fontSize: '0.96rem', margin: '0 0 1rem' },
    label: (color) => ({ color, fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.35rem' }),
    pre: { background: '#111', color: '#a8ff78', borderRadius: '6px', padding: '0.9rem 1.1rem', overflowX: 'auto', fontSize: '0.83rem', lineHeight: 1.6, margin: '0 0 1rem', fontFamily: "'Fira Code','Courier New',monospace" },
    errList: { paddingLeft: '1.3rem', margin: 0, fontSize: '0.92rem', lineHeight: 1.7, color: '#f5d0d0' },
};

const ic = (s) => (
    <code style={{ background: '#111', padding: '1px 5px', borderRadius: '3px', color: '#a8ff78', fontSize: '0.88em' }}>{s}</code>
);

const CARDS = [
    {
        num: '01', title: 'Hvad er frontend, backend, API og database?',
        answer: (<>
            Et moderne webprojekt som Gittes Glamping er opdelt i tre lag, der taler sammen via et API.
            <br /><br />
            <strong>Frontend</strong> er alt det brugeren kan se og klikke på. I vores projekt er det React-koden i {ic('glamping-main/')} — komponenter som {ic('TabActiviteter.jsx')}, {ic('StaysSection.jsx')} og {ic('Home.jsx')}. Vite bygger og serverer den på {ic('http://localhost:5173')} under udvikling. Frontenden gemmer <em>ingen</em> data selv — den henter og sender alt via API-kald.
            <br /><br />
            <strong>Backend</strong> er Express-serveren der kører separat på {ic('http://localhost:3042')}. Den modtager HTTP-requests fra frontenden, validerer dem, taler med MongoDB og sender et svar tilbage. Backenden er det eneste lag der har adgang til databasen — frontenden ved ikke, hvad databasen hedder eller hvad den indeholder.
            <br /><br />
            <strong>API</strong> (Application Programming Interface) er den aftale mellem frontend og backend om, hvilke URL'er der eksisterer og hvad de forventer. Fx: {ic('GET /activities')} returnerer en liste, {ic('POST /activity')} opretter én, {ic('PUT /activity/:id')} opdaterer og {ic('DELETE /activity/:id')} sletter. Frontenden må kun bruge disse URLs — aldrig databasen direkte.
            <br /><br />
            <strong>Database</strong> er MongoDB, der gemmer data permanent som JSON-dokumenter. Selv hvis backenden genstarter, er dataene der stadig.
            <br /><br />
            I {ic('apiClient.js')} er {ic('BASE_URL')} konfigureret via miljøvariablen {ic('VITE_API_BASE_URL')} — er den ikke sat, bruger vi {ic('http://localhost:3042')} som fallback. Det er her "broen" mellem de to servere defineres.
        </>),
        code: `// src/services/apiClient.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3042';

// De tre lag i Gittes Glamping:
// ┌──────────────────────────────────────┐
// │  FRONTEND  (React, port 5173)        │
// │  TabActiviteter.jsx                  │
// │    → activityAdminService.js         │
// │      → apiClient.js                  │
// └─────────────────┬────────────────────┘
//                   │  HTTP-request
// ┌─────────────────▼────────────────────┐
// │  BACKEND  (Express, port 3042)       │
// │  Router → Controller → Mongoose      │
// └─────────────────┬────────────────────┘
//                   │  Mongoose query
// ┌─────────────────▼────────────────────┐
// │  DATABASE  (MongoDB)                 │
// │  Collection: activities              │
// └──────────────────────────────────────┘`,
        errors: [
            'Glemme at starte backenden (node server.js) → alle fetch-kald fejler og toast.error vises',
            'Tro at frontend og backend kører på samme port — de er to separate processer på 5173 og 3042',
            'Hardcode http://localhost:3042 i komponenter i stedet for at bruge apiClient — så virker det ikke i produktion',
            'Forsøge at kalde MongoDB direkte fra React — det er umuligt og usikkert; al databaseadgang går via backenden',
        ],
    },
    {
        num: '02', title: 'Hvad er Postman, og hvordan bruger vi det?',
        answer: (<>
            Postman er et program der lader os sende HTTP-requests <strong>direkte til backenden</strong> uden at åbne frontenden. Det er uvurderligt til at teste og debugge API-endpoints isoleret.
            <br /><br />
            Normalt er det {ic('apiClient.js')} der tilføjer de rigtige headers automatisk — i Postman skal vi selv huske dem. Vores backend kræver <strong>to headers</strong> på alle admin-endpoints: {ic('Content-Type: application/json')} (så body parses rigtigt) og {ic('Authorization: Bearer glamping-admin-2026')} (så backenden ved vi er admin). Mangler den ene, fejler kaldet.
            <br /><br />
            Vi bruger Postman til:
            <br />• Verificere at et nyt endpoint virker <em>inden</em> vi skriver React-kode
            <br />• Teste hvad backenden svarer ved forkerte data (fx manglende felt)
            <br />• Slå et specifikt dokument op eller slette det direkte med {ic('_id')} fra MongoDB Compass
            <br />• Reprodusere en fejl brugeren har rapporteret, uden at gennemgå hele UI-flowet
        </>),
        code: `// ── Hent alle aktiviteter (READ) ──────────────────
GET  http://localhost:3042/activities
Authorization: Bearer glamping-admin-2026
→ 200 OK + array af aktiviteter

// ── Opret aktivitet (CREATE) ───────────────────────
POST http://localhost:3042/activity
Content-Type:  application/json
Authorization: Bearer glamping-admin-2026

Body (raw JSON):
{
  "title":       "Kajaktur",
  "date":        "Lørdage",
  "time":        "10.00-12.00",
  "description": "En dejlig tur på vandet",
  "image":       "https://example.com/kajak.jpg"
}
→ 201 Created + det nye objekt med _id

// ── Opdater (UPDATE) ───────────────────────────────
PUT  http://localhost:3042/activity/6650a1b2c3d4e5f6a7b8c9d0
Authorization: Bearer glamping-admin-2026
Content-Type:  application/json
Body: { "title": "Kajak og kano" }
→ 200 OK + opdateret objekt

// ── Slet (DELETE) ──────────────────────────────────
DELETE http://localhost:3042/activity/6650a1b2c3d4e5f6a7b8c9d0
Authorization: Bearer glamping-admin-2026
→ 204 No Content  (ingen body)`,
        errors: [
            'Glemme Authorization-headeren → backenden svarer 401 Unauthorized',
            'Glemme Content-Type: application/json på POST/PUT → body parses ikke og felterne er undefined',
            'Kalde PUT/DELETE med et forkert eller ikke-eksisterende _id → 404 Not Found',
            'Sende string i stedet for JSON til body (fx uden at vælge "raw" + "JSON" i Postman)',
        ],
    },
    {
        num: '03', title: 'Hvad er MongoDB, og hvordan bruger vi det?',
        answer: (<>
            MongoDB er en <strong>NoSQL-dokumentdatabase</strong>. I stedet for tabeller med rækker og kolonner (som i SQL/MySQL) gemmer MongoDB data som individuelle <strong>JSON-dokumenter</strong> i såkaldte <em>collections</em>. En collection svarer løst til en SQL-tabel — men dokumenterne i den behøver ikke have de samme felter.
            <br /><br />
            I vores projekt er der fx en {ic('activities')}-collection og en {ic('stays')}-collection. Hvert dokument får automatisk et unikt {ic('_id')} af MongoDB — det er en 24-tegns hexadecimal streng kaldet ObjectId, som vi bruger til at identificere præcis ét dokument ved PUT/DELETE.
            <br /><br />
            Backenden forbinder til MongoDB via {ic('MONGO_URI')} i {ic('.env')} — fx {ic('mongodb://localhost:27017/glamping')} lokalt eller en cloud-URI via MongoDB Atlas. Frontenden kender aldrig denne streng.
            <br /><br />
            Vi bruger <strong>Mongoose</strong> i backenden til at definere et schema — dvs. hvilke felter et aktivitetsdokument må have og hvilke der er påkrævede. Det sikrer at vi ikke gemmer halvfærdige eller forkert formattede dokumenter.
            <br /><br />
            Et lille quirk: nogle Mongoose-konfigurationer returnerer {ic('id')} (string) i stedet for {ic('_id')} (ObjectId). Derfor normaliserer vi i {ic('TabActiviteter.jsx')} til altid at bruge {ic('_id: a.id || a._id')}.
        </>),
        code: `// Et aktivitetsdokument i MongoDB (som det ser ud i Compass):
{
  "_id":         "6650a1b2c3d4e5f6a7b8c9d0",  // auto, unik
  "title":       "Kajaktur",
  "date":        "Lørdage",
  "time":        "10.00-12.00",
  "description": "En dejlig tur på vandet",
  "image":       "https://res.cloudinary.com/.../kajak.jpg",
  "isActive":    true,       // bruges til at vise/skjule på forsiden
  "sortOrder":   0,          // rækkefølge i listen
  "created":     "2026-06-08T10:00:00.000Z"
}

// Mongoose-model i backenden (forenklet):
const ActivitySchema = new mongoose.Schema({
    title:       { type: String, required: true },
    description: String,
    isActive:    { type: Boolean, default: true },
    sortOrder:   { type: Number, default: 0 },
    created:     { type: Date, default: Date.now },
});

// Normalisering i TabActiviteter.jsx:
const normalized = data.map(a => ({ ...a, _id: a.id || a._id }));
setActivities(normalized);`,
        errors: [
            'MONGO_URI ikke sat i backend .env → Mongoose kan ikke forbinde og backenden crasher ved start',
            'Bruge et forkert _id-format (fx bare et tal) → MongoDB finder ikke dokumentet og svarer 404',
            'Forveksle id (string fra Mongoose virtual) og _id (ObjectId) — normalisér med a.id || a._id',
            'Tro at man kan kalde MongoDB direkte fra React med fetch — MongoDB er ikke en HTTP-server',
        ],
    },
    {
        num: '04', title: 'Hvad sker der, når man opretter en aktivitet?',
        answer: (<>
            Når admin klikker <strong>"Tilføj aktivitet"</strong> i backoffice, passerer data gennem fire lag inden de ender i MongoDB. Det er et godt eksempel på <em>separation of concerns</em>: hvert lag har ét ansvar og ved kun det, det har brug for.
            <br /><br />
            <strong>Trin 1 — UI (TabActiviteter.jsx):</strong> Brugeren udfylder felterne title, date, time, description og image. Hvert felt styres af {ic('setForm({ ...form, [e.target.name]: e.target.value })')}. Formularen holder {ic('form')}-state opdateret.
            <br /><br />
            <strong>Trin 2 — Submit-handler:</strong> {ic('handleSubmit(e)')} kalder {ic('e.preventDefault()')} så siden ikke reloades, checker om vi er i edit-mode ({ic('if (editing)')}), og kalder {ic('createActivity(form)')}.
            <br /><br />
            <strong>Trin 3 — Service-lag (activityAdminService.js):</strong> {ic('createActivity(data)')} kalder {ic('apiClient')} med {ic('/activity')} og {ic('method: POST')}. Service-laget ved ikke noget om React-state — det er kun ansvarlig for API-kaldet.
            <br /><br />
            <strong>Trin 4 — HTTP-klient (apiClient.js):</strong> Tilføjer automatisk {ic('Content-Type: application/json')} og {ic('Authorization: Bearer glamping-admin-2026')} headers og kalder den native {ic('fetch')}-funktion.
            <br /><br />
            <strong>Trin 5 — Backend:</strong> Modtager POST-requesten, validerer med Mongoose-schema og gemmer i MongoDB. Svarer {ic('201 Created')} med det nye dokument inkl. autogenereret {ic('_id')}.
            <br /><br />
            <strong>Trin 6 — Feedback:</strong> Frontenden viser {ic('toast.success("Aktivitet oprettet!")')} og kalder {ic('loadActivities()')} for at opdatere tabellen med det nye dokument.
        </>),
        code: `// TRIN 1+2 — handleSubmit i TabActiviteter.jsx
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (editing) {
            await updateActivity(editing._id || editing.id, form);
            toast.success('Aktivitet opdateret!');
            setEditing(null);
        } else {
            await createActivity(form);        // ← oprettelse
            toast.success('Aktivitet oprettet!');
        }
        setForm(EMPTY_FORM);
        loadActivities();                      // ← opdatér listen
    } catch (err) {
        toast.error(err.message);
    }
};

// TRIN 3 — activityAdminService.js
export const createActivity = (data) =>
    apiClient('/activity', {
        method: 'POST',
        body: JSON.stringify(data),
    });

// TRIN 4 — apiClient.js (forenklet)
async function apiClient(path, options = {}) {
    const response = await fetch(BASE_URL + path, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': \`Bearer \${ADMIN_TOKEN}\`,
            ...options.headers,
        },
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || \`HTTP fejl: \${response.status}\`);
    }
    // TRIN 5: backend svarer 201 Created
    return response.status === 204 ? null : response.json();
}`,
        errors: [
            'Et required felt er tomt → Mongoose-validering fejler og backenden svarer 400 Bad Request',
            'Glemme loadActivities() efter oprettelse → listen viser ikke den nye aktivitet før genindlæsning',
            'Glemme await foran createActivity → toast vises øjeblikkeligt uden at vente på svaret',
            'Backend ikke kørende → fetch kaster TypeError og catch-blokken viser toast.error',
        ],
    },
    {
        num: '05', title: 'Hvad sker der, når man opdaterer en aktivitet?',
        answer: (<>
            Opdatering bruger samme formular og samme {ic('handleSubmit')}-funktion som oprettelse — forskellen afgøres af én betingelse: {ic('if (editing)')}.
            <br /><br />
            Når admin klikker <strong>"Rediger"</strong> på en aktivitet, kalder vi {ic('handleEditClick(activity)')}. Den gemmer den valgte aktivitet i {ic('editing')}-state og udfylder {ic('form')}-state med aktivitetens eksisterende værdier. Formularen er nu i "redigeringsmode".
            <br /><br />
            Når admin klikker "Gem", kører {ic('handleSubmit')} igen. Nu er {ic('editing')} ikke null, så vi ender i {ic('if (editing)')} og kalder {ic('updateActivity(editing._id || editing.id, form)')}. ID'et sendes med i URL'en: {ic('PUT /activity/:id')} — backenden finder præcis det dokument i MongoDB og overskriver felterne.
            <br /><br />
            Forskellen fra oprettelse i ét overblik:
            <br />• Oprettelse: {ic('POST /activity')} — ingen id i URL, opretter nyt dokument
            <br />• Opdatering: {ic('PUT /activity/:id')} — id i URL, finder og opdaterer eksisterende dokument
            <br /><br />
            Efter vellykket opdatering nulstiller vi {ic('setEditing(null)')} og {ic('setForm(EMPTY_FORM)')} — formularen vender tilbage til "oprettelsesmode".
        </>),
        code: `// handleEditClick — sætter formularen i redigeringsmode
const handleEditClick = (activity) => {
    setEditing(activity);           // gør if(editing) sand
    setForm({
        title:       activity.title,
        date:        activity.date,
        time:        activity.time,
        description: activity.description,
        image:       activity.image,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// handleSubmit — én funktion håndterer begge tilfælde
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (editing) {
            // ── OPDATERING ─────────────────────────────────
            await updateActivity(editing._id || editing.id, form);
            toast.success('Aktivitet opdateret!');
            setEditing(null);        // nulstil til oprettelsesmode
        } else {
            // ── OPRETTELSE ─────────────────────────────────
            await createActivity(form);
            toast.success('Aktivitet oprettet!');
        }
        setForm(EMPTY_FORM);
        loadActivities();
    } catch (err) {
        toast.error(err.message);
    }
};

// activityAdminService.js — PUT med id i URL
export const updateActivity = (id, data) =>
    apiClient(\`/activity/\${id}\`, {   // fx /activity/6650a1b2...
        method: 'PUT',
        body: JSON.stringify(data),
    });`,
        errors: [
            'editing er null (bruger har ikke klikket Rediger) → handleSubmit opretter nyt i stedet for at opdatere',
            'editing._id er undefined pga. manglende normalisering → URL bliver /activity/undefined og backenden svarer 404',
            'Glemme setEditing(null) → formularen forbliver i redigeringsmode og næste "Tilføj" opdaterer i stedet for at oprette',
            'Glemme setForm(EMPTY_FORM) → formularen viser stadig det redigerede indhold til næste aktivitet',
        ],
    },
    {
        num: '06', title: 'Hvad betyder CRUD, GET, POST, PUT og DELETE?',
        answer: (<>
            <strong>CRUD</strong> er en forkortelse for de fire grundlæggende operationer på data: <em>Create, Read, Update, Delete</em>. HTTP-protokollen har metoder der mapper direkte til dem — og det er de metoder vi bruger i vores {ic('activityAdminService.js')}.
            <br /><br />
            <strong>GET</strong> — Hent data. Har <em>ingen body</em>. Ændrer ikke data. Kan caches af browseren. Bruges til at hente listen af aktiviteter.
            <br /><br />
            <strong>POST</strong> — Opret nyt. Body indeholder det nye dokument. Serveren genererer {ic('_id')} og svarer {ic('201 Created')}.
            <br /><br />
            <strong>PUT</strong> — Opdater eksisterende. ID'et for dokumentet er i URL'en ({ic('/activity/:id')}), de nye værdier i body. Svarer {ic('200 OK')} med det opdaterede dokument.
            <br /><br />
            <strong>DELETE</strong> — Slet. Kun ID i URL, ingen body. Svarer {ic('204 No Content')} — derfor returnerer {ic('apiClient.js')} {ic('null')} ved 204.
            <br /><br />
            Metoderne er semantiske: de fortæller backenden <em>hvad formålet er</em>, ikke bare "giv mig noget". En router i Express kan have fire handlers på samme sti — én per metode.
        </>),
        code: `// src/services/activityAdminService.js — alle fire CRUD-operationer

// READ: GET /activities → array af aktiviteter
export const getAdminActivities = () =>
    apiClient('/activities');

// CREATE: POST /activity → 201 Created + nyt dokument
export const createActivity = (data) =>
    apiClient('/activity', {
        method: 'POST',
        body: JSON.stringify(data),
    });

// UPDATE: PUT /activity/:id → 200 OK + opdateret dokument
export const updateActivity = (id, data) =>
    apiClient(\`/activity/\${id}\`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });

// DELETE: DELETE /activity/:id → 204 No Content (null)
export const deleteActivity = (id) =>
    apiClient(\`/activity/\${id}\`, {
        method: 'DELETE',
    });

// apiClient.js returnerer null ved 204:
return response.status === 204 ? null : response.json();`,
        errors: [
            'Bruge GET til at oprette data — GET har ingen body, data forsvinder',
            'Bruge POST til at opdatere — POST opretter altid et nyt dokument; det gamle forbliver uændret',
            "Glemme :id i URL'en på PUT/DELETE → Express-routeren ved ikke hvilket dokument der menes",
            'Forvente en JSON-body fra DELETE — svaret er 204 No Content, dvs. ingen body at parse',
        ],
    },
    {
        num: '07', title: 'Hvorfor bruger vi async/await og try/catch?',
        answer: (<>
            JavaScript er <strong>single-threaded</strong> — kun én ting kan køre ad gangen. Hvis vi brugte et almindeligt synkront funktionskald til at hente data fra en server, ville hele browsertabben fryse, mens den ventede på svaret (måske 200-2000 ms). Det er uacceptabelt.
            <br /><br />
            Løsningen er <strong>asynkrone operationer</strong>. {ic('fetch()')} returnerer et {ic('Promise')} — et løfte om at svaret <em>kommer</em>, men ikke nødvendigvis nu. {ic('async/await')} er syntaktisk sukker der gør det muligt at skrive asynkron kode, der <em>læses</em> som synkron kode.
            <br /><br />
            {ic('await')} siger: "sæt denne funktion på pause her og vent på Promiseet — men lad resten af browseren fortsætte". Uden {ic('await')} returnerer {ic('getAdminActivities()')} et {ic('Promise')}-objekt, ikke et array — og {ic('setActivities(data)')} sætter et {ic('Promise')} i state.
            <br /><br />
            {ic('try/catch')} håndterer fejl. Vores {ic('apiClient.js')} kaster eksplicit en {ic('Error')} ved alle ikke-OK HTTP-statuskoder ({ic('if (!response.ok)')}). Det betyder at alle service-funktioner automatisk kaster ved 400, 401, 404, 500 osv. — og {ic('catch(err)')} blokken i komponenten viser {ic('toast.error(err.message)')} til brugeren i stedet for at siden går ned.
        </>),
        code: `// src/services/apiClient.js — kaster fejl ved alle ikke-OK svar:
async function apiClient(path, options = {}) {
    const response = await fetch(BASE_URL + path, { ...options, headers });

    if (!response.ok) {
        // Fx 401 Unauthorized, 404 Not Found, 500 Server Error
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || \`HTTP fejl: \${response.status}\`);
    }
    return response.status === 204 ? null : response.json();
}

// TabActiviteter.jsx — fanger fejlen med try/catch:
const handleDelete = async (activity) => {
    try {
        await deleteActivity(activity._id);   // kaster hvis 4xx/5xx
        toast.success('Aktivitet slettet!');
        loadActivities();
    } catch (err) {
        toast.error(err.message);             // viser fejlbeskeden
    }
};

// ── FORKERT: glemme await ──────────────────────────────────
const loadActivities = async () => {
    const data = getAdminActivities();   // ← MANGLER await!
    // data er nu et Promise-objekt, ikke et array
    setActivities(data);                 // tabellen viser ingenting
};

// ── FORKERT: glemme async ──────────────────────────────────
const handleSubmit = (e) => {          // ← MANGLER async!
    await createActivity(form);        // ← SyntaxError i browseren
};`,
        errors: [
            'Glemme await → state sættes til et Promise-objekt og tabellen er tom eller crasher',
            'Glemme async på funktionen → await-keyword giver SyntaxError',
            'Ikke have try/catch → en netværksfejl eller 500-fejl kaster en uncaught exception og siden går i sort',
            'Forvente at Promise-fejl fanges automatisk — de gør det ikke uden try/catch eller .catch()',
        ],
    },
    {
        num: '08', title: 'Hvordan sender komponenter data og handlinger mellem hinanden?',
        answer: (<>
            I React er data-flowet <strong>unidirektionelt</strong>: data sendes <em>ned</em> fra forælder til barn via <strong>props</strong>, og handlinger sendes <em>op</em> fra barn til forælder via <strong>callback-funktioner</strong> som props.
            <br /><br />
            I vores backoffice er {ic('Backoffice.jsx')} forælderen der renderer de forskellige tabs. Selve datalogikken for aktiviteter bor i {ic('TabActiviteter.jsx')}, der ejer sin egen state og henter fra backend selv.
            <br /><br />
            <strong>State-variabler</strong> i {ic('TabActiviteter.jsx')}:
            <br />• {ic('activities')} — det aktuelle array af aktiviteter fra backend; sættes med {ic('setActivities')}
            <br />• {ic('editing')} — det aktivitetsobjekt der redigeres, eller {ic('null')} hvis vi er i oprettelsesmode
            <br />• {ic('form')} — de nuværende inputværdier i formularen; opdateres ved hvert tastetryk
            <br /><br />
            <strong>{ic('useEffect')}</strong> kører én gang når komponenten mountes (tom dependency-array {ic('[]')}). Den kalder {ic('loadActivities()')} der fetcher fra backend og sætter {ic('activities')}-state. Når state ændres, re-renderer React automatisk tabellen.
            <br /><br />
            <strong>Kommunikation nedad:</strong> Tabellen renderes ved at mappe over {ic('activities')} og sende hvert objekt som props til en {ic('<tr>') }-række med knapper. Klikker man "Rediger", kalder knappen {ic('handleEditClick(activity)')} — en funktion defineret i samme komponent.
            <br /><br />
            <strong>Kommunikation opad med callbacks:</strong> Hvis vi brugte en separat {ic('<ActivityForm>')} komponent, ville vi sende {ic('onSave={handleSubmit}')} og {ic('onCancel={() => setEditing(null)}')} som props ned — barnet kalder funktionen og forælderen opdaterer sin state.
        </>),
        code: `// src/components/admin/TabActiviteter.jsx

// ── STATE ──────────────────────────────────────────────────
const [activities, setActivities] = useState([]);   // data fra API
const [editing,    setEditing]    = useState(null);  // null = opret-mode
const [form,       setForm]       = useState(EMPTY_FORM); // formular

// ── INITIAL DATA-HENTNING ──────────────────────────────────
useEffect(() => {
    loadActivities();   // kør én gang ved mount
}, []);                 // [] = ingen dependencies, kør ikke igen

const loadActivities = async () => {
    try {
        const data = await getAdminActivities();
        // Normalisér _id så PUT/DELETE altid har et gyldigt id:
        setActivities(data.map(a => ({ ...a, _id: a.id || a._id })));
    } catch (err) {
        toast.error(err.message);
    }
};

// ── KOMMUNIKATION INDEN I KOMPONENTEN ─────────────────────
const handleEditClick = (activity) => {
    setEditing(activity);          // React re-renderer: submit-knap skifter label
    setForm({
        title:       activity.title,
        date:        activity.date,
        time:        activity.time,
        description: activity.description,
        image:       activity.image,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ── KOMMUNIKATION NEDAD (data til UI) ─────────────────────
// activities-state → tabellen re-renderes automatisk:
{activities.map(a => (
    <tr key={a._id}>
        <td>{a.title}</td>
        <td>
            <button onClick={() => handleEditClick(a)}>Rediger</button>
            <button onClick={() => handleDelete(a)}>Slet</button>
        </td>
    </tr>
))}`,
        errors: [
            'Glemme loadActivities() efter sletning/oprettelse → listen viser gammelt data indtil siden reloades',
            'Glemme useEffect med [] → loadActivities() kaldes aldrig og tabellen er altid tom',
            'Mutere activities-array direkte (activities.push(...)) → React opdager ikke ændringen og re-renderer ikke',
            'Sende editing direkte til en child-komponent uden setEditing-callback → barnet kan ikke nulstille forælderens state',
        ],
    },
];

const Card = ({ num, title, answer, code, errors }) => {
    const [open, setOpen] = useState(false);
    return (
        <div style={S.card}>
            <div style={S.cardHead(open)} onClick={() => setOpen(o => !o)}>
                <span style={S.num}>{num}</span>
                <span style={S.title}>{title}</span>
                <span style={S.chevron(open)}>▼</span>
            </div>
            {open && (
                <div style={S.body}>
                    <p style={S.answer}>{answer}</p>
                    {code && (
                        <>
                            <p style={S.label('#c8a96e')}>Kode-eksempel</p>
                            <pre style={S.pre}><code>{code}</code></pre>
                        </>
                    )}
                    {errors?.length > 0 && (
                        <>
                            <p style={S.label('#e87070')}>Typiske fejl</p>
                            <ul style={S.errList}>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

const Eksamen = () => {
    const scroll = (i) => document.getElementById(`ec-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return (
        <div style={S.page}>
            <div style={S.inner}>
                <div style={S.header}>
                    <p style={S.eyebrow}>Gittes Glamping</p>
                    <h1 style={S.h1}>Eksamen 2026</h1>
                    <p style={S.sub}>Klik på et spørgsmål for at åbne det</p>
                </div>
                <nav style={S.nav}>
                    {CARDS.map((c, i) => (
                        <button key={c.num} style={S.navBtn} onClick={() => scroll(i)}>{c.num}</button>
                    ))}
                </nav>
                <hr style={S.hr} />
                {CARDS.map((c, i) => (
                    <div key={c.num} id={`ec-${i}`}>
                        <Card {...c} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Eksamen;
