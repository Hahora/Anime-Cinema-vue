<template>
  <transition name="menu-slide">
    <div v-if="isOpen" class="mobile-menu-overlay" @click="$emit('close')">
      <div class="mobile-menu" @click.stop>
        <!-- Заголовок -->
        <div class="menu-header">
          <div class="menu-logo">
            <div class="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  fill="url(#gradient1)"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="url(#gradient2)"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
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
            <div class="logo-text">
              <span class="logo-title">Anime Cinema</span>
            </div>
          </div>
          <button class="close-btn" @click="$emit('close')">
            <svg viewBox="0 0 24 24">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <!-- ✅ ТОЛЬКО СТРАНИЦЫ -->
        <nav class="menu-nav">
          <router-link to="/" class="menu-item" @click="$emit('close')">
            <svg viewBox="0 0 24 24" class="menu-icon">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor" />
            </svg>
            <span>Главная</span>
          </router-link>

          <router-link to="/search" class="menu-item" @click="$emit('close')">
            <svg viewBox="0 0 24 24" class="menu-icon">
              <path
                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                fill="currentColor"
              />
            </svg>
            <span>Поиск</span>
          </router-link>

          <router-link to="/genres" class="menu-item" @click="$emit('close')">
            <svg viewBox="0 0 24 24" class="menu-icon">
              <path
                d="M12 2l-5.5 9h11z M17.5 11L12 20l5.5-9z M6.5 11L12 2 6.5 11z M12 20l-5.5-9H6.5L12 20z"
                fill="currentColor"
              />
            </svg>
            <span>Жанры</span>
          </router-link>

          <router-link to="/users" class="menu-item" @click="$emit('close')">
            <svg viewBox="0 0 24 24" class="menu-icon">
              <path
                d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                fill="currentColor"
              />
            </svg>
            <span>Пользователи</span>
          </router-link>
        </nav>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'MobileMenu',
  props: {
    isOpen: Boolean,
  },
  emits: ['close'],
}
</script>

<style scoped>
.mobile-menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
}

.mobile-menu {
  width: 85%;
  max-width: 320px;
  height: 100vh;
  background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-shadow: 4px 0 40px rgba(0, 0, 0, 0.5);
}

/* ═══════════════════════════════════════════ */
/* ЗАГОЛОВОК */
/* ═══════════════════════════════════════════ */
.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px 24px;
}

.menu-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 65, 108, 0.1);
  border-radius: 10px;
  padding: 6px;
  border: 1px solid rgba(255, 65, 108, 0.3);
}

.logo-icon svg {
  width: 100%;
  height: 100%;
}

.logo-title {
  font-size: 18px;
  font-weight: 900;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.close-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(90deg);
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

/* ═══════════════════════════════════════════ */
/* НАВИГАЦИЯ */
/* ═══════════════════════════════════════════ */
.menu-nav {
  display: flex;
  flex-direction: column;
  padding: 0 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 16px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s;
  position: relative;
}

.menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 0;
  background: linear-gradient(180deg, #ff416c, #ff4b2b);
  border-radius: 0 4px 4px 0;
  transition: height 0.3s;
}

.menu-item:hover,
.menu-item.router-link-active {
  background: rgba(255, 65, 108, 0.1);
  color: white;
  padding-left: 24px;
}

.menu-item:hover::before,
.menu-item.router-link-active::before {
  height: 40px;
}

.menu-icon {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
}

/* ═══════════════════════════════════════════ */
/* АНИМАЦИИ */
/* ═══════════════════════════════════════════ */
.menu-slide-enter-active {
  transition: all 0.3s ease-out;
}

.menu-slide-leave-active {
  transition: all 0.25s ease-in;
}

.menu-slide-enter-from {
  opacity: 0;
}

.menu-slide-leave-to {
  opacity: 0;
}

.menu-slide-enter-from .mobile-menu {
  transform: translateX(-100%);
}

.menu-slide-leave-to .mobile-menu {
  transform: translateX(-100%);
}
</style>
