<template>
  <header class="app-header">
    <div class="header-container">
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

      <!-- Навигация -->
      <nav class="nav-menu">
        <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
          <svg viewBox="0 0 24 24" class="nav-icon">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor" />
          </svg>
          <span>Главная</span>
        </router-link>

        <router-link to="/history" class="nav-item" :class="{ active: $route.path === '/history' }">
          <svg viewBox="0 0 24 24" class="nav-icon">
            <path
              d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
              fill="currentColor"
            />
          </svg>
          <span>История</span>
        </router-link>

        <router-link to="/profile" class="nav-item" :class="{ active: $route.path === '/profile' }">
          <svg viewBox="0 0 24 24" class="nav-icon">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
              fill="currentColor"
            />
          </svg>
          <span>Профиль</span>
        </router-link>
      </nav>

      <!-- Правая часть -->
      <div class="header-actions">
        <!-- Поиск (иконка) -->
        <button class="action-btn search-btn" @click="toggleSearch" title="Поиск">
          <svg viewBox="0 0 24 24" class="action-icon">
            <path
              d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              fill="currentColor"
            />
          </svg>
        </button>

        <!-- Уведомления -->
        <button class="action-btn notification-btn" title="Уведомления">
          <svg viewBox="0 0 24 24" class="action-icon">
            <path
              d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"
              fill="currentColor"
            />
          </svg>
          <span class="notification-badge">3</span>
        </button>

        <!-- Аватар -->
        <div class="user-avatar" @click="toggleUserMenu">
          <img src="https://i.pravatar.cc/150?img=68" alt="User" class="avatar-img" />
          <div class="avatar-status"></div>
        </div>
      </div>
    </div>

    <!-- Выдвижная панель поиска -->
    <transition name="slide-down">
      <div v-if="searchOpen" class="search-panel" @click.stop>
        <div class="search-panel-container">
          <input
            ref="searchInput"
            v-model="searchQuery"
            @keyup.enter="performSearch"
            type="text"
            placeholder="Поиск аниме..."
            class="search-panel-input"
          />
          <button @click="performSearch" class="search-panel-btn">
            <svg viewBox="0 0 24 24">
              <path
                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button @click="toggleSearch" class="search-panel-close">
            <svg viewBox="0 0 24 24">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <!-- Меню пользователя -->
    <transition name="fade">
      <div v-if="userMenuOpen" class="user-menu-backdrop" @click="toggleUserMenu">
        <div class="user-menu" @click.stop>
          <div class="user-menu-header">
            <img src="https://i.pravatar.cc/150?img=68" alt="User" class="user-menu-avatar" />
            <div class="user-menu-info">
              <h4>Anime Fan</h4>
              <p>anime.fan@mail.com</p>
            </div>
          </div>
          <div class="user-menu-divider"></div>
          <nav class="user-menu-nav">
            <a href="#" class="user-menu-item">
              <svg viewBox="0 0 24 24" class="menu-item-icon">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                  fill="currentColor"
                />
              </svg>
              Мой профиль
            </a>
            <a href="#" class="user-menu-item">
              <svg viewBox="0 0 24 24" class="menu-item-icon">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                  fill="currentColor"
                />
              </svg>
              Мои списки
            </a>
            <a href="#" class="user-menu-item">
              <svg viewBox="0 0 24 24" class="menu-item-icon">
                <path
                  d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58C4.84 11.36 4.8 11.69 4.8 12s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
                  fill="currentColor"
                />
              </svg>
              Настройки
            </a>
          </nav>
          <div class="user-menu-divider"></div>
          <a href="#" class="user-menu-item logout">
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
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      searchOpen: false,
      searchQuery: '',
      userMenuOpen: false,
    }
  },
  methods: {
    toggleSearch() {
      this.searchOpen = !this.searchOpen
      if (this.searchOpen) {
        this.$nextTick(() => {
          this.$refs.searchInput?.focus()
        })
      }
    },

    performSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({ path: '/', query: { q: this.searchQuery } })
        this.searchOpen = false
        this.searchQuery = ''
      }
    },

    toggleUserMenu() {
      this.userMenuOpen = !this.userMenuOpen
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
  max-width: 1600px;
  margin: 0 auto;
  padding: 16px 40px;
  display: flex;
  align-items: center;
  gap: 40px;
}

/* ═══════════════════════════════════════════ */
/* ЛОГОТИП */
/* ═══════════════════════════════════════════ */
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
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
  gap: 2px;
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
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
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
  padding: 10px 20px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s;
  position: relative;
}

.nav-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 65, 108, 0.1), rgba(255, 75, 43, 0.1));
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
  background: rgba(255, 65, 108, 0.15);
  border: 1px solid rgba(255, 65, 108, 0.3);
}

.nav-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s;
}

.nav-item:hover .nav-icon {
  transform: scale(1.1);
}

/* ═══════════════════════════════════════════ */
/* ДЕЙСТВИЯ */
/* ═══════════════════════════════════════════ */
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 65, 108, 0.5);
  transform: translateY(-2px);
}

.action-icon {
  width: 22px;
  height: 22px;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: white;
  border: 2px solid rgba(10, 10, 10, 0.95);
}

/* ═══════════════════════════════════════════ */
/* АВАТАР */
/* ═══════════════════════════════════════════ */
.user-avatar {
  position: relative;
  width: 44px;
  height: 44px;
  cursor: pointer;
  transition: transform 0.3s;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(255, 65, 108, 0.5);
  object-fit: cover;
}

.avatar-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 14px;
  height: 14px;
  background: #4caf50;
  border-radius: 50%;
  border: 2px solid rgba(10, 10, 10, 0.95);
}

/* ═══════════════════════════════════════════ */
/* ПАНЕЛЬ ПОИСКА */
/* ═══════════════════════════════════════════ */
.search-panel {
  background: rgba(15, 15, 15, 0.98);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 20px 40px;
}

.search-panel-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  gap: 12px;
}

.search-panel-input {
  flex: 1;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  color: white;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;
}

.search-panel-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 65, 108, 0.5);
  box-shadow: 0 0 20px rgba(255, 65, 108, 0.2);
}

.search-panel-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.search-panel-btn,
.search-panel-close {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.search-panel-btn {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
}

.search-panel-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(255, 65, 108, 0.4);
}

.search-panel-btn svg,
.search-panel-close svg {
  width: 24px;
  height: 24px;
}

.search-panel-close {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.search-panel-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* ═══════════════════════════════════════════ */
/* МЕНЮ ПОЛЬЗОВАТЕЛЯ */
/* ═══════════════════════════════════════════ */
.user-menu-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 80px 40px 40px;
}

.user-menu {
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
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

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
@media (max-width: 1024px) {
  .header-container {
    padding: 16px 20px;
    gap: 20px;
  }

  .nav-item span {
    display: none;
  }

  .nav-item {
    padding: 10px;
    min-width: 44px;
    justify-content: center;
  }

  .logo-text {
    display: none;
  }
}

@media (max-width: 768px) {
  .header-container {
    gap: 12px;
  }

  .nav-menu {
    display: none;
  }

  .header-actions {
    gap: 8px;
  }

  .action-btn {
    width: 40px;
    height: 40px;
  }

  .search-panel {
    padding: 16px 20px;
  }

  .user-menu-backdrop {
    padding: 70px 20px 20px;
  }
}
</style>
