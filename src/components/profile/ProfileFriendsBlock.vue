<template>
  <div class="friends-block">
    <div class="friends-header">
      <h2 class="friends-title">
        <IconUsers :size="28" class="section-icon" />
        Друзья
        <span v-if="friends.length > 0" class="friends-count">{{ friends.length }}</span>
      </h2>
      <router-link v-if="isOwnProfile" to="/users?tab=friends" class="view-all-btn">
        Показать всех →
      </router-link>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Загрузка друзей...</p>
    </div>

    <div v-else-if="friends.length" class="friends-grid">
      <router-link
        v-for="friend in friends.slice(0, 6)"
        :key="friend.id"
        :to="`/profile/${getOtherUser(friend).id}`"
        class="friend-card"
      >
        <div class="friend-avatar">
          <img :src="getOtherUser(friend).avatar_url" :alt="getOtherUser(friend).name" />
          <div class="online-indicator" :class="{ online: isUserOnline(getOtherUser(friend).id) }">
            <span class="status-dot"></span>
          </div>
        </div>
        <div class="friend-info">
          <h3 class="friend-name">{{ getOtherUser(friend).name }}</h3>
          <p class="friend-username">@{{ getOtherUser(friend).username }}</p>
        </div>
      </router-link>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">👥</div>
      <h3>{{ isOwnProfile ? 'У вас пока нет друзей' : 'У пользователя нет друзей' }}</h3>
      <p>
        {{
          isOwnProfile
            ? 'Найдите интересных людей и добавьте их в друзья'
            : 'Здесь будут отображаться друзья пользователя'
        }}
      </p>
    </div>
  </div>
</template>

<script>
import { animeApi } from '@/api/animeApi'
import { wsService } from '@/services/websocket'

export default {
  name: 'ProfileFriendsBlock',
  props: {
    userId: {
      type: Number,
      required: true,
    },
    isOwnProfile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      friends: [],
      loading: false,
      currentUserId: null,
    }
  },
  mounted() {
    this.loadFriends()
    this.getCurrentUserId()
  },
  watch: {
    userId() {
      this.loadFriends()
    },
  },
  methods: {
    async getCurrentUserId() {
      try {
        this.currentUserId = await animeApi.getCurrentUserId()
      } catch (err) {
        console.error('Ошибка получения ID пользователя:', err)
      }
    },

    async loadFriends() {
      this.loading = true
      try {
        if (this.isOwnProfile) {
          this.friends = await animeApi.getFriends()
        } else {
          this.friends = await animeApi.getUserFriends(this.userId)
        }
      } catch (err) {
        console.error('Ошибка загрузки друзей:', err)
      } finally {
        this.loading = false
      }
    },

    getOtherUser(friendship) {
      if (!this.currentUserId) return friendship.user1 || friendship.user2
      return friendship.user1.id === this.currentUserId ? friendship.user2 : friendship.user1
    },

    isUserOnline(userId) {
      return wsService.isUserOnline(userId)
    },
  },
}
</script>

<style scoped>
.friends-block {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
}

.friends-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.friends-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.section-icon {
  color: #ff416c;
}

.friends-count {
  padding: 4px 12px;
  background: rgba(255, 65, 108, 0.2);
  border-radius: 20px;
  font-size: 16px;
  font-weight: 700;
  color: #ff416c;
}

.view-all-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.view-all-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.6);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 65, 108, 0.3);
  border-top: 3px solid #ff416c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.friends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.friend-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s;
}

.friend-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 65, 108, 0.3);
  transform: translateY(-2px);
}

.friend-avatar {
  position: relative;
  flex-shrink: 0;
}

.friend-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #6c757d;
  transition: all 0.3s;
}

.online-indicator.online .status-dot {
  background: #28a745;
  box-shadow: 0 0 8px rgba(40, 167, 69, 0.6);
}

.friend-info {
  flex: 1;
  min-width: 0;
}

.friend-name {
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.friend-username {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px;
  color: white;
}

.empty-state p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

@media (max-width: 768px) {
  .friends-grid {
    grid-template-columns: 1fr;
  }

  .friends-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
