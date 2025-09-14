"use strict";

// Simple reactive store with batched re-renders
function createStore(initialState) {
  let state = { ...initialState };
  const subscribers = new Set();
  let notifyScheduled = false;

  function get() {
    return state;
  }

  function set(partial) {
    const next = typeof partial === "function" ? partial(state) : partial;
    state = { ...state, ...next };
    scheduleNotify();
  }

  function subscribe(fn) {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }

  function scheduleNotify() {
    if (notifyScheduled) return;
    notifyScheduled = true;
    Promise.resolve().then(() => {
      notifyScheduled = false;
      subscribers.forEach((fn) => fn(state));
    });
  }

  return { get, set, subscribe };
}

// Utilities
function pad2(n) { return String(n).padStart(2, "0"); }
function formatTime(ms) {
  const d = new Date(ms);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

function getPreferredTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Initial state
const store = createStore({
  nowMs: Date.now(),
  count: 0,
  isAutoIncrementing: false,
  autoIncrementMs: 1000,
  inputText: "",
  quoteIndex: 0,
  theme: (localStorage.getItem('theme') || getPreferredTheme()),
});

// DOM refs
const els = {
  html: document.documentElement,
  clock: document.getElementById("clock"),
  countValue: document.getElementById("countValue"),
  decrementBtn: document.getElementById("decrementBtn"),
  incrementBtn: document.getElementById("incrementBtn"),
  resetBtn: document.getElementById("resetBtn"),
  autoIncToggle: document.getElementById("autoIncToggle"),
  autoIncSpeed: document.getElementById("autoIncSpeed"),
  textInput: document.getElementById("textInput"),
  textPreview: document.getElementById("textPreview"),
  quoteText: document.getElementById("quoteText"),
  quoteAuthor: document.getElementById("quoteAuthor"),
  themeToggle: document.getElementById("themeToggle"),
  renderCount: document.getElementById("renderCount"),
};

// Quotes data
const quotes = [
  { q: "Simplicity is the soul of efficiency.", a: "Austin Freeman" },
  { q: "Programs must be written for people to read.", a: "Harold Abelson" },
  { q: "Premature optimization is the root of all evil.", a: "Donald Knuth" },
  { q: "Move fast and make things.", a: "Facebook mantra (adapted)" },
  { q: "Talk is cheap. Show me the code.", a: "Linus Torvalds" },
];

// Render loop batching with rAF
let framePending = false;
let renderCounter = 0;
function requestRender() {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(() => {
    framePending = false;
    renderAll();
  });
}

function applyTheme(theme) {
  els.html.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
}

function renderAll() {
  const s = store.get();
  applyTheme(s.theme);
  // Clock
  if (els.clock) els.clock.textContent = formatTime(s.nowMs);
  // Counter
  if (els.countValue) els.countValue.textContent = String(s.count);
  if (els.autoIncToggle) els.autoIncToggle.checked = !!s.isAutoIncrementing;
  if (els.autoIncSpeed) els.autoIncSpeed.value = String(s.autoIncrementMs);
  // Input
  if (els.textPreview) els.textPreview.textContent = s.inputText || "(empty)";
  if (els.textInput && els.textInput !== document.activeElement) {
    els.textInput.value = s.inputText;
  }
  // Quotes
  const quote = quotes[s.quoteIndex % quotes.length];
  if (els.quoteText) els.quoteText.textContent = `“${quote.q}”`;
  if (els.quoteAuthor) els.quoteAuthor.textContent = `— ${quote.a}`;
  // Stats
  renderCounter += 1;
  if (els.renderCount) els.renderCount.textContent = String(renderCounter);
}

// Event listeners (attach once)
if (els.incrementBtn) {
  els.incrementBtn.addEventListener('click', () => {
    store.set((s) => ({ count: s.count + 1 }));
  });
}
if (els.decrementBtn) {
  els.decrementBtn.addEventListener('click', () => {
    store.set((s) => ({ count: s.count - 1 }));
  });
}
if (els.resetBtn) {
  els.resetBtn.addEventListener('click', () => {
    store.set({ count: 0 });
  });
}
if (els.autoIncToggle) {
  els.autoIncToggle.addEventListener('change', (e) => {
    const checked = e.target.checked;
    store.set({ isAutoIncrementing: checked });
  });
}
if (els.autoIncSpeed) {
  els.autoIncSpeed.addEventListener('change', (e) => {
    const ms = Number(e.target.value) || 1000;
    store.set({ autoIncrementMs: ms });
  });
}
if (els.textInput) {
  els.textInput.addEventListener('input', (e) => {
    store.set({ inputText: e.target.value });
  });
}
if (els.themeToggle) {
  els.themeToggle.addEventListener('click', () => {
    const curr = store.get().theme;
    const next = curr === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    store.set({ theme: next });
  });
}

// Reactive timers that respond to state
let autoIncTimer = null;
function refreshAutoIncrementTimer(prev, next) {
  const changed = prev.isAutoIncrementing !== next.isAutoIncrementing || prev.autoIncrementMs !== next.autoIncrementMs;
  if (!changed) return;
  if (autoIncTimer) {
    clearInterval(autoIncTimer);
    autoIncTimer = null;
  }
  if (next.isAutoIncrementing) {
    autoIncTimer = setInterval(() => {
      store.set((s) => ({ count: s.count + 1 }));
    }, next.autoIncrementMs);
  }
}

let lastStateForTimers = store.get();
store.subscribe((next) => {
  refreshAutoIncrementTimer(lastStateForTimers, next);
  lastStateForTimers = next;
});

// Ticking clock
setInterval(() => {
  store.set({ nowMs: Date.now() });
}, 1000);

// Rotating quotes every 5 seconds
setInterval(() => {
  store.set((s) => ({ quoteIndex: (s.quoteIndex + 1) % quotes.length }));
}, 5000);

// Apply initial theme immediately and render once
applyTheme(store.get().theme);
renderAll();
// Subscribe to re-render on state changes
store.subscribe(() => requestRender());

