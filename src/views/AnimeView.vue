<template>
  <div class="anime-page">
    <!-- Загрузочный экран -->
    <transition name="fade-out">
      <PageLoader v-if="loading" :progress="loadingProgress" />
    </transition>

    <!-- Контент страницы -->
    <transition name="fade-in">
      <div v-if="!loading && anime">
        <div class="anime-header">
          <div class="header-bg" :style="{ backgroundImage: `url(${anime.poster})` }"></div>
          <div class="header-content">
            <div class="header-top">
              <button @click="$router.go(-1)" class="back-btn">
                <IconArrowLeft :size="20" class="back-icon" />
                <span class="back-text">Назад</span>
              </button>

              <!-- Название и действия -->
              <div class="header-info">
                <h1 class="header-title">{{ anime.title }}</h1>
                <div class="header-right">
                  <!-- Следующий эпизод -->
                  <div class="next-episode-compact" v-if="anime.next_episode_at">
                    <div class="next-episode-icon">📅</div>
                    <div class="next-episode-text">
                      <span class="next-episode-label">Следующий эпизод</span>
                      <span class="next-episode-date">{{
                        formatDateCompact(anime.next_episode_at)
                      }}</span>
                    </div>
                  </div>

                  <!-- Кнопки действий -->
                  <div class="header-actions">
                    <FavoriteButton
                      v-if="anime"
                      :animeId="anime.id"
                      :animeData="{
                        title: anime.title,
                        poster: anime.poster,
                        year: anime.year,
                        rating: anime.rating,
                      }"
                      @favorite-added="onFavoriteAdded"
                      @favorite-removed="onFavoriteRemoved"
                    />

                    <WatchedButton
                      v-if="anime"
                      :animeId="anime.id"
                      :totalEpisodes="anime.episodes_count || anime.series_count"
                      :animeData="{
                        title: anime.title,
                        poster: anime.poster,
                      }"
                      @watched-changed="onWatchedChanged"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="anime-container">
          <div class="anime-main">
            <VideoPlayer
              v-if="anime"
              :animeId="anime.id"
              :animeTitle="anime.title"
              :animePoster="anime.poster"
              :episodesCount="anime.episodes_count || anime.series_count"
              :translations="translations"
            />

            <!-- Вкладки -->
            <div class="anime-tabs">
              <TabNavigation :currentTab="currentTab" :tabs="tabs" @change-tab="changeTab" />

              <!-- Контент вкладок -->
              <div class="tab-content">
                <AnimeDetails v-if="currentTab === 'description'" :anime="anime" />
                <AnimeCards v-if="currentTab === 'cards'" :animeId="anime.id" />
                <AnimeReviews v-if="currentTab === 'reviews'" :animeId="anime.id" />
              </div>
            </div>
          </div>

          <div class="anime-sidebar" v-if="anime.screenshots && anime.screenshots.length > 1">
            <h3 class="sidebar-title">
              <IconImage :size="22" class="sidebar-icon" />
              Скриншоты
            </h3>
            <div class="screenshots-grid">
              <div
                v-for="(img, i) in anime.screenshots.slice(0, 6)"
                :key="i"
                class="screenshot-item"
                @click="openImage(img)"
              >
                <img :src="img" :alt="`Screenshot ${i + 1}`" class="screenshot-thumb" />
                <div class="screenshot-overlay">
                  <IconZoomIn :size="32" class="zoom-icon" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Комментарии (внизу страницы, на всю ширину) -->
        <div class="comments-section">
          <AnimeComments v-if="anime" :animeId="anime.id" />
        </div>

        <!-- Модалка с полным изображением -->
        <transition name="modal-fade">
          <div v-if="selectedImage" class="image-modal" @click="closeImage">
            <button class="modal-close" @click.stop="closeImage">
              <IconX :size="24" />
            </button>
            <img :src="selectedImage" class="modal-image" @click.stop />
          </div>
        </transition>
      </div>
    </transition>

    <!-- Ошибка -->
    <div v-if="!loading && !anime" class="error-page">
      <div class="error-content">
        <div class="error-icon">😢</div>
        <h2>Аниме не найдено</h2>
        <p>К сожалению, мы не смогли найти это аниме</p>
        <button @click="$router.push('/')" class="btn-primary">
          <IconHome :size="20" class="btn-icon" />
          На главную
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import PageLoader from '@/components/PageLoader.vue'
import VideoPlayer from '@/components/VideoPlayer.vue'
import FavoriteButton from '@/components/FavoriteButton.vue'
import WatchedButton from '@/components/WatchedButton.vue'
import TabNavigation from '@/components/anime-view/TabNavigation.vue'
import AnimeDetails from '@/components/anime-view/AnimeDetails.vue'
import AnimeCards from '@/components/anime-view/AnimeCards.vue'
import AnimeReviews from '@/components/anime-view/AnimeReviews.vue'
import AnimeComments from '@/components/anime-view/AnimeComments.vue'
import { animeApi } from '@/api/animeApi'

export default {
  name: 'AnimeView',
  components: {
    PageLoader,
    VideoPlayer,
    FavoriteButton,
    WatchedButton,
    TabNavigation,
    AnimeDetails,
    AnimeCards,
    AnimeReviews,
    AnimeComments,
  },
  data() {
    return {
      anime: null,
      translations: [],
      loading: true,
      loadingProgress: 0,
      selectedImage: null,
      currentTab: 'description',
      tabs: [
        {
          id: 'description',
          label: 'Описание',
          icon: 'description',
        },
        {
          id: 'cards',
          label: 'Карточки',
          icon: 'cards',
          count: 8,
        },
        {
          id: 'reviews',
          label: 'Отзывы',
          icon: 'reviews',
          count: 15,
        },
      ],
    }
  },
  async mounted() {
    await this.loadAnime()
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loadAnime()
      },
    },
  },
  methods: {
    async loadAnime() {
      this.loading = true
      this.loadingProgress = 0

      try {
        const progressInterval = setInterval(() => {
          if (this.loadingProgress < 90) {
            this.loadingProgress += 15
          }
        }, 150)

        this.anime = await animeApi.getAnimeDetails(this.$route.params.id)

        this.translations = this.anime?.translations || []

        clearInterval(progressInterval)
        this.loadingProgress = 100

        setTimeout(() => {
          this.loading = false
        }, 400)
      } catch (err) {
        console.error('Load anime error:', err)
        this.loadingProgress = 100
        setTimeout(() => {
          this.loading = false
        }, 400)
      }
    },

    changeTab(tabId) {
      this.currentTab = tabId
    },

    formatDateCompact(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const now = new Date()
      const diff = date - now
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))

      if (days === 0) return 'Сегодня'
      if (days === 1) return 'Завтра'
      if (days > 1 && days < 7) return `Через ${days} дн.`

      const options = {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }
      return date.toLocaleDateString('ru-RU', options)
    },

    getStatusClass(status) {
      if (!status) return ''
      const s = status.toLowerCase()
      if (s.includes('онгоинг') || s.includes('ongoing')) return 'status-ongoing'
      if (s.includes('анонс') || s.includes('announced')) return 'status-announced'
      return 'status-released'
    },

    getStatusText(status) {
      if (!status) return ''
      const s = status.toLowerCase()
      if (s.includes('онгоинг') || s.includes('ongoing')) return 'Выходит'
      if (s.includes('анонс') || s.includes('announced')) return 'Анонс'
      return 'Вышло'
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
      return date.toLocaleDateString('ru-RU', options)
    },

    onFavoriteAdded() {
      console.log('Добавлено в избранное')
    },

    onFavoriteRemoved() {
      console.log('Удалено из избранного')
    },

    onWatchedChanged(data) {
      console.log('Статус просмотра изменён:', data)
    },

    openImage(img) {
      this.selectedImage = img
    },

    closeImage() {
      this.selectedImage = null
    },
  },
}
</script>

<style scoped>
/* ═══════════════════════════════════════════ */
/* БАЗОВЫЕ СТИЛИ */
/* ═══════════════════════════════════════════ */
.anime-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #0a0a0a, #000);
  color: white;
}

/* Глобальные стили для кнопок действий */
.anime-page :deep(.favorite-btn),
.anime-page :deep(.watched-btn) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
  white-space: nowrap;
  min-height: 48px;
  padding: 12px 20px;
}

.anime-page :deep(.favorite-btn:hover),
.anime-page :deep(.watched-btn:hover) {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 65, 108, 0.5);
  transform: translateY(-2px);
}

.anime-page :deep(.favorite-btn.active) {
  background: linear-gradient(135deg, rgba(255, 65, 108, 0.2), rgba(255, 75, 43, 0.2));
  border-color: rgba(255, 65, 108, 0.6);
}

.anime-page :deep(.watched-btn.active) {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(56, 142, 60, 0.2));
  border-color: rgba(76, 175, 80, 0.6);
}

/* ═══════════════════════════════════════════ */
/* HEADER */
/* ═══════════════════════════════════════════ */
.anime-header {
  position: relative;
  min-height: 220px;
  height: auto;
  overflow: hidden;
  padding-bottom: 0;
}

.header-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: blur(20px);
  opacity: 0.3;
  transform: scale(1.1);
}

.header-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, #0a0a0a 100%);
}

.header-content {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 40px 8px;
  z-index: 100;
}

.header-top {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s;
  width: fit-content;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-4px);
  border-color: rgba(255, 65, 108, 0.5);
}

.back-icon {
  flex-shrink: 0;
}

.header-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.header-title {
  font-size: clamp(24px, 5vw, 42px);
  font-weight: 900;
  margin: 0;
  line-height: 1.2;
  color: white;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  flex: 1;
  word-break: break-word;
}

.header-right {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-shrink: 0;
  position: relative;
  z-index: 150;
}

.next-episode-compact {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(56, 142, 60, 0.2));
  border: 2px solid rgba(76, 175, 80, 0.4);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  animation: pulse 2s ease-in-out infinite;
  white-space: nowrap;
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(76, 175, 80, 0);
  }
}

.next-episode-icon {
  font-size: 24px;
  line-height: 1;
  flex-shrink: 0;
}

.next-episode-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.next-episode-label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.next-episode-date {
  font-size: 14px;
  font-weight: 700;
  color: #4caf50;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  position: relative;
  z-index: 200;
}

.header-actions > * {
  min-height: 48px;
}

/* Добавляем стили для компонентов кнопок на мобильных */
.header-actions :deep(button),
.header-actions :deep(.favorite-btn),
.header-actions :deep(.watched-btn) {
  min-height: 48px;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 16px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  position: relative;
  z-index: 201;
}

/* ═══════════════════════════════════════════ */
/* КОНТЕЙНЕР */
/* ═══════════════════════════════════════════ */
.anime-container {
  max-width: 1400px;
  margin: -60px auto 0;
  padding: 0 40px 40px;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;
  position: relative;
  z-index: 1;
}

.anime-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

/* ═══════════════════════════════════════════ */
/* ИНФОРМАЦИЯ */
/* ═══════════════════════════════════════════ */
.anime-info-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(10px);
}

.anime-tabs {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.tab-content {
  margin-top: 0;
}

.comments-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px 40px;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 20px;
}

.info-titles {
  flex: 1;
  min-width: 0;
}

.anime-title {
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 900;
  margin: 0 0 12px;
  line-height: 1.2;
  background: linear-gradient(135deg, white, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  word-break: break-word;
}

.anime-title-orig {
  font-size: clamp(14px, 2vw, 18px);
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  font-weight: 500;
  word-break: break-word;
}

.anime-rating {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 152, 0, 0.15));
  border: 2px solid rgba(255, 193, 7, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}

.rating-star {
  font-size: 32px;
  line-height: 1;
}

.rating-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rating-value {
  font-size: 28px;
  font-weight: 900;
  color: #ffc107;
  line-height: 1;
}

.rating-label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 193, 7, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ═══════════════════════════════════════════ */
/* МЕТА ИНФОРМАЦИЯ */
/* ═══════════════════════════════════════════ */
.anime-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s;
  min-width: 0;
}

.meta-item:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 65, 108, 0.3);
  transform: translateY(-2px);
}

.meta-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 65, 108, 0.1);
  border-radius: 10px;
  flex-shrink: 0;
}

.meta-icon svg {
  width: 20px;
  height: 20px;
  color: #ff416c;
}

.meta-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.meta-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.meta-value {
  font-size: 16px;
  font-weight: 700;
  color: white;
  word-break: break-word;
}

.meta-total {
  color: rgba(255, 255, 255, 0.4);
  font-weight: 500;
}

.status-ongoing {
  color: #4caf50;
}

.status-announced {
  color: #2196f3;
}

.status-released {
  color: #9e9e9e;
}

/* ═══════════════════════════════════════════ */
/* БОКОВАЯ ПАНЕЛЬ */
/* ═══════════════════════════════════════════ */
.anime-sidebar {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 80px;
  backdrop-filter: blur(10px);
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 16px;
  color: white;
}

.sidebar-icon {
  color: #ff416c;
  flex-shrink: 0;
}

.screenshots-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.screenshot-item {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s;
}

.screenshot-item:hover {
  border-color: rgba(255, 65, 108, 0.5);
  transform: scale(1.05);
}

.screenshot-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.screenshot-item:hover .screenshot-thumb {
  transform: scale(1.1);
}

.screenshot-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.screenshot-item:hover .screenshot-overlay {
  opacity: 1;
}

/* ═══════════════════════════════════════════ */
/* МОДАЛЬНОЕ ОКНО */
/* ═══════════════════════════════════════════ */
.image-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 40px;
  cursor: pointer;
  backdrop-filter: blur(10px);
}

.modal-close {
  position: absolute;
  top: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10001;
}

.modal-close:hover {
  background: rgba(255, 65, 108, 0.2);
  border-color: rgba(255, 65, 108, 0.5);
  transform: rotate(90deg);
}

.modal-close {
  color: white; /* Цвет для IconX */
}

.modal-image {
  max-width: 90%;
  max-height: 90%;
  border-radius: 16px;
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.8);
  cursor: default;
}

/* ═══════════════════════════════════════════ */
/* СТРАНИЦА ОШИБКИ */
/* ═══════════════════════════════════════════ */
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.error-content {
  text-align: center;
  max-width: 500px;
}

.error-icon {
  font-size: 100px;
  margin-bottom: 30px;
  animation: errorShake 2s infinite;
}

@keyframes errorShake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}

.error-content h2 {
  font-size: clamp(24px, 5vw, 32px);
  font-weight: 900;
  margin: 0 0 16px;
  color: white;
}

.error-content p {
  font-size: clamp(14px, 2vw, 16px);
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 40px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: none;
  border-radius: 14px;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 10px 30px rgba(255, 65, 108, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(255, 65, 108, 0.4);
}

/* ═══════════════════════════════════════════ */
/* АНИМАЦИИ */
/* ═══════════════════════════════════════════ */
.fade-out-leave-active {
  transition: opacity 0.3s;
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

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВНАЯ ВЕРСИЯ */
/* ═══════════════════════════════════════════ */

/* Планшеты и средние экраны (до 1200px) */
@media (max-width: 1200px) {
  .anime-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .anime-sidebar {
    position: static;
  }

  .screenshots-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Средние планшеты (до 968px) */
@media (max-width: 968px) {
  .anime-header {
    height: auto;
    min-height: 220px;
    padding-bottom: 0;
  }

  .header-content {
    padding: 12px 30px 6px;
  }

  .header-top {
    gap: 8px;
  }

  .header-info {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .header-right {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .next-episode-compact {
    width: 100%;
    justify-content: flex-start;
  }

  .header-actions {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .header-actions > * {
    width: 100%;
    min-height: 46px;
  }

  .header-actions :deep(button),
  .header-actions :deep(.favorite-btn),
  .header-actions :deep(.watched-btn) {
    width: 100%;
    min-height: 46px;
    font-size: 14px;
    padding: 10px 14px;
  }

  .anime-container {
    margin-top: -70px;
    padding: 0 30px 30px;
  }

  .anime-meta {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}

/* Малые планшеты и большие телефоны (до 768px) */
@media (max-width: 768px) {
  .anime-header {
    min-height: 220px;
    padding-bottom: 0;
  }

  .header-content {
    padding: 10px 20px 4px;
  }

  .header-top {
    gap: 8px;
  }

  .back-btn {
    padding: 8px 14px;
    font-size: 13px;
  }

  .header-title {
    font-size: clamp(18px, 6vw, 24px);
  }

  .header-info {
    gap: 14px;
  }

  .header-right {
    gap: 10px;
  }

  .header-actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }

  .header-actions > * {
    min-height: 44px;
  }

  .header-actions :deep(button),
  .header-actions :deep(.favorite-btn),
  .header-actions :deep(.watched-btn) {
    min-height: 44px;
    font-size: 13px;
    padding: 10px 12px;
  }

  .anime-container {
    margin-top: -60px;
    padding: 0 20px 24px;
    gap: 16px;
  }

  .anime-main {
    gap: 16px;
  }

  .anime-info-card {
    padding: 16px;
    border-radius: 14px;
  }

  .anime-tabs {
    padding: 16px;
    border-radius: 14px;
  }

  .comments-section {
    padding: 0 20px 24px;
  }

  .info-header {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }

  .anime-rating {
    align-self: flex-start;
    padding: 12px 16px;
  }

  .rating-star {
    font-size: 24px;
  }

  .rating-value {
    font-size: 20px;
  }

  .anime-meta {
    grid-template-columns: 1fr;
    gap: 8px;
    margin-bottom: 16px;
    padding-bottom: 16px;
  }

  .section-title {
    font-size: clamp(16px, 4vw, 18px);
    margin-bottom: 10px;
  }

  .description-text {
    font-size: 14px;
    line-height: 1.5;
  }

  .anime-description,
  .anime-genres {
    margin-bottom: 16px;
  }

  .genre-badge {
    padding: 6px 12px;
    font-size: 12px;
  }

  .next-episode {
    padding: 12px 14px;
    gap: 8px;
    margin-top: 16px;
  }

  .next-episode-icon {
    font-size: 24px;
  }

  .screenshots-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }

  .anime-sidebar {
    padding: 16px;
    border-radius: 14px;
  }

  .modal-image {
    max-width: 95%;
    max-height: 80%;
  }

  .modal-close {
    top: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
  }
}

/* Телефоны (до 480px) */
@media (max-width: 480px) {
  .anime-header {
    min-height: 260px;
    padding-bottom: 0;
  }

  .header-content {
    padding: 8px 16px 4px;
  }

  .header-top {
    gap: 8px;
  }

  .back-btn {
    padding: 6px 12px;
    font-size: 12px;
    gap: 4px;
  }

  .back-text {
    display: none;
  }

  .header-title {
    font-size: clamp(16px, 7vw, 22px);
  }

  .header-info {
    gap: 12px;
  }

  .header-right {
    gap: 10px;
  }

  .next-episode-compact {
    padding: 6px 12px;
    gap: 6px;
  }

  .next-episode-icon {
    font-size: 18px;
  }

  .next-episode-label {
    font-size: 9px;
  }

  .next-episode-date {
    font-size: 11px;
  }

  .header-actions {
    flex-direction: column;
    gap: 6px;
    width: 100%;
  }

  .header-actions > * {
    width: 100%;
    min-height: 44px;
  }

  .header-actions :deep(button),
  .header-actions :deep(.favorite-btn),
  .header-actions :deep(.watched-btn) {
    width: 100%;
    min-height: 44px;
    font-size: 13px;
    padding: 10px 14px;
    border-radius: 10px;
  }

  .header-actions :deep(svg),
  .header-actions :deep(.icon) {
    width: 18px;
    height: 18px;
  }

  .anime-container {
    margin-top: -60px;
    padding: 0 16px 20px;
    gap: 12px;
  }

  .anime-main {
    gap: 12px;
  }

  .anime-info-card {
    padding: 12px;
  }

  .anime-tabs {
    padding: 12px;
  }

  .comments-section {
    padding: 0 16px 20px;
  }

  .info-header {
    gap: 10px;
    margin-bottom: 12px;
  }

  .anime-title {
    font-size: clamp(18px, 6vw, 24px);
    margin-bottom: 6px;
  }

  .anime-title-orig {
    font-size: 13px;
  }

  .anime-rating {
    padding: 10px 14px;
  }

  .rating-star {
    font-size: 20px;
  }

  .rating-value {
    font-size: 18px;
  }

  .rating-label {
    font-size: 9px;
  }

  .anime-meta {
    gap: 6px;
    margin-bottom: 12px;
    padding-bottom: 12px;
  }

  .meta-item {
    padding: 8px;
    gap: 8px;
  }

  .meta-icon {
    width: 30px;
    height: 30px;
  }

  .meta-icon svg {
    width: 16px;
    height: 16px;
  }

  .meta-label {
    font-size: 10px;
  }

  .meta-value {
    font-size: 13px;
  }

  .section-title {
    font-size: 15px;
    gap: 6px;
    margin-bottom: 8px;
  }

  .section-icon {
    width: 16px;
    height: 16px;
  }

  .description-text {
    font-size: 13px;
    line-height: 1.5;
  }

  .anime-description,
  .anime-genres {
    margin-bottom: 12px;
  }

  .genres-list {
    gap: 4px;
  }

  .genre-badge {
    padding: 5px 10px;
    font-size: 11px;
  }

  .next-episode {
    padding: 10px 12px;
    gap: 6px;
    margin-top: 12px;
  }

  .next-episode-icon {
    font-size: 20px;
  }

  .next-episode-content h4 {
    font-size: 12px;
    margin-bottom: 3px;
  }

  .next-episode-content p {
    font-size: 11px;
  }

  .anime-sidebar {
    padding: 12px;
  }

  .sidebar-title {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .screenshots-grid {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .screenshot-item {
    border-radius: 8px;
  }

  .image-modal {
    padding: 12px;
  }

  .modal-close {
    top: 10px;
    right: 10px;
    width: 36px;
    height: 36px;
  }

  .modal-image {
    max-width: 100%;
    max-height: 85%;
    border-radius: 8px;
  }

  .error-page {
    padding: 20px 12px;
  }

  .error-icon {
    font-size: 60px;
    margin-bottom: 16px;
  }

  .btn-primary {
    padding: 10px 20px;
    font-size: 14px;
  }
}

/* Очень маленькие телефоны (до 360px) */
@media (max-width: 360px) {
  .header-title {
    font-size: 16px;
  }

  .anime-title {
    font-size: 18px;
  }

  .next-episode-label {
    font-size: 8px;
  }

  .next-episode-date {
    font-size: 10px;
  }

  .header-actions > * {
    min-height: 42px;
  }

  .header-actions :deep(button),
  .header-actions :deep(.favorite-btn),
  .header-actions :deep(.watched-btn) {
    min-height: 42px;
    font-size: 12px;
    padding: 8px 12px;
  }

  .meta-value {
    font-size: 12px;
  }

  .description-text {
    font-size: 12px;
  }

  .genre-badge {
    padding: 4px 8px;
    font-size: 10px;
  }

  .anime-info-card {
    padding: 10px;
  }

  .anime-tabs {
    padding: 10px;
  }
}
</style>
