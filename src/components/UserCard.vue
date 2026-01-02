<template>
  <div class="user-card">
    <router-link :to="`/profile/${user.id}`" class="user-link">
      <div class="user-avatar">
        <img :src="user.avatar_url" :alt="user.name" />
        <!-- ОНЛАЙН ИНДИКАТОР -->
        <div :class="['online-indicator', { online: isOnline }]">
          <span class="status-dot"></span>
        </div>
      </div>

      <div class="user-info">
        <h3 class="user-name">{{ user.name }}</h3>
        <p class="user-username">@{{ user.username }}</p>
      </div>
    </router-link>

    <div class="user-actions">
      <!-- Заявка отправлена -->
      <button
        v-if="friendshipStatus.status === 'pending' && friendshipStatus.is_sender"
        class="action-btn pending"
        disabled
      >
        <IconCheck :size="18" />
        Заявка отправлена
      </button>

      <!-- Входящая заявка -->
      <button
        v-else-if="friendshipStatus.status === 'pending' && !friendshipStatus.is_sender"
        class="action-btn incoming"
        @click="handleAcceptRequest"
      >
        <IconCheck :size="18" />
        Принять заявку
      </button>

      <!-- Уже друзья -->
      <button
        v-else-if="friendshipStatus.is_friend"
        class="action-btn friends"
        @click="handleRemoveFriend"
      >
        <IconCheck :size="18" />
        В друзьях
      </button>

      <!-- Добавить в друзья -->
      <button v-else class="action-btn add" @click="handleAddFriend" :disabled="adding">
        <IconUserPlus :size="18" />
        {{ adding ? 'Отправка...' : 'Добавить' }}
      </button>
    </div>
  </div>
</template>

<script>
import { animeApi } from '@/api/animeApi'

export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      required: true,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['refresh'],
  data() {
    return {
      friendshipStatus: {
        is_friend: false,
        status: null,
        friendship_id: null,
        is_sender: false,
      },
      adding: false,
    }
  },
  async mounted() {
    await this.checkFriendshipStatus()
  },
  methods: {
    async checkFriendshipStatus() {
      try {
        this.friendshipStatus = await animeApi.checkFriendship(this.user.id)
      } catch (err) {
        console.error('Ошибка проверки дружбы:', err)
      }
    },

    async handleAddFriend() {
      try {
        this.adding = true
        await animeApi.addFriend(this.user.id)
        await this.checkFriendshipStatus()
        this.$emit('refresh')
      } catch (err) {
        console.error('Ошибка:', err)
        alert(err.message || 'Не удалось отправить заявку')
      } finally {
        this.adding = false
      }
    },

    async handleAcceptRequest() {
      try {
        await animeApi.acceptFriendRequest(this.friendshipStatus.friendship_id)
        await this.checkFriendshipStatus()
        this.$emit('refresh')
      } catch (err) {
        console.error('Ошибка:', err)
        alert('Не удалось принять заявку')
      }
    },

    async handleRemoveFriend() {
      if (!confirm(`Удалить ${this.user.name} из друзей?`)) return

      try {
        await animeApi.removeFriend(this.friendshipStatus.friendship_id)
        await this.checkFriendshipStatus()
        this.$emit('refresh')
      } catch (err) {
        console.error('Ошибка:', err)
        alert('Не удалось удалить из друзей')
      }
    },
  },
}
</script>

<style scoped>
.user-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s;
}

.user-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.user-link {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  text-decoration: none;
  color: inherit;
}

.user-avatar {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 4px;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-username {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-actions {
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

.action-btn.add {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  box-shadow: 0 6px 20px rgba(255, 65, 108, 0.3);
}

.action-btn.add:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 65, 108, 0.4);
}

.action-btn.add:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-btn.pending {
  background: rgba(255, 193, 7, 0.2);
  border: 1px solid rgba(255, 193, 7, 0.4);
  color: #ffc107;
  cursor: not-allowed;
}

.action-btn.incoming {
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid rgba(76, 175, 80, 0.4);
  color: #4caf50;
}

.action-btn.incoming:hover {
  background: rgba(76, 175, 80, 0.3);
  border-color: rgba(76, 175, 80, 0.6);
}

.action-btn.friends {
  background: rgba(33, 150, 243, 0.2);
  border: 1px solid rgba(33, 150, 243, 0.4);
  color: #2196f3;
}

.action-btn.friends:hover {
  background: rgba(244, 67, 54, 0.2);
  border-color: rgba(244, 67, 54, 0.4);
  color: #f44336;
}

/* ОНЛАЙН ИНДИКАТОР */
.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(0, 0, 0, 0.8);
  z-index: 2;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6b7280, #9ca3af);
  transition: all 0.3s;
}

.online-indicator.online .status-dot {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  box-shadow:
    0 0 0 2px rgba(76, 175, 80, 0.2),
    0 0 8px rgba(76, 175, 80, 0.6);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%,
  100% {
    box-shadow:
      0 0 0 2px rgba(76, 175, 80, 0.2),
      0 0 8px rgba(76, 175, 80, 0.6);
  }
  50% {
    box-shadow:
      0 0 0 3px rgba(76, 175, 80, 0.3),
      0 0 12px rgba(76, 175, 80, 0.8);
  }
}
</style>
