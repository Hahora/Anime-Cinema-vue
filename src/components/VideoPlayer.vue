<template>
  <div class="video-player" :class="{ 'is-fullscreen': isFullscreen }">
    <!-- Основной контейнер плеера -->
    <div class="player-main">
      <div
        ref="playerContainer"
        class="player-container"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
        @click="handleContainerClick"
      >
        <video
          ref="video"
          class="video-element"
          playsinline
          webkit-playsinline
          x-webkit-airplay="allow"
          preload="auto"
          @timeupdate="onTimeUpdate"
          @loadedmetadata="onMetadataLoaded"
          @ended="onVideoEnded"
          @play="onPlay"
          @pause="onPause"
          @waiting="onWaiting"
          @canplay="onCanPlay"
          @progress="updateBuffered"
        ></video>

        <!-- Загрузка/Буферизация -->
        <transition name="fade">
          <div v-if="isLoading" class="loading-overlay">
            <div class="loader">
              <div class="loader-ring"></div>
              <div class="loader-ring"></div>
              <div class="loader-ring"></div>
            </div>
            <span class="loading-text">{{ loadingText }}</span>
          </div>
        </transition>

        <!-- Центральная кнопка Play -->
        <transition name="scale">
          <button
            v-if="showCenterPlay && !isLoading && !showRestoreDialog"
            class="center-play-btn"
            @click.stop="togglePlay"
          >
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          </button>
        </transition>

        <!-- Диалог восстановления -->
        <transition name="fade">
          <div v-if="showRestoreDialog" class="restore-overlay" @click.stop>
            <div class="restore-card">
              <div class="restore-header">
                <svg class="restore-icon" viewBox="0 0 24 24">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                    fill="currentColor"
                  />
                </svg>
                <h3>Продолжить просмотр?</h3>
              </div>
              <p class="restore-time">{{ restoreTimeString }}</p>
              <div class="restore-buttons">
                <button class="btn-continue" @click="continueFromProgress">
                  <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
                  Продолжить
                </button>
                <button class="btn-restart" @click="startFromBeginning">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
                      fill="currentColor"
                    />
                  </svg>
                  Сначала
                </button>
              </div>
            </div>
          </div>
        </transition>

        <!-- Seek индикатор -->
        <transition name="scale">
          <div v-if="seekIndicator.show" class="seek-indicator">
            <span>{{ seekIndicator.text }}</span>
          </div>
        </transition>

        <!-- Контролы -->
        <transition name="slide-up">
          <div v-show="showControls" class="controls" @click.stop>
            <!-- Прогресс бар -->
            <div
              class="progress-wrapper"
              @mousedown="startSeek"
              @touchstart="startSeek"
              ref="progressBar"
            >
              <div class="progress-track">
                <div class="progress-buffered" :style="{ width: bufferedPercent + '%' }"></div>
                <div class="progress-played" :style="{ width: progressPercent + '%' }"></div>
              </div>
              <div class="progress-thumb" :style="{ left: progressPercent + '%' }"></div>
              <!-- Превью времени -->
              <div
                v-if="seekPreview.show"
                class="seek-preview"
                :style="{ left: seekPreview.percent + '%' }"
              >
                {{ formatTime(seekPreview.time) }}
              </div>
            </div>

            <!-- Нижние контролы -->
            <div class="controls-row">
              <!-- Левая часть -->
              <div class="controls-left">
                <button
                  class="ctrl-btn ctrl-btn-play"
                  :class="{ 'is-playing': isPlaying }"
                  @click="togglePlay"
                  :title="isPlaying ? 'Пауза' : 'Воспроизвести'"
                >
                  <svg v-if="!isPlaying" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="currentColor" />
                  </svg>
                </button>

                <!-- Навигация по сериям -->
                <button
                  class="ctrl-btn nav-btn"
                  @click="goToPreviousEpisode"
                  :disabled="currentEpisode <= 1"
                  title="Предыдущая серия"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" fill="currentColor" />
                  </svg>
                </button>

                <button
                  class="ctrl-btn nav-btn"
                  @click="goToNextEpisode"
                  :disabled="currentEpisode >= episodes.length"
                  title="Следующая серия"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" fill="currentColor" />
                  </svg>
                </button>

                <div class="time-display">
                  {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                </div>
              </div>

              <!-- Правая часть -->
              <div class="controls-right">
                <!-- Громкость -->
                <div class="volume-group">
                  <button class="ctrl-btn" @click="toggleMute">
                    <svg v-if="isMuted || volume === 0" viewBox="0 0 24 24">
                      <path
                        d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
                        fill="currentColor"
                      />
                    </svg>
                    <svg v-else viewBox="0 0 24 24">
                      <path
                        d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                  <div class="volume-slider-wrapper">
                    <input
                      type="range"
                      class="volume-slider"
                      min="0"
                      max="1"
                      step="0.05"
                      v-model.number="volume"
                    />
                    <div class="volume-slider-fill" :style="{ width: volume * 100 + '%' }"></div>
                  </div>
                </div>

                <!-- Настройки -->
                <div class="settings-group" ref="settingsRef">
                  <button class="ctrl-btn" @click="toggleSettings">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.07.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                  <transition name="slide-up">
                    <div v-if="showSettings" class="settings-panel">
                      <div class="setting-item">
                        <span>Качество</span>
                        <select v-model="currentQuality" @change="changeQuality">
                          <option :value="720">720p</option>
                          <option :value="480">480p</option>
                          <option :value="360">360p</option>
                        </select>
                      </div>
                      <div class="setting-item">
                        <span>Скорость</span>
                        <select v-model="playbackRate" @change="changeSpeed">
                          <option :value="0.5">0.5x</option>
                          <option :value="0.75">0.75x</option>
                          <option :value="1">1x</option>
                          <option :value="1.25">1.25x</option>
                          <option :value="1.5">1.5x</option>
                          <option :value="2">2x</option>
                        </select>
                      </div>
                    </div>
                  </transition>
                </div>

                <!-- PiP -->
                <button class="ctrl-btn" @click="togglePiP" title="Картинка в картинке">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"
                      fill="currentColor"
                    />
                  </svg>
                </button>

                <!-- Полноэкранный режим -->
                <button class="ctrl-btn" @click="toggleFullscreen">
                  <svg v-if="!isFullscreen" viewBox="0 0 24 24">
                    <path
                      d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg v-else viewBox="0 0 24 24">
                    <path
                      d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Информация под плеером -->
      <div class="episode-bar">
        <div class="episode-current">
          <span class="ep-label">Серия {{ currentEpisode }}</span>
          <span class="ep-divider">•</span>
          <span class="ep-translation">{{ currentTranslationName }}</span>
        </div>
        <div class="episode-meta">
          <span>{{ currentQuality }}p</span>
          <span class="ep-divider">•</span>
          <span>{{ playbackRate }}x</span>
        </div>
      </div>
    </div>

    <!-- Боковая панель -->
    <aside class="sidebar">
      <!-- Озвучки -->
      <section class="sidebar-section">
        <h3 class="section-title">
          <svg viewBox="0 0 24 24">
            <path
              d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"
              fill="currentColor"
            />
          </svg>
          Озвучка
        </h3>
        <div class="translation-list">
          <button
            v-for="t in translations"
            :key="t.id"
            :class="['translation-item', { active: currentTranslation === t.id }]"
            @click="selectTranslation(t.id)"
          >
            <span class="t-name">{{ extractStudioName(t.name) }}</span>
            <span class="t-count">{{ extractEpisodeCount(t.name) }}</span>
          </button>
        </div>
      </section>

      <!-- Серии -->
      <section class="sidebar-section">
        <h3 class="section-title">
          <svg viewBox="0 0 24 24">
            <path
              d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"
              fill="currentColor"
            />
          </svg>
          Серии <span class="count">({{ episodes.length }})</span>
        </h3>
        <div class="episodes-grid">
          <button
            v-for="ep in episodes"
            :key="ep"
            :class="['episode-btn', { active: currentEpisode === ep, watched: isWatched(ep) }]"
            @click="selectEpisode(ep)"
          >
            {{ ep }}
            <svg v-if="isWatched(ep)" class="watched-check" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </section>
    </aside>
  </div>
</template>

<script>
import Hls from 'hls.js'
import { animeApi } from '@/api/animeApi'

export default {
  name: 'VideoPlayer',
  props: {
    animeId: { type: String, required: true },
    animeTitle: { type: String, default: '' },
    animePoster: { type: String, default: '' },
    episodesCount: { type: Number, default: 1 },
    translations: { type: Array, default: () => [] },
  },

  data() {
    return {
      // Плеер
      hls: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      bufferedPercent: 0,
      volume: 1,
      isMuted: false,
      playbackRate: 1,
      currentQuality: 720,

      // UI
      showControls: true,
      showCenterPlay: true,
      showSettings: false,
      isFullscreen: false,
      controlsTimer: null,

      // Загрузка
      isLoading: false,
      loadingText: 'Загрузка...',

      // Seek
      isSeeking: false,
      seekPreview: { show: false, time: 0, percent: 0 },
      seekIndicator: { show: false, text: '' },

      // Серии и озвучки
      currentEpisode: 1,
      currentTranslation: null,
      watchedSet: new Set(),

      // Восстановление
      showRestoreDialog: false,
      restoreTimeString: '',
      restoreData: null,
      hasRestored: false,

      // Сохранение прогресса
      lastSavedTime: 0,
      saveTimer: null,
    }
  },

  computed: {
    episodes() {
      if (!this.translations?.length) {
        return this.episodesCount > 1
          ? Array.from({ length: this.episodesCount }, (_, i) => i + 1)
          : [1]
      }

      if (this.currentTranslation) {
        const trans = this.translations.find((t) => t.id === this.currentTranslation)
        if (trans?.name) {
          const match = trans.name.match(/\((\d+)\s*эп\.\)/)
          if (match) {
            return Array.from({ length: parseInt(match[1]) }, (_, i) => i + 1)
          }
        }
      }

      return this.episodesCount > 1
        ? Array.from({ length: this.episodesCount }, (_, i) => i + 1)
        : [1]
    },

    progressPercent() {
      return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0
    },

    currentTranslationName() {
      const trans = this.translations?.find((t) => t.id === this.currentTranslation)
      return trans ? this.extractStudioName(trans.name) : ''
    },
  },

  watch: {
    volume(val) {
      if (this.$refs.video) {
        this.$refs.video.volume = val
        if (val > 0) this.isMuted = false
      }
    },

    translations: {
      immediate: true,
      handler(val) {
        if (val?.length && !this.currentTranslation) {
          this.currentTranslation = val[0].id
          this.$nextTick(() => this.loadVideo())
        }
      },
    },
  },

  mounted() {
    this.loadWatchHistory()
    this.setupEventListeners()
  },

  beforeUnmount() {
    this.cleanup()
  },

  methods: {
    // =====================
    // ИНИЦИАЛИЗАЦИЯ
    // =====================
    setupEventListeners() {
      document.addEventListener('keydown', this.handleKeydown)
      document.addEventListener('fullscreenchange', this.onFullscreenChange)
      document.addEventListener('webkitfullscreenchange', this.onFullscreenChange)
      document.addEventListener('mozfullscreenchange', this.onFullscreenChange)
      document.addEventListener('MSFullscreenChange', this.onFullscreenChange)
      document.addEventListener('click', this.handleOutsideClick)

      // iOS Safari fullscreen events для video элемента
      const video = this.$refs.video
      if (video) {
        video.addEventListener('webkitbeginfullscreen', this.onFullscreenChange)
        video.addEventListener('webkitendfullscreen', this.onFullscreenChange)
      }
    },

    cleanup() {
      this.destroyHls()
      clearTimeout(this.controlsTimer)
      clearTimeout(this.saveTimer)
      document.removeEventListener('keydown', this.handleKeydown)
      document.removeEventListener('fullscreenchange', this.onFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', this.onFullscreenChange)
      document.removeEventListener('mozfullscreenchange', this.onFullscreenChange)
      document.removeEventListener('MSFullscreenChange', this.onFullscreenChange)
      document.removeEventListener('click', this.handleOutsideClick)
      document.removeEventListener('mousemove', this.onSeekMove)
      document.removeEventListener('mouseup', this.endSeek)
      document.removeEventListener('touchmove', this.onSeekMove)
      document.removeEventListener('touchend', this.endSeek)

      const video = this.$refs.video
      if (video) {
        video.removeEventListener('webkitbeginfullscreen', this.onFullscreenChange)
        video.removeEventListener('webkitendfullscreen', this.onFullscreenChange)
      }
    },

    // =====================
    // ЗАГРУЗКА ВИДЕО
    // =====================
    async loadVideo(autoPlay = false) {
      if (!this.animeId || !this.currentTranslation) return

      this.isLoading = true
      this.loadingText = 'Загрузка видео...'

      try {
        const ep = this.episodesCount > 1 ? this.currentEpisode : 0
        const url = await animeApi.getVideoM3u8(
          this.animeId,
          ep,
          this.currentTranslation,
          this.currentQuality,
        )

        if (!url) {
          this.isLoading = false
          return
        }

        await this.initHls(url)

        // Восстановление прогресса только при первой загрузке
        if (!this.hasRestored) {
          await this.checkRestoreProgress()
          this.hasRestored = true
        } else if (autoPlay) {
          this.play()
        }
      } catch (err) {
        console.error('Load error:', err)
      } finally {
        this.isLoading = false
      }
    },

    async initHls(url) {
      this.destroyHls()

      const video = this.$refs.video
      if (!video) return

      return new Promise((resolve) => {
        if (Hls.isSupported()) {
          this.hls = new Hls({
            maxBufferLength: 30,
            maxMaxBufferLength: 60,
            maxBufferSize: 60 * 1000 * 1000,
            maxBufferHole: 0.5,
            lowLatencyMode: false,
            backBufferLength: 30,
          })

          this.hls.loadSource(url)
          this.hls.attachMedia(video)

          this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.volume = this.volume
            video.playbackRate = this.playbackRate
            resolve()
          })

          this.hls.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) {
              console.error('HLS Error:', data)
              if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                this.hls.startLoad()
              }
            }
          })
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url
          video.addEventListener(
            'loadedmetadata',
            () => {
              video.volume = this.volume
              video.playbackRate = this.playbackRate
              resolve()
            },
            { once: true },
          )
        }
      })
    },

    destroyHls() {
      if (this.hls) {
        this.hls.destroy()
        this.hls = null
      }
    },

    // =====================
    // ВОСПРОИЗВЕДЕНИЕ
    // =====================
    togglePlay() {
      if (this.showRestoreDialog) return

      const video = this.$refs.video
      if (!video) return

      if (video.paused) {
        this.play()
      } else {
        this.pause()
      }
    },

    play() {
      const video = this.$refs.video
      if (!video) return

      video.play().catch((err) => {
        console.log('Play prevented:', err)
        this.showCenterPlay = true
      })
    },

    pause() {
      this.$refs.video?.pause()
    },

    onPlay() {
      this.isPlaying = true
      this.showCenterPlay = false
      this.startControlsTimer()
    },

    onPause() {
      this.isPlaying = false
      this.showCenterPlay = true
      this.showControls = true
      clearTimeout(this.controlsTimer)
    },

    onWaiting() {
      if (!this.isSeeking) {
        this.isLoading = true
        this.loadingText = 'Буферизация...'
      }
    },

    onCanPlay() {
      this.isLoading = false
    },

    // =====================
    // ПРОГРЕСС И SEEK
    // =====================
    onTimeUpdate() {
      const video = this.$refs.video
      if (!video || this.isSeeking) return

      this.currentTime = video.currentTime

      // Автосохранение каждые 15 секунд
      if (this.currentTime - this.lastSavedTime >= 15) {
        this.saveProgress()
      }

      // Отметка как просмотренное при 90%
      if (this.duration > 0 && this.currentTime / this.duration > 0.9) {
        this.markWatched(this.currentEpisode)
      }
    },

    onMetadataLoaded() {
      this.duration = this.$refs.video?.duration || 0
    },

    updateBuffered() {
      const video = this.$refs.video
      if (!video?.buffered.length || !this.duration) return

      const bufferedEnd = video.buffered.end(video.buffered.length - 1)
      this.bufferedPercent = (bufferedEnd / this.duration) * 100
    },

    startSeek(e) {
      this.isSeeking = true
      document.addEventListener('mousemove', this.onSeekMove)
      document.addEventListener('mouseup', this.endSeek)
      document.addEventListener('touchmove', this.onSeekMove)
      document.addEventListener('touchend', this.endSeek)
      this.onSeekMove(e)
    },

    onSeekMove(e) {
      if (!this.isSeeking) return

      const bar = this.$refs.progressBar
      if (!bar) return

      const rect = bar.getBoundingClientRect()
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      let percent = (clientX - rect.left) / rect.width
      percent = Math.max(0, Math.min(1, percent))

      this.seekPreview = {
        show: true,
        time: percent * this.duration,
        percent: percent * 100,
      }

      // Обновляем позицию в реальном времени для плавности
      this.currentTime = percent * this.duration
    },

    endSeek(e) {
      if (!this.isSeeking) return

      document.removeEventListener('mousemove', this.onSeekMove)
      document.removeEventListener('mouseup', this.endSeek)
      document.removeEventListener('touchmove', this.onSeekMove)
      document.removeEventListener('touchend', this.endSeek)

      const video = this.$refs.video
      if (video && this.seekPreview.time !== undefined) {
        video.currentTime = this.seekPreview.time
      }

      this.isSeeking = false
      this.seekPreview.show = false
    },

    seekBy(seconds) {
      const video = this.$refs.video
      if (!video) return

      const newTime = Math.max(0, Math.min(this.duration, video.currentTime + seconds))
      video.currentTime = newTime

      this.seekIndicator = {
        show: true,
        text: seconds > 0 ? `+${seconds}с` : `${seconds}с`,
      }

      setTimeout(() => {
        this.seekIndicator.show = false
      }, 800)
    },

    // =====================
    // ВОССТАНОВЛЕНИЕ ПРОГРЕССА
    // =====================
    async checkRestoreProgress() {
      try {
        const history = await animeApi.getWatchHistory(50)

        const lastWatch = history
          .filter((h) => String(h.anime_id) === String(this.animeId))
          .sort((a, b) => new Date(b.watched_at) - new Date(a.watched_at))[0]

        if (lastWatch && lastWatch.progress_seconds > 30) {
          const progress = lastWatch.progress_seconds
          const mins = Math.floor(progress / 60)
          const secs = progress % 60

          const trans = this.translations.find(
            (t) => String(t.id) === String(lastWatch.translation_id),
          )
          const transName = trans ? this.extractStudioName(trans.name) : ''

          this.restoreData = {
            time: progress,
            episode: lastWatch.episode_num,
            translation: String(lastWatch.translation_id),
          }

          this.restoreTimeString = `${mins}:${secs.toString().padStart(2, '0')} • Серия ${lastWatch.episode_num}${transName ? ` • ${transName}` : ''}`
          this.showRestoreDialog = true
        } else {
          this.play()
        }
      } catch (err) {
        console.error('Restore error:', err)
        this.play()
      }
    },

    async continueFromProgress() {
      this.showRestoreDialog = false

      if (this.restoreData) {
        const needReload =
          this.currentEpisode !== this.restoreData.episode ||
          this.currentTranslation !== this.restoreData.translation

        if (needReload) {
          this.currentEpisode = this.restoreData.episode
          this.currentTranslation = this.restoreData.translation
          await this.loadVideo()
        }

        this.$nextTick(() => {
          const video = this.$refs.video
          if (video) {
            video.currentTime = this.restoreData.time
            this.play()
          }
        })
      }
    },

    startFromBeginning() {
      this.showRestoreDialog = false
      this.currentEpisode = 1
      this.$nextTick(() => {
        this.play()
      })
    },

    // =====================
    // СОХРАНЕНИЕ ПРОГРЕССА
    // =====================
    saveProgress() {
      this.lastSavedTime = this.currentTime

      clearTimeout(this.saveTimer)
      this.saveTimer = setTimeout(async () => {
        try {
          await animeApi.addToHistory({
            anime_id: this.animeId,
            episode_num: this.currentEpisode,
            progress_seconds: Math.floor(this.currentTime),
            duration_seconds: Math.floor(this.duration),
            title: this.animeTitle,
            poster: this.animePoster,
            translation_id: String(this.currentTranslation),
          })
        } catch (err) {
          console.error('Save progress error:', err)
        }
      }, 500)
    },

    // =====================
    // ГРОМКОСТЬ
    // =====================
    toggleMute() {
      this.isMuted = !this.isMuted
      if (this.$refs.video) {
        this.$refs.video.muted = this.isMuted
      }
    },

    // =====================
    // СКОРОСТЬ И КАЧЕСТВО
    // =====================
    changeSpeed() {
      if (this.$refs.video) {
        this.$refs.video.playbackRate = this.playbackRate
      }
    },

    changeQuality() {
      const wasPlaying = this.isPlaying
      const currentPos = this.currentTime

      this.loadVideo().then(() => {
        if (this.$refs.video) {
          this.$refs.video.currentTime = currentPos
          if (wasPlaying) this.play()
        }
      })

      this.showSettings = false
    },

    toggleSettings() {
      this.showSettings = !this.showSettings
    },

    // =====================
    // СЕРИИ И ОЗВУЧКИ
    // =====================
    selectEpisode(ep) {
      this.currentEpisode = ep
      this.loadVideo(true)
    },

    selectTranslation(id) {
      this.currentTranslation = id

      this.$nextTick(() => {
        if (this.currentEpisode > this.episodes.length) {
          this.currentEpisode = 1
        }
        this.loadVideo(true)
      })
    },

    goToPreviousEpisode() {
      if (this.currentEpisode > 1) {
        this.selectEpisode(this.currentEpisode - 1)
      }
    },

    goToNextEpisode() {
      if (this.currentEpisode < this.episodes.length) {
        this.selectEpisode(this.currentEpisode + 1)
      }
    },

    onVideoEnded() {
      this.markWatched(this.currentEpisode)
      this.saveProgress()

      if (this.currentEpisode < this.episodes.length) {
        setTimeout(() => this.goToNextEpisode(), 1500)
      }
    },

    // =====================
    // ИСТОРИЯ ПРОСМОТРОВ
    // =====================
    async loadWatchHistory() {
      try {
        const history = await animeApi.getWatchHistory(2000)

        const watched = history
          .filter(
            (h) =>
              String(h.anime_id) === String(this.animeId) &&
              h.progress_seconds / h.duration_seconds > 0.8,
          )
          .map((h) => h.episode_num)

        this.watchedSet = new Set(watched)
      } catch (err) {
        console.error('Load history error:', err)
      }
    },

    async markWatched(ep) {
      if (this.watchedSet.has(ep)) return

      this.watchedSet.add(ep)

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
        console.error('Mark watched error:', err)
      }
    },

    isWatched(ep) {
      return this.watchedSet.has(ep)
    },

    // =====================
    // FULLSCREEN & PIP
    // =====================
    async toggleFullscreen() {
      const container = this.$refs.playerContainer
      const video = this.$refs.video

      try {
        if (!this.isFullscreen) {
          // Пробуем все возможные методы для входа в fullscreen
          if (container.requestFullscreen) {
            await container.requestFullscreen()
          } else if (container.webkitRequestFullscreen) {
            await container.webkitRequestFullscreen()
          } else if (container.mozRequestFullScreen) {
            await container.mozRequestFullScreen()
          } else if (container.msRequestFullscreen) {
            await container.msRequestFullscreen()
          } else if (video && video.webkitEnterFullscreen) {
            // iOS Safari - fullscreen только для video элемента
            video.webkitEnterFullscreen()
          } else if (video && video.webkitRequestFullScreen) {
            video.webkitRequestFullScreen()
          }
        } else {
          // Выход из fullscreen
          if (document.exitFullscreen) {
            await document.exitFullscreen()
          } else if (document.webkitExitFullscreen) {
            await document.webkitExitFullscreen()
          } else if (document.mozCancelFullScreen) {
            await document.mozCancelFullScreen()
          } else if (document.msExitFullscreen) {
            await document.msExitFullscreen()
          } else if (video && video.webkitExitFullscreen) {
            video.webkitExitFullscreen()
          }
        }
      } catch (err) {
        console.error('Fullscreen error:', err)
        // Fallback для мобильных браузеров - пробуем video элемент
        if (video) {
          try {
            if (video.webkitEnterFullscreen) {
              video.webkitEnterFullscreen()
            } else if (video.webkitRequestFullScreen) {
              video.webkitRequestFullScreen()
            }
          } catch (e) {
            console.error('Video fullscreen fallback error:', e)
          }
        }
      }
    },

    onFullscreenChange() {
      const video = this.$refs.video

      // Проверяем все возможные состояния fullscreen
      this.isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement ||
        (video && video.webkitDisplayingFullscreen)
      )
    },

    async togglePiP() {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture()
        } else if (document.pictureInPictureEnabled && this.$refs.video) {
          await this.$refs.video.requestPictureInPicture()
        }
      } catch (err) {
        console.error('PiP error:', err)
      }
    },

    // =====================
    // UI CONTROLS
    // =====================
    handleContainerClick(e) {
      if (this.showRestoreDialog) return
      if (e.target.closest('.controls')) return

      this.togglePlay()
    },

    handleMouseMove() {
      this.showControls = true
      this.startControlsTimer()
    },

    handleMouseLeave() {
      if (this.isPlaying && !this.showSettings) {
        this.showControls = false
      }
    },

    startControlsTimer() {
      clearTimeout(this.controlsTimer)

      if (this.isPlaying) {
        this.controlsTimer = setTimeout(() => {
          if (!this.showSettings && !this.isSeeking) {
            this.showControls = false
          }
        }, 3000)
      }
    },

    handleOutsideClick(e) {
      if (this.showSettings && !e.target.closest('.settings-group')) {
        this.showSettings = false
      }
    },

    // =====================
    // КЛАВИАТУРА
    // =====================
    handleKeydown(e) {
      if (this.showRestoreDialog) return
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return

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
          if (e.shiftKey) {
            this.goToNextEpisode()
          } else {
            this.seekBy(10)
          }
          break
        case 'arrowleft':
          e.preventDefault()
          if (e.shiftKey) {
            this.goToPreviousEpisode()
          } else {
            this.seekBy(-10)
          }
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

    // =====================
    // УТИЛИТЫ
    // =====================
    formatTime(seconds) {
      if (!seconds || isNaN(seconds)) return '0:00'

      const h = Math.floor(seconds / 3600)
      const m = Math.floor((seconds % 3600) / 60)
      const s = Math.floor(seconds % 60)

      if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      }
      return `${m}:${s.toString().padStart(2, '0')}`
    },

    extractStudioName(name) {
      return name?.replace(/\s*\(\d+\s*эп\.\)/, '') || ''
    },

    extractEpisodeCount(name) {
      const match = name?.match(/\((\d+)\s*эп\.\)/)
      return match ? `${match[1]} эп.` : ''
    },
  },
}
</script>

<style scoped>
/* =====================
   ЦВЕТОВАЯ СХЕМА - NEON RED
   ===================== */
:root {
  --player-bg: #0a0a0a;
  --player-surface: rgba(20, 20, 20, 0.95);
  --player-border: rgba(255, 255, 255, 0.1);
  --player-accent: #ff416c;
  --player-accent-light: #ff4b2b;
  --player-text: #ffffff;
  --player-text-muted: rgba(255, 255, 255, 0.6);
  --player-success: #4caf50;
  --player-gradient: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
  --player-glow: rgba(255, 65, 108, 0.4);
}

/* =====================
   ОСНОВНОЙ КОНТЕЙНЕР
   ===================== */
.video-player {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  font-family:
    'SF Pro Display',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  color: var(--player-text);
}

.video-player.is-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: #000;
  grid-template-columns: 1fr;
  gap: 0;
}

.video-player.is-fullscreen .sidebar,
.video-player.is-fullscreen .episode-bar {
  display: none;
}

/* =====================
   ПЛЕЕР
   ===================== */
.player-main {
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
  border: 1px solid rgba(255, 65, 108, 0.3);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 50px var(--player-glow),
    0 0 100px rgba(255, 65, 108, 0.15);
}

.is-fullscreen .player-container {
  border-radius: 0;
  height: 100vh;
  aspect-ratio: unset;
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

.video-element::-webkit-media-controls {
  display: none !important;
}

/* =====================
   ЗАГРУЗКА
   ===================== */
.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 20;
}

.loader {
  position: relative;
  width: 60px;
  height: 60px;
}

.loader-ring {
  position: absolute;
  inset: 0;
  border: 3px solid transparent;
  border-top-color: #ff416c;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
  box-shadow: 0 0 20px var(--player-glow);
}

.loader-ring:nth-child(2) {
  inset: 6px;
  animation-delay: 0.1s;
  animation-duration: 1.1s;
  border-top-color: #ff4b2b;
}

.loader-ring:nth-child(3) {
  inset: 12px;
  animation-delay: 0.2s;
  animation-duration: 1.3s;
  border-top-color: #ff6b6b;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 150, 150, 0.9);
  text-shadow: 0 0 10px var(--player-glow);
}

/* =====================
   ЦЕНТРАЛЬНАЯ КНОПКА PLAY
   ===================== */
.center-play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  z-index: 15;
  box-shadow:
    0 0 0 8px rgba(255, 65, 108, 0.2),
    0 8px 32px var(--player-glow),
    0 0 60px var(--player-glow),
    0 0 100px rgba(255, 65, 108, 0.3);
}

.center-play-btn:hover {
  transform: translate(-50%, -50%) scale(1.1);
  box-shadow:
    0 0 0 12px rgba(255, 65, 108, 0.25),
    0 12px 40px var(--player-glow),
    0 0 80px var(--player-glow),
    0 0 120px rgba(255, 65, 108, 0.4);
}

.center-play-btn svg {
  width: 36px;
  height: 36px;
  color: white;
  margin-left: 4px;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
}

/* =====================
   ДИАЛОГ ВОССТАНОВЛЕНИЯ
   ===================== */
.restore-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.97);
  backdrop-filter: blur(20px);
  z-index: 50;
  padding: 12px;
}

.restore-card {
  background: linear-gradient(145deg, rgba(30, 15, 15, 0.98), rgba(20, 10, 10, 0.98));
  border: 2px solid var(--player-accent);
  border-radius: 16px;
  padding: 24px 20px;
  max-width: 380px;
  width: 100%;
  text-align: center;
  box-shadow:
    0 0 0 1px rgba(255, 65, 108, 0.3),
    0 25px 80px rgba(0, 0, 0, 0.9),
    0 0 60px var(--player-glow),
    0 0 120px rgba(255, 65, 108, 0.2),
    inset 0 0 40px rgba(255, 65, 108, 0.05);
}

.restore-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.restore-icon {
  width: 36px;
  height: 36px;
  color: var(--player-accent);
  filter: drop-shadow(0 0 12px var(--player-glow));
}

.restore-header h3 {
  font-size: 17px;
  font-weight: 600;
  margin: 0;
  color: white;
  text-shadow: 0 0 15px rgba(255, 65, 108, 0.4);
}

.restore-time {
  font-size: 13px;
  color: var(--player-accent);
  margin: 0 0 16px;
  word-break: break-word;
  line-height: 1.4;
  text-shadow: 0 0 10px var(--player-glow);
}

.restore-buttons {
  display: flex;
  gap: 10px;
}

.restore-buttons button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 11px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-continue {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  box-shadow:
    0 0 0 3px rgba(255, 65, 108, 0.2),
    0 8px 25px var(--player-glow),
    0 0 30px var(--player-glow);
}

.btn-continue:hover {
  transform: translateY(-2px);
  box-shadow:
    0 0 0 4px rgba(255, 65, 108, 0.3),
    0 12px 35px var(--player-glow),
    0 0 50px var(--player-glow);
}

.btn-continue:active {
  transform: translateY(0);
}

.btn-restart {
  background: rgba(255, 65, 108, 0.1);
  color: white;
  border: 2px solid rgba(255, 65, 108, 0.4) !important;
}

.btn-restart:hover {
  background: rgba(255, 65, 108, 0.2);
  border-color: var(--player-accent) !important;
  box-shadow: 0 0 20px rgba(255, 65, 108, 0.2);
}

.restore-buttons svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

/* =====================
   SEEK ИНДИКАТОР
   ===================== */
.seek-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 14px 28px;
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid var(--player-accent);
  border-radius: 14px;
  font-size: 20px;
  font-weight: 700;
  z-index: 25;
  pointer-events: none;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.6),
    0 0 30px var(--player-glow);
  color: var(--player-accent);
}

/* =====================
   КОНТРОЛЫ
   ===================== */
.controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 60px 16px 16px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(20, 0, 0, 0.7) 50%,
    transparent 100%
  );
  z-index: 30;
}

/* Прогресс бар */
.progress-wrapper {
  position: relative;
  height: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 12px;
}

.progress-track {
  position: relative;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  transition: height 0.15s;
}

.progress-wrapper:hover .progress-track {
  height: 6px;
}

.progress-buffered {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 3px;
}

.progress-played {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #ff416c, #ff4b2b);
  border-radius: 3px;
  box-shadow: 0 0 12px var(--player-glow);
}

.progress-thumb {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  background: var(--player-accent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition:
    transform 0.15s,
    box-shadow 0.15s;
  box-shadow:
    0 0 0 4px rgba(255, 65, 108, 0.3),
    0 0 15px var(--player-glow);
  z-index: 5;
}

.progress-wrapper:hover .progress-thumb {
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow:
    0 0 0 6px rgba(255, 65, 108, 0.3),
    0 0 20px var(--player-glow);
}

.seek-preview {
  position: absolute;
  bottom: 100%;
  transform: translateX(-50%);
  padding: 6px 14px;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(255, 65, 108, 0.5);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  margin-bottom: 10px;
  pointer-events: none;
  color: var(--player-accent);
  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.5),
    0 0 15px var(--player-glow);
}

/* Ряд контролов */
.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.controls-left,
.controls-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ctrl-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.ctrl-btn:hover {
  background: rgba(255, 65, 108, 0.15);
  color: var(--player-accent);
}

.ctrl-btn.playing {
  color: var(--player-accent);
}

.ctrl-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ctrl-btn:disabled:hover {
  background: transparent;
  color: white;
}

.ctrl-btn svg {
  width: 22px;
  height: 22px;
}

/* Кнопка Play/Pause - красная когда играет */
.ctrl-btn-play {
  color: white;
  transition: all 0.2s;
}

.ctrl-btn-play.is-playing {
  color: var(--player-accent);
  background: rgba(255, 65, 108, 0.15);
  box-shadow: 0 0 15px rgba(255, 65, 108, 0.3);
}

.ctrl-btn-play.is-playing svg {
  filter: drop-shadow(0 0 6px var(--player-glow));
}

.ctrl-btn-play.is-playing:hover {
  background: rgba(255, 65, 108, 0.25);
  box-shadow: 0 0 20px rgba(255, 65, 108, 0.4);
}

.nav-btn svg {
  width: 20px;
  height: 20px;
}

.time-display {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  margin-left: 8px;
  font-variant-numeric: tabular-nums;
}

/* Громкость */
.volume-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-slider-wrapper {
  position: relative;
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  cursor: pointer;
}

.volume-slider {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  height: 16px;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  z-index: 2;
  margin: 0;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: #ff416c;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(255, 65, 108, 0.6);
}

.volume-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: #ff416c;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 10px rgba(255, 65, 108, 0.6);
}

.volume-slider-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #ff416c, #ff4b2b);
  border-radius: 2px;
  pointer-events: none;
  z-index: 1;
}

/* Настройки */
.settings-group {
  position: relative;
}

.settings-panel {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 12px;
  background: rgba(20, 10, 10, 0.98);
  border: 1px solid rgba(255, 65, 108, 0.4);
  border-radius: 12px;
  padding: 12px;
  min-width: 180px;
  backdrop-filter: blur(20px);
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.7),
    0 0 30px var(--player-glow);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  gap: 16px;
}

.setting-item span {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 200, 200, 0.9);
}

.setting-item select {
  background: rgba(30, 30, 30, 0.95);
  color: white;
  border: 1px solid rgba(255, 65, 108, 0.3);
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 13px;
  cursor: pointer;
  outline: none;
  min-width: 80px;
}

.setting-item select:hover {
  border-color: var(--player-accent);
}

.setting-item select:focus {
  border-color: var(--player-accent);
  box-shadow: 0 0 10px var(--player-glow);
}

.setting-item select option {
  background: #1a1a1a;
  color: white;
  padding: 8px;
}

/* =====================
   ИНФОРМАЦИОННАЯ ПАНЕЛЬ
   ===================== */
.episode-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: rgba(20, 20, 20, 0.95);
  border: 1px solid rgba(255, 65, 108, 0.2);
  border-radius: 12px;
  box-shadow: inset 0 0 20px rgba(255, 65, 108, 0.03);
}

.episode-current {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ep-label {
  font-size: 15px;
  font-weight: 600;
}

.ep-divider {
  color: var(--player-text-muted);
}

.ep-translation {
  font-size: 14px;
  color: var(--player-text-muted);
}

.episode-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--player-text-muted);
}

/* =====================
   БОКОВАЯ ПАНЕЛЬ
   ===================== */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-section {
  background: rgba(20, 20, 20, 0.95);
  border: 1px solid rgba(255, 65, 108, 0.2);
  border-radius: 16px;
  padding: 20px;
  max-height: 450px;
  overflow-y: auto;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 0 30px rgba(255, 65, 108, 0.03);
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

.sidebar-section::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 65, 108, 0.7);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 16px;
}

.section-title svg {
  width: 20px;
  height: 20px;
  color: var(--player-accent);
  filter: drop-shadow(0 0 8px var(--player-glow));
}

.section-title .count {
  font-weight: 400;
  color: var(--player-text-muted);
}

/* Список озвучек */
.translation-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.translation-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
  color: white;
}

.translation-item:hover {
  background: rgba(255, 65, 108, 0.08);
  border-color: rgba(255, 65, 108, 0.4);
  transform: translateX(4px);
}

.translation-item.active {
  background: rgba(255, 65, 108, 0.15);
  border-color: var(--player-accent);
  box-shadow:
    0 0 25px rgba(255, 65, 108, 0.3),
    inset 0 0 20px rgba(255, 65, 108, 0.08);
}

.translation-item.active .t-name {
  color: var(--player-accent);
  text-shadow: 0 0 10px var(--player-glow);
}

.t-name {
  font-size: 14px;
  font-weight: 500;
}

.t-count {
  font-size: 12px;
  color: var(--player-text-muted);
}

/* Сетка серий */
.episodes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
  gap: 8px;
}

.episode-btn {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.episode-btn:hover {
  background: rgba(255, 65, 108, 0.1);
  border-color: rgba(255, 65, 108, 0.5);
  transform: scale(1.08);
  box-shadow: 0 0 15px rgba(255, 65, 108, 0.2);
}

.episode-btn.active {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border-color: var(--player-accent);
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  box-shadow:
    0 4px 20px var(--player-glow),
    0 0 30px var(--player-glow),
    inset 0 0 15px rgba(255, 255, 255, 0.1);
}

.episode-btn.watched:not(.active) {
  background: rgba(76, 175, 80, 0.12);
  border-color: rgba(76, 175, 80, 0.4);
}

.episode-btn.watched:not(.active):hover {
  background: rgba(76, 175, 80, 0.2);
  border-color: rgba(76, 175, 80, 0.6);
}

.watched-check {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 12px;
  height: 12px;
  color: var(--player-success);
  filter: drop-shadow(0 0 4px rgba(76, 175, 80, 0.6));
}

/* =====================
   АНИМАЦИИ
   ===================== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* =====================
   АДАПТИВ
   ===================== */
@media (max-width: 1200px) {
  .video-player {
    grid-template-columns: 1fr 280px;
  }
}

@media (max-width: 1024px) {
  .video-player {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
  }

  .sidebar-section {
    flex: 1;
    max-height: 350px;
  }
}

@media (max-width: 768px) {
  .video-player {
    gap: 16px;
  }

  .sidebar {
    flex-direction: column;
  }

  .player-container {
    border-radius: 12px;
  }

  .controls {
    padding: 40px 12px 12px;
  }

  .ctrl-btn {
    width: 36px;
    height: 36px;
  }

  .ctrl-btn svg {
    width: 20px;
    height: 20px;
  }

  .time-display {
    font-size: 12px;
  }

  .volume-group {
    display: flex;
  }

  .volume-slider-wrapper {
    width: 60px;
  }

  .center-play-btn {
    width: 60px;
    height: 60px;
  }

  .center-play-btn svg {
    width: 28px;
    height: 28px;
  }

  .restore-overlay {
    padding: 8px;
  }

  .restore-card {
    padding: 18px 14px;
    border-radius: 14px;
    max-width: 320px;
  }

  .restore-header {
    gap: 6px;
    margin-bottom: 10px;
  }

  .restore-icon {
    width: 32px;
    height: 32px;
  }

  .restore-header h3 {
    font-size: 15px;
  }

  .restore-time {
    font-size: 12px;
    margin-bottom: 14px;
  }

  .restore-buttons {
    flex-direction: column;
    gap: 8px;
  }

  .restore-buttons button {
    padding: 10px 12px;
    font-size: 13px;
  }

  .episode-bar {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .episodes-grid {
    grid-template-columns: repeat(auto-fill, minmax(42px, 1fr));
    gap: 6px;
  }

  .episode-btn {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .nav-btn {
    display: none;
  }

  .controls-row {
    gap: 4px;
  }

  .time-display {
    font-size: 11px;
    margin-left: 4px;
  }
}

/* Touch устройства */
@media (pointer: coarse) {
  .ctrl-btn {
    min-width: 44px;
    min-height: 44px;
  }

  .progress-wrapper {
    height: 32px;
  }

  .progress-track {
    height: 6px;
  }

  .progress-thumb {
    width: 18px;
    height: 18px;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* Fullscreen стили для всех браузеров */
.player-container:fullscreen,
.player-container:-webkit-full-screen,
.player-container:-moz-full-screen,
.player-container:-ms-fullscreen {
  width: 100vw !important;
  height: 100vh !important;
  max-width: 100vw !important;
  max-height: 100vh !important;
  border-radius: 0 !important;
  border: none !important;
}

.player-container:fullscreen .video-element,
.player-container:-webkit-full-screen .video-element,
.player-container:-moz-full-screen .video-element,
.player-container:-ms-fullscreen .video-element {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
}

/* iOS Safari video fullscreen */
video::-webkit-media-controls {
  display: none !important;
}

video::--webkit-media-controls-panel {
  display: none !important;
}

video::-webkit-media-controls-start-playback-button {
  display: none !important;
}
</style>
