// src/pages/Backoffice.jsx
// ─────────────────────────────────────────────────────────
// Backoffice-dashboard med 6 faner:
//   Aktiviteter | Ophold | Beskeder | Anmeldelser | Abonnenter | Bookinger
// Kræver admin-login (BeskældetRute).
// ─────────────────────────────────────────────────────

import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { logAdminUd, hentAdminBruger } from '../utils/adminAuth';
import TabActiviteter from '../components/admin/TabActiviteter';
import TabOphold from '../components/admin/TabOphold';
import TabBeskeder from '../components/admin/TabBeskeder';
import TabAnmeldelser from '../components/admin/TabAnmeldelser';
import TabAbonnenter from '../components/admin/TabAbonnenter';
import TabBookinger from '../components/admin/TabBookinger';
import styles from './Backoffice.module.css';

const TABS = [
    { id: 'aktiviteter', label: 'Aktiviteter' },
    { id: 'ophold', label: 'Ophold' },
    { id: 'beskeder', label: 'Beskeder' },
    { id: 'anmeldelser', label: 'Anmeldelser' },
    { id: 'abonnenter', label: 'Abonnenter' },
    { id: 'bookinger', label: 'Bookinger' },
];

const Backoffice = () => {
    const navigate = useNavigate();
    const adminBruger = hentAdminBruger();
    const [aktiveTab, setAktiveTab] = useState('aktiviteter');

    return (
        <div className={styles.page}>

            {/* ── Header ── */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Backoffice</h1>
                    <span className={styles.badge}>Logget ind som {adminBruger?.visningsNavn ?? 'Admin'}</span>
                </div>
                <div className={styles.headerActions}>
                    <Link to="/" className={styles.backLink}>← Tilbage til frontend</Link>
                    <button
                        className={styles.btnDelete}
                        onClick={() => { logAdminUd(); navigate('/backoffice/login'); }}
                    >
                        Log ud
                    </button>
                </div>
            </div>

            {/* ── Tab-navigation ── */}
            <div className={styles.tabs}>
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tab} ${aktiveTab === tab.id ? styles.tabActive : ''}`}
                        onClick={() => setAktiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Aktiv fane ── */}
            {aktiveTab === 'aktiviteter' && <TabActiviteter />}
            {aktiveTab === 'ophold' && <TabOphold />}
            {aktiveTab === 'beskeder' && <TabBeskeder />}
            {aktiveTab === 'anmeldelser' && <TabAnmeldelser />}
            {aktiveTab === 'abonnenter' && <TabAbonnenter />}
            {aktiveTab === 'bookinger' && <TabBookinger />}
        </div>
    );
};

export default Backoffice;
