<template>
  <div class="favorites-page">
    <div class="page-container">
      <h1>Избранное</h1>

      <div v-if="loading" class="loading">Загрузка...</div>

      <div v-else-if="favorites.length" class="anime-grid">
        <router-link
          v-for="anime in favorites"
          :key="anime.id"
          :to="`/anime/${anime.anime_id}`"
          class="anime-card"
        >
          <div class="anime-poster">
            <img :src="anime.poster || 'https://via.placeholder.com/200x280'" :alt="anime.title" />
          </div>
          <div class="anime-info">
            <h3 class="anime-title">{{ anime.title || 'Без названия' }}</h3>
            <p class="anime-meta">{{ anime.year }} • ⭐ {{ anime.rating || 'N/A' }}</p>
          </div>
        </router-link>
      </div>

      <div v-else class="empty-state">
        <p>Избранное пусто</p>
        <router-link to="/" class="btn-primary">Найти аниме</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { animeApi } from '@/api/animeApi'

export default {
  name: 'FavoritesView',
  data() {
    return {
      favorites: [],
      loading: false,
    }
  },
  mounted() {
    this.loadFavorites()
  },
  methods: {
    async loadFavorites() {
      this.loading = true
      try {
        this.favorites = await animeApi.getFavorites()
      } catch (err) {
        console.error('Ошибка загрузки избранного:', err)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
/* Те же стили что и в HistoryView */
.favorites-page {
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
  margin-bottom: 40px;
  background: linear-gradient(135deg, white, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

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

.anime-info {
  padding: 0 4px;
}

.anime-title {
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.anime-meta {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.loading,
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: rgba(255, 255, 255, 0.5);
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
</style>
