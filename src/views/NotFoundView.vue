<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-animation">
        <div class="error-code">404</div>
        <div class="glitch-overlay">404</div>
      </div>

      <div class="error-content">
        <h1 class="error-title">Страница не найдена</h1>
        <p class="error-description">
          Кажется, вы заблудились в мире аниме. Эта страница не существует или была перемещена.
        </p>

        <div class="error-suggestions">
          <h3>Что можно сделать:</h3>
          <ul>
            <li>Проверьте правильность URL</li>
            <li>Вернитесь на главную страницу</li>
            <li>Воспользуйтесь поиском</li>
          </ul>
        </div>

        <div class="error-actions">
          <router-link to="/" class="action-btn primary">
            <svg viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor" />
            </svg>
            На главную
          </router-link>

          <button @click="goBack" class="action-btn secondary">
            <svg viewBox="0 0 24 24">
              <path
                d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                fill="currentColor"
              />
            </svg>
            Назад
          </button>
        </div>
      </div>

      <div class="error-decoration">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView',
  methods: {
    goBack() {
      if (window.history.length > 1) {
        this.$router.go(-1)
      } else {
        this.$router.push('/')
      }
    },
  },
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a0a0f 50%, #0a0a0a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.error-container {
  max-width: 800px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 1;
}

/* ═══════════════════════════════════════════ */
/* АНИМАЦИЯ КОДА ОШИБКИ */
/* ═══════════════════════════════════════════ */
.error-animation {
  position: relative;
  margin-bottom: 60px;
}

.error-code {
  font-size: 180px;
  font-weight: 900;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin: 0;
  animation: pulse 3s ease-in-out infinite;
}

.glitch-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  font-size: 180px;
  font-weight: 900;
  color: rgba(255, 65, 108, 0.3);
  line-height: 1;
  animation: glitch 2s linear infinite;
  pointer-events: none;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes glitch {
  0%,
  100% {
    transform: translate(0);
    opacity: 0.3;
  }
  10% {
    transform: translate(-5px, 5px);
    opacity: 0.5;
  }
  20% {
    transform: translate(5px, -5px);
    opacity: 0.3;
  }
  30% {
    transform: translate(-5px, -5px);
    opacity: 0.4;
  }
  40% {
    transform: translate(5px, 5px);
    opacity: 0.3;
  }
  50% {
    transform: translate(0);
    opacity: 0.3;
  }
}

/* ═══════════════════════════════════════════ */
/* КОНТЕНТ */
/* ═══════════════════════════════════════════ */
.error-content {
  margin-bottom: 60px;
}

.error-title {
  font-size: 48px;
  font-weight: 900;
  margin: 0 0 24px;
  color: white;
}

.error-description {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 40px;
  line-height: 1.6;
}

.error-suggestions {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 40px;
  text-align: left;
}

.error-suggestions h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 20px;
  color: white;
}

.error-suggestions ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.error-suggestions li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
}

.error-suggestions li::before {
  content: '→';
  color: #ff416c;
  font-weight: 700;
  font-size: 20px;
}

/* ═══════════════════════════════════════════ */
/* ДЕЙСТВИЯ */
/* ═══════════════════════════════════════════ */
.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
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

.action-btn svg {
  width: 22px;
  height: 22px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  box-shadow: 0 10px 30px rgba(255, 65, 108, 0.3);
}

.action-btn.primary:hover {
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

/* ═══════════════════════════════════════════ */
/* ДЕКОРАЦИИ */
/* ═══════════════════════════════════════════ */
.error-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.floating-shape {
  position: absolute;
  background: linear-gradient(135deg, rgba(255, 65, 108, 0.1), rgba(255, 75, 43, 0.05));
  border-radius: 50%;
  animation: float 20s ease-in-out infinite;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  left: -10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: 20%;
  right: -5%;
  animation-delay: 5s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 60%;
  left: 5%;
  animation-delay: 10s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(120deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(240deg);
  }
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */
@media (max-width: 768px) {
  .error-code,
  .glitch-overlay {
    font-size: 120px;
  }

  .error-title {
    font-size: 32px;
  }

  .error-description {
    font-size: 16px;
  }

  .error-suggestions {
    padding: 24px;
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
