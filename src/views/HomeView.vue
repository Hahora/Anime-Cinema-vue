<template>
  <div class="home">
    <transition name="fade-out">
      <PageLoader v-if="initialLoading" :progress="loadingProgress" />
    </transition>

    <transition name="fade-in">
      <div v-if="!initialLoading">
        <div class="hero">
          <h1 class="hero-title"><span class="gradient-text">Anime</span> Cinema</h1>
          <p class="hero-subtitle">Смотри любимые аниме онлайн без рекламы</p>
        </div>

        <!-- ✅ Поиск редиректит на /search -->
        <SearchBar />

        <!-- Популярное -->
        <div v-if="trending.length" class="section">
          <h2 class="section-title">🔥 Популярное сейчас</h2>
          <div class="anime-grid">
            <AnimeCard v-for="anime in trending" :key="anime.id" :anime="anime" />
          </div>
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
  min-height: 100vh;
  background: radial-gradient(circle at top, #1a0a1f, #000);
  padding: 40px 20px;
  color: white;
}

.hero {
  text-align: center;
  margin-bottom: 60px;
  padding: 60px 20px;
}

.hero-title {
  font-size: clamp(40px, 8vw, 80px);
  font-weight: 900;
  margin: 0 0 20px;
  line-height: 1.1;
  animation: fadeInUp 0.8s ease-out;
}

.gradient-text {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: clamp(16px, 3vw, 24px);
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.section {
  max-width: 1400px;
  margin: 0 auto 60px;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 30px;
  padding-left: 10px;
  border-left: 4px solid #ff416c;
}

.anime-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.empty-state {
  max-width: 500px;
  margin: 100px auto;
  text-align: center;
  padding: 40px;
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
  margin: 0 0 12px;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  margin: 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 100px 20px;
}

.loader-big {
  width: 80px;
  height: 80px;
  border: 6px solid rgba(255, 255, 255, 0.1);
  border-top-color: #ff416c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* ═══════════════════════════════════════════ */
/* АНИМАЦИИ */
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

@keyframes spin {
  to {
    transform: rotate(360deg);
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

@media (max-width: 768px) {
  .anime-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
}
</style>
