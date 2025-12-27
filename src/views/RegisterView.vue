<template>
  <div class="register-page">
    <!-- Фоновые эффекты -->
    <div class="register-bg">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>

    <!-- Форма регистрации -->
    <div class="register-card">
      <!-- Логотип -->
      <div class="register-header">
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
        <p>Создайте новый аккаунт</p>
      </div>

      <!-- Ошибка -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Успех -->
      <div v-if="success" class="success-message">
        {{ success }}
      </div>

      <!-- Форма -->
      <form class="register-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Имя</label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Введите ваше имя"
            class="form-input"
            required
            minlength="2"
            maxlength="100"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="username">Логин</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Выберите логин"
            class="form-input"
            required
            minlength="3"
            maxlength="50"
            pattern="[a-zA-Z0-9_-]+"
            :disabled="loading"
          />
          <span class="form-hint">Только буквы, цифры, _ и -</span>
        </div>

        <div class="form-group">
          <label for="password">Пароль</label>
          <div class="password-wrapper">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Придумайте пароль"
              class="form-input"
              required
              minlength="8"
              maxlength="72"
              :disabled="loading"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="password-toggle"
              :disabled="loading"
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
          <span class="form-hint">Минимум 8 символов</span>
        </div>

        <div class="form-group">
          <label for="password-confirm">Повторите пароль</label>
          <div class="password-wrapper">
            <input
              id="password-confirm"
              v-model="passwordConfirm"
              :type="showPasswordConfirm ? 'text' : 'password'"
              placeholder="Повторите пароль"
              class="form-input"
              required
              :disabled="loading"
            />
            <button
              type="button"
              @click="showPasswordConfirm = !showPasswordConfirm"
              class="password-toggle"
              :disabled="loading"
            >
              <svg v-if="!showPasswordConfirm" viewBox="0 0 24 24">
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

        <!-- Секретный ключ -->
        <div class="form-group secret-key-group">
          <label for="admin-key">
            <svg viewBox="0 0 24 24" class="key-icon">
              <path
                d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
                fill="currentColor"
              />
            </svg>
            Секретный ключ
          </label>
          <input
            id="admin-key"
            v-model="adminKey"
            type="password"
            placeholder="Введите секретный ключ регистрации"
            class="form-input secret-input"
            required
            :disabled="loading"
          />
          <span class="form-hint secret-hint"> 🔐 Регистрация доступна только по приглашению </span>
        </div>

        <button type="submit" class="register-btn" :disabled="loading">
          <span v-if="!loading">Создать аккаунт</span>
          <div v-else class="btn-spinner"></div>
        </button>
      </form>

      <!-- Футер -->
      <div class="register-footer">
        <p>Уже есть аккаунт?</p>
        <router-link to="/login" class="login-link">Войти</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterView',
  data() {
    return {
      name: '',
      username: '',
      password: '',
      passwordConfirm: '',
      adminKey: '',
      showPassword: false,
      showPasswordConfirm: false,
      loading: false,
      error: null,
      success: null,
    }
  },
  methods: {
    async handleRegister() {
      this.error = null
      this.success = null

      // Валидация
      if (this.password !== this.passwordConfirm) {
        this.error = 'Пароли не совпадают'
        return
      }

      if (this.password.length < 8) {
        this.error = 'Пароль должен содержать минимум 8 символов'
        return
      }

      if (this.password.length > 72) {
        this.error = 'Пароль не должен превышать 72 символа'
        return
      }

      if (this.username.length < 3) {
        this.error = 'Логин должен содержать минимум 3 символа'
        return
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(this.username)) {
        this.error = 'Логин может содержать только буквы, цифры, _ и -'
        return
      }

      if (!this.adminKey.trim()) {
        this.error = 'Введите секретный ключ регистрации'
        return
      }

      this.loading = true

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/register`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: this.username,
              password: this.password,
              name: this.name,
              admin_key: this.adminKey,
            }),
          },
        )

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.detail || 'Ошибка регистрации')
        }

        const data = await response.json()

        // Сохраняем токен
        localStorage.setItem('token', data.access_token)

        // Показываем успех
        this.success = 'Регистрация успешна! Перенаправление...'

        // Редирект через 1 секунду
        setTimeout(() => {
          this.$router.push('/')
        }, 1000)
      } catch (err) {
        this.error = err.message || 'Ошибка регистрации'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.register-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: radial-gradient(circle at top, #1a0a1f, #000);
  overflow: hidden;
}

/* ═══════════════════════════════════════════ */
/* ФОНОВЫЕ ЭФФЕКТЫ */
/* ═══════════════════════════════════════════ */
.register-bg {
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
  right: -200px;
  animation-delay: 0s;
}

.circle-2 {
  width: 600px;
  height: 600px;
  bottom: -300px;
  left: -300px;
  animation-delay: 7s;
}

.circle-3 {
  width: 500px;
  height: 500px;
  top: 50%;
  right: 10%;
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
/* КАРТОЧКА РЕГИСТРАЦИИ */
/* ═══════════════════════════════════════════ */
.register-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 500px;
  padding: 50px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

/* ═══════════════════════════════════════════ */
/* HEADER */
/* ═══════════════════════════════════════════ */
.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 65, 108, 0.1);
  border-radius: 20px;
  padding: 14px;
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

.register-header h1 {
  font-size: 32px;
  font-weight: 900;
  margin: 0 0 8px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.register-header p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

/* ═══════════════════════════════════════════ */
/* СООБЩЕНИЯ */
/* ═══════════════════════════════════════════ */
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

.success-message {
  padding: 14px 18px;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 12px;
  color: #4caf50;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 24px;
  animation: slideIn 0.5s;
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

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ═══════════════════════════════════════════ */
/* ФОРМА */
/* ═══════════════════════════════════════════ */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.key-icon {
  width: 18px;
  height: 18px;
  color: #ffc107;
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
}

.form-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 65, 108, 0.5);
  box-shadow: 0 0 20px rgba(255, 65, 108, 0.2);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.form-hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
}

.password-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s;
}

.password-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}

.password-toggle svg {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.5);
}

/* ═══════════════════════════════════════════ */
/* СЕКРЕТНЫЙ КЛЮЧ */
/* ═══════════════════════════════════════════ */
.secret-key-group {
  background: rgba(255, 193, 7, 0.05);
  border: 1px solid rgba(255, 193, 7, 0.2);
  border-radius: 16px;
  padding: 20px;
  margin-top: 8px;
}

.secret-input {
  background: rgba(255, 193, 7, 0.1) !important;
  border-color: rgba(255, 193, 7, 0.3) !important;
}

.secret-input:focus {
  border-color: rgba(255, 193, 7, 0.6) !important;
  box-shadow: 0 0 20px rgba(255, 193, 7, 0.2) !important;
}

.secret-hint {
  color: rgba(255, 193, 7, 0.8) !important;
  font-weight: 600 !important;
}

/* ═══════════════════════════════════════════ */
/* КНОПКА */
/* ═══════════════════════════════════════════ */
.register-btn {
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
  margin-top: 8px;
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(255, 65, 108, 0.4);
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-spinner {
  width: 22px;
  height: 22px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ═══════════════════════════════════════════ */
/* ФУТЕР */
/* ═══════════════════════════════════════════ */
.register-footer {
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.register-footer p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 12px;
}

.login-link {
  display: inline-block;
  color: #ff416c;
  text-decoration: none;
  font-size: 15px;
  font-weight: 700;
  padding: 8px 24px;
  border-radius: 8px;
  background: rgba(255, 65, 108, 0.1);
  transition: all 0.3s;
}

.login-link:hover {
  background: rgba(255, 65, 108, 0.2);
  transform: translateY(-2px);
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */
@media (max-width: 580px) {
  .register-card {
    padding: 30px 24px;
  }

  .register-header h1 {
    font-size: 28px;
  }

  .form-input {
    padding: 12px 14px;
    font-size: 14px;
  }

  .register-btn {
    padding: 14px;
  }

  .secret-key-group {
    padding: 16px;
  }
}
</style>
