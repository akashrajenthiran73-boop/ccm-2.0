// js/i18n.js - English & Tamil Bilingual Localization Engine (Module 22)

const LANG_KEY = 'ccm_language'

export const translations = {
  en: {
    appName: 'Campus Community Marketplace',
    tagline: 'Buy, Sell, Rent, Exchange & Connect in College and Community',
    collegeMode: 'College Marketplace',
    communityMode: 'Community Marketplace',
    switchMode: 'Switch Mode',
    collegeDesc: 'Verified college students & staff only',
    communityDesc: 'Nearby public & campus residents',
    navHome: 'Home',
    navSearch: 'Search',
    navNearby: 'Nearby',
    navDeals: 'Deals & Groups',
    navAuctions: 'Auctions',
    navLostFound: 'Lost & Found',
    navExchange: 'Exchange',
    navRent: 'Rent / Borrow',
    navOrders: 'My Orders',
    navWishlist: 'Wishlist',
    navCart: 'Cart',
    navChats: 'Chats',
    navProfile: 'Profile',
    navAdmin: 'Admin',
    navLogin: 'Login',
    navRegister: 'Register',
    navLogout: 'Logout',
    btnSell: '+ Sell Item',
    searchPlaceholder: 'Search books, cycles, laptops...',
    minPrice: 'Min ₹',
    maxPrice: 'Max ₹',
    nearMe5km: '📍 Near Me 5km',
    allCategories: 'All Categories',
    trendingProducts: '🔥 Trending Products',
    recommendedForYou: '✨ Recommended For You',
    flashDeals: '⚡ Flash Deals',
    recentListings: '🕒 Recent Listings',
    condition: 'Condition',
    new: 'New',
    likeNew: 'Like new',
    used: 'Used',
    price: 'Price',
    location: 'Location',
    meetingPoint: 'Meeting Point',
    seller: 'Seller',
    verifiedSeller: 'Verified User',
    buyNow: 'Buy Now',
    addToCart: 'Add to Cart',
    chatWithSeller: '💬 Chat with Seller',
    makeOffer: '🤝 Make Offer',
    placeBid: '🔨 Place Bid',
    exchangeItem: '🔄 Exchange Request',
    rentItem: '📚 Rent / Borrow',
    reportListing: '🛡️ Report Listing',
    orderPlaced: 'Order Placed',
    orderConfirmed: 'Confirmed',
    orderPickup: 'Ready for Pickup',
    orderCompleted: 'Completed',
    orderCancelled: 'Cancelled',
    walletBalance: 'Wallet Balance',
    addMoney: 'Add Money',
    aiBadgeFair: '🤖 AI Fair Price Verified',
    aiBadgeScamSafe: '🛡️ AI Safe Listing',
    aiBadgeUnusual: '⚠️ AI Unusual Price Alert',
    aiBadgeSuspicious: '🚨 AI High Risk Warning',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    tamilLang: 'தமிழ்',
    engLang: 'English'
  },
  ta: {
    appName: 'கேம்பஸ் சமூக சந்தை (CCM 2.0)',
    tagline: 'கல்லூரி மற்றும் சமூகத்தில் வாங்க, விற்க, வாடகைக்கு எடுக்க மற்றும் பரிமாற',
    collegeMode: '🎓 கல்லூரி சந்தை',
    communityMode: '🌐 சமூக சந்தை',
    switchMode: 'சந்தை முறை மாற்று',
    collegeDesc: 'சரிபார்க்கப்பட்ட கல்லூரி மாணவர்கள் & பணியாளர்கள் மட்டும்',
    communityDesc: 'அருகிலுள்ள பொதுமக்கள் & சமூக பயனர்கள்',
    navHome: 'முகப்பு',
    navSearch: 'தேடல்',
    navNearby: 'அருகில்',
    navDeals: 'சலுகைகள் & குழுக்கள்',
    navAuctions: 'ஏலம் & ஏல கேட்பு',
    navLostFound: 'தொலைந்தவை & கிடைத்தவை',
    navExchange: 'பண்டமாற்று',
    navRent: 'வாடகை / கடன்',
    navOrders: 'என் ஆர்டர்கள்',
    navWishlist: 'விருப்பப்பட்டியல்',
    navCart: 'கூடை',
    navChats: 'அரட்டைகள்',
    navProfile: 'சுயவிவரம்',
    navAdmin: 'நிர்வாகம்',
    navLogin: 'உள்நுழை',
    navRegister: 'பதிவுசெய்',
    navLogout: 'வெளியேறு',
    btnSell: '+ பொருள் விற்க',
    searchPlaceholder: 'புத்தகங்கள், மிதிவண்டிகள், மடிக்கணினிகள் தேடுக...',
    minPrice: 'குறைந்த ₹',
    maxPrice: 'அதிக ₹',
    nearMe5km: '📍 5 கிமீ அருகில்',
    allCategories: 'அனைத்து பிரிவுகள்',
    trendingProducts: '🔥 ட்ரெண்டிங் பொருட்கள்',
    recommendedForYou: '✨ உங்களுக்கான பரிந்துரைகள்',
    flashDeals: '⚡ சிறப்பு சலுகைகள்',
    recentListings: '🕒 சமீபத்திய பதிவுகள்',
    condition: 'நிலை',
    new: 'புதியது',
    likeNew: 'புதியது போன்றது',
    used: 'பயன்படுத்தப்பட்டது',
    price: 'விலை',
    location: 'இடம்',
    meetingPoint: 'சந்திப்பு இடம்',
    seller: 'விற்பனையாளர்',
    verifiedSeller: 'சரிபார்க்கப்பட்ட பயனர்',
    buyNow: 'இப்போதே வாங்கு',
    addToCart: 'கூடையில் சேர்',
    chatWithSeller: '💬 விற்பனையாளருடன் உரையாடு',
    makeOffer: '🤝 விலை பேரம் பேசு',
    placeBid: '🔨 ஏலம் கேள்',
    exchangeItem: '🔄 பண்டமாற்று கோரிக்கை',
    rentItem: '📚 வாடகைக்கு எடு',
    reportListing: '🛡️ புகார் செய்',
    orderPlaced: 'ஆர்டர் செய்யப்பட்டது',
    orderConfirmed: 'உறுதிசெய்யப்பட்டது',
    orderPickup: 'பெற தயாராக உள்ளது',
    orderCompleted: 'நிறைவுற்றது',
    orderCancelled: 'ரத்துசெய்யப்பட்டது',
    walletBalance: 'டிஜிட்டல் பணப்பை இருப்பு',
    addMoney: 'பணம் சேர்',
    aiBadgeFair: '🤖 AI நியாயமான விலை சரிபார்க்கப்பட்டது',
    aiBadgeScamSafe: '🛡️ AI பாதுகாப்பான பதிவு',
    aiBadgeUnusual: '⚠️ AI அசாதாரண விலை எச்சரிக்கை',
    aiBadgeSuspicious: '🚨 AI சந்தேகத்திற்கிடமான எச்சரிக்கை',
    darkMode: 'இருண்ட பயன்முறை',
    lightMode: 'ஒளி பயன்முறை',
    tamilLang: 'தமிழ்',
    engLang: 'English'
  }
}

export function getCurrentLanguage() {
  return localStorage.getItem(LANG_KEY) || 'en'
}

export function setLanguage(lang) {
  const selected = (lang === 'ta') ? 'ta' : 'en'
  localStorage.setItem(LANG_KEY, selected)
  document.documentElement.lang = selected
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: selected } }))
  translateDOM()
  return selected
}

export function t(key) {
  const lang = getCurrentLanguage()
  return translations[lang]?.[key] || translations.en[key] || key
}

export function toggleLanguage() {
  const current = getCurrentLanguage()
  const next = current === 'en' ? 'ta' : 'en'
  return setLanguage(next)
}

export function translateDOM() {
  const lang = getCurrentLanguage()
  const dict = translations[lang] || translations.en

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    if (dict[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = dict[key]
      } else {
        el.textContent = dict[key]
      }
    }
  })
}

// Auto init DOM translation on DOM load
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => translateDOM())
  } else {
    translateDOM()
  }
}
