// js/cart.js - Cart Management Engine (Module 07)
import { supabase, getCurrentUser } from './supabase.js'

const LOCAL_CART_KEY = 'ccm_shopping_cart'

/**
 * Get all cart items
 */
export async function getCart() {
  const user = await getCurrentUser()
  if (user) {
    try {
      const { data, error } = await supabase
        .from('carts')
        .select('*, products(*)')
        .eq('user_id', user.id)
      if (!error && data) {
        return data.map(item => ({
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity || 1,
          product: item.products
        }))
      }
    } catch (e) {}
  }
  // Fallback to local storage
  return JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || '[]')
}

/**
 * Add a product to cart
 */
export async function addToCart(product, quantity = 1) {
  const user = await getCurrentUser()
  if (user && (user.id === product.user_id || user.id === product.seller_id)) {
    alert('⚠️ You cannot add your own product listing to your cart.')
    return false
  }
  if (user) {
    try {
      const { data: existing } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single()

      if (existing) {
        await supabase
          .from('carts')
          .update({ quantity: (existing.quantity || 1) + quantity })
          .eq('id', existing.id)
      } else {
        await supabase.from('carts').insert({
          user_id: user.id,
          product_id: product.id,
          quantity: quantity
        })
      }
    } catch (e) {
      saveToLocalCart(product, quantity)
    }
  } else {
    saveToLocalCart(product, quantity)
  }

  window.dispatchEvent(new CustomEvent('cartUpdated'))
  return true
}

function saveToLocalCart(product, quantity) {
  const cart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || '[]')
  const idx = cart.findIndex(item => item.product_id === product.id)
  if (idx > -1) {
    cart[idx].quantity += quantity
  } else {
    cart.push({
      id: 'local_' + Date.now(),
      product_id: product.id,
      quantity,
      product
    })
  }
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart))
}

/**
 * Remove item from cart
 */
export async function removeFromCart(productId) {
  const user = await getCurrentUser()
  if (user) {
    try {
      await supabase
        .from('carts')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
    } catch (e) {}
  }
  const cart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || '[]')
  const filtered = cart.filter(item => item.product_id !== productId)
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(filtered))
  window.dispatchEvent(new CustomEvent('cartUpdated'))
}

/**
 * Update quantity
 */
export async function updateCartQuantity(productId, quantity) {
  if (quantity <= 0) return removeFromCart(productId)
  const user = await getCurrentUser()
  if (user) {
    try {
      await supabase
        .from('carts')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId)
    } catch (e) {}
  }
  const cart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || '[]')
  const idx = cart.findIndex(item => item.product_id === productId)
  if (idx > -1) {
    cart[idx].quantity = quantity
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart))
  }
  window.dispatchEvent(new CustomEvent('cartUpdated'))
}

/**
 * Clear the cart
 */
export async function clearCart() {
  const user = await getCurrentUser()
  if (user) {
    try {
      await supabase.from('carts').delete().eq('user_id', user.id)
    } catch (e) {}
  }
  localStorage.removeItem(LOCAL_CART_KEY)
  window.dispatchEvent(new CustomEvent('cartUpdated'))
}

/**
 * Get item count
 */
export async function getCartCount() {
  const items = await getCart()
  return items.reduce((sum, i) => sum + (i.quantity || 1), 0)
}
