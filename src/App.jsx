```jsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Plus, Utensils, Cookie, ShoppingCart, Bus, ShoppingBag, Film, GraduationCap,
  Home, Receipt, HeartPulse, Repeat, MoreHorizontal, Search, X, Edit2,
  Trash2, TrendingUp, Flame, Download, Upload, RotateCcw,
  Check, AlertTriangle, LayoutDashboard, ListPlus, PieChart as PieChartIcon,
  Target, Settings as SettingsIcon, Tag, ArrowUpRight, ArrowDownRight,
  Sparkles, Wallet, LogOut, RefreshCw, CloudOff
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import Papa from 'papaparse';
import { supabase, supabaseConfigured } from './supabaseClient.js';

/* ------------------------------------------------------------------ */
/* Design tokens / global stylesheet                                   */
/* ------------------------------------------------------------------ */

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

:root{
  --bg:#12141c;
  --bg-elev:#1a1d29;
  --bg-elev-2:#20243350;
  --border:#2a2e40;
  --border-soft:#22263480;
  --text:#f3f1ea;
  --text-muted:#9195a8;
  --text-dim:#5d6178;
  --accent:#f5a623;
  --accent-soft:#f5a62322;
  --mint:#4ecdc4;
  --mint-soft:#4ecdc422;
  --coral:#ff6b5b;
  --coral-soft:#ff6b5b22;
  --radius-lg:20px;
  --radius-md:14px;
  --radius-sm:10px;
  --font-display:'Space Grotesk', sans-serif;
  --font-body:'Inter', sans-serif;
  --font-mono:'JetBrains Mono', monospace;
}

.spendly *{ box-sizing:border-box; }

.spendly{
  font-family:var(--font-body);
  color:var(--text);
  background:var(--bg);
  min-height:100vh;
  width:100%;
  position:relative;
  -webkit-font-smoothing:antialiased;
}

.spendly ::selection{
  background:var(--accent);
  color:#1a1200;
}

.spendly ::-webkit-scrollbar{
  width:8px;
  height:8px;
}

.spendly ::-webkit-scrollbar-thumb{
  background:var(--border);
  border-radius:8px;
}

.spendly ::-webkit-scrollbar-track{
  background:transparent;
}

.spendly button{
  font-family:inherit;
}

.spendly input,
.spendly textarea,
.spendly select{
  font-family:inherit;
}

.sp-shell{
  display:flex;
  min-height:100vh;
}

.sp-sidebar{
  width:220px;
  flex-shrink:0;
  padding:28px 16px;
  border-right:1px solid var(--border-soft);
  display:flex;
  flex-direction:column;
  gap:4px;
  position:sticky;
  top:0;
  height:100vh;
}

.sp-brand{
  display:flex;
  align-items:center;
  gap:10px;
  padding:0 10px 26px;
}

.sp-brand-mark{
  width:34px;
  height:34px;
  border-radius:10px;
  background:linear-gradient(135deg,var(--accent),#ffcf7a);
  display:flex;
  align-items:center;
  justify-content:center;
  color:#241800;
  font-family:var(--font-display);
  font-weight:700;
  font-size:17px;
  flex-shrink:0;
}

.sp-brand-name{
  font-family:var(--font-display);
  font-weight:700;
  font-size:19px;
  letter-spacing:-0.02em;
}

.sp-navitem{
  display:flex;
  align-items:center;
  gap:12px;
  padding:11px 12px;
  border-radius:var(--radius-sm);
  color:var(--text-muted);
  cursor:pointer;
  font-size:14.5px;
  font-weight:500;
  transition:background .15s, color .15s;
  border:none;
  background:transparent;
  width:100%;
  text-align:left;
}

.sp-navitem:hover{
  background:var(--bg-elev-2);
  color:var(--text);
}

.sp-navitem.active{
  background:var(--accent-soft);
  color:var(--accent);
}

.sp-navitem svg{
  flex-shrink:0;
}

.sp-main{
  flex:1;
  min-width:0;
  padding:32px 36px 120px;
  max-width:1180px;
}

.sp-bottomnav{
  display:none;
  position:fixed;
  bottom:0;
  left:0;
  right:0;
  z-index:40;
  background:rgba(20,22,31,0.92);
  backdrop-filter:blur(14px);
  border-top:1px solid var(--border-soft);
  padding:8px 6px calc(8px + env(safe-area-inset-bottom));
  justify-content:space-around;
}

.sp-bottomnav button{
  background:none;
  border:none;
  color:var(--text-dim);
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:3px;
  font-size:10.5px;
  font-weight:500;
  padding:6px 4px;
  border-radius:10px;
}

.sp-bottomnav button.active{
  color:var(--accent);
}

.sp-topbar{
  display:none;
}

@media (max-width:820px){
  .sp-sidebar{
    display:none;
  }

  .sp-bottomnav{
    display:flex;
  }

  .sp-main{
    padding:20px 16px 110px;
  }

  .sp-topbar{
    display:flex;
  }
}

.sp-card{
  background:var(--bg-elev);
  border:1px solid var(--border-soft);
  border-radius:var(--radius-lg);
  padding:22px;
  transition:border-color .2s, transform .2s;
}

.sp-card.hoverable:hover{
  border-color:var(--border);
  transform:translateY(-1px);
}

.sp-h1{
  font-family:var(--font-display);
  font-weight:700;
  font-size:26px;
  letter-spacing:-0.02em;
  margin:0;
}

.sp-h2{
  font-family:var(--font-display);
  font-weight:600;
  font-size:17px;
  letter-spacing:-0.01em;
  margin:0;
}

.sp-eyebrow{
  font-size:12px;
  font-weight:600;
  letter-spacing:.06em;
  text-transform:uppercase;
  color:var(--text-dim);
}

.sp-mono{
  font-family:var(--font-mono);
}

.sp-hero-num{
  font-family:var(--font-mono);
  font-weight:700;
  font-size:44px;
  letter-spacing:-0.02em;
  line-height:1.05;
}

@media (max-width:820px){
  .sp-hero-num{
    font-size:36px;
  }
}

.sp-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  border-radius:var(--radius-sm);
  font-weight:600;
  font-size:14px;
  cursor:pointer;
  border:1px solid transparent;
  padding:10px 18px;
  transition:filter .15s, transform .1s;
  white-space:nowrap;
}

.sp-btn:active{
  transform:scale(.97);
}

.sp-btn-primary{
  background:var(--accent);
  color:#1c1300;
}

.sp-btn-primary:hover{
  filter:brightness(1.08);
}

.sp-btn-ghost{
  background:var(--bg-elev-2);
  color:var(--text);
  border-color:var(--border);
}

.sp-btn-ghost:hover{
  background:var(--border-soft);
}

.sp-btn-danger{
  background:var(--coral-soft);
  color:var(--coral);
  border-color:#ff6b5b40;
}

.sp-btn-danger:hover{
  filter:brightness(1.1);
}

.sp-btn-sm{
  padding:7px 12px;
  font-size:12.5px;
  border-radius:9px;
}

.sp-btn-icon{
  padding:9px;
  border-radius:10px;
}

.sp-input,
.sp-select,
.sp-textarea{
  width:100%;
  background:var(--bg);
  border:1px solid var(--border);
  border-radius:var(--radius-sm);
  color:var(--text);
  padding:11px 13px;
  font-size:14.5px;
  outline:none;
  transition:border-color .15s;
}

.sp-input:focus,
.sp-select:focus,
.sp-textarea:focus{
  border-color:var(--accent);
}

.sp-input::placeholder,
.sp-textarea::placeholder{
  color:var(--text-dim);
}

.sp-label{
  font-size:12.5px;
  font-weight:600;
  color:var(--text-muted);
  margin-bottom:7px;
  display:block;
}

.sp-chip{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:8px 13px;
  border-radius:999px;
  background:var(--bg-elev-2);
  border:1px solid var(--border);
  color:var(--text-muted);
  font-size:13px;
  font-weight:500;
  cursor:pointer;
  transition:all .15s;
  white-space:nowrap;
}

.sp-chip:hover{
  border-color:var(--text-dim);
  color:var(--text);
}

.sp-chip.active{
  background:var(--accent-soft);
  border-color:var(--accent);
  color:var(--accent);
}

.sp-catgrid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:9px;
}

@media (max-width:480px){
  .sp-catgrid{
    grid-template-columns:repeat(3,1fr);
  }
}

.sp-cattile{
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:6px;
  padding:12px 6px;
  border-radius:var(--radius-sm);
  border:1.5px solid var(--border);
  background:var(--bg);
  cursor:pointer;
  transition:all .15s;
}

.sp-cattile.active{
  border-color:var(--tile-color,var(--accent));
  background:var(--tile-color-soft,var(--accent-soft));
}

.sp-cattile span{
  font-size:11.5px;
  font-weight:500;
  color:var(--text-muted);
  text-align:center;
}

.sp-cattile.active span{
  color:var(--text);
}

.sp-cat-icon{
  width:34px;
  height:34px;
  border-radius:10px;
  display:flex;
  align-items:center;
  justify-content:center;
  flex-shrink:0;
}

.sp-progress-track{
  width:100%;
  height:9px;
  border-radius:999px;
  background:var(--bg);
  overflow:hidden;
  border:1px solid var(--border-soft);
}

.sp-progress-fill{
  height:100%;
  border-radius:999px;
  transition:width .8s cubic-bezier(.22,1,.36,1);
}

.sp-receipt-group{
  margin-bottom:26px;
}

.sp-receipt-label{
  font-family:var(--font-mono);
  font-size:12px;
  letter-spacing:.05em;
  text-transform:uppercase;
  color:var(--text-dim);
  margin:0 0 10px 2px;
  display:flex;
  align-items:center;
  gap:10px;
}

.sp-receipt-label::after{
  content:'';
  flex:1;
  height:1px;
  background:repeating-linear-gradient(
    90deg,
    var(--border) 0 6px,
    transparent 6px 11px
  );
}

.sp-receipt-row{
  display:flex;
  align-items:center;
  gap:13px;
  padding:13px 6px;
  border-bottom:1px dashed var(--border-soft);
  cursor:default;
}

.sp-receipt-row:last-child{
  border-bottom:none;
}

.sp-receipt-amt{
  font-family:var(--font-mono);
  font-weight:600;
  font-size:15px;
}

.sp-receipt-actions{
  display:flex;
  gap:4px;
  opacity:0;
  transition:opacity .15s;
}

.sp-receipt-row:hover .sp-receipt-actions{
  opacity:1;
}

.sp-icon-btn{
  background:transparent;
  border:none;
  color:var(--text-dim);
  padding:6px;
  border-radius:8px;
  cursor:pointer;
  display:flex;
}

.sp-icon-btn:hover{
  background:var(--bg-elev-2);
  color:var(--text);
}

.sp-fab{
  position:fixed;
  right:32px;
  bottom:32px;
  z-index:45;
  width:58px;
  height:58px;
  border-radius:50%;
  background:var(--accent);
  color:#1c1300;
  border:none;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 8px 24px -6px #f5a62366, 0 2px 8px #00000040;
  cursor:pointer;
  transition:transform .15s;
}

.sp-fab:hover{
  transform:scale(1.06) rotate(90deg);
}

@media (max-width:820px){
  .sp-fab{
    right:18px;
    bottom:78px;
    width:52px;
    height:52px;
  }
}

.sp-modal-overlay{
  position:fixed;
  inset:0;
  background:#080911cc;
  backdrop-filter:blur(3px);
  z-index:100;
  display:flex;
  align-items:flex-end;
  justify-content:center;
  animation:sp-fadein .18s ease;
}

@media (min-width:640px){
  .sp-modal-overlay{
    align-items:center;
  }
}

@keyframes sp-fadein{
  from{opacity:0;}
  to{opacity:1;}
}

.sp-modal{
  background:var(--bg-elev);
  border:1px solid var(--border);
  width:100%;
  max-width:480px;
  max-height:92vh;
  overflow-y:auto;
  border-radius:22px 22px 0 0;
  padding:24px 22px calc(24px + env(safe-area-inset-bottom));
  animation:sp-slideup .22s cubic-bezier(.22,1,.36,1);
}

@media (min-width:640px){
  .sp-modal{
    border-radius:22px;
    margin:20px;
  }
}

@keyframes sp-slideup{
  from{
    transform:translateY(24px);
    opacity:0;
  }
  to{
    transform:translateY(0);
    opacity:1;
  }
}

.sp-toast{
  position:fixed;
  bottom:100px;
  left:50%;
  transform:translateX(-50%);
  z-index:200;
  background:var(--bg-elev);
  border:1px solid var(--border);
  color:var(--text);
  padding:12px 18px;
  border-radius:14px;
  font-size:13.5px;
  font-weight:500;
  display:flex;
  align-items:center;
  gap:10px;
  box-shadow:0 12px 30px -8px #00000080;
  animation:sp-toastin .25s cubic-bezier(.22,1,.36,1);
}

@keyframes sp-toastin{
  from{
    transform:translate(-50%,14px);
    opacity:0;
  }
  to{
    transform:translate(-50%,0);
    opacity:1;
  }
}

.sp-spin{
  animation:sp-spin 1s linear infinite;
}

@keyframes sp-spin{
  to{
    transform:rotate(360deg);
  }
}

.sp-auth-wrap{
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:24px;
}

.sp-auth-card{
  width:100%;
  max-width:380px;
}

.sp-empty{
  text-align:center;
  padding:60px 20px;
  color:var(--text-muted);
}

.sp-empty h3{
  font-family:var(--font-display);
  font-size:19px;
  color:var(--text);
  margin:14px 0 6px;
}

.sp-empty p{
  font-size:13.5px;
  max-width:320px;
  margin:0 auto 22px;
  line-height:1.5;
}

.sp-badge{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:5px 11px;
  border-radius:999px;
  font-size:12px;
  font-weight:600;
}

.sp-grid2{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:14px;
}

.sp-grid3{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:14px;
}

.sp-grid4{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:14px;
}

@media (max-width:820px){
  .sp-grid3{
    grid-template-columns:repeat(2,1fr);
  }

  .sp-grid4{
    grid-template-columns:repeat(2,1fr);
  }
}

@media (max-width:480px){
  .sp-grid2{
    grid-template-columns:1fr;
  }
}

.sp-count{
  animation:sp-pop .35s cubic-bezier(.22,1,.36,1);
}

@keyframes sp-pop{
  from{
    transform:scale(.94);
    opacity:.4;
  }
  to{
    transform:scale(1);
    opacity:1;
  }
}

.sp-skeleton{
  animation:sp-pulse 1.4s ease-in-out infinite;
  background:var(--bg-elev);
  border-radius:var(--radius-lg);
}

@keyframes sp-pulse{
  0%,100%{
    opacity:.55;
  }

  50%{
    opacity:.9;
  }
}

.sp-insight{
  display:flex;
  gap:11px;
  align-items:flex-start;
  padding:13px 0;
  border-bottom:1px solid var(--border-soft);
}

.sp-insight:last-child{
  border-bottom:none;
}

.sp-insight-icon{
  width:30px;
  height:30px;
  border-radius:9px;
  background:var(--mint-soft);
  color:var(--mint);
  display:flex;
  align-items:center;
  justify-content:center;
  flex-shrink:0;
  margin-top:1px;
}

.sp-tabs{
  display:flex;
  gap:6px;
  overflow-x:auto;
  padding-bottom:2px;
}

.sp-tabs::-webkit-scrollbar{
  display:none;
}

/* Google button */

.sp-google-btn{
  width:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  background:#ffffff;
  color:#1f1f1f;
  border:1px solid #dadce0;
  border-radius:var(--radius-sm);
  padding:12px 16px;
  font-size:14px;
  font-weight:600;
  cursor:pointer;
  transition:background .15s, box-shadow .15s, transform .1s;
}

.sp-google-btn:hover{
  background:#f7f7f7;
  box-shadow:0 2px 8px rgba(0,0,0,.18);
}

.sp-google-btn:active{
  transform:scale(.98);
}

.sp-google-btn:disabled{
  opacity:.65;
  cursor:not-allowed;
}

.sp-google-icon{
  width:18px;
  height:18px;
  display:flex;
  align-items:center;
  justify-content:center;
}
`;

/* ------------------------------------------------------------------ */
/* Data / constants                                                    */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  { id: 'food', name: 'Food', icon: Utensils, color: '#F5A623' },
  { id: 'snacks', name: 'Snacks', icon: Cookie, color: '#FFD166' },
  { id: 'groceries', name: 'Groceries', icon: ShoppingCart, color: '#8FD14F' },
  { id: 'travel', name: 'Travel', icon: Bus, color: '#4ECDC4' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: '#B388EB' },
  { id: 'entertainment', name: 'Entertainment', icon: Film, color: '#FF6B9D' },
  { id: 'college', name: 'College', icon: GraduationCap, color: '#5B9BF5' },
  { id: 'hostel', name: 'Hostel', icon: Home, color: '#FF9F5A' },
  { id: 'bills', name: 'Bills', icon: Receipt, color: '#EF476F' },
  { id: 'health', name: 'Health', icon: HeartPulse, color: '#06D6A0' },
  { id: 'subscriptions', name: 'Subscriptions', icon: Repeat, color: '#A0A0FF' },
  { id: 'other', name: 'Other', icon: MoreHorizontal, color: '#9195A8' },
];

const CUSTOM_PALETTE = [
  '#F5A623',
  '#4ECDC4',
  '#FF6B9D',
  '#8FD14F',
  '#B388EB',
  '#5B9BF5',
  '#EF476F',
  '#06D6A0'
];

const PRESETS = [
  { label: 'Mess', category: 'food' },
  { label: 'Canteen', category: 'food' },
  { label: 'Swiggy', category: 'food' },
  { label: 'Zomato', category: 'food' },
  { label: 'Chai', category: 'snacks' },
  { label: 'Stationery', category: 'college' },
  { label: 'Auto/Metro', category: 'travel' },
  { label: 'Laundry', category: 'hostel' },
  { label: 'Room supplies', category: 'hostel' },
  { label: 'Movies', category: 'entertainment' },
  { label: 'Gaming', category: 'entertainment' },
  { label: 'Subscription', category: 'subscriptions' },
];

const SAMPLE_POOL = [
  { title: 'Lunch', category: 'food', range: [40, 80] },
  { title: 'Dinner', category: 'food', range: [50, 120] },
  { title: 'Biryani (Swiggy)', category: 'food', range: [150, 280] },
  { title: 'Pizza (Zomato)', category: 'food', range: [200, 450] },
  { title: 'Chai', category: 'snacks', range: [10, 20] },
  { title: 'Maggi', category: 'snacks', range: [30, 50] },
  { title: 'Samosa', category: 'snacks', range: [15, 30] },
  { title: 'Groceries', category: 'groceries', range: [150, 400] },
  { title: 'Fruits', category: 'groceries', range: [50, 150] },
  { title: 'Auto fare', category: 'travel', range: [30, 90] },
  { title: 'Metro recharge', category: 'travel', range: [100, 300] },
  { title: 'Bus pass', category: 'travel', range: [50, 100] },
  { title: 'T-shirt', category: 'shopping', range: [400, 900] },
  { title: 'Shoes', category: 'shopping', range: [800, 2000] },
  { title: 'Movie ticket', category: 'entertainment', range: [150, 350] },
  { title: 'Gaming top-up', category: 'entertainment', range: [100, 500] },
  { title: 'Notebook & pens', category: 'college', range: [50, 150] },
  { title: 'Photocopies', category: 'college', range: [10, 50] },
  { title: 'Event fee', category: 'college', range: [100, 500] },
  { title: 'Laundry', category: 'hostel', range: [50, 150] },
  { title: 'Room supplies', category: 'hostel', range: [100, 300] },
  { title: 'Mobile recharge', category: 'bills', range: [200, 400] },
  { title: 'Electricity share', category: 'bills', range: [100, 300] },
  { title: 'Medicines', category: 'health', range: [50, 250] },
  { title: 'Netflix', category: 'subscriptions', range: [150, 500] },
  { title: 'Spotify', category: 'subscriptions', range: [59, 119] },
  { title: 'Misc spend', category: 'other', range: [20, 100] },
];

const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const MONTHS = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec'
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const rand = (min, max) =>
  Math.round(min + Math.random() * (max - min));

const clamp = (n, a, b) =>
  Math.max(a, Math.min(b, n));

function fmtINR(n) {
  const v = Math.round((n || 0) * 100) / 100;
  const hasDecimals = Math.abs(v % 1) > 0.001;

  return '₹' + v.toLocaleString('en-IN', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2
  });
}

function dkey(d) {
  const x = new Date(d);
  return `${x.getFullYear()}-${x.getMonth()}-${x.getDate()}`;
}

function isSameDay(a, b) {
  return dkey(a) === dkey(b);
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0,0,0,0);
  return x;
}

function startOfWeek(d) {
  const x = startOfDay(d);
  const day = x.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  x.setDate(x.getDate() + diff);
  return x;
}

function startOfMonth(d) {
  const x = startOfDay(d);
  x.setDate(1);
  return x;
}

function daysInMonth(d) {
  const x = new Date(
    d.getFullYear(),
    d.getMonth() + 1,
    0
  );

  return x.getDate();
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function fmtShortDate(d) {
  const x = new Date(d);
  return `${x.getDate()} ${MONTHS[x.getMonth()]}`;
}

function fmtTime(d) {
  const x = new Date(d);
  let h = x.getHours();
  const m = x.getMinutes();
  const ap = h >= 12 ? 'PM' : 'AM';

  h = h % 12 || 12;

  return `${h}:${m.toString().padStart(2,'0')} ${ap}`;
}

function generateSampleExpenses() {
  const list = [];
  const today = new Date();

  for (let i = 41; i >= 0; i--) {
    const day = addDays(today, -i);
    const count = Math.random() < 0.12 ? 0 : rand(1, 3);

    for (let c = 0; c < count; c++) {
      const item =
        SAMPLE_POOL[rand(0, SAMPLE_POOL.length - 1)];

      const amount =
        rand(item.range[0], item.range[1]);

      const dt = new Date(day);

      dt.setHours(
        rand(8, 22),
        rand(0, 59),
        0,
        0
      );

      list.push({
        id: uid(),
        amount,
        category: item.category,
        title: item.title,
        date: dt.toISOString(),
        notes: '',
      });
    }
  }

  return list.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
}

function defaultData() {
  return {
    expenses: generateSampleExpenses(),
    isSample: true,
    budget: {
      monthly: 6000,
      categories: {}
    },
    customCategories: [],
  };
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function CatIcon({ cat, size = 18, box = 34 }) {
  const Icon = cat.icon;

  return (
    <div
      className="sp-cat-icon"
      style={{
        width: box,
        height: box,
        background: cat.color + '22',
        color: cat.color
      }}
    >
      <Icon size={size} />
    </div>
  );
}

function ProgressBar({
  pct,
  color = 'var(--accent)'
}) {
  return (
    <div className="sp-progress-track">
      <div
        className="sp-progress-fill"
        style={{
          width: `${clamp(pct,0,100)}%`,
          background: color
        }}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent
}) {
  return (
    <div className="sp-card">
      <div className="sp-eyebrow">
        {label}
      </div>

      <div
        className="sp-mono sp-count"
        style={{
          fontSize: 22,
          fontWeight: 700,
          marginTop: 8
        }}
      >
        {value}
      </div>

      {sub && (
        <div
          style={{
            fontSize: 12.5,
            color: accent || 'var(--text-muted)',
            marginTop: 6
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function EmptyState({
  title,
  body,
  onAdd
}) {
  return (
    <div className="sp-empty">
      <Wallet
        size={40}
        color="var(--text-dim)"
      />

      <h3>{title}</h3>

      <p>{body}</p>

      {onAdd && (
        <button
          className="sp-btn sp-btn-primary"
          onClick={onAdd}
        >
          <Plus size={16} />
          Add Expense
        </button>
      )}
    </div>
  );
}

function ConfirmDialog({
  title,
  body,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel
}) {
  return (
    <div
      className="sp-modal-overlay"
      onClick={onCancel}
    >
      <div
        className="sp-modal"
        style={{ maxWidth: 360 }}
        onClick={e => e.stopPropagation()}
      >
        <div
          style={{
            display:'flex',
            gap:12,
            alignItems:'flex-start',
            marginBottom:18
          }}
        >
          <div
            style={{
              width:38,
              height:38,
              borderRadius:10,
              background:'var(--coral-soft)',
              color:'var(--coral)',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              flexShrink:0
            }}
          >
            <AlertTriangle size={19} />
          </div>

          <div>
            <div className="sp-h2">
              {title}
            </div>

            <div
              style={{
                fontSize:13.5,
                color:'var(--text-muted)',
                marginTop:5,
                lineHeight:1.5
              }}
            >
              {body}
            </div>
          </div>
        </div>

        <div
          style={{
            display:'flex',
            gap:10,
            justifyContent:'flex-end'
          }}
        >
          <button
            className="sp-btn sp-btn-ghost"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="sp-btn sp-btn-danger"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Add / Edit expense modal                                            */
/* ------------------------------------------------------------------ */

function ExpenseModal({
  editing,
  allCategories,
  onSave,
  onClose,
  onAddCustomCategory
}) {
  const [amount, setAmount] = useState(
    editing ? String(editing.amount) : ''
  );

  const [category, setCategory] = useState(
    editing ? editing.category : 'food'
  );

  const [title, setTitle] = useState(
    editing ? editing.title : ''
  );

  const [notes, setNotes] = useState(
    editing ? editing.notes || '' : ''
  );

  const [date, setDate] = useState(() => {
    const d = editing
      ? new Date(editing.date)
      : new Date();

    const pad = n =>
      String(n).padStart(2,'0');

    return `${d.getFullYear()}-${pad(
      d.getMonth()+1
    )}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  });

  const [showCustomForm, setShowCustomForm] =
    useState(false);

  const [customName, setCustomName] =
    useState('');

  const amountRef = useRef(null);

  useEffect(() => {
    amountRef.current &&
      amountRef.current.focus();
  }, []);

  const applyPreset = p => {
    setCategory(p.category);

    if (!title) {
      setTitle(p.label);
    }
  };

  const submit = () => {
    const amt = parseFloat(amount);

    if (!amt || amt <= 0) return;

    onSave({
      id: editing ? editing.id : uid(),
      amount: amt,
      category,
      title:
        title.trim() ||
        allCategories.find(
          c => c.id === category
        )?.name ||
        'Expense',
      date: new Date(date).toISOString(),
      notes: notes.trim(),
    });
  };

  const addCustom = () => {
    if (!customName.trim()) return;

    const id = 'c_' + uid();

    const color =
      CUSTOM_PALETTE[
        rand(0, CUSTOM_PALETTE.length - 1)
      ];

    onAddCustomCategory({
      id,
      name: customName.trim(),
      color,
      icon: 'Tag'
    });

    setCategory(id);
    setCustomName('');
    setShowCustomForm(false);
  };

  return (
    <div
      className="sp-modal-overlay"
      onClick={onClose}
    >
      <div
        className="sp-modal"
        onClick={e => e.stopPropagation()}
      >
        <div
          style={{
            display:'flex',
            justifyContent:'space-between',
            alignItems:'center',
            marginBottom:18
          }}
        >
          <div className="sp-h2">
            {editing
              ? 'Edit expense'
              : 'Add expense'}
          </div>

          <button
            className="sp-icon-btn"
            onClick={onClose}
          >
            <X size={19} />
          </button>
        </div>

        {!editing && (
          <div
            className="sp-tabs"
            style={{ marginBottom:18 }}
          >
            {PRESETS.map(p => (
              <button
                key={p.label}
                className="sp-chip"
                onClick={() =>
                  applyPreset(p)
                }
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        <div style={{ marginBottom:18 }}>
          <label className="sp-label">
            Amount
          </label>

          <div style={{ position:'relative' }}>
            <span
              className="sp-mono"
              style={{
                position:'absolute',
                left:14,
                top:'50%',
                transform:'translateY(-50%)',
                fontSize:22,
                fontWeight:700,
                color:'var(--accent)'
              }}
            >
              ₹
            </span>

            <input
              ref={amountRef}
              className="sp-input sp-mono"
              style={{
                paddingLeft:34,
                fontSize:24,
                fontWeight:700,
                height:56
              }}
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={e =>
                setAmount(e.target.value)
              }
              onKeyDown={e =>
                e.key === 'Enter' &&
                submit()
              }
            />
          </div>
        </div>

        <div style={{ marginBottom:18 }}>
          <label className="sp-label">
            Category
          </label>

          <div className="sp-catgrid">
            {allCategories.map(cat => {
              const Icon = cat.icon;
              const active =
                category === cat.id;

              return (
                <div
                  key={cat.id}
                  className={`sp-cattile ${
                    active ? 'active' : ''
                  }`}
                  style={
                    active
                      ? {
                          '--tile-color':cat.color,
                          '--tile-color-soft':
                            cat.color + '22'
                        }
                      : {}
                  }
                  onClick={() =>
                    setCategory(cat.id)
                  }
                >
                  <div
                    className="sp-cat-icon"
                    style={{
                      background:
                        cat.color + '22',
                      color:cat.color,
                      width:32,
                      height:32
                    }}
                  >
                    <Icon size={16} />
                  </div>

                  <span>
                    {cat.name}
                  </span>
                </div>
              );
            })}

            <div
              className="sp-cattile"
              onClick={() =>
                setShowCustomForm(
                  s => !s
                )
              }
            >
              <div
                className="sp-cat-icon"
                style={{
                  background:
                    'var(--bg-elev-2)',
                  color:'var(--text-muted)',
                  width:32,
                  height:32
                }}
              >
                <Plus size={16} />
              </div>

              <span>Custom</span>
            </div>
          </div>

          {showCustomForm && (
            <div
              style={{
                display:'flex',
                gap:8,
                marginTop:10
              }}
            >
              <input
                className="sp-input"
                placeholder="Category name"
                value={customName}
                onChange={e =>
                  setCustomName(
                    e.target.value
                  )
                }
                onKeyDown={e =>
                  e.key === 'Enter' &&
                  addCustom()
                }
              />

              <button
                className="sp-btn sp-btn-primary sp-btn-sm"
                onClick={addCustom}
              >
                Add
              </button>
            </div>
          )}
        </div>

        <div style={{ marginBottom:18 }}>
          <label className="sp-label">
            What
          </label>

          <input
            className="sp-input"
            placeholder="e.g. Biryani"
            value={title}
            onChange={e =>
              setTitle(e.target.value)
            }
          />
        </div>

        <div style={{ marginBottom:18 }}>
          <label className="sp-label">
            Date &amp; time
          </label>

          <input
            className="sp-input"
            type="datetime-local"
            value={date}
            onChange={e =>
              setDate(e.target.value)
            }
          />
        </div>

        <div style={{ marginBottom:22 }}>
          <label className="sp-label">
            Notes (optional)
          </label>

          <textarea
            className="sp-textarea"
            rows={2}
            placeholder="Anything to remember about this?"
            value={notes}
            onChange={e =>
              setNotes(e.target.value)
            }
          />
        </div>

        <button
          className="sp-btn sp-btn-primary"
          style={{
            width:'100%',
            padding:'13px',
            fontSize:15
          }}
          onClick={submit}
          disabled={
            !amount ||
            parseFloat(amount) <= 0
          }
        >
          <Check size={17} />

          {editing
            ? 'Save changes'
            : 'Save expense'}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

function Dashboard({
  expenses,
  allCategories,
  budget,
  streak,
  onAdd,
  onEdit,
  onDelete,
  catMap
}) {
  const now = new Date();

  const todayTotal = useMemo(
    () =>
      expenses
        .filter(e =>
          isSameDay(e.date, now)
        )
        .reduce(
          (s,e) => s + e.amount,
          0
        ),
    [expenses]
  );

  const weekStart = startOfWeek(now);

  const weekTotal = useMemo(
    () =>
      expenses
        .filter(
          e =>
            new Date(e.date) >=
            weekStart
        )
        .reduce(
          (s,e) => s + e.amount,
          0
        ),
    [expenses]
  );

  const monthStart =
    startOfMonth(now);

  const monthExpenses = useMemo(
    () =>
      expenses.filter(
        e =>
          new Date(e.date) >=
          monthStart
      ),
    [expenses]
  );

  const monthTotal = useMemo(
    () =>
      monthExpenses.reduce(
        (s,e) => s + e.amount,
        0
      ),
    [monthExpenses]
  );

  const daysElapsed = now.getDate();

  const avgDaily =
    monthTotal / daysElapsed;

  const dayTotals = useMemo(() => {
    const m = {};

    monthExpenses.forEach(e => {
      const k = dkey(e.date);
      m[k] = (m[k] || 0) + e.amount;
    });

    return m;
  }, [monthExpenses]);

  const highestDay = useMemo(() => {
    let best = null;
    let bestVal = -1;

    Object.entries(dayTotals)
      .forEach(([k,v]) => {
        if (v > bestVal) {
          bestVal = v;
          best = k;
        }
      });

    return best
      ? { val:bestVal }
      : null;
  }, [dayTotals]);

  const catCounts = useMemo(() => {
    const m = {};

    monthExpenses.forEach(e => {
      m[e.category] =
        (m[e.category] || 0) + 1;
    });

    return m;
  }, [monthExpenses]);

  const topCat = useMemo(() => {
    let best = null;
    let bestVal = -1;

    Object.entries(catCounts)
      .forEach(([k,v]) => {
        if (v > bestVal) {
          bestVal = v;
          best = k;
        }
      });

    return best;
  }, [catCounts]);

  const last14 = useMemo(() => {
    const arr = [];

    for (let i = 13; i >= 0; i--) {
      const d =
        addDays(now, -i);

      const total =
        expenses
          .filter(e =>
            isSameDay(e.date, d)
          )
          .reduce(
            (s,e) => s + e.amount,
            0
          );

      arr.push({
        label:fmtShortDate(d),
        value:Math.round(total)
      });
    }

    return arr;
  }, [expenses]);

  const catBreakdown = useMemo(() => {
    const m = {};

    monthExpenses.forEach(e => {
      m[e.category] =
        (m[e.category] || 0) +
        e.amount;
    });

    return Object.entries(m)
      .map(([id,value]) => ({
        id,
        value,
        ...catMap[id]
      }))
      .sort(
        (a,b) => b.value - a.value
      );
  }, [monthExpenses, catMap]);

  const recent = useMemo(
    () =>
      [...expenses]
        .sort(
          (a,b) =>
            new Date(b.date) -
            new Date(a.date)
        )
        .slice(0,5),
    [expenses]
  );

  const budgetPct =
    budget.monthly > 0
      ? (monthTotal /
          budget.monthly) *
        100
      : 0;

  const budgetColor =
    budgetPct >= 100
      ? 'var(--coral)'
      : budgetPct >= 80
        ? 'var(--accent)'
        : 'var(--mint)';

  if (expenses.length === 0) {
    return (
      <EmptyState
        title="Your wallet is still keeping secrets."
        body="Add your first expense and let's see where your money disappears."
        onAdd={onAdd}
      />
    );
  }

  return (
    <div>
      <div
        style={{
          display:'flex',
          justifyContent:'space-between',
          alignItems:'flex-start',
          gap:14,
          marginBottom:26,
          flexWrap:'wrap'
        }}
      >
        <div>
          <div
            className="sp-eyebrow"
            style={{ marginBottom:6 }}
          >
            Hey! Here's where your money went
          </div>

          <div className="sp-hero-num">
            {fmtINR(monthTotal)}

            <span
              style={{
                fontSize:16,
                color:'var(--text-muted)',
                fontWeight:500,
                marginLeft:8
              }}
            >
              spent this month
            </span>
          </div>
        </div>

        {streak > 0 && (
          <div
            className="sp-badge"
            style={{
              background:'var(--coral-soft)',
              color:'var(--coral)'
            }}
          >
            <Flame size={14} />
            {streak}-day streak
          </div>
        )}
      </div>

      <div
        className="sp-grid4"
        style={{ marginBottom:22 }}
      >
        <StatCard
          label="Today"
          value={fmtINR(todayTotal)}
        />

        <StatCard
          label="This week"
          value={fmtINR(weekTotal)}
        />

        <StatCard
          label="Budget left"
          value={fmtINR(
            Math.max(
              budget.monthly -
              monthTotal,
              0
            )
          )}
          sub={`${Math.round(
            budgetPct
          )}% used`}
          accent={budgetColor}
        />

        <StatCard
          label="Transactions"
          value={monthExpenses.length}
          sub={`avg ${fmtINR(
            avgDaily
          )}/day`}
        />
      </div>

      <div
        className="sp-grid2"
        style={{
          marginBottom:22,
          alignItems:'stretch'
        }}
      >
        <div className="sp-card">
          <div
            className="sp-h2"
            style={{ marginBottom:16 }}
          >
            Last 14 days
          </div>

          <ResponsiveContainer
            width="100%"
            height={180}
          >
            <AreaChart
              data={last14}
              margin={{
                left:-20,
                right:6,
                top:6
              }}
            >
              <defs>
                <linearGradient
                  id="spGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#F5A623"
                    stopOpacity={0.45}
                  />

                  <stop
                    offset="100%"
                    stopColor="#F5A623"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="label"
                tick={{
                  fill:'#5d6178',
                  fontSize:10
                }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />

              <YAxis
                tick={{
                  fill:'#5d6178',
                  fontSize:10
                }}
                axisLine={false}
                tickLine={false}
                width={36}
              />

              <CartesianGrid
                vertical={false}
                stroke="#2a2e4050"
              />

              <Tooltip
                contentStyle={{
                  background:'#1a1d29',
                  border:'1px solid #2a2e40',
                  borderRadius:10,
                  fontSize:12
                }}
                formatter={v =>
                  fmtINR(v)
                }
                labelStyle={{
                  color:'#9195a8'
                }}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#F5A623"
                strokeWidth={2}
                fill="url(#spGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="sp-card">
          <div
            className="sp-h2"
            style={{ marginBottom:16 }}
          >
            Top categories
          </div>

          <div
            style={{
              display:'flex',
              alignItems:'center',
              gap:18
            }}
          >
            <ResponsiveContainer
              width={120}
              height={120}
            >
              <PieChart>
                <Pie
                  data={catBreakdown}
                  dataKey="value"
                  innerRadius={38}
                  outerRadius={58}
                  paddingAngle={2}
                  stroke="none"
                >
                  {catBreakdown.map(
                    (c,i) => (
                      <Cell
                        key={i}
                        fill={c.color}
                      />
                    )
                  )}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div
              style={{
                flex:1,
                display:'flex',
                flexDirection:'column',
                gap:8,
                minWidth:0
              }}
            >
              {catBreakdown
                .slice(0,4)
                .map(c => (
                  <div
                    key={c.id}
                    style={{
                      display:'flex',
                      alignItems:'center',
                      gap:8,
                      fontSize:12.5
                    }}
                  >
                    <div
                      style={{
                        width:8,
                        height:8,
                        borderRadius:2,
                        background:c.color,
                        flexShrink:0
                      }}
                    />

                    <span
                      style={{
                        color:'var(--text-muted)',
                        flex:1,
                        overflow:'hidden',
                        textOverflow:'ellipsis',
                        whiteSpace:'nowrap'
                      }}
                    >
                      {c.name}
                    </span>

                    <span
                      className="sp-mono"
                      style={{ fontWeight:600 }}
                    >
                      {fmtINR(c.value)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {topCat && highestDay && (
        <div
          className="sp-grid3"
          style={{ marginBottom:22 }}
        >
          <div
            className="sp-card"
            style={{ padding:16 }}
          >
            <div className="sp-eyebrow">
              Highest spending day
            </div>

            <div
              className="sp-mono"
              style={{
                fontSize:17,
                fontWeight:700,
                marginTop:6
              }}
            >
              {fmtINR(highestDay.val)}
            </div>
          </div>

          <div
            className="sp-card"
            style={{ padding:16 }}
          >
            <div className="sp-eyebrow">
              Most-used category
            </div>

            <div
              style={{
                fontSize:15,
                fontWeight:600,
                marginTop:6,
                display:'flex',
                alignItems:'center',
                gap:8
              }}
            >
              <CatIcon
                cat={catMap[topCat]}
                size={13}
                box={22}
              />

              {catMap[topCat]?.name}
            </div>
          </div>

          <div
            className="sp-card"
            style={{ padding:16 }}
          >
            <div className="sp-eyebrow">
              Avg. daily spend
            </div>

            <div
              className="sp-mono"
              style={{
                fontSize:17,
                fontWeight:700,
                marginTop:6
              }}
            >
              {fmtINR(avgDaily)}
            </div>
          </div>
        </div>
      )}

      <div className="sp-card">
        <div
          style={{
            display:'flex',
            justifyContent:'space-between',
            alignItems:'center',
            marginBottom:6
          }}
        >
          <div className="sp-h2">
            Recent transactions
          </div>
        </div>

        {recent.map(e => {
          const cat =
            catMap[e.category] ||
            catMap.other;

          return (
            <div
              key={e.id}
              className="sp-receipt-row"
            >
              <CatIcon cat={cat} />

              <div
                style={{
                  flex:1,
                  minWidth:0
                }}
              >
                <div
                  style={{
                    fontSize:14,
                    fontWeight:500
                  }}
                >
                  {e.title}
                </div>

                <div
                  style={{
                    fontSize:12,
                    color:'var(--text-dim)'
                  }}
                >
                  {cat.name} ·{' '}
                  {fmtShortDate(e.date)}
                </div>
              </div>

              <div className="sp-receipt-amt">
                {fmtINR(e.amount)}
              </div>

              <div className="sp-receipt-actions">
                <button
                  className="sp-icon-btn"
                  onClick={() =>
                    onEdit(e)
                  }
                >
                  <Edit2 size={14} />
                </button>

                <button
                  className="sp-icon-btn"
                  onClick={() =>
                    onDelete(e)
                  }
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Transactions                                                        */
/* ------------------------------------------------------------------ */

function groupLabel(date, now) {
  const d = new Date(date);

  if (isSameDay(d, now))
    return 'Today';

  const yest =
    addDays(now, -1);

  if (isSameDay(d, yest))
    return 'Yesterday';

  const ws =
    startOfWeek(now);

  if (d >= ws)
    return 'Earlier this week';

  const lastWeekStart =
    addDays(ws, -7);

  if (d >= lastWeekStart)
    return 'Last week';

  const ms =
    startOfMonth(now);

  if (d >= ms)
    return 'Earlier this month';

  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function Transactions({
  expenses,
  allCategories,
  catMap,
  onEdit,
  onDelete,
  onAdd
}) {
  const [search, setSearch] =
    useState('');

  const [catFilter, setCatFilter] =
    useState('all');

  const [sortBy, setSortBy] =
    useState('date_desc');

  const now = new Date();

  const filtered = useMemo(() => {
    let list = expenses.filter(e => {
      if (
        catFilter !== 'all' &&
        e.category !== catFilter
      ) {
        return false;
      }

      if (search) {
        const q =
          search.toLowerCase();

        if (
          !(
            e.title
              .toLowerCase()
              .includes(q) ||
            (e.notes || '')
              .toLowerCase()
              .includes(q)
          )
        ) {
          return false;
        }
      }

      return true;
    });

    list = [...list].sort(
      (a,b) => {
        if (
          sortBy === 'date_desc'
        )
          return (
            new Date(b.date) -
            new Date(a.date)
          );

        if (
          sortBy === 'date_asc'
        )
          return (
            new Date(a.date) -
            new Date(b.date)
          );

        if (
          sortBy === 'amount_desc'
        )
          return b.amount - a.amount;

        if (
          sortBy === 'amount_asc'
        )
          return a.amount - b.amount;

        return 0;
      }
    );

    return list;
  }, [
    expenses,
    search,
    catFilter,
    sortBy
  ]);

  const groups = useMemo(() => {
    const m = {};
    const order = [];

    filtered.forEach(e => {
      const label =
        sortBy.startsWith('date')
          ? groupLabel(
              e.date,
              now
            )
          : 'All';

      if (!m[label]) {
        m[label] = [];
        order.push(label);
      }

      m[label].push(e);
    });

    return order.map(label => ({
      label,
      items:m[label]
    }));
  }, [
    filtered,
    sortBy
  ]);

  return (
    <div>
      <div
        style={{
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
          marginBottom:20,
          flexWrap:'wrap',
          gap:12
        }}
      >
        <div className="sp-h1">
          Transactions
        </div>

        <button
          className="sp-btn sp-btn-primary sp-btn-sm"
          onClick={onAdd}
        >
          <Plus size={15} />
          Add
        </button>
      </div>

      <div
        className="sp-card"
        style={{
          marginBottom:18,
          padding:16
        }}
      >
        <div
          style={{
            position:'relative',
            marginBottom:12
          }}
        >
          <Search
            size={16}
            style={{
              position:'absolute',
              left:13,
              top:'50%',
              transform:'translateY(-50%)',
              color:'var(--text-dim)'
            }}
          />

          <input
            className="sp-input"
            style={{ paddingLeft:38 }}
            placeholder="Search title or notes…"
            value={search}
            onChange={e =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div
          className="sp-tabs"
          style={{ marginBottom:12 }}
        >
          <button
            className={`sp-chip ${
              catFilter === 'all'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setCatFilter('all')
            }
          >
            All
          </button>

          {allCategories.map(c => (
            <button
              key={c.id}
              className={`sp-chip ${
                catFilter === c.id
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                setCatFilter(c.id)
              }
            >
              {c.name}
            </button>
          ))}
        </div>

        <select
          className="sp-select"
          style={{ width:'auto' }}
          value={sortBy}
          onChange={e =>
            setSortBy(e.target.value)
          }
        >
          <option value="date_desc">
            Newest first
          </option>

          <option value="date_asc">
            Oldest first
          </option>

          <option value="amount_desc">
            Amount: high to low
          </option>

          <option value="amount_asc">
            Amount: low to high
          </option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No matching transactions"
          body="Try a different search or clear your filters."
        />
      ) : (
        <div className="sp-card">
          {groups.map(g => (
            <div
              key={g.label}
              className="sp-receipt-group"
            >
              <div className="sp-receipt-label">
                {g.label}
              </div>

              {g.items.map(e => {
                const cat =
                  catMap[e.category] ||
                  catMap.other;

                return (
                  <div
                    key={e.id}
                    className="sp-receipt-row"
                  >
                    <CatIcon cat={cat} />

                    <div
                      style={{
                        flex:1,
                        minWidth:0
                      }}
                    >
                      <div
                        style={{
                          fontSize:14,
                          fontWeight:500
                        }}
                      >
                        {e.title}
                      </div>

                      <div
                        style={{
                          fontSize:12,
                          color:'var(--text-dim)'
                        }}
                      >
                        {cat.name} ·{' '}
                        {fmtShortDate(e.date)},
                        {' '}
                        {fmtTime(e.date)}
                      </div>
                    </div>

                    <div className="sp-receipt-amt">
                      {fmtINR(e.amount)}
                    </div>

                    <div className="sp-receipt-actions">
                      <button
                        className="sp-icon-btn"
                        onClick={() =>
                          onEdit(e)
                        }
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        className="sp-icon-btn"
                        onClick={() =>
                          onDelete(e)
                        }
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Analytics                                                           */
/* ------------------------------------------------------------------ */

const RANGES = [
  {
    id:'7d',
    label:'7 days',
    days:7
  },
  {
    id:'30d',
    label:'30 days',
    days:30
  },
  {
    id:'3m',
    label:'3 months',
    days:90
  },
  {
    id:'6m',
    label:'6 months',
    days:182
  },
  {
    id:'1y',
    label:'1 year',
    days:365
  },
];

function buildInsights(
  expenses,
  catMap
) {
  const insights = [];

  if (expenses.length < 4)
    return insights;

  const now = new Date();

  const ws =
    startOfWeek(now);

  const lastWs =
    addDays(ws, -7);

  const thisWeek =
    expenses
      .filter(
        e =>
          new Date(e.date) >= ws
      )
      .reduce(
        (s,e) => s + e.amount,
        0
      );

  const lastWeek =
    expenses
      .filter(e => {
        const d =
          new Date(e.date);

        return (
          d >= lastWs &&
          d < ws
        );
      })
      .reduce(
        (s,e) => s + e.amount,
        0
      );

  if (lastWeek > 0) {
    const diff = Math.round(
      ((thisWeek - lastWeek) /
        lastWeek) *
        100
    );

    if (Math.abs(diff) >= 3) {
      insights.push({
        icon:
          diff > 0
            ? ArrowUpRight
            : ArrowDownRight,
        text:
          `You've spent ${Math.abs(diff)}% ${
            diff > 0
              ? 'more'
              : 'less'
          } this week than last week.`
      });
    }
  }

  const ms =
    startOfMonth(now);

  const monthExpenses =
    expenses.filter(
      e =>
        new Date(e.date) >= ms
    );

  const catTotals = {};

  monthExpenses.forEach(e => {
    catTotals[e.category] =
      (catTotals[e.category] || 0) +
      e.amount;
  });

  const catEntries =
    Object.entries(catTotals)
      .sort(
        (a,b) => b[1] - a[1]
      );

  if (catEntries.length) {
    const [topId] =
      catEntries[0];

    insights.push({
      icon:Sparkles,
      text:
        `${catMap[topId]?.name || 'That category'} is your biggest expense this month.`
    });
  }

  const weekdayTotals = {};
  const weekdayCounts = {};

  expenses.forEach(e => {
    const wd =
      new Date(e.date).getDay();

    weekdayTotals[wd] =
      (weekdayTotals[wd] || 0) +
      e.amount;

    weekdayCounts[wd] =
      (weekdayCounts[wd] || 0) +
      1;
  });

  let bestWd = null;
  let bestAvg = -1;

  Object.keys(weekdayTotals)
    .forEach(wd => {
      const avg =
        weekdayTotals[wd] /
        weekdayCounts[wd];

      if (avg > bestAvg) {
        bestAvg = avg;
        bestWd = wd;
      }
    });

  if (bestWd !== null) {
    insights.push({
      icon:TrendingUp,
      text:
        `${WEEKDAYS[bestWd]} is usually your most expensive day.`
    });
  }

  const daysElapsed =
    now.getDate();

  const monthTotal =
    monthExpenses.reduce(
      (s,e) => s + e.amount,
      0
    );

  insights.push({
    icon:Target,
    text:
      `Your average daily spending is ${fmtINR(
        monthTotal / daysElapsed
      )}.`
  });

  return insights;
}

function Analytics({
  expenses,
  allCategories,
  catMap
}) {
  const [range, setRange] =
    useState('30d');

  const rangeDef =
    RANGES.find(
      r => r.id === range
    );

  const now = new Date();

  const cutoff =
    addDays(
      now,
      -rangeDef.days
    );

  const rangeExpenses =
    useMemo(
      () =>
        expenses.filter(
          e =>
            new Date(e.date) >=
            cutoff
        ),
      [expenses, cutoff]
    );

  const rangeTotal =
    rangeExpenses.reduce(
      (s,e) => s + e.amount,
      0
    );

  const bucketed =
    useMemo(() => {
      const bucketDays =
        rangeDef.days <= 31
          ? 1
          : rangeDef.days <= 182
            ? 7
            : 30;

      const buckets = [];

      let cursor =
        new Date(cutoff);

      while (cursor <= now) {
        const bucketEnd =
          addDays(
            cursor,
            bucketDays
          );

        const total =
          rangeExpenses
            .filter(e => {
              const d =
                new Date(e.date);

              return (
                d >= cursor &&
                d < bucketEnd
              );
            })
            .reduce(
              (s,e) =>
                s + e.amount,
              0
            );

        buckets.push({
          label:
            fmtShortDate(cursor),
          value:
            Math.round(total)
        });

        cursor = bucketEnd;
      }

      return buckets;
    }, [
      rangeExpenses,
      rangeDef,
      cutoff
    ]);

  const catBreakdown =
    useMemo(() => {
      const m = {};

      rangeExpenses.forEach(e => {
        m[e.category] =
          (m[e.category] || 0) +
          e.amount;
      });

      return Object.entries(m)
        .map(
          ([id,value]) => ({
            id,
            value,
            ...catMap[id]
          })
        )
        .sort(
          (a,b) =>
            b.value - a.value
        );
    }, [
      rangeExpenses,
      catMap
    ]);

  const todayTotal =
    expenses
      .filter(e =>
        isSameDay(
          e.date,
          now
        )
      )
      .reduce(
        (s,e) => s + e.amount,
        0
      );

  const weekTotal =
    expenses
      .filter(
        e =>
          new Date(e.date) >=
          startOfWeek(now)
      )
      .reduce(
        (s,e) => s + e.amount,
        0
      );

  const monthTotal =
    expenses
      .filter(
        e =>
          new Date(e.date) >=
          startOfMonth(now)
      )
      .reduce(
        (s,e) => s + e.amount,
        0
      );

  const yearTotal =
    expenses
      .filter(
        e =>
          new Date(e.date)
            .getFullYear() ===
          now.getFullYear()
      )
      .reduce(
        (s,e) => s + e.amount,
        0
      );

  const mostExpensiveTxn =
    useMemo(
      () =>
        rangeExpenses.reduce(
          (m,e) =>
            e.amount >
            (m?.amount || 0)
              ? e
              : m,
          null
        ),
      [rangeExpenses]
    );

  const avgTxn =
    rangeExpenses.length
      ? rangeTotal /
        rangeExpenses.length
      : 0;

  const avgDaily =
    rangeTotal /
    rangeDef.days;

  const weekdayTotals =
    useMemo(() => {
      const totals =
        Array(7).fill(0);

      const counts =
        Array(7).fill(0);

      rangeExpenses.forEach(e => {
        const wd =
          new Date(e.date)
            .getDay();

        totals[wd] +=
          e.amount;

        counts[wd]++;
      });

      return totals.map(
        (t,i) => ({
          wd:i,
          avg:
            counts[i]
              ? t / counts[i]
              : 0,
          total:t
        })
      );
    }, [rangeExpenses]);

  const mostDay =
    weekdayTotals.reduce(
      (m,c) =>
        c.total >
        (m?.total || -1)
          ? c
          : m,
      null
    );

  const leastDay =
    weekdayTotals
      .filter(
        d => d.total > 0
      )
      .reduce(
        (m,c) =>
          m === null ||
          c.total < m.total
            ? c
            : m,
        null
      );

  const topFreqCat =
    useMemo(() => {
      const counts = {};

      rangeExpenses.forEach(e => {
        counts[e.category] =
          (counts[e.category] || 0) +
          1;
      });

      let best = null;
      let bestVal = -1;

      Object.entries(counts)
        .forEach(([k,v]) => {
          if (v > bestVal) {
            bestVal = v;
            best = k;
          }
        });

      return best
        ? catMap[best]
        : null;
    }, [
      rangeExpenses,
      catMap
    ]);

  const insights =
    useMemo(
      () =>
        buildInsights(
          expenses,
          catMap
        ),
      [expenses, catMap]
    );

  if (expenses.length === 0) {
    return (
      <EmptyState
        title="Nothing to analyze yet"
        body="Once you log a few expenses, insights about your spending will show up here."
      />
    );
  }

  return (
    <div>
      <div
        className="sp-h1"
        style={{ marginBottom:20 }}
      >
        Insights
      </div>

      <div
        className="sp-grid4"
        style={{ marginBottom:22 }}
      >
        <StatCard
          label="Today"
          value={fmtINR(todayTotal)}
        />

        <StatCard
          label="This week"
          value={fmtINR(weekTotal)}
        />

        <StatCard
          label="This month"
          value={fmtINR(monthTotal)}
        />

        <StatCard
          label="This year"
          value={fmtINR(yearTotal)}
        />
      </div>

      <div
        className="sp-tabs"
        style={{ marginBottom:18 }}
      >
        {RANGES.map(r => (
          <button
            key={r.id}
            className={`sp-chip ${
              range === r.id
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setRange(r.id)
            }
          >
            {r.label}
          </button>
        ))}
      </div>

      <div
        className="sp-grid2"
        style={{
          marginBottom:22,
          alignItems:'stretch'
        }}
      >
        <div className="sp-card">
          <div
            className="sp-h2"
            style={{ marginBottom:16 }}
          >
            Spending trend
          </div>

          <ResponsiveContainer
            width="100%"
            height={200}
          >
            <BarChart
              data={bucketed}
              margin={{
                left:-20,
                right:6,
                top:6
              }}
            >
              <XAxis
                dataKey="label"
                tick={{
                  fill:'#5d6178',
                  fontSize:10
                }}
                axisLine={false}
                tickLine={false}
                interval={Math.ceil(
                  bucketed.length / 8
                )}
              />

              <YAxis
                tick={{
                  fill:'#5d6178',
                  fontSize:10
                }}
                axisLine={false}
                tickLine={false}
                width={36}
              />

              <CartesianGrid
                vertical={false}
                stroke="#2a2e4050"
              />

              <Tooltip
                contentStyle={{
                  background:'#1a1d29',
                  border:'1px solid #2a2e40',
                  borderRadius:10,
                  fontSize:12
                }}
                formatter={v =>
                  fmtINR(v)
                }
                labelStyle={{
                  color:'#9195a8'
                }}
              />

              <Bar
                dataKey="value"
                fill="#4ECDC4"
                radius={[
                  5,5,0,0
                ]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="sp-card">
          <div
            className="sp-h2"
            style={{ marginBottom:16 }}
          >
            By category
          </div>

          <div
            style={{
              display:'flex',
              alignItems:'center',
              gap:18
            }}
          >
            <ResponsiveContainer
              width={120}
              height={120}
            >
              <PieChart>
                <Pie
                  data={catBreakdown}
                  dataKey="value"
                  innerRadius={38}
                  outerRadius={58}
                  paddingAngle={2}
                  stroke="none"
                >
                  {catBreakdown.map(
                    (c,i) => (
                      <Cell
                        key={i}
                        fill={c.color}
                      />
                    )
                  )}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div
              style={{
                flex:1,
                display:'flex',
                flexDirection:'column',
                gap:7,
                minWidth:0,
                maxHeight:130,
                overflowY:'auto'
              }}
            >
              {catBreakdown.map(c => (
                <div
                  key={c.id}
                  style={{
                    display:'flex',
                    alignItems:'center',
                    gap:8,
                    fontSize:12
                  }}
                >
                  <div
                    style={{
                      width:8,
                      height:8,
                      borderRadius:2,
                      background:c.color,
                      flexShrink:0
                    }}
                  />

                  <span
                    style={{
                      color:'var(--text-muted)',
                      flex:1,
                      overflow:'hidden',
                      textOverflow:'ellipsis',
                      whiteSpace:'nowrap'
                    }}
                  >
                    {c.name}
                  </span>

                  <span
                    className="sp-mono"
                    style={{ fontWeight:600 }}
                  >
                    {fmtINR(c.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="sp-grid3"
        style={{ marginBottom:22 }}
      >
        <div
          className="sp-card"
          style={{ padding:16 }}
        >
          <div className="sp-eyebrow">
            Most expensive transaction
          </div>

          <div
            className="sp-mono"
            style={{
              fontSize:17,
              fontWeight:700,
              marginTop:6
            }}
          >
            {mostExpensiveTxn
              ? fmtINR(
                  mostExpensiveTxn.amount
                )
              : '—'}
          </div>

          <div
            style={{
              fontSize:12,
              color:'var(--text-dim)',
              marginTop:3
            }}
          >
            {mostExpensiveTxn?.title}
          </div>
        </div>

        <div
          className="sp-card"
          style={{ padding:16 }}
        >
          <div className="sp-eyebrow">
            Average transaction
          </div>

          <div
            className="sp-mono"
            style={{
              fontSize:17,
              fontWeight:700,
              marginTop:6
            }}
          >
            {fmtINR(avgTxn)}
          </div>
        </div>

        <div
          className="sp-card"
          style={{ padding:16 }}
        >
          <div className="sp-eyebrow">
            Average daily spend
          </div>

          <div
            className="sp-mono"
            style={{
              fontSize:17,
              fontWeight:700,
              marginTop:6
            }}
          >
            {fmtINR(avgDaily)}
          </div>
        </div>

        <div
          className="sp-card"
          style={{ padding:16 }}
        >
          <div className="sp-eyebrow">
            Highest-spend day
          </div>

          <div
            style={{
              fontSize:15,
              fontWeight:600,
              marginTop:6
            }}
          >
            {mostDay
              ? WEEKDAYS[mostDay.wd]
              : '—'}
          </div>
        </div>

        <div
          className="sp-card"
          style={{ padding:16 }}
        >
          <div className="sp-eyebrow">
            Lowest-spend day
          </div>

          <div
            style={{
              fontSize:15,
              fontWeight:600,
              marginTop:6
            }}
          >
            {leastDay
              ? WEEKDAYS[leastDay.wd]
              : '—'}
          </div>
        </div>

        <div
          className="sp-card"
          style={{ padding:16 }}
        >
          <div className="sp-eyebrow">
            Most frequent category
          </div>

          <div
            style={{
              fontSize:15,
              fontWeight:600,
              marginTop:6,
              display:'flex',
              alignItems:'center',
              gap:8
            }}
          >
            {topFreqCat && (
              <CatIcon
                cat={topFreqCat}
                size={13}
                box={22}
              />
            )}

            {topFreqCat?.name || '—'}
          </div>
        </div>
      </div>

      {insights.length > 0 && (
        <div className="sp-card">
          <div
            className="sp-h2"
            style={{ marginBottom:4 }}
          >
            Auto-generated observations
          </div>

          {insights.map(
            (ins,i) => {
              const Icon =
                ins.icon;

              return (
                <div
                  key={i}
                  className="sp-insight"
                >
                  <div className="sp-insight-icon">
                    <Icon size={15} />
                  </div>

                  <div
                    style={{
                      fontSize:13.5,
                      color:'var(--text)',
                      paddingTop:5
                    }}
                  >
                    {ins.text}
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Budget                                                              */
/* ------------------------------------------------------------------ */

function budgetMessage(
  pct,
  remaining
) {
  if (pct >= 100)
    return `You've crossed your monthly budget by ${fmtINR(
      Math.abs(remaining)
    )}. Maybe it's mess food for the rest of the month.`;

  if (pct >= 80)
    return `You're at ${Math.round(
      pct
    )}% of your monthly budget. Maybe go easy on those late-night Swiggy orders.`;

  if (pct >= 50)
    return `You're at ${Math.round(
      pct
    )}% of your monthly budget. Steady pace, keep an eye on it.`;

  return `You're comfortably within budget. Nice pace this month.`;
}

function Budget({
  expenses,
  allCategories,
  catMap,
  budget,
  onSave
}) {
  const [monthly, setMonthly] =
    useState(
      budget.monthly || 0
    );

  const [catLimits, setCatLimits] =
    useState(
      budget.categories || {}
    );

  const now = new Date();

  const monthExpenses =
    expenses.filter(
      e =>
        new Date(e.date) >=
        startOfMonth(now)
    );

  const monthTotal =
    monthExpenses.reduce(
      (s,e) => s + e.amount,
      0
    );

  const daysElapsed =
    now.getDate();

  const dim =
    daysInMonth(now);

  const projected =
    (monthTotal /
      daysElapsed) *
    dim;

  const pct =
    monthly > 0
      ? (monthTotal /
          monthly) *
        100
      : 0;

  const remaining =
    monthly - monthTotal;

  const barColor =
    pct >= 100
      ? 'var(--coral)'
      : pct >= 80
        ? 'var(--accent)'
        : 'var(--mint)';

  const catSpend =
    useMemo(() => {
      const m = {};

      monthExpenses.forEach(e => {
        m[e.category] =
          (m[e.category] || 0) +
          e.amount;
      });

      return m;
    }, [monthExpenses]);

  const save = () =>
    onSave({
      monthly:
        parseFloat(monthly) || 0,
      categories:catLimits
    });

  return (
    <div>
      <div
        className="sp-h1"
        style={{ marginBottom:20 }}
      >
        Budget
      </div>

      <div
        className="sp-card"
        style={{ marginBottom:22 }}
      >
        <div
          className="sp-grid2"
          style={{
            marginBottom:20,
            alignItems:'end'
          }}
        >
          <div>
            <label className="sp-label">
              Monthly spending limit
            </label>

            <input
              className="sp-input sp-mono"
              type="number"
              value={monthly}
              onChange={e =>
                setMonthly(
                  e.target.value
                )
              }
              onBlur={save}
            />
          </div>

          <button
            className="sp-btn sp-btn-primary"
            onClick={save}
          >
            Save budget
          </button>
        </div>

        <ProgressBar
          pct={pct}
          color={barColor}
        />

        <div
          style={{
            display:'flex',
            justifyContent:'space-between',
            marginTop:10,
            fontSize:12.5,
            color:'var(--text-muted)'
          }}
        >
          <span className="sp-mono">
            {fmtINR(monthTotal)}
            {' '}spent
          </span>

          <span className="sp-mono">
            {fmtINR(
              Math.max(
                remaining,
                0
              )
            )}
            {' '}left
          </span>
        </div>

        <div
          style={{
            fontSize:13.5,
            marginTop:16,
            padding:'12px 14px',
            background:'var(--bg)',
            borderRadius:12,
            border:'1px solid var(--border-soft)',
            lineHeight:1.5
          }}
        >
          {budgetMessage(
            pct,
            remaining
          )}
        </div>

        <div
          className="sp-grid2"
          style={{ marginTop:16 }}
        >
          <div>
            <div className="sp-eyebrow">
              Projected month-end
            </div>

            <div
              className="sp-mono"
              style={{
                fontSize:16,
                fontWeight:700,
                marginTop:5
              }}
            >
              {fmtINR(projected)}
            </div>
          </div>

          <div>
            <div className="sp-eyebrow">
              % of budget used
            </div>

            <div
              className="sp-mono"
              style={{
                fontSize:16,
                fontWeight:700,
                marginTop:5
              }}
            >
              {Math.round(pct)}%
            </div>
          </div>
        </div>
      </div>

      <div className="sp-card">
        <div
          className="sp-h2"
          style={{ marginBottom:16 }}
        >
          Category limits (optional)
        </div>

        {allCategories.map(cat => {
          const limit =
            catLimits[cat.id] || 0;

          const spent =
            catSpend[cat.id] || 0;

          const cpct =
            limit > 0
              ? (spent / limit) *
                100
              : 0;

          return (
            <div
              key={cat.id}
              style={{
                display:'flex',
                alignItems:'center',
                gap:12,
                padding:'11px 0',
                borderBottom:
                  '1px solid var(--border-soft)'
              }}
            >
              <CatIcon
                cat={cat}
                box={30}
                size={15}
              />

              <div
                style={{
                  flex:1,
                  minWidth:0
                }}
              >
                <div
                  style={{
                    fontSize:13.5,
                    fontWeight:500,
                    marginBottom:6
                  }}
                >
                  {cat.name}
                </div>

                {limit > 0 && (
                  <ProgressBar
                    pct={cpct}
                    color={
                      cpct >= 100
                        ? 'var(--coral)'
                        : cat.color
                    }
                  />
                )}
              </div>

              <input
                className="sp-input sp-mono"
                style={{
                  width:90,
                  padding:'7px 9px',
                  fontSize:13
                }}
                type="number"
                placeholder="—"
                value={
                  catLimits[cat.id] ||
                  ''
                }
                onChange={e =>
                  setCatLimits(
                    prev => ({
                      ...prev,
                      [cat.id]:
                        parseFloat(
                          e.target.value
                        ) || 0
                    })
                  )
                }
                onBlur={save}
              />

              <span
                className="sp-mono"
                style={{
                  fontSize:12,
                  color:'var(--text-dim)',
                  width:64,
                  textAlign:'right'
                }}
              >
                {fmtINR(spent)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

function SettingsView({
  expenses,
  onImport,
  onReset,
  isSample,
  onDismissSample,
  userEmail,
  onSignOut,
  syncState
}) {
  const fileRef =
    useRef(null);

  const exportCSV = () => {
    const rows =
      expenses.map(e => ({
        Date:
          new Date(
            e.date
          ).toISOString(),
        Amount:e.amount,
        Category:e.category,
        Title:e.title,
        Notes:e.notes,
      }));

    const csv =
      Papa.unparse(rows);

    const blob =
      new Blob(
        [csv],
        {
          type:
            'text/csv;charset=utf-8;'
        }
      );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement('a');

    a.href = url;

    a.download =
      `stash-export-${dkey(
        new Date()
      ).replace(/,/g,'-')}.csv`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  const handleImport = e => {
    const file =
      e.target.files[0];

    if (!file) return;

    Papa.parse(
      file,
      {
        header:true,
        skipEmptyLines:true,

        complete:res => {
          const imported =
            res.data
              .map(row => ({
                id:uid(),
                amount:
                  parseFloat(
                    row.Amount
                  ) || 0,
                category:
                  (
                    row.Category ||
                    'other'
                  ).toLowerCase(),
                title:
                  row.Title ||
                  'Imported expense',
                date:
                  row.Date
                    ? new Date(
                        row.Date
                      ).toISOString()
                    : new Date()
                        .toISOString(),
                notes:
                  row.Notes ||
                  '',
              }))
              .filter(
                r =>
                  r.amount > 0
              );

          onImport(imported);
        }
      }
    );

    e.target.value = '';
  };

  return (
    <div>
      <div
        className="sp-h1"
        style={{ marginBottom:20 }}
      >
        Settings
      </div>

      {isSample && (
        <div
          className="sp-card"
          style={{
            marginBottom:18,
            borderColor:'var(--accent)'
          }}
        >
          <div
            style={{
              display:'flex',
              gap:12,
              alignItems:'flex-start'
            }}
          >
            <Sparkles
              size={18}
              color="var(--accent)"
              style={{
                flexShrink:0,
                marginTop:2
              }}
            />

            <div style={{ flex:1 }}>
              <div
                style={{
                  fontWeight:600,
                  fontSize:14
                }}
              >
                You're viewing sample data
              </div>

              <div
                style={{
                  fontSize:13,
                  color:'var(--text-muted)',
                  marginTop:4,
                  lineHeight:1.5
                }}
              >
                These are example expenses so the app doesn't look empty. Clear them anytime and start fresh with your own spending.
              </div>

              <button
                className="sp-btn sp-btn-ghost sp-btn-sm"
                style={{ marginTop:10 }}
                onClick={
                  onDismissSample
                }
              >
                Clear sample data
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="sp-card"
        style={{ marginBottom:18 }}
      >
        <div className="sp-h2">
          Currency
        </div>

        <div
          style={{
            fontSize:13.5,
            color:'var(--text-muted)',
            marginTop:8
          }}
        >
          ₹ Indian Rupee (default)
        </div>
      </div>

      <div
        className="sp-card"
        style={{ marginBottom:18 }}
      >
        <div
          className="sp-h2"
          style={{ marginBottom:14 }}
        >
          Your data
        </div>

        <div
          style={{
            display:'flex',
            gap:10,
            flexWrap:'wrap'
          }}
        >
          <button
            className="sp-btn sp-btn-ghost"
            onClick={exportCSV}
          >
            <Download size={15} />
            Export as CSV
          </button>

          <button
            className="sp-btn sp-btn-ghost"
            onClick={() =>
              fileRef.current?.click()
            }
          >
            <Upload size={15} />
            Import CSV
          </button>

          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            style={{ display:'none' }}
            onChange={
              handleImport
            }
          />
        </div>
      </div>

      <div
        className="sp-card"
        style={{ marginBottom:18 }}
      >
        <div
          className="sp-h2"
          style={{ marginBottom:6 }}
        >
          Reset
        </div>

        <div
          style={{
            fontSize:13,
            color:'var(--text-muted)',
            marginBottom:14
          }}
        >
          Permanently clear every expense, budget and setting.
        </div>

        <button
          className="sp-btn sp-btn-danger"
          onClick={onReset}
        >
          <RotateCcw size={15} />
          Reset all data
        </button>
      </div>

      <div className="sp-card">
        <div
          className="sp-h2"
          style={{ marginBottom:4 }}
        >
          Account
        </div>

        <div
          style={{
            fontSize:13.5,
            color:'var(--text-muted)',
            marginTop:8,
            marginBottom:4
          }}
        >
          Signed in as
        </div>

        <div
          style={{
            fontSize:14,
            fontWeight:600,
            marginBottom:14
          }}
        >
          {userEmail}
        </div>

        <div
          style={{
            display:'flex',
            alignItems:'center',
            gap:8,
            fontSize:12.5,
            color:'var(--text-dim)',
            marginBottom:16
          }}
        >
          {syncState === 'syncing' && (
            <>
              <RefreshCw
                size={13}
                className="sp-spin"
              />
              Syncing…
            </>
          )}

          {syncState === 'synced' && (
            <>
              <Check
                size={13}
                color="var(--mint)"
              />
              Synced across your devices
            </>
          )}

          {syncState === 'offline' && (
            <>
              <CloudOff
                size={13}
                color="var(--coral)"
              />
              Offline — changes saved on this device only
            </>
          )}
        </div>

        <button
          className="sp-btn sp-btn-ghost"
          onClick={onSignOut}
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Nav config                                                          */
/* ------------------------------------------------------------------ */

const NAV = [
  {
    id:'dashboard',
    label:'Dashboard',
    icon:LayoutDashboard
  },
  {
    id:'add',
    label:'Add Expense',
    icon:ListPlus
  },
  {
    id:'transactions',
    label:'Transactions',
    icon:Receipt
  },
  {
    id:'analytics',
    label:'Analytics',
    icon:PieChartIcon
  },
  {
    id:'budget',
    label:'Budget',
    icon:Target
  },
  {
    id:'settings',
    label:'Settings',
    icon:SettingsIcon
  },
];

/* ------------------------------------------------------------------ */
/* Root App                                                            */
/* ------------------------------------------------------------------ */

function StashApp({
  session,
  onSignOut
}) {
  const userId =
    session.user.id;

  const [ready, setReady] =
    useState(false);

  const [data, setData] =
    useState(null);

  const [view, setView] =
    useState('dashboard');

  const [showModal, setShowModal] =
    useState(false);

  const [
    editingExpense,
    setEditingExpense
  ] = useState(null);

  const [
    confirmTarget,
    setConfirmTarget
  ] = useState(null);

  const [toast, setToast] =
    useState(null);

  const [
    syncState,
    setSyncState
  ] = useState('idle');

  const toastTimer =
    useRef(null);

  const lastWrittenJSON =
    useRef(null);

  /* ---- initial load from Supabase ---- */

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const {
          data:row,
          error
        } = await supabase
          .from('stash_data')
          .select('data')
          .eq(
            'user_id',
            userId
          )
          .maybeSingle();

        if (error)
          throw error;

        if (cancelled)
          return;

        if (row && row.data) {
          lastWrittenJSON.current =
            JSON.stringify(
              row.data
            );

          setData({
            budget:{
              monthly:6000,
              categories:{}
            },
            customCategories:[],
            isSample:false,
            ...row.data
          });
        } else {
          const seeded =
            defaultData();

          lastWrittenJSON.current =
            JSON.stringify(
              seeded
            );

          await supabase
            .from('stash_data')
            .upsert({
              user_id:userId,
              data:seeded,
              updated_at:
                new Date()
                  .toISOString()
            });

          setData(seeded);
        }

        setSyncState('synced');
      } catch (e) {
        console.error(
          'Stash: initial load failed',
          e
        );

        if (!cancelled) {
          setData(
            defaultData()
          );

          setSyncState(
            'offline'
          );
        }
      } finally {
        if (!cancelled)
          setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  /* ---- persist to Supabase whenever local data changes ---- */

  useEffect(() => {
    if (!ready || !data)
      return;

    const json =
      JSON.stringify(data);

    if (
      json ===
      lastWrittenJSON.current
    ) {
      return;
    }

    lastWrittenJSON.current =
      json;

    setSyncState('syncing');

    (async () => {
      try {
        const { error } =
          await supabase
            .from('stash_data')
            .upsert({
              user_id:userId,
              data,
              updated_at:
                new Date()
                  .toISOString()
            });

        if (error)
          throw error;

        setSyncState(
          'synced'
        );
      } catch (e) {
        console.error(
          'Stash: save failed',
          e
        );

        setSyncState(
          'offline'
        );
      }
    })();
  }, [
    data,
    ready,
    userId
  ]);

  /* ---- realtime changes ---- */

  useEffect(() => {
    const channel =
      supabase
        .channel(
          `stash_data_${userId}`
        )
        .on(
          'postgres_changes',
          {
            event:'*',
            schema:'public',
            table:'stash_data',
            filter:
              `user_id=eq.${userId}`
          },
          payload => {
            if (
              !payload.new ||
              !payload.new.data
            ) {
              return;
            }

            const incomingJSON =
              JSON.stringify(
                payload.new.data
              );

            if (
              incomingJSON ===
              lastWrittenJSON.current
            ) {
              return;
            }

            lastWrittenJSON.current =
              incomingJSON;

            setData(
              payload.new.data
            );

            setSyncState(
              'synced'
            );
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [userId]);

  const showToast =
    useCallback(msg => {
      setToast(msg);

      clearTimeout(
        toastTimer.current
      );

      toastTimer.current =
        setTimeout(
          () => setToast(null),
          2600
        );
    }, []);

  const allCategories =
    useMemo(() => {
      const custom =
        (
          data?.customCategories ||
          []
        ).map(c => ({
          ...c,
          icon:Tag
        }));

      return [
        ...CATEGORIES,
        ...custom
      ];
    }, [data]);

  const catMap =
    useMemo(() => {
      const m = {};

      allCategories.forEach(c => {
        m[c.id] = c;
      });

      return m;
    }, [allCategories]);

  const streak =
    useMemo(() => {
      if (
        !data ||
        data.expenses.length === 0
      ) {
        return 0;
      }

      const days =
        new Set(
          data.expenses.map(
            e => dkey(e.date)
          )
        );

      let count = 0;

      let cursor =
        new Date();

      if (
        !days.has(
          dkey(cursor)
        )
      ) {
        cursor =
          addDays(
            cursor,
            -1
          );
      }

      while (
        days.has(
          dkey(cursor)
        )
      ) {
        count++;

        cursor =
          addDays(
            cursor,
            -1
          );
      }

      return count;
    }, [data]);

  if (!ready || !data) {
    return (
      <div className="spendly">
        <style>
          {STYLE}
        </style>

        <div
          style={{
            padding:40,
            maxWidth:1180,
            margin:'0 auto'
          }}
        >
          <div
            className="sp-skeleton"
            style={{
              height:60,
              marginBottom:20
            }}
          />

          <div
            className="sp-grid4"
            style={{
              marginBottom:20
            }}
          >
            {[1,2,3,4].map(
              i => (
                <div
                  key={i}
                  className="sp-skeleton"
                  style={{
                    height:90
                  }}
                />
              )
            )}
          </div>

          <div
            className="sp-skeleton"
            style={{
              height:260
            }}
          />
        </div>
      </div>
    );
  }

  const openAdd = () => {
    setEditingExpense(null);
    setShowModal(true);
  };

  const openEdit = exp => {
    setEditingExpense(exp);
    setShowModal(true);
  };

  const saveExpense = exp => {
    setData(d => {
      const exists =
        d.expenses.some(
          e =>
            e.id === exp.id
        );

      const expenses =
        exists
          ? d.expenses.map(
              e =>
                e.id === exp.id
                  ? exp
                  : e
            )
          : [
              exp,
              ...d.expenses
            ];

      return {
        ...d,
        expenses,
        isSample:false
      };
    });

    setShowModal(false);

    showToast(
      editingExpense
        ? 'Expense updated ✓'
        : `Expense added · ${fmtINR(
            exp.amount
          )}`
    );

    setEditingExpense(
      null
    );
  };

  const requestDelete =
    exp =>
      setConfirmTarget({
        type:'delete',
        payload:exp
      });

  const performDelete =
    () => {
      const exp =
        confirmTarget.payload;

      setData(d => ({
        ...d,
        expenses:
          d.expenses.filter(
            e =>
              e.id !== exp.id
          )
      }));

      setConfirmTarget(null);

      showToast(
        'Expense deleted'
      );
    };

  const addCustomCategory =
    cat => {
      setData(d => ({
        ...d,
        customCategories:[
          ...(d.customCategories ||
            []),
          cat
        ]
      }));
    };

  const saveBudget =
    budget =>
      setData(d => ({
        ...d,
        budget
      }));

  const handleImport =
    imported => {
      setData(d => ({
        ...d,
        expenses:[
          ...imported,
          ...d.expenses
        ],
        isSample:false
      }));

      showToast(
        `Imported ${imported.length} expense${
          imported.length === 1
            ? ''
            : 's'
        }`
      );
    };

  const requestReset =
    () =>
      setConfirmTarget({
        type:'reset'
      });

  const performReset =
    () => {
      setData({
        expenses:[],
        isSample:false,
        budget:{
          monthly:6000,
          categories:{}
        },
        customCategories:[]
      });

      setConfirmTarget(null);

      setView(
        'dashboard'
      );

      showToast(
        'All data cleared'
      );
    };

  const dismissSample =
    () => {
      setData(d => ({
        ...d,
        expenses:[],
        isSample:false
      }));

      showToast(
        'Sample data cleared'
      );
    };

  const NavButton = ({
    item,
    mobile
  }) => {
    const Icon =
      item.icon;

    const active =
      view === item.id;

    if (item.id === 'add') {
      return mobile ? (
        <button
          key={item.id}
          className={
            active
              ? 'active'
              : ''
          }
          onClick={openAdd}
        >
          <Icon size={19} />
          {item.label.split(' ')[0]}
        </button>
      ) : (
        <button
          key={item.id}
          className="sp-navitem"
          onClick={openAdd}
        >
          <Icon size={17} />
          {item.label}
        </button>
      );
    }

    return mobile ? (
      <button
        key={item.id}
        className={
          active
            ? 'active'
            : ''
        }
        onClick={() =>
          setView(item.id)
        }
      >
        <Icon size={19} />
        {item.label.split(' ')[0]}
      </button>
    ) : (
      <button
        key={item.id}
        className={`sp-navitem ${
          active
            ? 'active'
            : ''
        }`}
        onClick={() =>
          setView(item.id)
        }
      >
        <Icon size={17} />
        {item.label}
      </button>
    );
  };

  return (
    <div className="spendly">
      <style>
        {STYLE}
      </style>

      <div className="sp-shell">
        <aside className="sp-sidebar">
          <div className="sp-brand">
            <div className="sp-brand-mark">
              S
            </div>

            <div className="sp-brand-name">
              Stash
            </div>
          </div>

          {NAV.map(
            item => (
              <NavButton
                key={item.id}
                item={item}
              />
            )
          )}
        </aside>

        <main className="sp-main">
          {view === 'dashboard' && (
            <Dashboard
              expenses={
                data.expenses
              }
              allCategories={
                allCategories
              }
              budget={
                data.budget
              }
              streak={streak}
              onAdd={openAdd}
              onEdit={openEdit}
              onDelete={
                requestDelete
              }
              catMap={catMap}
            />
          )}

          {view === 'transactions' && (
            <Transactions
              expenses={
                data.expenses
              }
              allCategories={
                allCategories
              }
              catMap={catMap}
              onEdit={openEdit}
              onDelete={
                requestDelete
              }
              onAdd={openAdd}
            />
          )}

          {view === 'analytics' && (
            <Analytics
              expenses={
                data.expenses
              }
              allCategories={
                allCategories
              }
              catMap={catMap}
            />
          )}

          {view === 'budget' && (
            <Budget
              expenses={
                data.expenses
              }
              allCategories={
                allCategories
              }
              catMap={catMap}
              budget={
                data.budget
              }
              onSave={saveBudget}
            />
          )}

          {view === 'settings' && (
            <SettingsView
              expenses={
                data.expenses
              }
              onImport={
                handleImport
              }
              onReset={
                requestReset
              }
              isSample={
                data.isSample
              }
              onDismissSample={
                dismissSample
              }
              userEmail={
                session.user.email
              }
              onSignOut={
                onSignOut
              }
              syncState={
                syncState
              }
            />
          )}
        </main>
      </div>

      <button
        className="sp-fab"
        onClick={openAdd}
        aria-label="Add expense"
      >
        <Plus size={24} />
      </button>

      <nav className="sp-bottomnav">
        {NAV
          .filter(
            n => n.id !== 'add'
          )
          .slice(0,3)
          .map(item => (
            <NavButton
              key={item.id}
              item={item}
              mobile
            />
          ))}

        <div />

        {NAV
          .filter(
            n => n.id !== 'add'
          )
          .slice(3)
          .map(item => (
            <NavButton
              key={item.id}
              item={item}
              mobile
            />
          ))}
      </nav>

      {showModal && (
        <ExpenseModal
          editing={
            editingExpense
          }
          allCategories={
            allCategories
          }
          onSave={
            saveExpense
          }
          onClose={() => {
            setShowModal(false);
            setEditingExpense(
              null
            );
          }}
          onAddCustomCategory={
            addCustomCategory
          }
        />
      )}

      {confirmTarget?.type ===
        'delete' && (
        <ConfirmDialog
          title="Delete this expense?"
          body={`"${confirmTarget.payload.title}" · ${fmtINR(
            confirmTarget.payload.amount
          )} will be permanently removed.`}
          confirmLabel="Delete"
          onConfirm={
            performDelete
          }
          onCancel={() =>
            setConfirmTarget(null)
          }
        />
      )}

      {confirmTarget?.type ===
        'reset' && (
        <ConfirmDialog
          title="Reset all data?"
          body="This clears every expense, your budget and settings. This can't be undone."
          confirmLabel="Reset everything"
          onConfirm={
            performReset
          }
          onCancel={() =>
            setConfirmTarget(null)
          }
        />
      )}

      {toast && (
        <div className="sp-toast">
          <Check
            size={15}
            color="var(--mint)"
          />
          {toast}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Auth gate — Google OAuth sign in                                   */
/* ------------------------------------------------------------------ */

function AuthGate() {
  const [error, setError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const signInWithGoogle =
    async () => {
      setLoading(true);
      setError('');

      const { error } =
        await supabase.auth.signInWithOAuth({
          provider:'google',
          options:{
            redirectTo:
              window.location.origin
          }
        });

      if (error) {
        setError(
          error.message
        );

        setLoading(false);
      }
    };

  return (
    <div className="spendly">
      <style>
        {STYLE}
      </style>

      <div className="sp-auth-wrap">
        <div className="sp-card sp-auth-card">

          <div
            className="sp-brand"
            style={{
              padding:'0 0 22px'
            }}
          >
            <div className="sp-brand-mark">
              S
            </div>

            <div className="sp-brand-name">
              Stash
            </div>
          </div>

          <div
            className="sp-h2"
            style={{ marginBottom:6 }}
          >
            Sign in to Stash
          </div>

          <div
            style={{
              fontSize:13.5,
              color:'var(--text-muted)',
              marginBottom:20,
              lineHeight:1.5
            }}
          >
            Sign in with your Google account to sync your expenses across your devices.
          </div>

          {error && (
            <div
              style={{
                fontSize:12.5,
                color:'var(--coral)',
                marginBottom:14,
                lineHeight:1.5
              }}
            >
              {error}
            </div>
          )}

          <button
            className="sp-google-btn"
            onClick={
              signInWithGoogle
            }
            disabled={loading}
          >
            <span className="sp-google-icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.69 2.91-4.18 2.91-7.21z"
                />

                <path
                  fill="#34A853"
                  d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.52A9.74 9.74 0 0 0 12 21.5z"
                />

                <path
                  fill="#FBBC05"
                  d="M6.54 13.59A5.86 5.86 0 0 1 6.23 12c0-.55.1-1.09.31-1.59V7.89H3.29A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.06 1.04 4.11l3.25-2.52z"
                />

                <path
                  fill="#EA4335"
                  d="M12 6.38c1.43 0 2.72.49 3.74 1.46l2.8-2.8C16.84 3.45 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.71 5.39l3.25 2.52C7.31 8.1 9.46 6.38 12 6.38z"
                />
              </svg>
            </span>

            {loading
              ? 'Connecting…'
              : 'Continue with Google'}
          </button>

        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Setup needed                                                        */
/* ------------------------------------------------------------------ */

function SetupNeeded() {
  return (
    <div className="spendly">
      <style>
        {STYLE}
      </style>

      <div className="sp-auth-wrap">
        <div className="sp-card sp-auth-card">

          <div
            className="sp-brand"
            style={{
              padding:'0 0 18px'
            }}
          >
            <div className="sp-brand-mark">
              S
            </div>

            <div className="sp-brand-name">
              Stash
            </div>
          </div>

          <div
            className="sp-h2"
            style={{
              marginBottom:10
            }}
          >
            Setup needed
          </div>

          <div
            style={{
              fontSize:13.5,
              color:'var(--text-muted)',
              lineHeight:1.6
            }}
          >
            Stash needs a Supabase project to sync your data. Copy{' '}
            <code className="sp-mono">
              .env.example
            </code>{' '}
            to{' '}
            <code className="sp-mono">
              .env
            </code>
            , fill in your{' '}
            <code className="sp-mono">
              VITE_SUPABASE_URL
            </code>{' '}
            and{' '}
            <code className="sp-mono">
              VITE_SUPABASE_ANON_KEY
            </code>
            , then restart the dev server. Full steps are in{' '}
            <code className="sp-mono">
              README.md
            </code>
            .
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Default export — handles auth/session, then renders StashApp       */
/* ------------------------------------------------------------------ */

export default function App() {
  const [session, setSession] =
    useState(undefined);

  useEffect(() => {
    if (!supabaseConfigured)
      return;

    supabase.auth
      .getSession()
      .then(({ data }) =>
        setSession(
          data.session
        )
      );

    const {
      data:listener
    } =
      supabase.auth.onAuthStateChange(
        (_event, newSession) => {
          setSession(
            newSession
          );
        }
      );

    return () =>
      listener.subscription.unsubscribe();
  }, []);

  if (!supabaseConfigured)
    return <SetupNeeded />;

  if (session === undefined)
    return null;

  if (!session)
    return <AuthGate />;

  const handleSignOut =
    () =>
      supabase.auth.signOut();

  return (
    <StashApp
      session={session}
      onSignOut={
        handleSignOut
      }
    />
  );
}
```
