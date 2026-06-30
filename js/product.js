import { supabase } from './supabase.js'

const productContainer = document.getElementById('product-container')
const similarContainer = document.getElementById('similar-products')

// URL la irunthu product ID edukkurom
const urlParams = new URLSearchParams(window.location.search)
const productId = urlParams.get('id')

// 1. Product Details Load Pannu
async function loadProduct() {
  if (!productId) {
    productContainer.innerHTML = '<div class="text-center text-red-500 dark:text-red-400 py-20 animate-shake">Product not found da 😔</div>'
    return
  }

  // Product + Seller details fetch pannu - views_count um serthu
  const { data: product, error } = await supabase
.from('products')
.select('*, profiles(id, name, rating, created_at, phone)')
.eq('id', productId)
.single()

  if (error ||!product) {
    productContainer.innerHTML = '<div class="text-center text-red-500 dark:text-red-400 py-20 animate-shake">Product not found da 😔</div>'
    return
  }

  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === product.user_id

  // Wishlist check pannu
  let isWishlisted = false
  if (user) {
    const { data: wishlist } = await supabase
.from('wishlists')
.select('id')
.eq('user_id', user.id)
.eq('product_id', productId)
.single()
    isWishlisted =!!wishlist
  }

  const firstPhoto = product.photos?.[0] || 'https://via.placeholder.com/600x400?text=No+Image'
  const timeAgoText = timeAgo(new Date(product.created_at))
  const sellerJoined = new Date(product.profiles.created_at).getFullYear()

  productContainer.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover-lift animate-scale-in transition-colors">
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Images -->
        <div class="p-6">
          <img src="${firstPhoto}" alt="${product.title}" class="w-full h-96 object-cover rounded-lg hover-scale cursor-pointer">
          ${product.photos?.length > 1? `
            <div class="flex gap-2 mt-4 overflow-x-auto">
              ${product.photos.map((photo, i) => `
                <img src="${photo}" class="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-75 hover-scale animate-scale-in"
                     style="animation-delay: ${i * 0.1}s"
                     onclick="document.querySelector('#product-container img[alt=\\"${product.title}\\"]').src='${photo}'">
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Details -->
        <div class="p-6 animate-fade-up">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h1 class="text-3xl font-bold mb-2 text-gray-900 dark:text-white">${product.title}</h1>
              <span class="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded">${product.condition}</span>
            </div>
            ${!isOwner? `
              <button onclick="toggleWishlist('${product.id}', this)"
                class="transformer-btn p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                ${isWishlisted
          ? '<svg class="w-6 h-6 text-red-500 fill-current" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/></svg>'
                  : '<svg class="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 0 00-6.364L12 7.636l-1.318a4.5 4.5 0 00-6.364 0z"/></svg>'
                }
              </button>
            ` : ''}
          </div>

          <p class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">₹${product.price}</p>

          <!-- VIEWS + TIME -->
          <div class="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm mb-6">
            <span class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>${product.views_count || 0}</span> views
            </span>
            <span class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>${timeAgoText}</span>
            </span>
          </div>

          <div class="mb-6">
            <h3 class="font-semibold mb-2 text-gray-900 dark:text-white">Description</h3>
            <p class="text-gray-600 dark:text-gray-300">${product.description || 'No description provided'}</p>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <span class="text-gray-500 dark:text-gray-400">Category:</span>
              <p class="font-semibold text-gray-900 dark:text-white">${product.category}</p>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Condition:</span>
              <p class="font-semibold text-gray-900 dark:text-white">${product.condition}</p>
            </div>
          </div>

          <!-- Seller Info -->
          <div class="border-t dark:border-gray-700 pt-6 mb-6">
            <h3 class="font-semibold mb-3 text-gray-900 dark:text-white">Seller Information</h3>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xl font-bold text-blue-600 dark:text-blue-300">
                ${product.profiles.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">${product.profiles.name}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  ⭐ ${product.profiles.rating || 'No'} rating • Member since ${sellerJoined}
                </p>
              </div>
            </div>
          </div>

         <!-- Action Buttons -->
${!isOwner? `
  ${product.status === 'sold'? `
    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center animate-scale-in">
      <p class="text-red-800 dark:text-red-300 font-bold text-lg">❌ SOLD OUT</p>
    </div>
  ` : `
    <button onclick="openChat('${product.id}', '${product.user_id}')"
      class="transformer-btn bmw-hover w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition mb-3">
      💬 Chat with Seller
    </button>
    ${product.profiles.phone? `
      <a href="tel:${product.profiles.phone}"
        class="transformer-btn bmw-hover block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 active:scale-95 transition text-center">
        📞 Call Seller
      </a>
    ` : ''}
  `}
` : `
  <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center mb-4 animate-scale-in">
    <p class="text-yellow-800 dark:text-yellow-300 font-semibold">This is your product da</p>
  </div>
  ${product.status === 'active'? `
    <button onclick="markAsSold('${product.id}')"
      class="transformer-btn bmw-hover w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 active:scale-95 transition">
      ✅ Mark as Sold
    </button>
  ` : `
    <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center animate-scale-in">
      <p class="text-green-800 dark:text-green-300 font-bold">✓ Marked as Sold</p>
    </div>
  `}
`}
        </div>
      </div>

      <!-- REVIEWS SECTION - PUTHUSU DA -->
      <div class="border-t dark:border-gray-700 p-6 animate-fade-up">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-xl text-gray-900 dark:text-white">Reviews & Ratings</h3>
          ${!isOwner && product.status === 'sold'? `
            <button onclick="openReviewModal('${product.id}', '${product.user_id}')"
              class="transformer-btn bmw-hover bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 active:scale-95 transition">
              ⭐ Write a Review
            </button>
          ` : ''}
        </div>
        <div id="reviews-list">
          <p class="text-gray-400 dark:text-gray-500 text-center py-8 animate-pulse">Loading reviews...</p>
        </div>
      </div>
    </div>
  `

  // VIEW COUNT PANNANUM DA
  trackProductView(productId)

  // Reviews load pannu
  loadReviews(productId)

  // Similar products load pannu
  loadSimilarProducts(product.category, product.id)
}

// 2. Similar Products Load Pannu
async function loadSimilarProducts(category, currentId) {
  const { data: products } = await supabase
.from('products')
.select('*')
.eq('category', category)
.eq('status', 'active')
.neq('id', currentId)
.limit(4)

  if (!products || products.length === 0) {
    similarContainer.innerHTML = '<p class="text-gray-400 dark:text-gray-500 col-span-full animate-fade-in">No similar products found</p>'
    return
  }

  similarContainer.innerHTML = products.map((p, i) => `
    <a href="product.html?id=${p.id}" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover-lift animate-scale-in transition-colors" style="animation-delay: ${i * 0.1}s">
      <img src="${p.photos?.[0] || 'https://via.placeholder.com/300x200'}" class="w-full h-40 object-cover hover-scale">
      <div class="p-3">
        <h3 class="font-semibold truncate text-gray-900 dark:text-white">${p.title}</h3>
        <p class="text-blue-600 dark:text-blue-400 font-bold">₹${p.price}</p>
      </div>
    </a>
  `).join('')
}

// 3. VIEW TRACK FUNCTION
async function trackProductView(productId) {
  const { data: { user } } = await supabase.auth.getUser()

  let ipAddress = null
  try {
    const res = await fetch('https://api.ipify.org?format=json')
    const ipData = await res.json()
    ipAddress = ipData.ip
  } catch (e) {
    console.log('IP fetch failed, still counting')
  }

  await supabase.rpc('increment_product_view', {
    p_product_id: productId,
    p_user_id: user?.id || null,
    p_ip: ipAddress
  })
}

// 4. LOAD REVIEWS - PUTHUSU DA
async function loadReviews(productId) {
  const reviewsList = document.getElementById('reviews-list')

  const { data: reviews, error } = await supabase
.from('reviews')
.select('*, profiles:buyer_id(name)')
.eq('product_id', productId)
.order('created_at', { ascending: false })

  if (error ||!reviews || reviews.length === 0) {
    reviewsList.innerHTML = '<p class="text-gray-400 dark:text-gray-500 text-center py-8 animate-fade-in">No reviews yet. Be the first!</p>'
    return
  }

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)

  reviewsList.innerHTML = `
    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 text-center animate-scale-in">
      <p class="text-4xl font-bold text-blue-600 dark:text-blue-400">${avgRating}</p>
      <div class="flex justify-center gap-1 my-2">
        ${[1,2,3,4,5].map(star => `
          <svg class="w-6 h-6 ${star <= Math.round(avgRating)? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        `).join('')}
      </div>
      <p class="text-gray-600 dark:text-gray-400">${reviews.length} review${reviews.length > 1? 's' : ''}</p>
    </div>

    <div class="space-y-4">
      ${reviews.map((review, i) => `
        <div class="border-b dark:border-gray-700 pb-4 animate-fade-in" style="animation-delay: ${i * 0.1}s">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="font-semibold text-gray-900 dark:text-white">${review.profiles.name}</p>
              <div class="flex gap-1 mt-1">
                ${[1,2,3,4,5].map(star => `
                  <svg class="w-4 h-4 ${star <= review.rating? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                `).join('')}
              </div>
            </div>
            <span class="text-xs text-gray-400 dark:text-gray-500">${timeAgo(new Date(review.created_at))}</span>
          </div>
          ${review.review_text? `<p class="text-gray-600 dark:text-gray-300 text-sm">${review.review_text}</p>` : ''}
        </div>
      `).join('')}
    </div>
  `
}

// 5. REVIEW MODAL OPEN - PUTHUSU DA
window.openReviewModal = async (productId, sellerId) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    alert('Login pannitu review podu da')
    window.location.href = 'login.html'
    return
  }

  // Already review pottutaana check pannu
  const { data: existing } = await supabase
.from('reviews')
.select('id')
.eq('product_id', productId)
.eq('buyer_id', user.id)
.single()

  if (existing) {
    alert('Nee already review pottuta da 😅')
    return
  }

  // Simple prompt la rating ketpom
  const rating = prompt('Rating kudu da 1-5:')
  if (!rating || rating < 1 || rating > 5) {
    alert('1 to 5 kulla kudu da')
    return
  }

  const reviewText = prompt('Review type pannu da (optional):')

  const { error } = await supabase
.from('reviews')
.insert({
      product_id: productId,
      seller_id: sellerId,
      buyer_id: user.id,
      rating: parseInt(rating),
      review_text: reviewText || null
    })

  if (error) {
    alert('Error da: ' + error.message)
  } else {
    alert('Review post aaiduchu da ⭐')
    loadReviews(productId) // Refresh reviews
    location.reload() // Seller rating update aaga
  }
}

// 6. TIME AGO FUNCTION
function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000)
  if (seconds < 60) return "Just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return minutes + " mins ago"
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return hours + " hours ago"
  const days = Math.floor(hours / 24)
  if (days < 7) return days + " days ago"
  return date.toLocaleDateString('en-IN')
}

// 7. Chat Open Function
window.openChat = async (productId, sellerId) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    alert('Login pannitu chat pannu da')
    window.location.href = 'login.html'
    return
  }
  window.location.href = `chat.html?product=${productId}&seller=${sellerId}`
}

// 8. Wishlist Toggle
window.toggleWishlist = async (productId, btnElement) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    alert('Login pannitu wishlist add pannu da')
    window.location.href = 'login.html'
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
    btnElement.innerHTML = '<svg class="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 0 00-6.364L12 7.636l-1.318a4.5 0 00-6.364 0z"/></svg>'
  } else {
    await supabase.from('wishlists').insert({ user_id: user.id, product_id: productId })
    btnElement.innerHTML = '<svg class="w-6 h-6 text-red-500 fill-current" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/></svg>'
  }
}
// 9. Mark as Sold Function - UPDATED DA
window.markAsSold = async (productId) => {
  if (!confirm('Sure ah sold nu mark pannavaa da?')) return

  const { data: { user } } = await supabase.auth.getUser()

  // Buyer email kekurom
  const buyerEmail = prompt('Buyer oda email type pannu da:')
  if (!buyerEmail) return

  // Buyer profile fetch
  const { data: buyer, error: buyerError } = await supabase
  .from('profiles')
  .select('id')
  .eq('email', buyerEmail.trim())
  .single()

  if (buyerError ||!buyer) {
    alert('Buyer account kedakala da. Correct email kudu.')
    return
  }

  if (buyer.id === user.id) {
    alert('Unakku nee eh vikka mudiyathu da 😂')
    return
  }

  // Product details eduthuko
  const { data: product } = await supabase
  .from('products')
  .select('price')
  .eq('id', productId)
  .single()

  // 1. Product status update
  const { error: updateError } = await supabase
  .from('products')
  .update({ status: 'sold' })
  .eq('id', productId)

  if (updateError) {
    alert('Error da: ' + updateError.message)
    return
  }

  // 2. Order create pannu
  const { error: orderError } = await supabase
  .from('orders')
  .insert({
      product_id: productId,
      buyer_id: buyer.id,
      seller_id: user.id,
      price: product.price
    })

  if (orderError) {
    alert('Order create aagala da: ' + orderError.message)
    return
  }

  alert('Sold nu mark panniyachu da 🎉 Buyer "My Orders" la paaka mudiyum')
  location.reload()
}

// Init
loadProduct()