<template>
  <div class="history-page">
    <div class="page-container">
      <h1>Мои аниме</h1>

      <!-- Вкладки -->
      <div class="tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'history' }"
          @click="activeTab = 'history'"
        >
          <IconClock :size="22" class="tab-icon" />
          История просмотров
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'watched' }"
          @click="activeTab = 'watched'"
        >
          <IconCheckSquare :size="22" class="tab-icon" />
          Отмеченные
        </button>
      </div>

      <!-- История просмотров -->
      <div v-if="activeTab === 'history'" class="tab-content">
        <div v-if="loadingHistory" class="loading">Загрузка...</div>

        <div v-else-if="history.length" class="anime-grid">
          <router-link
            v-for="item in history"
            :key="item.id"
            :to="`/anime/${item.anime_id}`"
            class="anime-card"
          >
            <div class="anime-poster">
              <img
                :src="
                  item.poster || 'https://via.placeholder.com/200x280/667eea/ffffff?text=No+Image'
                "
                :alt="item.title"
              />
              <div class="watch-progress">
                <div class="progress-bar-mini">
                  <div
                    class="progress-fill"
                    :style="{
                      width:
                        item.duration_seconds > 0
                          ? (item.progress_seconds / item.duration_seconds) * 100 + '%'
                          : '0%',
                    }"
                  ></div>
                </div>
                <span class="progress-text">Серия {{ item.episode_num }}</span>
              </div>
            </div>
            <div class="anime-info">
              <h3 class="anime-title">{{ item.title || 'Без названия' }}</h3>
              <p class="anime-date">{{ formatDate(item.watched_at) }}</p>
            </div>
          </router-link>
        </div>

        <div v-else class="empty-state">
          <IconClock :size="80" class="empty-icon" />
          <p>История просмотров пуста</p>
          <router-link to="/" class="btn-primary">Начать смотреть</router-link>
        </div>
      </div>

      <!-- Отмеченные аниме -->
      <div v-if="activeTab === 'watched'" class="tab-content">
        <div v-if="loadingWatched" class="loading">Загрузка...</div>

        <div v-else-if="watched.length" class="anime-grid">
          <router-link
            v-for="item in watched"
            :key="item.id"
            :to="`/anime/${item.anime_id}`"
            class="anime-card"
          >
            <div class="anime-poster">
              <img
                :src="
                  item.poster || 'https://via.placeholder.com/200x280/4facfe/ffffff?text=No+Image'
                "
                :alt="item.title"
              />
              <div class="watch-badge" :class="{ completed: item.is_completed }">
                <IconCheck v-if="item.is_completed" :size="16" class="badge-icon" />
                <span v-else class="badge-text">
                  {{ item.episodes_watched }}/{{ item.total_episodes }}
                </span>
              </div>
            </div>
            <div class="anime-info">
              <h3 class="anime-title">{{ item.title || 'Без названия' }}</h3>
              <div class="anime-progress">
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{
                      width:
                        item.total_episodes > 0
                          ? (item.episodes_watched / item.total_episodes) * 100 + '%'
                          : '0%',
                    }"
                  ></div>
                </div>
                <p class="progress-label">
                  {{ item.is_completed ? 'Просмотрено' : 'Смотрю' }}
                </p>
              </div>
            </div>
          </router-link>
        </div>

        <div v-else class="empty-state">
          <IconCheckSquare :size="80" class="empty-icon" />
          <p>Нет отмеченных аниме</p>
          <router-link to="/" class="btn-primary">Найти аниме</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { animeApi } from '@/api/animeApi'

export default {
  name: 'HistoryView',
  data() {
    return {
      activeTab: 'history', // 'history' | 'watched'
      history: [],
      watched: [],
      loadingHistory: false,
      loadingWatched: false,
    }
  },
  mounted() {
    this.loadHistory()
    this.loadWatched()
  },
  watch: {
    activeTab(newTab) {
      if (newTab === 'history' && this.history.length === 0) {
        this.loadHistory()
      } else if (newTab === 'watched' && this.watched.length === 0) {
        this.loadWatched()
      }
    },
  },
  methods: {
    async loadHistory() {
      this.loadingHistory = true
      try {
        this.history = await animeApi.getWatchHistory(50)
      } catch (err) {
        console.error('Ошибка загрузки истории:', err)
      } finally {
        this.loadingHistory = false
      }
    },

    async loadWatched() {
      this.loadingWatched = true
      try {
        this.watched = await animeApi.getWatched()
      } catch (err) {
        console.error('Ошибка загрузки отмеченных:', err)
      } finally {
        this.loadingWatched = false
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now - date
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))

      if (hours < 1) {
        return 'Только что'
      } else if (hours < 24) {
        return `${hours}ч назад`
      } else if (days < 7) {
        return `${days}д назад`
      } else {
        return date.toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'short',
        })
      }
    },
  },
}
</script>

<style scoped>
.history-page {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(to bottom, #0a0a0a, #000);
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
  color: white;
}

h1 {
  font-size: 42px;
  font-weight: 900;
  margin-bottom: 30px;
  background: linear-gradient(135deg, white, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ═══════════════════════════════════════════ */
/* ВКЛАДКИ */
/* ═══════════════════════════════════════════ */
.tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.05);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  bottom: -2px;
}

.tab-btn:hover {
  color: rgba(255, 255, 255, 0.8);
}

.tab-btn.active {
  color: white;
  border-bottom-color: #ff416c;
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ═══════════════════════════════════════════ */
/* СЕТКА АНИМЕ */
/* ═══════════════════════════════════════════ */
.anime-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.anime-card {
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
}

.anime-card:hover {
  transform: translateY(-8px);
}

.anime-poster {
  position: relative;
  aspect-ratio: 2 / 3;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.05);
}

.anime-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ═══════════════════════════════════════════ */
/* ПРОГРЕСС ПРОСМОТРА (для истории) */
/* ═══════════════════════════════════════════ */
.watch-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
}

.progress-bar-mini {
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 6px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff416c, #ff4b2b);
  border-radius: 2px;
  transition: width 0.3s;
}

.progress-text {
  font-size: 12px;
  font-weight: 600;
  color: white;
}

/* ═══════════════════════════════════════════ */
/* БЕЙДЖ (для отмеченных) */
/* ═══════════════════════════════════════════ */
.watch-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  background: rgba(255, 152, 0, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 700;
  color: white;
}

.watch-badge.completed {
  background: rgba(76, 175, 80, 0.9);
}

.badge-text {
  font-size: 12px;
}

/* ═══════════════════════════════════════════ */
/* ИНФОРМАЦИЯ */
/* ═══════════════════════════════════════════ */
.anime-info {
  padding: 0 4px;
}

.anime-title {
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.anime-date {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.anime-progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* ═══════════════════════════════════════════ */
/* ПУСТОЕ СОСТОЯНИЕ */
/* ═══════════════════════════════════════════ */
.loading,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: rgba(255, 255, 255, 0.5);
}

.loading {
  font-size: 16px;
}

.empty-icon {
  margin-bottom: 20px;
  opacity: 0.3;
}

.empty-state p {
  font-size: 18px;
  margin-bottom: 24px;
}

.btn-primary {
  display: inline-block;
  padding: 14px 32px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 65, 108, 0.3);
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */
@media (max-width: 768px) {
  h1 {
    font-size: 32px;
  }

  .tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .tab-btn {
    padding: 12px 20px;
    font-size: 14px;
    white-space: nowrap;
  }

  .anime-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
}
</style>
