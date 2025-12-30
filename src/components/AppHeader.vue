<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Бургер-меню (только на мобильных) -->
      <button class="burger-btn" @click="toggleMobileMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Логотип -->
      <router-link to="/" class="logo">
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
          <span class="logo-title">Anime</span>
          <span class="logo-subtitle">Cinema</span>
        </div>
      </router-link>

      <!-- Навигация (только на десктопе) -->
      <nav class="nav-menu desktop-only">
        <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
          <svg viewBox="0 0 24 24" class="nav-icon">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor" />
          </svg>
          <span>Главная</span>
        </router-link>

        <router-link to="/genres" class="nav-item" :class="{ active: $route.path === '/genres' }">
          <svg viewBox="0 0 24 24" class="nav-icon">
            <path
              d="M12 2l-5.5 9h11z M17.5 11L12 20l5.5-9z M6.5 11L12 2 6.5 11z M12 20l-5.5-9H6.5L12 20z"
              fill="currentColor"
            />
          </svg>
          <span>Жанры</span>
        </router-link>

        <router-link to="/users" class="nav-item" :class="{ active: $route.path === '/users' }">
          <svg viewBox="0 0 24 24" class="nav-icon">
            <path
              d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
              fill="currentColor"
            />
          </svg>
          <span>Пользователи</span>
        </router-link>
      </nav>

      <!-- Действия справа -->
      <div class="header-actions">
        <!-- Поиск -->
        <router-link to="/search" class="action-btn search-btn" title="Поиск">
          <svg viewBox="0 0 24 24" class="action-icon">
            <path
              d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              fill="currentColor"
            />
          </svg>
        </router-link>

        <router-link to="/messages" class="action-btn messages-btn" title="Сообщения">
          <svg viewBox="0 0 24 24" class="action-icon">
            <path
              d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
              fill="currentColor"
            />
          </svg>
          <!-- Бейдж непрочитанных -->
          <span v-if="unreadMessagesCount > 0" class="badge">
            {{ unreadMessagesCount > 99 ? '99+' : unreadMessagesCount }}
          </span>
        </router-link>

        <!-- Уведомления -->
        <NotificationBell />

        <!-- Аватар (только на десктопе) -->
        <div class="user-avatar desktop-only" @click="toggleUserMenu">
          <img :src="userAvatar" alt="User" class="avatar-img" />
        </div>
      </div>
    </div>

    <!-- Меню пользователя (десктоп) -->
    <transition name="fade">
      <div v-if="userMenuOpen" class="user-menu-backdrop desktop-only" @click="toggleUserMenu">
        <div class="user-menu" @click.stop>
          <!-- Крестик -->
          <button class="user-menu-close" @click="toggleUserMenu">
            <svg viewBox="0 0 24 24">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                fill="currentColor"
              />
            </svg>
          </button>

          <!-- Профиль -->
          <div class="user-menu-header">
            <img :src="userAvatar" alt="User" class="user-menu-avatar" />
            <div class="user-menu-info">
              <h4>{{ userName }}</h4>
              <p>@{{ userEmail }}</p>
            </div>
          </div>

          <div class="user-menu-divider"></div>

          <!-- Навигация -->
          <nav class="user-menu-nav">
            <router-link to="/profile" class="user-menu-item" @click="toggleUserMenu">
              <svg viewBox="0 0 24 24" class="menu-item-icon">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                  fill="currentColor"
                />
              </svg>
              Личный кабинет
            </router-link>

            <router-link to="/messages" class="user-menu-item" @click="toggleUserMenu">
              <svg viewBox="0 0 24 24" class="menu-item-icon">
                <path
                  d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
                  fill="currentColor"
                />
              </svg>
              Сообщения
              <span v-if="unreadMessagesCount > 0" class="menu-badge">
                {{ unreadMessagesCount }}
              </span>
            </router-link>

            <router-link to="/users?tab=friends" class="user-menu-item" @click="toggleUserMenu">
              <svg viewBox="0 0 24 24" class="menu-item-icon">
                <path
                  d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                  fill="currentColor"
                />
              </svg>
              Мои друзья
            </router-link>

            <router-link to="/favorites" class="user-menu-item" @click="toggleUserMenu">
              <svg viewBox="0 0 24 24" class="menu-item-icon">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="currentColor"
                />
              </svg>
              Избранное
            </router-link>

            <router-link to="/history" class="user-menu-item" @click="toggleUserMenu">
              <svg viewBox="0 0 24 24" class="menu-item-icon">
                <path
                  d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
                  fill="currentColor"
                />
              </svg>
              История
            </router-link>
          </nav>

          <div class="user-menu-divider"></div>

          <!-- Выход -->
          <a href="#" @click.prevent="handleLogout" class="user-menu-item logout">
            <svg viewBox="0 0 24 24" class="menu-item-icon">
              <path
                d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
                fill="currentColor"
              />
            </svg>
            Выйти
          </a>
        </div>
      </div>
    </transition>

    <!-- Мобильное меню -->
    <MobileMenu
      :is-open="mobileMenuOpen"
      :user-name="userName"
      :user-email="userEmail"
      :user-avatar="userAvatar"
      :unread-messages-count="unreadMessagesCount"
      @close="toggleMobileMenu"
    />
  </header>
</template>

<script>
import { animeApi } from '@/api/animeApi'
import { wsService } from '@/services/websocket'
import NotificationBell from './NotificationBell.vue'
import MobileMenu from './MobileMenu.vue'

export default {
  name: 'AppHeader',
  components: {
    NotificationBell,
    MobileMenu,
  },
  data() {
    return {
      userMenuOpen: false,
      mobileMenuOpen: false,
      userName: 'Загрузка...',
      userEmail: '',
      userAvatar: 'https://i.pravatar.cc/150?img=68',
      unreadMessagesCount: 0,
    }
  },
  async mounted() {
    await this.loadUserProfile()
    await this.loadUnreadCount()

    // Сохраняем ID пользователя
    try {
      const profile = await animeApi.getProfile()
      this.currentUserId = profile.id
    } catch (err) {
      console.error('Ошибка получения ID:', err)
    }

    // Подписываемся на новые сообщения
    this.newMessageHandler = (data) => {
      // Увеличиваем счётчик только если сообщение не от нас
      if (data.sender_id !== this.currentUserId) {
        this.unreadMessagesCount++
      }
    }

    // Подписываемся на прочтение сообщений
    this.messageReadHandler = (data) => {
      console.log('📬 AppHeader: message_read event', data)
      this.loadUnreadCount()
    }

    wsService.on('new_message', this.newMessageHandler)
    wsService.on('message_read', this.messageReadHandler)
  },

  beforeUnmount() {
    if (this.newMessageHandler) {
      wsService.off('new_message', this.newMessageHandler)
    }
    if (this.messageReadHandler) {
      wsService.off('message_read', this.messageReadHandler)
    }
  },

  data() {
    return {
      userMenuOpen: false,
      mobileMenuOpen: false,
      userName: 'Загрузка...',
      userEmail: '',
      userAvatar: 'https://i.pravatar.cc/150?img=68',
      unreadMessagesCount: 0,
      currentUserId: null, // ← ДОБАВЬ ЭТО
    }
  },
  beforeUnmount() {
    if (this.newMessageHandler) {
      wsService.off('new_message', this.newMessageHandler)
    }
  },
  methods: {
    async loadUserProfile() {
      try {
        const profile = await animeApi.getProfile()
        this.userName = profile.name
        this.userEmail = profile.username
        this.userAvatar = profile.avatar_url
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err)
      }
    },

    async loadUnreadCount() {
      try {
        const chats = await animeApi.getChats()
        this.unreadMessagesCount = chats.reduce((sum, chat) => sum + chat.unread_count, 0)
      } catch (err) {
        console.error('Ошибка загрузки непрочитанных:', err)
      }
    },

    toggleUserMenu() {
      this.userMenuOpen = !this.userMenuOpen
    },

    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
      if (this.mobileMenuOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    },

    handleLogout() {
      animeApi.logout()
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
/* ═══════════════════════════════════════════ */
/* HEADER */
/* ═══════════════════════════════════════════ */
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px 30px;
  display: flex;
  align-items: center;
  gap: 20px;
}

/* ═══════════════════════════════════════════ */
/* БУРГЕР-МЕНЮ */
/* ═══════════════════════════════════════════ */
.burger-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  width: 40px;
  height: 40px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.burger-btn:hover {
  background: rgba(255, 65, 108, 0.1);
  border-color: rgba(255, 65, 108, 0.3);
}

.burger-btn span {
  width: 100%;
  height: 2px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s;
}

/* ═══════════════════════════════════════════ */
/* БЕЙДЖ НЕПРОЧИТАННЫХ */
/* ═══════════════════════════════════════════ */
.action-btn {
  position: relative;
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: 2px solid #0a0a0a;
  border-radius: 9px;
  font-size: 10px;
  font-weight: 700;
  color: white;
  animation: badge-pulse 2s infinite;
}

@keyframes badge-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* ═══════════════════════════════════════════ */
/* БЕЙДЖ В МЕНЮ */
/* ═══════════════════════════════════════════ */
.user-menu-item {
  position: relative;
}

.menu-badge {
  margin-left: auto;
  min-width: 22px;
  height: 22px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border-radius: 11px;
  font-size: 11px;
  font-weight: 700;
  color: white;
}

/* ═══════════════════════════════════════════ */
/* ЛОГОТИП */
/* ═══════════════════════════════════════════ */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  transition: all 0.3s;
}

.logo:hover {
  transform: translateY(-2px);
}

.logo-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 65, 108, 0.1);
  border-radius: 12px;
  padding: 8px;
  border: 1px solid rgba(255, 65, 108, 0.3);
}

.logo-icon svg {
  width: 100%;
  height: 100%;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 20px;
  font-weight: 900;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.logo-subtitle {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ═══════════════════════════════════════════ */
/* НАВИГАЦИЯ */
/* ═══════════════════════════════════════════ */
.nav-menu {
  flex: 1;
  display: flex;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 65, 108, 0.15), rgba(255, 75, 43, 0.15));
  border-radius: 12px;
  opacity: 0;
  transition: opacity 0.3s;
}

.nav-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}

.nav-item:hover::before {
  opacity: 1;
}

.nav-item.active {
  color: white;
  background: linear-gradient(135deg, rgba(255, 65, 108, 0.2), rgba(255, 75, 43, 0.2));
  border: 1px solid rgba(255, 65, 108, 0.4);
  box-shadow: 0 0 20px rgba(255, 65, 108, 0.2);
}

.nav-icon {
  width: 18px;
  height: 18px;
  transition: transform 0.3s;
}

.nav-item:hover .nav-icon {
  transform: scale(1.15);
}

/* ═══════════════════════════════════════════ */
/* ДЕЙСТВИЯ */
/* ═══════════════════════════════════════════ */
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background: rgba(255, 65, 108, 0.15);
  border-color: rgba(255, 65, 108, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 65, 108, 0.3);
}

.action-icon {
  width: 20px;
  height: 20px;
}

/* ═══════════════════════════════════════════ */
/* АВАТАР */
/* ═══════════════════════════════════════════ */
.user-avatar {
  position: relative;
  width: 42px;
  height: 42px;
  cursor: pointer;
  transition: transform 0.3s;
}

.user-avatar:hover {
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

/* ═══════════════════════════════════════════ */
/* МЕНЮ ПОЛЬЗОВАТЕЛЯ (ДЕСКТОП) */
/* ═══════════════════════════════════════════ */
.user-menu-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 80px 40px 40px;
}

.user-menu {
  position: relative;
  background: rgba(15, 15, 15, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px;
  min-width: 300px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.user-menu-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10;
}

.user-menu-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: rotate(90deg);
}

.user-menu-close svg {
  width: 18px;
  height: 18px;
}

.user-menu-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.user-menu-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid rgba(255, 65, 108, 0.5);
  object-fit: cover;
}

.user-menu-info h4 {
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0 0 4px;
}

.user-menu-info p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.user-menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 16px 0;
}

.user-menu-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.user-menu-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
  padding-left: 20px;
}

.user-menu-item.logout {
  color: #ff4b2b;
}

.user-menu-item.logout:hover {
  background: rgba(255, 75, 43, 0.1);
}

.menu-item-icon {
  width: 20px;
  height: 20px;
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

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */
.desktop-only {
  display: flex;
}

@media (max-width: 1024px) {
  .header-container {
    gap: 12px;
  }

  .nav-item span {
    display: none;
  }

  .nav-item {
    padding: 10px;
    min-width: 42px;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 12px 20px;
  }

  .burger-btn {
    display: flex;
  }

  .desktop-only {
    display: none !important;
  }

  .logo-subtitle {
    display: none;
  }

  .header-actions {
    margin-left: auto;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 10px 16px;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
  }

  .logo-title {
    font-size: 18px;
  }

  .action-btn {
    width: 38px;
    height: 38px;
  }

  .action-icon {
    width: 18px;
    height: 18px;
  }
}
</style>
