<template>
  <div class="page-loader">
    <div class="loader-content">
      <!-- Анимированный логотип -->
      <div class="loader-logo">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-svg">
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            fill="url(#gradient1)"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="logo-path-1"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="url(#gradient2)"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="logo-path-2"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="logo-path-3"
          />
          <defs>
            <linearGradient
              id="gradient1"
              x1="2"
              y1="2"
              x2="22"
              y2="12"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#ff416c" />
              <stop offset="1" stop-color="#ff4b2b" />
            </linearGradient>
            <linearGradient
              id="gradient2"
              x1="2"
              y1="17"
              x2="22"
              y2="22"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#ff416c" />
              <stop offset="1" stop-color="#ff4b2b" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <!-- Текст -->
      <div class="loader-text">
        <h1 class="loader-title">
          <span class="title-word" style="animation-delay: 0s">Anime</span>
          <span class="title-word" style="animation-delay: 0.2s">Cinema</span>
        </h1>
        <p class="loader-subtitle">{{ loadingText }}</p>
      </div>

      <!-- Прогресс бар -->
      <div class="loader-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <span class="progress-text">{{ progress }}%</span>
      </div>

      <!-- Анимированные точки -->
      <div class="loader-dots">
        <span class="dot" style="animation-delay: 0s"></span>
        <span class="dot" style="animation-delay: 0.2s"></span>
        <span class="dot" style="animation-delay: 0.4s"></span>
      </div>
    </div>

    <!-- Фоновые эффекты -->
    <div class="loader-bg">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageLoader',
  props: {
    progress: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      loadingTexts: [
        'Загрузка аниме...',
        'Подготовка контента...',
        'Получение данных...',
        'Почти готово...',
      ],
      currentTextIndex: 0,
      loadingText: 'Загрузка аниме...',
    }
  },
  mounted() {
    this.startTextRotation()
  },
  beforeUnmount() {
    if (this.textInterval) {
      clearInterval(this.textInterval)
    }
  },
  methods: {
    startTextRotation() {
      this.textInterval = setInterval(() => {
        this.currentTextIndex = (this.currentTextIndex + 1) % this.loadingTexts.length
        this.loadingText = this.loadingTexts[this.currentTextIndex]
      }, 2000)
    },
  },
}
</script>

<style scoped>
.page-loader {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at center, #1a0a1f, #000);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
}

.loader-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

/* ═══════════════════════════════════════════ */
/* ЛОГОТИП */
/* ═══════════════════════════════════════════ */
.loader-logo {
  width: 120px;
  height: 120px;
  background: rgba(255, 65, 108, 0.05);
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 65, 108, 0.2);
  animation: logoFloat 3s ease-in-out infinite;
  box-shadow: 0 20px 60px rgba(255, 65, 108, 0.3);
}

.logo-svg {
  width: 70px;
  height: 70px;
}

.logo-path-1 {
  animation: pathDraw 2s ease-in-out infinite;
}

.logo-path-2 {
  animation: pathDraw 2s ease-in-out infinite 0.3s;
}

.logo-path-3 {
  animation: pathDraw 2s ease-in-out infinite 0.6s;
}

@keyframes logoFloat {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes pathDraw {
  0%,
  100% {
    opacity: 0.3;
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
  }
  50% {
    opacity: 1;
    stroke-dasharray: 100;
    stroke-dashoffset: 0;
  }
}

/* ═══════════════════════════════════════════ */
/* ТЕКСТ */
/* ═══════════════════════════════════════════ */
.loader-text {
  text-align: center;
}

.loader-title {
  font-size: 48px;
  font-weight: 900;
  margin: 0 0 12px;
  display: flex;
  gap: 16px;
}

.title-word {
  display: inline-block;
  animation: wordSlide 1s ease-out both;
}

.title-word:first-child {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-word:last-child {
  color: white;
}

@keyframes wordSlide {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loader-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  animation: textFade 0.5s ease-out;
  min-height: 24px;
}

@keyframes textFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ═══════════════════════════════════════════ */
/* ПРОГРЕСС БАР */
/* ═══════════════════════════════════════════ */
.loader-progress {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff416c, #ff4b2b);
  border-radius: 3px;
  transition: width 0.3s ease-out;
  position: relative;
  box-shadow: 0 0 20px rgba(255, 65, 108, 0.6);
}

.progress-fill::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-text {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

/* ═══════════════════════════════════════════ */
/* ТОЧКИ */
/* ═══════════════════════════════════════════ */
.loader-dots {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.dot {
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border-radius: 50%;
  animation: dotBounce 1.4s infinite ease-in-out both;
}

@keyframes dotBounce {
  0%,
  80%,
  100% {
    transform: scale(0.5);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* ═══════════════════════════════════════════ */
/* ФОНОВЫЕ ЭФФЕКТЫ */
/* ═══════════════════════════════════════════ */
.loader-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 65, 108, 0.15), transparent);
  animation: circleFloat 20s infinite ease-in-out;
}

.circle-1 {
  width: 400px;
  height: 400px;
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.circle-2 {
  width: 600px;
  height: 600px;
  bottom: -300px;
  right: -300px;
  animation-delay: 7s;
}

.circle-3 {
  width: 500px;
  height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 14s;
}

@keyframes circleFloat {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  33% {
    transform: translate(50px, -50px) scale(1.1);
    opacity: 0.5;
  }
  66% {
    transform: translate(-50px, 50px) scale(0.9);
    opacity: 0.4;
  }
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */
@media (max-width: 768px) {
  .loader-logo {
    width: 100px;
    height: 100px;
  }

  .logo-svg {
    width: 60px;
    height: 60px;
  }

  .loader-title {
    font-size: 36px;
    flex-direction: column;
    gap: 8px;
  }

  .loader-progress {
    width: 250px;
  }
}
</style>
