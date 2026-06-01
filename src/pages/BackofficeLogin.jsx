// src/pages/BackofficeLogin.jsx
// ─────────────────────────────────────────────────────────
// Admin login-side til backoffice.
// Login-status gemmes i sessionStorage og mistes ved luk af browser.
// Brugernavn: admin  |  Adgangskode: glamping2025
// ─────────────────────────────────────────────────────────

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { logAdminInd } from '../utils/adminAuth'
import styles from './BackofficeLogin.module.css'

function BackofficeLogin() {
  const navigate = useNavigate()
  const location = useLocation()

  const [brugernavn, setBrugernavn] = useState('')
  const [adgangskode, setAdgangskode] = useState('')
  const [fejl, setFejl] = useState('')
  const [loggerInd, setLoggerInd] = useState(false)

  // Send brugeren tilbage til den side de forsøgte at tilgå, eller /backoffice
  const redirectTil = location.state?.from || '/backoffice'

  function haandterLogin(e) {
    e.preventDefault()
    if (loggerInd) return

    setLoggerInd(true)
    setFejl('')

    const lykkedes = logAdminInd(brugernavn, adgangskode)

    if (!lykkedes) {
      setFejl('Forkert brugernavn eller adgangskode.')
      setLoggerInd(false)
      return
    }

    navigate(redirectTil, { replace: true })
  }

  return (
    <div className={styles.side}>
      <div className={styles.kort}>
        <div className={styles.logoWrap}>
          <p style={{ fontSize: '2rem' }}>🌿</p>
        </div>

        <h1 className={styles.titel}>Log ind</h1>
        <p className={styles.undertitel}>
          Log ind for at styre aktiviteter og indhold.
        </p>

        {fejl && <div className={styles.fejl}>{fejl}</div>}

        <form onSubmit={haandterLogin} noValidate>
          <div className={styles.felt}>
            <label htmlFor="brugernavn">Brugernavn</label>
            <input
              id="brugernavn"
              type="text"
              value={brugernavn}
              onChange={(e) => setBrugernavn(e.target.value)}
              placeholder="Skriv dit brugernavn"
              autoComplete="username"
              required
            />
          </div>

          <div className={styles.felt}>
            <label htmlFor="adgangskode">Adgangskode</label>
            <input
              id="adgangskode"
              type="password"
              value={adgangskode}
              onChange={(e) => setAdgangskode(e.target.value)}
              placeholder="Skriv din adgangskode"
              autoComplete="current-password"
              required
            />
          </div>

          <div className={styles.handlinger}>
            <button type="submit" className={styles.btnLogin} disabled={loggerInd}>
              {loggerInd ? 'Logger ind...' : 'Log ind'}
            </button>
            <Link to="/" className={styles.btnTilbage}>
              ← Tilbage til forsiden
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BackofficeLogin
