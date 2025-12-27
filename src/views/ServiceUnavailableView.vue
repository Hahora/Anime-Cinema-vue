<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-animation">
        <div class="server-icon">
          <svg viewBox="0 0 24 24" class="icon-main">
            <path
              d="M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
              fill="currentColor"
            />
          </svg>
          <div class="pulse-ring"></div>
          <div class="pulse-ring delay-1"></div>
          <div class="pulse-ring delay-2"></div>
        </div>
        <div class="error-code">503</div>
      </div>

      <div class="error-content">
        <h1 class="error-title">Сервер временно недоступен</h1>
        <p class="error-description">
          Наши серверы сейчас на техническом обслуживании или перегружены. Пожалуйста, попробуйте
          позже.
        </p>

        <div class="server-status">
          <div class="status-indicator" :class="serverStatus">
            <div class="status-dot"></div>
            <span>{{ serverStatusText }}</span>
          </div>
        </div>

        <div class="status-info">
          <div class="status-item">
            <div class="status-icon">⚠️</div>
            <div class="status-text">
              <h4>Что произошло?</h4>
              <p>Сервер временно недоступен из-за технических работ или высокой нагрузки</p>
            </div>
          </div>

          <div class="status-item">
            <div class="status-icon">🔄</div>
            <div class="status-text">
              <h4>Когда заработает?</h4>
              <p>Мы работаем над решением проблемы. Обычно это занимает несколько минут</p>
            </div>
          </div>

          <div class="status-item">
            <div class="status-icon">💡</div>
            <div class="status-text">
              <h4>Что делать?</h4>
              <p>Обновите страницу через несколько минут или вернитесь позже</p>
            </div>
          </div>
        </div>

        <div class="error-actions">
          <button @click="retryConnection" class="action-btn primary" :disabled="retrying">
            <svg v-if="!retrying" viewBox="0 0 24 24">
              <path
                d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                fill="currentColor"
              />
            </svg>
            <div v-else class="btn-spinner"></div>
            {{ retrying ? 'Проверка...' : 'Попробовать снова' }}
          </button>

          <router-link to="/" class="action-btn secondary">
            <svg viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor" />
            </svg>
            На главную
          </router-link>
        </div>

        <div class="retry-timer" v-if="autoRetryIn > 0">
          Автоматическая проверка через {{ autoRetryIn }}с...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServiceUnavailableView',
  data() {
    return {
      retrying: false,
      autoRetryIn: 30,
      retryInterval: null,
      serverStatus: 'offline', // offline, checking, online
    }
  },
  computed: {
    serverStatusText() {
      switch (this.serverStatus) {
        case 'offline':
          return 'Сервер недоступен'
        case 'checking':
          return 'Проверка соединения...'
        case 'online':
          return 'Сервер доступен'
        default:
          return 'Неизвестный статус'
      }
    },
  },
  mounted() {
    this.startAutoRetry()
  },
  beforeUnmount() {
    if (this.retryInterval) {
      clearInterval(this.retryInterval)
    }
  },
  methods: {
    startAutoRetry() {
      this.retryInterval = setInterval(() => {
        this.autoRetryIn--
        if (this.autoRetryIn <= 0) {
          this.retryConnection()
        }
      }, 1000)
    },

    async retryConnection() {
      this.retrying = true
      this.serverStatus = 'checking'

      try {
        // ✅ Проверяем /api/health
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/health`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        if (response.ok) {
          const data = await response.json()

          // Проверяем что сервер действительно здоров
          if (data.status === 'healthy') {
            this.serverStatus = 'online'
            // Сервер доступен, перезагружаем страницу через 1 секунду
            setTimeout(() => {
              window.location.reload()
            }, 1000)
            return
          }
        }

        // Сервер всё ещё недоступен
        this.serverStatus = 'offline'
        this.resetRetryTimer()
      } catch (err) {
        // Ошибка подключения
        console.error('Server check failed:', err)
        this.serverStatus = 'offline'
        this.resetRetryTimer()
      } finally {
        this.retrying = false
      }
    },

    resetRetryTimer() {
      this.autoRetryIn = 30
      if (this.retryInterval) {
        clearInterval(this.retryInterval)
      }
      this.startAutoRetry()
    },
  },
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #0f0a1a 50%, #0a0a0a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.error-container {
  max-width: 900px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 1;
}

/* ═══════════════════════════════════════════ */
/* АНИМАЦИЯ СЕРВЕРА */
/* ═══════════════════════════════════════════ */
.error-animation {
  margin-bottom: 60px;
  position: relative;
}

.server-icon {
  position: relative;
  display: inline-block;
  margin-bottom: 30px;
}

.icon-main {
  width: 120px;
  height: 120px;
  color: #ff416c;
  filter: drop-shadow(0 0 30px rgba(255, 65, 108, 0.5));
  animation: serverPulse 2s ease-in-out infinite;
}

@keyframes serverPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  border: 3px solid rgba(255, 65, 108, 0.5);
  border-radius: 50%;
  animation: pulse 2s ease-out infinite;
}

.pulse-ring.delay-1 {
  animation-delay: 0.5s;
}

.pulse-ring.delay-2 {
  animation-delay: 1s;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

.error-code {
  font-size: 100px;
  font-weight: 900;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin: 0;
}

/* ═══════════════════════════════════════════ */
/* СТАТУС СЕРВЕРА */
/* ═══════════════════════════════════════════ */
.server-status {
  margin-bottom: 40px;
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}

.status-indicator.offline .status-dot {
  background: #ff4b2b;
  box-shadow: 0 0 10px rgba(255, 75, 43, 0.5);
}

.status-indicator.offline span {
  color: #ff4b2b;
}

.status-indicator.checking .status-dot {
  background: #ffc107;
  box-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
}

.status-indicator.checking span {
  color: #ffc107;
}

.status-indicator.online .status-dot {
  background: #4caf50;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.status-indicator.online span {
  color: #4caf50;
}

@keyframes pulse-dot {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

/* ═══════════════════════════════════════════ */
/* КОНТЕНТ */
/* ═══════════════════════════════════════════ */
.error-content {
  margin-bottom: 60px;
}

.error-title {
  font-size: 42px;
  font-weight: 900;
  margin: 0 0 24px;
  color: white;
}

.error-description {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 50px;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* ═══════════════════════════════════════════ */
/* СТАТУС ИНФОРМАЦИЯ */
/* ═══════════════════════════════════════════ */
.status-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.status-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
  text-align: left;
  transition: all 0.3s;
}

.status-item:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 65, 108, 0.3);
  transform: translateY(-4px);
}

.status-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.status-text h4 {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px;
  color: white;
}

.status-text p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  line-height: 1.5;
}

/* ═══════════════════════════════════════════ */
/* ДЕЙСТВИЯ */
/* ═══════════════════════════════════════════ */
.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  border: none;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-btn svg {
  width: 22px;
  height: 22px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  box-shadow: 0 10px 30px rgba(255, 65, 108, 0.3);
}

.action-btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(255, 65, 108, 0.4);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-timer {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */
@media (max-width: 768px) {
  .icon-main {
    width: 80px;
    height: 80px;
  }

  .error-code {
    font-size: 80px;
  }

  .error-title {
    font-size: 28px;
  }

  .error-description {
    font-size: 16px;
  }

  .status-info {
    grid-template-columns: 1fr;
  }

  .error-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
