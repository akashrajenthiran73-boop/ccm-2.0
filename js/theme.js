// js/theme.js - Global Theme Controller

const html = document.documentElement
const THEME_KEY = 'ccm-theme'

// Page load aana udane theme apply pannum
function applyTheme() {
  const saved = localStorage.getItem(THEME_KEY)
  
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}

// Toggle function - yenga click pannalum full app maarum
export function toggleTheme() {
  html.classList.toggle('dark')
  const isDark = html.classList.contains('dark')
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
  
  // Vera pages ku event anupum
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark } }))
  
  return isDark ? '☀️' : '🌙'
}

// Current icon
export function getThemeIcon() {
  return html.classList.contains('dark') ? '☀️' : '🌙'
}

// Auto run
applyTheme()

// Vere tab la maathina kuda sync aagum
window.addEventListener('storage', (e) => {
  if (e.key === THEME_KEY) applyTheme()
})