// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   base: '/react_project/game/v2/',
//   plugins: [react(), tailwindcss()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://94.136.185.237',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, '/node_project/game/v2/api'),
//       },
//     },
//   },
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',

  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    proxy: {
      '/api': {
        target: 'https://game-backend-eta.vercel.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
