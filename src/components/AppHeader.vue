<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Бургер + иконка (только на мобильных) -->
      <div class="mobile-left">
        <button class="burger-btn" @click="toggleMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <!-- ✅ ИКОНКА возле бургера (ТОЛЬКО на мобильных) -->
        <div class="logo-icon-only mobile-only">
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
      </div>

      <!-- Логотип (только на десктопе) -->
      <router-link to="/" class="logo desktop-only">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              fill="url(#gradient1-desktop)"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="url(#gradient2-desktop)"
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
                id="gradient1-desktop"
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
                id="gradient2-desktop"
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
          <IconHome :size="18" class="nav-icon" />
          <span>Главная</span>
        </router-link>

        <router-link to="/genres" class="nav-item" :class="{ active: $route.path === '/genres' }">
          <IconGrid :size="18" class="nav-icon" />
          <span>Жанры</span>
        </router-link>

        <router-link to="/users" class="nav-item" :class="{ active: $route.path === '/users' }">
          <IconUsers :size="18" class="nav-icon" />
          <span>Пользователи</span>
        </router-link>
      </nav>

      <!-- Действия справа -->
      <div class="header-actions">
        <!-- Поиск -->
        <router-link to="/search" class="action-btn search-btn" title="Поиск">
          <IconSearch :size="20" class="action-icon" />
        </router-link>

        <!-- Сообщения -->
        <router-link to="/messages" class="action-btn messages-btn" title="Сообщения">
          <IconMessage :size="20" class="action-icon" />
          <!-- Бейдж непрочитанных -->
          <span v-if="unreadMessagesCount > 0" class="badge">
            {{ unreadMessagesCount > 99 ? '99+' : unreadMessagesCount }}
          </span>
        </router-link>

        <!-- Уведомления -->
        <NotificationBell />

        <!-- ✅ НОВЫЙ КОМПОНЕНТ UserMenu -->
        <UserMenu
          :user-name="userName"
          :user-email="userEmail"
          :user-avatar="userAvatar"
          :unread-messages-count="unreadMessagesCount"
        />
      </div>
    </div>

    <!-- Мобильное меню (только страницы) -->
    <MobileMenu :is-open="mobileMenuOpen" @close="toggleMobileMenu" />
  </header>
</template>

<script>
import { animeApi } from '@/api/animeApi'
import { wsService } from '@/services/websocket'
import NotificationBell from './NotificationBell.vue'
import MobileMenu from './MobileMenu.vue'
import UserMenu from './UserMenu.vue'

export default {
  name: 'AppHeader',
  components: {
    NotificationBell,
    MobileMenu,
    UserMenu,
  },
  data() {
    return {
      mobileMenuOpen: false,
      userName: 'Загрузка...',
      userEmail: '',
      userAvatar: 'https://i.pravatar.cc/150?img=68',
      unreadMessagesCount: 0,
      currentUserId: null,
    }
  },
  async mounted() {
    await this.loadUserProfile()
    await this.loadUnreadCount()

    // Подписываемся на новые сообщения
    this.newMessageHandler = (data) => {
      if (data.sender_id !== this.currentUserId) {
        this.unreadMessagesCount++
      }
    }

    this.messageReadHandler = (data) => {
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

  methods: {
    async loadUserProfile() {
      try {
        const profile = await animeApi.getProfile()
        this.userName = profile.name
        this.userEmail = profile.username
        this.userAvatar = profile.avatar_url
        this.currentUserId = profile.id
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

    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
      if (this.mobileMenuOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
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
/* МОБИЛЬНАЯ ЛЕВАЯ ЧАСТЬ */
/* ═══════════════════════════════════════════ */
.mobile-left {
  display: none;
  align-items: center;
  gap: 12px;
}

/* ✅ ИКОНКА ЛОГОТИПА (только на мобильных) */
.logo-icon-only {
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

.logo-icon-only svg {
  width: 100%;
  height: 100%;
}

/* ═══════════════════════════════════════════ */
/* БУРГЕР-МЕНЮ */
/* ═══════════════════════════════════════════ */
.burger-btn {
  display: flex;
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
/* ЛОГОТИП (ДЕСКТОП) */
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
/* НАВИГАЦИЯ (ДЕСКТОП) */
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
  transition: transform 0.3s;
}

.nav-item:hover .nav-icon {
  transform: scale(1.15);
}

/* ═══════════════════════════════════════════ */
/* ДЕЙСТВИЯ СПРАВА */
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

/* Бейдж непрочитанных */
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
/* ВИДИМОСТЬ */
/* ═══════════════════════════════════════════ */
.desktop-only {
  display: flex;
}

.mobile-only {
  display: none;
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */
@media (max-width: 1024px) {
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

  /* ✅ Показываем бургер + иконку */
  .mobile-left {
    display: flex;
  }

  /* ✅ Скрываем десктоп элементы */
  .desktop-only {
    display: none !important;
  }

  /* ✅ Показываем мобильную иконку */
  .mobile-only {
    display: flex;
  }

  .header-actions {
    margin-left: auto;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 10px 16px;
  }

  .burger-btn,
  .action-btn {
    width: 38px;
    height: 38px;
  }

  .logo-icon-only {
    width: 34px;
    height: 34px;
  }

  .action-icon {
    width: 18px;
    height: 18px;
  }
}
</style>
