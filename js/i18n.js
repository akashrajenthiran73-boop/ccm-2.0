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

// Comprehensive UI Phrase Dictionary for Deep DOM Translation
export const PHRASE_MAP_EN_TO_TA = {
  'Home': 'முகப்பு',
  'Search': 'தேடல்',
  'Nearby Map': 'அருகில் வரைபடம்',
  '📍 Nearby Map': '📍 அருகில் வரைபடம்',
  'Deals': 'சலுகைகள்',
  '⚡ Deals': '⚡ சலுகைகள்',
  'Auctions': 'ஏலம்',
  '🔨 Auctions': '🔨 ஏலம்',
  'Lost & Found': 'தொலைந்தவை & கிடைத்தவை',
  '🔍 Lost & Found': '🔍 தொலைந்தவை',
  'Barter': 'பண்டமாற்று',
  '🔄 Barter': '🔄 பண்டமாற்று',
  'Rent': 'வாடகை',
  '📚 Rent': '📚 வாடகை',
  'Rent / Borrow': 'வாடகை / கடன்',
  'Rent & Borrow': 'வாடகை & கடன்',
  'Barter / Trade': 'பண்டமாற்று',
  'Live Auctions': 'நேரலை ஏலம்',
  'Flash Deals': 'சிறப்பு சலுகைகள்',
  'Sell': 'விற்க',
  '+ Sell': '+ விற்க',
  '+ Sell Item': '+ பொருள் விற்க',
  'Login': 'உள்நுழை',
  'Register': 'பதிவுசெய்',
  'Logout': 'வெளியேறு',
  '🚪 Logout': '🚪 வெளியேறு',
  'Dashboard': 'டாஷ்போர்டு',
  '📊 Dashboard': '📊 டாஷ்போர்டு',
  'Profile': 'சுயவிவரம்',
  '👤 Profile': '👤 சுயவிவரம்',
  '👤 Profile & College Info': '👤 சுயவிவரம் & கல்லூரி தகவல்',
  '👤 Profile & College ID': '👤 சுயவிவரம் & கல்லூரி ஐடி',
  'My Orders': 'என் ஆர்டர்கள்',
  '📦 My Orders': '📦 என் ஆர்டர்கள்',
  'Order Tracking': 'ஆர்டர் கண்காணிப்பு',
  'Cart & Checkout': 'கூடை & கட்டணம்',
  'Admin Portal': 'நிர்வாக தளம்',
  'Campus Lost & Found': 'வளாக தொலைந்தவை & கிடைத்தவை',
  'Safety & Report System': 'பாதுகாப்பு & புகார் முறை',
  'Seller Reputation': 'விற்பனையாளர் நற்பெயர்',
  'Group Buying Discounts': 'குழு கொள்முதல் தள்ளுபடிகள்',
  'Marketplace Modes': 'சந்தை முறைகள்',
  'Trading & Selling': 'வர்த்தகம் & விற்பனை',
  'Safety & Community': 'பாதுகாப்பு & சமூகம்',
  'Account & Portal': 'கணக்கு & தளம்',
  'Campus Pickup Spots': 'வளாக சந்திப்பு இடங்கள்',
  '+ Post a Listing': '+ பொருள் பதிவிடு',
  'Barter Exchange': 'பண்டமாற்று பரிமாற்றம்',
  'Live Bidding': 'நேரலை ஏல கேட்பு',
  'My Chats': 'என் அரட்டைகள்',
  '💬 My Chats': '💬 என் அரட்டைகள்',
  'Barter Requests': 'பண்டமாற்று கோரிக்கைகள்',
  '🔄 Barter Requests': '🔄 பண்டமாற்று கோரிக்கைகள்',
  'My Rentals': 'என் வாடகைகள்',
  '📚 My Rentals': '📚 என் வாடகைகள்',
  'Safety & Reports': 'பாதுகாப்பு & புகார்கள்',
  '🛡️ Safety & Reports': '🛡️ பாதுகாப்பு & புகார்கள்',
  'Admin Dashboard': 'நிர்வாக பலகை',
  '⚙️ Admin Dashboard': '⚙️ நிர்வாக பலகை',
  'Marketplace Listings': 'சந்தை பொருட்கள்',
  '🛍️ Marketplace Listings': '🛍️ சந்தை பொருட்கள்',
  'Filtered by your active marketplace mode & campus location': 'செயலில் உள்ள சந்தை மற்றும் வளாக இருப்பிடத்தின்படி வடிகட்டப்பட்டது',
  'College Marketplace': 'கல்லூரி சந்தை',
  '🎓 College Marketplace': '🎓 கல்லூரி சந்தை',
  'Community Marketplace': 'சமூக சந்தை',
  '🌐 Community Marketplace': '🌐 சமூக சந்தை',
  'Buy, Sell, Rent & Barter with Ease': 'சுலபமாக வாங்க, விற்க, வாடகை & பண்டமாற்று செய்க',
  'Switch between your private College Marketplace and open Community Marketplace.': 'உங்கள் கல்லூரி சந்தை மற்றும் திறந்த சமூக சந்தைக்கு இடையே மாறுக.',
  'Students & Staff Only': 'மாணவர்கள் & பணியாளர்கள் மட்டும்',
  'Open Public & Campus': 'பொதுமக்கள் & வளாகம்',
  'All Categories': 'அனைத்து பிரிவுகள்',
  'All': 'அனைத்தும்',
  'Books & Notes': 'புத்தகங்கள் & குறிப்புகள்',
  '📚 Books & Notes': '📚 புத்தகங்கள் & குறிப்புகள்',
  'Electronics & Tech': 'மின்னணுவியல் & தொழில்நுட்பம்',
  'Electronics & Laptops': 'மின்னணுவியல் & மடிக்கணினிகள்',
  '💻 Electronics': '💻 மின்னணுவியல்',
  'Hostel & Room': 'விடுதி & அறை பொருட்கள்',
  'Hostel & Room Essentials': 'விடுதி & அறை பொருட்கள்',
  '🛏️ Hostel & Living': '🛏️ விடுதி & அறை',
  '🛏️ Hostel': '🛏️ விடுதி',
  'Cycles & Mobility': 'சைக்கிள்கள்',
  'Cycles & Vehicles': 'சைக்கிள்கள் & வாகனங்கள்',
  '🚲 Cycles': '🚲 சைக்கிள்கள்',
  'Lab Equipment': 'ஆய்வக உபகரணங்கள்',
  'Lab & Study Equipment': 'ஆய்வக & படிப்பு உபகரணங்கள்',
  '🔬 Lab Gear': '🔬 ஆய்வக உபகரணங்கள்',
  '🔬 Lab Equipment': '🔬 ஆய்வக உபகரணங்கள்',
  'Fashion & Wear': 'ஆடைகள்',
  'Other Essentials': 'பிற தேவைகள்',
  'Near Me 5km': '5 கிமீ அருகில்',
  '📍 Near Me 5km': '📍 5 கிமீ அருகில்',
  'Buy Now': 'இப்போதே வாங்கு',
  'Add to Cart': 'கூடையில் சேர்',
  'Cart': 'கூடை',
  '🛒 Cart': '🛒 கூடை',
  'Chat': 'அரட்டை',
  '💬 Chat': '💬 அரட்டை',
  'Details': 'விவரங்கள்',
  'View Details': 'விவரங்கள் பார்',
  'View / Buy': 'பார் / வாங்கு',
  'In Stock': 'கையிருப்பில் உள்ளது',
  '🟢 In Stock': '🟢 கையிருப்பில் உள்ளது',
  '🟢 IN STOCK': '🟢 கையிருப்பில் உள்ளது',
  'Sold Out': 'விற்றுத் தீர்ந்தது',
  '🚫 Sold Out': '🚫 விற்றுத் தீர்ந்தது',
  '🚫 SOLD OUT': '🚫 விற்றுத் தீர்ந்தது',
  'Your Item': 'உங்கள் பொருள்',
  '👑 Your Item': '👑 உங்கள் பொருள்',
  'Your Listing': 'உங்கள் பதிவு',
  'Manage': 'நிர்வகி',
  'Price': 'விலை',
  'Condition': 'நிலை',
  'Location': 'இடம்',
  'Explore Marketplace': 'சந்தையை ஆராய்க',
  'Post Listing': 'பொருள் பதிவிடு',
  '+ Post Listing': '+ பொருள் பதிவிடு',
  '+ Post Item': '+ பொருள் பதிவிடு',
  'Book / Borrow Now →': 'வாடகைக்கு எடு →',
  'Propose Trade': 'பண்டமாற்று செய்',
  'Propose Trade →': 'பண்டமாற்று செய் →',
  'Trade My Item ↔': 'என் பொருளை மாற்று ↔',
  'Advanced Filter →': 'கூடுதல் வடிகட்டி →',
  'Wallet Balance': 'டிஜிட்டல் பணப்பை இருப்பு',
  'Verified Member': 'சரிபார்க்கப்பட்ட பயனர்',
  'Campus Member': 'வளாக பயனர்',
  'Campus Seller': 'வளாக விற்பனையாளர்',
  'Student Member': 'மாணவ உறுப்பினர்',
  '🔄 Return Item': '🔄 திரும்ப ஒப்படை',
  '🔄 Return Item Now': '🔄 பொருளை திரும்ப ஒப்படை',
  '✅ Accept Trade': '✅ ஏற்றுக்கொள்',
  '❌ Decline': '❌ நிராகரி',
  '🤝 Mark Completed': '🤝 முடித்துவிட்டதாக குறி',
  'Cancel Proposal': 'ரத்துசெய்',
  'ACTIVE': 'செயலில் உள்ளது',
  'RETURNED': 'திரும்ப ஒப்படைக்கப்பட்டது',
  'PENDING': 'நிலுவையில் உள்ளது',
  'ACCEPTED': 'ஏற்றுக்கொள்ளப்பட்டது',
  'REJECTED': 'நிராகரிக்கப்பட்டது',
  'COMPLETED': 'நிறைவுற்றது'
}

// Inverted map for returning to English
export const PHRASE_MAP_TA_TO_EN = Object.fromEntries(
  Object.entries(PHRASE_MAP_EN_TO_TA).map(([en, ta]) => [ta, en])
)

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
  if (typeof document === 'undefined') return
  const lang = getCurrentLanguage()
  const isTa = lang === 'ta'
  const dict = translations[lang] || translations.en

  // 1. Explicit data-i18n attributes
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

  // 2. Intelligent Phrase Matching across DOM text nodes via TreeWalker
  const map = isTa ? PHRASE_MAP_EN_TO_TA : PHRASE_MAP_TA_TO_EN
  
  if (document.body) {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT
          const parent = node.parentElement
          if (!parent) return NodeFilter.FILTER_REJECT
          const tag = parent.tagName.toUpperCase()
          if (['SCRIPT', 'STYLE', 'CODE', 'PRE', 'NOSCRIPT'].includes(tag)) {
            return NodeFilter.FILTER_REJECT
          }
          if (parent.id === 'lang-toggle-btn') return NodeFilter.FILTER_REJECT
          return NodeFilter.FILTER_ACCEPT
        }
      }
    )

    let textNode
    while ((textNode = walker.nextNode())) {
      const raw = textNode.nodeValue
      const trimmed = raw.trim()
      if (map[trimmed]) {
        textNode.nodeValue = raw.replace(trimmed, map[trimmed])
      }
    }
  }

  // 3. Search & filter inputs placeholder
  document.querySelectorAll('input[type="text"], input[type="search"]').forEach(input => {
    if (isTa) {
      if (input.placeholder?.includes('Search') || input.placeholder?.includes('search')) {
        input.placeholder = 'புத்தகங்கள், சைக்கிள்கள், மடிக்கணினிகள் தேடுக...'
      }
    } else {
      if (input.placeholder?.includes('தேடுக')) {
        input.placeholder = 'Search books, cycles, lab gear, laptops...'
      }
    }
  })

  // 4. Update language toggle button text
  const langBtn = document.getElementById('lang-toggle-btn')
  if (langBtn) {
    langBtn.textContent = isTa ? 'English' : 'தமிழ்'
  }
}

// Auto init DOM translation on DOM load
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => translateDOM())
  } else {
    translateDOM()
  }
}
