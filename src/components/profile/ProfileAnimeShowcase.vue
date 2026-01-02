<template>
  <div class="anime-showcase">
    <div class="showcase-header">
      <h2 class="showcase-title">
        <svg viewBox="0 0 24 24" class="section-icon">
          <path
            d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z"
            fill="currentColor"
          />
        </svg>
        {{ isOwnProfile ? 'Моя коллекция' : 'Коллекция пользователя' }}
      </h2>
      <router-link v-if="isOwnProfile" to="/collection" class="view-all-btn">
        Показать все →
      </router-link>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Загрузка коллекции...</p>
    </div>

    <div v-else-if="animeList.length" class="anime-grid">
      <router-link
        v-for="anime in animeList.slice(0, 8)"
        :key="anime.id"
        :to="`/anime/${anime.anime_id || anime.id}`"
        class="anime-card"
      >
        <div class="card-poster">
          <img :src="anime.poster" :alt="anime.title" />
          <div class="card-overlay">
            <div class="card-rating">{{ anime.rating || '—' }}</div>
            <div class="card-status">{{ getStatusText(anime.status) }}</div>
          </div>
        </div>
        <div class="card-info">
          <h3 class="card-title">{{ anime.title }}</h3>
          <p class="card-year">{{ anime.year }}</p>
        </div>
      </router-link>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">📚</div>
      <h3>{{ isOwnProfile ? 'Коллекция пуста' : 'Пользователь пока ничего не добавил' }}</h3>
      <p>
        {{
          isOwnProfile
            ? 'Начните добавлять аниме в свою коллекцию'
            : 'Здесь будут отображаться аниме пользователя'
        }}
      </p>
    </div>
  </div>
</template>

<script>
import { animeApi } from '@/api/animeApi'

export default {
  name: 'ProfileAnimeShowcase',
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
      animeList: [],
      loading: false,
    }
  },
  mounted() {
    this.loadAnimeList()
  },
  watch: {
    userId() {
      this.loadAnimeList()
    },
  },
  methods: {
    async loadAnimeList() {
      this.loading = true
      try {
        if (this.isOwnProfile) {
          // Загружаем свою коллекцию
          this.animeList = await animeApi.getUserAnimeList()
        } else {
          // Загружаем коллекцию пользователя
          this.animeList = await animeApi.getUserAnimeList(this.userId)
        }
      } catch (err) {
        console.error('Ошибка загрузки коллекции:', err)
      } finally {
        this.loading = false
      }
    },

    getStatusText(status) {
      const statusMap = {
        watching: 'Смотрю',
        completed: 'Просмотрено',
        on_hold: 'Отложено',
        dropped: 'Брошено',
        plan_to_watch: 'Запланировано',
      }
      return statusMap[status] || status
    },
  },
}
</script>

<style scoped>
.anime-showcase {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
}

.showcase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.showcase-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.section-icon {
  width: 28px;
  height: 28px;
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

.anime-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}

.anime-card {
  text-decoration: none;
  transition: all 0.3s;
}

.anime-card:hover {
  transform: translateY(-8px);
}

.card-poster {
  position: relative;
  aspect-ratio: 3/4;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
}

.card-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), transparent, rgba(0, 0, 0, 0.7));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
  opacity: 0;
  transition: all 0.3s;
}

.anime-card:hover .card-overlay {
  opacity: 1;
}

.card-rating {
  align-self: flex-end;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #ffc107;
}

.card-status {
  padding: 4px 8px;
  background: rgba(255, 65, 108, 0.9);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  color: white;
  text-align: center;
}

.card-info {
  text-align: center;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  color: white;
  margin: 0 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-year {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
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
  .anime-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 16px;
  }

  .showcase-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
