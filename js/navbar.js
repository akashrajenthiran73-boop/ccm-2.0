// components/navbar.js - Global Theme Button

import { toggleTheme, getThemeIcon } from '../js/theme.js'

function injectThemeButton() {
  // Already irundha skip
  if (document.getElementById('global-theme-toggle')) return
  
  const btn = document.createElement('button')
  btn.id = 'global-theme-toggle'
  btn.className = 'fixed bottom-6 right-6 z-50 text-2xl p-4 rounded-full bg-white dark:bg-gray-800 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-gray-200 dark:border-gray-700'
  btn.textContent = getThemeIcon()
  btn.title = 'Toggle Theme'
  
  btn.onclick = () => {
    btn.textContent = toggleTheme()
  }
  
  
  window.addEventListener('themeChanged', (e) => {
    btn.textContent = e.detail.isDark ? '☀️' : '🌙'
  })
  
  document.body.appendChild(btn)
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectThemeButton)
} else {
  injectThemeButton()
}