<template>
  <button
    @click="toggleFavorite"
    class="action-btn favorite-btn"
    :class="{ active: isFavorite, loading: loading }"
    :disabled="loading"
    :title="isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'"
  >
    <div v-if="loading" class="btn-spinner"></div>
    <IconHeart v-if="isFavorite" :size="20" class="btn-icon" fill="currentColor" />
    <IconHeart v-else :size="20" class="btn-icon" />
    <span class="btn-text">{{ isFavorite ? 'В избранном' : 'В избранное' }}</span>
  </button>
</template>

<script>
import { animeApi } from '@/api/animeApi'

export default {
  name: 'FavoriteButton',
  props: {
    animeId: {
      type: [String, Number],
      required: true,
    },
    animeData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      isFavorite: false,
      loading: false,
    }
  },
  mounted() {
    this.checkFavorite()
  },
  watch: {
    animeId() {
      this.checkFavorite()
    },
  },
  methods: {
    async checkFavorite() {
      try {
        const result = await animeApi.checkFavorite(this.animeId)
        this.isFavorite = result.is_favorite
      } catch (err) {
        console.error('Ошибка проверки избранного:', err)
      }
    },

    async toggleFavorite() {
      if (this.loading) return

      this.loading = true

      try {
        if (this.isFavorite) {
          // Удаляем из избранного
          await animeApi.removeFromFavorites(this.animeId)
          this.isFavorite = false
          this.$emit('favorite-removed')
        } else {
          // Добавляем в избранное
          const favoriteData = {
            anime_id: this.animeId,
            title: this.animeData?.title || null,
            poster: this.animeData?.poster || null,
            year: this.animeData?.year || null,
            rating: this.animeData?.rating || null,
          }

          await animeApi.addToFavorites(favoriteData)
          this.isFavorite = true
          this.$emit('favorite-added')
        }
      } catch (err) {
        console.error('Ошибка изменения избранного:', err)

        if (err.message.includes('авторизован')) {
          this.$router.push('/login')
        } else {
          alert(err.message || 'Ошибка')
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.action-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-2px);
}

.action-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.favorite-btn.active {
  background: rgba(244, 67, 54, 0.15);
  border-color: rgba(244, 67, 54, 0.4);
  color: #f44336;
}

.favorite-btn.active:hover:not(:disabled) {
  background: rgba(244, 67, 54, 0.25);
  border-color: rgba(244, 67, 54, 0.6);
}

.btn-icon {
  flex-shrink: 0;
  transition: transform 0.3s;
}

.favorite-btn.active .btn-icon {
  animation: heartBeat 0.5s ease-in-out;
}

@keyframes heartBeat {
  0%,
  100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(1.1);
  }
}

.btn-text {
  white-space: nowrap;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .action-btn {
    padding: 10px 16px;
    font-size: 13px;
  }
}
</style>
