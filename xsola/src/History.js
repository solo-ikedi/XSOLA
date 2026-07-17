// ─────────────────────────────────────────────────────
//  History Screen
//  Shows all past payments for the shop.
//  Connects to GET /history?shop_id=1
// ─────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { paymentAPI } from './api';

export default function History({ goTo }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const SHOP_ID = '1';

  useEffect(() => {
    paymentAPI.getHistory(SHOP_ID)
      .then(data => setHistory(data))
      .catch(err => {
        setError(err.message);
        // Show dummy data if backend not ready
        setHistory(DUMMY_HISTORY);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="screen">
      <div className="back-row">
        <button className="back-btn" onClick={() => goTo('dashboard')}>←</button>
        <h3 className="back-title">Payment History</h3>
      </div>

      {error && (
        <div className="error-bar">
          ⚠ {error} — showing sample data
        </div>
      )}

      {loading ? (
        <div style={{ color: 'var(--grey)', textAlign: 'center', marginTop: 40 }}>
          Loading history…
        </div>
      ) : history.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 48 }}>📭</span>
          <p>No payments yet</p>
          <button className="btn btn-yellow" onClick={() => goTo('payment')}>
            Make First Payment
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {history.map((item, i) => (
            <div className="card history-item" key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <span style={{ fontSize: 28 }}>⚡</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700 }}>Power Purchase</p>
                    <p style={{ fontSize: 11, color: 'var(--grey)', marginTop: 3 }}>
                      {item.date} · {item.time_added} added
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--green)' }}>
                    ₦{item.amount.toLocaleString()}
                  </p>
                  <p style={{
                    fontSize: 10, marginTop: 3, fontWeight: 700,
                    color: item.status === 'success' ? 'var(--green)' : 'var(--red)',
                  }}>
                    {item.status === 'success' ? '✓ SUCCESS' : '✗ FAILED'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Shown while backend is not ready yet
const DUMMY_HISTORY = [
  { amount: 2000, date: 'Apr 18, 2026', time_added: '2 days',  status: 'success' },
  { amount: 1000, date: 'Apr 15, 2026', time_added: '1 day',   status: 'success' },
  { amount: 5000, date: 'Apr 10, 2026', time_added: '5 days',  status: 'success' },
  { amount: 500,  date: 'Apr 5, 2026',  time_added: '12 hrs',  status: 'success' },
];