import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  esbuild: {
    target: "es2022"
  },
  plugins: [
    react(),
    tsconfigPaths({
      projects: ['./tsconfig.app.json'], // Chỉ định plugin dùng tsconfig.app.json
    }),
  ],
})
