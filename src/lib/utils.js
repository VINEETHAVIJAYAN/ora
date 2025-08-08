// Format currency for Indian Rupees
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format currency with decimal places
export function formatCurrencyDetailed(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Generate product slug from name
export function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

// Calculate discount percentage
export function calculateDiscount(originalPrice, salePrice) {
  if (!salePrice || salePrice >= originalPrice) return 0
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

// Validate email format
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number (Indian format)
export function isValidPhone(phone) {
  const phoneRegex = /^[+]?[91]?[0-9]{10}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Generate order number
export function generateOrderNumber() {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORA${timestamp.slice(-6)}${random}`
}

// Calculate loyalty points based on order amount
export function calculateLoyaltyPoints(orderAmount) {
  // 1 point per ₹100 spent
  return Math.floor(orderAmount / 100)
}

// Format date for display
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

// Format date with time
export function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

// Truncate text with ellipsis
export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// Convert weight to display format
export function formatWeight(weight) {
  if (weight < 1) {
    return `${(weight * 1000).toFixed(0)}mg`
  }
  return `${weight.toFixed(1)}g`
}

// Get initials from name
export function getInitials(name) {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
}

// Clean and format phone number
export function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`
  }
  return phone
}

// Generate random color for avatar
export function getAvatarColor(name) {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
  ]
  
  const index = name.length % colors.length
  return colors[index]
}
