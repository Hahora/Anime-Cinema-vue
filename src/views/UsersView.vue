<template>
  <div class="users-page">
    <PageLoader v-if="loading" />

    <div v-else class="users-container">
      <!-- Заголовок -->
      <div class="page-header">
        <h1 class="page-title">
          <svg viewBox="0 0 24 24" class="title-icon">
            <path
              d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
              fill="currentColor"
            />
          </svg>
          Пользователи
        </h1>

        <!-- Переключатель вкладок -->
        <div class="tabs">
          <button :class="['tab', { active: currentTab === 'all' }]" @click="currentTab = 'all'">
            <svg viewBox="0 0 24 24">
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                fill="currentColor"
              />
            </svg>
            Все пользователи
          </button>
          <button
            :class="['tab', { active: currentTab === 'friends' }]"
            @click="currentTab = 'friends'"
          >
            <svg viewBox="0 0 24 24">
              <path
                d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                fill="currentColor"
              />
            </svg>
            Мои друзья
            <span v-if="friends.length > 0" class="tab-badge">{{ friends.length }}</span>
          </button>
          <button
            :class="['tab', { active: currentTab === 'requests' }]"
            @click="currentTab = 'requests'"
          >
            <svg viewBox="0 0 24 24">
              <path
                d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"
                fill="currentColor"
              />
            </svg>
            Заявки
            <span v-if="requests.length > 0" class="tab-badge">{{ requests.length }}</span>
          </button>
        </div>
      </div>

      <!-- Поиск (только для вкладки "Все пользователи") -->
      <div v-if="currentTab === 'all'" class="search-section">
        <div class="search-box">
          <svg viewBox="0 0 24 24" class="search-icon">
            <path
              d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              fill="currentColor"
            />
          </svg>
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Поиск по имени или username..."
            class="search-input"
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
            <svg viewBox="0 0 24 24">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                fill="currentColor"
              />
            </svg>
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

      allUsers: [],
      searchResults: [],
      friends: [],
      requests: [],
    }
  },
  computed: {
    displayedUsers() {
      return this.searchQuery ? this.searchResults : this.allUsers
    },
  },
  async mounted() {
    await this.loadAllData()
  },
  methods: {
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
  padding: 25px 0 60px;
}

.users-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

/* ═══════════════════════════════════════════ */
/* ЗАГОЛОВОК */
/* ═══════════════════════════════════════════ */
.page-header {
  margin-bottom: 40px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 48px;
  font-weight: 900;
  margin: 0 0 32px;
  color: white;
}

.title-icon {
  width: 56px;
  height: 56px;
  color: #ff416c;
}

/* ═══════════════════════════════════════════ */
/* ВКЛАДКИ */
/* ═══════════════════════════════════════════ */
.tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.tab:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.tab.active {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border-color: #ff416c;
  color: white;
  box-shadow: 0 8px 24px rgba(255, 65, 108, 0.3);
}

.tab svg {
  width: 20px;
  height: 20px;
}

.tab-badge {
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
}

.tab.active .tab-badge {
  background: rgba(255, 255, 255, 0.3);
}

/* ═══════════════════════════════════════════ */
/* ПОИСК */
/* ═══════════════════════════════════════════ */
.search-section {
  margin-bottom: 40px;
}

.search-box {
  position: relative;
  max-width: 600px;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  color: rgba(255, 255, 255, 0.4);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 18px 60px 18px 56px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  outline: none;
  transition: all 0.3s;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.search-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 65, 108, 0.5);
}

.clear-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.clear-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.clear-btn svg {
  width: 20px;
  height: 20px;
}

/* ═══════════════════════════════════════════ */
/* КОНТЕНТ */
/* ═══════════════════════════════════════════ */
.tab-content {
  min-height: 400px;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

/* ═══════════════════════════════════════════ */
/* НЕТ РЕЗУЛЬТАТОВ */
/* ═══════════════════════════════════════════ */
.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 100px 20px;
}

.no-results-icon {
  font-size: 100px;
  margin-bottom: 24px;
}

.no-results h3 {
  font-size: 32px;
  font-weight: 900;
  margin: 0 0 12px;
  color: white;
}

.no-results p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */
@media (max-width: 768px) {
  .users-container {
    padding: 0 20px;
  }

  .page-title {
    font-size: 32px;
  }

  .title-icon {
    width: 40px;
    height: 40px;
  }

  .users-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .tabs {
    flex-direction: column;
  }

  .tab {
    width: 100%;
    justify-content: center;
  }
}
</style>
