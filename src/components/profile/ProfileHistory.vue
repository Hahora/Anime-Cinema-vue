<template>
  <div class="sidebar-section">
    <div class="section-header">
      <h3 class="sidebar-title">
        <IconClock :size="24" class="section-icon" />
        Недавно смотрел
      </h3>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else-if="history.length" class="history-container">
      <div class="history-list">
        <router-link
          v-for="item in history.slice(0, 6)"
          :key="item.id"
          :to="`/anime/${item.anime_id}`"
          class="history-item"
        >
          <div class="history-poster">
            <img :src="item.poster || 'https://via.placeholder.com/60x80'" :alt="item.title" />
            <div class="episode-badge">{{ item.episode_num }}</div>
          </div>
          <div class="history-info">
            <h4 class="history-title">{{ item.title || 'Без названия' }}</h4>
            <p class="history-meta">Серия {{ item.episode_num }}</p>
            <p class="history-date">{{ formatDate(item.watched_at) }}</p>
          </div>
        </router-link>
      </div>
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
        } else if (this.userId) {
          this.history = await animeApi.getUserHistory(this.userId, 10)
        }
      } catch (err) {
        console.error('Ошибка загрузки истории:', err)
        this.history = []
      } finally {
        this.loading = false
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'недавно'

      try {
        const date = new Date(dateString)
        const now = new Date()
        const diff = now - date
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))

        if (hours < 1) return 'только что'
        if (hours < 24) return `${hours}ч назад`
        if (days < 7) return `${days}дн назад`

        return date.toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'short',
        })
      } catch (err) {
        console.error('Ошибка форматирования даты:', err)
        return 'недавно'
      }
    },
  },
}
</script>

<style scoped>
/* ═══════════════════════════════════════════ */
/* ДЕСКТОП И ПЛАНШЕТЫ - ОБЫЧНЫЙ СПИСОК */
/* ═══════════════════════════════════════════ */
.sidebar-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
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
  color: #ff416c;
}

.loading {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

.history-container {
  margin-bottom: 20px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  position: relative;
  flex-shrink: 0;
}

.history-poster img {
  width: 60px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.episode-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  padding: 2px 6px;
  background: rgba(255, 65, 108, 0.9);
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.history-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-width: 0;
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

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

/* ═══════════════════════════════════════════ */
/* МОБИЛЬНЫЕ - ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ */
/* ═══════════════════════════════════════════ */
@media (max-width: 768px) {
  .sidebar-section {
    padding: 20px;

    /* ✅ ЯДЕРНАЯ ЗАЩИТА ОТ ВЫХОДА ЗА ГРАНИЦЫ */
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden; /* ЗАПРЕТ на выход вправо */
  }

  .section-header {
    margin-bottom: 16px;
  }

  .sidebar-title {
    font-size: 16px;
  }

  .history-container {
    margin-bottom: 16px;

    /* ✅ ЯДЕРНАЯ ЗАЩИТА */
    max-width: 100%;
    width: 100%;
    overflow: hidden;
  }

  .history-list {
    display: flex;
    flex-direction: row;
    gap: 10px;

    /* ✅ СКРОЛЛ ТОЛЬКО ВНУТРИ */
    overflow-x: auto;
    overflow-y: hidden;

    scrollbar-width: none;
    -ms-overflow-style: none;
    -webkit-overflow-scrolling: touch;

    /* ✅ ЗАЩИТА */
    max-width: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
  }

  .history-list::-webkit-scrollbar {
    display: none;
  }

  .history-item {
    flex-direction: column;

    /* ✅ ПРОСТО ФИКСИРОВАННАЯ ШИРИНА БЕЗ CALC */
    width: 110px;
    min-width: 110px;
    max-width: 110px;

    flex-shrink: 0;
    padding: 12px 8px;
    scroll-snap-align: start;
    text-align: center;
  }

  .history-item:hover {
    transform: translateY(-4px);
  }

  .history-poster {
    align-self: center;
    margin-bottom: 8px;
  }

  .history-poster img {
    width: 50px;
    height: 70px;
  }

  .episode-badge {
    bottom: -3px;
    right: -3px;
    padding: 2px 5px;
    font-size: 9px;
  }

  .history-info {
    flex: none;
    width: 100%;
  }

  .history-title {
    font-size: 11px;
    line-height: 1.3;
    min-height: 28px;
    text-align: center;
    word-break: break-word;
  }

  .history-meta {
    font-size: 10px;
    text-align: center;
  }

  .history-date {
    font-size: 9px;
    text-align: center;
  }

  .see-all-link {
    padding: 8px 12px;
    font-size: 13px;
  }

  .loading,
  .empty-state {
    padding: 30px 15px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .sidebar-section {
    padding: 16px;
  }

  .history-list {
    gap: 8px;
  }

  .history-item {
    width: 100px;
    min-width: 100px;
    max-width: 100px;
    padding: 10px 6px;
  }

  .history-poster img {
    width: 45px;
    height: 65px;
  }

  .history-title {
    font-size: 10px;
    min-height: 26px;
  }

  .history-meta {
    font-size: 9px;
  }

  .history-date {
    font-size: 8px;
  }
}
</style>
