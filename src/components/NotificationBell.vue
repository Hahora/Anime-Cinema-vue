<template>
  <div class="notification-bell">
    <button class="bell-button" @click="toggleNotifications" :class="{ active: showNotifications }">
      <svg viewBox="0 0 24 24" class="bell-icon">
        <path
          d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"
          fill="currentColor"
        />
      </svg>
      <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
    </button>

    <!-- Выпадающий список уведомлений -->
    <transition name="dropdown">
      <div v-if="showNotifications" class="notifications-dropdown" @click.stop>
        <div class="dropdown-header">
          <h3>Уведомления</h3>
          <button v-if="notifications.length > 0" @click="markAllAsRead" class="mark-read-btn">
            Отметить все
          </button>
        </div>

        <div class="notifications-list">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-item"
            :class="{ unread: !notification.read }"
            @click="handleNotificationClick(notification)"
          >
            <div class="notification-avatar">
              <img :src="notification.avatar" :alt="notification.title" />
              <div class="notification-type-badge" :class="notification.type">
                <svg v-if="notification.type === 'friend_request'" viewBox="0 0 24 24">
                  <path
                    d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                    fill="currentColor"
                  />
                </svg>
                <svg v-else-if="notification.type === 'friend_accepted'" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
                </svg>
              </div>
            </div>

            <div class="notification-content">
              <p class="notification-title">{{ notification.title }}</p>
              <p class="notification-message">{{ notification.message }}</p>
              <span class="notification-time">{{ formatTimeAgo(notification.timestamp) }}</span>
            </div>
          </div>

          <div v-if="notifications.length === 0" class="no-notifications">
            <div class="no-notifications-icon">🔔</div>
            <p>Нет уведомлений</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { animeApi } from '@/api/animeApi'

export default {
  name: 'NotificationBell',
  data() {
    return {
      showNotifications: false,
      unreadCount: 0,
      notifications: [],
      checkInterval: null,
    }
  },
  async mounted() {
    await this.loadNotifications()
    // Проверяем новые уведомления каждые 5 секунд
    this.checkInterval = setInterval(() => {
      this.loadNotifications()
    }, 5000)

    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
    }
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    async loadNotifications() {
      try {
        const notifications = await animeApi.getNotifications(20)

        this.notifications = notifications.map((n) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          avatar: n.sender_avatar,
          timestamp: n.created_at,
          read: n.is_read,
          senderId: n.sender_id,
        }))

        this.unreadCount = this.notifications.filter((n) => !n.read).length
      } catch (err) {
        console.error('Ошибка загрузки уведомлений:', err)
      }
    },

    toggleNotifications() {
      this.showNotifications = !this.showNotifications
    },

    handleClickOutside(event) {
      const bell = this.$el
      if (!bell.contains(event.target)) {
        this.showNotifications = false
      }
    },

    async handleNotificationClick(notification) {
      if (!notification.read) {
        try {
          await animeApi.markNotificationRead(notification.id)
          notification.read = true
          this.unreadCount = this.notifications.filter((n) => !n.read).length
        } catch (err) {
          console.error('Ошибка:', err)
        }
      }

      // Переход в зависимости от типа
      if (notification.type === 'friend_request') {
        this.$router.push('/users?tab=requests')
      } else if (notification.type === 'friend_accepted') {
        this.$router.push('/users?tab=friends')
      } else if (notification.senderId) {
        this.$router.push(`/profile/${notification.senderId}`)
      }

      this.showNotifications = false
    },

    async markAllAsRead() {
      try {
        await animeApi.markAllNotificationsRead()
        this.notifications = this.notifications.map((n) => ({ ...n, read: true }))
        this.unreadCount = 0
      } catch (err) {
        console.error('Ошибка:', err)
      }
    },

    formatTimeAgo(dateString) {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return 'только что'
      if (diffMins < 60) return `${diffMins} мин. назад`
      if (diffHours < 24) return `${diffHours} ч. назад`
      if (diffDays < 7) return `${diffDays} дн. назад`

      return date.toLocaleDateString('ru-RU')
    },
  },
}
</script>

<style scoped>
.notification-bell {
  position: relative;
}

.bell-button {
  position: relative;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.bell-button:hover,
.bell-button.active {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 65, 108, 0.5);
}

.bell-icon {
  width: 24px;
  height: 24px;
  color: white;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  font-size: 12px;
  font-weight: 700;
  border-radius: 10px;
  border: 2px solid #0a0a0a;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* ═══════════════════════════════════════════ */
/* ВЫПАДАЮЩИЙ СПИСОК */
/* ═══════════════════════════════════════════ */
.notifications-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 400px;
  max-height: 600px;
  background: rgba(20, 20, 20, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  z-index: 1000;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dropdown-header h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.mark-read-btn {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.mark-read-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.notifications-list {
  max-height: 500px;
  overflow-y: auto;
}

.notifications-list::-webkit-scrollbar {
  width: 6px;
}

.notifications-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}

.notifications-list::-webkit-scrollbar-thumb {
  background: rgba(255, 65, 108, 0.5);
  border-radius: 3px;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.notification-item.unread {
  background: rgba(255, 65, 108, 0.05);
}

.notification-avatar {
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.notification-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.notification-type-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid rgba(20, 20, 20, 0.98);
}

.notification-type-badge.friend_request {
  background: linear-gradient(135deg, #ffc107, #ff9800);
}

.notification-type-badge.friend_accepted {
  background: linear-gradient(135deg, #4caf50, #45a049);
}

.notification-type-badge svg {
  width: 14px;
  height: 14px;
  color: white;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 4px;
  color: white;
}

.notification-message {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

.no-notifications {
  padding: 60px 20px;
  text-align: center;
}

.no-notifications-icon {
  font-size: 60px;
  margin-bottom: 16px;
  opacity: 0.3;
}

.no-notifications p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 15px;
  margin: 0;
}

/* ═══════════════════════════════════════════ */
/* АНИМАЦИИ */
/* ═══════════════════════════════════════════ */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */
@media (max-width: 768px) {
  .notifications-dropdown {
    width: calc(100vw - 40px);
    right: -20px;
  }
}
</style>
