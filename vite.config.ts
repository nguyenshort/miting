import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  preview: {
    port: 5173
  },
  plugins: [
      vue(),
    Components({
      resolvers: [
        IconsResolver(),
          VantResolver()
      ],
    }),
    Icons({
      autoInstall: true
    }),
  ],
  server: {
    proxy: {
      '/bunny': {
        // @ts-ignore
        target: 'https://sg.storage.bunnycdn.com/smileeyev2/',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/bunny/, '')
      },
      '/smileeye': {
        // @ts-ignore
        target: 'https://v2-be.smileeye.edu.vn/',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/smileeye/, '')
      }
    }
  }
})
