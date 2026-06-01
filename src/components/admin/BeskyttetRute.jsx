// src/components/admin/BeskyttetRute.jsx
// ─────────────────────────────────────────────────────────
// Beskytter backoffice-ruter mod uautoriseret adgang.
// Redirecter til /backoffice/login hvis admin ikke er logget ind.
// ─────────────────────────────────────────────────────────

import { Navigate, Outlet, useLocation } from 'react-router'
import { erAdminLoggetInd } from '../../utils/adminAuth'

function BeskyttetRute() {
  const location = useLocation()

  if (!erAdminLoggetInd()) {
    // Gem den ønskede URL så vi kan sende brugeren tilbage efter login
    return (
      <Navigate
        to="/backoffice/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return <Outlet />
}

export default BeskyttetRute
