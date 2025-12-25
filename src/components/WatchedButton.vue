<template>
  <button
    @click="toggleWatched"
    class="action-btn watched-btn"
    :class="{ active: isWatched, loading: loading }"
    :disabled="loading"
    :title="isWatched ? 'Отметить как непросмотренное' : 'Отметить как просмотренное'"
  >
    <div v-if="loading" class="btn-spinner"></div>
    <svg v-else viewBox="0 0 24 24" class="btn-icon">
      <path
        v-if="!isWatched"
        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-10.5-7L10 13.5l2.5-2.5 1.5 1.5L10 16.5 6.5 13z"
        fill="currentColor"
      />
      <path
        v-else
        d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
        fill="currentColor"
      />
    </svg>
    <span class="btn-text">{{ isWatched ? 'Просмотрено' : 'Отметить' }}</span>
  </button>
</template>

<script>
import { animeApi } from '@/api/animeApi'

export default {
  name: 'WatchedButton',
  props: {
    animeId: {
      type: [String, Number],
      required: true,
    },
    animeData: {
      type: Object,
      default: null,
    },
    totalEpisodes: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isWatched: false,
      loading: false,
      episodesWatched: 0,
    }
  },
  mounted() {
    this.checkWatched()
  },
  watch: {
    animeId() {
      this.checkWatched()
    },
  },
  methods: {
    async checkWatched() {
      try {
        const result = await animeApi.checkWatched(this.animeId)
        this.isWatched = result.is_completed
        this.episodesWatched = result.episodes_watched || 0
      } catch (err) {
        console.error('Ошибка проверки просмотренного:', err)
      }
    },

    async toggleWatched() {
      if (this.loading) return

      this.loading = true

      try {
        const watchedData = {
          anime_id: this.animeId,
          episodes_watched: this.isWatched ? 0 : this.totalEpisodes || 1,
          total_episodes: this.totalEpisodes || 1,
          is_completed: !this.isWatched,
          title: this.animeData?.title || null,
          poster: this.animeData?.poster || null,
        }

        await animeApi.updateWatched(watchedData)

        this.isWatched = !this.isWatched
        this.episodesWatched = this.isWatched ? this.totalEpisodes : 0

        this.$emit('watched-changed', {
          is_completed: this.isWatched,
          episodes_watched: this.episodesWatched,
        })
      } catch (err) {
        console.error('Ошибка изменения статуса просмотра:', err)

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

.watched-btn.active {
  background: rgba(76, 175, 80, 0.15);
  border-color: rgba(76, 175, 80, 0.4);
  color: #4caf50;
}

.watched-btn.active:hover:not(:disabled) {
  background: rgba(76, 175, 80, 0.25);
  border-color: rgba(76, 175, 80, 0.6);
}

.btn-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  transition: transform 0.3s;
}

.watched-btn.active .btn-icon {
  animation: checkMark 0.5s ease-in-out;
}

@keyframes checkMark {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2) rotate(10deg);
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

  .btn-icon {
    width: 18px;
    height: 18px;
  }
}
</style>
