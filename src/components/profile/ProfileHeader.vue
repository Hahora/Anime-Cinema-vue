<template>
  <div class="profile-header">
    <div class="header-cover" :style="{ backgroundImage: `url(${profile.cover_url})` }">
      <div class="cover-overlay"></div>
    </div>

    <div class="header-content">
      <div class="profile-main">
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <img :src="profile.avatar_url" :alt="profile.name" class="profile-avatar" />
            <div
              v-if="!isOwnProfile"
              :class="['online-indicator', { online: isOnline }]"
              :title="isOnline ? 'Онлайн' : 'Не в сети'"
            >
              <span class="status-dot"></span>
            </div>

            <!-- Кнопка редактирования только для своего профиля -->
            <button v-if="isOwnProfile" class="avatar-edit-btn" @click="$emit('edit-avatar')">
              <svg viewBox="0 0 24 24">
                <path
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="profile-info">
          <h1 class="profile-name">{{ profile.name }}</h1>
          <p class="profile-username">@{{ profile.username }}</p>
          <p class="profile-bio">{{ profile.bio }}</p>
          <div class="profile-stats">
            <div class="stat-item">
              <span class="stat-value">{{ profile.total_anime }}</span>
              <span class="stat-label">Аниме</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ profile.total_episodes }}</span>
              <span class="stat-label">Серий</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ profile.total_hours }}</span>
              <span class="stat-label">Часов</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Действия -->
      <div class="profile-actions">
        <button
          v-if="!isOwnProfile"
          @click="handleFriendAction"
          :disabled="friendActionLoading"
          :class="['action-btn', 'friend-btn', friendStatusClass]"
        >
          <svg viewBox="0 0 24 24">
            <!-- Добавить в друзья -->
            <path
              v-if="friendshipStatus === 'none'"
              d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
              fill="currentColor"
            />
            <!-- Заявка отправлена -->
            <path
              v-else-if="friendshipStatus === 'pending_sent'"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              fill="currentColor"
            />
            <!-- Принять заявку -->
            <path
              v-else-if="friendshipStatus === 'pending_received'"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
              fill="currentColor"
            />
            <!-- В друзьях -->
            <path
              v-else-if="friendshipStatus === 'friends'"
              d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
              fill="currentColor"
            />
          </svg>
          <span>{{ friendButtonText }}</span>
        </button>
        <!-- Кнопка "Поделиться" для всех -->
        <button class="action-btn secondary" @click="shareProfile" :class="{ copied: copied }">
          <svg v-if="!copied" viewBox="0 0 24 24">
            <path
              d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
              fill="currentColor"
            />
          </svg>
          <svg v-else viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
          </svg>
          {{ copied ? 'Скопировано!' : 'Поделиться' }}
        </button>

        <!-- Настройки только для своего профиля -->
        <button v-if="isOwnProfile" class="action-btn primary" @click="$emit('open-settings')">
          <svg viewBox="0 0 24 24">
            <path
              d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
              fill="currentColor"
            />
          </svg>
          Настройки
        </button>
      </div>
    </div>

    <!-- Уведомление о копировании -->
    <transition name="toast-fade">
      <div v-if="showToast" class="toast-notification">
        <svg viewBox="0 0 24 24" class="toast-icon">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
        </svg>
        Ссылка на профиль скопирована!
      </div>
    </transition>
  </div>
</template>

<script>
import { animeApi } from '@/api/animeApi'
import { wsService } from '@/services/websocket'

export default {
  name: 'ProfileHeader',
  props: {
    profile: {
      type: Object,
      required: true,
    },
    isOwnProfile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      copied: false,
      showToast: false,
      friendshipStatus: 'none',
      friendshipId: null,
      friendActionLoading: false,
      isOnline: false, // ✅ Добавьте это
    }
  },
  emits: ['edit-avatar', 'open-settings'],
  computed: {
    friendStatusClass() {
      return {
        'btn-add': this.friendshipStatus === 'none',
        'btn-pending': this.friendshipStatus === 'pending_sent',
        'btn-accept': this.friendshipStatus === 'pending_received',
        'btn-friends': this.friendshipStatus === 'friends',
      }
    },
    friendButtonText() {
      switch (this.friendshipStatus) {
        case 'none':
          return 'Добавить в друзья'
        case 'pending_sent':
          return 'Заявка отправлена'
        case 'pending_received':
          return 'Принять заявку'
        case 'friends':
          return 'В друзьях'
        default:
          return ''
      }
    },
  },
  watch: {
    profile: {
      immediate: true,
      handler() {
        if (!this.isOwnProfile && this.profile) {
          this.loadFriendshipStatus()
          this.checkOnlineStatus() // ✅ Проверяем онлайн статус
        }
      },
    },
  },
  mounted() {
    // ✅ Подписываемся на изменения онлайн статуса
    if (!this.isOwnProfile && this.profile) {
      this.onlineStatusHandler = (data) => {
        if (data.user_id === this.profile.id) {
          this.isOnline = data.is_online
          console.log(
            `👤 User ${this.profile.name} is now ${data.is_online ? '🟢 ONLINE' : '⚪ OFFLINE'}`,
          )
        }
      }
      wsService.on('online_status_changed', this.onlineStatusHandler)
    }
  },
  beforeUnmount() {
    // ✅ Отписываемся от событий
    if (this.onlineStatusHandler) {
      wsService.off('online_status_changed', this.onlineStatusHandler)
    }
  },
  methods: {
    // ✅ НОВЫЙ МЕТОД: Проверка онлайн статуса
    async checkOnlineStatus() {
      if (!this.profile) return

      try {
        // Сначала проверяем в WebSocket сервисе
        this.isOnline = wsService.isUserOnline(this.profile.id)

        // Затем запрашиваем с сервера (на случай если WS еще не подключен)
        const status = await animeApi.checkUserOnline(this.profile.id)
        this.isOnline = status.is_online

        console.log(`👤 User ${this.profile.name} online status:`, this.isOnline)
      } catch (err) {
        console.error('Ошибка проверки онлайн статуса:', err)
      }
    },

    async loadFriendshipStatus() {
      try {
        const status = await animeApi.getFriendshipStatus(this.profile.id)
        this.friendshipStatus = status.status
        this.friendshipId = status.friendship_id || null
      } catch (err) {
        console.error('Ошибка загрузки статуса дружбы:', err)
      }
    },

    async handleFriendAction() {
      this.friendActionLoading = true

      try {
        if (this.friendshipStatus === 'none') {
          await animeApi.addFriend(this.profile.id)
          this.friendshipStatus = 'pending_sent'
        } else if (this.friendshipStatus === 'pending_sent') {
          if (this.friendshipId) {
            await animeApi.removeFriend(this.friendshipId)
            this.friendshipStatus = 'none'
            this.friendshipId = null
          }
        } else if (this.friendshipStatus === 'pending_received') {
          if (this.friendshipId) {
            await animeApi.acceptFriendRequest(this.friendshipId)
            this.friendshipStatus = 'friends'
          }
        } else if (this.friendshipStatus === 'friends') {
          const confirmed = confirm('Удалить из друзей?')
          if (confirmed && this.friendshipId) {
            await animeApi.removeFriend(this.friendshipId)
            this.friendshipStatus = 'none'
            this.friendshipId = null
          }
        }
      } catch (err) {
        console.error('Ошибка действия с другом:', err)
        alert('Произошла ошибка. Попробуйте позже.')
      } finally {
        this.friendActionLoading = false
      }
    },

    async shareProfile() {
      const profileUrl = `${window.location.origin}/profile/${this.profile.id}`

      try {
        if (navigator.share) {
          await navigator.share({
            title: `Профиль ${this.profile.name}`,
            text: `Посмотрите профиль ${this.profile.name} в Anime Cinema!`,
            url: profileUrl,
          })
        } else {
          await navigator.clipboard.writeText(profileUrl)
          this.showCopiedFeedback()
        }
      } catch (err) {
        this.fallbackCopyToClipboard(profileUrl)
        this.showCopiedFeedback()
      }
    },

    fallbackCopyToClipboard(text) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        document.execCommand('copy')
      } catch (err) {
        console.error('Ошибка копирования:', err)
      }

      document.body.removeChild(textArea)
    },

    showCopiedFeedback() {
      this.copied = true
      this.showToast = true

      setTimeout(() => {
        this.copied = false
      }, 2000)

      setTimeout(() => {
        this.showToast = false
      }, 3000)
    },
  },
}
</script>

<style scoped>
.profile-header {
  position: relative;
  margin-bottom: 40px;
}

.header-cover {
  height: 400px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, #0a0a0a 100%);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  margin-top: -120px;
}

.profile-main {
  display: flex;
  gap: 30px;
  align-items: flex-end;
  margin-bottom: 30px;
}

/* ═══════════════════════════════════════════ */
/* АВАТАР */
/* ═══════════════════════════════════════════ */
.avatar-section {
  flex-shrink: 0;
}

.avatar-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  border: 6px solid #0a0a0a;
  object-fit: cover;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 8px;
  left: 8px;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: 3px solid #0a0a0a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 2;
}

.avatar-edit-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(255, 65, 108, 0.5);
}

.avatar-edit-btn svg {
  width: 20px;
  height: 20px;
  color: white;
}

/* ═══════════════════════════════════════════ */
/* ОНЛАЙН ИНДИКАТОР*/
/* ═══════════════════════════════════════════ */
.online-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: #0a0a0a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #0a0a0a;
  z-index: 2;
  cursor: help;
  transition: all 0.3s;
}

.online-indicator:hover {
  transform: scale(1.1);
}

.status-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6b7280, #9ca3af);
  transition: all 0.3s;
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Онлайн - зеленый с градиентом и свечением */
.online-indicator.online .status-dot {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.1),
    0 0 0 3px rgba(76, 175, 80, 0.2),
    0 0 12px rgba(76, 175, 80, 0.6),
    0 0 24px rgba(76, 175, 80, 0.4);
  animation: pulse-online 2s ease-in-out infinite;
}

@keyframes pulse-online {
  0%,
  100% {
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.1),
      0 0 0 3px rgba(76, 175, 80, 0.2),
      0 0 12px rgba(76, 175, 80, 0.6),
      0 0 24px rgba(76, 175, 80, 0.4);
  }
  50% {
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.1),
      0 0 0 5px rgba(76, 175, 80, 0.3),
      0 0 16px rgba(76, 175, 80, 0.8),
      0 0 32px rgba(76, 175, 80, 0.6);
  }
}

/* Офлайн - серый */
.online-indicator:not(.online) .status-dot {
  background: linear-gradient(135deg, #6b7280, #9ca3af);
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.2),
    0 0 0 3px rgba(107, 114, 128, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.3);
}

/* ═══════════════════════════════════════════ */
/* КНОПКА ДРУЗЕЙ */
/* ═══════════════════════════════════════════ */
.friend-btn {
  min-width: 200px;
}

.friend-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Добавить в друзья */
.friend-btn.btn-add {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  box-shadow: 0 10px 30px rgba(255, 65, 108, 0.3);
}

.friend-btn.btn-add:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(255, 65, 108, 0.4);
}

/* Заявка отправлена */
.friend-btn.btn-pending {
  background: rgba(255, 193, 7, 0.15);
  border: 1px solid rgba(255, 193, 7, 0.5);
  color: #ffc107;
}

.friend-btn.btn-pending:hover:not(:disabled) {
  background: rgba(255, 193, 7, 0.25);
}

/* Принять заявку */
.friend-btn.btn-accept {
  background: rgba(76, 175, 80, 0.15);
  border: 1px solid rgba(76, 175, 80, 0.5);
  color: #4caf50;
}

.friend-btn.btn-accept:hover:not(:disabled) {
  background: rgba(76, 175, 80, 0.25);
}

/* В друзьях */
.friend-btn.btn-friends {
  background: rgba(33, 150, 243, 0.15);
  border: 1px solid rgba(33, 150, 243, 0.5);
  color: #2196f3;
}

.friend-btn.btn-friends:hover:not(:disabled) {
  background: rgba(33, 150, 243, 0.25);
}

/* ═══════════════════════════════════════════ */
/* ИНФОРМАЦИЯ О ПРОФИЛЕ */
/* ═══════════════════════════════════════════ */
.profile-info {
  flex: 1;
  padding-bottom: 20px;
}

.profile-name {
  font-size: 48px;
  font-weight: 900;
  margin: 0 0 8px;
  background: linear-gradient(135deg, white, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.profile-username {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 12px;
  font-weight: 600;
}

.profile-bio {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 24px;
}

.profile-stats {
  display: flex;
  gap: 40px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 32px;
  font-weight: 900;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

/* ═══════════════════════════════════════════ */
/* ДЕЙСТВИЯ */
/* ═══════════════════════════════════════════ */
.profile-actions {
  display: flex;
  gap: 12px;
  padding-bottom: 20px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
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
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.action-btn.secondary.copied {
  background: rgba(76, 175, 80, 0.2);
  border-color: rgba(76, 175, 80, 0.5);
  color: #4caf50;
}

.action-btn svg {
  width: 20px;
  height: 20px;
}

/* ═══════════════════════════════════════════ */
/* TOAST УВЕДОМЛЕНИЕ */
/* ═══════════════════════════════════════════ */
.toast-notification {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: rgba(76, 175, 80, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(76, 175, 80, 0.4);
  color: white;
  font-size: 15px;
  font-weight: 600;
}

.toast-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */
@media (max-width: 768px) {
  .header-cover {
    height: 250px;
  }

  .header-content {
    padding: 0 20px;
    margin-top: -80px;
  }

  .profile-main {
    flex-direction: column;
    align-items: flex-start;
  }

  .avatar-wrapper {
    width: 120px;
    height: 120px;
  }

  .avatar-edit-btn {
    width: 36px;
    height: 36px;
    bottom: 6px;
    left: 6px;
  }

  .avatar-edit-btn svg {
    width: 16px;
    height: 16px;
  }

  .profile-name {
    font-size: 32px;
  }

  .profile-stats {
    gap: 24px;
  }

  .stat-value {
    font-size: 24px;
  }

  .profile-actions {
    flex-direction: column;
    width: 100%;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .toast-notification {
    bottom: 20px;
    right: 20px;
    left: 20px;
    font-size: 14px;
  }

  .online-indicator {
    width: 28px;
    height: 28px;
    bottom: 6px;
    right: 6px;
    border-width: 3px;
  }

  .status-dot {
    width: 16px;
    height: 16px;
  }

  .online-indicator.online .status-dot {
    box-shadow:
      inset 0 1px 3px rgba(0, 0, 0, 0.1),
      0 0 0 2px rgba(76, 175, 80, 0.2),
      0 0 10px rgba(76, 175, 80, 0.6),
      0 0 20px rgba(76, 175, 80, 0.4);
  }
}
</style>
