// js/mode.js - Central Marketplace Mode Manager
// Dual Modes:
// 🎓 College Marketplace (Verified college students and staff)
// 🌐 Community Marketplace (Nearby public / community users)

const MODE_KEY = 'ccm_marketplace_mode'

export function getMarketplaceMode() {
  const saved = localStorage.getItem(MODE_KEY)
  return (saved === 'community') ? 'community' : 'college'
}

export function setMarketplaceMode(mode) {
  const validMode = (mode === 'community') ? 'community' : 'college'
  localStorage.setItem(MODE_KEY, validMode)
  window.dispatchEvent(new CustomEvent('marketplaceModeChanged', { detail: { mode: validMode } }))
  return validMode
}

export function isCollegeMode() {
  return getMarketplaceMode() === 'college'
}

export function isCommunityMode() {
  return getMarketplaceMode() === 'community'
}

export function getModeInfo() {
  const mode = getMarketplaceMode()
  if (mode === 'college') {
    return {
      mode: 'college',
      title: 'College Marketplace',
      titleTa: 'கல்லூரி சந்தை',
      badge: '🎓 College Only',
      desc: 'Exclusive for verified students & staff',
      themeColor: 'blue',
      icon: '🎓'
    }
  } else {
    return {
      mode: 'community',
      title: 'Community Marketplace',
      titleTa: 'சமூக சந்தை',
      badge: '🌐 Public Community',
      desc: 'Open for campus & nearby residents',
      themeColor: 'emerald',
      icon: '🌐'
    }
  }
}
