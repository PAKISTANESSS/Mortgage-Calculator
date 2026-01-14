/* eslint-env node */
/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
  const devBase = process.env.VITE_DEV_BASE
  const base = command === 'build'
    ? `/${repoName || 'Mortage-Calculator'}/`
    : devBase || '/'

  return {
    plugins: [react()],
    base,
  }
})
