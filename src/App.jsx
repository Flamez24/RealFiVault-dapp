import React, { useState } from 'react';
import './App.css';

function App() {
  return (
    <div className="vault-container">
      {/* Glow effects for background depth */}
      <div className="bg-glow-top"></div>
      <div className="bg-glow-bottom"></div>

      <nav className="navbar">
        <div className="logo-section">
          <div className="logo">REALFI<span>VAULT</span></div>
          <span className="network-pill">Pharos Mainnet</span>
        </div>
        <div className="nav-menu">
          <a href="#">Stats</a>
          <a href="#">Security</a>
          <button className="btn-connect">Connect Wallet</button>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <span className="badge">ON-CHAIN SAVINGS</span>
          <h1>Trustless. Permissionless. <span className="gold-text">Yours.</span></h1>
          <p className="subtitle">
            Deposit PROS. Lock for 30 days. Withdraw without any middleman. 
            No bank. No KYC. No gatekeepers.
          </p>

          <div className="glass-card">
            <div className="card-header">
              <h3>Vault Overview</h3>
              <span className="status">Active</span>
            </div>
            
            <div className="stats-row">
              <div className="stat-group">
                <label>Total Value Locked</label>
                <div className="stat-value">$0.00</div>
              </div>
              <div className="stat-group">
                <label>Projected APY</label>
                <div className="stat-value green">12.5%</div>
              </div>
            </div>

            <button className="btn-main">Enter Vault</button>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Powered by Pharos Mainnet • Iam•Flamez</p>
      </footer>
    </div>
  );
}

export default App;
