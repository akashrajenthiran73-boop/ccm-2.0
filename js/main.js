import { supabase } from './supabase.js'

const productFeed = document.getElementById('product-feed')
const searchInput = document.getElementById('search-input')
const searchBtn = document.getElementById('search-btn')
const categoryFilters = document.getElementById('category-filters')
const nearMeBtn = document.getElementById('near-me-btn')
const minPriceInput = document.getElementById('min-price')
const maxPriceInput = document.getElementById('max-price')

let currentCategory = 'All'
let currentSearch = ''
let userLocation = null

// Infinite scroll variables
let currentPage = 0
const PRODUCTS_PER_PAGE = 12
let isLoading = false
let hasMore = true

// 1. Product Card HTML
function createProductCard(product, wishlistIds = []) {
  const firstPhoto = product.photos?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'
  const timeAgo = new Date(product.created_at).toLocaleDateString('en-IN')
  const isWishlisted = wishlistIds.includes(product.id)

  const isRoot = window.location.pathname === '/' || window.location.pathname.endsWith('index.html')
  const pagesPath = isRoot? 'pages/' : ''

  return `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover-lift animate-scale-in">
      <div class="relative">
        <a href="${pagesPath}product.html?id=${product.id}">
          <img src="${firstPhoto}" alt="${product.title}" class="w-full h-48 object-cover hover-scale">
        </a>
        <button onclick="toggleWishlist('${product.id}', this)"
          class="absolute top-2 right-2 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:scale-110 transition transformer-btn">
        ${isWishlisted
 ? '<svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg>'
    : '<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path></svg>'
  }
</button>
      </div>
      <div class="p-4">
        <a href="${pagesPath}product.html?id=${product.id}">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-lg truncate hover:text-blue-600 dark:hover:text-blue-400 text-gray-900 dark:text-white">${product.title}</h3>
            <span class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">${product.condition}</span>
          </div>
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">₹${product.price}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">${product.description || 'No description'}</p>
          <div class="flex justify-between items-center text-xs text-gray-400 dark:text-gray-500 mb-3">
            <span>${product.category}</span>
            <span>${timeAgo}</span>
          </div>
        </a>

        <div class="flex gap-2">
          <button onclick="openChat('${product.id}', '${product.user_id}')"
            class="flex-1 transformer-btn bmw-hover bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600">
            💬 Chat
          </button>
          <button onclick="placeOrder('${product.id}', '${product.user_id}', ${product.price}, '${product.title.replace(/'/g, "\\'")}')"
            class="flex-1 transformer-btn bmw-hover bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
            Order
          </button>
        </div>
      </div>
    </div>
  `
}

// 2. Products Load Pannu
async function loadProducts(reset = false) {
  if (isLoading ||!hasMore) return
  if (!productFeed) return

  isLoading = true

  if (reset) {
    currentPage = 0
    hasMore = true
    productFeed.innerHTML = ''
  }

  if (currentPage === 0) {
    productFeed.innerHTML = '<div class="col-span-full text-center text-gray-400 dark:text-gray-500 py-10 animate-pulse">Loading...</div>'
  }

  const { data: { user } } = await supabase.auth.getUser()
  let wishlistIds = []

  if (user) {
    const { data: wishlists } = await supabase
 .from('wishlists')
 .select('product_id')
 .eq('user_id', user.id)

    wishlistIds = wishlists?.map(w => w.product_id) || []
  }

  let query = supabase
.from('products')
.select('*, profiles(name, rating)')
.eq('status', 'active')
.order('created_at', { ascending: false })
.range(currentPage * PRODUCTS_PER_PAGE, (currentPage + 1) * PRODUCTS_PER_PAGE - 1)

  if (currentCategory!== 'All') {
    query = query.eq('category', currentCategory)
  }

  if (currentSearch) {
    query = query.ilike('title', `%${currentSearch}%`)
  }

  const minPrice = minPriceInput?.value
  const maxPrice = maxPriceInput?.value

  if (minPrice) {
    query = query.gte('price', minPrice)
  }
  if (maxPrice) {
    query = query.lte('price', maxPrice)
  }

  if (userLocation) {
    query = query.rpc('nearby_products', {
      lat: userLocation.lat,
      lng: userLocation.lng,
      dist_km: 5
    })
  }

  const { data: products, error } = await query

  if (currentPage === 0) {
    productFeed.innerHTML = ''
  }

  const loader = document.getElementById('scroll-loader')
  if (loader) loader.remove()

  if (error) {
    productFeed.innerHTML = `<div class="col-span-full text-center text-red-500 py-10">Error: ${error.message}</div>`
    isLoading = false
    return
  }

  if (!products || products.length === 0) {
    if (currentPage === 0) {
      productFeed.innerHTML = '<div class="col-span-full text-center text-gray-400 dark:text-gray-500 py-10 animate-fade-in">No products found😔</div>'
    }
    hasMore = false
    isLoading = false
    return
  }

  productFeed.innerHTML += products.map(p => createProductCard(p, wishlistIds)).join('')

  if (products.length < PRODUCTS_PER_PAGE) {
    hasMore = false
  } else {
    currentPage++
    productFeed.innerHTML += `
      <div id="scroll-loader" class="col-span-full text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    `
  }

  isLoading = false
}

// 3. Infinite Scroll Observer
function setupInfiniteScroll() {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting &&!isLoading && hasMore) {
      loadProducts()
    }
  }, { threshold: 0.1, rootMargin: '200px' })

  const attachObserver = () => {
    const loader = document.getElementById('scroll-loader')
    if (loader) {
      observer.observe(loader)
    }
  }

  setInterval(attachObserver, 500)
}

function resetAndLoad() {
  currentPage = 0
  hasMore = true
  loadProducts(true)
}

// 4. Event Listeners
searchBtn?.addEventListener('click', () => {
  currentSearch = searchInput.value.trim()
  userLocation = null
  if (nearMeBtn) {
    nearMeBtn.className = 'px-4 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm whitespace-nowrap hover:bg-gray-300 dark:hover:bg-gray-600 bmw-hover'
    nearMeBtn.textContent = '📍 Near Me 5km'
  }
  resetAndLoad()
})

searchInput?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchBtn?.click()
})

minPriceInput?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchBtn?.click()
})

maxPriceInput?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchBtn?.click()
})

categoryFilters?.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON' && e.target.dataset.category) {
    currentCategory = e.target.dataset.category
    userLocation = null
    if (nearMeBtn) {
      nearMeBtn.className = 'px-4 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm whitespace-nowrap hover:bg-gray-300 dark:hover:bg-gray-600 bmw-hover'
      nearMeBtn.textContent = '📍 Near Me 5km'
    }

    categoryFilters.querySelectorAll('button').forEach(btn => {
      btn.className = 'px-4 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600 bmw-hover'
    })
    e.target.className = 'px-4 py-1 bg-blue-600 text-white rounded-full text-sm bmw-hover'

    resetAndLoad()
  }
})

nearMeBtn?.addEventListener('click', () => {
  if (navigator.geolocation) {
    nearMeBtn.textContent = 'Getting location...'
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        nearMeBtn.textContent = '📍 Near Me 5km ✓'
        nearMeBtn.className = 'px-4 py-1 bg-green-600 text-white rounded-full text-sm bmw-hover'
        resetAndLoad()
      },
      () => {
        alert('Allow to Location access')
        nearMeBtn.textContent = '📍 Near Me 5km'
      }
    )
  }
})

// 5. Chat Open Function
window.openChat = async (productId, sellerId) => {
  const { data: { user } } = await supabase.auth.getUser()

  const isRoot = window.location.pathname === '/' || window.location.pathname.endsWith('index.html')
  const pagesPath = isRoot? 'pages/' : ''

  if (!user) {
    alert('please login before chat')
    window.location.href = `${pagesPath}login.html`
    return
  }
  if (user.id === sellerId) {
    alert('dont chat your self 😂')
    return
  }
  window.location.href = `${pagesPath}chat.html?product=${productId}&seller=${sellerId}`
}

// 6. Wishlist Toggle Function
window.toggleWishlist = async (productId, btnElement) => {
  const { data: { user } } = await supabase.auth.getUser()

  const isRoot = window.location.pathname === '/' || window.location.pathname.endsWith('index.html')
  const pagesPath = isRoot? 'pages/' : ''

  if (!user) {
    alert('Please login before add wishlist')
    window.location.href = `${pagesPath}login.html`
    return
  }

  const { data: existing } = await supabase
.from('wishlists')
.select('id')
.eq('user_id', user.id)
.eq('product_id', productId)
.single()

  if (existing) {
    await supabase.from('wishlists').delete().eq('id', existing.id)
    btnElement.innerHTML = '<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path></svg>'
  } else {
    await supabase.from('wishlists').insert({ user_id: user.id, product_id: productId })
    btnElement.innerHTML = '<svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg>'
  }
}

// Init
document.addEventListener('DOMContentLoaded', async () => {
  loadProducts()
  setupInfiniteScroll()
})