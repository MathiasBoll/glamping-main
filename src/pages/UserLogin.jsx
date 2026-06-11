// src/pages/UserLogin.jsx
// ─────────────────────────────────────────────────────────
// Login / opret bruger — kræves for at synkronisere
// "Min liste" med backend.
// ─────────────────────────────────────────────────────────

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { logBrugerInd, opretBruger } from '../services/userAuthService'
import styles from './UserLogin.module.css'

function UserLogin() {
  const navigate = useNavigate()
  const location = useLocation()

  const [tilstand, setTilstand] = useState('login') // 'login' | 'opret'
  const [navn, setNavn] = useState('')
  const [email, setEmail] = useState('')
  const [adgangskode, setAdgangskode] = useState('')
  const [fejl, setFejl] = useState('')
  const [sender, setSender] = useState(false)

  const redirectTil = location.state?.from || '/liked'

  async function haandterIndsend(e) {
    e.preventDefault()
    if (sender) return

    setSender(true)
    setFejl('')

    try {
      if (tilstand === 'login') {
        await logBrugerInd(email, adgangskode)
      } else {
        await opretBruger(navn, email, adgangskode)
        await logBrugerInd(email, adgangskode)
      }
      navigate(redirectTil, { replace: true })
    } catch (err) {
      setFejl(err.message)
      setSender(false)
    }
  }

  return (
    <div className={styles.side}>
      <div className={styles.kort}>
        <div className={styles.logoWrap}>
          <p style={{ fontSize: '2rem' }}>🌿</p>
        </div>

        <h1 className={styles.titel}>
          {tilstand === 'login' ? 'Log ind' : 'Opret bruger'}
        </h1>
        <p className={styles.undertitel}>
          {tilstand === 'login'
            ? 'Log ind for at gemme din liste på tværs af enheder.'
            : 'Opret en gratis bruger og gem din liste overalt.'}
        </p>

        {fejl && <div className={styles.fejl}>{fejl}</div>}

        <form onSubmit={haandterIndsend} noValidate>
          {tilstand === 'opret' && (
            <div className={styles.felt}>
              <label htmlFor="navn">Navn</label>
              <input
                id="navn"
                type="text"
                value={navn}
                onChange={(e) => setNavn(e.target.value)}
                placeholder="Skriv dit navn"
                autoComplete="name"
                required
              />
            </div>
          )}

          <div className={styles.felt}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Skriv din e-mail"
              autoComplete="email"
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
              autoComplete={tilstand === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </div>

          <div className={styles.handlinger}>
            <button type="submit" className={styles.btnLogin} disabled={sender}>
              {sender
                ? tilstand === 'login' ? 'Logger ind...' : 'Opretter...'
                : tilstand === 'login' ? 'Log ind' : 'Opret bruger'}
            </button>
            <Link to="/liked" className={styles.btnTilbage}>
              ← Tilbage til min liste
            </Link>
          </div>
        </form>

        <p className={styles.skift}>
          {tilstand === 'login' ? (
            <>
              Ingen bruger?{' '}
              <button
                className={styles.skiftBtn}
                onClick={() => { setTilstand('opret'); setFejl('') }}
              >
                Opret en her
              </button>
            </>
          ) : (
            <>
              Har du allerede en bruger?{' '}
              <button
                className={styles.skiftBtn}
                onClick={() => { setTilstand('login'); setFejl('') }}
              >
                Log ind
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

export default UserLogin
