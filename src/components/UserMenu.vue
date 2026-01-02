<template>
  <!-- ✅ Обёртка с position: relative (как у NotificationBell) -->
  <div class="user-menu-wrapper">
    <!-- Кнопка аватара -->
    <button class="user-avatar-btn" @click="toggleMenu" :class="{ active: isOpen }">
      <img :src="userAvatar" :alt="userName" class="avatar-img" />
      <span v-if="unreadCount > 0" class="avatar-badge">
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- ✅ ДЕСКТОП: Выпадающее меню (position: absolute, right: 0) -->
    <transition name="slide-down">
      <div v-if="isOpen && !isMobile" class="user-dropdown">
        <!-- Профиль -->
        <div class="dropdown-header">
          <img :src="userAvatar" :alt="userName" class="dropdown-avatar" />
          <div class="dropdown-info">
            <h4>{{ userName }}</h4>
            <p>@{{ userEmail }}</p>
          </div>
        </div>

        <div class="dropdown-divider"></div>

        <!-- Навигация -->
        <nav class="dropdown-nav">
          <router-link to="/profile" class="dropdown-item" @click="close">
            <svg viewBox="0 0 24 24" class="dropdown-icon">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                fill="currentColor"
              />
            </svg>
            <span>Личный кабинет</span>
          </router-link>

          <router-link to="/messages" class="dropdown-item" @click="close">
            <svg viewBox="0 0 24 24" class="dropdown-icon">
              <path
                d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
                fill="currentColor"
              />
            </svg>
            <span>Сообщения</span>
            <span v-if="unreadMessagesCount > 0" class="dropdown-badge">
              {{ unreadMessagesCount }}
            </span>
          </router-link>

          <router-link to="/users?tab=friends" class="dropdown-item" @click="close">
            <svg viewBox="0 0 24 24" class="dropdown-icon">
              <path
                d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                fill="currentColor"
              />
            </svg>
            <span>Мои друзья</span>
          </router-link>

          <router-link to="/favorites" class="dropdown-item" @click="close">
            <svg viewBox="0 0 24 24" class="dropdown-icon">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="currentColor"
              />
            </svg>
            <span>Избранное</span>
          </router-link>

          <router-link to="/history" class="dropdown-item" @click="close">
            <svg viewBox="0 0 24 24" class="dropdown-icon">
              <path
                d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
                fill="currentColor"
              />
            </svg>
            <span>История</span>
          </router-link>
        </nav>

        <div class="dropdown-divider"></div>

        <!-- Выход -->
        <button class="dropdown-item logout" @click="handleLogout">
          <svg viewBox="0 0 24 24" class="dropdown-icon">
            <path
              d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
              fill="currentColor"
            />
          </svg>
          <span>Выйти</span>
        </button>
      </div>
    </transition>

    <!-- ✅ МОБАЙЛ: Fullscreen меню -->
    <transition name="mobile-menu">
      <div v-if="isOpen && isMobile" class="mobile-overlay" @click="close">
        <div class="mobile-panel" @click.stop>
          <!-- Заголовок -->
          <div class="mobile-header">
            <div class="mobile-profile">
              <img :src="userAvatar" :alt="userName" class="mobile-avatar" />
              <div class="mobile-info">
                <h3>{{ userName }}</h3>
                <p>@{{ userEmail }}</p>
              </div>
            </div>
            <button class="mobile-close" @click="close">
              <svg viewBox="0 0 24 24">
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          <div class="mobile-divider"></div>

          <!-- Навигация -->
          <nav class="mobile-nav">
            <router-link to="/profile" class="mobile-item" @click="close">
              <svg viewBox="0 0 24 24" class="mobile-icon">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                  fill="currentColor"
                />
              </svg>
              <span>Личный кабинет</span>
            </router-link>

            <router-link to="/messages" class="mobile-item" @click="close">
              <svg viewBox="0 0 24 24" class="mobile-icon">
                <path
                  d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
                  fill="currentColor"
                />
              </svg>
              <span>Сообщения</span>
              <span v-if="unreadMessagesCount > 0" class="mobile-badge">
                {{ unreadMessagesCount }}
              </span>
            </router-link>

            <router-link to="/users?tab=friends" class="mobile-item" @click="close">
              <svg viewBox="0 0 24 24" class="mobile-icon">
                <path
                  d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                  fill="currentColor"
                />
              </svg>
              <span>Мои друзья</span>
            </router-link>

            <router-link to="/favorites" class="mobile-item" @click="close">
              <svg viewBox="0 0 24 24" class="mobile-icon">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="currentColor"
                />
              </svg>
              <span>Избранное</span>
            </router-link>

            <router-link to="/history" class="mobile-item" @click="close">
              <svg viewBox="0 0 24 24" class="mobile-icon">
                <path
                  d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
                  fill="currentColor"
                />
              </svg>
              <span>История</span>
            </router-link>
          </nav>

          <div class="mobile-divider"></div>

          <!-- Выход -->
          <button class="mobile-item logout" @click="handleLogout">
            <svg viewBox="0 0 24 24" class="mobile-icon">
              <path
                d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
                fill="currentColor"
              />
            </svg>
            <span>Выйти</span>
          </button>
        </div>
      </div>
    </transition>
  </div>

  <!-- ✅ Backdrop для закрытия (только десктоп, вне обёртки) -->
  <div v-if="isOpen && !isMobile" class="dropdown-backdrop" @click="close"></div>
</template>

<script>
import { animeApi } from '@/api/animeApi'

export default {
  name: 'UserMenu',
  props: {
    userName: String,
    userEmail: String,
    userAvatar: String,
    unreadMessagesCount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isOpen: false,
      isMobile: window.innerWidth <= 768,
    }
  },
  computed: {
    unreadCount() {
      return this.unreadMessagesCount
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen
      if (this.isOpen && this.isMobile) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    },
    close() {
      this.isOpen = false
      document.body.style.overflow = ''
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 768
    },
    handleLogout() {
      animeApi.logout()
      this.$router.push('/login')
      this.close()
    },
  },
}
</script>

<style scoped>
/* ═══════════════════════════════════════════ */
/* ОБЁРТКА (как у NotificationBell) */
/* ═══════════════════════════════════════════ */
.user-menu-wrapper {
  position: relative; /* ✅ Главное! */
}

/* ═══════════════════════════════════════════ */
/* КНОПКА АВАТАРА */
/* ═══════════════════════════════════════════ */
.user-avatar-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.3s;
}

.user-avatar-btn:hover,
.user-avatar-btn.active {
  transform: scale(1.08);
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(255, 65, 108, 0.5);
  object-fit: cover;
  box-shadow: 0 0 15px rgba(255, 65, 108, 0.3);
}

.avatar-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: 2px solid rgba(10, 10, 10, 0.95);
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  color: white;
}

/* ═══════════════════════════════════════════ */
/* ДЕСКТОП - DROPDOWN (как у NotificationBell) */
/* ═══════════════════════════════════════════ */
.user-dropdown {
  position: absolute; /* ✅ relative к .user-menu-wrapper */
  top: calc(100% + 12px);
  right: 0; /* ✅ От правого края кнопки */
  width: 280px;
  background: rgba(15, 15, 15, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  z-index: 9999;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
}

.dropdown-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid rgba(255, 65, 108, 0.5);
  object-fit: cover;
  flex-shrink: 0;
}

.dropdown-info {
  flex: 1;
  min-width: 0;
}

.dropdown-info h4 {
  font-size: 15px;
  font-weight: 700;
  color: white;
  margin: 0 0 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-info p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 12px 0;
}

.dropdown-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.dropdown-item.logout {
  color: #ff4b2b;
}

.dropdown-item.logout:hover {
  background: rgba(255, 75, 43, 0.15);
}

.dropdown-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.dropdown-badge {
  margin-left: auto;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  color: white;
}

/* ✅ Backdrop (вне обёртки, fixed) */
.dropdown-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: transparent;
}

/* Анимация (как у NotificationBell) */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* ═══════════════════════════════════════════ */
/* МОБАЙЛ - FULLSCREEN */
/* ═══════════════════════════════════════════ */
.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  justify-content: flex-end;
}

.mobile-panel {
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.mobile-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px;
}

.mobile-profile {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.mobile-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid rgba(255, 65, 108, 0.5);
  object-fit: cover;
  flex-shrink: 0;
}

.mobile-info {
  flex: 1;
  min-width: 0;
}

.mobile-info h3 {
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0 0 4px;
}

.mobile-info p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.mobile-close {
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
  flex-shrink: 0;
}

.mobile-close:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(90deg);
}

.mobile-close svg {
  width: 20px;
  height: 20px;
}

.mobile-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 24px 16px;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  padding: 0 12px;
  flex: 1;
}

.mobile-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.mobile-item:hover {
  background: rgba(255, 65, 108, 0.1);
  color: white;
}

.mobile-item.logout {
  color: #ff4b2b;
  margin-top: auto;
  margin-bottom: 12px;
}

.mobile-item.logout:hover {
  background: rgba(255, 75, 43, 0.15);
}

.mobile-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.mobile-badge {
  margin-left: auto;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  color: white;
}

/* Анимация mobile */
.mobile-menu-enter-active {
  transition: all 0.3s ease-out;
}

.mobile-menu-leave-active {
  transition: all 0.25s ease-in;
}

.mobile-menu-enter-from .mobile-overlay,
.mobile-menu-leave-to .mobile-overlay {
  opacity: 0;
}

.mobile-menu-enter-from .mobile-panel {
  transform: translateY(100%);
}

.mobile-menu-leave-to .mobile-panel {
  transform: translateY(100%);
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */
@media (max-width: 768px) {
  .user-avatar-btn {
    width: 38px;
    height: 38px;
  }

  .user-dropdown {
    width: calc(100vw - 40px);
    right: -20px;
  }
}
</style>
