import { execSync } from 'node:child_process';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * The commit the site is being built from.
 *
 * The Builder Console used to display a hardcoded hash (`85eaf6e`) that was not
 * in this repository's history at all — a fabricated fact sitting in the one
 * place on the site whose entire purpose is to state facts. Reading it from
 * git makes it true by construction and keeps it true after every deploy.
 *
 * Vercel exposes the same value as VERCEL_GIT_COMMIT_SHA, which is preferred
 * because build environments are sometimes shallow clones. If neither is
 * available the console says so rather than inventing one.
 */
function resolveCommit() {
  const fromEnv = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA;
  if (fromEnv) return String(fromEnv).slice(0, 7);
  try {
    return execSync('git rev-parse --short HEAD', {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return 'dev';
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __COMMIT__: JSON.stringify(resolveCommit()),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) {
              return 'framer';
            }
          }
        },
      },
    },
  },
})
