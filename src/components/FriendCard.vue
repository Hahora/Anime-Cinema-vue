<template>
  <div class="friend-card">
    <router-link :to="`/profile/${otherUser.id}`" class="friend-link">
      <div class="friend-avatar">
        <img :src="otherUser.avatar_url" :alt="otherUser.name" />
        <div class="online-indicator"></div>
      </div>

      <div class="friend-info">
        <h3 class="friend-name">{{ otherUser.name }}</h3>
        <p class="friend-username">@{{ otherUser.username }}</p>
        <p class="friend-since">Друзья с {{ formatDate(friendship.created_at) }}</p>
      </div>
    </router-link>

    <div class="friend-actions">
      <router-link :to="`/profile/${otherUser.id}`" class="action-btn view">
        <svg viewBox="0 0 24 24">
          <path
            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
            fill="currentColor"
          />
        </svg>
        Профиль
      </router-link>

      <button class="action-btn remove" @click="handleRemove" :disabled="loading">
        <svg viewBox="0 0 24 24">
          <path
            d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            fill="currentColor"
          />
        </svg>
        Удалить
      </button>
    </div>
  </div>
</template>

<script>
import { animeApi } from '@/api/animeApi'

export default {
  name: 'FriendCard',
  props: {
    friendship: {
      type: Object,
      required: true,
    },
  },
  emits: ['refresh'],
  data() {
    return {
      currentUserId: null,
      loading: false,
    }
  },
  computed: {
    // ✅ ИСПРАВЛЕНО: определяем "другого" пользователя
    otherUser() {
      if (!this.currentUserId) return this.friendship.friend || this.friendship.user

      // Если я - user, возвращаем friend
      if (this.friendship.user?.id === this.currentUserId) {
        return this.friendship.friend
      }
      // Если я - friend, возвращаем user
      return this.friendship.user
    },
  },
  async mounted() {
    // ✅ Получаем ID текущего пользователя
    try {
      const profile = await animeApi.getProfile()
      this.currentUserId = profile.id
    } catch (err) {
      console.error('Failed to get current user:', err)
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      const months = [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря',
      ]
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
    },

    async handleRemove() {
      if (!confirm(`Удалить ${this.otherUser.name} из друзей?`)) return

      this.loading = true
      try {
        await animeApi.removeFriend(this.friendship.id)
        this.$emit('refresh')
      } catch (err) {
        console.error('Ошибка:', err)
        alert('Не удалось удалить из друзей')
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.friend-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s;
}

.friend-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.friend-link {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  text-decoration: none;
  color: inherit;
}

.friend-avatar {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid rgba(76, 175, 80, 0.5);
}

.friend-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.online-indicator {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 12px;
  height: 12px;
  background: #4caf50;
  border: 2px solid rgba(0, 0, 0, 0.8);
  border-radius: 50%;
}

.friend-info {
  flex: 1;
  min-width: 0;
}

.friend-name {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 4px;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.friend-username {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.friend-since {
  font-size: 12px;
  color: rgba(76, 175, 80, 0.8);
  margin: 0;
}

.friend-actions {
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
  text-decoration: none;
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

.action-btn.view {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  box-shadow: 0 6px 20px rgba(255, 65, 108, 0.3);
}

.action-btn.view:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 65, 108, 0.4);
}

.action-btn.remove {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
}

.action-btn.remove:hover:not(:disabled) {
  background: rgba(244, 67, 54, 0.2);
  border-color: rgba(244, 67, 54, 0.4);
  color: #f44336;
}
</style>
