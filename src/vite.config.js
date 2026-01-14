import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
  const base = command === 'build'
    ? `/${repoName || 'Mortage-Calculator'}/`
    : '/'

  return {
    plugins: [react()],
    base,
  }
})
