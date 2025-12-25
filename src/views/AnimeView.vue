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
                <svg viewBox="0 0 24 24" class="back-icon">
                  <path
                    d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                    fill="currentColor"
                  />
                </svg>
                Назад
              </button>

              <!-- Название и действия -->
              <div class="header-info">
                <h1 class="header-title">{{ anime.title }}</h1>
                <div class="header-actions">
                  <FavoriteButton :anime-id="anime.id" />
                  <WatchedButton :anime-id="anime.id" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="anime-container">
          <div class="anime-main">
            <VideoPlayer
              :anime-id="anime.id"
              :episodes-count="anime.series_count"
              :translations="anime.translations"
            />

            <div class="anime-info">
              <div class="info-header">
                <div class="info-titles">
                  <h1 class="anime-title">{{ anime.title }}</h1>
                  <p class="anime-title-orig" v-if="anime.title_orig">{{ anime.title_orig }}</p>
                </div>
                <div class="anime-rating" v-if="anime.rating">
                  <div class="rating-star">⭐</div>
                  <div class="rating-info">
                    <span class="rating-value">{{ anime.rating }}</span>
                    <span class="rating-label">Shikimori</span>
                  </div>
                </div>
              </div>

              <div class="anime-meta">
                <div class="meta-item">
                  <div class="meta-icon">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div class="meta-content">
                    <span class="meta-label">Тип</span>
                    <span class="meta-value">{{ anime.type }}</span>
                  </div>
                </div>

                <div class="meta-item" v-if="anime.year">
                  <div class="meta-icon">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div class="meta-content">
                    <span class="meta-label">Год</span>
                    <span class="meta-value">{{ anime.year }}</span>
                  </div>
                </div>

                <div class="meta-item" v-if="anime.status">
                  <div class="meta-icon">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div class="meta-content">
                    <span class="meta-label">Статус</span>
                    <span class="meta-value" :class="getStatusClass(anime.status)">
                      {{ getStatusText(anime.status) }}
                    </span>
                  </div>
                </div>

                <div class="meta-item" v-if="anime.episodes_count">
                  <div class="meta-icon">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div class="meta-content">
                    <span class="meta-label">Эпизодов</span>
                    <span class="meta-value">
                      {{ anime.episodes_aired || anime.episodes_count }}
                      <span class="meta-total">/ {{ anime.episodes_count }}</span>
                    </span>
                  </div>
                </div>

                <div class="meta-item" v-if="anime.duration">
                  <div class="meta-icon">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div class="meta-content">
                    <span class="meta-label">Длительность</span>
                    <span class="meta-value">{{ anime.duration }} мин</span>
                  </div>
                </div>
              </div>

              <div class="anime-description" v-if="anime.description">
                <h3 class="section-title">
                  <svg viewBox="0 0 24 24" class="section-icon">
                    <path
                      d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
                      fill="currentColor"
                    />
                  </svg>
                  Описание
                </h3>
                <p class="description-text">{{ anime.description }}</p>
              </div>

              <div class="anime-genres" v-if="anime.genres && anime.genres.length">
                <h3 class="section-title">
                  <svg viewBox="0 0 24 24" class="section-icon">
                    <path
                      d="M12 2l-5.5 9h11z M17.5 11L12 20l5.5-9z M6.5 11L12 2 6.5 11z M12 20l-5.5-9H6.5L12 20z"
                      fill="currentColor"
                    />
                  </svg>
                  Жанры
                </h3>
                <div class="genres-list">
                  <span v-for="g in anime.genres" :key="g" class="genre-badge">
                    {{ g }}
                  </span>
                </div>
              </div>

              <!-- Информация о следующем эпизоде -->
              <div class="next-episode" v-if="anime.next_episode_at">
                <div class="next-episode-icon">📅</div>
                <div class="next-episode-content">
                  <h4>Следующий эпизод</h4>
                  <p>{{ formatDate(anime.next_episode_at) }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="anime-sidebar" v-if="anime.screenshots && anime.screenshots.length > 1">
            <h3 class="sidebar-title">
              <svg viewBox="0 0 24 24" class="sidebar-icon">
                <path
                  d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
                  fill="currentColor"
                />
              </svg>
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
                  <svg viewBox="0 0 24 24" class="zoom-icon">
                    <path
                      d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Модалка с полным изображением -->
        <transition name="modal-fade">
          <div v-if="selectedImage" class="image-modal" @click="closeImage">
            <button class="modal-close" @click.stop="closeImage">
              <svg viewBox="0 0 24 24">
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  fill="currentColor"
                />
              </svg>
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
          <svg viewBox="0 0 24 24" class="btn-icon">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor" />
          </svg>
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
import { animeApi } from '@/api/animeApi'

export default {
  name: 'AnimeView',
  components: {
    PageLoader,
    VideoPlayer,
    FavoriteButton,
    WatchedButton,
  },
  data() {
    return {
      anime: null,
      loading: true,
      loadingProgress: 0,
      selectedImage: null,
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
        // Симуляция прогресса
        const progressInterval = setInterval(() => {
          if (this.loadingProgress < 90) {
            this.loadingProgress += 15
          }
        }, 150)

        this.anime = await animeApi.getAnimeDetails(this.$route.params.id)

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
/* ГЛАВНЫЙ КОНТЕЙНЕР */
/* ═══════════════════════════════════════════ */
.anime-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #0a0a0a, #000);
  color: white;
}

/* ═══════════════════════════════════════════ */
/* HEADER */
/* ═══════════════════════════════════════════ */
.anime-header {
  position: relative;
  height: 350px;
  overflow: hidden;
}

.header-top {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  padding: 0 4px;
}

.header-title {
  font-size: 42px;
  font-weight: 900;
  margin: 0;
  line-height: 1.2;
  color: white;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  flex: 1;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
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
  padding: 30px 40px;
  z-index: 10;
}

.back-btn {
  display: flex;
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
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-4px);
  border-color: rgba(255, 65, 108, 0.5);
}

.back-icon {
  width: 20px;
  height: 20px;
}

/* ═══════════════════════════════════════════ */
/* КОНТЕЙНЕР */
/* ═══════════════════════════════════════════ */
.anime-container {
  max-width: 1400px;
  margin: -150px auto 0;
  padding: 0 40px 60px;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;
  position: relative;
  z-index: 10;
}

.anime-main {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* ═══════════════════════════════════════════ */
/* ИНФОРМАЦИЯ */
/* ═══════════════════════════════════════════ */
.anime-info {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 40px;
  backdrop-filter: blur(10px);
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  gap: 30px;
}

.info-titles {
  flex: 1;
}

.anime-title {
  font-size: 36px;
  font-weight: 900;
  margin: 0 0 12px;
  line-height: 1.2;
  background: linear-gradient(135deg, white, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.anime-title-orig {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  font-weight: 500;
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s;
}

.meta-item:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 65, 108, 0.3);
  transform: translateY(-2px);
}

.meta-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 65, 108, 0.1);
  border-radius: 10px;
  flex-shrink: 0;
}

.meta-icon svg {
  width: 22px;
  height: 22px;
  color: #ff416c;
}

.meta-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
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
/* СЕКЦИИ */
/* ═══════════════════════════════════════════ */
.anime-description,
.anime-genres {
  margin-bottom: 40px;
}

.anime-description:last-child,
.anime-genres:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 20px;
  color: white;
}

.section-icon {
  width: 24px;
  height: 24px;
  color: #ff416c;
}

.description-text {
  font-size: 16px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.genres-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.genre-badge {
  padding: 10px 18px;
  background: rgba(255, 65, 108, 0.1);
  border: 1px solid rgba(255, 65, 108, 0.3);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #ff416c;
  transition: all 0.3s;
  cursor: default;
}

.genre-badge:hover {
  background: rgba(255, 65, 108, 0.2);
  border-color: rgba(255, 65, 108, 0.5);
  transform: translateY(-2px);
}

/* ═══════════════════════════════════════════ */
/* СЛЕДУЮЩИЙ ЭПИЗОД */
/* ═══════════════════════════════════════════ */
.next-episode {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(56, 142, 60, 0.15));
  border: 2px solid rgba(76, 175, 80, 0.3);
  border-radius: 16px;
  margin-top: 40px;
}

.next-episode-icon {
  font-size: 32px;
  line-height: 1;
}

.next-episode-content h4 {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 6px;
  color: #4caf50;
}

.next-episode-content p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

/* ═══════════════════════════════════════════ */
/* БОКОВАЯ ПАНЕЛЬ */
/* ═══════════════════════════════════════════ */
.anime-sidebar {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 30px;
  height: fit-content;
  position: sticky;
  top: 100px;
  backdrop-filter: blur(10px);
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 20px;
  color: white;
}

.sidebar-icon {
  width: 22px;
  height: 22px;
  color: #ff416c;
}

.screenshots-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
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

.zoom-icon {
  width: 32px;
  height: 32px;
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

.modal-close svg {
  width: 24px;
  height: 24px;
  color: white;
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
  padding: 40px;
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
  font-size: 32px;
  font-weight: 900;
  margin: 0 0 16px;
  color: white;
}

.error-content p {
  font-size: 16px;
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

.btn-icon {
  width: 20px;
  height: 20px;
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
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */
@media (max-width: 1200px) {
  .anime-container {
    grid-template-columns: 1fr;
  }

  .anime-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .anime-header {
    height: 280px;
  }

  .header-content {
    padding: 20px;
  }

  .header-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-title {
    font-size: 28px;
  }

  .header-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .header-actions > * {
    flex: 1;
    min-width: calc(50% - 6px);
  }

  .anime-container {
    margin-top: -80px;
    padding: 0 20px 40px;
  }

  .anime-info {
    padding: 24px;
  }

  .info-header {
    flex-direction: column;
    gap: 20px;
  }

  .anime-title {
    font-size: 28px;
  }

  .anime-rating {
    align-self: flex-start;
  }

  .anime-meta {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .screenshots-grid {
    grid-template-columns: 1fr;
  }

  .modal-image {
    max-width: 95%;
    max-height: 80%;
  }

  .modal-close {
    top: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
  }
}
</style>
