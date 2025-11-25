import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Plus, Trash2, Download, TrendingUp, DollarSign, X, PieChart, List, 
  Wallet, Calculator, BarChart2, Activity, Target, AlertTriangle, Smile, 
  ShieldCheck, ShieldAlert, Edit2, Check, RotateCcw, Calendar, Save, 
  Cloud, Loader, WifiOff, Award, BookOpen, Coins, Percent, Lightbulb, 
  TrendingDown, ChevronDown, Info, Building2 
} from 'lucide-react';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHWVWckWn6P1FDCBKgHEITpJL8XXBqB8I",
  authDomain: "remora-f7b6c.firebaseapp.com",
  projectId: "remora-f7b6c",
  storageBucket: "remora-f7b6c.firebasestorage.app",
  messagingSenderId: "424281149028",
  appId: "1:424281149028:web:6a9383b13f30a882e59971",
  measurementId: "G-HGLC7VBPWT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// --- LOGO REMORA (SVG COMPONENT) ---
const RemoraLogo = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 shrink-0 drop-shadow-lg">
    <path d="M25 25 L 55 25 L 55 75 L 85 45" stroke="#2dd4bf" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25 55 L 45 55" stroke="#2dd4bf" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M55 25 L 85 25 L 85 45" stroke="#2dd4bf" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// --- CONSTANTS ---
const STRATEGIES_LIST = [
  "Akumulasi Bandar", "Signal Ko Heng", "Breakout ATH", "Swing Low", 
  "Pullback", "Support Bounce", "News Catalyst", "Scalping Open", 
  "Reversal Pattern", "Dividend Play", "Gap Fill", "IPO Hunter"
];

const BROKERS = [
  { code: "XC", name: "Ajaib Sekuritas", buy: 0.15, sell: 0.25 },
  { code: "XL", name: "Stockbit", buy: 0.10, sell: 0.20 },
  { code: "CC", name: "Mandiri Sekuritas", buy: 0.18, sell: 0.28 },
  { code: "CP", name: "KB Valbury", buy: 0.15, sell: 0.25 },
  { code: "YU", name: "CGS-CIMB", buy: 0.18, sell: 0.28 },
  { code: "HP", name: "Henan Putihrai", buy: 0.18, sell: 0.28 },
  { code: "PD", name: "Indo Premier (IPOT)", buy: 0.19, sell: 0.29 },
  { code: "BQ", name: "Korea Investment", buy: 0.13, sell: 0.23 },
  { code: "YJ", name: "Lotus Andalan", buy: 0.15, sell: 0.25 },
  { code: "ZP", name: "Maybank Sekuritas", buy: 0.17, sell: 0.27 },
  { code: "YP", name: "Mirae Asset", buy: 0.15, sell: 0.25 },
  { code: "EP", name: "MNC Sekuritas", buy: 0.18, sell: 0.28 },
  { code: "XA", name: "NH Korindo", buy: 0.18, sell: 0.28 },
  { code: "AP", name: "Pacific Sekuritas", buy: 0.20, sell: 0.30 },
  { code: "PG", name: "Panca Global", buy: 0.10, sell: 0.20 },
  { code: "GR", name: "Panin Sekuritas", buy: 0.20, sell: 0.30 },
  { code: "PS", name: "Paramitra Alfa", buy: 0.10, sell: 0.20 },
  { code: "KK", name: "Phillip Sekuritas", buy: 0.18, sell: 0.28 },
  { code: "AT", name: "Phintraco", buy: 0.15, sell: 0.18 },
  { code: "DR", name: "RHB Sekuritas", buy: 0.15, sell: 0.25 },
  { code: "IF", name: "Samuel Sekuritas", buy: 0.15, sell: 0.25 },
  { code: "DH", name: "Sinarmas", buy: 0.15, sell: 0.25 },
  { code: "AZ", name: "Sucor Sekuritas", buy: 0.15, sell: 0.25 },
  { code: "LG", name: "Trimegah", buy: 0.18, sell: 0.28 },
  { code: "AI", name: "UOB Kay Hian", buy: 0.25, sell: 0.35 },
  { code: "AN", name: "Wanteg Sekuritas", buy: 0.18, sell: 0.28 },
  { code: "FS", name: "Yuanta Sekuritas", buy: 0.15, sell: 0.25 },
  { code: "SQ", name: "BCA Sekuritas", buy: 0.18, sell: 0.28 },
  { code: "OTH", name: "Lainnya (Manual)", buy: 0.15, sell: 0.25 }
];

const MOODS = {
  'neutral': { icon: '😐', label: 'Netral', color: 'text-gray-400' },
  'confident': { icon: '😎', label: 'Pede', color: 'text-blue-400' },
  'fear': { icon: '😨', label: 'Takut', color: 'text-purple-400' },
  'greedy': { icon: '🤑', label: 'Serakah', color: 'text-emerald-400' },
  'revenge': { icon: '🤬', label: 'Dendam', color: 'text-red-500' }
};

// --- HELPERS ---
const formatNumberInput = (value) => {
  if (value === 0 || value === '' || value === null || isNaN(value)) return '';
  return new Intl.NumberFormat('id-ID').format(value);
};

const parseNumberInput = (value) => {
  if (!value) return 0;
  const cleanValue = value.toString().replace(/\D/g, '');
  return cleanValue === '' ? 0 : parseInt(cleanValue, 10);
};

const formatIDR = (num) => new Intl.NumberFormat('id-ID', { 
  style: 'currency', 
  currency: 'IDR', 
  maximumFractionDigits: 0 
}).format(num);

const formatDateFormal = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: '2-digit' }).format(date);
};

const formatMonthYear = (dateString) => {
   if (!dateString) return '-';
   const date = new Date(dateString);
   if (isNaN(date.getTime())) return dateString;
   return new Intl.DateTimeFormat('id-ID', { month: 'short', year: '2-digit' }).format(date);
};

// --- COMPONENTS ---

// Optimized: Memoized Strategy Input
const StrategyInput = React.memo(({ value, onChange, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(STRATEGIES_LIST);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!value) { setSuggestions(STRATEGIES_LIST); } else {
      const lowerVal = value.toLowerCase(); 
      const filtered = STRATEGIES_LIST.filter(s => s.toLowerCase().includes(lowerVal));
      setSuggestions(filtered);
    }
  }, [value]);

  useEffect(() => { 
    const handleClickOutside = (event) => { 
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) { 
        setIsOpen(false); 
        if(onSave) onSave(); 
      } 
    }; 
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside); 
    }
    return () => document.removeEventListener('mousedown', handleClickOutside); 
  }, [isOpen, onSave]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input 
        type="text" 
        value={value} 
        placeholder="Pilih..." 
        onChange={(e) => { onChange(e.target.value); setIsOpen(true); }} 
        onFocus={() => setIsOpen(true)} 
        className="w-full bg-transparent border-none focus:ring-0 text-gray-300 p-0 placeholder-gray-600 focus:text-teal-400 font-medium" 
      />
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 mt-1 w-48 bg-[#082823] border border-[#113C36] rounded shadow-lg max-h-40 overflow-y-auto">
          {suggestions.map((strategy, idx) => (
            <li 
              key={idx} 
              onClick={() => { onChange(strategy); setIsOpen(false); onSave(); }} 
              className="px-3 py-2 hover:bg-[#113C36] text-xs text-gray-300 cursor-pointer border-b border-[#113C36]/30 last:border-none"
            >
              {strategy}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

// Optimized: Memoized Broker Select
const BrokerSelect = React.memo(({ value, onChange, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => { 
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) { 
        setIsOpen(false); 
        if(onSave) onSave(); 
      } 
    };
    if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onSave]);

  const currentBroker = BROKERS.find(b => b.code === value) || BROKERS.find(b => b.code === 'OTH');

  const handleSelect = (broker) => {
    onChange(broker);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 cursor-pointer hover:text-teal-300 text-gray-300 group">
         <Building2 size={12} className="text-gray-500 group-hover:text-teal-400"/>
         <span className="truncate max-w-[80px] font-mono text-xs">{currentBroker?.code || 'Pilih'}</span>
      </div>
      {isOpen && (
        <ul className="absolute z-50 left-0 mt-1 w-64 bg-[#082823] border border-[#113C36] rounded shadow-lg max-h-60 overflow-y-auto">
          {BROKERS.map((broker) => (
            <li 
              key={broker.code} 
              onClick={() => handleSelect(broker)} 
              className="px-3 py-2 hover:bg-[#113C36] text-xs text-gray-300 cursor-pointer border-b border-[#113C36]/30 last:border-none flex justify-between items-center"
            >
              <div className="flex flex-col">
                 <span className="font-bold text-teal-200">{broker.code}</span>
                 <span className="text-[10px] text-gray-500">{broker.name}</span>
              </div>
              <div className="text-[9px] text-teal-500 bg-teal-500/10 px-1 py-0.5 rounded flex flex-col text-right">
                <span>B: {broker.buy}%</span>
                <span>S: {broker.sell}%</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

const GlowCard = ({ children, className = "" }) => {
  const cardRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    cardRef.current.style.setProperty('--glow-opacity', '1');
  };
  const handleMouseLeave = () => { if (cardRef.current) cardRef.current.style.setProperty('--glow-opacity', '0'); };

  return (
    <div 
      ref={cardRef} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave} 
      className={`relative overflow-hidden bg-[#082823] border border-[#113C36] rounded-xl shadow-lg ${className}`} 
      style={{ '--mouse-x': '0px', '--mouse-y': '0px', '--glow-opacity': '0' }}
    >
      <div 
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out" 
        style={{ 
          opacity: 'var(--glow-opacity)', 
          background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(45, 212, 191, 0.1), transparent 40%)' 
        }} 
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

// Optimized: SimpleLineChart
const SimpleLineChart = ({ data, color = "#2dd4bf", showDots = true, onHover, onLeave }) => {
  const svgRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  
  if (!data || !Array.isArray(data) || data.length < 2) return <div className="h-32 flex items-center justify-center text-gray-500 text-xs italic">Butuh minimal 2 data</div>;
  
  const height = 150; const width = 300; const padding = 10;
  const values = data.map(d => d.value || 0);
  const minVal = Math.min(...values); const maxVal = Math.max(...values);
  const range = (maxVal - minVal) === 0 ? 1 : (maxVal - minVal);
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - (((d.value || 0) - minVal) / range) * (height - padding * 2) - padding;
    return `${x},${y}`;
  }).join(' ');

  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const svgX = rawX * (width / rect.width);
    
    const chartWidth = width - (padding * 2);
    const pointWidth = chartWidth / (data.length - 1);
    let index = Math.round((svgX - padding) / pointWidth);
    
    if (index < 0) index = 0; 
    if (index >= data.length) index = data.length - 1;
    
    setActiveIndex(index); 
    if (onHover) onHover(data[index]);
  };
  
  const handleMouseLeave = () => { setActiveIndex(null); if (onLeave) onLeave(); };
  
  const activeX = activeIndex !== null ? (activeIndex / (data.length - 1)) * (width - padding * 2) + padding : 0;
  const activeY = activeIndex !== null ? height - (((data[activeIndex]?.value || 0) - minVal) / range) * (height - padding * 2) - padding : 0;
  const activeLabel = activeIndex !== null ? (data[activeIndex]?.date ? formatDateFormal(data[activeIndex].date) : '') : '';

  return (
    <svg 
      ref={svgRef} 
      viewBox={`0 0 ${width} ${height}`} 
      className="w-full h-full overflow-visible cursor-crosshair" 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
    >
      <defs>
        <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${points} L ${width-padding} ${height} L ${padding} ${height} Z`} fill={`url(#grad-${color})`} stroke="none" />
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
      {showDots && data.map((d, i) => { 
        const x = (i / (data.length - 1)) * (width - padding * 2) + padding; 
        const y = height - (((d.value || 0) - minVal) / range) * (height - padding * 2) - padding; 
        return <circle key={i} cx={x} cy={y} r="3" fill="#041513" stroke={color} strokeWidth="2" />; 
      })}
      {activeIndex !== null && (
        <g>
          <line x1={activeX} y1={padding} x2={activeX} y2={height} stroke="#4b5563" strokeWidth="1" strokeDasharray="4 2" />
          <circle cx={activeX} cy={activeY} r="4" fill="#082823" stroke={color} strokeWidth="2" />
          <text x={activeX} y={0} textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="bold" className="pointer-events-none">{activeLabel}</text>
        </g>
      )}
    </svg>
  );
};

const SimpleBarChart = ({ data }) => {
  if (!data || data.length === 0) return <div className="h-32 flex items-center justify-center text-gray-500 text-xs italic">Belum ada data dividen</div>;
  const height = 100; const width = 300; 
  const maxVal = Math.max(...data.map(d => d.value || 0), 1); 
  const barWidth = (width / data.length) * 0.6;
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
      {data.map((d, i) => { 
        const h = ((d.value || 0) / maxVal) * height; 
        const x = (width / data.length) * i + ((width / data.length - barWidth) / 2); 
        const y = height - h; 
        return (
          <g key={i} className="group relative">
            <rect x={x} y={y} width={barWidth} height={h} fill="#2dd4bf" rx="2" className="opacity-70 group-hover:opacity-100 transition-opacity" />
            <text x={x + barWidth/2} y={height + 15} textAnchor="middle" fill="#6b7280" fontSize="8" className="uppercase">{d.label}</text>
          </g>
        ); 
      })}
    </svg>
  );
};

// --- OPTIMIZATION: SEPARATE TRADE ROW COMPONENT ---
const TradeRow = React.memo(({ trade, index, onInputChange, onInputBlur, onBrokerChange, onBrokerSave, onToggleDiscipline, onCycleMood, onDelete }) => {
  const shares = parseFloat(trade.lots) * 100 || 0;
  const buyPrice = parseFloat(trade.buyPrice) || 0;
  const sellPrice = parseFloat(trade.sellPrice) || 0;
  const buyFeePct = parseFloat(trade.buyFee) / 100 || 0;
  const sellFeePct = parseFloat(trade.sellFee) / 100 || 0;
  
  const grossBuy = shares * buyPrice; 
  const netBuy = grossBuy + (grossBuy * buyFeePct); 
  
  let netPnL = 0, pnlPct = 0, status = 'Open';
  const isOpen = !trade.sellPrice;
  
  if (sellPrice > 0) { 
    const grossSell = shares * sellPrice; 
    const netSell = grossSell - (grossSell * sellFeePct); 
    netPnL = netSell - netBuy; 
    pnlPct = netBuy > 0 ? (netPnL / netBuy) * 100 : 0; 
    status = netPnL > 0 ? 'Win' : 'Loss'; 
  }

  const currentMood = MOODS[trade.mood || 'neutral']; 

  return (
    <tr className="hover:bg-[#0C302B] transition-colors group text-xs">
      <td className="p-3 text-center text-gray-600">{index + 1}</td>
      <td className="p-3 relative group/date">
        <div className="absolute inset-0 flex items-center px-3 pointer-events-none text-gray-300 group-focus-within/date:opacity-0">{formatDateFormal(trade.date)}</div>
        <input type="date" value={trade.date} onChange={(e) => onInputChange(trade.id, 'date', e.target.value)} onBlur={() => onInputBlur(trade)} className="w-full bg-transparent border-none text-transparent focus:text-gray-300 focus:ring-0 p-0 cursor-pointer"/>
      </td>
      <td className="p-3">
        <input type="text" value={trade.ticker} placeholder="BBCA" onChange={(e) => onInputChange(trade.id, 'ticker', e.target.value.toUpperCase())} onBlur={() => onInputBlur(trade)} className="w-full font-bold bg-transparent border-none focus:ring-0 uppercase text-teal-300 p-0"/>
      </td>
      <td className="p-3">
        <StrategyInput value={trade.strategy} onChange={(val) => onInputChange(trade.id, 'strategy', val)} onSave={() => onInputBlur({...trade, strategy: trade.strategy})} />
      </td>
      <td className="p-3">
        <BrokerSelect value={trade.broker} onChange={(brokerData) => onBrokerChange(trade.id, brokerData)} onSave={() => onBrokerSave(trade)} />
      </td>
      <td className="p-3 text-center">
        <button onClick={() => onToggleDiscipline(trade)} className={`hover:scale-110 ${trade.isDisciplined ? 'text-emerald-400' : 'text-red-400'}`}>{trade.isDisciplined ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}</button>
      </td>
      <td className="p-3 text-center">
        <button onClick={() => onCycleMood(trade)} className={`hover:scale-125 transition-transform ${currentMood.color}`}>{currentMood.icon}</button>
      </td>
      <td className="p-3">
        <input type="text" inputMode="numeric" value={formatNumberInput(trade.lots)} onChange={(e) => onInputChange(trade.id, 'lots', parseNumberInput(e.target.value))} onBlur={() => onInputBlur(trade)} className="w-full text-right bg-transparent border-none focus:ring-0 text-gray-300 p-0 placeholder-gray-700" placeholder="0"/>
      </td>
      <td className="p-3">
        <input type="text" inputMode="numeric" value={formatNumberInput(trade.buyPrice)} onChange={(e) => onInputChange(trade.id, 'buyPrice', parseNumberInput(e.target.value))} onBlur={() => onInputBlur(trade)} className="w-full text-right bg-transparent border-none focus:ring-0 text-gray-300 p-0 placeholder-gray-700" placeholder="0"/>
      </td>
      <td className="p-3">
        <input type="text" inputMode="numeric" value={formatNumberInput(trade.sellPrice)} onChange={(e) => onInputChange(trade.id, 'sellPrice', parseNumberInput(e.target.value))} onBlur={() => onInputBlur(trade)} className="w-full text-right bg-transparent border-none focus:ring-0 text-gray-300 p-0 placeholder-gray-700" placeholder="0"/>
      </td>
      <td className="p-3 text-right font-mono text-gray-400">{formatIDR(netBuy)}</td>
      <td className={`p-3 text-right font-medium font-mono bg-[#0A3530]/30 ${isOpen ? 'text-gray-500' : netPnL > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{isOpen ? '-' : formatIDR(netPnL)}</td>
      <td className={`p-3 text-center font-bold bg-[#0A3530]/30 ${isOpen ? 'text-gray-500' : netPnL > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{isOpen ? 'OPEN' : `${pnlPct.toFixed(1)}%`}</td>
      <td className="p-3 text-center">
        <button onClick={() => onDelete(trade.id)} className="text-gray-600 hover:text-red-400 transition"><Trash2 size={14} /></button>
      </td>
    </tr>
  );
}, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.trade) === JSON.stringify(nextProps.trade) && prevProps.index === nextProps.index;
});


// --- MAIN APP ---
const RemoraJournal = () => {
  const [user, setUser] = useState(null);
  const [db, setDb] = useState(null);
  const [appId, setAppId] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data States
  const [trades, setTrades] = useState([]);
  const [dividends, setDividends] = useState([]); 
  const [initialCapital, setInitialCapital] = useState(100000000);
  const [annualTarget, setAnnualTarget] = useState(150000000);

  // UI States
  const [activeTab, setActiveTab] = useState('journal');
  const [showCalculator, setShowCalculator] = useState(false);
  const [showVision, setShowVision] = useState(false);
  const [showStrategyReport, setShowStrategyReport] = useState(false);
  
  // Dropdown State
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);
  const timeRangeRef = useRef(null);

  // Edit Modes
  const [isEditingCapital, setIsEditingCapital] = useState(false);
  const [tempCapital, setTempCapital] = useState(initialCapital);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState(annualTarget);

  // Portfolio View State
  const [portfolioTimeRange, setPortfolioTimeRange] = useState('Last 1 Month');
  const [returnViewType, setReturnViewType] = useState('Daily');
  const [displayedEquity, setDisplayedEquity] = useState(null);

  // Handle Click Outside for Time Range Dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
        if (timeRangeRef.current && !timeRangeRef.current.contains(event.target)) {
            setIsTimeRangeOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- FIREBASE SYNC ---
  useEffect(() => {
    const initFirebase = async () => {
      try {
        let firebaseConfig;
        let currentAppId;
        
        // Cek apakah berjalan di lingkungan preview Remora (Chat)
        if (typeof __firebase_config !== 'undefined') {
            firebaseConfig = JSON.parse(__firebase_config);
            currentAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            // SANITIZATION FIX: Ensure appId is safe for Firestore paths
            currentAppId = currentAppId.replace(/\//g, '_'); 
        } else {
            // Konfigurasi untuk Hosting Sendiri (Ganti dengan data dari Firebase Console Anda)
            firebaseConfig = {
                apiKey: "ISI_DENGAN_API_KEY_ANDA",
                authDomain: "ISI_PROJECT_ID.firebaseapp.com",
                projectId: "ISI_PROJECT_ID",
                storageBucket: "ISI_PROJECT_ID.appspot.com",
                messagingSenderId: "ISI_MESSAGING_SENDER_ID",
                appId: "ISI_APP_ID"
            };
            currentAppId = 'remora-v1';
        }

        // Initialize
        const firebaseApp = initializeApp(firebaseConfig);
        const auth = getAuth(firebaseApp);
        const firestore = getFirestore(firebaseApp);
        
        setDb(firestore); 
        setAppId(currentAppId);
        
        // Auth Logic
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(auth, __initial_auth_token);
        } else {
            await signInAnonymously(auth); 
        }
        
        onAuthStateChanged(auth, (u) => { 
          setUser(u); 
          if (!u) setTimeout(() => setLoading(false), 3000); 
        });
      } catch (err) { 
        console.error("Firebase Init Error:", err); 
        setAuthError("Gagal terhubung ke server."); 
        setLoading(false); 
      }
    };
    initFirebase();
  }, []);

  // Data Listeners
  useEffect(() => {
    if (!user || !db || !appId) return;
    
    // Trades Listener
    const tradesRef = collection(db, 'artifacts', appId, 'users', user.uid, 'trades');
    const unsubTrades = onSnapshot(query(tradesRef), (snapshot) => {
      const loadedTrades = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrades(loadedTrades);
      
      // --- PITCH MODE: AUTO-POPULATE DATA IF EMPTY ---
      if (loadedTrades.length === 0 && !snapshot.metadata.fromCache) {
         const dummyData = [
           { date: '2024-11-01', ticker: 'BBCA', strategy: 'Akumulasi Bandar', lots: 50, buyPrice: 9200, sellPrice: 9600, broker: 'YP', buyFee: 0.15, sellFee: 0.25, notes: 'Asing net buy massive, ikutan flow.', mood: 'confident', isDisciplined: true },
           { date: '2024-11-05', ticker: 'BREN', strategy: 'Breakout ATH', lots: 20, buyPrice: 5500, sellPrice: 6200, broker: 'CC', buyFee: 0.18, sellFee: 0.28, notes: 'Volume breakout valid.', mood: 'greedy', isDisciplined: true },
           { date: '2024-11-10', ticker: 'GOTO', strategy: 'Scalping Open', lots: 500, buyPrice: 85, sellPrice: 81, broker: 'XL', buyFee: 0.10, sellFee: 0.20, notes: 'Telat cut loss, malah average down.', mood: 'fear', isDisciplined: false },
           { date: '2024-11-15', ticker: 'AMMN', strategy: 'Swing Low', lots: 30, buyPrice: 6800, sellPrice: 7100, broker: 'YP', buyFee: 0.15, sellFee: 0.25, notes: 'Mantul di support MA20.', mood: 'neutral', isDisciplined: true },
           { date: '2024-11-20', ticker: 'BRIS', strategy: 'News Catalyst', lots: 100, buyPrice: 2600, sellPrice: 2850, broker: 'XC', buyFee: 0.15, sellFee: 0.25, notes: 'Sentimen merger syariah.', mood: 'confident', isDisciplined: true },
           { date: '2024-12-01', ticker: 'TLKM', strategy: 'Pullback', lots: 40, buyPrice: 3800, sellPrice: 0, broker: 'ZP', buyFee: 0.17, sellFee: 0.27, notes: 'Masih hold, target 4000.', mood: 'neutral', isDisciplined: true },
           { date: '2024-12-03', ticker: 'PANI', strategy: 'Signal Ko Heng', lots: 25, buyPrice: 5100, sellPrice: 0, broker: 'YP', buyFee: 0.15, sellFee: 0.25, notes: 'Bandar akumulasi di area 5000.', mood: 'confident', isDisciplined: true }
         ];
         dummyData.forEach(d => addDoc(tradesRef, d));
      }
      setLoading(false);
    }, (error) => console.error("Trades Listen Error:", error));
    
    // Dividends Listener
    const dividendsRef = collection(db, 'artifacts', appId, 'users', user.uid, 'dividends');
    const unsubDividends = onSnapshot(query(dividendsRef), (snapshot) => {
      const loadedDivs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDividends(loadedDivs);
      // --- PITCH MODE: AUTO-POPULATE DIVIDENDS IF EMPTY ---
      if (loadedDivs.length === 0 && !snapshot.metadata.fromCache) {
          const dummyDivs = [
              { date: '2024-04-15', ticker: 'ITMG', dps: 2500, lots: 10, price: 26000, notes: 'Final Dividend' },
              { date: '2024-05-20', ticker: 'PTBA', dps: 350, lots: 50, price: 2800, notes: 'Yield 12%' },
              { date: '2024-03-10', ticker: 'BBRI', dps: 200, lots: 100, price: 5500, notes: 'Interim' },
              { date: '2024-11-01', ticker: 'ASII', dps: 88, lots: 80, price: 5100, notes: 'Interim dividend' }
          ];
          dummyDivs.forEach(d => addDoc(dividendsRef, d));
      }
    }, (error) => console.error("Dividends Listen Error:", error));
    
    // Settings Listener
    const settingsRef = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'config');
    const unsubSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.initialCapital) setInitialCapital(data.initialCapital);
        if (data.annualTarget) setAnnualTarget(data.annualTarget);
        setTempCapital(data.initialCapital || 100000000);
        setTempTarget(data.annualTarget || 150000000);
      }
    }, (error) => console.warn("Settings Listen Error:", error));
    
    const safetyTimeout = setTimeout(() => setLoading(false), 5000);
    return () => { unsubTrades(); unsubSettings(); unsubDividends(); clearTimeout(safetyTimeout); };
  }, [user, db, appId]);

  // --- ACTIONS ---
  const saveToCloud = useCallback(async (collectionName, item) => { 
    if (!user || !db) return; 
    try { 
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, collectionName, item.id), item, { merge: true }); 
    } catch (e) { console.error(e); } 
  }, [user, db, appId]);
  
  const addToCloud = async (collectionName, item) => { 
    if (!user || !db) return; 
    try { 
      const ref = collection(db, 'artifacts', appId, 'users', user.uid, collectionName); 
      const newDocRef = doc(ref); 
      await setDoc(newDocRef, { ...item, id: newDocRef.id }); 
    } catch (e) { console.error(e); } 
  };
  
  const deleteFromCloud = useCallback(async (collectionName, itemId) => { 
    if (!user || !db) return; 
    try { 
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, collectionName, itemId)); 
    } catch (e) { console.error(e); } 
  }, [user, db, appId]);
  
  const saveSettingsToCloud = async (newCapital, newTarget) => { 
    if (!user || !db) return; 
    try { 
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'config'), { 
        initialCapital: newCapital ?? initialCapital, 
        annualTarget: newTarget ?? annualTarget 
      }, { merge: true }); 
    } catch (e) { console.error(e); } 
  };

  const handleInputChange = useCallback((id, field, value) => { 
    setTrades(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t)); 
  }, []);

  const handleInputBlur = useCallback((trade) => { saveToCloud('trades', trade); }, [saveToCloud]);
  
  const handleBrokerChange = useCallback((id, brokerData) => {
    setTrades(prev => prev.map(t => t.id === id ? { 
        ...t, 
        broker: brokerData.code, 
        buyFee: brokerData.buy, 
        sellFee: brokerData.sell 
    } : t));
  }, []);
  
  const handleBrokerSave = useCallback((trade) => {
     saveToCloud('trades', trade);
  }, [saveToCloud]);

  const cycleMood = useCallback((trade) => { 
    const moodKeys = Object.keys(MOODS); 
    const idx = moodKeys.indexOf(trade.mood || 'neutral'); 
    const newMood = moodKeys[(idx + 1) % moodKeys.length]; 
    const updatedTrade = { ...trade, mood: newMood };
    setTrades(prev => prev.map(t => t.id === trade.id ? updatedTrade : t));
    saveToCloud('trades', updatedTrade); 
  }, [saveToCloud]);
  
  const toggleDiscipline = useCallback((trade) => { 
    const newVal = !trade.isDisciplined; 
    const updatedTrade = { ...trade, isDisciplined: newVal };
    setTrades(prev => prev.map(t => t.id === trade.id ? updatedTrade : t));
    saveToCloud('trades', updatedTrade); 
  }, [saveToCloud]);
  
  const addRow = () => { 
    addToCloud('trades', { 
      date: new Date().toISOString().split('T')[0], 
      ticker: '', strategy: '', lots: 0, buyPrice: 0, sellPrice: 0, 
      broker: 'OTH', buyFee: 0.15, sellFee: 0.25, 
      notes: '', mood: 'neutral', isDisciplined: true 
    }); 
  };
  
  const deleteRow = useCallback((id) => { deleteFromCloud('trades', id); }, [deleteFromCloud]);

  const handleDivChange = (id, field, value) => { setDividends(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d)); };
  const handleDivBlur = (div) => { saveToCloud('dividends', div); };
  const addDivRow = () => { addToCloud('dividends', { date: new Date().toISOString().split('T')[0], ticker: '', dps: 0, lots: 0, price: 0, notes: '' }); };
  const deleteDivRow = (id) => { deleteFromCloud('dividends', id); };

  const resetAllData = () => { 
    if(window.confirm("⚠️ PERINGATAN: Hapus SEMUA data? Tindakan ini permanen!")) { 
      trades.forEach(t => deleteFromCloud('trades', t.id)); 
      dividends.forEach(d => deleteFromCloud('dividends', d.id)); 
      saveSettingsToCloud(100000000, 150000000); 
    } 
  };
  
  const saveCapital = () => { saveSettingsToCloud(tempCapital, undefined); setIsEditingCapital(false); };
  const saveTarget = () => { saveSettingsToCloud(undefined, tempTarget); setIsEditingTarget(false); };
  const handleChartHover = (dataPoint) => { if(dataPoint) setDisplayedEquity(dataPoint.value); };
  const handleChartLeave = () => { setDisplayedEquity(null); };

  const sortedTrades = useMemo(() => {
    return [...trades].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [trades]);

  const calculateRow = (trade) => {
    const shares = parseFloat(trade.lots) * 100 || 0;
    const buyPrice = parseFloat(trade.buyPrice) || 0;
    const sellPrice = parseFloat(trade.sellPrice) || 0;
    const buyFeePct = parseFloat(trade.buyFee) / 100 || 0;
    const sellFeePct = parseFloat(trade.sellFee) / 100 || 0;
    const grossBuy = shares * buyPrice; 
    const netBuy = grossBuy + (grossBuy * buyFeePct); 
    let grossSell = 0, netSell = 0, netPnL = 0, pnlPct = 0, status = 'Open';
    if (sellPrice > 0) { 
      grossSell = shares * sellPrice; 
      netSell = grossSell - (grossSell * sellFeePct); 
      netPnL = netSell - netBuy; 
      pnlPct = netBuy > 0 ? (netPnL / netBuy) * 100 : 0; 
      status = netPnL > 0 ? 'Win' : 'Loss'; 
    }
    return { ...trade, netBuy, netSell, netPnL, pnlPct, status };
  };

  const calculateDivRow = (div) => {
    const dps = parseFloat(div.dps) || 0; const lots = parseFloat(div.lots) || 0; const price = parseFloat(div.price) || 0;
    const total = dps * lots * 100; const yieldPct = price > 0 ? (dps / price) * 100 : 0;
    return { ...div, total, yieldPct }; 
  };

  const { summary, equityCurve, drawdown, moodPerformance, disciplineRate, strategyStats } = useMemo(() => {
    const calculatedTrades = trades.map(calculateRow);
    const closedTrades = calculatedTrades.filter(t => t.sellPrice > 0).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const wins = closedTrades.filter(t => t.netPnL > 0);
    const totalPnL = closedTrades.reduce((acc, curr) => acc + curr.netPnL, 0);
    const totalTrades = closedTrades.length;
    const winRate = totalTrades > 0 ? (wins.length / totalTrades) * 100 : 0;
    const disciplinedCount = trades.filter(t => t.isDisciplined).length;
    const disciplineRate = trades.length > 0 ? (disciplinedCount / trades.length) * 100 : 100;

    let runningCapital = initialCapital; 
    let peakCapital = initialCapital; 
    let maxDrawdown = 0;
    
    const equityCurve = [{ date: 'Start', value: initialCapital }];
    closedTrades.forEach(t => {
      runningCapital += t.netPnL; 
      if (runningCapital > peakCapital) peakCapital = runningCapital;
      const currentDD = peakCapital > 0 ? ((peakCapital - runningCapital) / peakCapital) * 100 : 0; 
      if (currentDD > maxDrawdown) maxDrawdown = currentDD;
      equityCurve.push({ date: t.date, value: runningCapital });
    });

    const moodMap = {}; 
    closedTrades.forEach(t => { 
      const m = t.mood || 'neutral'; 
      if(!moodMap[m]) moodMap[m] = 0; 
      moodMap[m] += t.netPnL; 
    });
    const moodPerformance = Object.keys(moodMap).map(k => ({ 
      name: MOODS[k]?.label || k, icon: MOODS[k]?.icon || '❓', value: moodMap[k] 
    })).sort((a,b) => b.value - a.value);

    const stratMap = {}; 
    closedTrades.forEach(t => { 
      const s = t.strategy || 'Unlabeled'; 
      if(!stratMap[s]) stratMap[s] = { totalPnL: 0, wins: 0, total: 0, totalWinAmt: 0, totalLossAmt: 0 }; 
      stratMap[s].total++; 
      stratMap[s].totalPnL += t.netPnL; 
      if(t.netPnL > 0) { stratMap[s].wins++; stratMap[s].totalWinAmt += t.netPnL; } 
      else { stratMap[s].totalLossAmt += Math.abs(t.netPnL); } 
    });
    
    const strategyStats = Object.keys(stratMap).map(s => { 
      const d = stratMap[s]; 
      const winRate = (d.wins / d.total) * 100; 
      const profitFactor = d.totalLossAmt === 0 ? (d.totalWinAmt > 0 ? 99 : 0) : d.totalWinAmt / d.totalLossAmt; 
      return { name: s, ...d, winRate, profitFactor }; 
    }).sort((a,b) => b.totalPnL - a.totalPnL);

    return { summary: { totalTrades, winRate, totalPnL, currentCapital: runningCapital }, equityCurve, moodPerformance, drawdown: maxDrawdown, disciplineRate, strategyStats };
  }, [trades, initialCapital]);

  const portfolioMetrics = useMemo(() => {
    const allEvents = [];
    const calculatedTrades = trades.map(calculateRow);
    calculatedTrades.forEach(t => { if (t.sellPrice > 0) allEvents.push({ date: t.date, type: 'trade', val: t.netPnL }); });
    const calculatedDivs = dividends.map(calculateDivRow);
    calculatedDivs.forEach(d => { allEvents.push({ date: d.date, type: 'div', val: d.total }); });
    allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const dailyDataMap = {}; 
    allEvents.forEach(e => { 
      if (!dailyDataMap[e.date]) dailyDataMap[e.date] = { pnl: 0, div: 0 }; 
      if (e.type === 'trade') dailyDataMap[e.date].pnl += e.val; 
      if (e.type === 'div') dailyDataMap[e.date].div += e.val; 
    });
    
    let currentEquity = initialCapital; 
    const equityHistory = []; 
    const sortedDates = Object.keys(dailyDataMap).sort();
    
    if (sortedDates.length > 0) { 
      sortedDates.forEach(date => { 
        const dayData = dailyDataMap[date]; 
        const totalDailyGain = dayData.pnl + dayData.div; 
        currentEquity += totalDailyGain; 
        equityHistory.push({ date: date, equity: currentEquity, pnl: totalDailyGain, pnlPct: (totalDailyGain / (currentEquity - totalDailyGain)) * 100 }); 
      }); 
    } else { 
      equityHistory.push({ date: new Date().toISOString().split('T')[0], equity: initialCapital, pnl: 0, pnlPct: 0 }); 
    }
    
    let filteredHistory = [...equityHistory]; const now = new Date();
    if (returnViewType === 'Daily') { 
      let cutoff = new Date(); 
      if (portfolioTimeRange === 'Last 1 Month') cutoff.setMonth(now.getMonth() - 1); 
      else if (portfolioTimeRange === 'Last 3 Months') cutoff.setMonth(now.getMonth() - 3); 
      else if (portfolioTimeRange === 'Last 6 Months') cutoff.setMonth(now.getMonth() - 6); 
      else if (portfolioTimeRange === 'YTD') cutoff = new Date(now.getFullYear(), 0, 1); 
      else if (portfolioTimeRange === 'Last 1 Year') cutoff.setFullYear(now.getFullYear() - 1); 
      if (portfolioTimeRange !== 'ALL') filteredHistory = equityHistory.filter(d => new Date(d.date) >= cutoff); 
    } else { 
      let cutoff = new Date(); 
      if (portfolioTimeRange === 'Year to Date') cutoff = new Date(now.getFullYear(), 0, 1); 
      else if (portfolioTimeRange === 'Last 1 Year') cutoff.setFullYear(now.getFullYear() - 1); 
      else if (portfolioTimeRange === 'Last 2 Years') cutoff.setFullYear(now.getFullYear() - 2); 
      if (portfolioTimeRange !== 'ALL') filteredHistory = equityHistory.filter(d => new Date(d.date) >= cutoff); 
    }
    
    if (filteredHistory.length === 0 && equityHistory.length > 0) filteredHistory = [equityHistory[equityHistory.length - 1]];
    
    const monthlyHistory = []; const monthlyGroup = {};
    filteredHistory.forEach(day => { 
      const date = new Date(day.date); 
      const key = `${date.getFullYear()}-${date.getMonth()}`; 
      if (!monthlyGroup[key]) { monthlyGroup[key] = { date: day.date, equity: day.equity, pnl: 0, startEq: day.equity - day.pnl }; } 
      monthlyGroup[key].equity = day.equity; 
      monthlyGroup[key].pnl += day.pnl; 
    });
    Object.values(monthlyGroup).forEach(m => { const pnlPct = m.startEq > 0 ? (m.pnl / m.startEq) * 100 : 0; monthlyHistory.push({ ...m, pnlPct }); });
    
    const tableData = returnViewType === 'Daily' ? [...filteredHistory].reverse() : [...monthlyHistory].reverse();
    const timeRangeOptions = returnViewType === 'Daily' ? ['Last 1 Month', 'Last 3 Months', 'Last 6 Months'] : ['Year to Date', 'Last 1 Year', 'Last 2 Years'];
    
    return { equityHistory: filteredHistory, tableData, timeRangeOptions, currentEquity: summary.currentCapital };
  }, [trades, dividends, initialCapital, portfolioTimeRange, returnViewType, summary]);

  const dividendStats = useMemo(() => {
    const calculatedDivs = dividends.map(calculateDivRow);
    const totalDividends = calculatedDivs.reduce((acc, curr) => acc + curr.total, 0);
    const thisYear = new Date().getFullYear();
    const totalDividendsYear = calculatedDivs.filter(d => new Date(d.date).getFullYear() === thisYear).reduce((acc, curr) => acc + curr.total, 0);
    const monthlyData = Array(12).fill(0);
    calculatedDivs.forEach(d => { if(new Date(d.date).getFullYear() === thisYear) monthlyData[new Date(d.date).getMonth()] += d.total; });
    const chartData = monthlyData.map((val, i) => ({ label: new Date(0, i).toLocaleString('id-ID', { month: 'short' }), value: val }));
    const tickerMap = {}; calculatedDivs.forEach(d => { if(!tickerMap[d.ticker]) tickerMap[d.ticker] = 0; tickerMap[d.ticker] += d.total; });
    const topPayer = Object.keys(tickerMap).sort((a,b) => tickerMap[b] - tickerMap[a])[0] || '-';
    return { totalDividends, totalDividendsYear, chartData, topPayer };
  }, [dividends]);

  const [calcData, setCalcData] = useState({ capital: initialCapital, riskPct: 1, entry: 0, stopLoss: 0 });
  const [calcResult, setCalcResult] = useState(null);
  useEffect(() => { setCalcData(prev => ({...prev, capital: initialCapital})); }, [initialCapital]);
  useEffect(() => { 
    const { capital, riskPct, entry, stopLoss } = calcData; 
    if (!entry || !stopLoss || entry <= stopLoss) { setCalcResult(null); return; } 
    const riskAmount = capital * (riskPct / 100); 
    const riskPerShare = entry - stopLoss; 
    const maxShares = Math.floor(riskAmount / riskPerShare); 
    const maxLots = Math.floor(maxShares / 100); 
    const totalValue = maxLots * 100 * entry; 
    setCalcResult({ riskAmount, maxLots, totalValue, riskPerShare }); 
  }, [calcData]);

  const [visionData, setVisionData] = useState({ startCapital: initialCapital, monthlyReturn: 5, months: 12 });
  const [visionResult, setVisionResult] = useState([]);
  useEffect(() => { setVisionData(prev => ({...prev, startCapital: initialCapital})); }, [initialCapital]);
  useEffect(() => { 
    let current = visionData.startCapital; 
    const data = [{ label: 'Start', value: current }]; 
    for (let i = 1; i <= visionData.months; i++) { 
      current = current * (1 + (visionData.monthlyReturn / 100)); 
      data.push({ label: `Bln ${i}`, value: Math.round(current) }); 
    } 
    setVisionResult(data); 
  }, [visionData]);

  const downloadCSV = () => { 
    const headers = ["Tanggal", "Saham", "Strategi", "Broker", "Mood", "Disiplin", "Lot", "Harga Beli", "Harga Jual", "Net P/L (Rp)", "P/L %", "Catatan"]; 
    const rows = [...trades].sort((a, b) => new Date(b.date) - new Date(a.date)).map(t => { 
      const cal = calculateRow(t); 
      return [t.date, t.ticker, t.strategy, t.broker, MOODS[t.mood||'neutral'].label, t.isDisciplined?'Ya':'Tidak', t.lots, t.buyPrice, t.sellPrice, Math.round(cal.netPnL), cal.pnlPct.toFixed(2), `"${t.notes}"`].join(","); 
    }); 
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n"); 
    const link = document.createElement("a"); link.href = encodeURI(csvContent); link.download = "remora_trading_journal.csv"; link.click(); 
  };

  if (loading) return <div className="flex h-screen w-full items-center justify-center bg-[#041513] text-teal-500 flex-col gap-2"><Loader className="animate-spin" size={32}/><span className="font-mono text-xs">Menghubungkan ke Cloud...</span></div>;

  return (
    <div className="p-4 min-h-screen font-sans text-sm bg-[#041513] text-gray-200 selection:bg-teal-500 selection:text-white pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-[#082823] p-4 rounded-xl shadow-lg border border-[#113C36] gap-4">
        <div className="flex items-center gap-4">
          <RemoraLogo />
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              Remora Journal
              <span className="text-emerald-400 text-xs border border-emerald-500/50 px-2 py-0.5 rounded-full font-normal align-middle">PRO</span>
            </h1>
            <p className="text-teal-400/70 text-xs tracking-wide uppercase mt-1 flex items-center gap-2">
              {authError ? <><WifiOff size={12} className="text-red-500"/> Offline Mode</> : <><Cloud size={12} className="text-emerald-500"/> Cloud Sync Active</>}
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0 flex-wrap">
          <button onClick={() => setShowStrategyReport(true)} className="flex items-center gap-2 px-3 py-2 bg-[#0A3530] hover:bg-[#113C36] text-teal-300 border border-[#164B41] rounded-lg transition-all text-xs"><Award size={14} /> Rapor Strategi</button>
          <button onClick={() => setShowVision(true)} className="flex items-center gap-2 px-3 py-2 bg-[#0A3530] hover:bg-[#113C36] text-teal-300 border border-[#164B41] rounded-lg transition-all text-xs"><Target size={14} /> Simulasi Cuan</button>
          <button onClick={() => setShowCalculator(true)} className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 text-white rounded-lg shadow-lg border border-teal-500/30 transition-all hover:-translate-y-0.5 text-xs"><Calculator size={14} /> Kalkulator Lot</button>
        </div>
      </div>

      {/* DASHBOARD SUMMARY */}
      <div className="mb-6 px-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
            <span className="flex items-center gap-2 font-bold text-teal-200">
              <ShieldCheck size={14} className={disciplineRate >= 80 ? "text-emerald-400" : "text-yellow-400"} /> 
              Tingkat Kedisiplinan
            </span>
            <span className={`font-mono font-bold ${disciplineRate >= 80 ? 'text-emerald-400' : disciplineRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {disciplineRate.toFixed(0)}% 
              {disciplineRate < 80 && disciplineRate >= 50 && <span className="text-[10px] ml-1 opacity-80">(Semi-Reptil)</span>}
              {disciplineRate < 50 && <span className="text-[10px] ml-1 opacity-80">(Reptil)</span>}
            </span>
          </div>
          <div className="w-full bg-[#082823] rounded-full h-2 border border-[#113C36] overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(52,211,153,0.2)] ${disciplineRate >= 80 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : disciplineRate >= 50 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' : 'bg-gradient-to-r from-red-600 to-red-400'}`} style={{ width: `${disciplineRate}%` }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
            <div className="flex items-center gap-2">
              <span className="text-teal-200">Start:</span>
              {isEditingCapital ? (
                <div className="flex items-center gap-1">
                  <input type="text" inputMode="numeric" value={formatNumberInput(tempCapital)} onChange={(e) => setTempCapital(parseNumberInput(e.target.value))} className="bg-[#041513] border border-teal-500 text-white px-1 py-0.5 rounded text-[10px] w-24 font-mono focus:outline-none" autoFocus />
                  <button onClick={saveCapital} className="text-emerald-400"><Check size={12}/></button>
                </div>
              ) : (
                <span className="text-gray-300 cursor-pointer border-b border-dashed border-gray-600 hover:text-white" onClick={() => { setTempCapital(initialCapital); setIsEditingCapital(true); }}>{formatIDR(initialCapital)}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-teal-200">Target:</span>
              {isEditingTarget ? (
                <div className="flex items-center gap-1">
                  <input type="text" inputMode="numeric" value={formatNumberInput(tempTarget)} onChange={(e) => setTempTarget(parseNumberInput(e.target.value))} className="bg-[#041513] border border-teal-500 text-white px-1 py-0.5 rounded text-[10px] w-24 font-mono focus:outline-none" autoFocus />
                  <button onClick={saveTarget} className="text-emerald-400"><Check size={12}/></button>
                </div>
              ) : (
                <div className="flex items-center gap-1 group cursor-pointer" onClick={() => { setTempTarget(annualTarget); setIsEditingTarget(true); }}>
                  <span className="text-gray-300 font-bold border-b border-dashed border-gray-600 hover:text-white">{formatIDR(annualTarget)}</span>
                  <Edit2 size={10} className="opacity-0 group-hover:opacity-100 text-teal-400"/>
                </div>
              )}
            </div>
          </div>
          <div className="w-full bg-[#082823] rounded-full h-2 border border-[#113C36] relative group">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(52,211,153,0.4)]" style={{ width: `${Math.min((summary.currentCapital / annualTarget) * 100, 100)}%` }}></div>
          </div>
          <div className="flex justify-end mt-1">
            <span className={`text-[10px] font-mono ${summary.currentCapital >= initialCapital ? "text-emerald-400" : "text-red-400"}`}>Curr: {formatIDR(summary.currentCapital)}</span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-6 border-b border-[#113C36]">
        <button onClick={() => setActiveTab('journal')} className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-all ${activeTab === 'journal' ? 'border-teal-400 text-teal-400 font-bold' : 'border-transparent text-gray-500 hover:text-gray-300'}`}><List size={18} /> Jurnal & Analisis</button>
        <button onClick={() => setActiveTab('portfolio')} className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-all ${activeTab === 'portfolio' ? 'border-teal-400 text-teal-400 font-bold' : 'border-transparent text-gray-500 hover:text-gray-300'}`}><PieChart size={18} /> Portofolio Aktif</button>
        <button onClick={() => setActiveTab('dividend')} className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-all ${activeTab === 'dividend' ? 'border-teal-400 text-teal-400 font-bold' : 'border-transparent text-gray-500 hover:text-gray-300'}`}><Coins size={18} /> Dividend Tracker</button>
      </div>

      {/* --- TAB CONTENT: JOURNAL --- */}
      {activeTab === 'journal' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
            <div className="md:col-span-3 grid grid-cols-1 gap-4">
              <GlowCard className="p-4">
                <div className="text-teal-400/70 text-xs uppercase font-semibold flex items-center gap-1"><DollarSign size={12}/> Net Profit</div>
                <div className={`text-2xl font-bold mt-1 ${summary.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatIDR(summary.totalPnL)}</div>
              </GlowCard>
              <GlowCard className="p-4">
                <div className="text-teal-400/70 text-xs uppercase font-semibold flex items-center gap-1"><TrendingUp size={12}/> Win Rate</div>
                <div className="text-2xl font-bold mt-1 text-teal-300">{summary.winRate.toFixed(1)}%</div>
                <div className="text-[10px] text-gray-500 mt-1">{summary.totalTrades} Trade Tertutup</div>
              </GlowCard>
              <GlowCard className="p-4">
                <div className="text-teal-400/70 text-xs uppercase font-semibold flex items-center gap-1"><AlertTriangle size={12}/> Max Drawdown</div>
                <div className="text-2xl font-bold mt-1 text-red-400">-{drawdown.toFixed(2)}%</div>
                <div className="text-[10px] text-gray-500 mt-1">Penurunan dari Puncak Equity</div>
              </GlowCard>
              <GlowCard className="p-4">
                <div className="text-teal-400/70 text-xs uppercase font-semibold flex items-center gap-1 mb-3"><Smile size={12}/> Analisis Emosi</div>
                <div className="space-y-2">
                  {moodPerformance.slice(0,3).map((m, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2">{m.icon} <span className="text-gray-300">{m.name}</span></span>
                      <span className={`font-mono ${m.value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{new Intl.NumberFormat('id-ID', { notation: "compact", compactDisplay: "short" }).format(m.value)}</span>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </div>
            <div className="md:col-span-9 flex flex-col">
              <GlowCard className="p-4 h-full">
                <h3 className="text-xs font-bold text-teal-100 uppercase mb-4 flex items-center gap-2"><TrendingUp size={14}/> Pertumbuhan Ekuitas (Equity Curve)</h3>
                <div className="flex-1 w-full relative h-[300px]"><SimpleLineChart data={equityCurve} /></div>
              </GlowCard>
            </div>
          </div>
          
          {/* JOURNAL TABLE */}
          <div className="bg-[#082823] rounded-xl shadow-lg border border-[#113C36] overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#06201c] text-teal-400/60 uppercase text-[10px] tracking-widest border-b border-[#113C36]">
                <tr>
                  <th className="p-4 text-center">#</th>
                  <th className="p-4 min-w-[100px]">Tanggal</th>
                  <th className="p-4 min-w-[80px]">Saham</th>
                  <th className="p-4 min-w-[120px]">Setup</th>
                  <th className="p-4 min-w-[120px]">Sekuritas</th>
                  <th className="p-4 text-center">Disiplin</th>
                  <th className="p-4 text-center">Psikologi</th>
                  <th className="p-4 text-right">Lot</th>
                  <th className="p-4 text-right">Beli</th>
                  <th className="p-4 text-right">Jual</th>
                  <th className="p-4 text-right bg-[#0A3530]/50">Modal</th>
                  <th className="p-4 text-right bg-[#0A3530]/50">Net P/L</th>
                  <th className="p-4 text-center bg-[#0A3530]/50">%</th>
                  <th className="p-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#113C36]">
                {sortedTrades.map((trade, index) => (
                  <TradeRow 
                    key={trade.id} 
                    trade={trade} 
                    index={index} 
                    onInputChange={handleInputChange}
                    onInputBlur={handleInputBlur}
                    onBrokerChange={handleBrokerChange}
                    onBrokerSave={handleBrokerSave}
                    onToggleDiscipline={toggleDiscipline}
                    onCycleMood={cycleMood}
                    onDelete={deleteRow}
                  />
                ))}
              </tbody>
            </table>
            <div className="p-4 border-t border-[#113C36] bg-[#06201c] flex justify-between">
              <div className="flex gap-2">
                <button onClick={addRow} className="flex items-center gap-2 text-teal-400 hover:text-teal-200 font-medium transition text-sm"><Plus size={16} /> Tambah Transaksi</button>
                <div className="flex items-center text-xs text-teal-500/60 ml-2"><Save size={12} className="mr-1"/> Auto-Save Active</div>
              </div>
              <button onClick={downloadCSV} className="flex items-center gap-2 text-gray-500 hover:text-white text-sm"><Download size={16} /> CSV</button>
            </div>
          </div>
          
          <div className="mt-8 p-4 border-t border-[#113C36] flex justify-between items-center bg-[#082823] rounded-lg">
            <div className="text-xs text-gray-500 flex items-center gap-2"><Cloud size={12}/> Data tersimpan aman di cloud server Remora.</div>
            <button onClick={resetAllData} className="flex items-center gap-2 text-red-500 hover:text-red-400 text-xs px-3 py-1 border border-red-500/30 rounded hover:bg-red-500/10 transition"><RotateCcw size={12}/> Reset Portfolio</button>
          </div>
        </>
      )}

      {/* --- TAB CONTENT: PORTFOLIO --- */}
      {activeTab === 'portfolio' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-1 space-y-6">
            <GlowCard className="p-5 h-full">
              <div className="mb-6">
                <div className="text-teal-400/70 text-xs uppercase font-semibold mb-1">Total Equity</div>
                <div className="text-3xl font-bold text-white tracking-tight">{formatIDR(portfolioMetrics.currentEquity)}</div>
              </div>
              <div className="h-[150px] w-full">
                <SimpleLineChart data={portfolioMetrics.equityHistory.map(h => ({ value: h.equity, date: h.date }))} showDots={false} onHover={handleChartHover} onLeave={handleChartLeave} />
              </div>
              <div className="mt-4 text-center text-xs text-teal-300 font-mono h-4">{displayedEquity ? formatIDR(displayedEquity) : ""}</div>
            </GlowCard>
          </div>

          <div className="lg:col-span-2">
            <GlowCard className="h-full flex flex-col">
              <div className="p-4 border-b border-[#113C36] flex justify-between items-center">
                <div className="flex items-center gap-2"><span className="text-teal-100 font-bold text-sm">Total Equity Return</span><Info size={12} className="text-gray-500"/></div>
                <div className="flex items-center gap-2">
                  <div className="flex bg-[#041513] rounded p-0.5 border border-[#113C36]">
                      <button onClick={() => setReturnViewType('Daily')} className={`px-3 py-1 text-[10px] rounded transition-all ${returnViewType === 'Daily' ? 'bg-teal-500/20 text-teal-300 font-bold' : 'text-gray-500 hover:text-gray-300'}`}>Daily</button>
                      <button onClick={() => setReturnViewType('Monthly')} className={`px-3 py-1 text-[10px] rounded transition-all ${returnViewType === 'Monthly' ? 'bg-teal-500/20 text-teal-300 font-bold' : 'text-gray-500 hover:text-gray-300'}`}>Monthly</button>
                  </div>
                  <div className="relative" ref={timeRangeRef}>
                    <button onClick={() => setIsTimeRangeOpen(!isTimeRangeOpen)} className="flex items-center gap-1 bg-[#041513] border border-[#113C36] text-[10px] text-gray-300 px-3 py-1.5 rounded hover:border-teal-500/50 transition-colors">
                        {portfolioTimeRange} <ChevronDown size={10}/>
                    </button>
                    {isTimeRangeOpen && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-[#082823] border border-[#113C36] rounded shadow-xl z-50">
                        {portfolioMetrics.timeRangeOptions.map(r => (
                            <div 
                                key={r} 
                                onClick={() => { setPortfolioTimeRange(r); setIsTimeRangeOpen(false); }} 
                                className="px-3 py-2 hover:bg-[#113C36] text-[10px] text-gray-300 cursor-pointer border-b border-[#113C36]/30 last:border-none"
                            >
                                {r}
                            </div>
                        ))}
                        </div>
                    )}
                  </div>
                </div>
              </div>
               
              <div className="flex-1 overflow-y-auto max-h-[500px]">
                <table className="w-full text-left text-xs">
                  <thead className="text-gray-500 border-b border-[#113C36] sticky top-0 bg-[#082823] z-10"><tr><th className="p-3">Date</th><th className="p-3 text-right">Equity</th><th className="p-3 text-right">P&L</th></tr></thead>
                  <tbody className="divide-y divide-[#113C36]/50">
                    {portfolioMetrics.tableData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#0C302B]">
                        <td className="p-3 text-gray-300 font-medium">{returnViewType === 'Daily' ? formatDateFormal(row.date) : formatMonthYear(row.date)}</td>
                        <td className="p-3 text-right font-mono text-gray-200">{formatIDR(row.equity)}</td>
                        <td className={`p-3 text-right font-mono font-bold ${row.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{row.pnl > 0 ? '+' : ''}{formatIDR(row.pnl)} <span className="text-[10px] opacity-70 font-normal">({row.pnl >= 0 ? '+' : ''}{row.pnlPct.toFixed(2)}%)</span></td>
                      </tr>
                    ))}
                    {portfolioMetrics.tableData.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-gray-500 italic">Tidak ada data untuk periode ini.</td></tr>}
                  </tbody>
                </table>
              </div>
            </GlowCard>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: DIVIDEND --- */}
      {activeTab === 'dividend' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          <div className="lg:col-span-4 space-y-6">
            <GlowCard className="p-5">
              <div className="flex items-center gap-2 text-teal-400/70 mb-2 font-medium"><Coins size={20} /> Total Dividen Diterima</div>
              <div className="text-3xl font-bold text-emerald-400 drop-shadow-md">{formatIDR(dividendStats.totalDividends)}</div>
              <div className="mt-2 text-xs text-gray-400 border-t border-[#113C36] pt-2">Tahun Ini: <span className="text-white font-bold">{formatIDR(dividendStats.totalDividendsYear)}</span></div>
            </GlowCard>
            <GlowCard className="p-5">
              <h3 className="text-xs font-bold text-teal-100 uppercase mb-4 flex items-center gap-2"><Award size={14}/> Saham "Sapi Perah" (Top Payer)</h3>
              <div className="text-4xl font-extrabold text-teal-200">{dividendStats.topPayer}</div>
              <p className="text-xs text-gray-500 mt-2">Emiten ini memberikan kontribusi dividen terbesar ke portofolio Anda.</p>
            </GlowCard>
            <GlowCard className="p-5">
              <h3 className="text-xs font-bold text-teal-100 uppercase mb-4 flex items-center gap-2"><BarChart2 size={14}/> Monthly Income Stream</h3>
              <div className="h-[180px] w-full"><SimpleBarChart data={dividendStats.chartData} /></div>
            </GlowCard>
          </div>
          <div className="lg:col-span-8">
            <div className="bg-[#082823] rounded-xl shadow-lg border border-[#113C36] overflow-hidden h-full">
              <div className="p-4 border-b border-[#113C36] bg-[#06201c] flex justify-between items-center">
                <h3 className="font-bold text-teal-100">Riwayat Dividen</h3>
                <button onClick={addDivRow} className="flex items-center gap-2 text-teal-400 hover:text-teal-200 font-medium text-xs border border-teal-500/30 px-3 py-1 rounded"><Plus size={14} /> Catat</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#051C18] text-teal-400/60 uppercase text-[10px] tracking-widest border-b border-[#113C36]">
                    <tr><th className="p-4">Tanggal</th><th className="p-4">Saham</th><th className="p-4 text-right">Harga Beli</th><th className="p-4 text-right">DPS</th><th className="p-4 text-right">Lot</th><th className="p-4 text-center">Yield</th><th className="p-4 text-right">Total</th><th className="p-4 w-8"></th></tr>
                  </thead>
                  <tbody className="divide-y divide-[#113C36]">
                    {dividends.sort((a,b) => new Date(b.date) - new Date(a.date)).map(div => { 
                      const cal = calculateDivRow(div); 
                      return (
                        <tr key={div.id} className="hover:bg-[#0C302B] transition-colors group text-sm">
                          <td className="p-3 relative group/date">
                            <div className="absolute inset-0 flex items-center px-3 pointer-events-none text-gray-300 group-focus-within/date:opacity-0 text-xs">{formatDateFormal(div.date)}</div>
                            <input type="date" value={div.date} onChange={(e) => handleDivChange(div.id, 'date', e.target.value)} onBlur={() => handleDivBlur(div)} className="w-full bg-transparent border-none text-transparent focus:text-gray-300 focus:ring-0 p-0 cursor-pointer"/>
                          </td>
                          <td className="p-3">
                            <input type="text" value={div.ticker} placeholder="ITMG" onChange={(e) => handleDivChange(div.id, 'ticker', e.target.value.toUpperCase())} onBlur={() => handleDivBlur(div)} className="w-full font-bold bg-transparent border-none focus:ring-0 uppercase text-teal-300 p-0"/>
                          </td>
                          <td className="p-3">
                            <input type="text" inputMode="numeric" value={formatNumberInput(div.price)} onChange={(e) => handleDivChange(div.id, 'price', parseNumberInput(e.target.value))} onBlur={() => handleDivBlur(div)} className="w-full text-right bg-transparent border-none focus:ring-0 text-gray-400 p-0 placeholder-gray-700" placeholder="0"/>
                          </td>
                          <td className="p-3">
                            <input type="text" inputMode="numeric" value={formatNumberInput(div.dps)} onChange={(e) => handleDivChange(div.id, 'dps', parseNumberInput(e.target.value))} onBlur={() => handleDivBlur(div)} className="w-full text-right bg-transparent border-none focus:ring-0 text-gray-300 p-0 placeholder-gray-700"/>
                          </td>
                          <td className="p-3">
                            <input type="text" inputMode="numeric" value={formatNumberInput(div.lots)} onChange={(e) => handleDivChange(div.id, 'lots', parseNumberInput(e.target.value))} onBlur={() => handleDivBlur(div)} className="w-full text-right bg-transparent border-none focus:ring-0 text-gray-300 p-0 placeholder-gray-700"/>
                          </td>
                          <td className="p-3 text-center font-mono text-xs text-blue-300">{cal.yieldPct > 0 ? `${cal.yieldPct.toFixed(1)}%` : '-'}</td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-400">{formatIDR(cal.total)}</td>
                          <td className="p-3 text-center">
                            <button onClick={() => deleteDivRow(div.id)} className="text-gray-600 hover:text-red-400 transition"><Trash2 size={14} /></button>
                          </td>
                        </tr>
                      ); 
                    })}
                    {dividends.length === 0 && (<tr><td colSpan="6" className="p-8 text-center text-gray-500 text-xs italic">Belum ada data dividen. Klik "Catat Dividen" untuk menambahkan.</td></tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODALS --- */}
      {showStrategyReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <GlowCard className="w-full max-w-3xl p-6">
            <button onClick={() => setShowStrategyReport(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white z-20"><X size={20}/></button>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Award size={20} className="text-teal-400"/> Rapor Kinerja Strategi</h2>
            {strategyStats.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Belum ada data trade tertutup untuk dianalisis.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="text-teal-400/70 text-xs uppercase border-b border-[#113C36]">
                    <tr><th className="p-3">Strategi</th><th className="p-3 text-center">Trades</th><th className="p-3 text-center">Win Rate</th><th className="p-3 text-center">Profit Factor</th><th className="p-3 text-right">Net Profit</th><th className="p-3 text-center">Rating</th></tr>
                  </thead>
                  <tbody className="divide-y divide-[#113C36] text-sm">
                    {strategyStats.map((stat, idx) => { 
                      let stars = 1; 
                      if (stat.profitFactor > 3) stars = 5; 
                      else if (stat.profitFactor > 2) stars = 4; 
                      else if (stat.profitFactor > 1.5) stars = 3; 
                      else if (stat.profitFactor > 1) stars = 2; 
                      return (
                        <tr key={idx} className="hover:bg-[#0C302B]">
                          <td className="p-3 font-bold text-teal-200">{stat.name}</td>
                          <td className="p-3 text-center text-gray-300">{stat.total}</td>
                          <td className="p-3 text-center"><span className={`px-2 py-0.5 rounded text-xs ${stat.winRate >= 50 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{stat.winRate.toFixed(0)}%</span></td>
                          <td className="p-3 text-center font-mono text-gray-300">{stat.profitFactor.toFixed(2)}</td>
                          <td className={`p-3 text-right font-mono font-bold ${stat.totalPnL > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatIDR(stat.totalPnL)}</td>
                          <td className="p-3 text-center text-yellow-400 text-xs tracking-widest">{'★'.repeat(stars)}{'☆'.repeat(5-stars)}</td>
                        </tr>
                      ); 
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </GlowCard>
        </div>
      )}

      {showCalculator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <GlowCard className="w-full max-w-md p-6">
            <button onClick={() => setShowCalculator(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white z-20"><X size={20}/></button>
            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2"><Calculator size={20} className="text-teal-400"/> Kalkulator Risiko</h2>
            <div className="space-y-4 relative z-10 mt-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Modal Portfolio (Rp)</label>
                <input type="text" inputMode="numeric" value={formatNumberInput(calcData.capital)} onChange={e => setCalcData({...calcData, capital: parseNumberInput(e.target.value)})} className="w-full bg-[#041513] border border-[#113C36] text-white p-2 rounded focus:border-teal-500 focus:outline-none font-mono text-lg" placeholder="0"/>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">Risiko (%)</label>
                  <input type="number" inputMode="decimal" value={calcData.riskPct || ''} onChange={e => setCalcData({...calcData, riskPct: Number(e.target.value)})} className="w-full bg-[#041513] border border-[#113C36] text-white p-2 rounded focus:border-teal-500 focus:outline-none"/>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">Max Risiko (Rp)</label>
                  <div className="p-2 bg-[#041513]/50 text-red-400 font-mono text-sm border border-transparent rounded">{formatIDR(calcData.capital * (calcData.riskPct/100))}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-teal-200 mb-1">Entry</label>
                  <input type="text" inputMode="numeric" value={formatNumberInput(calcData.entry)} onChange={e => setCalcData({...calcData, entry: parseNumberInput(e.target.value)})} className="w-full bg-[#041513] border border-teal-900 text-white p-2 rounded focus:border-teal-500"/>
                </div>
                <div>
                  <label className="block text-xs text-red-300 mb-1">Stop Loss</label>
                  <input type="text" inputMode="numeric" value={formatNumberInput(calcData.stopLoss)} onChange={e => setCalcData({...calcData, stopLoss: parseNumberInput(e.target.value)})} className="w-full bg-[#041513] border border-red-900/50 text-white p-2 rounded focus:border-red-500"/>
                </div>
              </div>
              {calcResult ? (
                <div className="mt-6 bg-[#041513] p-4 rounded-lg border border-teal-500/20 text-center">
                  <span className="text-gray-400 text-xs">Maksimal Beli</span>
                  <div className="text-4xl font-bold text-teal-400 my-1">{calcResult.maxLots} <span className="text-lg text-teal-600">Lot</span></div>
                  <div className="text-xs text-gray-500">Value: {formatIDR(calcResult.totalValue)}</div>
                </div>
              ) : (
                <div className="mt-4 text-center text-xs text-red-400 italic">Pastikan Entry {'>'} Stop Loss</div>
              )}
            </div>
          </GlowCard>
        </div>
      )}

      {showVision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <GlowCard className="w-full max-w-2xl p-6">
            <button onClick={() => setShowVision(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white z-20"><X size={20}/></button>
            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2"><Target size={20} className="text-teal-400"/> Vision Board</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative z-10 mt-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Modal Awal</label>
                <input type="text" inputMode="numeric" value={formatNumberInput(visionData.startCapital)} onChange={e => setVisionData({...visionData, startCapital: parseNumberInput(e.target.value)})} className="w-full bg-[#041513] border border-[#113C36] text-white p-2 rounded focus:border-teal-500 focus:outline-none font-mono"/>
              </div>
              <div>
                <label className="block text-xs text-teal-200 mb-1">Profit Bulanan (%)</label>
                <input type="number" inputMode="decimal" value={visionData.monthlyReturn || ''} onChange={e => setVisionData({...visionData, monthlyReturn: Number(e.target.value)})} className="w-full bg-[#041513] border border-[#113C36] text-white p-2 rounded focus:border-teal-500"/>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Durasi (Bulan)</label>
                <input type="number" inputMode="numeric" value={visionData.months || ''} onChange={e => setVisionData({...visionData, months: Number(e.target.value)})} className="w-full bg-[#041513] border border-[#113C36] text-white p-2 rounded focus:border-teal-500"/>
              </div>
            </div>
            <div className="bg-[#041513] p-4 rounded-lg border border-[#113C36] h-64 mb-4 relative z-10">
              <SimpleLineChart data={visionResult} color="#34d399" showDots={false} />
            </div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-[#0A3530] p-3 rounded border border-[#113C36]">
                <div className="text-xs text-teal-400/70">Estimasi Akhir</div>
                <div className="text-xl font-bold text-white">{formatIDR(visionResult[visionResult.length - 1]?.value || 0)}</div>
              </div>
              <div className="bg-[#0A3530] p-3 rounded border border-[#113C36]">
                <div className="text-xs text-teal-400/70">Pertumbuhan</div>
                <div className="text-xl font-bold text-emerald-400">+{visionData.startCapital > 0 ? (((visionResult[visionResult.length - 1]?.value - visionData.startCapital) / visionData.startCapital) * 100).toFixed(1) : 0}%</div>
              </div>
            </div>
          </GlowCard>
        </div>
      )}
    </div>
  );
};

export default RemoraJournal;