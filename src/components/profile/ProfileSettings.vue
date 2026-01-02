<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
      <div class="modal-content settings-modal" @click.stop>
        <div class="modal-header">
          <h2>Настройки профиля</h2>
          <button class="modal-close" @click="$emit('close')">
            <IconX :size="20" />
          </button>
        </div>

        <!-- ✅ ВКЛАДКИ -->
        <div class="modal-tabs">
          <button
            :class="['tab-btn', { active: currentTab === 'general' }]"
            @click="currentTab = 'general'"
          >
            <IconUser :size="18" class="tab-icon" />
            Основное
          </button>
          <button
            :class="['tab-btn', { active: currentTab === 'privacy' }]"
            @click="currentTab = 'privacy'"
          >
            <IconShield :size="18" class="tab-icon" />
            Приватность
          </button>
          <button
            :class="['tab-btn', { active: currentTab === 'security' }]"
            @click="currentTab = 'security'"
          >
            <IconLock :size="18" class="tab-icon" />
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
            <div class="settings-section">
              <h3 class="section-title">Кто может писать сообщения</h3>
              <p class="section-description">Выберите, кто может отправлять вам личные сообщения</p>

              <div class="privacy-options">
                <label
                  :class="['privacy-option', { active: formData.message_privacy === 'all' }]"
                  @click="formData.message_privacy = 'all'"
                >
                  <div class="option-radio">
                    <div class="radio-dot"></div>
                  </div>
                  <div class="option-content">
                    <div class="option-header">
                      <IconUsers :size="22" class="option-icon" />
                      <h4>Все пользователи</h4>
                    </div>
                    <p>Любой пользователь может написать вам сообщение</p>
                  </div>
                </label>

                <label
                  :class="[
                    'privacy-option',
                    { active: formData.message_privacy === 'friends_only' },
                  ]"
                  @click="formData.message_privacy = 'friends_only'"
                >
                  <div class="option-radio">
                    <div class="radio-dot"></div>
                  </div>
                  <div class="option-content">
                    <div class="option-header">
                      <IconUserCheck :size="22" class="option-icon" />
                      <h4>Только друзья</h4>
                    </div>
                    <p>Только пользователи из вашего списка друзей могут писать вам</p>
                  </div>
                </label>

                <label
                  :class="['privacy-option', { active: formData.message_privacy === 'nobody' }]"
                  @click="formData.message_privacy = 'nobody'"
                >
                  <div class="option-radio">
                    <div class="radio-dot"></div>
                  </div>
                  <div class="option-content">
                    <div class="option-header">
                      <IconUserX :size="22" class="option-icon" />
                      <h4>Никто</h4>
                    </div>
                    <p>Полная блокировка: вы не сможете ни писать, ни получать сообщения</p>
                  </div>
                </label>
              </div>
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
            v-if="currentTab === 'general' || currentTab === 'privacy'"
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
        message_privacy: 'all', // ✅ Добавлено
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
            message_privacy: newProfile.message_privacy || 'all', // ✅ Синхронизация
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
        console.log('💾 Сохранение настроек:', this.formData)

        // Отправляем обновленные данные
        await this.$emit('save', this.formData)

        console.log('✅ Настройки сохранены успешно')

        // Показываем уведомление (опционально)
        // alert('Настройки успешно сохранены!')
      } catch (err) {
        console.error('❌ Ошибка сохранения:', err)
        alert('Не удалось сохранить настройки')
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

.modal-close {
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
/* НАСТРОЙКИ ПРИВАТНОСТИ */
/* ═══════════════════════════════════════════ */
.settings-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px;
}

.section-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 20px;
  line-height: 1.5;
}

.privacy-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.privacy-option {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.privacy-option:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
}

.privacy-option.active {
  background: rgba(255, 65, 108, 0.1);
  border-color: rgba(255, 65, 108, 0.5);
}

.option-radio {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s;
  margin-top: 2px;
}

.privacy-option.active .option-radio {
  border-color: #ff416c;
  background: rgba(255, 65, 108, 0.2);
}

.radio-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: transparent;
  transition: all 0.3s;
}

.privacy-option.active .radio-dot {
  background: #ff416c;
  box-shadow: 0 0 8px rgba(255, 65, 108, 0.6);
}

.option-content {
  flex: 1;
}

.option-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.option-icon {
  color: rgba(255, 255, 255, 0.6);
  flex-shrink: 0;
}

.privacy-option.active .option-icon {
  color: #ff416c;
}

.option-header h4 {
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.option-content p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  line-height: 1.4;
}

.privacy-notice {
  display: flex;
  gap: 12px;
  padding: 14px;
  background: rgba(66, 153, 225, 0.1);
  border: 1px solid rgba(66, 153, 225, 0.3);
  border-radius: 12px;
  margin-top: 20px;
}

.notice-icon {
  width: 22px;
  height: 22px;
  color: #4299e1;
  flex-shrink: 0;
}

.privacy-notice p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.5;
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

  .modal-body {
    padding: 24px;
  }

  .modal-footer {
    padding: 20px 24px;
  }
}

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

  .modal-tabs {
    padding: 0 20px;
  }

  .tab-btn {
    padding: 12px 0;
    font-size: 11px;
    flex: 1;
    justify-content: center;
    flex-direction: column;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-footer {
    padding: 16px 20px;
  }

  .privacy-option {
    padding: 14px;
  }

  .option-radio {
    width: 20px;
    height: 20px;
  }

  .radio-dot {
    width: 10px;
    height: 10px;
  }

  .option-header h4 {
    font-size: 15px;
  }

  .option-content p {
    font-size: 13px;
  }
}
</style>
