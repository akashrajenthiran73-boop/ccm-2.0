// js/main.js - Enhanced Main Feed with Dual Mode, AI Badges, and Filters
import { supabase, getCurrentUser } from './supabase.js'
import { getMarketplaceMode, isCollegeMode } from './mode.js'
import { analyzePrice, detectScamRisk, rankRecommendations, trackUserActivity } from './ai-smart.js'
import { addToCart } from './cart.js'

const productFeed = document.getElementById('product-feed')
const trendingFeed = document.getElementById('trending-feed')
const searchInput = document.getElementById('search-input')
const searchBtn = document.getElementById('search-btn')
const categoryFilters = document.getElementById('category-filters')
const nearMeBtn = document.getElementById('near-me-btn')
const minPriceInput = document.getElementById('min-price')
const maxPriceInput = document.getElementById('max-price')

let currentCategory = 'All'
let currentSearch = ''
let userLocation = null
let wishlistIds = []

// Fallback sample products for instant zero-error preview if database is fresh
const SAMPLE_PRODUCTS = [
  {
    id: 'sample-1',
    title: 'Engineering Mathematics (Advanced Edition) - Erwin Kreyszig',
    description: 'Crisp condition semester textbook with solved problems and formula cheatsheet.',
    price: 380,
    category: 'Books & Notes',
    condition: 'Like new',
    photos: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop'],
    marketplace_mode: 'college',
    pickup_location: 'Central Library',
    meeting_point: 'Central Library',
    created_at: new Date().toISOString(),
    status: 'available',
    profiles: { name: 'Karthik S', rating: 4.9, is_verified: true }
  },
  {
    id: 'sample-2',
    title: 'Hercules Roadeo Hardliner Geared Cycle (21 Speed)',
    description: 'Smooth riding hostel commute cycle. Dual disc brakes, new tires, free combo lock.',
    price: 3400,
    category: 'Cycles & Vehicles',
    condition: 'Used',
    photos: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop'],
    marketplace_mode: 'both',
    pickup_location: 'Hostel Block 3',
    meeting_point: 'Main Gate',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    status: 'available',
    profiles: { name: 'Priya R', rating: 5.0, is_verified: true }
  },
  {
    id: 'sample-3',
    title: 'Casio fx-991EX Classwiz Scientific Calculator',
    description: 'Essential for engineering exams. Matrix, calculus, quadratic solvers included.',
    price: 650,
    category: 'Lab & Study Equipment',
    condition: 'Like new',
    photos: ['https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=600&auto=format&fit=crop'],
    marketplace_mode: 'college',
    pickup_location: 'ECE Department',
    meeting_point: 'Department Office',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    status: 'available',
    profiles: { name: 'Rahul V', rating: 4.8, is_verified: true }
  },
  {
    id: 'sample-4',
    title: 'Wooden Study Table with Drawer & Ergonomic Chair',
    description: 'Sturdy teak-finish study desk suitable for hostel room or PG flat.',
    price: 1800,
    category: 'Hostel & Room Essentials',
    condition: 'Used',
    photos: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop'],
    marketplace_mode: 'community',
    pickup_location: 'North Campus Gate',
    meeting_point: 'Canteen',
    created_at: new Date(Date.now() - 14400000).toISOString(),
    status: 'available',
    profiles: { name: 'Vimal K', rating: 4.7, is_verified: false }
  },
  {
    id: 'sample-5',
    title: 'Arduino Uno R3 Starter Kit with 30+ Sensors',
    description: 'Complete IoT & robotics kit for mini project. Includes breadboard, jumper wires, ultrasonic.',
    price: 850,
    category: 'Electronics & Laptops',
    condition: 'New',
    photos: ['https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop'],
    marketplace_mode: 'college',
    pickup_location: 'Robotics Lab',
    meeting_point: 'Main Gate',
    created_at: new Date(Date.now() - 28800000).toISOString(),
    status: 'available',
    profiles: { name: 'Sneha M', rating: 5.0, is_verified: true }
  },
  {
    id: 'sample-6',
    title: 'Campus Electric Kettle 1.5L Stainless Steel',
    description: 'Auto-shutoff, fast boiling for late night study sessions, tea, noodles.',
    price: 400,
    category: 'Hostel & Room Essentials',
    condition: 'Like new',
    photos: ['https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop'],
    marketplace_mode: 'both',
    pickup_location: 'Ladies Hostel Gate',
    meeting_point: 'Canteen',
    created_at: new Date(Date.now() - 43200000).toISOString(),
    status: 'available',
    profiles: { name: 'Ananya D', rating: 4.9, is_verified: true }
  }
]

// 1. Create Product Card HTML
export function createProductCard(product, wishlistIds = []) {
  const isRoot = window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || !window.location.pathname.includes('/pages/')
  const pagesPath = isRoot ? 'pages/' : ''

  const firstPhoto = product.photos?.[0] || product.image_url || 'https://via.placeholder.com/400x260?text=No+Image'
  const timeAgo = new Date(product.created_at).toLocaleDateString('en-IN')
  const isWishlisted = wishlistIds.includes(product.id)
  
  // AI Smart analysis
  const priceAnalysis = analyzePrice(product)
  const scamRisk = detectScamRisk(product, product.profiles)

  // Mode badge
  const modeBadge = (product.marketplace_mode === 'college') 
    ? '<span class="text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full">🎓 College</span>'
    : '<span class="text-[10px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">🌐 Community</span>'

  return `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover-lift flex flex-col transition duration-200">
      
      <!-- Top Image & Quick Badges -->
      <div class="relative overflow-hidden group">
        <a href="${pagesPath}product.html?id=${product.id}">
          <img src="${firstPhoto}" alt="${product.title}" 
               class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
               onerror="this.src='https://via.placeholder.com/400x260?text=Campus+Marketplace'">
        </a>
        
        <!-- Wishlist Button -->
        <button onclick="toggleWishlist('${product.id}', this)"
                class="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full shadow hover:scale-110 active:scale-95 transition"
                title="Wishlist">
          ${isWishlisted
            ? '<span class="text-red-500 text-base">❤️</span>'
            : '<span class="text-gray-400 dark:text-gray-300 text-base">🤍</span>'
          }
        </button>

        <!-- Condition & Mode Pill -->
        <div class="absolute bottom-2 left-2 flex gap-1 flex-wrap">
          <span class="text-[10px] bg-black/60 backdrop-blur text-white px-2 py-0.5 rounded-full font-medium">
            ${product.condition || 'Used'}
          </span>
          ${modeBadge}
        </div>
      </div>

      <!-- Card Body -->
      <div class="p-4 flex-1 flex flex-col justify-between">
        <div>
          <!-- AI Badges -->
          <div class="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded ${scamRisk.badgeColor} border">
              ${scamRisk.badge}
            </span>
            <span class="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
              ${priceAnalysis.badge}
            </span>
          </div>

          <!-- Title & Price -->
          <a href="${pagesPath}product.html?id=${product.id}" class="block group">
            <h3 class="font-bold text-base text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              ${product.title}
            </h3>
            <div class="flex items-baseline gap-2 mt-1">
              <span class="text-2xl font-black text-blue-600 dark:text-blue-400">₹${product.price}</span>
              ${product.original_price ? `<span class="text-xs text-gray-400 line-through">₹${product.original_price}</span>` : ''}
            </div>
          </a>

          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2">
            ${product.description || 'Verified campus community item.'}
          </p>

          <!-- Seller info & Meeting Spot -->
          <div class="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-700">
            <span class="truncate max-w-[120px]">
              👤 ${product.profiles?.name || 'Student Seller'} 
              ${product.profiles?.is_verified ? '<span class="text-green-500" title="Verified ID">✓</span>' : ''}
            </span>
            <span class="text-gray-400 truncate">📍 ${product.meeting_point || product.pickup_location || 'Main Gate'}</span>
          </div>
        </div>

        <!-- Action Buttons Grid -->
        <div class="grid grid-cols-2 gap-2 mt-4 pt-2">
          <button onclick="handleAddToCart('${product.id}', this)"
                  class="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 text-xs font-bold py-2 rounded-lg transition flex items-center justify-center gap-1">
            <span>🛒</span> Cart
          </button>
          <a href="${pagesPath}product.html?id=${product.id}"
             class="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition text-center shadow-sm flex items-center justify-center">
            View / Buy
          </a>
        </div>

      </div>
    </div>
  `
}

// 2. Load Products Function
export async function loadProducts() {
  if (!productFeed) return

  productFeed.innerHTML = '<div class="col-span-full text-center text-gray-400 py-12 animate-pulse text-sm">Loading campus listings...</div>'

  const user = await getCurrentUser()
  if (user) {
    try {
      const { data: wishlists } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', user.id)
      wishlistIds = wishlists?.map(w => w.product_id) || []
    } catch (e) {}
  }

  const activeMode = getMarketplaceMode()

  // Query Supabase
  let fetchedProducts = []
  try {
    let query = supabase
      .from('products')
      .select('*, profiles(name, rating, is_verified, phone)')
      .in('status', ['available', 'active'])
      .order('created_at', { ascending: false })
      .limit(30)

    if (activeMode === 'college') {
      query = query.in('marketplace_mode', ['college', 'both'])
    } else {
      query = query.in('marketplace_mode', ['community', 'both'])
    }

    if (currentCategory && currentCategory !== 'All') {
      query = query.eq('category', currentCategory)
    }

    if (currentSearch) {
      query = query.ilike('title', `%${currentSearch}%`)
      trackUserActivity('search', currentSearch)
    }

    const minPrice = minPriceInput?.value
    const maxPrice = maxPriceInput?.value
    if (minPrice) query = query.gte('price', minPrice)
    if (maxPrice) query = query.lte('price', maxPrice)

    const { data, error } = await query
    if (!error && data && data.length > 0) {
      fetchedProducts = data
    }
  } catch (err) {
    console.warn('Supabase query fallback to samples:', err)
  }

  // Combine with sample data if database is fresh or empty
  if (fetchedProducts.length === 0) {
    fetchedProducts = SAMPLE_PRODUCTS.filter(p => {
      if (activeMode === 'college' && p.marketplace_mode === 'community') return false
      if (activeMode === 'community' && p.marketplace_mode === 'college') return false
      if (currentCategory !== 'All' && p.category !== currentCategory) return false
      if (currentSearch && !p.title.toLowerCase().includes(currentSearch.toLowerCase())) return false
      return true
    })
  }

  if (fetchedProducts.length === 0) {
    productFeed.innerHTML = `
      <div class="col-span-full text-center py-16">
        <span class="text-4xl">📦</span>
        <p class="text-gray-500 dark:text-gray-400 font-medium mt-2">No items found in ${activeMode === 'college' ? 'College' : 'Community'} mode.</p>
        <p class="text-xs text-gray-400 mt-1">Try resetting filters or post the first item!</p>
      </div>
    `
    return
  }

  // AI Recommendation ranking
  const ranked = rankRecommendations(fetchedProducts)

  productFeed.innerHTML = ranked.map(p => createProductCard(p, wishlistIds)).join('')
}

// 3. Add to cart window action
window.handleAddToCart = async (productId, btn) => {
  const allProducts = [...SAMPLE_PRODUCTS]
  let product = allProducts.find(p => p.id === productId)
  if (!product) {
    try {
      const { data } = await supabase.from('products').select('*').eq('id', productId).single()
      product = data
    } catch (e) {}
  }
  if (product) {
    await addToCart(product, 1)
    if (btn) {
      const orig = btn.innerHTML
      btn.innerHTML = '<span>✓</span> Added'
      btn.classList.add('text-green-600', 'font-bold')
      setTimeout(() => {
        btn.innerHTML = orig
        btn.classList.remove('text-green-600', 'font-bold')
      }, 1000)
    }
  }
}

// 4. Toggle Wishlist
window.toggleWishlist = async (productId, btn) => {
  const user = await getCurrentUser()
  const isRoot = window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || !window.location.pathname.includes('/pages/')
  const pagesPath = isRoot ? 'pages/' : ''

  if (!user) {
    alert('Please login to save items to your wishlist')
    window.location.href = `${pagesPath}login.html`
    return
  }

  if (wishlistIds.includes(productId)) {
    wishlistIds = wishlistIds.filter(id => id !== productId)
    try {
      await supabase.from('wishlists').delete().eq('user_id', user.id).eq('product_id', productId)
    } catch (e) {}
    btn.innerHTML = '<span class="text-gray-400 text-base">🤍</span>'
  } else {
    wishlistIds.push(productId)
    try {
      await supabase.from('wishlists').insert({ user_id: user.id, product_id: productId })
    } catch (e) {}
    btn.innerHTML = '<span class="text-red-500 text-base">❤️</span>'
  }
}

// 5. Search and filter listeners
searchBtn?.addEventListener('click', () => {
  currentSearch = searchInput?.value.trim() || ''
  loadProducts()
})

searchInput?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    currentSearch = searchInput?.value.trim() || ''
    loadProducts()
  }
})

categoryFilters?.addEventListener('click', (e) => {
  const btn = e.target.closest('button')
  if (btn && btn.dataset.category) {
    currentCategory = btn.dataset.category
    categoryFilters.querySelectorAll('button').forEach(b => {
      b.className = 'px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition'
    })
    btn.className = 'px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-blue-600 text-white shadow-sm transition'
    trackUserActivity('view_category', currentCategory)
    loadProducts()
  }
})

nearMeBtn?.addEventListener('click', () => {
  const isRoot = window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || !window.location.pathname.includes('/pages/')
  const pagesPath = isRoot ? 'pages/' : ''
  window.location.href = `${pagesPath}nearby.html`
})

// Listen to marketplace mode change
window.addEventListener('marketplaceModeChanged', () => {
  loadProducts()
})

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadProducts()
})