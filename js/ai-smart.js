// js/ai-smart.js - AI-Inspired Smart Features (Module 14)
// Includes:
// 1. AI Product Recommendation Engine
// 2. AI Smart Price Suggestion & Unusual Price Alert
// 3. AI Scam & Fake Listing Detection
// 4. Suspicious Seller & Safe Marketplace Verification

const SEARCH_HISTORY_KEY = 'ccm_ai_search_history'
const VIEW_HISTORY_KEY = 'ccm_ai_view_history'

// Category reference price averages for smart pricing
const CATEGORY_BENCHMARKS = {
  'Books': { min: 100, avg: 350, max: 1200 },
  'Books & Notes': { min: 100, avg: 350, max: 1200 },
  'Cycles': { min: 1500, avg: 3800, max: 10000 },
  'Cycles & Vehicles': { min: 1500, avg: 3800, max: 10000 },
  'Electronics': { min: 500, avg: 8500, max: 55000 },
  'Electronics & Laptops': { min: 1500, avg: 22000, max: 80000 },
  'Mobile & Accessories': { min: 200, avg: 6500, max: 35000 },
  'Hostel Items': { min: 200, avg: 1200, max: 5000 },
  'Hostel & Room Essentials': { min: 200, avg: 1200, max: 5000 },
  'Lab & Study Equipment': { min: 300, avg: 1800, max: 8000 }
}

// Scam & Phishing suspicious keywords
const SUSPICIOUS_PATTERNS = [
  /\b(free iphone|free macbook|100% free|lottery|winner|whatsapp me urgently)\b/i,
  /\b(telegram|pay advance|send otp|gift voucher|cryptocurrency|crypto payment)\b/i,
  /\b(wire transfer|western union|courier deposit|bank transfer before meeting)\b/i
]

/**
 * Record user activity for recommendation learning
 */
export function trackUserActivity(type, value) {
  try {
    if (type === 'search' && value) {
      const history = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]')
      if (!history.includes(value.toLowerCase())) {
        history.unshift(value.toLowerCase())
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history.slice(0, 10)))
      }
    } else if (type === 'view_category' && value) {
      const history = JSON.parse(localStorage.getItem(VIEW_HISTORY_KEY) || '[]')
      history.unshift(value)
      localStorage.setItem(VIEW_HISTORY_KEY, JSON.stringify(history.slice(0, 15)))
    }
  } catch (e) {
    console.warn('AI activity tracking error:', e)
  }
}

/**
 * AI Recommendation Ranker
 */
export function rankRecommendations(products) {
  if (!products || products.length === 0) return []
  try {
    const searchHistory = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]')
    const viewHistory = JSON.parse(localStorage.getItem(VIEW_HISTORY_KEY) || '[]')

    return [...products].sort((a, b) => {
      let scoreA = 0
      let scoreB = 0

      // Match category view frequency
      const countCatA = viewHistory.filter(c => c === a.category).length
      const countCatB = viewHistory.filter(c => c === b.category).length
      scoreA += countCatA * 3
      scoreB += countCatB * 3

      // Match keywords from search history
      searchHistory.forEach(term => {
        if (a.title.toLowerCase().includes(term) || (a.description || '').toLowerCase().includes(term)) scoreA += 5
        if (b.title.toLowerCase().includes(term) || (b.description || '').toLowerCase().includes(term)) scoreB += 5
      })

      // Highly rated seller boost
      if (a.profiles?.rating && a.profiles.rating >= 4.5) scoreA += 2
      if (b.profiles?.rating && b.profiles.rating >= 4.5) scoreB += 2

      return scoreB - scoreA
    })
  } catch (e) {
    return products
  }
}

/**
 * AI Price Suggestion Calculator
 */
export function suggestSmartPrice(category, condition = 'Used') {
  const bench = CATEGORY_BENCHMARKS[category] || { min: 200, avg: 1500, max: 6000 }
  let multiplier = 1.0
  if (condition === 'New') multiplier = 1.35
  else if (condition === 'Like new') multiplier = 1.05
  else multiplier = 0.75

  const min = Math.round(bench.min * multiplier)
  const avg = Math.round(bench.avg * multiplier)
  const max = Math.round(bench.max * multiplier)

  return { min, avg, max, text: `₹${min} - ₹${max} (Market avg: ₹${avg})` }
}

/**
 * AI Price Anomaly Analysis (Unusual Price Alert)
 */
export function analyzePrice(product) {
  const bench = CATEGORY_BENCHMARKS[product.category]
  if (!bench || !product.price) {
    return { status: 'normal', badge: '🤖 AI Fair Price', color: 'blue', alert: null }
  }

  const price = Number(product.price)
  if (price < bench.min * 0.4 && price > 0) {
    return {
      status: 'unusually_low',
      badge: '⚠️ AI Alert: Unusually Cheap',
      color: 'amber',
      alert: 'This item is listed significantly below campus market price. Inspect thoroughly before payment!'
    }
  } else if (price > bench.max * 1.8) {
    return {
      status: 'unusually_high',
      badge: '📈 AI Alert: Higher Than Avg',
      color: 'purple',
      alert: 'Price is above average. Feel free to use the Make Offer button to negotiate!'
    }
  }

  return {
    status: 'fair',
    badge: '🤖 AI Verified Value',
    color: 'emerald',
    alert: 'Price is aligned with fair market value.'
  }
}

/**
 * AI Scam & Fake Listing Detection
 */
export function detectScamRisk(product, seller = null) {
  let riskScore = 0
  const reasons = []

  const fullText = `${product.title || ''} ${product.description || ''}`.toLowerCase()

  // 1. Keyword check
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(fullText)) {
      riskScore += 45
      reasons.push('Contains suspicious keywords requesting off-platform contact or advance fees.')
      break
    }
  }

  // 2. Extreme low price check on high value items
  if (product.category?.includes('Electronics') && product.price > 0 && product.price < 500) {
    riskScore += 30
    reasons.push('High value category listed at unrealistically low price.')
  }

  // 3. Unverified new seller with low/no ratings
  if (seller && !seller.is_verified && (!seller.rating || seller.rating < 3)) {
    riskScore += 15
    reasons.push('Seller has not yet completed campus ID verification.')
  }

  // Determine Verdict
  if (riskScore >= 40) {
    return {
      risk: 'high',
      score: riskScore,
      badge: '🚨 AI Scam Warning',
      badgeColor: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700',
      message: reasons[0] || 'Potential fake or suspicious listing detected by AI analysis. Proceed with caution!',
      safeToBuy: false
    }
  } else if (riskScore >= 20) {
    return {
      risk: 'medium',
      score: riskScore,
      badge: '⚠️ AI Caution Advised',
      badgeColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700',
      message: 'Meet seller strictly at official campus pickup spots (Main Gate, Library).',
      safeToBuy: true
    }
  }

  return {
    risk: 'low',
    score: riskScore,
    badge: '🛡️ AI Safe Listing',
    badgeColor: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
    message: 'Listing verified clean by automated campus safety scanner.',
    safeToBuy: true
  }
}
