<template>
  <div class="home">
    <!-- Анимированный фон -->
    <div class="animated-bg">
      <div class="bg-gradient gradient-1"></div>
      <div class="bg-gradient gradient-2"></div>
      <div class="bg-gradient gradient-3"></div>
      <div class="stars"></div>
    </div>

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

        <SearchBar />

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
import SearchBar from '@/components/SearchBar.vue'
import AnimeCard from '@/components/AnimeCard.vue'
import { animeApi } from '@/api/animeApi'

export default {
  name: 'HomeView',
  components: {
    PageLoader,
    SearchBar,
    AnimeCard,
  },
  data() {
    return {
      trending: [],
      initialLoading: true,
      loadingProgress: 0,
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
  },
}
</script>

<style scoped>
.home {
  position: relative;
  min-height: 100vh;
  background: #000;
  overflow-x: hidden;
}

/* ═══════════════════════════════════════════ */
/* АНИМИРОВАННЫЙ ФОН */
/* ═══════════════════════════════════════════ */
.animated-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.bg-gradient {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: float 20s infinite ease-in-out;
}

.gradient-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #ff416c, transparent);
  top: -300px;
  left: -200px;
  animation-delay: 0s;
}

.gradient-2 {
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, #ff4b2b, transparent);
  bottom: -400px;
  right: -300px;
  animation-delay: 7s;
}

.gradient-3 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #9c27b0, transparent);
  top: 40%;
  left: 50%;
  animation-delay: 14s;
}

.stars {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(2px 2px at 20% 30%, white, transparent),
    radial-gradient(2px 2px at 60% 70%, white, transparent),
    radial-gradient(1px 1px at 50% 50%, white, transparent),
    radial-gradient(1px 1px at 80% 10%, white, transparent),
    radial-gradient(2px 2px at 90% 60%, white, transparent),
    radial-gradient(1px 1px at 33% 80%, white, transparent);
  background-size: 200% 200%;
  animation: twinkle 8s ease-in-out infinite;
  opacity: 0.5;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(50px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-50px, 50px) scale(0.9);
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

/* ═══════════════════════════════════════════ */
/* КОНТЕНТ */
/* ═══════════════════════════════════════════ */
.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 20px;
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
  backdrop-filter: blur(10px);
  animation: fadeInDown 0.8s ease-out;
}

.hero-badge svg {
  width: 20px;
  height: 20px;
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
  animation: gradientShift 3s ease infinite;
  background-size: 200% 200%;
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
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
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
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
}

.grid-item {
  animation: fadeInScale 0.6s ease-out both;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
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
  backdrop-filter: blur(10px);
  animation: fadeInUp 0.8s ease-out;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
  animation: float 3s ease-in-out infinite;
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

  /* Уменьшаем фоновые градиенты */
  .gradient-1 {
    width: 400px;
    height: 400px;
  }

  .gradient-2 {
    width: 500px;
    height: 500px;
  }

  .gradient-3 {
    width: 300px;
    height: 300px;
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
</style>
