<template>
  <div class="request-card">
    <router-link :to="`/profile/${sender.id}`" class="request-link">
      <div class="request-avatar">
        <img :src="sender.avatar_url" :alt="sender.name" />
        <div class="request-badge">
          <svg viewBox="0 0 24 24">
            <path
              d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      <div class="request-info">
        <h3 class="request-name">{{ sender.name }}</h3>
        <p class="request-username">@{{ sender.username }}</p>
        <p class="request-time">{{ formatTimeAgo(request.created_at) }}</p>
      </div>
    </router-link>

    <div class="request-actions">
      <button class="action-btn accept" @click="handleAccept" :disabled="processing">
        <svg viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
        </svg>
        Принять
      </button>

      <button class="action-btn reject" @click="handleReject" :disabled="processing">
        <svg viewBox="0 0 24 24">
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            fill="currentColor"
          />
        </svg>
        Отклонить
      </button>
    </div>
  </div>
</template>

<script>
import { animeApi } from '@/api/animeApi'

export default {
  name: 'RequestCard',
  props: {
    request: {
      type: Object,
      required: true,
    },
  },
  emits: ['refresh'],
  data() {
    return {
      processing: false,
    }
  },
  computed: {
    sender() {
      return this.request.user
    },
  },
  methods: {
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

      const day = date.getDate()
      const month = date.getMonth() + 1
      return `${day}.${month}.${date.getFullYear()}`
    },

    async handleAccept() {
      try {
        this.processing = true
        await animeApi.acceptFriendRequest(this.request.id)
        this.$emit('refresh')
      } catch (err) {
        console.error('Ошибка:', err)
        alert('Не удалось принять заявку')
      } finally {
        this.processing = false
      }
    },

    async handleReject() {
      try {
        this.processing = true
        await animeApi.rejectFriendRequest(this.request.id)
        this.$emit('refresh')
      } catch (err) {
        console.error('Ошибка:', err)
        alert('Не удалось отклонить заявку')
      } finally {
        this.processing = false
      }
    },
  },
}
</script>

<style scoped>
.request-card {
  background: rgba(255, 193, 7, 0.05);
  border: 2px solid rgba(255, 193, 7, 0.3);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.request-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ffc107, #ff9800);
}

.request-card:hover {
  background: rgba(255, 193, 7, 0.08);
  border-color: rgba(255, 193, 7, 0.5);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(255, 193, 7, 0.2);
}

.request-link {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  text-decoration: none;
  color: inherit;
}

.request-avatar {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: visible;
  flex-shrink: 0;
}

.request-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  border: 2px solid rgba(255, 193, 7, 0.5);
  object-fit: cover;
}

.request-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #ffc107, #ff9800);
  border: 3px solid rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
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

.request-badge svg {
  width: 16px;
  height: 16px;
  color: white;
}

.request-info {
  flex: 1;
  min-width: 0;
}

.request-name {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 4px;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.request-username {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.request-time {
  font-size: 12px;
  color: rgba(255, 193, 7, 0.8);
  margin: 0;
}

.request-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  white-space: nowrap;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-btn svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.action-btn.accept {
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
}

.action-btn.accept:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(76, 175, 80, 0.4);
}

.action-btn.reject {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
}

.action-btn.reject:hover:not(:disabled) {
  background: rgba(244, 67, 54, 0.2);
  border-color: rgba(244, 67, 54, 0.4);
  color: #f44336;
}
</style>
