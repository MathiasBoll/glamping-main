// src/utils/adminAuth.js
// ─────────────────────────────────────────────────────────
// Admin-autentificering til backoffice.
// Kalder backend /auth/signin og gemmer JWT i sessionStorage.
// Falder tilbage til lokal check hvis backend ikke er tilgængelig.
// ─────────────────────────────────────────────────────────

const SESSION_KEY = 'glamping-admin-session'
const JWT_KEY = 'glamping-admin-jwt'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3042'

// Lokal fallback — bruges hvis backend ikke er tilgængelig
const LOKAL_ADMIN = {
  email: 'gitte@glamping.dk',
  adgangskode: 'glamping2026',
  visningsNavn: 'Gitte',
}

/**
 * Forsøg at logge admin ind via backend (/auth/signin).
 * Falder tilbage til lokal check hvis backend returnerer fejl.
 * Returnerer true ved vellykket login, false ellers.
 */
export async function logAdminInd(email, adgangskode) {
  try {
    const res = await fetch(`${BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: adgangskode }),
    })

    if (res.ok) {
      const json = await res.json()
      const token = json.data?.token || json.token
      if (token) {
        sessionStorage.setItem(JWT_KEY, token)
        sessionStorage.setItem(
          SESSION_KEY,
          JSON.stringify({ email, visningsNavn: 'Admin' })
        )
        return true
      }
    }
  } catch {
    // Backend ikke tilgængeligt — prøv lokal fallback
  }

  // Lokal fallback (email: 'admin', kode: 'glamping2026')
  if (email === LOKAL_ADMIN.email && adgangskode === LOKAL_ADMIN.adgangskode) {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ email, visningsNavn: LOKAL_ADMIN.visningsNavn })
    )
    return true
  }

  return false
}

/**
 * Log admin ud — sletter session og JWT fra sessionStorage.
 */
export function logAdminUd() {
  sessionStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(JWT_KEY)
}

/**
 * Returnerer true hvis admin er logget ind.
 */
export function erAdminLoggetInd() {
  return !!sessionStorage.getItem(SESSION_KEY)
}

/**
 * Returnerer det gemte JWT (eller null hvis ikke logget ind via backend).
 */
export function hentAdminToken() {
  return sessionStorage.getItem(JWT_KEY)
}

/**
 * Returnerer admin-objektet (email, visningsNavn) eller null.
 */
export function hentAdminBruger() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}
