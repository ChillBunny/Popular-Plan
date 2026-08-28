import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // Respeta el puerto asignado por el entorno (PORT); 5173 por defecto.
    // Permite correr una segunda instancia si 5173 ya está en uso.
    port: Number(process.env.PORT) || 5173,
  },
})