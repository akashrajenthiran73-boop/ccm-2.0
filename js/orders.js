import { supabase } from './supabase.js'

const ordersContainer = document.getElementById('orders-container')

async function loadOrders() {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    ordersContainer.innerHTML = '<div class="text-center py-20"><p class="text-red-500 mb-4">Please Login</p><a href="login.html" class="bg-blue-600 text-white px-6 py-2 rounded">Login</a></div>'
    return
  }

  
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      products:product_id(id, title, photos, price, status),
      sellers:seller_id(name, rating)
    `)
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })

  if (error || !orders || orders.length === 0) {
    ordersContainer.innerHTML = '<p class="text-gray-400 text-center py-20"> No Items Found 😅</p>'
    return
  }

  // Check already reviewed
  const reviewedProducts = []
  for (const order of orders) {
    const { data: review } = await supabase
      .from('reviews')
      .select('id')
      .eq('product_id', order.product_id)
      .eq('buyer_id', user.id)
      .single()
    if (review) reviewedProducts.push(order.product_id)
  }

  ordersContainer.innerHTML = orders.map(order => {
    const product = order.products
    const seller = order.sellers
    const hasReviewed = reviewedProducts.includes(order.product_id)
    
    return `
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="flex gap-4 p-4">
          <img src="${product.photos?.[0] || 'https://via.placeholder.com/150'}" 
               class="w-32 h-32 object-cover rounded">
          
          <div class="flex-1">
            <h3 class="font-bold text-lg mb-1">${product.title}</h3>
            <p class="text-gray-600 text-sm mb-2">Seller: ${seller.name} ⭐ ${seller.rating || 'No'} rating</p>
            <p class="text-2xl font-bold text-blue-600 mb-2">₹${order.price}</p>
            <p class="text-xs text-gray-400">Purchased on ${new Date(order.created_at).toLocaleDateString('en-IN')}</p>
          </div>

          <div class="flex flex-col gap-2 justify-center">
            ${hasReviewed ? `
              <div class="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-center">
                <p class="text-green-800 font-semibold text-sm">✓ Reviewed</p>
              </div>
            ` : `
              <button onclick="openReviewModal('${order.product_id}', '${order.seller_id}')"
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold">
                ⭐ Rate Now
              </button>
            `}
            <a href="product.html?id=${order.product_id}" 
               class="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 text-sm text-center">
              View Product
            </a>
          </div>
        </div>
      </div>
    `
  }).join('')
}

// Review Modal Function
window.openReviewModal = async (productId, sellerId) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const rating = prompt('Please Rating 1-5:')
  if (!rating || rating < 1 || rating > 5) {
    alert('Enter 1 to 5')
    return
  }

  const reviewText = prompt('Type Review(optional):')

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
    alert('Review posted⭐')
    loadOrders() // Refresh
  }
}

// Init
loadOrders()