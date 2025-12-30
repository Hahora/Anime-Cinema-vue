<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
      <div class="modal-content settings-modal" @click.stop>
        <div class="modal-header">
          <h2>Настройки профиля</h2>
          <button class="modal-close" @click="$emit('close')">
            <svg viewBox="0 0 24 24">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <!-- ✅ ВКЛАДКИ -->
        <div class="modal-tabs">
          <button
            :class="['tab-btn', { active: currentTab === 'general' }]"
            @click="currentTab = 'general'"
          >
            <svg viewBox="0 0 24 24" class="tab-icon">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                fill="currentColor"
              />
            </svg>
            Основное
          </button>
          <button
            :class="['tab-btn', { active: currentTab === 'privacy' }]"
            @click="currentTab = 'privacy'"
          >
            <svg viewBox="0 0 24 24" class="tab-icon">
              <path
                d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
                fill="currentColor"
              />
            </svg>
            Приватность
          </button>
          <button
            :class="['tab-btn', { active: currentTab === 'security' }]"
            @click="currentTab = 'security'"
          >
            <svg viewBox="0 0 24 24" class="tab-icon">
              <path
                d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
                fill="currentColor"
              />
            </svg>
            Безопасность
          </button>
        </div>

        <div class="modal-body">
          <!-- ✅ ОСНОВНОЕ -->
          <div v-show="currentTab === 'general'" class="tab-content">
            <div class="settings-group">
              <label>Имя</label>
              <input type="text" v-model="formData.name" class="settings-input" />
            </div>

            <div class="settings-group">
              <label>Биография</label>
              <textarea v-model="formData.bio" class="settings-input" rows="3"></textarea>
            </div>

            <div class="settings-group">
              <label>Аватар URL</label>
              <input type="text" v-model="formData.avatar_url" class="settings-input" />
            </div>

            <div class="settings-group">
              <label>Обложка URL</label>
              <input type="text" v-model="formData.cover_url" class="settings-input" />
            </div>
          </div>

          <!-- ✅ ПРИВАТНОСТЬ -->
          <div v-show="currentTab === 'privacy'" class="tab-content">
            <div class="empty-state">
              <svg viewBox="0 0 24 24" class="empty-icon">
                <path
                  d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
                  fill="currentColor"
                />
              </svg>
              <h3>Настройки приватности</h3>
              <p>Скоро здесь появятся настройки приватности профиля</p>
            </div>
          </div>

          <!-- ✅ БЕЗОПАСНОСТЬ -->
          <div v-show="currentTab === 'security'" class="tab-content">
            <div class="settings-section">
              <h3 class="section-title">Смена логина</h3>
              <div class="settings-group">
                <label>Текущий логин</label>
                <input type="text" :value="profile?.username" class="settings-input" disabled />
              </div>
              <div class="settings-group">
                <label>Новый логин</label>
                <input
                  type="text"
                  v-model="securityData.newUsername"
                  class="settings-input"
                  placeholder="Введите новый логин"
                />
              </div>
              <button
                @click="changeUsername"
                :disabled="!securityData.newUsername || changingUsername"
                class="btn-action"
              >
                {{ changingUsername ? 'Сохранение...' : 'Изменить логин' }}
              </button>
            </div>

            <div class="settings-divider"></div>

            <div class="settings-section">
              <h3 class="section-title">Смена пароля</h3>
              <div class="settings-group">
                <label>Старый пароль</label>
                <input
                  type="password"
                  v-model="securityData.oldPassword"
                  class="settings-input"
                  placeholder="Введите старый пароль"
                />
              </div>
              <div class="settings-group">
                <label>Новый пароль</label>
                <input
                  type="password"
                  v-model="securityData.newPassword"
                  class="settings-input"
                  placeholder="Введите новый пароль"
                />
              </div>
              <div class="settings-group">
                <label>Подтвердите новый пароль</label>
                <input
                  type="password"
                  v-model="securityData.confirmPassword"
                  class="settings-input"
                  placeholder="Повторите новый пароль"
                />
              </div>
              <button
                @click="changePassword"
                :disabled="!canChangePassword || changingPassword"
                class="btn-action"
              >
                {{ changingPassword ? 'Сохранение...' : 'Изменить пароль' }}
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" @click="$emit('close')">Закрыть</button>
          <button
            v-if="currentTab === 'general'"
            class="btn-primary"
            @click="save"
            :disabled="saving"
          >
            {{ saving ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { animeApi } from '@/api/animeApi'

export default {
  name: 'ProfileSettings',
  props: {
    show: Boolean,
    profile: Object,
  },
  data() {
    return {
      currentTab: 'general',
      saving: false,
      formData: {
        name: '',
        bio: '',
        avatar_url: '',
        cover_url: '',
      },
      securityData: {
        newUsername: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      changingUsername: false,
      changingPassword: false,
    }
  },
  computed: {
    canChangePassword() {
      return (
        this.securityData.oldPassword &&
        this.securityData.newPassword &&
        this.securityData.confirmPassword &&
        this.securityData.newPassword === this.securityData.confirmPassword &&
        this.securityData.newPassword.length >= 6
      )
    },
  },
  watch: {
    profile: {
      immediate: true,
      handler(newProfile) {
        if (newProfile) {
          this.formData = {
            name: newProfile.name,
            bio: newProfile.bio,
            avatar_url: newProfile.avatar_url,
            cover_url: newProfile.cover_url,
          }
        }
      },
    },
    show(newVal) {
      if (newVal) {
        // Сбрасываем форму безопасности при открытии
        this.securityData = {
          newUsername: '',
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        }
      }
    },
  },
  methods: {
    async save() {
      this.saving = true
      try {
        await this.$emit('save', this.formData)
      } finally {
        this.saving = false
      }
    },

    async changeUsername() {
      if (!this.securityData.newUsername) return

      this.changingUsername = true
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/change-username`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${animeApi.getToken()}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              new_username: this.securityData.newUsername,
            }),
          },
        )

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.detail || 'Ошибка смены логина')
        }

        const data = await response.json()

        if (data.access_token) {
          localStorage.setItem('token', data.access_token)
        }

        alert('Логин успешно изменён!')
        this.securityData.newUsername = ''

        this.$emit('save', this.formData)
      } catch (err) {
        console.error('Ошибка смены логина:', err)
        alert(err.message || 'Не удалось изменить логин')
      } finally {
        this.changingUsername = false
      }
    },

    async changePassword() {
      if (!this.canChangePassword) return

      if (this.securityData.newPassword !== this.securityData.confirmPassword) {
        alert('Пароли не совпадают')
        return
      }

      if (this.securityData.newPassword.length < 6) {
        alert('Пароль должен быть не менее 6 символов')
        return
      }

      this.changingPassword = true
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/change-password`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${animeApi.getToken()}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              old_password: this.securityData.oldPassword,
              new_password: this.securityData.newPassword,
            }),
          },
        )

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.detail || 'Ошибка смены пароля')
        }

        alert('Пароль успешно изменён!')
        this.securityData = {
          newUsername: '',
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        }
      } catch (err) {
        console.error('Ошибка смены пароля:', err)
        alert(err.message || 'Не удалось изменить пароль')
      } finally {
        this.changingPassword = false
      }
    },
  },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.modal-content {
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.modal-close {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.modal-close:hover {
  background: rgba(255, 65, 108, 0.2);
  transform: rotate(90deg);
}

.modal-close svg {
  width: 20px;
  height: 20px;
  color: white;
}

/* ═══════════════════════════════════════════ */
/* ВКЛАДКИ */
/* ═══════════════════════════════════════════ */
.modal-tabs {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 30px;
  gap: 8px;
  flex-shrink: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Скрываем скроллбар, но оставляем возможность скролла */
.modal-tabs::-webkit-scrollbar {
  display: none;
}

.modal-tabs {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 2px solid transparent;
  position: relative;
  white-space: nowrap;
  flex-shrink: 0;
}

.tab-btn:hover {
  color: rgba(255, 255, 255, 0.8);
}

.tab-btn.active {
  color: white;
  border-bottom-color: #ff416c;
}

.tab-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* ═══════════════════════════════════════════ */
/* КОНТЕНТ */
/* ═══════════════════════════════════════════ */
.modal-body {
  padding: 30px;
  overflow-y: auto;
  flex: 1;
}

.tab-content {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.settings-group {
  margin-bottom: 20px;
}

.settings-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.settings-input {
  width: 100%;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.3s;
}

.settings-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 65, 108, 0.5);
}

.settings-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

textarea.settings-input {
  resize: vertical;
}

/* ═══════════════════════════════════════════ */
/* ПУСТОЕ СОСТОЯНИЕ */
/* ═══════════════════════════════════════════ */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  color: rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px;
}

.empty-state p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* ═══════════════════════════════════════════ */
/* СЕКЦИИ БЕЗОПАСНОСТИ */
/* ═══════════════════════════════════════════ */
.settings-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0 0 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.settings-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 30px 0;
}

.btn-action {
  padding: 12px 24px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 8px;
}

.btn-action:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 65, 108, 0.3);
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ═══════════════════════════════════════════ */
/* FOOTER */
/* ═══════════════════════════════════════════ */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 65, 108, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* ═══════════════════════════════════════════ */
/* АНИМАЦИИ */
/* ═══════════════════════════════════════════ */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.9);
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */

/* Планшеты и средние экраны */
@media (max-width: 768px) {
  .modal-content {
    max-width: 600px;
  }

  .modal-header {
    padding: 20px 24px;
  }

  .modal-header h2 {
    font-size: 20px;
  }

  .modal-tabs {
    padding: 0 24px;
    gap: 6px;
  }

  .tab-btn {
    padding: 12px 16px;
    font-size: 13px;
    gap: 6px;
  }

  .tab-icon {
    width: 16px;
    height: 16px;
  }

  .modal-body {
    padding: 24px;
  }

  .modal-footer {
    padding: 20px 24px;
  }

  .settings-input {
    font-size: 14px;
    padding: 12px 14px;
  }

  .btn-primary,
  .btn-secondary,
  .btn-action {
    padding: 11px 20px;
    font-size: 14px;
  }
}

/* Мобильные устройства */
@media (max-width: 576px) {
  .modal-overlay {
    padding: 0;
  }

  .modal-content {
    border-radius: 0;
    max-height: 100vh;
    height: 100%;
  }

  .modal-header {
    padding: 16px 20px;
  }

  .modal-header h2 {
    font-size: 18px;
  }

  .modal-close {
    width: 36px;
    height: 36px;
  }

  .modal-close svg {
    width: 18px;
    height: 18px;
  }

  .modal-tabs {
    padding: 0 20px;
    gap: 8px;
  }

  .tab-btn {
    padding: 12px 0;
    font-size: 11px;
    gap: 6px;
    flex: 1;
    justify-content: center;
    flex-direction: column;
  }

  .tab-icon {
    width: 20px;
    height: 20px;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-footer {
    padding: 16px 20px;
    flex-wrap: wrap;
  }

  .btn-primary,
  .btn-secondary {
    padding: 11px 18px;
    font-size: 14px;
  }

  .btn-secondary {
    flex: 1;
  }

  .btn-primary {
    flex: 1;
  }

  .settings-input {
    font-size: 14px;
    padding: 12px;
  }

  .btn-action {
    width: 100%;
    padding: 12px;
    font-size: 14px;
  }

  .empty-state {
    padding: 40px 20px;
  }

  .empty-icon {
    width: 64px;
    height: 64px;
  }

  .empty-state h3 {
    font-size: 18px;
  }

  .empty-state p {
    font-size: 14px;
  }

  .section-title {
    font-size: 15px;
  }

  .settings-group label {
    font-size: 12px;
  }
}
</style>
