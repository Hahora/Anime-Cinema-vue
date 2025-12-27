<template>
  <div class="sidebar-section">
    <div class="section-header">
      <h3 class="sidebar-title">
        <svg viewBox="0 0 24 24" class="section-icon">
          <path
            d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
            fill="currentColor"
          />
        </svg>
        Недавно смотрел
      </h3>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else-if="history.length" class="history-list">
      <router-link
        v-for="item in history.slice(0, 4)"
        :key="item.id"
        :to="`/anime/${item.anime_id}`"
        class="history-item"
      >
        <img
          :src="item.poster || 'https://via.placeholder.com/60x80'"
          :alt="item.title"
          class="history-poster"
        />
        <div class="history-info">
          <h4 class="history-title">{{ item.title || 'Без названия' }}</h4>
          <p class="history-meta">Серия {{ item.episode_num }}</p>
          <p class="history-date">{{ formatDate(item.watched_at) }}</p>
        </div>
      </router-link>
    </div>

    <div v-else class="empty-state">Пока ничего не просмотрено</div>

    <router-link to="/history" class="see-all-link">Показать все →</router-link>
  </div>
</template>

<script>
import { animeApi } from '@/api/animeApi'

export default {
  name: 'ProfileHistory',
  props: {
    userId: {
      type: Number,
      default: null,
    },
    isOwnProfile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      history: [],
      loading: false,
    }
  },
  mounted() {
    this.loadHistory()
  },
  watch: {
    userId() {
      this.loadHistory()
    },
  },
  methods: {
    async loadHistory() {
      this.loading = true
      try {
        if (this.isOwnProfile) {
          this.history = await animeApi.getWatchHistory(10)
        } else {
          this.history = await animeApi.getUserHistory(this.userId, 10)
        }
      } catch (err) {
        console.error('Ошибка загрузки истории:', err)
      } finally {
        this.loading = false
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now - date
      const hours = Math.floor(diff / (1000 * 60 * 60))

      if (hours < 1) return 'только что'
      if (hours < 24) return `${hours}ч назад`
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    },
  },
}
</script>

<style scoped>
.sidebar-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 24px;
}

.section-header {
  margin-bottom: 20px;
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.section-icon {
  width: 24px;
  height: 24px;
  color: #ff416c;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.history-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 65, 108, 0.3);
  transform: translateX(4px);
}

.history-poster {
  width: 60px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.history-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.history-title {
  font-size: 14px;
  font-weight: 700;
  color: white;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.history-meta {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.history-date {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

.see-all-link {
  display: block;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s;
}

.see-all-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.loading,
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}
</style>
