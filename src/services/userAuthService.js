// src/services/userAuthService.js
// ─────────────────────────────────────────────────────────
// API-kald til bruger-registrering og login.
// Gemmer JWT i sessionStorage via userAuth-utility.
// ─────────────────────────────────────────────────────────

import { gemBrugerSession } from '../utils/userAuth'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3042'

/**
 * Opret ny bruger.
 * @param {string} navn
 * @param {string} email
 * @param {string} adgangskode
 */
export async function opretBruger(navn, email, adgangskode) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: navn, email, password: adgangskode }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Oprettelse fejlede (${res.status})`)
  }

  return res.json()
}

/**
 * Log bruger ind og gem JWT i sessionStorage.
 * @param {string} email
 * @param {string} adgangskode
 */
export async function logBrugerInd(email, adgangskode) {
  const res = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: adgangskode }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Forkert e-mail eller adgangskode')
  }

  const json = await res.json()
  const token = json.data?.token || json.token
  if (!token) throw new Error('Ingen token modtaget fra server')

  gemBrugerSession(token, { email })
  return json
}
