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
            <IconX :size="20" />
          </button>
        </div>

        <!-- ✅ ТОЛЬКО СТРАНИЦЫ -->
        <nav class="menu-nav">
          <router-link to="/" class="menu-item" @click="$emit('close')">
            <IconHome :size="26" class="menu-icon" />
            <span>Главная</span>
          </router-link>

          <router-link to="/search" class="menu-item" @click="$emit('close')">
            <IconSearch :size="26" class="menu-icon" />
            <span>Поиск</span>
          </router-link>

          <router-link to="/genres" class="menu-item" @click="$emit('close')">
            <IconGrid :size="26" class="menu-icon" />
            <span>Жанры</span>
          </router-link>

          <router-link to="/users" class="menu-item" @click="$emit('close')">
            <IconUsers :size="26" class="menu-icon" />
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
