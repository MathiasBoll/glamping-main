// src/services/myListService.js
// ─────────────────────────────────────────────────────────
// API-kald til /mylists — gem og hent favoritaktiviteter på backend.
// Kræver at brugeren er logget ind (JWT i sessionStorage).
// ─────────────────────────────────────────────────────────

import { hentBrugerToken } from '../utils/userAuth'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3042'

async function request(method, body = null) {
  const token = hentBrugerToken()
  if (!token) throw new Error('Ikke logget ind')

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }

  if (body) options.body = JSON.stringify(body)

  const res = await fetch(`${BASE_URL}/mylists`, options)

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `HTTP fejl: ${res.status}`)
  }

  const text = await res.text()
  return text ? JSON.parse(text) : null
}

/** Hent brugerens gemte liste fra backend. */
export const hentMinListe = () => request('GET')

/** Tilføj en aktivitet til backend-listen. */
export const tilfoejTilListe = (activityId) => request('POST', { activityId })

/** Fjern en aktivitet fra backend-listen. */
export const fjernFraListe = (activityId) => request('DELETE', { activityId })
