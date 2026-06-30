import { supabase } from './supabase.js'

const form = document.getElementById('add-product-form')
const photoInput = document.getElementById('photos')
const photoPreview = document.getElementById('photo-preview')
const getLocationBtn = document.getElementById('get-location')
const locationText = document.getElementById('location-text')
const errorMsg = document.getElementById('error-msg')
const submitBtn = document.getElementById('submit-btn')

let selectedLocation = null
let photoFiles = []

// 1. Check login - illana login page anupu
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  alert('Login panni thaan item post panna mudiyum da')
  window.location.href = 'login.html'
}

// 2. Photo Preview - ANIMATIONS ADD PANNITEN
photoInput.addEventListener('change', () => {
  photoFiles = Array.from(photoInput.files).slice(0, 4) // Max 4
  photoPreview.innerHTML = ''
  photoFiles.forEach((file, index) => {
    const img = document.createElement('img')
    img.src = URL.createObjectURL(file)
    // 🔥 hover-scale animate-scale-in add panniten
    img.className = 'w-20 h-20 object-cover rounded-lg hover-scale animate-scale-in cursor-pointer'
    img.style.animationDelay = `${index * 0.1}s` // Oru oru photo kum delay
    photoPreview.appendChild(img)
  })
})

// 3. GPS Location - ANIMATION ADD PANNITEN
getLocationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    locationText.textContent = 'Getting location...'
    locationText.className = 'text-sm text-blue-600 mt-1 animate-pulse'
    getLocationBtn.disabled = true
    getLocationBtn.classList.add('animate-pulse')
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        selectedLocation = {lng: pos.coords.longitude, lat: pos.coords.latitude}
        locationText.textContent = `Location set ✓`
        locationText.className = 'text-sm text-green-600 mt-1 animate-fade-in'
        getLocationBtn.disabled = false
        getLocationBtn.classList.remove('animate-pulse')
        getLocationBtn.classList.add('transformer-success')
        setTimeout(() => getLocationBtn.classList.remove('transformer-success'), 1000)
      },
      () => {
        locationText.textContent = 'Location access denied. Allow pannu da.'
        locationText.className = 'text-sm text-red-500 mt-1 animate-shake'
        getLocationBtn.disabled = false
        getLocationBtn.classList.remove('animate-pulse')
        setTimeout(() => locationText.classList.remove('animate-shake'), 500)
      }
    )
  }
})

// 4. Form Submit
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  submitBtn.disabled = true
  submitBtn.textContent = 'Posting...'
  submitBtn.classList.add('animate-pulse') // 🔥 Loading pulse add panniten
  errorMsg.textContent = ''

  try {
    // 4a. Photos upload to Supabase Storage
    const photoUrls = []
    for (const file of photoFiles) {
      const fileName = `${user.id}/${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file)
      
      if (error) throw error
      
      // Public URL eduthuko
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)
      photoUrls.push(publicUrl)
    }

    // 4b. Product data DB la save pannu
    
    console.log("User:", user);
    console.log("User ID:", user.id);

    const { error: insertError } = await supabase
      .from('products')
      .insert({
        user_id: user.id,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: parseInt(document.getElementById('price').value),
        category: document.getElementById('category').value,
        condition: document.querySelector('input[name="condition"]:checked').value,
        photos: photoUrls,
        location: selectedLocation ? `SRID=4326;POINT(${selectedLocation.lng} ${selectedLocation.lat})` : null
      })

    if (insertError) throw insertError

    // Success animation
    submitBtn.textContent = 'Posted! ✅'
    submitBtn.classList.remove('animate-pulse')
    submitBtn.classList.add('transformer-success')
    
    setTimeout(() => {
      alert('Item post aayiduchu da 🔥')
      window.location.href = '../index.html'
    }, 800)

  } catch (error) {
    errorMsg.textContent = error.message
    errorMsg.classList.add('animate-shake') // 🔥 Error ku shake
    submitBtn.disabled = false
    submitBtn.textContent = 'Post Item'
    submitBtn.classList.remove('animate-pulse')
    
    setTimeout(() => errorMsg.classList.remove('animate-shake'), 500)
  }
})