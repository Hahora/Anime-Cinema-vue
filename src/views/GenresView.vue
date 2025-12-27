<template>
  <div class="genres-page">
    <!-- Загрузка -->
    <PageLoader v-if="loading" />

    <!-- Контент -->
    <div v-else class="genres-container">
      <h1 class="page-title">
        <svg viewBox="0 0 24 24" class="title-icon">
          <path
            d="M12 2l-5.5 9h11z M17.5 11L12 20l5.5-9z M6.5 11L12 2 6.5 11z M12 20l-5.5-9H6.5L12 20z"
            fill="currentColor"
          />
        </svg>
        Жанры
      </h1>

      <!-- Сетка жанров -->
      <div v-if="!selectedGenre" class="genres-grid">
        <div
          v-for="genre in genres"
          :key="genre.slug"
          class="genre-card"
          @click="selectGenre(genre)"
        >
          <div class="genre-icon">{{ genre.icon }}</div>
          <h3 class="genre-name">{{ genre.name }}</h3>
        </div>
      </div>

      <!-- Список аниме по жанру -->
      <div v-else class="genre-content">
        <!-- Хлебные крошки -->
        <div class="breadcrumbs">
          <button @click="selectedGenre = null" class="breadcrumb-btn">
            <svg viewBox="0 0 24 24" class="breadcrumb-icon">
              <path
                d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                fill="currentColor"
              />
            </svg>
            Все жанры
          </button>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">{{ selectedGenre.name }}</span>
        </div>

        <!-- Заголовок жанра -->
        <div class="genre-header">
          <div class="genre-icon-large">{{ selectedGenre.icon }}</div>
          <h2 class="genre-title">{{ selectedGenre.name }}</h2>
        </div>

        <!-- Загрузка аниме -->
        <div v-if="loadingAnime" class="anime-loading">
          <div class="spinner"></div>
          <p>Загружаем аниме...</p>
        </div>

        <!-- Сетка аниме -->
        <div v-else-if="animeList.length > 0" class="anime-grid">
          <AnimeCard v-for="anime in animeList" :key="anime.id" :anime="anime" />
        </div>

        <!-- Нет результатов -->
        <div v-else class="no-results">
          <div class="no-results-icon">😢</div>
          <h3>Аниме не найдено</h3>
          <p>К сожалению, в этом жанре пока нет аниме</p>
        </div>

        <!-- Кнопка "Загрузить ещё" -->
        <div v-if="hasMore" class="load-more">
          <button @click="loadMore" class="load-more-btn" :disabled="loadingMore">
            <span v-if="!loadingMore">Загрузить ещё</span>
            <span v-else>
              <div class="btn-spinner"></div>
              Загрузка...
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageLoader from '@/components/PageLoader.vue'
import AnimeCard from '@/components/AnimeCard.vue'
import { animeApi } from '@/api/animeApi'

export default {
  name: 'GenresView',
  components: {
    PageLoader,
    AnimeCard,
  },
  data() {
    return {
      loading: true,
      loadingAnime: false,
      loadingMore: false,
      genres: [],
      selectedGenre: null,
      animeList: [],
      totalAnime: 0,
      currentPage: 1,
      limit: 10,
      hasMore: false,
    }
  },
  async mounted() {
    await this.loadGenres()
  },
  methods: {
    async loadGenres() {
      try {
        this.loading = true
        this.genres = await animeApi.getGenres()
      } catch (err) {
        console.error('Ошибка загрузки жанров:', err)
      } finally {
        this.loading = false
      }
    },

    async selectGenre(genre) {
      this.selectedGenre = genre
      this.animeList = []
      this.currentPage = 1
      await this.loadAnimeByGenre()
    },

    async loadAnimeByGenre() {
      try {
        this.loadingAnime = true

        const data = await animeApi.getAnimeByGenre(
          this.selectedGenre.slug,
          this.currentPage,
          this.limit,
        )

        this.animeList = [...this.animeList, ...data.results]
        this.hasMore = data.has_more

        console.log(`📄 Страница ${this.currentPage}: загружено ${data.results.length} аниме`)
      } catch (err) {
        console.error('Ошибка загрузки аниме:', err)
      } finally {
        this.loadingAnime = false
      }
    },

    async loadMore() {
      this.loadingMore = true
      this.currentPage++
      await this.loadAnimeByGenre()
      this.loadingMore = false
    },
  },
}
</script>

<style scoped>
.genres-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #0a0a0a, #000);
  padding: 100px 0 60px;
}

.genres-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

/* ═══════════════════════════════════════════ */
/* ЗАГОЛОВОК */
/* ═══════════════════════════════════════════ */
.page-title {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 48px;
  font-weight: 900;
  margin: 0 0 60px;
  color: white;
}

.title-icon {
  width: 56px;
  height: 56px;
  color: #ff416c;
}

/* ═══════════════════════════════════════════ */
/* СЕТКА ЖАНРОВ */
/* ═══════════════════════════════════════════ */
.genres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.genre-card {
  background: linear-gradient(135deg, rgba(255, 65, 108, 0.1), rgba(255, 75, 43, 0.05));
  border: 2px solid rgba(255, 65, 108, 0.2);
  border-radius: 20px;
  padding: 40px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.genre-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent, rgba(255, 65, 108, 0.1));
  opacity: 0;
  transition: opacity 0.3s;
}

.genre-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(255, 65, 108, 0.5);
  box-shadow: 0 20px 60px rgba(255, 65, 108, 0.3);
}

.genre-card:hover::before {
  opacity: 1;
}

.genre-icon {
  font-size: 64px;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
}

.genre-name {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: white;
  position: relative;
  z-index: 1;
}

/* ═══════════════════════════════════════════ */
/* ХЛЕБНЫЕ КРОШКИ */
/* ═══════════════════════════════════════════ */
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
}

.breadcrumb-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.breadcrumb-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 65, 108, 0.5);
  transform: translateX(-4px);
}

.breadcrumb-icon {
  width: 20px;
  height: 20px;
}

.breadcrumb-separator {
  color: rgba(255, 255, 255, 0.3);
  font-size: 18px;
}

.breadcrumb-current {
  color: rgba(255, 255, 255, 0.6);
  font-size: 15px;
  font-weight: 600;
}

/* ═══════════════════════════════════════════ */
/* ЗАГОЛОВОК ЖАНРА */
/* ═══════════════════════════════════════════ */
.genre-header {
  text-align: center;
  margin-bottom: 60px;
}

.genre-icon-large {
  font-size: 120px;
  margin-bottom: 24px;
  filter: drop-shadow(0 8px 24px rgba(255, 65, 108, 0.3));
}

.genre-title {
  font-size: 56px;
  font-weight: 900;
  margin: 0 0 16px;
  background: linear-gradient(135deg, white, rgba(255, 255, 255, 0.7));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.genre-count {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

/* ═══════════════════════════════════════════ */
/* СЕТКА АНИМЕ */
/* ═══════════════════════════════════════════ */
.anime-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 60px;
}

/* ═══════════════════════════════════════════ */
/* ЗАГРУЗКА */
/* ═══════════════════════════════════════════ */
.anime-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  gap: 24px;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #ff416c;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.anime-loading p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
}

/* ═══════════════════════════════════════════ */
/* НЕТ РЕЗУЛЬТАТОВ */
/* ═══════════════════════════════════════════ */
.no-results {
  text-align: center;
  padding: 100px 20px;
}

.no-results-icon {
  font-size: 100px;
  margin-bottom: 30px;
}

.no-results h3 {
  font-size: 32px;
  font-weight: 900;
  margin: 0 0 16px;
  color: white;
}

.no-results p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

/* ═══════════════════════════════════════════ */
/* ЗАГРУЗИТЬ ЕЩЁ */
/* ═══════════════════════════════════════════ */
.load-more {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.load-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 48px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: none;
  border-radius: 14px;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 10px 30px rgba(255, 65, 108, 0.3);
  min-width: 200px;
}

.load-more-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(255, 65, 108, 0.4);
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */
@media (max-width: 768px) {
  .genres-container {
    padding: 0 20px;
  }

  .page-title {
    font-size: 32px;
  }

  .title-icon {
    width: 40px;
    height: 40px;
  }

  .genres-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }

  .genre-card {
    padding: 30px 16px;
  }

  .genre-icon {
    font-size: 48px;
  }

  .genre-name {
    font-size: 16px;
  }

  .genre-icon-large {
    font-size: 80px;
  }

  .genre-title {
    font-size: 36px;
  }

  .anime-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
}
</style>
