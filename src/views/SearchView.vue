<template>
  <div class="search-page">
    <div class="search-container">
      <!-- Компактный заголовок + поиск -->
      <div class="search-header">
        <h1 class="page-title">
          <IconSearch :size="32" class="title-icon" />
          Поиск
        </h1>

        <!-- Поисковая строка -->
        <div class="search-bar">
          <IconSearch :size="20" class="search-icon" />
          <input
            v-model="searchQuery"
            @input="handleSearchInput"
            @keyup.enter="performSearch"
            type="text"
            placeholder="Найти аниме..."
            class="search-input"
            autofocus
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
            <IconX :size="16" />
          </button>
        </div>
      </div>

      <!-- Загрузка -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Поиск...</p>
      </div>

      <!-- Результаты поиска -->
      <div v-else-if="results.length > 0" class="search-results">
        <div class="results-header">
          <h2>Найдено: {{ results.length }}</h2>
          <span class="query-text">"{{ currentQuery }}"</span>
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
            <li>Использовать другое название</li>
            <li>Убрать лишние слова</li>
          </ul>
        </div>
      </div>

      <!-- Начальное состояние -->
      <div v-else class="initial-state">
        <div class="initial-content">
          <div class="initial-icon">🔍</div>
          <h3>Начните вводить название</h3>
          <p>Поиск начнется автоматически</p>
        </div>

        <!-- Популярные запросы -->
        <div class="popular-searches">
          <h4>Популярные:</h4>
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
    const query = this.$route.query.q
    if (query) {
      this.searchQuery = query
      this.performSearch()
    }
  },
  watch: {
    '$route.query.q'(newQuery) {
      if (newQuery && newQuery !== this.currentQuery) {
        this.searchQuery = newQuery
        this.performSearch()
      }
    },
  },
  methods: {
    handleSearchInput() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        if (this.searchQuery.trim().length >= 2) {
          this.performSearch()
        } else if (this.searchQuery.trim().length === 0) {
          this.results = []
          this.currentQuery = ''
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

      if (this.$route.query.q !== query) {
        this.$router.push({ path: '/search', query: { q: query } })
      }

      this.loading = true
      this.currentQuery = query

      try {
        this.results = await animeApi.search(query, 100)
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
  padding: 20px 0 80px;
}

.search-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

/* ═══════════════════════════════════════════ */
/* КОМПАКТНЫЙ ХЕДЕР */
/* ═══════════════════════════════════════════ */
.search-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 40px;
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  color: white;
  white-space: nowrap;
  flex-shrink: 0;
}

.title-icon {
  color: #ff416c;
  flex-shrink: 0;
}
/* ═══════════════════════════════════════════ */
/* ПОИСКОВАЯ СТРОКА (КАК НА ГЛАВНОЙ) */
/* ═══════════════════════════════════════════ */
.search-bar {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s;
}

.search-bar:focus-within {
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
/* РЕЗУЛЬТАТЫ */
/* ═══════════════════════════════════════════ */
.results-header {
  margin-bottom: 24px;
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.results-header h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.query-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}

.anime-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

/* ═══════════════════════════════════════════ */
/* ЗАГРУЗКА */
/* ═══════════════════════════════════════════ */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 20px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255, 255, 255, 0.1);
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
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* ═══════════════════════════════════════════ */
/* ПУСТОЕ СОСТОЯНИЕ */
/* ═══════════════════════════════════════════ */
.empty-state {
  max-width: 500px;
  margin: 60px auto;
  text-align: center;
  padding: 40px 30px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 12px;
  color: white;
}

.empty-state p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 30px;
}

.empty-suggestions {
  text-align: left;
  background: rgba(255, 255, 255, 0.03);
  padding: 20px;
  border-radius: 12px;
}

.empty-suggestions h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px;
  color: rgba(255, 255, 255, 0.7);
}

.empty-suggestions ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-suggestions li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.empty-suggestions li::before {
  content: '→';
  color: #ff416c;
  font-weight: 700;
  font-size: 16px;
}

/* ═══════════════════════════════════════════ */
/* НАЧАЛЬНОЕ СОСТОЯНИЕ */
/* ═══════════════════════════════════════════ */
.initial-state {
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 800px;
  margin: 40px auto 0;
}

.initial-content {
  text-align: center;
  padding: 40px 20px;
}

.initial-icon {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.3;
}

.initial-state h3 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px;
  color: white;
}

.initial-state p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.popular-searches h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px;
  color: rgba(255, 255, 255, 0.7);
}

.search-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.search-tag {
  padding: 10px 20px;
  background: rgba(255, 65, 108, 0.1);
  border: 1px solid rgba(255, 65, 108, 0.3);
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.search-tag:hover {
  background: rgba(255, 65, 108, 0.2);
  border-color: rgba(255, 65, 108, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 65, 108, 0.2);
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */
@media (max-width: 768px) {
  .search-container {
    padding: 0 20px;
  }

  .search-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 16px 0;
  }

  .page-title {
    font-size: 24px;
    justify-content: center;
  }

  .search-bar {
    padding: 12px 16px;
  }

  .search-input {
    font-size: 14px;
  }

  .anime-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 16px;
  }

  .results-header {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }

  .results-header h2 {
    font-size: 20px;
  }

  .initial-state {
    margin-top: 20px;
    gap: 30px;
  }

  .initial-content {
    padding: 30px 20px;
  }

  .initial-icon {
    font-size: 64px;
  }

  .initial-state h3 {
    font-size: 20px;
  }

  .initial-state p {
    font-size: 14px;
  }

  .empty-state {
    margin: 40px auto;
    padding: 30px 24px;
  }

  .empty-icon {
    font-size: 64px;
  }

  .empty-state h3 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .search-container {
    padding: 0 16px;
  }

  .page-title {
    font-size: 20px;
    gap: 10px;
  }

  .anime-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }

  .search-tags {
    gap: 8px;
  }

  .search-tag {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>
