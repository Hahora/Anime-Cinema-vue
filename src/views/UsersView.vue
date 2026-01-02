<template>
  <div class="users-page">
    <PageLoader v-if="loading" />

    <div v-else class="users-container">
      <!-- Компактный хедер -->
      <div class="page-header">
        <div class="header-top">
          <h1 class="page-title">
            <IconUsers :size="32" class="title-icon" />
            Пользователи
          </h1>

          <!-- Онлайн статистика -->
          <div class="online-stats">
            <span class="status-dot"></span>
            <span class="online-count">{{ onlineCount }} онлайн</span>
          </div>
        </div>

        <!-- Вкладки -->
        <div class="tabs">
          <button :class="['tab', { active: currentTab === 'all' }]" @click="currentTab = 'all'">
            <IconUser :size="16" />
            Все
            <span v-if="allUsers.length > 0" class="tab-count">{{ allUsers.length }}</span>
          </button>
          <button
            :class="['tab', { active: currentTab === 'friends' }]"
            @click="currentTab = 'friends'"
          >
            <IconUsers :size="16" />
            Друзья
            <span v-if="friends.length > 0" class="tab-badge">{{ friends.length }}</span>
          </button>
          <button
            :class="['tab', { active: currentTab === 'requests' }]"
            @click="currentTab = 'requests'"
          >
            <IconMessageSquare :size="16" />
            Заявки
            <span v-if="requests.length > 0" class="tab-badge">{{ requests.length }}</span>
          </button>
        </div>
      </div>

      <!-- Поиск (только для вкладки "Все пользователи") -->
      <div v-if="currentTab === 'all'" class="search-section">
        <div class="search-box">
          <IconSearch :size="20" class="search-icon" />
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Поиск по имени..."
            class="search-input"
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
            <IconX :size="16" />
          </button>
        </div>
      </div>

      <!-- Контент вкладок -->
      <div class="tab-content">
        <!-- Все пользователи -->
        <div v-if="currentTab === 'all'" class="users-grid">
          <UserCard
            v-for="user in displayedUsers"
            :key="user.id"
            :user="user"
            :is-online="isUserOnline(user.id)"
            @refresh="loadAllData"
          />
          <div v-if="displayedUsers.length === 0" class="no-results">
            <div class="no-results-icon">🔍</div>
            <h3>Пользователи не найдены</h3>
            <p v-if="searchQuery">Попробуйте изменить запрос</p>
          </div>
        </div>

        <!-- Друзья -->
        <div v-if="currentTab === 'friends'" class="users-grid">
          <FriendCard
            v-for="friendship in friends"
            :key="friendship.id"
            :friendship="friendship"
            :current-user-id="currentUserId"
            :is-online="isFriendOnline(friendship)"
            @refresh="loadAllData"
          />

          <div v-if="friends.length === 0" class="no-results">
            <div class="no-results-icon">👥</div>
            <h3>У вас пока нет друзей</h3>
            <p>Добавьте пользователей в друзья!</p>
          </div>
        </div>

        <!-- Заявки -->
        <div v-if="currentTab === 'requests'" class="users-grid">
          <RequestCard
            v-for="request in requests"
            :key="request.id"
            :request="request"
            :is-online="isUserOnline(request.user.id)"
            @refresh="loadAllData"
          />

          <div v-if="requests.length === 0" class="no-results">
            <div class="no-results-icon">📬</div>
            <h3>Нет входящих заявок</h3>
            <p>Заявки в друзья появятся здесь</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageLoader from '@/components/PageLoader.vue'
import UserCard from '@/components/UserCard.vue'
import FriendCard from '@/components/FriendCard.vue'
import RequestCard from '@/components/RequestCard.vue'
import { animeApi } from '@/api/animeApi'
import { wsService } from '@/services/websocket'

export default {
  name: 'UsersView',
  components: {
    PageLoader,
    UserCard,
    FriendCard,
    RequestCard,
  },
  data() {
    return {
      loading: true,
      currentTab: 'all',
      searchQuery: '',
      searchTimeout: null,

      currentUserId: null,
      allUsers: [],
      searchResults: [],
      friends: [],
      requests: [],

      onlineUserIds: new Set(),
    }
  },
  computed: {
    displayedUsers() {
      return this.searchQuery ? this.searchResults : this.allUsers
    },
    onlineCount() {
      return this.onlineUserIds.size
    },
  },
  async mounted() {
    const tabFromQuery = this.$route.query.tab
    if (tabFromQuery && ['all', 'friends', 'requests'].includes(tabFromQuery)) {
      this.currentTab = tabFromQuery
    }

    await this.loadCurrentUser()
    await this.loadAllData()
    await this.loadOnlineUsers()

    this.onlineStatusHandler = (data) => {
      if (data.is_online) {
        this.onlineUserIds.add(data.user_id)
      } else {
        this.onlineUserIds.delete(data.user_id)
      }
    }
    wsService.on('online_status_changed', this.onlineStatusHandler)
  },
  beforeUnmount() {
    if (this.onlineStatusHandler) {
      wsService.off('online_status_changed', this.onlineStatusHandler)
    }
  },
  watch: {
    '$route.query.tab'(newTab) {
      if (newTab && ['all', 'friends', 'requests'].includes(newTab)) {
        this.currentTab = newTab
      }
    },
  },
  methods: {
    async loadOnlineUsers() {
      try {
        const data = await animeApi.getOnlineUsers()
        this.onlineUserIds = new Set(data.online_user_ids)
      } catch (err) {
        console.error('Ошибка загрузки онлайн пользователей:', err)
      }
    },

    isUserOnline(userId) {
      return wsService.isUserOnline(userId) || this.onlineUserIds.has(userId)
    },

    isFriendOnline(friendship) {
      const friendId =
        friendship.user.id === this.currentUserId ? friendship.friend.id : friendship.user.id
      return this.isUserOnline(friendId)
    },

    async loadCurrentUser() {
      try {
        const profile = await animeApi.getProfile()
        this.currentUserId = profile.id
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err)
      }
    },

    async loadAllData() {
      try {
        this.loading = true
        await Promise.all([this.loadUsers(), this.loadFriends(), this.loadRequests()])
      } finally {
        this.loading = false
      }
    },

    async loadUsers() {
      try {
        this.allUsers = await animeApi.getAllUsers(100)
      } catch (err) {
        console.error('Ошибка загрузки пользователей:', err)
      }
    },

    async loadFriends() {
      try {
        this.friends = await animeApi.getFriends()
      } catch (err) {
        console.error('Ошибка загрузки друзей:', err)
      }
    },

    async loadRequests() {
      try {
        this.requests = await animeApi.getFriendRequests()
      } catch (err) {
        console.error('Ошибка загрузки заявок:', err)
      }
    },

    handleSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      if (!this.searchQuery || this.searchQuery.length < 2) {
        this.searchResults = []
        return
      }

      this.searchTimeout = setTimeout(async () => {
        try {
          this.searchResults = await animeApi.searchUsers(this.searchQuery)
        } catch (err) {
          console.error('Ошибка поиска:', err)
        }
      }, 300)
    },

    clearSearch() {
      this.searchQuery = ''
      this.searchResults = []
    },
  },
}
</script>

<style scoped>
.users-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #0a0a0a, #000);
  padding: 20px 0 80px;
}

.users-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

/* ═══════════════════════════════════════════ */
/* КОМПАКТНЫЙ ХЕДЕР */
/* ═══════════════════════════════════════════ */
.page-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.title-icon {
  color: #ff416c;
  flex-shrink: 0;
}

/* ═══════════════════════════════════════════ */
/* ОНЛАЙН СТАТИСТИКА */
/* ═══════════════════════════════════════════ */
.online-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 10px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4caf50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.6);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%,
  100% {
    box-shadow: 0 0 8px rgba(76, 175, 80, 0.6);
  }
  50% {
    box-shadow: 0 0 12px rgba(76, 175, 80, 0.8);
  }
}

.online-count {
  font-size: 13px;
  font-weight: 700;
  color: #4caf50;
}

/* ═══════════════════════════════════════════ */
/* ВКЛАДКИ */
/* ═══════════════════════════════════════════ */
.tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.tab:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.tab.active {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border-color: #ff416c;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 65, 108, 0.3);
}

.tab svg {
  flex-shrink: 0;
}

.tab-badge,
.tab-count {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
}

.tab.active .tab-badge,
.tab.active .tab-count {
  background: rgba(255, 255, 255, 0.25);
}

/* ═══════════════════════════════════════════ */
/* ПОИСК */
/* ═══════════════════════════════════════════ */
.search-section {
  margin-bottom: 32px;
}

.search-box {
  position: relative;
  max-width: 600px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s;
}

.search-box:focus-within {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 65, 108, 0.5);
  box-shadow: 0 0 20px rgba(255, 65, 108, 0.15);
}

.search-icon {
  color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: white;
  font-size: 15px;
  font-weight: 500;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.clear-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.7);
}

.clear-btn:hover {
  background: rgba(255, 65, 108, 0.3);
}

/* ═══════════════════════════════════════════ */
/* КОНТЕНТ */
/* ═══════════════════════════════════════════ */
.tab-content {
  min-height: 300px;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* ═══════════════════════════════════════════ */
/* НЕТ РЕЗУЛЬТАТОВ */
/* ═══════════════════════════════════════════ */
.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 20px;
}

.no-results-icon {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.no-results h3 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px;
  color: white;
}

.no-results p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */
@media (max-width: 768px) {
  .users-container {
    padding: 0 20px;
  }

  .page-header {
    margin-bottom: 24px;
    padding-bottom: 20px;
  }

  .header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .page-title {
    font-size: 24px;
  }

  .online-stats {
    align-self: flex-start;
  }

  .tabs {
    width: 100%;
    gap: 8px;
  }

  .tab {
    flex: 1;
    justify-content: center;
    padding: 10px 12px;
    font-size: 13px;
    min-width: 0;
  }

  .search-section {
    margin-bottom: 24px;
  }

  .search-box {
    max-width: 100%;
    padding: 12px 16px;
  }

  .search-input {
    font-size: 14px;
  }

  .users-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .no-results {
    padding: 60px 20px;
  }

  .no-results-icon {
    font-size: 64px;
  }

  .no-results h3 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .users-container {
    padding: 0 16px;
  }

  .page-title {
    font-size: 20px;
    gap: 10px;
  }

  .tabs {
    flex-direction: column;
  }

  .tab {
    width: 100%;
    justify-content: flex-start;
    padding: 12px 16px;
  }

  .search-box {
    padding: 10px 14px;
  }
}
</style>
