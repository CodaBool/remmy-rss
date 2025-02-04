import { defineConfig } from 'vite'
import deno from '@deno/vite-plugin'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from "vite-plugin-singlefile"
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [deno(), react(), viteSingleFile(), tailwindcss()],
})
