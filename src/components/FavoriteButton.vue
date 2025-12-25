<template>
  <button
    @click="toggleFavorite"
    class="action-btn favorite-btn"
    :class="{ active: isFavorite }"
    :title="isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'"
  >
    <svg viewBox="0 0 24 24" class="btn-icon">
      <path
        v-if="!isFavorite"
        d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
        fill="currentColor"
      />
      <path
        v-else
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="currentColor"
      />
    </svg>
    <span class="btn-text">{{ isFavorite ? 'В избранном' : 'В избранное' }}</span>
  </button>
</template>

<script>
export default {
  name: 'FavoriteButton',
  props: {
    animeId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      isFavorite: false,
    }
  },
  methods: {
    toggleFavorite() {
      this.isFavorite = !this.isFavorite
      // TODO: Сохранение в localStorage или API
      console.log('Toggle favorite:', this.animeId, this.isFavorite)
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

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-2px);
}

.favorite-btn.active {
  background: rgba(244, 67, 54, 0.15);
  border-color: rgba(244, 67, 54, 0.4);
  color: #f44336;
}

.favorite-btn.active:hover {
  background: rgba(244, 67, 54, 0.25);
  border-color: rgba(244, 67, 54, 0.6);
}

.btn-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.btn-text {
  white-space: nowrap;
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
