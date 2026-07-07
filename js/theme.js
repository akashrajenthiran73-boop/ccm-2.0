// js/theme.js - Global Theme Controller

const html = document.documentElement
const THEME_KEY = 'ccm-theme'


function applyTheme() {
  const saved = localStorage.getItem(THEME_KEY)
  
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}


export function toggleTheme() {
  html.classList.toggle('dark')
  const isDark = html.classList.contains('dark')
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
  
  
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark } }))
  
  return isDark ? '☀️' : '🌙'
}


export function getThemeIcon() {
  return html.classList.contains('dark') ? '☀️' : '🌙'
}


applyTheme()


window.addEventListener('storage', (e) => {
  if (e.key === THEME_KEY) applyTheme()
})