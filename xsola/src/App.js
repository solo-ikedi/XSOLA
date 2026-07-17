import { useState, useEffect, useCallback } from 'react';
import './App.css';

// ─────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const SHOP_ID  = '1';

// ─────────────────────────────────────────
// API
// ─────────────────────────────────────────
const api = {
  status:  () => fetch(`${BASE_URL}/status?shop_id=${SHOP_ID}`).then(r => r.json()),
  toggle:  (on) => fetch(`${BASE_URL}/toggle`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shop_id: SHOP_ID, action: on ? 'on' : 'off' }),
  }).then(r => r.json()),
  pay: (amount) => fetch(`${BASE_URL}/pay`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shop_id: SHOP_ID, amount }),
  }).then(r => r.json()),
  login: (email, password) => fetch(`${BASE_URL}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(r => r.json()),
  signup: (name, phone, email, password) => fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone, email, password }),
  }).then(r => r.json()),
  history: () => fetch(`${BASE_URL}/history?shop_id=${SHOP_ID}`).then(r => r.json()),
};

// ─────────────────────────────────────────
// BOTTOM NAV — shown on all app screens
// ─────────────────────────────────────────
function BottomNav({ active, goTo }) {
  const tabs = [
    { id: 'dashboard', icon: '🏠', label: 'Home'     },
    { id: 'payment',   icon: '💳', label: 'Pay'      },
    { id: 'history',   icon: '📊', label: 'History'  },
    { id: 'settings',  icon: '⚙️', label: 'Settings' },
  ];
  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`nav-tab ${active === t.id ? 'active' : ''}`}
          onClick={() => goTo(t.id)}
        >
          <span className="nav-icon">{t.icon}</span>
          <span className="nav-label">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─────────────────────────────────────────
// APP ROUTER
// ─────────────────────────────────────────
const APP_SCREENS = ['dashboard', 'payment', 'history', 'settings'];

export default function App() {
  const [screen, setScreen]             = useState('splash');
  const [feedbackType, setFeedbackType] = useState('success');
  const [paidAmount, setPaidAmount]     = useState(0);
  const [user, setUser]                 = useState(
    () => { try { return JSON.parse(localStorage.getItem('xsola_user')); } catch { return null; } }
  );

  const goTo = (s, opts = {}) => {
    if (opts.feedbackType) setFeedbackType(opts.feedbackType);
    if (opts.amount)       setPaidAmount(opts.amount);
    if (opts.user)         setUser(opts.user);
    setScreen(s);
    window.scrollTo(0, 0);
  };

  const isAppScreen = APP_SCREENS.includes(screen);

  return (
    <div className="app">
      {screen === 'splash'    && <SplashScreen goTo={goTo} />}
      {screen === 'home'      && <HomePage     goTo={goTo} />}
      {screen === 'login'     && <LoginScreen  goTo={goTo} />}
      {screen === 'signup'    && <SignupScreen  goTo={goTo} />}

      {/* App screens — all have bottom nav */}
      {isAppScreen && (
        <div className="app-shell">
          {screen === 'dashboard' && <Dashboard goTo={goTo} user={user} />}
          {screen === 'payment'   && <Payment   goTo={goTo} />}
          {screen === 'history'   && <HistoryScreen goTo={goTo} />}
          {screen === 'settings'  && <Settings  goTo={goTo} user={user} setUser={setUser} />}
          <BottomNav active={screen} goTo={goTo} />
        </div>
      )}

      {screen === 'feedback' && (
        <Feedback type={feedbackType} amount={paidAmount} goTo={goTo} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// SPLASH SCREEN
// ═══════════════════════════════════════════
function SplashScreen({ goTo }) {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    // Animate dots
    const dotTimer = setInterval(() => setDots(d => (d + 1) % 4), 400);
    // Auto advance after 2.8s
    const navTimer = setTimeout(() => goTo('home'), 2800);
    return () => { clearInterval(dotTimer); clearTimeout(navTimer); };
  }, [goTo]);

  return (
    <div className="splash">
      <div className="splash-glow" />
      <div className="splash-ring">
        <div className="splash-inner">⚡</div>
      </div>
      <h1 className="splash-logo">XSola</h1>
      <p className="splash-tag">Smart Power · Pay · Connect</p>
      <div className="splash-dots">
        {[0,1,2].map(i => (
          <span key={i} className={`splash-dot ${dots > i ? 'lit' : ''}`} />
        ))}
      </div>
      <p className="splash-version">v1.0 MVP</p>
    </div>
  );
}

// ═══════════════════════════════════════════
// HOME / LANDING PAGE
// ═══════════════════════════════════════════
function HomePage({ goTo }) {
  const features = [
    { icon: '⚡', title: 'Instant Power',    desc: 'Pay and electricity turns ON immediately.' },
    { icon: '📱', title: 'Control Anywhere', desc: 'Manage your shop power from your phone.' },
    { icon: '🔒', title: 'Pay As You Go',    desc: 'No payment, no power. Fair and automated.' },
    { icon: '📊', title: 'Track Usage',      desc: 'See how long your power runs and costs.' },
  ];
  const steps = [
    { num: '01', title: 'Sign Up',      desc: 'Create your XSola account in seconds.' },
    { num: '02', title: 'Buy Power',    desc: 'Enter amount and pay for electricity.' },
    { num: '03', title: 'Power ON ⚡',  desc: 'Shop lights up automatically.' },
  ];

  return (
    <div className="home-page">
      {/* NAV */}
      <nav className="home-nav">
        <span className="logo">XSola</span>
        <div className="nav-links">
          <button className="btn-nav-ghost"  onClick={() => goTo('login')}>Login</button>
          <button className="btn-nav-yellow" onClick={() => goTo('signup')}>Get Started</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">🇳🇬 Built for Nigerian Businesses</div>
        <h1 className="hero-title">Smart Power.<br /><span className="hero-accent">Pay. Connect.</span></h1>
        <p className="hero-sub">
          XSola lets charging centers and small shops pay for electricity digitally —
          power turns ON automatically. No manual switches. No overuse.
        </p>
        <div className="hero-btns">
          <button className="btn btn-yellow"  onClick={() => goTo('signup')}>Get Started Free →</button>
          <button className="btn btn-outline" onClick={() => goTo('login')}>Login to Dashboard</button>
        </div>

        {/* PHONE MOCKUP */}
        <div className="hero-mockup">
          <div className="mockup-phone">
            <div className="mockup-bar">
              <span>9:41</span>
              <span style={{fontWeight:900, color:'#FFD700', fontSize:11}}>XSola</span>
            </div>
            <div className="mockup-power">
              <p className="mockup-label">POWER STATUS</p>
              <span style={{fontSize:40, filter:'drop-shadow(0 0 12px #00E676)'}}>⚡</span>
              <p style={{fontSize:18, fontWeight:900, color:'#00E676', letterSpacing:3}}>POWER ON</p>
              <div className="mockup-pill">⏳ <span>2 days 4 hrs</span></div>
            </div>
            <div className="mockup-nav">
              {['🏠','💳','📊','⚙️'].map((ic,i) => (
                <div key={i} className={`mockup-nav-item ${i===0?'active':''}`}>
                  <span>{ic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <p className="section-chip">HOW IT WORKS</p>
        <h2 className="section-title">3 Simple Steps</h2>
        <div className="steps-list">
          {steps.map((s,i) => (
            <div className="step-item" key={i}>
              <div className="step-num">{s.num}</div>
              <div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <p className="section-chip">FEATURES</p>
        <h2 className="section-title">Everything You Need</h2>
        <div className="features-grid">
          {features.map((f,i) => (
            <div className="feature-card" key={i}>
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to control your power?</h2>
        <p className="cta-sub">Join businesses already using XSola.</p>
        <button className="btn btn-yellow cta-btn" onClick={() => goTo('signup')}>
          Create Free Account →
        </button>
      </section>

      <footer className="home-footer">
        <span className="logo">XSola</span>
        <p className="footer-sub">Smart electricity for African businesses · © 2026</p>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════
function LoginScreen({ goTo }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Fill in all fields'); return; }
    setLoading(true); setError('');
    try {
      const data = await api.login(email, password);
      if (data.token) {
        localStorage.setItem('xsola_user', JSON.stringify(data.user));
        goTo('dashboard', { user: data.user });
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch {
      goTo('dashboard', { user: { name: email } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <button className="back-btn auth-back" onClick={() => goTo('home')}>←</button>
      <div className="auth-top">
        <span className="logo">XSola</span>
        <h1 className="auth-title">Welcome Back ⚡</h1>
        <p className="auth-sub">Log in to manage your power</p>
      </div>
      {error && <div className="error-bar">⚠ {error}</div>}
      <div className="auth-form">
        <label className="field-label">EMAIL / PHONE</label>
        <input className="auth-input" type="email" placeholder="you@example.com"
          value={email} onChange={e => setEmail(e.target.value)} />
        <label className="field-label">PASSWORD</label>
        <input className="auth-input" type="password" placeholder="••••••••"
          value={password} onChange={e => setPassword(e.target.value)} />
        <p className="forgot-link">Forgot password?</p>
        <button className={`btn btn-yellow ${loading ? 'busy' : ''}`}
          onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in…' : 'LOGIN →'}
        </button>
        <p className="auth-switch">
          No account? <span className="link" onClick={() => goTo('signup')}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SIGNUP
// ═══════════════════════════════════════════
function SignupScreen({ goTo }) {
  const [form, setForm]       = useState({ name:'', phone:'', email:'', password:'', confirm:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSignup = async () => {
    if (!form.name || !form.phone || !form.email || !form.password) {
      setError('Fill in all fields'); return;
    }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      const data = await api.signup(form.name, form.phone, form.email, form.password);
      if (data.token) {
        localStorage.setItem('xsola_user', JSON.stringify(data.user));
        goTo('dashboard', { user: data.user });
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch {
      goTo('dashboard', { user: { name: form.name } });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { k:'name',     label:'FULL NAME',       type:'text',     ph:'Chukwuemeka Obi'    },
    { k:'phone',    label:'PHONE NUMBER',     type:'tel',      ph:'+234 801 234 5678'  },
    { k:'email',    label:'EMAIL ADDRESS',    type:'email',    ph:'you@example.com'    },
    { k:'password', label:'PASSWORD',         type:'password', ph:'••••••••'           },
    { k:'confirm',  label:'CONFIRM PASSWORD', type:'password', ph:'••••••••'           },
  ];

  return (
    <div className="auth-page">
      <button className="back-btn auth-back" onClick={() => goTo('home')}>←</button>
      <div className="auth-top">
        <span className="logo">XSola</span>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-sub">Join smart businesses managing power better</p>
      </div>
      {error && <div className="error-bar">⚠ {error}</div>}
      <div className="auth-form">
        {fields.map(f => (
          <div key={f.k}>
            <label className="field-label">{f.label}</label>
            <input className="auth-input" type={f.type} placeholder={f.ph}
              value={form[f.k]} onChange={set(f.k)} />
          </div>
        ))}
        <button className={`btn btn-yellow ${loading ? 'busy' : ''}`}
          onClick={handleSignup} disabled={loading}>
          {loading ? 'Creating account…' : 'CREATE ACCOUNT →'}
        </button>
        <p className="auth-switch">
          Already have an account? <span className="link" onClick={() => goTo('login')}>Login</span>
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════
function Dashboard({ goTo, user }) {
  const [status, setStatus]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError]       = useState('');

  const fetchStatus = useCallback(async () => {
    try {
      const data = await api.status();
      setStatus(data); setError('');
    } catch {
      setError('Cannot reach backend');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const t = setInterval(fetchStatus, 10000);
    return () => clearInterval(t);
  }, [fetchStatus]);

  const handleToggle = async () => {
    if (!status || toggling) return;
    setToggling(true);
    try { await api.toggle(!status.power_on); await fetchStatus(); }
    catch { setError('Toggle failed'); }
    finally { setToggling(false); }
  };

  const powerOn = status?.power_on ?? false;

  return (
    <div className="screen">
      {/* TOPBAR */}
      <div className="topbar">
        <div>
          <p className="shop-label">GOOD MORNING</p>
          <h2 className="shop-name">{user?.name ?? 'Emeka Charging Hub'}</h2>
        </div>
        <div className="topbar-right">
          <button className="avatar-btn" onClick={() => goTo('settings')}>
            {(user?.name?.[0] ?? 'U').toUpperCase()}
          </button>
        </div>
      </div>

      {error && <div className="error-bar">⚠ {error}</div>}

      {/* POWER CARD */}
      {loading
        ? <div className="power-card skeleton" />
        : (
          <div className={`power-card ${powerOn ? 'on' : 'off'}`}>
            <p className="power-label">POWER STATUS</p>
            <div className={`power-icon ${powerOn ? 'on' : 'off'}`}>{powerOn ? '⚡' : '🔌'}</div>
            <h1 className={`power-status ${powerOn ? 'on' : 'off'}`}>POWER {powerOn ? 'ON' : 'OFF'}</h1>
            <div className="time-pill">⏳ <span>{status?.time_remaining ?? '—'}</span></div>
          </div>
        )
      }

      {/* TOGGLE */}
      <div className="card toggle-row">
        <div>
          <p className="toggle-title">Power Switch</p>
          <p className="toggle-sub">{powerOn ? 'Tap to turn OFF' : 'Tap to turn ON'}</p>
        </div>
        <button className={`toggle ${powerOn ? 'on' : 'off'} ${toggling ? 'busy' : ''}`}
          onClick={handleToggle} disabled={toggling}>
          <span className="knob" />
        </button>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="card stat">
          <span className="stat-icon">💳</span>
          <p className="stat-val">{status?.last_payment ? `₦${status.last_payment.toLocaleString()}` : '—'}</p>
          <p className="stat-label">Last Payment</p>
        </div>
        <div className="card stat">
          <span className="stat-icon">📡</span>
          <p className="stat-val">{status?.device_status ?? '—'}</p>
          <p className="stat-label">Device</p>
        </div>
      </div>

      {/* BUY POWER */}
      <button className="btn btn-yellow" onClick={() => goTo('payment')}>💳 &nbsp;BUY POWER</button>
      <button className="btn btn-ghost"  onClick={fetchStatus}>↻ &nbsp;Refresh</button>
    </div>
  );
}

// ═══════════════════════════════════════════
// PAYMENT
// ═══════════════════════════════════════════
function Payment({ goTo }) {
  const [amount, setAmount]     = useState('');
  const [selected, setSelected] = useState(null);
  const [paying, setPaying]     = useState(false);
  const quickAmounts            = [500, 1000, 2000, 5000];

  const selectQuick = v => { setSelected(v); setAmount(String(v)); };

  const handlePay = async () => {
    const num = parseInt(amount);
    if (!num || num < 100) { alert('Enter a valid amount (min ₦100)'); return; }
    setPaying(true);
    try {
      await api.pay(num);
      goTo('feedback', { feedbackType: 'success', amount: num });
    } catch {
      goTo('feedback', { feedbackType: 'error' });
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="screen">
      <div className="topbar">
        <h2 className="shop-name">Buy Power</h2>
        <span className="logo">XSola</span>
      </div>

      <div className="card preview-card">
        <p className="preview-label">YOU ARE PAYING</p>
        <h1 className="preview-amount">₦{amount ? parseInt(amount).toLocaleString() : '0'}</h1>
        <p className="preview-sub">Power activates instantly ⚡</p>
      </div>

      <div className="input-group">
        <label className="field-label">ENTER AMOUNT</label>
        <div className="amount-wrap">
          <span className="prefix">₦</span>
          <input type="number" className="amount-input" placeholder="0"
            value={amount} min="100"
            onChange={e => { setAmount(e.target.value); setSelected(null); }} />
        </div>
      </div>

      <div className="input-group">
        <label className="field-label">QUICK SELECT</label>
        <div className="quick-grid">
          {quickAmounts.map(q => (
            <button key={q} className={`qbtn ${selected === q ? 'sel' : ''}`} onClick={() => selectQuick(q)}>
              {q >= 1000 ? `₦${q/1000}k` : `₦${q}`}
            </button>
          ))}
        </div>
      </div>

      <button className={`btn btn-yellow ${paying ? 'busy' : ''}`} onClick={handlePay} disabled={paying}>
        {paying ? 'Processing…' : 'PAY NOW →'}
      </button>
      <p className="pay-note">🔒 Secured · Power activates immediately after payment</p>
    </div>
  );
}

// ═══════════════════════════════════════════
// HISTORY
// ═══════════════════════════════════════════
const DUMMY_HISTORY = [
  { amount:2000, date:'Apr 18, 2026', time_added:'2 days', status:'success' },
  { amount:1000, date:'Apr 15, 2026', time_added:'1 day',  status:'success' },
  { amount:5000, date:'Apr 10, 2026', time_added:'5 days', status:'success' },
  { amount:500,  date:'Apr 5, 2026',  time_added:'12 hrs', status:'success' },
];

function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.history()
      .then(data => setHistory(data))
      .catch(() => setHistory(DUMMY_HISTORY))
      .finally(() => setLoading(false));
  }, []);

  const total = history.reduce((s, h) => s + h.amount, 0);

  return (
    <div className="screen">
      <div className="topbar">
        <h2 className="shop-name">History</h2>
        <span className="logo">XSola</span>
      </div>

      {/* TOTAL SPENT */}
      <div className="card" style={{
        background:'linear-gradient(135deg,#120f00,var(--card))',
        borderColor:'rgba(255,215,0,0.15)', textAlign:'center', padding:'20px'
      }}>
        <p style={{fontSize:11, color:'var(--grey)', letterSpacing:2, marginBottom:6}}>TOTAL SPENT</p>
        <p style={{fontSize:32, fontWeight:900, color:'var(--yellow)'}}>₦{total.toLocaleString()}</p>
        <p style={{fontSize:12, color:'var(--grey)', marginTop:4}}>{history.length} payments</p>
      </div>

      {loading ? (
        <p style={{color:'var(--grey)', textAlign:'center', marginTop:32}}>Loading…</p>
      ) : history.length === 0 ? (
        <div className="empty-state">
          <span style={{fontSize:48}}>📭</span>
          <p>No payments yet</p>
        </div>
      ) : (
        <div style={{display:'flex', flexDirection:'column', gap:10}}>
          {history.map((item, i) => (
            <div className="card" key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div style={{display:'flex', gap:14, alignItems:'center'}}>
                <div style={{
                  width:42, height:42, borderRadius:12,
                  background:'rgba(0,230,118,0.1)', border:'1px solid rgba(0,230,118,0.2)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:20,
                }}>⚡</div>
                <div>
                  <p style={{fontSize:14, fontWeight:700}}>Power Purchase</p>
                  <p style={{fontSize:11, color:'var(--grey)', marginTop:3}}>{item.date} · {item.time_added} added</p>
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <p style={{fontSize:16, fontWeight:800, color:'var(--green)'}}>₦{item.amount.toLocaleString()}</p>
                <p style={{fontSize:10, marginTop:3, fontWeight:700, color:'var(--green)'}}>✓ SUCCESS</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════
function Settings({ goTo, user, setUser }) {
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh,   setAutoRefresh]   = useState(true);
  const [darkMode,      setDarkMode]      = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('xsola_user');
    localStorage.removeItem('xsola_token');
    setUser(null);
    goTo('home');
  };

  const SettingRow = ({ icon, title, sub, value, onToggle }) => (
    <div className="setting-row">
      <div style={{display:'flex', gap:14, alignItems:'center'}}>
        <div className="setting-icon">{icon}</div>
        <div>
          <p className="setting-title">{title}</p>
          {sub && <p className="setting-sub">{sub}</p>}
        </div>
      </div>
      <button className={`toggle ${value ? 'on' : 'off'}`} onClick={onToggle} style={{flexShrink:0}}>
        <span className="knob" />
      </button>
    </div>
  );

  return (
    <div className="screen">
      <div className="topbar">
        <h2 className="shop-name">Settings</h2>
        <span className="logo">XSola</span>
      </div>

      {/* PROFILE CARD */}
      <div className="card" style={{display:'flex', gap:16, alignItems:'center'}}>
        <div className="profile-avatar">
          {(user?.name?.[0] ?? 'U').toUpperCase()}
        </div>
        <div>
          <p style={{fontSize:16, fontWeight:800}}>{user?.name ?? 'User'}</p>
          <p style={{fontSize:12, color:'var(--grey)', marginTop:3}}>{user?.email ?? 'xsola@email.com'}</p>
          <p style={{
            fontSize:10, color:'var(--green)', fontWeight:700,
            background:'rgba(0,230,118,0.1)', border:'1px solid rgba(0,230,118,0.2)',
            borderRadius:6, padding:'2px 8px', display:'inline-block', marginTop:6,
          }}>● Active</p>
        </div>
      </div>

      {/* SHOP INFO */}
      <div>
        <p className="settings-section-label">SHOP INFO</p>
        <div className="card settings-group">
          {[
            { icon:'🏪', label:'Shop Name',  value:'Emeka Charging Hub' },
            { icon:'📍', label:'Location',   value:'Aba, Abia State'    },
            { icon:'🔌', label:'Device ID',  value:'ESP32-001'          },
            { icon:'📱', label:'Shop ID',    value:`#${SHOP_ID}`        },
          ].map((r,i) => (
            <div key={i} className="info-row">
              <div style={{display:'flex', gap:12, alignItems:'center'}}>
                <span style={{fontSize:18}}>{r.icon}</span>
                <p style={{fontSize:13, color:'var(--grey)'}}>{r.label}</p>
              </div>
              <p style={{fontSize:13, fontWeight:700}}>{r.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PREFERENCES */}
      <div>
        <p className="settings-section-label">PREFERENCES</p>
        <div className="card settings-group">
          <SettingRow icon="🔔" title="Notifications" sub="Power alerts + payments"
            value={notifications} onToggle={() => setNotifications(v => !v)} />
          <div className="settings-divider" />
          <SettingRow icon="↻" title="Auto Refresh" sub="Sync every 10 seconds"
            value={autoRefresh} onToggle={() => setAutoRefresh(v => !v)} />
          <div className="settings-divider" />
          <SettingRow icon="🌑" title="Dark Mode" sub="Always on for XSola"
            value={darkMode} onToggle={() => setDarkMode(v => !v)} />
        </div>
      </div>

      {/* ABOUT */}
      <div>
        <p className="settings-section-label">ABOUT</p>
        <div className="card settings-group">
          {[
            { icon:'ℹ️',  label:'Version',       value:'v1.0 MVP'   },
            { icon:'🌐',  label:'Backend',        value:BASE_URL     },
            { icon:'📜',  label:'Terms of Service', value:'View →'  },
            { icon:'🔒',  label:'Privacy Policy', value:'View →'    },
          ].map((r,i) => (
            <div key={i} className="info-row">
              <div style={{display:'flex', gap:12, alignItems:'center'}}>
                <span style={{fontSize:18}}>{r.icon}</span>
                <p style={{fontSize:13, color:'var(--grey)'}}>{r.label}</p>
              </div>
              <p style={{fontSize:13, fontWeight:700, color: r.value.includes('→') ? 'var(--yellow)' : 'var(--white)'}}>
                {r.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* LOGOUT */}
      <button className="btn btn-outline" style={{borderColor:'var(--red)', color:'var(--red)'}}
        onClick={handleLogout}>
        🚪 &nbsp;Logout
      </button>

      <p style={{textAlign:'center', fontSize:11, color:'var(--grey)'}}>
        XSola · Smart Power for African Businesses
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════
// FEEDBACK
// ═══════════════════════════════════════════
function Feedback({ type, amount, goTo }) {
  const ok = type === 'success';
  return (
    <div className={`screen feedback-screen ${ok ? 'success-bg' : 'error-bg'}`}>
      <div className="feedback-body">
        <div className="fb-icon">{ok ? '⚡' : '❌'}</div>
        <h1 className={`fb-title ${ok ? 'green' : 'red'}`}>
          {ok ? 'Power Activated!' : 'Payment Failed'}
        </h1>
        <p className="fb-sub">
          {ok ? `Your electricity is now ON.\n₦${amount?.toLocaleString()} payment confirmed ✅`
              : 'Something went wrong.\nPlease try again.'}
        </p>
        <button className="btn btn-yellow" onClick={() => goTo('dashboard')}>BACK TO DASHBOARD →</button>
        {!ok && <button className="btn btn-outline" onClick={() => goTo('payment')}>TRY AGAIN</button>}
      </div>
    </div>
  );
}