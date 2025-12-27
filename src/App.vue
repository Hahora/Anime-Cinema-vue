<template>
  <div id="app">
    <AppHeader v-if="showHeader" />
    <router-view />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'

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
      // Не показываем header на специальных страницах
      const hideHeaderRoutes = ['login', 'NotFound', 'ServiceUnavailable']
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
  },
  beforeUnmount() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
    }
  },
  watch: {
    // Блокируем навигацию если сервер недоступен
    $route(to) {
      if (!this.serverAvailable && to.name !== 'ServiceUnavailable') {
        this.$router.push('/503')
      }
    },
  },
  methods: {
    async checkServerHealth() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/health`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(5000), // Timeout 5 секунд
          },
        )

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
          // Сервер восстановлен
          const wasUnavailable = !this.serverAvailable
          this.serverAvailable = true

          // Если сервер восстановился и мы на странице 503, перезагружаем
          if (wasUnavailable && this.$route.name === 'ServiceUnavailable') {
            window.location.href = '/'
          }
        }
      } catch (err) {
        // Ошибка подключения
        console.error('Health check failed:', err)
        this.serverAvailable = false

        // Редиректим на 503 только если уже прошла первая проверка
        if (this.initialCheckDone && this.$route.name !== 'ServiceUnavailable') {
          this.$router.push('/503')
        }
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
