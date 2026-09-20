// js/navbar.js - Universal Responsive Navigation & Bottom Bar
import { supabase, getCurrentUser, isAdmin } from './supabase.js'
import { getMarketplaceMode, setMarketplaceMode, getModeInfo } from './mode.js'
import { getCurrentLanguage, toggleLanguage, t } from './i18n.js'
import { toggleTheme, getThemeIcon } from './theme.js'
import { getCartCount } from './cart.js'

export async function renderUniversalNavbar() {
  const isRoot = window.location.pathname.endsWith('index.html') || 
                 window.location.pathname === '/' || 
                 !window.location.pathname.includes('/pages/')
  const rootPath = isRoot ? './' : '../'
  const pagesPath = isRoot ? 'pages/' : ''

  const user = await getCurrentUser()
  const modeInfo = getModeInfo()
  const userIsAdmin = user ? await isAdmin(user.id) : false
  const cartCount = await getCartCount()
  const currentLang = getCurrentLanguage()

  // 1. Top Navbar HTML
  const navContainer = document.querySelector('nav') || document.createElement('nav')
  navContainer.className = 'bmw-navbar bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors shadow-sm'
  navContainer.style.overflow = 'visible'

  navContainer.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        
        <!-- Left: Brand & Mode Selector -->
        <div class="flex items-center gap-3">
          <a href="${rootPath}index.html" class="flex items-center gap-2 text-xl font-black text-blue-600 dark:text-blue-400">
            <span class="text-2xl">🎓</span>
            <span class="tracking-tight">CCM<span class="text-amber-500">2.0</span></span>
          </a>

          <!-- Marketplace Mode Pill Selector -->
          <div class="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-semibold">
            <button id="nav-mode-college" class="px-3 py-1 rounded-full transition-all flex items-center gap-1 ${modeInfo.mode === 'college' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'}">
              <span>🎓</span> College
            </button>
            <button id="nav-mode-community" class="px-3 py-1 rounded-full transition-all flex items-center gap-1 ${modeInfo.mode === 'community' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600'}">
              <span>🌐</span> Community
            </button>
          </div>
        </div>

        <!-- Center: Quick Nav Links (Desktop) -->
        <div class="hidden md:flex items-center gap-5 text-sm font-medium text-gray-700 dark:text-gray-200">
          <a href="${rootPath}index.html" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</a>
          <a href="${pagesPath}search.html" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Search</a>
          <a href="${pagesPath}nearby.html" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">📍 Nearby Map</a>
          <a href="${pagesPath}deals.html" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">⚡ Deals</a>
          <a href="${pagesPath}auctions.html" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">🔨 Auctions</a>
          <a href="${pagesPath}lost-found.html" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">🔍 Lost & Found</a>
          <a href="${pagesPath}exchange.html" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">🔄 Barter</a>
          <a href="${pagesPath}rentals.html" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">📚 Rent</a>
        </div>

        <!-- Right: Actions & Tools -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Language Toggle Button -->
          <button id="lang-toggle-btn" class="px-2.5 py-1 text-xs font-bold rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition" title="Change Language">
            ${currentLang === 'en' ? 'தமிழ்' : 'English'}
          </button>

          <!-- Theme Toggle Button -->
          <button id="nav-theme-btn" class="p-2 text-lg rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition" title="Toggle Theme">
            ${getThemeIcon()}
          </button>

          <!-- Wishlist Link -->
          <a href="${pagesPath}wishlist.html" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition" title="Wishlist">
            ❤️
          </a>

          <!-- Cart Icon with Badge -->
          <a href="${pagesPath}cart.html" class="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition" title="Shopping Cart">
            🛒
            <span id="nav-cart-badge" class="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ${cartCount > 0 ? '' : 'hidden'}">
              ${cartCount}
            </span>
          </a>

          <!-- Notifications Bell -->
          ${user ? `
            <div class="relative" style="z-index: 999999;">
              <button id="nav-bell-btn" class="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition" title="Notifications">
                🔔
                <span id="nav-notif-badge" class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center hidden">0</span>
              </button>
              <div id="nav-notif-dropdown" class="hidden absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden" style="z-index: 999999;">
                <div class="p-3 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <span class="font-bold text-sm text-gray-800 dark:text-white">Notifications</span>
                  <a href="${pagesPath}notifications.html" class="text-xs text-blue-600 dark:text-blue-400 hover:underline">View All</a>
                </div>
                <div id="nav-notif-list" class="max-h-80 overflow-y-auto text-xs divide-y dark:divide-gray-700">
                  <div class="p-4 text-center text-gray-400">Loading notifications...</div>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- User Menu / Auth Button -->
          ${user ? `
            <div class="relative" style="z-index: 999999;">
              <button id="nav-user-menu-btn" class="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">
                <div class="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  ${(user.email || 'U')[0].toUpperCase()}
                </div>
                <span class="text-xs hidden md:inline font-semibold">${(user.email || '').split('@')[0]}</span>
                <span class="text-[10px]">▼</span>
              </button>
              <div id="nav-user-dropdown" class="hidden absolute right-0 top-12 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 text-xs font-medium text-gray-700 dark:text-gray-200" style="z-index: 999999;">
                <a href="${pagesPath}dashboard.html" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">📊 Dashboard</a>
                <a href="${pagesPath}profile.html" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">👤 Profile & College Info</a>
                <a href="${pagesPath}orders.html" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">📦 My Orders</a>
                <a href="${pagesPath}chats.html" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">💬 My Chats</a>
                <a href="${pagesPath}exchange.html" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">🔄 Barter Requests</a>
                <a href="${pagesPath}rentals.html" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">📚 My Rentals</a>
                <a href="${pagesPath}reports.html" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">🛡️ Safety & Reports</a>
                ${userIsAdmin ? `<a href="${pagesPath}admin.html" class="flex items-center gap-2 px-4 py-2 text-purple-600 dark:text-purple-400 font-bold hover:bg-purple-50 dark:hover:bg-purple-950">⚙️ Admin Dashboard</a>` : ''}
                <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                <button id="nav-logout-btn" class="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950">🚪 Logout</button>
              </div>
            </div>
          ` : `
            <a href="${pagesPath}login.html" class="text-xs font-bold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700">
              Login
            </a>
            <a href="${pagesPath}register.html" class="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 shadow-sm">
              Register
            </a>
          `}

          <!-- + Sell Item Button -->
          <a href="${pagesPath}add-product.html" class="hidden sm:inline-flex items-center gap-1 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-1.5 rounded-lg shadow-sm transition">
            <span>+</span> Sell
          </a>
        </div>
      </div>
    </div>
  `

  // 2. Mobile Bottom Navigation Bar
  let bottomBar = document.getElementById('ccm-mobile-bottom-nav')
  if (!bottomBar) {
    bottomBar = document.createElement('div')
    bottomBar.id = 'ccm-mobile-bottom-nav'
    bottomBar.className = 'md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 flex justify-around items-center py-2 px-2 shadow-lg'
    document.body.appendChild(bottomBar)
  }

  bottomBar.innerHTML = `
    <a href="${rootPath}index.html" class="flex flex-col items-center text-[10px] text-gray-600 dark:text-gray-300 hover:text-blue-600">
      <span class="text-xl">🏠</span>
      <span>Home</span>
    </a>
    <a href="${pagesPath}search.html" class="flex flex-col items-center text-[10px] text-gray-600 dark:text-gray-300 hover:text-blue-600">
      <span class="text-xl">🔎</span>
      <span>Search</span>
    </a>
    <a href="${pagesPath}add-product.html" class="flex flex-col items-center text-[10px] -mt-5">
      <div class="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-2xl shadow-xl">
        +
      </div>
      <span class="font-bold text-blue-600 dark:text-blue-400 mt-0.5">Sell</span>
    </a>
    <a href="${pagesPath}cart.html" class="relative flex flex-col items-center text-[10px] text-gray-600 dark:text-gray-300 hover:text-blue-600">
      <span class="text-xl">🛒</span>
      <span>Cart</span>
      <span class="mobile-cart-badge absolute -top-1 right-2 bg-blue-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center ${cartCount > 0 ? '' : 'hidden'}">${cartCount}</span>
    </a>
    <a href="${user ? pagesPath + 'profile.html' : pagesPath + 'login.html'}" class="flex flex-col items-center text-[10px] text-gray-600 dark:text-gray-300 hover:text-blue-600">
      <span class="text-xl">👤</span>
      <span>${user ? 'Profile' : 'Login'}</span>
    </a>
  `

  // 3. Attach Event Listeners
  // Theme Toggle
  const themeBtn = document.getElementById('nav-theme-btn')
  if (themeBtn) {
    themeBtn.onclick = () => {
      themeBtn.textContent = toggleTheme()
    }
  }

  // Language Toggle
  const langBtn = document.getElementById('lang-toggle-btn')
  if (langBtn) {
    langBtn.onclick = () => {
      const next = toggleLanguage()
      langBtn.textContent = next === 'en' ? 'தமிழ்' : 'English'
    }
  }

  // Mode Switchers
  const collegeBtn = document.getElementById('nav-mode-college')
  const communityBtn = document.getElementById('nav-mode-community')
  if (collegeBtn && communityBtn) {
    collegeBtn.onclick = () => {
      setMarketplaceMode('college')
      window.location.reload()
    }
    communityBtn.onclick = () => {
      setMarketplaceMode('community')
      window.location.reload()
    }
  }

  // User Dropdown
  const userMenuBtn = document.getElementById('nav-user-menu-btn')
  const userDropdown = document.getElementById('nav-user-dropdown')
  if (userMenuBtn && userDropdown) {
    userMenuBtn.onclick = (e) => {
      e.stopPropagation()
      userDropdown.classList.toggle('hidden')
    }
  }

  // Logout Button
  const logoutBtn = document.getElementById('nav-logout-btn')
  if (logoutBtn) {
    logoutBtn.onclick = async () => {
      await supabase.auth.signOut()
      window.location.href = rootPath + 'index.html'
    }
  }

  // Notifications Bell
  const bellBtn = document.getElementById('nav-bell-btn')
  const notifDropdown = document.getElementById('nav-notif-dropdown')
  if (bellBtn && notifDropdown && user) {
    bellBtn.onclick = (e) => {
      e.stopPropagation()
      notifDropdown.classList.toggle('hidden')
      if (!notifDropdown.classList.contains('hidden')) {
        loadNavNotifications(user.id)
      }
    }
    loadNavNotifications(user.id)
  }

  // Click outside close dropdowns
  document.addEventListener('click', () => {
    if (userDropdown) userDropdown.classList.add('hidden')
    if (notifDropdown) notifDropdown.classList.add('hidden')
  })

  // Cart update listener
  window.addEventListener('cartUpdated', async () => {
    const updatedCount = await getCartCount()
    const badge = document.getElementById('nav-cart-badge')
    const mobileBadge = document.querySelector('.mobile-cart-badge')
    if (badge) {
      badge.textContent = updatedCount
      badge.classList.toggle('hidden', updatedCount === 0)
    }
    if (mobileBadge) {
      mobileBadge.textContent = updatedCount
      mobileBadge.classList.toggle('hidden', updatedCount === 0)
    }
  })
}

async function loadNavNotifications(userId) {
  const notifList = document.getElementById('nav-notif-list')
  const notifBadge = document.getElementById('nav-notif-badge')
  if (!notifList) return

  try {
    const { data: notifs } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(6)

    const unread = notifs?.filter(n => !n.is_read).length || 0
    if (notifBadge) {
      notifBadge.textContent = unread
      notifBadge.classList.toggle('hidden', unread === 0)
    }

    if (!notifs || notifs.length === 0) {
      notifList.innerHTML = '<div class="p-4 text-center text-gray-400">No notifications yet</div>'
      return
    }

    notifList.innerHTML = notifs.map(n => `
      <div class="p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer ${!n.is_read ? 'bg-blue-50 dark:bg-blue-950/40' : ''}">
        <p class="text-xs text-gray-800 dark:text-gray-200 font-medium">${n.message}</p>
        <p class="text-[10px] text-gray-400 mt-0.5">${new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    `).join('')
  } catch (e) {
    notifList.innerHTML = '<div class="p-3 text-center text-gray-400">Notifications offline</div>'
  }
}

// Auto render navbar
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderUniversalNavbar)
  } else {
    renderUniversalNavbar()
  }
}