<template>
  <div class="notification-bell">
    <button class="bell-button" @click="togglePanel" :class="{ active: showPanel }">
      <svg viewBox="0 0 24 24" class="bell-icon">
        <path
          d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"
          fill="currentColor"
        />
      </svg>
      <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
    </button>

    <!-- Панель уведомлений -->
    <transition name="slide-down">
      <div v-if="showPanel" class="notifications-panel">
        <div class="panel-header">
          <h3>Уведомления</h3>
          <button v-if="notifications.length > 0" @click="markAllRead" class="mark-all-btn">
            Прочитать все
          </button>
        </div>

        <div v-if="loading" class="panel-loading">
          <div class="spinner"></div>
          <p>Загрузка...</p>
        </div>

        <div v-else-if="notifications.length === 0" class="panel-empty">
          <svg viewBox="0 0 24 24" class="empty-icon">
            <path
              d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
              fill="currentColor"
            />
          </svg>
          <p>Нет уведомлений</p>
        </div>

        <div v-else class="notifications-list">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-item"
            :class="{ unread: !notification.is_read }"
            @click="handleNotificationClick(notification)"
          >
            <div class="notification-avatar">
              <img
                v-if="notification.sender_avatar"
                :src="notification.sender_avatar"
                :alt="notification.sender_name"
              />
              <div v-else class="avatar-placeholder">
                {{ notification.sender_name?.[0] || '?' }}
              </div>
            </div>

            <div class="notification-content">
              <p class="notification-message">{{ notification.message }}</p>
              <span class="notification-time">{{ formatTime(notification.created_at) }}</span>
            </div>

            <div v-if="!notification.is_read" class="unread-dot"></div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { animeApi } from '@/api/animeApi'
import { wsService } from '@/services/websocket'

export default {
  name: 'NotificationBell',
  data() {
    return {
      showPanel: false,
      notifications: [],
      unreadCount: 0,
      loading: false,
    }
  },
  mounted() {
    this.loadNotifications()
    this.loadUnreadCount()

    // ✅ Подписываемся на WebSocket уведомления
    wsService.on('notification', this.handleNewNotification)
  },
  beforeUnmount() {
    // ✅ Отписываемся от WebSocket
    wsService.off('notification', this.handleNewNotification)
  },
  methods: {
    async loadNotifications() {
      this.loading = true
      try {
        this.notifications = await animeApi.getNotifications()
      } catch (err) {
        console.error('Ошибка загрузки уведомлений:', err)
      } finally {
        this.loading = false
      }
    },

    async loadUnreadCount() {
      try {
        const data = await animeApi.getUnreadNotificationsCount()
        this.unreadCount = data.count
      } catch (err) {
        console.error('Ошибка загрузки счётчика:', err)
      }
    },

    // ✅ Обработка нового уведомления через WebSocket
    handleNewNotification(data) {
      console.log('🔔 New notification:', data)

      // Создаём объект уведомления
      const notification = {
        id: Date.now(), // Временный ID
        type: data.type,
        message: data.message,
        sender_id: data.sender_id || data.accepter_id || data.rejecter_id,
        sender_name: data.sender_name || data.accepter_name || data.rejecter_name,
        sender_avatar: null,
        is_read: false,
        created_at: new Date().toISOString(),
      }

      // Добавляем в начало списка
      this.notifications.unshift(notification)

      // Увеличиваем счётчик
      this.unreadCount++

      // ✅ Показываем браузерное уведомление (опционально)
      this.showBrowserNotification(notification)

      // Перезагружаем данные с сервера
      setTimeout(() => {
        this.loadNotifications()
        this.loadUnreadCount()
      }, 1000)
    },

    // ✅ Браузерные уведомления
    showBrowserNotification(notification) {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Anime Cinema', {
          body: notification.message,
          icon: '/logo.png',
          badge: '/logo.png',
        })
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification('Anime Cinema', {
              body: notification.message,
              icon: '/logo.png',
            })
          }
        })
      }
    },

    togglePanel() {
      this.showPanel = !this.showPanel
      if (this.showPanel) {
        this.loadNotifications()
      }
    },

    async handleNotificationClick(notification) {
      // Помечаем как прочитанное
      if (!notification.is_read && notification.id) {
        try {
          await animeApi.markNotificationRead(notification.id)
          notification.is_read = true
          this.unreadCount = Math.max(0, this.unreadCount - 1)
        } catch (err) {
          console.error('Ошибка пометки уведомления:', err)
        }
      }

      // Закрываем панель
      this.showPanel = false

      // Переходим на нужную страницу
      if (notification.type === 'friend_request') {
        this.$router.push('/users?tab=requests')
      } else if (notification.type === 'friend_accepted') {
        this.$router.push('/users?tab=friends')
      }
    },

    async markAllRead() {
      try {
        await animeApi.markAllNotificationsRead()
        this.notifications.forEach((n) => (n.is_read = true))
        this.unreadCount = 0
      } catch (err) {
        console.error('Ошибка:', err)
      }
    },

    formatTime(timestamp) {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = Math.floor((now - date) / 1000)

      if (diff < 60) return 'только что'
      if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`
      if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`
      if (diff < 604800) return `${Math.floor(diff / 86400)} д назад`

      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    },
  },
}
</script>

<style scoped>
/* ... (стили остаются без изменений) */
.notification-bell {
  position: relative;
}

.bell-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.bell-button:hover,
.bell-button.active {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 65, 108, 0.5);
  transform: translateY(-2px);
}

.bell-icon {
  width: 22px;
  height: 22px;
}

.badge {
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
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  color: white;
  border: 2px solid rgba(10, 10, 10, 0.95);
}

.notifications-panel {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 400px;
  max-height: 500px;
  background: rgba(15, 15, 15, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  z-index: 9999;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.mark-all-btn {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.mark-all-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.panel-loading,
.panel-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #ff416c;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.panel-loading p,
.panel-empty p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.empty-icon {
  width: 60px;
  height: 60px;
  color: rgba(255, 255, 255, 0.3);
}

.notifications-list {
  overflow-y: auto;
  max-height: 400px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.notification-item.unread {
  background: rgba(255, 65, 108, 0.05);
}

.notification-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.notification-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  font-weight: 700;
  font-size: 18px;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-message {
  font-size: 14px;
  color: white;
  margin: 0 0 4px;
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: #ff416c;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 6px;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

@media (max-width: 768px) {
  .notifications-panel {
    width: calc(100vw - 40px);
    right: -20px;
  }
}
</style>
