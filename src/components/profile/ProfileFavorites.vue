<template>
  <div class="sidebar-section">
    <div class="section-header">
      <h3 class="sidebar-title">
        <svg viewBox="0 0 24 24" class="section-icon">
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="currentColor"
          />
        </svg>
        Избранное
      </h3>
      <span v-if="favorites.length > 0" class="count-badge">{{ favorites.length }}</span>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else-if="favorites.length" class="favorites-container">
      <div class="favorites-list">
        <router-link
          v-for="anime in favorites.slice(0, 6)"
          :key="anime.id"
          :to="`/anime/${anime.anime_id}`"
          class="favorite-item"
        >
          <div class="favorite-poster">
            <img :src="anime.poster" :alt="anime.title" />
          </div>
          <div class="favorite-info">
            <h4 class="favorite-title">{{ anime.title }}</h4>
            <p class="favorite-meta">{{ anime.year }} • {{ anime.rating }}</p>
          </div>
        </router-link>
      </div>
    </div>

    <div v-else class="empty-state">Пока ничего не добавлено</div>

    <router-link v-if="isOwnProfile" to="/favorites" class="see-all-link">
      Показать все →
    </router-link>
  </div>
</template>

<script>
import { animeApi } from '@/api/animeApi'

export default {
  name: 'ProfileFavorites',
  props: {
    userId: {
      type: Number,
      default: null,
    },
    isOwnProfile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      favorites: [],
      loading: false,
    }
  },
  mounted() {
    this.loadFavorites()
  },
  watch: {
    userId() {
      this.loadFavorites()
    },
  },
  methods: {
    async loadFavorites() {
      this.loading = true
      try {
        if (this.isOwnProfile) {
          this.favorites = await animeApi.getFavorites()
        } else {
          this.favorites = await animeApi.getUserFavorites(this.userId)
        }
      } catch (err) {
        console.error('Ошибка загрузки избранного:', err)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
/* ═══════════════════════════════════════════ */
/* ДЕСКТОП - ОБЫЧНЫЙ СПИСОК */
/* ═══════════════════════════════════════════ */
.sidebar-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.section-icon {
  width: 24px;
  height: 24px;
  color: #ff416c;
}

.count-badge {
  padding: 4px 12px;
  background: rgba(255, 65, 108, 0.2);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  color: #ff416c;
}

.loading {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

.favorites-container {
  margin-bottom: 20px;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.favorite-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
}

.favorite-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 65, 108, 0.3);
  transform: translateX(4px);
}

.favorite-poster {
  position: relative;
  flex-shrink: 0;
}

.favorite-poster img {
  width: 60px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  display: block;
}

.favorite-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  min-width: 0;
}

.favorite-title {
  font-size: 14px;
  font-weight: 700;
  color: white;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.favorite-meta {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.see-all-link {
  display: block;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s;
}

.see-all-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

/* ═══════════════════════════════════════════ */
/* МОБИЛЬНЫЕ - ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ */
/* ═══════════════════════════════════════════ */
@media (max-width: 768px) {
  .sidebar-section {
    padding: 20px;

    /* ✅ Защита от выхода за границы */
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .section-header {
    margin-bottom: 16px;
  }

  .sidebar-title {
    font-size: 16px;
  }

  .section-icon {
    width: 20px;
    height: 20px;
  }

  .count-badge {
    padding: 3px 10px;
    font-size: 12px;
  }

  .favorites-container {
    margin-bottom: 16px;

    /* ✅ Защита */
    max-width: 100%;
    width: 100%;
    overflow: hidden;
  }

  .favorites-list {
    /* ✅ Горизонтальный скролл */
    display: flex;
    flex-direction: row;
    gap: 10px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    -ms-overflow-style: none;
    -webkit-overflow-scrolling: touch;

    max-width: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
  }

  .favorites-list::-webkit-scrollbar {
    display: none;
  }

  .favorite-item {
    /* ✅ Вертикальная карточка */
    flex-direction: column;

    /* ✅ Фиксированная ширина БЕЗ calc() */
    width: 110px;
    min-width: 110px;
    max-width: 110px;

    flex-shrink: 0;
    padding: 12px 8px;
    scroll-snap-align: start;
    text-align: center;
  }

  .favorite-item:hover {
    transform: translateY(-4px);
  }

  .favorite-poster {
    align-self: center;
    margin-bottom: 8px;
  }

  .favorite-poster img {
    width: 50px;
    height: 70px;
    border-radius: 8px;
    display: block;
  }

  .favorite-info {
    flex: none;
    width: 100%;
  }

  .favorite-title {
    font-size: 11px;
    line-height: 1.3;
    min-height: 28px;
    text-align: center;
    word-break: break-word;
  }

  .favorite-meta {
    font-size: 10px;
    text-align: center;
  }

  .see-all-link {
    padding: 8px 12px;
    font-size: 13px;
  }

  .loading,
  .empty-state {
    padding: 30px 15px;
    font-size: 13px;
  }
}

/* Очень маленькие экраны */
@media (max-width: 480px) {
  .sidebar-section {
    padding: 16px;
  }

  .favorites-list {
    gap: 8px;
  }

  .favorite-item {
    width: 100px;
    min-width: 100px;
    max-width: 100px;
    padding: 10px 6px;
  }

  .favorite-poster img {
    width: 45px;
    height: 65px;
    border-radius: 6px;
    display: block;
  }

  .favorite-title {
    font-size: 10px;
    min-height: 26px;
  }

  .favorite-meta {
    font-size: 9px;
  }
}
</style>
