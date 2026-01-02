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
          <!-- Добавить в друзья -->
          <IconUserPlus v-if="friendshipStatus === 'none'" :size="20" />

          <!-- Заявка отправлена -->
          <IconCheck v-else-if="friendshipStatus === 'pending_sent'" :size="20" />

          <!-- Принять заявку -->
          <IconAlertCircle v-else-if="friendshipStatus === 'pending_received'" :size="20" />

          <!-- В друзьях -->
          <IconUsers v-else-if="friendshipStatus === 'friends'" :size="20" />

          <span>{{ friendButtonText }}</span>
        </button>

        <!-- Кнопка "Написать сообщение" для всех пользователей -->
        <button class="action-btn message" @click="openChat" :disabled="chatLoading">
          <IconMessage :size="20" />
          {{ isOwnProfile ? 'Мои сообщения' : 'Написать сообщение' }}
        </button>

        <!-- Кнопка "Поделиться" для всех -->
        <button class="action-btn secondary" @click="shareProfile" :class="{ copied: copied }">
          <IconShare2 v-if="!copied" :size="20" />
          <IconCheck v-else :size="20" />
          {{ copied ? 'Скопировано!' : 'Поделиться' }}
        </button>

        <!-- Настройки только для своего профиля -->
        <button v-if="isOwnProfile" class="action-btn primary" @click="$emit('open-settings')">
          <IconSettings :size="20" />
          Настройки
        </button>
      </div>
    </div>

    <!-- Уведомление о копировании -->
    <transition name="toast-fade">
      <div v-if="showToast" class="toast-notification">
        <IconCheck :size="24" class="toast-icon" />
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
      chatLoading: false,
      isOnline: false,
    }
  },
  emits: ['open-settings'],
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
          this.checkOnlineStatus()
        }
      },
    },
  },
  mounted() {
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
    if (this.onlineStatusHandler) {
      wsService.off('online_status_changed', this.onlineStatusHandler)
    }
  },
  methods: {
    async checkOnlineStatus() {
      if (!this.profile) return

      try {
        this.isOnline = wsService.isUserOnline(this.profile.id)
        const status = await animeApi.checkUserOnline(this.profile.id)
        this.isOnline = status.is_online
        console.log(`👤 User ${this.profile.name} online status:`, this.isOnline)
      } catch (err) {
        console.error('Ошибка проверки онлайн статуса:', err)
      }
    },

    // Открытие чата
    async openChat() {
      try {
        this.chatLoading = true

        if (this.isOwnProfile) {
          this.$router.push('/messages')
          return
        }

        // ✅ Загружаем список чатов
        const chats = await animeApi.getChats()

        // ✅ Ищем существующий чат
        const existingChat = chats.find((chat) => chat.other_user_id === this.profile.id)

        if (existingChat) {
          // ✅ Чат существует - открываем его
          this.$router.push(`/messages?chat=${existingChat.id}`)
        } else {
          // ✅ Чата НЕТ - передаём ID для будущего чата (НЕ создаём!)
          this.$router.push(`/messages?newChat=${this.profile.id}`)
        }
      } catch (err) {
        console.error('Ошибка открытия чата:', err)
        alert('Не удалось открыть чат')
      } finally {
        this.chatLoading = false
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
/* КНОПКА СООБЩЕНИЙ */
/* ═══════════════════════════════════════════ */

.action-btn.message {
  background: rgba(33, 150, 243, 0.15);
  border: 1px solid rgba(33, 150, 243, 0.5);
  color: #2196f3;
  min-width: 200px;
}

.action-btn.message:hover:not(:disabled) {
  background: rgba(33, 150, 243, 0.25);
  border-color: rgba(33, 150, 243, 0.7);
  transform: translateY(-2px);
}

.action-btn.message:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
/* МОДАЛЬНОЕ ОКНО ОШИБКИ */
/* ═══════════════════════════════════════════ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.error-modal {
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.98), rgba(15, 15, 15, 0.98));
  border: 1px solid rgba(255, 75, 43, 0.3);
  border-radius: 20px;
  padding: 40px;
  max-width: 480px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(255, 75, 43, 0.3);
  backdrop-filter: blur(20px);
}

.error-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 75, 43, 0.15);
  border: 3px solid rgba(255, 75, 43, 0.4);
  border-radius: 50%;
  color: #ff4b2b;
}

.error-icon svg {
  width: 40px;
  height: 40px;
}

.error-title {
  font-size: 24px;
  font-weight: 900;
  color: white;
  margin: 0 0 16px;
}

.error-message {
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 32px;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.error-btn {
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.error-btn.primary {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  box-shadow: 0 8px 24px rgba(255, 65, 108, 0.3);
}

.error-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(255, 65, 108, 0.4);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .error-modal,
.modal-fade-leave-to .error-modal {
  transform: scale(0.9) translateY(20px);
}

@media (max-width: 768px) {
  .error-modal {
    padding: 32px 24px;
    max-width: 100%;
  }

  .error-icon {
    width: 64px;
    height: 64px;
  }

  .error-icon svg {
    width: 32px;
    height: 32px;
  }

  .error-title {
    font-size: 20px;
  }

  .error-message {
    font-size: 14px;
  }
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

  .action-btn.message {
    min-width: auto;
  }
}
</style>
