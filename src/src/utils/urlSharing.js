/**
 * URL Sharing Utilities
 * Encode/decode calculator data to/from URL for sharing
 * Uses abbreviated keys and base64 encoding to keep URLs short
 */

/**
 * Abbreviated key mappings to keep URLs compact
 */
const KEY_MAP = {
  // Basic Info
  l: 'loanAmount',
  m: 'months',
  e: 'euribor',
  s: 'spread',
  // Insurance
  li: 'lifeInsurance',
  hi: 'houseInsurance',
  // Amortization
  ar: 'amortizationRules',
  rp: 'recalculatePayment'
}

// Reverse mapping for decoding
const REVERSE_KEY_MAP = Object.entries(KEY_MAP).reduce((acc, [short, long]) => {
  acc[long] = short
  return acc
}, {})

/**
 * Encode calculator data to a compact URL parameter
 * @param {Object} data - Calculator form data
 * @returns {string} Base64 encoded URL-safe string
 */
export function encodeToURL(data) {
  // Only include non-empty values to minimize URL size
  const compact = {}
  
  Object.keys(data).forEach(key => {
    const value = data[key]
    const shortKey = REVERSE_KEY_MAP[key] || key
    
    // Skip empty values
    if (value === '' || value === null || value === undefined) return
    
    // Skip false booleans (default)
    if (value === false) return
    
    // Skip empty arrays
    if (Array.isArray(value) && value.length === 0) return
    
    // For amortization rules, only include if not default
    if (key === 'amortizationRules' && Array.isArray(value)) {
      // Filter out empty rules
      const nonEmptyRules = value.filter(rule => 
        rule.amount && rule.amount !== '' && rule.amount !== '0'
      )
      if (nonEmptyRules.length > 0) {
        // Further compress rules by using short keys
        compact[shortKey] = nonEmptyRules.map(rule => ({
          t: rule.type === 'recurring' ? 'r' : 'o',
          f: rule.frequency,
          p: rule.period === 'year' ? 'y' : 'm',
          a: rule.amount,
          ...(rule.month && { m: rule.month }),
          ...(rule.year && { yr: rule.year })
        }))
      }
      return
    }
    
    compact[shortKey] = value
  })
  
  // Convert to JSON and encode
  const json = JSON.stringify(compact)
  const base64 = btoa(json)
  
  // Make URL-safe
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Decode calculator data from URL parameter
 * @param {string} encoded - Base64 encoded URL-safe string
 * @returns {Object} Decoded calculator data
 */
export function decodeFromURL(encoded) {
  try {
    // Restore base64 from URL-safe format
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const padding = '='.repeat((4 - (base64.length % 4)) % 4)
    const json = atob(base64 + padding)
    const compact = JSON.parse(json)
    
    // Expand to full keys
    const data = {}
    
    Object.keys(compact).forEach(shortKey => {
      const longKey = KEY_MAP[shortKey] || shortKey
      let value = compact[shortKey]
      
      // Expand amortization rules
      if (shortKey === 'ar' && Array.isArray(value)) {
        value = value.map(rule => ({
          type: rule.t === 'r' ? 'recurring' : 'oneTime',
          frequency: rule.f,
          period: rule.p === 'y' ? 'year' : 'month',
          amount: rule.a,
          month: rule.m || '',
          year: rule.yr || ''
        }))
      }
      
      data[longKey] = value
    })
    
    return data
  } catch (error) {
    console.error('Failed to decode URL:', error)
    return null
  }
}

/**
 * Generate a shareable URL for the current calculator state
 * @param {string} path - Calculator path (e.g., '/calculator', '/amortization')
 * @param {Object} data - Calculator form data
 * @returns {string} Full shareable URL
 */
export function generateShareableURL(path, data) {
  const encoded = encodeToURL(data)
  const baseURL = window.location.origin
  return `${baseURL}${path}?d=${encoded}`
}

/**
 * Get calculator data from current URL
 * @returns {Object|null} Decoded data or null if no data in URL
 */
export function getDataFromURL() {
  const params = new URLSearchParams(window.location.search)
  const encoded = params.get('d')
  
  if (!encoded) return null
  
  return decodeFromURL(encoded)
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textArea)
      return success
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

