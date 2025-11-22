import { useLocalStorage } from './useLocalStorage'
import { useEffect } from 'react'

/**
 * Available themes with their color schemes
 */
export const themes = {
  purple: {
    name: 'Purple',
    primary: '#667eea',
    secondary: '#764ba2',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    background: 'linear-gradient(to bottom right, #f7fafc 0%, #edf2f7 100%)',
  },
  blue: {
    name: 'Ocean Blue',
    primary: '#4299e1',
    secondary: '#2b6cb0',
    gradient: 'linear-gradient(135deg, #4299e1 0%, #2b6cb0 100%)',
    background: 'linear-gradient(to bottom right, #ebf8ff 0%, #bee3f8 100%)',
  },
  green: {
    name: 'Forest Green',
    primary: '#48bb78',
    secondary: '#2f855a',
    gradient: 'linear-gradient(135deg, #48bb78 0%, #2f855a 100%)',
    background: 'linear-gradient(to bottom right, #f0fff4 0%, #c6f6d5 100%)',
  },
  orange: {
    name: 'Sunset Orange',
    primary: '#ed8936',
    secondary: '#c05621',
    gradient: 'linear-gradient(135deg, #ed8936 0%, #c05621 100%)',
    background: 'linear-gradient(to bottom right, #fffaf0 0%, #fbd38d 100%)',
  },
  pink: {
    name: 'Rose Pink',
    primary: '#ed64a6',
    secondary: '#b83280',
    gradient: 'linear-gradient(135deg, #ed64a6 0%, #b83280 100%)',
    background: 'linear-gradient(to bottom right, #fff5f7 0%, #fed7e2 100%)',
  },
  dark: {
    name: 'Dark Mode',
    primary: '#4a5568',
    secondary: '#2d3748',
    gradient: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
    background: 'linear-gradient(to bottom right, #2d3748 0%, #1a202c 100%)',
  }
}

/**
 * Custom hook for theme management
 * @returns {Object} Current theme and setter function
 */
export function useTheme() {
  const [currentTheme, setCurrentTheme] = useLocalStorage('appTheme', 'purple')

  useEffect(() => {
    // Apply theme CSS variables to root
    const theme = themes[currentTheme] || themes.purple
    const root = document.documentElement

    root.style.setProperty('--theme-primary', theme.primary)
    root.style.setProperty('--theme-secondary', theme.secondary)
    root.style.setProperty('--theme-gradient', theme.gradient)
    root.style.setProperty('--theme-background', theme.background)
  }, [currentTheme])

  return {
    currentTheme,
    setTheme: setCurrentTheme,
    theme: themes[currentTheme] || themes.purple,
    allThemes: themes
  }
}

