import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import './App.css'

// ─── CONFIG ───────────────────────────────────────────────────────────────────
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
  'function owner() external view returns (address)',
]

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const formatPROS = (wei) => {
  if (!wei) return '0'
  const val = parseFloat(ethers.formatEther(wei))
  return val < 0.001 ? val.toFixed(6) : val.toFixed(4)
}

const formatTime = (seconds) => {
  if (!seconds || seconds <= 0) return 'Unlocked'
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d}d ${h}h remaining`
  if (h > 0) return `${h}h ${m}m remaining`
  return `${m}m remaining`
}

const shortAddr = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function StatusDot({ active }) {
  return (
    <span className={`status-dot ${active ? 'active' : ''}`} />
  )
}

function Stat({ label, value, sub }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  )
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
      <button onClick={onClose} className="toast-close">×</button>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
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

  // ── Connect Wallet ──
  const connect = async () => {
    if (!window.ethereum) {
      showToast('No wallet detected. Install MetaMask.', 'error')
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

  // ── Switch Network ──
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

  // ── Fetch Data ──
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

  // ── Listen for account/network changes ──
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

  // ── Deposit ──
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

  // ── Withdraw ──
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

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">RealFiVault</div>
          <div className="logo-sub">Pharos Mainnet</div>
        </div>
        <div className="header-right">
          {wallet ? (
            <div className="wallet-chip">
              <StatusDot active={!wrongNetwork} />
              <span>{shortAddr(wallet)}</span>
            </div>
          ) : (
            <button className="btn-connect" onClick={connect} disabled={loading}>
              {loading ? 'connecting...' : 'connect wallet'}
            </button>
          )}
        </div>
      </header>

      {/* Wrong Network Banner */}
      {wrongNetwork && wallet && (
        <div className="network-banner">
          <span>Switch to Pharos Mainnet to continue</span>
          <button onClick={switchNetwork} disabled={loading}>
            {loading ? 'switching...' : 'switch network'}
          </button>
        </div>
      )}

      <main className="main">
        {!wallet ? (
          // ── Not Connected ──
          <div className="landing">
            <div className="landing-eyebrow">on-chain savings</div>
            <h1 className="landing-title">Trustless.<br />Permissionless.<br />Yours.</h1>
            <p className="landing-desc">
              Deposit PROS. Lock for 30 days. Withdraw without any middleman.
              No bank. No KYC. No gatekeepers.
            </p>
            <button className="btn-connect-large" onClick={connect} disabled={loading}>
              {loading ? 'connecting...' : 'connect wallet'}
            </button>
            <div className="landing-contract">
              <span className="landing-contract-label">contract</span>
              <a
                href={`https://pharosscan.xyz/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="landing-contract-addr"
              >
                {CONTRACT_ADDRESS}
              </a>
            </div>
          </div>
        ) : wrongNetwork ? (
          // ── Wrong Network ──
          <div className="landing">
            <h1 className="landing-title" style={{ fontSize: '2rem' }}>Wrong Network</h1>
            <p className="landing-desc">This app runs on Pharos Mainnet only.</p>
            <button className="btn-connect-large" onClick={switchNetwork} disabled={loading}>
              {loading ? 'switching...' : 'switch to Pharos'}
            </button>
          </div>
        ) : (
          // ── Connected ──
          <div className="dashboard">

            {/* Stats Row */}
            <div className="stats-row">
              <Stat
                label="total deposited"
                value={vaultStats ? `${formatPROS(vaultStats.totalDeposited)} PROS` : '—'}
              />
              <Stat
                label="total users"
                value={vaultStats ? vaultStats.totalUsers.toString() : '—'}
              />
              <Stat
                label="lock period"
                value={vaultStats ? `${vaultStats.lockDurationDays.toString()} days` : '—'}
              />
              <Stat
                label="your balance"
                value={walletBalance !== null ? `${formatPROS(walletBalance)} PROS` : '—'}
              />
            </div>

            {/* Main Panel */}
            <div className="panel">

              {/* Position Card */}
              {hasPosition && (
                <div className="position-card">
                  <div className="position-header">
                    <span className="position-label">your position</span>
                    <span className={`position-status ${position.isLocked ? 'locked' : 'unlocked'}`}>
                      {position.withdrawn ? 'withdrawn' : position.isLocked ? 'locked' : 'unlocked'}
                    </span>
                  </div>
                  <div className="position-amount">
                    {formatPROS(position.amount)} <span>PROS</span>
                  </div>
                  <div className="position-time">
                    {position.withdrawn
                      ? 'Position closed'
                      : formatTime(Number(position.secondsRemaining))}
                  </div>
                  {canWithdraw && (
                    <button
                      className="btn-withdraw"
                      onClick={handleWithdraw}
                      disabled={loading}
                    >
                      {loading ? 'processing...' : 'withdraw funds'}
                    </button>
                  )}
                </div>
              )}

              {/* Tabs */}
              {(!hasPosition || position.withdrawn) && (
                <div className="action-area">
                  <div className="tab-row">
                    <button
                      className={`tab ${activeTab === 'deposit' ? 'active' : ''}`}
                      onClick={() => setActiveTab('deposit')}
                    >
                      deposit
                    </button>
                    <button
                      className={`tab ${activeTab === 'info' ? 'active' : ''}`}
                      onClick={() => setActiveTab('info')}
                    >
                      how it works
                    </button>
                  </div>

                  {activeTab === 'deposit' && (
                    <div className="deposit-area">
                      <div className="input-row">
                        <input
                          type="number"
                          placeholder="0.00"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="deposit-input"
                          min="0"
                          step="0.01"
                        />
                        <span className="input-symbol">PROS</span>
                      </div>
                      <div className="deposit-note">
                        Funds lock for 30 days · Withdraw anytime after
                      </div>
                      <button
                        className="btn-deposit"
                        onClick={handleDeposit}
                        disabled={loading || !depositAmount}
                      >
                        {loading ? 'processing...' : 'deposit & lock'}
                      </button>
                    </div>
                  )}

                  {activeTab === 'info' && (
                    <div className="info-area">
                      <div className="info-step">
                        <span className="info-num">01</span>
                        <div>
                          <div className="info-title">Deposit PROS</div>
                          <div className="info-desc">Send any amount of PROS to the vault. Your position is created on-chain instantly.</div>
                        </div>
                      </div>
                      <div className="info-step">
                        <span className="info-num">02</span>
                        <div>
                          <div className="info-title">30-day lock</div>
                          <div className="info-desc">Funds are secured by code for 30 days. No one — not even the contract owner — can touch them.</div>
                        </div>
                      </div>
                      <div className="info-step">
                        <span className="info-num">03</span>
                        <div>
                          <div className="info-title">Withdraw freely</div>
                          <div className="info-desc">After the lock expires, withdraw directly to your wallet. No intermediary. No permission required.</div>
                        </div>
                      </div>
                      <div className="info-contract">
                        <span>Contract</span>
                        <a
                          href={`https://pharosscan.xyz/address/${CONTRACT_ADDRESS}`}
                          target="_blank"
                          rel="noreferrer"
                        >
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

      {/* Footer */}
      <footer className="footer">
        <span>RealFiVault · Pharos Mainnet</span>
        <a
          href={`https://pharosscan.xyz/address/${CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noreferrer"
        >
          view contract ↗
        </a>
      </footer>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
