import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import './App.css'

const CONTRACT_ADDRESS = '0x1c5b5b9dcb46d4ca16e8387419ba7f7c3f269ae2'
const PHAROS_CHAIN_ID = 1672
const PHAROS_CHAIN_ID_HEX = '0x688'

const PHAROS_NETWORK = {
  chainId: PHAROS_CHAIN_ID_HEX,
  chainName: 'Pharos Mainnet',
  nativeCurrency: { name: 'PROS', symbol: 'PROS', decimals: 18 },
  rpcUrls: ['https://rpc.pharos.xyz'],
  blockExplorerUrls: ['https://pharosscan.xyz'],
}

const ABI = [
  'function deposit() external payable',
  'function withdraw() external',
  'function myPosition() external view returns (uint256 amount, uint256 depositTime, uint256 unlockTime, uint256 secondsRemaining, bool isLocked, bool withdrawn)',
  'function vaultStats() external view returns (uint256 totalDeposited, uint256 totalUsers, uint256 lockDurationDays)',
]

const formatPROS = (wei) => {
  if (!wei) return '0'
  const val = parseFloat(ethers.formatEther(wei))
  return val < 0.001 ? val.toFixed(6) : val.toFixed(4)
}

const formatTime = (seconds) => {
  if (!seconds || seconds <= 0) return 'Ready to withdraw'
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d}d ${h}h remaining`
  if (h > 0) return `${h}h ${m}m remaining`
  return `${m}m remaining`
}

const shortAddr = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
      <button onClick={onClose} className="toast-close">✕</button>
    </div>
  )
}

export default function App() {
  const [wallet, setWallet] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)
  const [wrongNetwork, setWrongNetwork] = useState(false)
  const [vaultStats, setVaultStats] = useState(null)
  const [position, setPosition] = useState(null)
  const [walletBalance, setWalletBalance] = useState(null)
  const [depositAmount, setDepositAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [activeTab, setActiveTab] = useState('deposit')

  const showToast = (message, type = 'info') => setToast({ message, type })

  const connect = async () => {
    if (!window.ethereum) {
      showToast('No wallet detected. Please install MetaMask.', 'error')
      window.open('https://metamask.io/download/', '_blank')
      return
    }
    try {
      setLoading(true)
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const prov = new ethers.BrowserProvider(window.ethereum)
      const network = await prov.getNetwork()
      if (Number(network.chainId) !== PHAROS_CHAIN_ID) {
        setWrongNetwork(true)
        setWallet(accounts[0])
        setProvider(prov)
        return
      }
      const sign = await prov.getSigner()
      const ct = new ethers.Contract(CONTRACT_ADDRESS, ABI, sign)
      setWallet(accounts[0])
      setProvider(prov)
      setSigner(sign)
      setContract(ct)
      setWrongNetwork(false)
      showToast('Connected to Pharos Mainnet', 'success')
    } catch (e) {
      showToast(e.message || 'Connection failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const switchNetwork = async () => {
    try {
      setLoading(true)
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: PHAROS_CHAIN_ID_HEX }],
      })
    } catch (e) {
      if (e.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [PHAROS_NETWORK],
        })
      }
    } finally {
      setLoading(false)
      await connect()
    }
  }

  const fetchData = useCallback(async () => {
    if (!contract || !wallet || !provider) return
    try {
      const [stats, pos, bal] = await Promise.all([
        contract.vaultStats(),
        contract.myPosition(),
        provider.getBalance(wallet),
      ])
      setVaultStats(stats)
      setPosition(pos)
      setWalletBalance(bal)
    } catch (e) {
      console.error('Fetch error:', e)
    }
  }, [contract, wallet, provider])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [fetchData])

  useEffect(() => {
    if (!window.ethereum) return
    const handleAccounts = () => connect()
    const handleChain = () => connect()
    window.ethereum.on('accountsChanged', handleAccounts)
    window.ethereum.on('chainChanged', handleChain)
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccounts)
      window.ethereum.removeListener('chainChanged', handleChain)
    }
  }, [])

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      showToast('Enter a valid amount', 'error')
      return
    }
    try {
      setLoading(true)
      const tx = await contract.deposit({ value: ethers.parseEther(depositAmount) })
      showToast('Transaction submitted...', 'info')
      await tx.wait()
      showToast('Deposit successful!', 'success')
      setDepositAmount('')
      await fetchData()
    } catch (e) {
      showToast(e.reason || e.message || 'Transaction failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    try {
      setLoading(true)
      const tx = await contract.withdraw()
      showToast('Withdrawal submitted...', 'info')
      await tx.wait()
      showToast('Withdrawn successfully!', 'success')
      await fetchData()
    } catch (e) {
      showToast(e.reason || e.message || 'Withdrawal failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const hasPosition = position && position.amount > 0n
  const canWithdraw = hasPosition && !position.isLocked && !position.withdrawn

  return (
    <div className="app">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <header className="header">
        <div className="header-brand">
          <div className="brand-icon">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L18 7V13L10 18L2 13V7L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M10 2V18M2 7L18 13M18 7L2 13" stroke="currentColor" strokeWidth="1.5" opacity="0.35"/>
            </svg>
          </div>
          <span className="brand-name">RealFiVault</span>
          <span className="brand-tag">Pharos</span>
        </div>
        <div className="header-right">
          {wallet ? (
            <div className="wallet-pill">
              <span className={`wallet-dot ${wrongNetwork ? 'warn' : 'ok'}`} />
              <span>{shortAddr(wallet)}</span>
            </div>
          ) : (
            <button className="btn-header" onClick={connect} disabled={loading}>
              {loading ? <span className="spinner" /> : 'Connect Wallet'}
            </button>
          )}
        </div>
      </header>

      {wrongNetwork && wallet && (
        <div className="banner-warn">
          <span>⚠ Switch to Pharos Mainnet to continue</span>
          <button className="btn-switch" onClick={switchNetwork} disabled={loading}>
            {loading ? 'Switching...' : 'Switch Network'}
          </button>
        </div>
      )}

      <main className="main">
        {!wallet ? (
          <div className="landing">
            <div className="landing-inner">
              <div className="landing-badge">
                <span className="badge-dot" />
                Live on Pharos Mainnet
              </div>
              <h1 className="landing-headline">
                Savings that answer<br />to no one but you.
              </h1>
              <p className="landing-sub">
                Deposit PROS. Lock for 30 days. Withdraw permissionlessly.
                No bank. No KYC. No middleman — just code.
              </p>
              <div className="landing-actions">
                <button className="btn-primary" onClick={connect} disabled={loading}>
                  {loading ? <><span className="spinner" /> Connecting...</> : 'Connect Wallet'}
                </button>
                <a href={`https://pharosscan.xyz/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer" className="btn-ghost">
                  View Contract ↗
                </a>
              </div>
              <div className="features">
                {[
                  { icon: '🔒', title: 'Non-custodial', desc: 'Only you control your funds' },
                  { icon: '⚡', title: 'Instant settlement', desc: 'Sub-second finality on Pharos' },
                  { icon: '🌍', title: 'Permissionless', desc: 'Open to anyone, anywhere' },
                ].map((f) => (
                  <div key={f.title} className="feature-card">
                    <span className="feature-icon">{f.icon}</span>
                    <div className="feature-title">{f.title}</div>
                    <div className="feature-desc">{f.desc}</div>
                  </div>
                ))}
              </div>
              <div className="contract-strip">
                <span className="contract-label">Contract</span>
                <a href={`https://pharosscan.xyz/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer" className="contract-addr">
                  {CONTRACT_ADDRESS}
                </a>
              </div>
            </div>
          </div>
        ) : wrongNetwork ? (
          <div className="landing">
            <div className="landing-inner" style={{textAlign:'center',alignItems:'center'}}>
              <h1 className="landing-headline" style={{fontSize:'2.2rem'}}>Wrong Network</h1>
              <p className="landing-sub">RealFiVault runs on Pharos Mainnet only.</p>
              <button className="btn-primary" onClick={switchNetwork} disabled={loading}>
                {loading ? 'Switching...' : 'Switch to Pharos'}
              </button>
            </div>
          </div>
        ) : (
          <div className="dashboard">
            <div className="stats-grid">
              {[
                { label: 'Total Deposited', value: vaultStats ? `${formatPROS(vaultStats.totalDeposited)} PROS` : '—', icon: '📦' },
                { label: 'Total Users', value: vaultStats ? vaultStats.totalUsers.toString() : '—', icon: '👥' },
                { label: 'Lock Period', value: vaultStats ? `${vaultStats.lockDurationDays.toString()} Days` : '—', icon: '🔐' },
                { label: 'Your Balance', value: walletBalance !== null ? `${formatPROS(walletBalance)} PROS` : '—', icon: '💳' },
              ].map((s) => (
                <div key={s.label} className="stat-card">
                  <span className="stat-icon">{s.icon}</span>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="panel">
              {hasPosition && (
                <div className="position-block">
                  <div className="position-top">
                    <span className="position-label">Your Position</span>
                    <span className={`position-badge ${position.withdrawn ? 'closed' : position.isLocked ? 'locked' : 'ready'}`}>
                      {position.withdrawn ? 'Withdrawn' : position.isLocked ? '🔒 Locked' : '✅ Unlocked'}
                    </span>
                  </div>
                  <div className="position-amount">
                    {formatPROS(position.amount)}<span className="position-unit"> PROS</span>
                  </div>
                  <div className="position-time">
                    {position.withdrawn ? 'Position closed' : formatTime(Number(position.secondsRemaining))}
                  </div>
                  {!position.withdrawn && (
                    <div className="progress-track">
                      <div className="progress-fill" style={{
                        width: position.isLocked
                          ? `${Math.max(4, 100 - (Number(position.secondsRemaining) / (30 * 86400)) * 100)}%`
                          : '100%'
                      }} />
                    </div>
                  )}
                  {canWithdraw && (
                    <button className="btn-withdraw" onClick={handleWithdraw} disabled={loading}>
                      {loading ? <><span className="spinner" /> Processing...</> : 'Withdraw Funds'}
                    </button>
                  )}
                </div>
              )}

              {(!hasPosition || position.withdrawn) && (
                <div className="action-block">
                  <div className="tabs">
                    {['deposit', 'how it works'].map((t) => (
                      <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                        {t}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'deposit' && (
                    <div className="deposit-form">
                      <label className="input-label">Amount to deposit</label>
                      <div className="input-wrap">
                        <input
                          type="number"
                          placeholder="0.00"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="amount-input"
                          min="0"
                          step="0.01"
                        />
                        <span className="input-tag">PROS</span>
                      </div>
                      <p className="input-hint">Locked for 30 days · Withdraw anytime after expiry</p>
                      <button className="btn-primary full" onClick={handleDeposit} disabled={loading || !depositAmount}>
                        {loading ? <><span className="spinner" /> Processing...</> : 'Deposit & Lock'}
                      </button>
                    </div>
                  )}

                  {activeTab === 'how it works' && (
                    <div className="how-it-works">
                      {[
                        { n: '01', title: 'Deposit PROS', desc: 'Send any amount of PROS. Your position is created on-chain instantly.' },
                        { n: '02', title: '30-day lock', desc: 'Funds are secured by code. Not even the contract owner can touch them.' },
                        { n: '03', title: 'Withdraw freely', desc: 'After expiry, withdraw directly to your wallet. No permission required.' },
                      ].map((s) => (
                        <div key={s.n} className="how-step">
                          <span className="step-num">{s.n}</span>
                          <div>
                            <div className="step-title">{s.title}</div>
                            <div className="step-desc">{s.desc}</div>
                          </div>
                        </div>
                      ))}
                      <div className="how-contract">
                        <span>Contract</span>
                        <a href={`https://pharosscan.xyz/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer">
                          {shortAddr(CONTRACT_ADDRESS)} ↗
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <span>RealFiVault · Pharos Mainnet · 2026</span>
        <a href={`https://pharosscan.xyz/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer">Verify Contract ↗</a>
      </footer>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
