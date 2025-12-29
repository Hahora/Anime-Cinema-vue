<template>
  <div class="login-page">
    <!-- Фоновые эффекты -->
    <div class="login-bg">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>

    <!-- Форма входа -->
    <div class="login-card">
      <!-- Логотип -->
      <div class="login-header">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              fill="url(#gradient1)"
              stroke="white"
              stroke-width="1.5"
            />
            <path d="M2 17L12 22L22 17" stroke="url(#gradient2)" stroke-width="1.5" />
            <path d="M2 12L12 17L22 12" stroke="white" stroke-width="1.5" />
            <defs>
              <linearGradient id="gradient1" x1="2" y1="2" x2="22" y2="12">
                <stop stop-color="#ff416c" />
                <stop offset="1" stop-color="#ff4b2b" />
              </linearGradient>
              <linearGradient id="gradient2" x1="2" y1="17" x2="22" y2="22">
                <stop stop-color="#ff416c" />
                <stop offset="1" stop-color="#ff4b2b" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1>Anime Cinema</h1>
        <p>Войдите в аккаунт</p>
      </div>

      <!-- Ошибка -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Форма -->
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Логин</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Введите логин"
            class="form-input"
            required
            autocomplete="username"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password">Пароль</label>
          <div class="password-wrapper">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Введите пароль"
              class="form-input password-input"
              required
              autocomplete="current-password"
              :disabled="loading"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="password-toggle"
              :disabled="loading"
              :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
            >
              <svg v-if="!showPassword" viewBox="0 0 24 24">
                <path
                  d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                  fill="currentColor"
                />
              </svg>
              <svg v-else viewBox="0 0 24 24">
                <path
                  d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="!loading">Войти</span>
          <div v-else class="btn-spinner"></div>
        </button>
      </form>

      <div class="login-footer">
        <p class="footer-text">Нет аккаунта?</p>
        <router-link to="/register" class="register-link">Создать аккаунт</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { animeApi } from '@/api/animeApi'

export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      loading: false,
      error: null,
    }
  },
  methods: {
    async handleLogin() {
      this.error = null
      this.loading = true

      try {
        await animeApi.login(this.username, this.password)

        // Редирект на главную
        this.$router.push('/')
      } catch (err) {
        this.error = err.message || 'Ошибка входа'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: radial-gradient(circle at top, #1a0a1f, #000);
  overflow: hidden;
}

/* ═══════════════════════════════════════════ */
/* ФОНОВЫЕ ЭФФЕКТЫ */
/* ═══════════════════════════════════════════ */
.login-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 65, 108, 0.15), transparent);
  animation: float 20s infinite ease-in-out;
}

.circle-1 {
  width: 400px;
  height: 400px;
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.circle-2 {
  width: 600px;
  height: 600px;
  bottom: -300px;
  right: -300px;
  animation-delay: 7s;
}

.circle-3 {
  width: 500px;
  height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 14s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  33% {
    transform: translate(50px, -50px) scale(1.1);
    opacity: 0.5;
  }
  66% {
    transform: translate(-50px, 50px) scale(0.9);
    opacity: 0.4;
  }
}

/* ═══════════════════════════════════════════ */
/* КАРТОЧКА ВХОДА */
/* ═══════════════════════════════════════════ */
.login-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 440px;
  padding: 40px 30px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

/* ═══════════════════════════════════════════ */
/* HEADER */
/* ═══════════════════════════════════════════ */
.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 65, 108, 0.1);
  border-radius: 18px;
  padding: 12px;
  border: 2px solid rgba(255, 65, 108, 0.3);
  animation: pulse-glow 3s infinite;
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(255, 65, 108, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 65, 108, 0.5);
  }
}

.logo-icon svg {
  width: 100%;
  height: 100%;
}

.login-header h1 {
  font-size: 28px;
  font-weight: 900;
  margin: 0 0 8px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-header p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.error-message {
  padding: 14px 18px;
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 12px;
  color: #f44336;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 24px;
  animation: shake 0.5s;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

/* ═══════════════════════════════════════════ */
/* ФОРМА */
/* ═══════════════════════════════════════════ */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input {
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 15px;
  outline: none;
  transition: all 0.3s;
  width: 100%;
  box-sizing: border-box;
}

.form-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 65, 108, 0.5);
  box-shadow: 0 0 20px rgba(255, 65, 108, 0.2);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.password-wrapper {
  position: relative;
  width: 100%;
}

.password-input {
  padding-right: 48px;
}

.password-toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;
}

.password-toggle:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.password-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.password-toggle svg {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.5);
  display: block;
}

/* ═══════════════════════════════════════════ */
/* КНОПКА */
/* ═══════════════════════════════════════════ */
.login-btn {
  padding: 16px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 10px 30px rgba(255, 65, 108, 0.3);
  margin-top: 4px;
  width: 100%;
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(255, 65, 108, 0.4);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ═══════════════════════════════════════════ */
/* ФУТЕР */
/* ═══════════════════════════════════════════ */
.login-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.footer-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-weight: 500;
}

.register-link {
  display: inline-block;
  color: #ff416c;
  text-decoration: none;
  font-size: 15px;
  font-weight: 700;
  padding: 10px 24px;
  border-radius: 10px;
  background: rgba(255, 65, 108, 0.1);
  transition: all 0.3s;
  border: 1px solid rgba(255, 65, 108, 0.2);
}

.register-link:hover {
  background: rgba(255, 65, 108, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 65, 108, 0.3);
}

.register-link:active {
  transform: translateY(0);
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */

/* Планшеты */
@media (max-width: 768px) {
  .login-page {
    padding: 16px;
  }

  .login-card {
    padding: 32px 24px;
  }

  .logo-icon {
    width: 56px;
    height: 56px;
  }

  .login-header h1 {
    font-size: 26px;
  }
}

/* Мобильные устройства */
@media (max-width: 480px) {
  .login-page {
    padding: 12px;
    align-items: flex-start;
    padding-top: 40px;
  }

  .login-card {
    padding: 28px 20px;
    max-width: 100%;
    border-radius: 20px;
  }

  .login-header {
    margin-bottom: 28px;
  }

  .logo-icon {
    width: 52px;
    height: 52px;
    margin-bottom: 16px;
  }

  .login-header h1 {
    font-size: 24px;
  }

  .login-header p {
    font-size: 14px;
  }

  .form-group label {
    font-size: 12px;
  }

  .form-input {
    padding: 13px 14px;
    font-size: 16px; /* Важно: >= 16px для iOS чтобы не зумило */
  }

  .password-input {
    padding-right: 46px;
  }

  .password-toggle {
    right: 6px;
    padding: 8px;
    min-width: 38px;
    min-height: 38px;
  }

  .password-toggle svg {
    width: 18px;
    height: 18px;
  }

  .login-btn {
    padding: 15px;
    font-size: 15px;
    min-height: 50px;
  }

  .footer-text {
    font-size: 13px;
  }

  .register-link {
    font-size: 14px;
    padding: 9px 20px;
  }

  .error-message {
    font-size: 13px;
    padding: 12px 16px;
  }

  /* Уменьшаем фоновые круги на мобильных */
  .circle-1 {
    width: 300px;
    height: 300px;
  }

  .circle-2 {
    width: 400px;
    height: 400px;
  }

  .circle-3 {
    width: 350px;
    height: 350px;
  }
}

/* Очень маленькие экраны */
@media (max-width: 360px) {
  .login-card {
    padding: 24px 16px;
  }

  .login-header h1 {
    font-size: 22px;
  }

  .logo-icon {
    width: 48px;
    height: 48px;
  }

  .form-input {
    padding: 12px;
  }

  .login-btn {
    min-height: 48px;
  }
}

/*Fix для iOS Safari */
@supports (-webkit-touch-callout: none) {
  .form-input {
    font-size: 16px; /* Предотвращает автозум в iOS */
  }
}
</style>
