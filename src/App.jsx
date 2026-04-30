/* ── Reset & Variables ───────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #080b12;
  --surface: #0e1420;
  --surface-2: #141c2e;
  --border: rgba(255,255,255,0.06);
  --border-2: rgba(255,255,255,0.1);
  --text: #f0f2f8;
  --text-2: #8b9ab5;
  --text-3: #4a5568;
  --accent: #5b8eff;
  --accent-2: #7c5cfc;
  --green: #34d399;
  --amber: #fbbf24;
  --red: #f87171;
  --radius: 12px;
  --radius-sm: 8px;
  --font: 'Inter', 'DM Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

html, body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  font-size: 14px;
  line-height: 1.6;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

button { cursor: pointer; font-family: var(--font); border: none; outline: none; }
input { font-family: var(--font); outline: none; }
a { text-decoration: none; }

/* ── App Shell ───────────────────────────────────── */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 780px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
}

/* ── Orbs ────────────────────────────────────────── */
.orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}
.orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(91,142,255,0.12) 0%, transparent 70%);
  top: -100px; right: -100px;
}
.orb-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(124,92,252,0.1) 0%, transparent 70%);
  bottom: 0; left: -100px;
}

/* ── Header ──────────────────────────────────────── */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0 20px;
  border-bottom: 1px solid var(--border);
  position: relative;
  z-index: 10;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  width: 34px; height: 34px;
  background: linear-gradient(135deg, #1a2540, #0e1a35);
  border: 1px solid var(--border-2);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}

.brand-name {
  font-weight: 600;
  font-size: 15px;
  letter-spacing: -0.02em;
  color: var(--text);
}

.brand-tag {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 20px;
  background: rgba(91,142,255,0.12);
  color: var(--accent);
  font-weight: 500;
  border: 1px solid rgba(91,142,255,0.2);
}

.wallet-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: var(--surface);
  border: 1px solid var(--border-2);
  border-radius: 20px;
  font-size: 13px;
  font-family: var(--font-mono);
  color: var(--text-2);
}

.wallet-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.wallet-dot.ok { background: var(--green); box-shadow: 0 0 8px var(--green); }
.wallet-dot.warn { background: var(--amber); box-shadow: 0 0 8px var(--amber); }

.btn-header {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  transition: opacity 0.15s, transform 0.1s;
}
.btn-header:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
.btn-header:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Banner ──────────────────────────────────────── */
.banner-warn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(251,191,36,0.08);
  border: 1px solid rgba(251,191,36,0.2);
  border-radius: var(--radius-sm);
  margin-top: 16px;
  font-size: 13px;
  color: var(--amber);
  position: relative;
  z-index: 10;
}

.btn-switch {
  padding: 6px 14px;
  background: transparent;
  border: 1px solid var(--amber);
  color: var(--amber);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.15s;
}
.btn-switch:hover:not(:disabled) { background: var(--amber); color: #000; }

/* ── Main ────────────────────────────────────────── */
.main {
  flex: 1;
  padding: 40px 0 32px;
  position: relative;
  z-index: 5;
}

/* ── Landing ─────────────────────────────────────── */
.landing { display: flex; justify-content: center; }

.landing-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 620px;
  width: 100%;
  padding-top: 32px;
}

.landing-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--green);
  padding: 6px 14px;
  background: rgba(52,211,153,0.08);
  border: 1px solid rgba(52,211,153,0.2);
  border-radius: 20px;
  margin-bottom: 28px;
}

.badge-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 8px var(--green);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.landing-headline {
  font-size: 3.8rem;
  font-weight: 300;
  line-height: 1.08;
  letter-spacing: -0.04em;
  color: var(--text);
  margin-bottom: 20px;
  background: linear-gradient(135deg, #f0f2f8 0%, #8b9ab5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.landing-sub {
  font-size: 16px;
  color: var(--text-2);
  line-height: 1.7;
  margin-bottom: 36px;
  max-width: 460px;
}

.landing-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 28px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s;
  box-shadow: 0 4px 20px rgba(91,142,255,0.25);
}
.btn-primary:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(91,142,255,0.35); }
.btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
.btn-primary.full { width: 100%; justify-content: center; }

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 13px 24px;
  background: transparent;
  border: 1px solid var(--border-2);
  color: var(--text-2);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s;
}
.btn-ghost:hover { border-color: var(--text-2); color: var(--text); }

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 36px;
  width: 100%;
}

.feature-card {
  padding: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: border-color 0.2s;
}
.feature-card:hover { border-color: var(--border-2); }

.feature-icon { font-size: 22px; display: block; margin-bottom: 10px; }
.feature-title { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
.feature-desc { font-size: 12px; color: var(--text-2); line-height: 1.5; }

.contract-strip {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  width: 100%;
}
.contract-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-3);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
}
.contract-addr {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-2);
  word-break: break-all;
  transition: color 0.15s;
}
.contract-addr:hover { color: var(--accent); }

/* ── Dashboard ───────────────────────────────────── */
.dashboard { display: flex; flex-direction: column; gap: 24px; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-card {
  padding: 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: border-color 0.2s;
}
.stat-card:hover { border-color: var(--border-2); }

.stat-icon { font-size: 20px; margin-bottom: 10px; display: block; }
.stat-label { font-size: 11px; color: var(--text-3); font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
.stat-value { font-size: 15px; font-weight: 600; color: var(--text); font-family: var(--font-mono); }

/* ── Panel ───────────────────────────────────────── */
.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

/* ── Position Block ──────────────────────────────── */
.position-block {
  padding: 28px;
  border-bottom: 1px solid var(--border);
}

.position-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.position-label { font-size: 12px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.08em; }

.position-badge {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
}
.position-badge.locked { background: rgba(251,191,36,0.1); color: var(--amber); border: 1px solid rgba(251,191,36,0.2); }
.position-badge.ready { background: rgba(52,211,153,0.1); color: var(--green); border: 1px solid rgba(52,211,153,0.2); }
.position-badge.closed { background: var(--surface-2); color: var(--text-3); border: 1px solid var(--border); }

.position-amount {
  font-size: 3rem;
  font-weight: 300;
  letter-spacing: -0.04em;
  color: var(--text);
  margin-bottom: 6px;
  font-family: var(--font-mono);
}
.position-unit { font-size: 1.2rem; color: var(--text-3); margin-left: 6px; }

.position-time { font-size: 13px; color: var(--text-2); margin-bottom: 20px; }

.progress-track {
  height: 4px;
  background: var(--surface-2);
  border-radius: 2px;
  margin-bottom: 24px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  border-radius: 2px;
  transition: width 0.5s ease;
}

.btn-withdraw {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--green), #10b981);
  color: #000;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  transition: all 0.15s;
}
.btn-withdraw:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
.btn-withdraw:disabled { opacity: 0.45; cursor: not-allowed; }

/* ── Action Block ────────────────────────────────── */
.action-block { }

.tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  padding: 0 4px;
}

.tab {
  padding: 16px 20px;
  background: transparent;
  color: var(--text-3);
  font-size: 13px;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all 0.15s;
  text-transform: capitalize;
}
.tab:hover { color: var(--text-2); }
.tab.active { color: var(--text); border-bottom-color: var(--accent); }

/* ── Deposit Form ────────────────────────────────── */
.deposit-form {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-label { font-size: 12px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.08em; }

.input-wrap {
  display: flex;
  align-items: center;
  background: var(--surface-2);
  border: 1px solid var(--border-2);
  border-radius: var(--radius-sm);
  padding: 14px 18px;
  gap: 12px;
  transition: border-color 0.15s;
}
.input-wrap:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(91,142,255,0.1); }

.amount-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text);
  font-size: 1.6rem;
  font-weight: 300;
  letter-spacing: -0.02em;
  font-family: var(--font-mono);
  width: 100%;
}
.amount-input::placeholder { color: var(--text-3); }

.input-tag { font-size: 13px; font-weight: 600; color: var(--text-2); font-family: var(--font-mono); flex-shrink: 0; }

.input-hint { font-size: 12px; color: var(--text-3); line-height: 1.5; }

/* ── How It Works ────────────────────────────────── */
.how-it-works {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.how-step { display: flex; gap: 18px; align-items: flex-start; }

.step-num {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
  background: rgba(91,142,255,0.1);
  border: 1px solid rgba(91,142,255,0.2);
  border-radius: 6px;
  padding: 4px 8px;
  flex-shrink: 0;
  margin-top: 2px;
}

.step-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
.step-desc { font-size: 13px; color: var(--text-2); line-height: 1.6; }

.how-contract {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  font-size: 12px;
  color: var(--text-3);
}
.how-contract a { color: var(--accent); transition: opacity 0.15s; }
.how-contract a:hover { opacity: 0.75; }

/* ── Footer ──────────────────────────────────────── */
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0 28px;
  border-top: 1px solid var(--border);
  font-size: 12px;
  color: var(--text-3);
  position: relative;
  z-index: 5;
}
.footer a { color: var(--text-3); transition: color 0.15s; }
.footer a:hover { color: var(--accent); }

/* ── Spinner ─────────────────────────────────────── */
.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Toast ───────────────────────────────────────── */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  z-index: 1000;
  max-width: 380px;
  backdrop-filter: blur(12px);
  animation: slideUp 0.2s ease;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}
@keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.toast-success { background: rgba(52,211,153,0.12); border: 1px solid rgba(52,211,153,0.25); color: var(--green); }
.toast-error { background: rgba(248,113,113,0.12); border: 1px solid rgba(248,113,113,0.25); color: var(--red); }
.toast-info { background: var(--surface); border: 1px solid var(--border-2); color: var(--text-2); }
.toast-close { background: transparent; color: inherit; font-size: 16px; opacity: 0.6; padding: 0 2px; flex-shrink: 0; }
.toast-close:hover { opacity: 1; }

/* ── Responsive ──────────────────────────────────── */
@media (max-width: 640px) {
  .app { padding: 0 16px; }
  .landing-headline { font-size: 2.6rem; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .features { grid-template-columns: 1fr; }
  .landing-actions { flex-direction: column; }
  .btn-primary, .btn-ghost { width: 100%; justify-content: center; }
  .position-amount { font-size: 2.2rem; }
  .banner-warn { flex-direction: column; gap: 10px; align-items: flex-start; }
}
