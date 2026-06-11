// src/utils/userAuth.js
// ─────────────────────────────────────────────────────────
// Session-håndtering for almindelige brugere (ikke admin).
// Token og bruger gemmes i sessionStorage og mistes ved luk af browser.
// ─────────────────────────────────────────────────────────

const SESSION_KEY = 'glamping-user-session'
const JWT_KEY = 'glamping-user-jwt'

/**
 * Returnerer det gemte bruger-JWT (eller null hvis ikke logget ind).
 */
export function hentBrugerToken() {
  return sessionStorage.getItem(JWT_KEY)
}

/**
 * Gem JWT og bruger-objekt i sessionStorage efter vellykket login.
 */
export function gemBrugerSession(token, bruger) {
  sessionStorage.setItem(JWT_KEY, token)
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(bruger))
}

/**
 * Log bruger ud — sletter session og JWT fra sessionStorage.
 */
export function fjernBrugerSession() {
  sessionStorage.removeItem(JWT_KEY)
  sessionStorage.removeItem(SESSION_KEY)
}

/**
 * Returnerer true hvis brugeren er logget ind.
 */
export function erBrugerLoggetInd() {
  return !!sessionStorage.getItem(JWT_KEY)
}

/**
 * Returnerer bruger-objektet (email, navn) eller null.
 */
export function hentBruger() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}
