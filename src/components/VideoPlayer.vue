<template>
  <div class="video-player">
    <!-- Видео контейнер -->
    <div class="player-wrapper">
      <div ref="playerContainer" class="player-container">
        <video
          ref="video"
          class="video-element"
          @click="togglePlay"
          @timeupdate="onTimeUpdate"
          @loadedmetadata="onMetadataLoaded"
          @ended="onVideoEnded"
          @play="isPlaying = true"
          @pause="isPlaying = false"
        ></video>

        <!-- Загрузка -->
        <div v-if="loading || (isBuffering && !isPlaying) || isSeeking" class="player-loading">
          <div class="spinner"></div>
          <p v-if="loading">Загрузка видео...</p>
          <p v-else-if="isSeeking">Перемотка...</p>
          <p v-else>Буферизация...</p>
        </div>
        <!-- Центральная кнопка Play/Pause -->
        <transition name="fade">
          <div v-if="showPlayButton" class="center-play-button" @click.stop="togglePlay">
            <svg v-if="!isPlaying" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="white">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          </div>
        </transition>

        <!-- ВОССТАНОВЛЕНИЯ ПРОГРЕССА -->
        <transition name="fade">
          <div v-if="showRestoreDialog" class="restore-dialog">
            <div class="restore-content">
              <div class="restore-icon">▶️</div>
              <div class="restore-info">
                <h3>Продолжить просмотр?</h3>
                <p>
                  Вы остановились на <strong>{{ restoreTimeString }}</strong>
                </p>
              </div>
              <div class="restore-actions">
                <button @click="continueFromProgress" class="restore-btn primary">
                  <svg viewBox="0 0 24 24" class="btn-icon">
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                  Продолжить
                </button>
                <button @click="startFromBeginning" class="restore-btn secondary">
                  <svg viewBox="0 0 24 24" class="btn-icon">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" fill="currentColor" />
                  </svg>
                  Сначала
                </button>
              </div>
            </div>
          </div>
        </transition>

        <!-- Индикатор перемотки -->
        <transition name="fade">
          <div v-if="isSeeking && !loading" class="seek-indicator">
            <svg viewBox="0 0 24 24" class="seek-icon">
              <path
                d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v16c0 .55.45 1 1 1zM13 4h6v16h-6V4z"
                fill="white"
              />
            </svg>
            <span>{{ formatTime(currentTime) }}</span>
          </div>
        </transition>

        <!-- Кастомные контролы -->
        <transition name="fade">
          <div v-show="showControls" class="video-controls" @click.stop>
            <!-- Верхние контролы -->
            <div class="controls-top">
              <div class="top-controls-group">
                <!-- Выбор серии -->
                <div class="top-control-item" v-if="episodes.length > 1">
                  <svg viewBox="0 0 24 24" class="control-icon">
                    <path
                      d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"
                      fill="white"
                    />
                  </svg>
                  <select
                    v-model="currentEpisode"
                    @change="changeEpisode"
                    @mouseenter="pauseControlsHiding"
                    @mouseleave="resumeControlsHiding"
                    class="top-select"
                  >
                    <option v-for="ep in episodes" :key="ep" :value="ep">Серия {{ ep }}</option>
                  </select>
                </div>

                <!-- Выбор озвучки -->
                <div class="top-control-item">
                  <svg viewBox="0 0 24 24" class="control-icon">
                    <path
                      d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"
                      fill="white"
                    />
                  </svg>
                  <select
                    v-model="currentTranslation"
                    @change="changeTranslation"
                    @mouseenter="pauseControlsHiding"
                    @mouseleave="resumeControlsHiding"
                    class="top-select"
                  >
                    <option v-for="t in translations" :key="t.id" :value="t.id">
                      {{ t.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div class="controls-spacer"></div>

            <div class="controls-bottom-wrapper">
              <!-- Прогресс бар -->
              <div
                class="progress-container"
                @click="seek"
                @mousemove="handleProgressMouseMove"
                @mouseleave="handleProgressMouseLeave"
              >
                <div class="progress-bar">
                  <div class="progress-buffered" :style="{ width: buffered + '%' }"></div>
                  <div class="progress-filled" :style="{ width: progressPercent + '%' }"></div>
                  <div class="progress-handle" :style="{ left: progressPercent + '%' }"></div>

                  <transition name="fade">
                    <div
                      v-if="showTimePreview"
                      class="time-preview"
                      :style="{ left: previewPosition + '%' }"
                    >
                      <div class="time-preview-bubble">
                        {{ formatTime(previewTime) }}
                      </div>
                      <div class="time-preview-line"></div>
                    </div>
                  </transition>
                </div>
              </div>

              <!-- Нижние контролы -->
              <div class="controls-bottom">
                <div class="controls-left">
                  <!-- Play/Pause -->
                  <button class="control-btn" @click="togglePlay">
                    <svg v-if="!isPlaying" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <svg v-else viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  </button>

                  <!-- Время -->
                  <div class="time-display">
                    <span>{{ formatTime(currentTime) }}</span>
                    <span class="time-separator">/</span>
                    <span>{{ formatTime(duration) }}</span>
                  </div>
                </div>

                <div class="controls-right">
                  <!-- Громкость -->
                  <div class="volume-control">
                    <button class="control-btn" @click="toggleMute">
                      <svg v-if="!isMuted && volume > 0.5" viewBox="0 0 24 24">
                        <path
                          d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
                        />
                      </svg>
                      <svg v-else-if="!isMuted && volume > 0" viewBox="0 0 24 24">
                        <path d="M7 9v6h4l5 5V4l-5 5H7z" />
                      </svg>
                      <svg v-else viewBox="0 0 24 24">
                        <path
                          d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
                        />
                      </svg>
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      v-model.number="volume"
                      class="volume-slider"
                    />
                  </div>

                  <!-- Настройки -->
                  <div class="settings-menu">
                    <button class="control-btn" @click="toggleSettings">
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
                        />
                      </svg>
                    </button>

                    <transition name="slide-up">
                      <div v-if="showSettingsMenu" class="settings-dropdown" @click.stop>
                        <div class="settings-item">
                          <span>Качество</span>
                          <select
                            v-model="currentQuality"
                            @change="changeQuality"
                            class="settings-select"
                          >
                            <option :value="720">720p HD</option>
                            <option :value="480">480p</option>
                            <option :value="360">360p</option>
                          </select>
                        </div>
                        <div class="settings-item">
                          <span>Скорость</span>
                          <select
                            v-model="playbackRate"
                            @change="changePlaybackRate"
                            class="settings-select"
                          >
                            <option :value="0.5">0.5x</option>
                            <option :value="0.75">0.75x</option>
                            <option :value="1">Обычная</option>
                            <option :value="1.25">1.25x</option>
                            <option :value="1.5">1.5x</option>
                            <option :value="2">2x</option>
                          </select>
                        </div>
                      </div>
                    </transition>
                  </div>

                  <!-- Picture-in-Picture -->
                  <button
                    class="control-btn pip-btn"
                    @click="togglePiP"
                    :class="{ active: isPiP }"
                    title="Picture-in-Picture (Test)"
                  >
                    <svg v-if="!isPiP" viewBox="0 0 24 24">
                      <path
                        d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z"
                      />
                    </svg>
                    <svg v-else viewBox="0 0 24 24">
                      <path d="M19 11h-8v6h8v-6zm4-6H1v14h22V5zm-2 12H3V7h18v10z" />
                    </svg>
                  </button>

                  <!-- Полноэкранный режим -->
                  <button class="control-btn" @click="toggleFullscreen">
                    <svg v-if="!isFullscreen" viewBox="0 0 24 24">
                      <path
                        d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                      />
                    </svg>
                    <svg v-else viewBox="0 0 24 24">
                      <path
                        d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Информация о текущем эпизоде -->
      <div class="episode-info" v-if="!loading">
        <div class="episode-title">
          <span class="episode-number">Серия {{ currentEpisode }}</span>
          <span class="translation-name">{{ currentTranslationName }}</span>
        </div>
        <div class="episode-meta">
          <span>{{ currentQuality }}p</span>
          <span>•</span>
          <span>{{ playbackRate }}x</span>
        </div>
      </div>
    </div>

    <!-- Панель выбора серий и озвучек -->
    <div class="player-sidebar">
      <!-- Выбор озвучки -->
      <div class="sidebar-section">
        <h3 class="sidebar-title">
          <svg viewBox="0 0 24 24" class="sidebar-icon">
            <path
              d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"
            />
          </svg>
          Озвучка
        </h3>
        <div class="translation-list">
          <div
            v-for="t in translations"
            :key="t.id"
            :class="['translation-item', { active: currentTranslation === t.id }]"
            @click="selectTranslation(t.id)"
          >
            <div class="translation-info">
              <span class="translation-studio">{{ t.name }}</span>
              <span class="translation-episodes">{{ extractEpisodeCount(t.name) }}</span>
            </div>
            <svg v-if="currentTranslation === t.id" viewBox="0 0 24 24" class="check-icon">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Список серий -->
      <div class="sidebar-section">
        <h3 class="sidebar-title">
          <svg viewBox="0 0 24 24" class="sidebar-icon">
            <path
              d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"
            />
          </svg>
          Серии ({{ episodes.length }})
        </h3>
        <div class="episodes-grid">
          <div
            v-for="ep in episodes"
            :key="ep"
            :class="['episode-item', { active: currentEpisode === ep, watched: isWatched(ep) }]"
            @click="selectEpisode(ep)"
          >
            <span class="episode-num">{{ ep }}</span>
            <svg v-if="isWatched(ep)" viewBox="0 0 24 24" class="watched-icon">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Hls from 'hls.js'
import { animeApi } from '@/api/animeApi'

export default {
  name: 'VideoPlayer',
  props: {
    animeId: {
      type: String,
      required: true,
    },
    animeTitle: {
      type: String,
      default: '',
    },
    animePoster: {
      type: String,
      default: '',
    },
    episodesCount: {
      type: Number,
      default: 1,
    },
    translations: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentEpisode: 1,
      currentTranslation: null,
      currentQuality: 720,
      playbackRate: 1,
      hls: null,
      loading: false,

      isPiP: false,
      supportsPiP: false,

      // Видео состояние
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
      isMuted: false,
      isFullscreen: false,

      buffered: 0,
      isSeeking: false,
      isBuffering: false,
      bufferingTimeout: null,

      // UI состояние
      showControls: true,
      showPlayButton: false,
      showSettingsMenu: false,
      controlsTimeout: null,
      mouseMoving: false,

      // История просмотров
      watchedEpisodesSet: new Set(),
      progressSaveTimeout: null,
      lastSavedProgress: 0,

      // Восстановление прогресса
      showRestoreDialog: false,
      restoreProgressSeconds: 0,
      restoreTimeString: '',
      hasRestoredProgress: false,
      userChoseTranslation: false,
      savedEpisode: null,
      savedTranslation: null,

      // Превью времени на прогресс-баре
      showTimePreview: false,
      previewTime: 0,
      previewPosition: 0,
    }
  },
  computed: {
    episodes() {
      // Проверяем что translations существует и не пустой
      if (!this.translations || this.translations.length === 0) {
        if (!this.episodesCount || this.episodesCount <= 1) return [1]
        return Array.from({ length: this.episodesCount }, (_, i) => i + 1)
      }

      if (this.currentTranslation) {
        const currentTrans = this.translations.find((t) => t.id === this.currentTranslation)
        if (currentTrans && currentTrans.name) {
          const match = currentTrans.name.match(/\((\d+)\s*эп\.\)/)
          if (match) {
            const episodesCount = parseInt(match[1])
            return Array.from({ length: episodesCount }, (_, i) => i + 1)
          }
        }
      }

      // Fallback
      if (!this.episodesCount || this.episodesCount <= 1) return [1]
      return Array.from({ length: this.episodesCount }, (_, i) => i + 1)
    },

    progressPercent() {
      return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0
    },

    currentTranslationName() {
      if (!this.translations || this.translations.length === 0) return ''
      if (!this.currentTranslation) return ''

      const translation = this.translations.find((t) => t.id === this.currentTranslation)
      return translation ? translation.name : ''
    },
  },
  watch: {
    volume(val) {
      if (this.$refs.video) {
        this.$refs.video.volume = val
        if (val > 0 && this.isMuted) {
          this.isMuted = false
        }
      }
    },
    currentTranslation(newVal, oldVal) {
      if (oldVal && newVal !== oldVal) {
        if (this.currentEpisode > this.episodes.length) {
          this.currentEpisode = 1
        }
      }
    },
    translations: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.length > 0 && !this.currentTranslation) {
          this.currentTranslation = newVal[0].id
          this.$nextTick(() => {
            this.loadVideo()
          })
        }
      },
    },
  },
  mounted() {
    // Загружаем историю просмотров
    this.loadWatchHistory()

    // Слушаем события полноэкранного режима
    document.addEventListener('fullscreenchange', this.onFullscreenChange)
    document.addEventListener('webkitfullscreenchange', this.onFullscreenChange)
    document.addEventListener('mozfullscreenchange', this.onFullscreenChange)

    // Горячие клавиши
    document.addEventListener('keydown', this.handleKeyPress)

    const container = this.$refs.playerContainer
    if (container) {
      container.addEventListener('mousemove', this.handleMouseMove)
      container.addEventListener('mouseleave', this.handleMouseLeave)
    }

    // Слушаем события Picture-in-Picture
    const video = this.$refs.video
    if (video) {
      video.addEventListener('enterpictureinpicture', this.onEnterPiP)
      video.addEventListener('leavepictureinpicture', this.onLeavePiP)
    }
  },
  beforeUnmount() {
    this.destroyPlayer()
    clearTimeout(this.controlsTimeout)
    clearTimeout(this.bufferingTimeout)
    document.removeEventListener('fullscreenchange', this.onFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', this.onFullscreenChange)
    document.removeEventListener('mozfullscreenchange', this.onFullscreenChange)
    document.removeEventListener('keydown', this.handleKeyPress)
  },
  methods: {
    // ═══════════════════════════════════════════
    // ЗАГРУЗКА ВИДЕО
    // ═══════════════════════════════════════════
    async loadVideo() {
      if (!this.animeId || !this.currentTranslation) return

      this.loading = true
      this.showRestoreDialog = false
      this.lastSavedProgress = 0

      try {
        const ep = this.episodesCount > 1 ? this.currentEpisode : 0
        const url = await animeApi.getVideoM3u8(
          this.animeId,
          ep,
          this.currentTranslation,
          this.currentQuality,
        )

        if (!url) {
          alert('Видео недоступно')
          return
        }

        this.initPlayer(url)

        const video = this.$refs.video
        if (video) {
          const restoreHandler = () => {
            console.log('📥 Метаданные загружены')

            if (!this.hasRestoredProgress && !this.userChoseTranslation) {
              console.log('🔄 Первая загрузка - показываем диалог восстановления')
              this.restoreProgress()
              this.hasRestoredProgress = true
            } else {
              console.log('▶️ Не первая загрузка - просто запускаем видео')
              video.play()
            }

            video.removeEventListener('loadedmetadata', restoreHandler)
          }
          video.addEventListener('loadedmetadata', restoreHandler)
        }
      } catch (err) {
        console.error('Load video error:', err)
        alert(`Ошибка: ${err.message}`)
      } finally {
        this.loading = false
      }
    },

    // ═══════════════════════════════════════════
    // PICTURE-IN-PICTURE
    // ═══════════════════════════════════════════
    async togglePiP() {
      const video = this.$refs.video
      if (!video) return

      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture()
        } else if (document.pictureInPictureEnabled) {
          await video.requestPictureInPicture()
        }
      } catch (error) {
        console.error('PiP error:', error)
      }
    },

    onEnterPiP() {
      this.isPiP = true
      console.log('Entered PiP mode')
    },

    onLeavePiP() {
      this.isPiP = false
      console.log('Left PiP mode')
    },

    // ═══════════════════════════════════════════
    // БУФЕРИЗАЦИЯ И ПЕРЕМОТКА
    // ═══════════════════════════════════════════
    updateBuffered() {
      const video = this.$refs.video
      if (!video || !video.buffered.length || !this.duration) return

      // Получаем конец последнего буфера
      const bufferedEnd = video.buffered.end(video.buffered.length - 1)
      this.buffered = (bufferedEnd / this.duration) * 100
    },

    onSeeking() {
      this.isSeeking = true
      this.isBuffering = false
      console.log('Seeking started')
    },

    onSeeked() {
      this.isSeeking = false
      this.isBuffering = false
      console.log('Seeking ended')
    },

    onWaiting() {
      // Показываем буферизацию только если это длится дольше 500мс
      if (!this.isSeeking) {
        if (this.bufferingTimeout) {
          clearTimeout(this.bufferingTimeout)
        }

        this.bufferingTimeout = setTimeout(() => {
          this.isBuffering = true
          console.log('Buffering...')
        }, 500)
      }
    },

    onCanPlay() {
      if (this.bufferingTimeout) {
        clearTimeout(this.bufferingTimeout)
      }
      this.isBuffering = false
      console.log('Can play')
    },

    onPlaying() {
      if (this.bufferingTimeout) {
        clearTimeout(this.bufferingTimeout)
      }
      this.isBuffering = false
      this.isSeeking = false
      console.log('Playing')
    },

    initPlayer(url) {
      this.destroyPlayer()

      const video = this.$refs.video
      video.style.display = 'block'

      if (Hls.isSupported()) {
        this.hls = new Hls({
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
        })

        this.hls.loadSource(url)
        this.hls.attachMedia(video)

        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS манифест загружен')
        })

        this.hls.on(Hls.Events.BUFFER_APPENDED, () => {
          this.updateBuffered()
        })

        this.hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.error('HLS fatal error:', data)
            this.destroyPlayer()
          }
        })
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url
        // video.play() <- УБРАЛИ
      }

      video.volume = this.volume
      video.playbackRate = this.playbackRate

      video.addEventListener('progress', this.updateBuffered)
      video.addEventListener('seeking', this.onSeeking)
      video.addEventListener('seeked', this.onSeeked)
      video.addEventListener('waiting', this.onWaiting)
      video.addEventListener('canplay', this.onCanPlay)
      video.addEventListener('playing', this.onPlaying)
    },

    destroyPlayer() {
      if (this.hls) {
        this.hls.destroy()
        this.hls = null
      }
    },

    // ═══════════════════════════════════════════
    // КОНТРОЛЫ ВОСПРОИЗВЕДЕНИЯ
    // ═══════════════════════════════════════════

    pauseControlsHiding() {
      if (this.controlsTimeout) {
        clearTimeout(this.controlsTimeout)
      }
    },

    resumeControlsHiding() {
      if (this.isPlaying) {
        this.handleMouseMove()
      }
    },
    togglePlay() {
      const video = this.$refs.video
      if (!video) return

      if (video.paused) {
        video.play()
        // Скрываем кнопку play при запуске
        this.showPlayButton = false
      } else {
        video.pause()
        // Показываем кнопку play при паузе
        this.showPlayButton = true
        this.showControls = true
      }
    },

    toggleMute() {
      const video = this.$refs.video
      if (!video) return

      this.isMuted = !this.isMuted
      video.muted = this.isMuted
    },

    seek(event) {
      const video = this.$refs.video
      if (!video || !this.duration) return

      const rect = event.currentTarget.getBoundingClientRect()
      const percent = (event.clientX - rect.left) / rect.width

      this.isSeeking = true

      video.currentTime = percent * this.duration

      // Обновляем буфер после перемотки
      setTimeout(() => {
        this.updateBuffered()
      }, 100)
    },

    changePlaybackRate() {
      const video = this.$refs.video
      if (video) {
        video.playbackRate = this.playbackRate
      }
    },

    // В секции ВЫБОР СЕРИЙ И ОЗВУЧЕК
    changeEpisode() {
      console.log('📺 Смена серии через селект:', this.currentEpisode)

      this.userChoseTranslation = true
      this.showRestoreDialog = false

      if (this.controlsTimeout) {
        clearTimeout(this.controlsTimeout)
      }
      this.loadVideo()
    },

    continueFromProgress() {
      console.log('✅ Пользователь выбрал продолжить')

      this.showRestoreDialog = false
      this.userChoseTranslation = false

      if (this.savedEpisode) {
        this.currentEpisode = this.savedEpisode
      }
      if (this.savedTranslation) {
        this.currentTranslation = this.savedTranslation
      }

      this.$nextTick(() => {
        this.loadVideo()

        const video = this.$refs.video
        if (video) {
          const setTimeHandler = () => {
            video.currentTime = this.restoreProgressSeconds
            video.play()
            console.log(
              '⏩ Восстановлено: серия',
              this.currentEpisode,
              'время',
              this.restoreProgressSeconds,
            )
            video.removeEventListener('loadedmetadata', setTimeHandler)
          }
          video.addEventListener('loadedmetadata', setTimeHandler)
        }
      })
    },

    changeTranslation() {
      console.log('🎵 Смена озвучки через селект:', this.currentTranslation)

      this.userChoseTranslation = true
      this.showSettingsMenu = false
      this.showRestoreDialog = false

      if (this.controlsTimeout) {
        clearTimeout(this.controlsTimeout)
      }

      this.$nextTick(() => {
        if (this.currentEpisode > this.episodes.length) {
          this.currentEpisode = 1
        }
        this.loadVideo()
      })
    },

    // ═══════════════════════════════════════════
    // ПОЛНОЭКРАННЫЙ РЕЖИМ
    // ═══════════════════════════════════════════
    toggleFullscreen() {
      const container = this.$refs.playerContainer

      if (!this.isFullscreen) {
        if (container.requestFullscreen) {
          container.requestFullscreen()
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen()
        } else if (container.mozRequestFullScreen) {
          container.mozRequestFullScreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        }
      }
    },

    onFullscreenChange() {
      this.isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement
      )
    },

    // ═══════════════════════════════════════════
    // СОБЫТИЯ ВИДЕО
    // ═══════════════════════════════════════════
    onTimeUpdate(event) {
      this.currentTime = event.target.currentTime
      this.updateBuffered()

      // Автоматически отмечаем как просмотренное при 90%
      if (this.duration > 0 && this.currentTime / this.duration > 0.9) {
        this.markAsWatched(this.currentEpisode)
      }

      const timeSinceLastSave = this.currentTime - this.lastSavedProgress

      if (timeSinceLastSave >= 10) {
        console.log(
          `⏱️ Прошло ${Math.floor(timeSinceLastSave)}с с последнего сохранения, текущее время: ${Math.floor(this.currentTime)}/${Math.floor(this.duration)}`,
        )
        this.saveProgressToAPI()
      }
    },

    onMetadataLoaded(event) {
      this.duration = event.target.duration
    },

    onVideoEnded() {
      this.markAsWatched(this.currentEpisode)
      this.saveProgressToAPI(true)

      // Автоматический переход к следующей серии
      if (this.currentEpisode < this.episodes.length) {
        setTimeout(() => {
          this.selectEpisode(this.currentEpisode + 1)
        }, 2000)
      }
    },

    // ═══════════════════════════════════════════
    // ВЫБОР СЕРИЙ И ОЗВУЧЕК
    // ═══════════════════════════════════════════
    selectEpisode(ep) {
      console.log('📺 Пользователь выбрал серию:', ep)

      this.currentEpisode = ep
      this.userChoseTranslation = true
      this.showRestoreDialog = false
      this.loadVideo()
    },

    selectTranslation(id) {
      console.log('🎵 Пользователь выбрал озвучку:', id)

      this.currentTranslation = id
      this.userChoseTranslation = true
      this.showSettingsMenu = false
      this.showRestoreDialog = false

      this.$nextTick(() => {
        if (this.currentEpisode > this.episodes.length) {
          this.currentEpisode = 1
        }
        this.loadVideo()
      })
    },
    changeQuality() {
      this.showSettingsMenu = false
      this.loadVideo()
    },

    // ═══════════════════════════════════════════
    // ИСТОРИЯ ПРОСМОТРОВ
    // ═══════════════════════════════════════════
    async loadWatchHistory() {
      try {
        const history = await animeApi.getWatchHistory(2000)

        console.log('📊 История для галочек:', history)

        const watchedInHistory = history
          .filter((h) => {
            const matchAnime = String(h.anime_id) === String(this.animeId)
            const isWatched = h.progress_seconds / h.duration_seconds > 0.8 // 80% просмотрено
            return matchAnime && isWatched
          })
          .map((h) => h.episode_num)

        this.watchedEpisodesSet = new Set(watchedInHistory)

        console.log('✅ Просмотренные серии:', [...this.watchedEpisodesSet])
      } catch (err) {
        console.error('❌ Ошибка загрузки истории:', err)
        this.loadWatchHistoryLocal()
      }
    },

    loadWatchHistoryLocal() {
      const key = `watched_${this.animeId}`
      const stored = localStorage.getItem(key)
      if (stored) {
        this.watchedEpisodesSet = new Set(JSON.parse(stored))
      }
    },

    saveWatchHistoryLocal() {
      const key = `watched_${this.animeId}`
      localStorage.setItem(key, JSON.stringify([...this.watchedEpisodesSet]))
    },

    async markAsWatched(ep) {
      this.watchedEpisodesSet.add(ep)
      this.saveWatchHistoryLocal() // Локальный backup

      // Сохраняем в БД через API
      try {
        await animeApi.updateWatched({
          anime_id: this.animeId,
          episodes_watched: ep,
          total_episodes: this.episodes.length,
          is_completed: ep >= this.episodes.length,
          title: this.animeTitle,
          poster: this.animePoster,
        })
      } catch (err) {
        console.error('Ошибка сохранения просмотренного:', err)
      }
    },

    isWatched(ep) {
      return this.watchedEpisodesSet.has(ep)
    },

    // ═══════════════════════════════════════════
    // СОХРАНЕНИЕ ПРОГРЕССА В РЕАЛЬНОМ ВРЕМЕНИ
    // ═══════════════════════════════════════════
    async saveProgressToAPI(isCompleted = false) {
      const currentProgress = this.currentTime
      this.lastSavedProgress = currentProgress

      if (this.progressSaveTimeout) {
        clearTimeout(this.progressSaveTimeout)
      }

      this.progressSaveTimeout = setTimeout(async () => {
        try {
          const translationId = String(this.currentTranslation)

          const data = {
            anime_id: this.animeId,
            episode_num: this.currentEpisode,
            progress_seconds: Math.floor(currentProgress),
            duration_seconds: Math.floor(this.duration),
            title: this.animeTitle,
            poster: this.animePoster,
            translation_id: translationId,
          }

          console.log('💾 Отправка на сервер:', data)

          await animeApi.addToHistory(data)

          console.log('✅ Прогресс сохранён на сервере')
        } catch (err) {
          console.error('❌ Ошибка сохранения прогресса:', err)
          this.lastSavedProgress = 0
        }
      }, 1000)
    },

    // ═══════════════════════════════════════════
    // ПРОГРЕСС БАР С ПРЕВЬЮ
    // ═══════════════════════════════════════════
    handleProgressMouseMove(event) {
      const rect = event.currentTarget.getBoundingClientRect()
      const percent = (event.clientX - rect.left) / rect.width

      this.previewTime = percent * this.duration
      this.previewPosition = percent * 100
      this.showTimePreview = true
    },

    handleProgressMouseLeave() {
      this.showTimePreview = false
    },

    seek(event) {
      const video = this.$refs.video
      if (!video || !this.duration) return

      const rect = event.currentTarget.getBoundingClientRect()
      const percent = (event.clientX - rect.left) / rect.width

      this.isSeeking = true

      video.currentTime = percent * this.duration

      // Скрываем превью после клика
      this.showTimePreview = false

      // Обновляем буфер после перемотки
      setTimeout(() => {
        this.updateBuffered()
      }, 100)
    },

    // ═══════════════════════════════════════════
    // ВОССТАНОВЛЕНИЕ ПРОГРЕССА
    // ═══════════════════════════════════════════
    async restoreProgress() {
      try {
        const history = await animeApi.getWatchHistory(50)

        console.log('📜 История просмотров:', history)

        // Берём самую последнюю запись для этого аниме
        const lastWatchForThisAnime = history
          .filter((h) => String(h.anime_id) === String(this.animeId))
          .sort((a, b) => new Date(b.watched_at) - new Date(a.watched_at))[0]

        console.log('🎬 Последний просмотр:', lastWatchForThisAnime)

        if (lastWatchForThisAnime && lastWatchForThisAnime.progress_seconds > 30) {
          const savedEpisode = lastWatchForThisAnime.episode_num
          const savedTranslation = String(lastWatchForThisAnime.translation_id)
          const savedProgress = lastWatchForThisAnime.progress_seconds

          // Форматируем время
          const minutes = Math.floor(savedProgress / 60)
          const seconds = savedProgress % 60
          const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`

          // Находим название озвучки
          const translation = this.translations.find((t) => String(t.id) === savedTranslation)
          const translationName = translation ? translation.name : 'Неизвестная озвучка'

          // Сохраняем данные для восстановления
          this.restoreProgressSeconds = savedProgress
          this.restoreTimeString = `${timeStr} (Серия ${savedEpisode}, ${translationName})`

          // Сохраняем серию и озвучку для кнопки "Продолжить"
          this.savedEpisode = savedEpisode
          this.savedTranslation = savedTranslation

          this.showRestoreDialog = true

          console.log('✅ Диалог восстановления показан:', this.restoreTimeString)
        } else {
          console.log('ℹ️ Прогресс не найден, запуск с начала')
          this.$nextTick(() => {
            if (this.$refs.video) {
              this.$refs.video.play()
            }
          })
        }
      } catch (err) {
        console.error('❌ Ошибка восстановления:', err)
        this.$nextTick(() => {
          if (this.$refs.video) {
            this.$refs.video.play()
          }
        })
      }
    },

    startFromBeginning() {
      console.log('🔄 Пользователь выбрал начать сначала')

      this.showRestoreDialog = false
      this.userChoseTranslation = true

      // Начинаем с серии 1
      this.currentEpisode = 1

      this.$nextTick(() => {
        this.loadVideo()

        const video = this.$refs.video
        if (video) {
          const playHandler = () => {
            video.currentTime = 0
            video.play()
            console.log('▶️ Начало с серии 1')
            video.removeEventListener('loadedmetadata', playHandler)
          }
          video.addEventListener('loadedmetadata', playHandler)
        }
      })
    },
    showRestorePrompt(progressSeconds, timeStr) {
      // Останавливаем автовоспроизведение
      const video = this.$refs.video
      if (video && !video.paused) {
        video.pause()
      }

      const shouldRestore = confirm(`Вы остановились на ${timeStr}\n\nПродолжить просмотр?`)

      if (shouldRestore && this.$refs.video) {
        this.$refs.video.currentTime = progressSeconds
        this.$refs.video.play()
        console.log('✅ Прогресс восстановлен:', progressSeconds)
      } else {
        // Если отказался, начинаем с начала
        this.$refs.video.play()
        console.log('❌ Пользователь отказался от восстановления')
      }
    },

    // ═══════════════════════════════════════════
    // UI HELPERS
    // ═══════════════════════════════════════════
    toggleSettings() {
      this.showSettingsMenu = !this.showSettingsMenu

      if (this.showSettingsMenu && this.controlsTimeout) {
        clearTimeout(this.controlsTimeout)
      }
    },

    formatTime(seconds) {
      if (!seconds || isNaN(seconds)) return '0:00'
      const h = Math.floor(seconds / 3600)
      const m = Math.floor((seconds % 3600) / 60)
      const s = Math.floor(seconds % 60)
      return h > 0
        ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        : `${m}:${s.toString().padStart(2, '0')}`
    },

    extractEpisodeCount(name) {
      const match = name.match(/\((\d+)\s*эп\.\)/)
      return match ? match[1] + ' эп.' : ''
    },

    // ═══════════════════════════════════════════
    // ГОРЯЧИЕ КЛАВИШИ
    // ═══════════════════════════════════════════
    handleKeyPress(e) {
      if (!this.$refs.video) return

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault()
          this.togglePlay()
          break
        case 'f':
          e.preventDefault()
          this.toggleFullscreen()
          break
        case 'm':
          e.preventDefault()
          this.toggleMute()
          break
        case 'arrowright':
          e.preventDefault()
          this.$refs.video.currentTime += 10
          break
        case 'arrowleft':
          e.preventDefault()
          this.$refs.video.currentTime -= 10
          break
        case 'arrowup':
          e.preventDefault()
          this.volume = Math.min(1, this.volume + 0.1)
          break
        case 'arrowdown':
          e.preventDefault()
          this.volume = Math.max(0, this.volume - 0.1)
          break
        case 'p':
          e.preventDefault()
          this.togglePiP()
          break
      }
    },
    handleMouseMove() {
      this.showControls = true
      this.showPlayButton = false
      this.mouseMoving = true

      // Очищаем предыдущий таймер
      if (this.controlsTimeout) {
        clearTimeout(this.controlsTimeout)
      }

      this.controlsTimeout = setTimeout(() => {
        // Проверяем все условия для скрытия
        if (this.isPlaying && !this.showSettingsMenu) {
          this.showControls = false
          this.showPlayButton = false
          // Прячем курсор
          if (this.$refs.playerContainer) {
            this.$refs.playerContainer.style.cursor = 'none'
          }
        }
      }, 3000) // 3 секунды

      // Показываем курсор
      if (this.$refs.playerContainer) {
        this.$refs.playerContainer.style.cursor = 'pointer'
      }
    },

    handleMouseLeave() {
      // Сразу скрываем контролы при выходе мыши
      if (this.isPlaying) {
        this.showControls = false
        this.showPlayButton = false
      }
    },
  },
}
</script>

<style scoped>
.video-player {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 20px;
  margin-bottom: 30px;
}

/* ═══════════════════════════════════════════ */
/* ВИДЕО КОНТЕЙНЕР */
/* ═══════════════════════════════════════════ */
.player-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.player-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.video-element {
  width: 100%;
  height: 100%;
  display: none;
}

.player-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.player-loading p {
  font-size: 16px;
  font-weight: 600;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
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

/* ═══════════════════════════════════════════ */
/* ДИАЛОГ ВОССТАНОВЛЕНИЯ ПРОГРЕССА */
/* ═══════════════════════════════════════════ */
.restore-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, -40%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.restore-content {
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 65, 108, 0.5);
  border-radius: 20px;
  padding: 32px;
  min-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.restore-icon {
  font-size: 64px;
  line-height: 1;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.restore-info {
  text-align: center;
}

.restore-info h3 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 12px;
  color: white;
}

.restore-info p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.restore-info strong {
  color: #ff416c;
  font-weight: 700;
  font-size: 18px;
}

.restore-actions {
  display: flex;
  gap: 12px;
  width: 100%;
}

.restore-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  white-space: nowrap;
}

.restore-btn.primary {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  box-shadow: 0 8px 24px rgba(255, 65, 108, 0.4);
}

.restore-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(255, 65, 108, 0.5);
}

.restore-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.restore-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.restore-btn .btn-icon {
  width: 20px;
  height: 20px;
}

/* Адаптив для диалога */
@media (max-width: 768px) {
  .restore-content {
    min-width: 320px;
    padding: 24px;
  }

  .restore-icon {
    font-size: 48px;
  }

  .restore-info h3 {
    font-size: 20px;
  }

  .restore-info p {
    font-size: 14px;
  }

  .restore-actions {
    flex-direction: column;
  }

  .restore-btn {
    width: 100%;
  }
}

/* ═══════════════════════════════════════════ */
/* ВЕРХНИЕ КОНТРОЛЫ */
/* ═══════════════════════════════════════════ */
.controls-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
  z-index: 10;
}

.top-controls-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.top-control-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  transition: all 0.3s;
}

.top-control-item:hover {
  background: rgba(0, 0, 0, 0.85);
  border-color: rgba(255, 65, 108, 0.5);
}

.control-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.top-select {
  background: transparent;
  color: white;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  padding: 4px 8px;
  min-width: 120px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 4px center;
  padding-right: 24px;
}

.top-select option {
  background: #1a1a1a;
  color: white;
  padding: 8px;
}

/* ═══════════════════════════════════════════ */
/* PICTURE-IN-PICTURE */
/* ═══════════════════════════════════════════ */
.pip-btn {
  position: relative;
}

.pip-btn.active {
  background: rgba(255, 65, 108, 0.2);
}

.pip-btn.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: #ff416c;
  border-radius: 50%;
  animation: pipPulse 1.5s ease-in-out infinite;
}

@keyframes pipPulse {
  0%,
  100% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 0.5;
    transform: translateX(-50%) scale(1.5);
  }
}

/* ═══════════════════════════════════════════ */
/* ИНДИКАТОР ПЕРЕМОТКИ */
/* ═══════════════════════════════════════════ */
.seek-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 30px;
  background: rgba(0, 0, 0, 0.85);
  border-radius: 16px;
  border: 2px solid rgba(255, 65, 108, 0.5);
  z-index: 15;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.seek-icon {
  width: 32px;
  height: 32px;
}

.seek-indicator span {
  color: white;
  font-size: 18px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

/* ═══════════════════════════════════════════ */
/* ЦЕНТРАЛЬНАЯ КНОПКА PLAY */
/* ═══════════════════════════════════════════ */
.center-play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: rgba(255, 65, 108, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 5;
}

.center-play-button:hover {
  transform: translate(-50%, -50%) scale(1.1);
  background: rgba(255, 65, 108, 1);
}

.center-play-button svg {
  width: 40px;
  height: 40px;
  fill: white;
}

/* ═══════════════════════════════════════════ */
/* ПРЕВЬЮ ВРЕМЕНИ НА ПРОГРЕСС-БАРЕ */
/* ═══════════════════════════════════════════ */
.time-preview {
  position: absolute;
  bottom: 100%;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 10;
  margin-bottom: 12px;
}

.time-preview-bubble {
  background: rgba(0, 0, 0, 0.95);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 65, 108, 0.5);
  backdrop-filter: blur(10px);
}

.time-preview-line {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 20px;
  background: linear-gradient(to bottom, rgba(255, 65, 108, 0.8), transparent);
}

/* ═══════════════════════════════════════════ */
/* КАСТОМНЫЕ КОНТРОЛЫ */
/* ═══════════════════════════════════════════ */
.video-controls {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 10;
  pointer-events: none;
}
.video-controls > * {
  pointer-events: auto;
}

.controls-spacer {
  flex: 1;
  pointer-events: none;
}

.controls-bottom-wrapper {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 100%);
  padding: 60px 20px 20px;
}

.progress-container {
  margin-bottom: 16px;
  padding: 8px 0;
  cursor: pointer;
}

.progress-bar {
  position: relative;
  height: 5px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: visible;
}

.progress-buffered {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  transition: width 0.3s;
  z-index: 1;
}

.progress-filled {
  position: relative;
  height: 100%;
  background: linear-gradient(90deg, #ff416c, #ff4b2b);
  border-radius: 3px;
  transition: width 0.1s;
  z-index: 2;
}

.progress-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 15px;
  height: 15px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 3;
}

.progress-container:hover .progress-bar {
  height: 7px;
  transition: height 0.2s;
}

.controls-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.controls-left,
.controls-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.control-btn svg {
  width: 24px;
  height: 24px;
  fill: white;
}

.time-display {
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  user-select: none;
}

.time-separator {
  color: rgba(255, 255, 255, 0.5);
}

/* ═══════════════════════════════════════════ */
/* ГРОМКОСТЬ */
/* ═══════════════════════════════════════════ */
.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-slider {
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

/* ═══════════════════════════════════════════ */
/* НАСТРОЙКИ */
/* ═══════════════════════════════════════════ */
.settings-menu {
  position: relative;
}

.settings-dropdown {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 12px;
  background: rgba(20, 20, 20, 0.98);
  border-radius: 12px;
  padding: 12px;
  min-width: 200px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  gap: 16px;
  color: white;
  font-size: 14px;
}

.settings-item span {
  font-weight: 500;
}

.settings-select {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 13px;
  cursor: pointer;
  outline: none;
}

.settings-select:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* ═══════════════════════════════════════════ */
/* ИНФОРМАЦИЯ О СЕРИИ */
/* ═══════════════════════════════════════════ */
.episode-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.episode-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.episode-number {
  font-size: 16px;
  font-weight: 700;
  color: white;
}

.translation-name {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.episode-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

/* ═══════════════════════════════════════════ */
/* БОКОВАЯ ПАНЕЛЬ */
/* ═══════════════════════════════════════════ */
.player-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  max-height: 500px;
  overflow-y: auto;
}

.sidebar-section::-webkit-scrollbar {
  width: 6px;
}

.sidebar-section::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 3px;
}

.sidebar-section::-webkit-scrollbar-thumb {
  background: rgba(255, 65, 108, 0.5);
  border-radius: 3px;
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 16px;
  color: white;
}

.sidebar-icon {
  width: 20px;
  height: 20px;
  fill: #ff416c;
}

/* ═══════════════════════════════════════════ */
/* СПИСОК ОЗВУЧЕК */
/* ═══════════════════════════════════════════ */
.translation-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.translation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.translation-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 65, 108, 0.5);
}

.translation-item.active {
  background: rgba(255, 65, 108, 0.15);
  border-color: rgba(255, 65, 108, 0.8);
}

.translation-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.translation-studio {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.translation-episodes {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.check-icon {
  width: 20px;
  height: 20px;
  fill: #ff416c;
}

/* ═══════════════════════════════════════════ */
/* СПИСОК СЕРИЙ */
/* ═══════════════════════════════════════════ */
.episodes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: 8px;
}

.episode-item {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  color: white;
}

.episode-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 65, 108, 0.5);
  transform: scale(1.05);
}

.episode-item.active {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border-color: #ff416c;
}

.episode-item.watched:not(.active) {
  background: rgba(76, 175, 80, 0.2);
  border-color: rgba(76, 175, 80, 0.5);
}

.episode-num {
  font-size: 14px;
}

.watched-icon {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 14px;
  height: 14px;
  fill: #4caf50;
}

/* ═══════════════════════════════════════════ */
/* АНИМАЦИИ */
/* ═══════════════════════════════════════════ */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */
@media (max-width: 1024px) {
  .video-player {
    grid-template-columns: 1fr;
  }

  .player-sidebar {
    flex-direction: row;
  }

  .sidebar-section {
    flex: 1;
    max-height: 400px;
  }
}

@media (max-width: 768px) {
  .player-sidebar {
    flex-direction: column;
  }

  .volume-control {
    display: none;
  }

  .controls-bottom {
    gap: 8px;
  }

  .control-btn {
    padding: 6px;
  }

  .control-btn svg {
    width: 20px;
    height: 20px;
  }

  .episodes-grid {
    grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
    gap: 6px;
  }

  .controls-top {
    padding: 12px;
  }

  .top-controls-group {
    gap: 8px;
  }

  .top-control-item {
    padding: 6px 10px;
  }

  .control-icon {
    width: 16px;
    height: 16px;
  }

  .top-select {
    font-size: 12px;
    min-width: 100px;
  }
}
</style>
