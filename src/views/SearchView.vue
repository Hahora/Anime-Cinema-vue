<template>
  <div class="search-page">
    <div class="search-container">
      <!-- Заголовок -->
      <div class="page-header">
        <h1 class="page-title">
          <svg viewBox="0 0 24 24" class="title-icon">
            <path
              d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              fill="currentColor"
            />
          </svg>
          Поиск аниме
        </h1>
      </div>

      <!-- Поисковая строка -->
      <div class="search-bar-wrapper">
        <div class="search-bar">
          <svg viewBox="0 0 24 24" class="search-icon">
            <path
              d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              fill="currentColor"
            />
          </svg>
          <input
            v-model="searchQuery"
            @input="handleSearchInput"
            @keyup.enter="performSearch"
            type="text"
            placeholder="Введите название аниме..."
            class="search-input"
            autofocus
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

      <!-- Загрузка -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Поиск аниме...</p>
      </div>

      <!-- Результаты поиска -->
      <div v-else-if="results.length > 0" class="search-results">
        <div class="results-header">
          <h2>Найдено: {{ results.length }}</h2>
          <span class="query-text">по запросу "{{ currentQuery }}"</span>
        </div>

        <div class="anime-grid">
          <AnimeCard v-for="anime in results" :key="anime.id" :anime="anime" />
        </div>
      </div>

      <!-- Пустой результат -->
      <div v-else-if="currentQuery && !loading" class="empty-state">
        <div class="empty-icon">😢</div>
        <h3>Ничего не найдено</h3>
        <p>По запросу "{{ currentQuery }}" ничего не найдено</p>
        <div class="empty-suggestions">
          <h4>Попробуйте:</h4>
          <ul>
            <li>Проверить правильность написания</li>
            <li>Использовать другое название (например, оригинальное)</li>
            <li>Убрать лишние слова из запроса</li>
          </ul>
        </div>
      </div>

      <!-- Начальное состояние -->
      <div v-else class="initial-state">
        <div class="initial-icon">🔍</div>
        <h3>Начните поиск</h3>
        <p>Введите название аниме в поисковую строку выше</p>

        <!-- Популярные запросы (опционально) -->
        <div class="popular-searches">
          <h4>Популярные запросы:</h4>
          <div class="search-tags">
            <button
              v-for="tag in popularSearches"
              :key="tag"
              @click="searchByTag(tag)"
              class="search-tag"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AnimeCard from '@/components/AnimeCard.vue'
import { animeApi } from '@/api/animeApi'

export default {
  name: 'SearchView',
  components: {
    AnimeCard,
  },
  data() {
    return {
      searchQuery: '',
      currentQuery: '',
      results: [],
      loading: false,
      searchTimeout: null,
      popularSearches: [
        'Наруто',
        'Ван Пис',
        'Атака титанов',
        'Моя геройская академия',
        'Магическая битва',
        'Токийский гуль',
      ],
    }
  },
  mounted() {
    // Читаем query параметр из URL
    const query = this.$route.query.q
    if (query) {
      this.searchQuery = query
      this.performSearch()
    }
  },
  watch: {
    // Отслеживаем изменения query параметра
    '$route.query.q'(newQuery) {
      if (newQuery && newQuery !== this.currentQuery) {
        this.searchQuery = newQuery
        this.performSearch()
      }
    },
  },
  methods: {
    handleSearchInput() {
      // Debounce для автопоиска (опционально)
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        if (this.searchQuery.trim().length >= 2) {
          this.performSearch()
        }
      }, 500)
    },

    async performSearch() {
      const query = this.searchQuery.trim()

      if (!query) {
        this.results = []
        this.currentQuery = ''
        return
      }

      // Обновляем URL без перезагрузки страницы
      if (this.$route.query.q !== query) {
        this.$router.push({ path: '/search', query: { q: query } })
      }

      this.loading = true
      this.currentQuery = query

      try {
        this.results = await animeApi.search(query, 100)
        console.log(`🔍 Найдено: ${this.results.length} аниме`)
      } catch (err) {
        console.error('Search error:', err)
        this.results = []
      } finally {
        this.loading = false
      }
    },

    clearSearch() {
      this.searchQuery = ''
      this.results = []
      this.currentQuery = ''
      this.$router.push('/search')
    },

    searchByTag(tag) {
      this.searchQuery = tag
      this.performSearch()
    },
  },
}
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #0a0a0a, #000);
  padding: 25px 0 60px;
}

.search-container {
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
  margin: 0;
  color: white;
}

.title-icon {
  width: 56px;
  height: 56px;
  color: #ff416c;
}

/* ═══════════════════════════════════════════ */
/* ПОИСКОВАЯ СТРОКА */
/* ═══════════════════════════════════════════ */
.search-bar-wrapper {
  margin-bottom: 60px;
}

.search-bar {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  transition: all 0.3s;
}

.search-bar:focus-within {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 65, 108, 0.5);
  box-shadow: 0 0 30px rgba(255, 65, 108, 0.2);
}

.search-icon {
  width: 28px;
  height: 28px;
  color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: white;
  font-size: 18px;
  font-weight: 500;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.clear-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.clear-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.clear-btn svg {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.7);
}

/* ═══════════════════════════════════════════ */
/* РЕЗУЛЬТАТЫ */
/* ═══════════════════════════════════════════ */
.results-header {
  margin-bottom: 30px;
}

.results-header h2 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px;
  color: white;
}

.query-text {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
}

.anime-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

/* ═══════════════════════════════════════════ */
/* ЗАГРУЗКА */
/* ═══════════════════════════════════════════ */
.loading-state {
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

.loading-state p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
}

/* ═══════════════════════════════════════════ */
/* ПУСТОЕ СОСТОЯНИЕ */
/* ═══════════════════════════════════════════ */
.empty-state {
  max-width: 600px;
  margin: 100px auto;
  text-align: center;
  padding: 60px 40px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.empty-icon {
  font-size: 100px;
  margin-bottom: 24px;
}

.empty-state h3 {
  font-size: 32px;
  font-weight: 900;
  margin: 0 0 16px;
  color: white;
}

.empty-state p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 40px;
}

.empty-suggestions {
  text-align: left;
  background: rgba(255, 255, 255, 0.03);
  padding: 24px;
  border-radius: 16px;
}

.empty-suggestions h4 {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 16px;
  color: rgba(255, 255, 255, 0.8);
}

.empty-suggestions ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-suggestions li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
}

.empty-suggestions li::before {
  content: '→';
  color: #ff416c;
  font-weight: 700;
  font-size: 18px;
}

/* ═══════════════════════════════════════════ */
/* НАЧАЛЬНОЕ СОСТОЯНИЕ */
/* ═══════════════════════════════════════════ */
.initial-state {
  max-width: 700px;
  margin: 100px auto;
  text-align: center;
  padding: 60px 40px;
}

.initial-icon {
  font-size: 120px;
  margin-bottom: 24px;
  opacity: 0.5;
}

.initial-state h3 {
  font-size: 32px;
  font-weight: 900;
  margin: 0 0 16px;
  color: white;
}

.initial-state p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 60px;
}

.popular-searches {
  text-align: left;
}

.popular-searches h4 {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 20px;
  color: rgba(255, 255, 255, 0.8);
}

.search-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.search-tag {
  padding: 12px 24px;
  background: rgba(255, 65, 108, 0.1);
  border: 1px solid rgba(255, 65, 108, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.search-tag:hover {
  background: rgba(255, 65, 108, 0.2);
  border-color: rgba(255, 65, 108, 0.5);
  transform: translateY(-2px);
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */
@media (max-width: 768px) {
  .search-container {
    padding: 0 20px;
  }

  .page-title {
    font-size: 32px;
  }

  .title-icon {
    width: 40px;
    height: 40px;
  }

  .search-bar {
    padding: 16px 20px;
  }

  .search-input {
    font-size: 16px;
  }

  .anime-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
}
</style>
