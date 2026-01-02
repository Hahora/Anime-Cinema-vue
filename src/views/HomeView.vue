<template>
  <div class="home">
    <transition name="fade-out">
      <PageLoader v-if="initialLoading" :progress="loadingProgress" />
    </transition>

    <transition name="fade-in">
      <div v-if="!initialLoading" class="content-wrapper">
        <!-- Hero секция -->
        <div class="hero">
          <div class="hero-content">
            <div class="hero-badge">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path
                  d="M2 17L12 22L22 17M2 12L12 17L22 12"
                  stroke="currentColor"
                  fill="none"
                  stroke-width="2"
                />
              </svg>
              <span>Anime Cinema</span>
            </div>

            <h1 class="hero-title">
              Твой портал в мир
              <span class="gradient-text">аниме</span>
            </h1>

            <p class="hero-subtitle">
              Тысячи аниме в HD качестве, без рекламы и абсолютно бесплатно
            </p>

            <div class="hero-stats">
              <div class="stat-item">
                <div class="stat-number">10K+</div>
                <div class="stat-label">Аниме</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <div class="stat-number">HD</div>
                <div class="stat-label">Качество</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <div class="stat-number">0₽</div>
                <div class="stat-label">Бесплатно</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="search-bar">
          <div class="search-container">
            <div class="search-input-wrapper">
              <div class="search-icon">
                <IconSearch :size="22" />
              </div>

              <input
                v-model="searchQuery"
                type="text"
                class="search-input"
                placeholder="Поиск аниме..."
                @keyup.enter="handleSearch"
              />

              <button v-if="searchQuery" class="clear-button" @click="clearSearch" type="button">
                <IconX :size="16" />
              </button>
            </div>

            <button class="search-button" @click="handleSearch" :disabled="!searchQuery.trim()">
              <IconSearch :size="20" class="search-button-icon" />
              <span class="search-button-text">Найти</span>
            </button>
          </div>
        </div>

        <!-- Популярное -->
        <div v-if="trending.length" class="section">
          <div class="section-header">
            <div class="section-icon">🔥</div>
            <div>
              <h2 class="section-title">Популярное сейчас</h2>
              <p class="section-subtitle">Топ аниме, которые смотрят прямо сейчас</p>
            </div>
          </div>

          <div class="anime-grid">
            <AnimeCard
              v-for="(anime, index) in trending"
              :key="anime.id"
              :anime="anime"
              :style="{ animationDelay: `${index * 0.05}s` }"
              class="grid-item"
            />
          </div>
        </div>

        <!-- Пустое состояние -->
        <div v-else class="empty-state">
          <div class="empty-icon">📺</div>
          <h3>Здесь пока пусто</h3>
          <p>Используйте поиск, чтобы найти аниме</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import PageLoader from '@/components/PageLoader.vue'
import AnimeCard from '@/components/AnimeCard.vue'
import { animeApi } from '@/api/animeApi'

export default {
  name: 'HomeView',
  components: {
    PageLoader,
    AnimeCard,
  },
  data() {
    return {
      trending: [],
      initialLoading: true,
      loadingProgress: 0,
      searchQuery: '',
    }
  },
  async mounted() {
    await this.loadInitialData()
  },
  methods: {
    async loadInitialData() {
      this.initialLoading = true
      this.loadingProgress = 0

      try {
        const progressInterval = setInterval(() => {
          if (this.loadingProgress < 90) {
            this.loadingProgress += 10
          }
        }, 200)

        this.trending = await animeApi.getTrending()

        clearInterval(progressInterval)
        this.loadingProgress = 100

        setTimeout(() => {
          this.initialLoading = false
        }, 500)
      } catch (err) {
        console.error('Initial load error:', err)
        this.loadingProgress = 100
        setTimeout(() => {
          this.initialLoading = false
        }, 500)
      }
    },
    handleSearch() {
      if (!this.searchQuery.trim()) return

      this.$router.push({
        name: 'Search',
        query: { q: this.searchQuery.trim() },
      })
    },
    clearSearch() {
      this.searchQuery = ''
    },
  },
}
</script>

<style scoped>
.home {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  /* КРИТИЧЕСКИ ВАЖНО ДЛЯ СКРОЛЛА */
  contain: layout style;
}

/* ═══════════════════════════════════════════ */
/* КОНТЕНТ */
/* ═══════════════════════════════════════════ */
.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 20px;
  contain: layout style;
}

/* ═══════════════════════════════════════════ */
/* HERO СЕКЦИЯ */
/* ═══════════════════════════════════════════ */
.hero {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px 100px;
  text-align: center;
  contain: layout style;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 65, 108, 0.1);
  border: 1px solid rgba(255, 65, 108, 0.3);
  border-radius: 50px;
  color: #ff416c;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 32px;
  animation: fadeInDown 0.8s ease-out;
  /* Убрали backdrop-filter */
}

.hero-title {
  font-size: clamp(36px, 7vw, 72px);
  font-weight: 900;
  margin: 0 0 24px;
  line-height: 1.15;
  animation: fadeInUp 0.8s ease-out;
  color: white;
  letter-spacing: -0.02em;
}

.gradient-text {
  display: inline-block;
  background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 50%, #ff6b9d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  /* Убрали анимацию градиента — она тяжелая */
}

.hero-subtitle {
  font-size: clamp(16px, 2.5vw, 20px);
  color: rgba(255, 255, 255, 0.7);
  margin: 0 auto 48px;
  max-width: 600px;
  line-height: 1.6;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

/* Статистика */
.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  margin-top: 48px;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: clamp(28px, 4vw, 36px);
  font-weight: 900;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.2), transparent);
}

/* ═══════════════════════════════════════════ */
/* СЕКЦИИ */
/* ═══════════════════════════════════════════ */
.section {
  max-width: 1400px;
  margin: 0 auto 80px;
  animation: fadeInUp 0.8s ease-out 0.6s both;
  contain: layout style;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding: 0 10px;
}

.section-icon {
  font-size: 32px;
  /* Убрали анимацию bounce — она создает постоянные перерисовки */
}

.section-title {
  font-size: clamp(24px, 4vw, 32px);
  font-weight: 800;
  margin: 0;
  color: white;
  letter-spacing: -0.01em;
}

.section-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 4px 0 0;
}

/* ═══════════════════════════════════════════ */
/* СЕТКА АНИМЕ */
/* ═══════════════════════════════════════════ */
.anime-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
  padding: 0 10px;
  contain: layout style; /* КРИТИЧЕСКИ ВАЖНО */
}

.grid-item {
  animation: fadeInScale 0.6s ease-out both;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* ═══════════════════════════════════════════ */
/* ПУСТОЕ СОСТОЯНИЕ */
/* ═══════════════════════════════════════════ */
.empty-state {
  max-width: 500px;
  margin: 100px auto;
  text-align: center;
  padding: 60px 40px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  animation: fadeInUp 0.8s ease-out;
  /* Убрали backdrop-filter */
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
  /* Убрали анимацию float */
}

.empty-state h3 {
  font-size: 24px;
  margin: 0 0 12px;
  color: white;
  font-weight: 700;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  margin: 0;
  line-height: 1.5;
}

/* ═══════════════════════════════════════════ */
/* АНИМАЦИИ ПЕРЕХОДОВ */
/* ═══════════════════════════════════════════ */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-out-enter-active {
  transition: opacity 0.3s;
}

.fade-out-leave-active {
  transition: opacity 0.5s;
}

.fade-out-leave-to {
  opacity: 0;
}

.fade-in-enter-active {
  transition: all 0.6s ease-out;
}

.fade-in-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */

/* Планшеты */
@media (max-width: 1024px) {
  .hero-stats {
    gap: 24px;
  }
}

/* Мобильные */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 16px;
  }

  .hero {
    padding: 60px 16px 80px;
  }

  .hero-badge {
    font-size: 12px;
    padding: 8px 16px;
    margin-bottom: 24px;
  }

  .hero-badge svg {
    width: 16px;
    height: 16px;
  }

  .hero-title {
    margin-bottom: 20px;
  }

  .hero-subtitle {
    margin-bottom: 32px;
  }

  .hero-stats {
    flex-wrap: wrap;
    gap: 20px;
  }

  .stat-divider {
    display: none;
  }

  .section {
    margin-bottom: 60px;
  }

  .section-header {
    flex-direction: row;
    gap: 12px;
    margin-bottom: 24px;
  }

  .section-icon {
    font-size: 28px;
  }

  .anime-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
    padding: 0 4px;
  }

  .empty-state {
    padding: 40px 24px;
    margin: 60px auto;
  }

  .empty-icon {
    font-size: 60px;
  }

  .empty-state h3 {
    font-size: 20px;
  }

  .empty-state p {
    font-size: 14px;
  }
}

/* Маленькие мобильные */
@media (max-width: 480px) {
  .hero {
    padding: 40px 12px 60px;
  }

  .hero-stats {
    gap: 16px;
  }

  .stat-item {
    flex: 1;
    min-width: 80px;
  }

  .anime-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }
}

/* Очень маленькие экраны */
@media (max-width: 360px) {
  .anime-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  }
}

/* ═══════════════════════════════════════════ */
/* SEARCH BAR */
/* ═══════════════════════════════════════════ */
.search-bar {
  max-width: 800px;
  margin: 0 auto 60px;
  padding: 0 20px;
  animation: fadeInUp 0.8s ease-out 0.8s both;
}

.search-container {
  display: flex;
  gap: 12px;
  align-items: stretch;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 20px;
  color: rgba(255, 255, 255, 0.4);
  pointer-events: none;
  z-index: 2;
}

.search-input {
  width: 100%;
  height: 56px;
  padding: 0 50px 0 56px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  outline: none;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.search-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 65, 108, 0.5);
  box-shadow: 0 0 0 4px rgba(255, 65, 108, 0.1);
}

.clear-button {
  position: absolute;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 2;
}

.clear-button:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 120px;
  height: 56px;
  padding: 0 28px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(255, 65, 108, 0.3);
  flex-shrink: 0;
}

.search-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 65, 108, 0.4);
}

.search-button:active:not(:disabled) {
  transform: translateY(0);
}

.search-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.search-button-text {
  white-space: nowrap;
}

/* ═══════════════════════════════════════════ */
/* SEARCH BAR - АДАПТИВ */
/* ═══════════════════════════════════════════ */

@media (max-width: 768px) {
  .search-bar {
    margin-bottom: 40px;
    padding: 0 16px;
  }

  .search-container {
    gap: 10px;
  }

  .search-input {
    height: 50px;
    font-size: 15px;
    padding: 0 50px 0 52px;
  }

  .search-button {
    min-width: 100px;
    height: 50px;
    padding: 0 20px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .search-bar {
    padding: 0 12px;
  }

  .search-container {
    gap: 8px;
  }

  .search-input {
    height: 48px;
    font-size: 14px;
    padding: 0 44px 0 48px;
    border-radius: 14px;
  }

  .search-icon {
    left: 16px;
  }

  .clear-button {
    right: 12px;
    width: 28px;
    height: 28px;
  }

  /* КНОПКА НА МОБИЛКАХ - ТОЛЬКО ИКОНКА */
  .search-button {
    min-width: 48px;
    width: 48px;
    height: 48px;
    padding: 0;
    border-radius: 14px;
  }

  /* Скрываем текст на мобилках */
  .search-button-text {
    display: none;
  }
}

@media (max-width: 360px) {
  .search-input {
    height: 44px;
    font-size: 13px;
    padding: 0 40px 0 44px;
  }

  .search-icon {
    left: 14px;
  }

  .search-button {
    min-width: 44px;
    width: 44px;
    height: 44px;
  }
}
</style>
