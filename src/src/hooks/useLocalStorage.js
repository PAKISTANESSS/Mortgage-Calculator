import { useState, useEffect } from 'react'

/**
 * Custom hook for syncing state with localStorage
 * @param {string} key - The localStorage key
 * @param {any} initialValue - The initial value if no stored value exists
 * @returns {[any, function]} - Current value and setter function
 */
export function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use provided initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error)
      return initialValue
    }
  })

  // Update localStorage whenever value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}

