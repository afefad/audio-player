import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  css: {
    preprocessorOptions: {
      sass: {
        silenceDeprecations: ['import'],   // для .sass
        quietDeps: true,
      },
      scss: {
        silenceDeprecations: ['import'],   // для .scss
        quietDeps: true,
      },
    },
  },
})

