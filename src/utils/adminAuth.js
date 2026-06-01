// src/utils/adminAuth.js
// ─────────────────────────────────────────────────────────
// Simpel admin-autentificering til backoffice.
// Login-status gemmes i sessionStorage og mistes ved luk af browser.
// MVP-tilgang — tilstrækkeligt til skoleforløb og intern demo.
// ─────────────────────────────────────────────────────────

const SESSION_KEY = 'glamping-admin-session'

// Hardkodet admin-bruger
// Brugernavn: admin  |  Adgangskode: glamping2025
const ADMIN_BRUGER = {
  brugernavn: 'admin',
  adgangskode: 'glamping2025',
  visningsNavn: 'Gitte',
}

/**
 * Forsøg at logge admin ind.
 * Returnerer true ved korrekt login, false ellers.
 */
export function logAdminInd(brugernavn, adgangskode) {
  if (
    brugernavn === ADMIN_BRUGER.brugernavn &&
    adgangskode === ADMIN_BRUGER.adgangskode
  ) {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ brugernavn, visningsNavn: ADMIN_BRUGER.visningsNavn })
    )
    return true
  }
  return false
}

/**
 * Log admin ud — sletter session fra sessionStorage.
 */
export function logAdminUd() {
  sessionStorage.removeItem(SESSION_KEY)
}

/**
 * Returnerer true hvis admin er logget ind.
 */
export function erAdminLoggetInd() {
  return !!sessionStorage.getItem(SESSION_KEY)
}

/**
 * Returnerer admin-objektet (brugernavn, visningsNavn) eller null.
 */
export function hentAdminBruger() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}
