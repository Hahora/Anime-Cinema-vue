<template>
  <div id="app">
    <AppHeader v-if="showHeader" />
    <router-view />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import { wsService } from './services/websocket'
import { animeApi } from './api/animeApi'

export default {
  name: 'App',
  components: {
    AppHeader,
  },
  data() {
    return {
      serverAvailable: true,
      healthCheckInterval: null,
      initialCheckDone: false,
    }
  },
  computed: {
    showHeader() {
      const hideHeaderRoutes = ['login', 'NotFound', 'ServiceUnavailable', 'Register']
      return !hideHeaderRoutes.includes(this.$route.name)
    },
  },
  async mounted() {
    // Первая проверка при запуске
    await this.checkServerHealth()
    this.initialCheckDone = true

    // Периодическая проверка каждые 30 секунд
    this.healthCheckInterval = setInterval(() => {
      this.checkServerHealth()
    }, 30000)

    // ✅ Подключаем WebSocket если пользователь авторизован
    await this.connectWebSocket()
  },
  beforeUnmount() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
    }

    // ✅ Отключаем WebSocket при выходе
    wsService.disconnect()
  },
  watch: {
    async $route(to, from) {
      // ✅ Подключаем WebSocket после логина/регистрации
      if (from.name === 'login' || from.name === 'Register') {
        await this.connectWebSocket()
      }

      // ✅ Отключаем WebSocket на странице логина/регистрации
      if (to.name === 'login' || to.name === 'Register') {
        wsService.disconnect()
      }
    },
  },
  methods: {
    async checkServerHealth() {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/health`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
          },
        )

        clearTimeout(timeoutId)

        if (!response.ok) {
          this.serverAvailable = false
          if (this.$route.name !== 'ServiceUnavailable') {
            this.$router.push('/503')
          }
          return
        }

        const data = await response.json()

        if (data.status !== 'healthy') {
          this.serverAvailable = false
          if (this.$route.name !== 'ServiceUnavailable') {
            this.$router.push('/503')
          }
        } else {
          const wasUnavailable = !this.serverAvailable
          this.serverAvailable = true

          if (wasUnavailable && this.$route.name === 'ServiceUnavailable') {
            window.location.href = '/'
          }
        }
      } catch (err) {
        clearTimeout(timeoutId)
        console.error('Health check failed:', err)
        this.serverAvailable = false

        if (this.initialCheckDone && this.$route.name !== 'ServiceUnavailable') {
          this.$router.push('/503')
        }
      }
    },

    async connectWebSocket() {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log('⚠️ No token found, skipping WebSocket connection')
        return
      }

      try {
        const profile = await animeApi.getProfile()
        console.log('👤 Connecting WebSocket for user:', profile.id)
        wsService.connect(profile.id)
      } catch (err) {
        console.error('❌ Failed to connect WebSocket:', err)
      }
    },
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #000;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #0a0a0a;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #ff416c, #ff4b2b);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #ff5a7c, #ff6b3b);
}
</style>
