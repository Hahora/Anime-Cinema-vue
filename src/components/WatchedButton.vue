<template>
  <button
    @click="toggleWatched"
    class="action-btn watched-btn"
    :class="{ active: isWatched }"
    :title="isWatched ? 'Отметить как непросмотренное' : 'Отметить как просмотренное'"
  >
    <svg viewBox="0 0 24 24" class="btn-icon">
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
export default {
  name: 'WatchedButton',
  props: {
    animeId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      isWatched: false,
    }
  },
  methods: {
    toggleWatched() {
      this.isWatched = !this.isWatched
      // TODO: Сохранение в localStorage или API
      console.log('Toggle watched:', this.animeId, this.isWatched)
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

.watched-btn.active {
  background: rgba(76, 175, 80, 0.15);
  border-color: rgba(76, 175, 80, 0.4);
  color: #4caf50;
}

.watched-btn.active:hover {
  background: rgba(76, 175, 80, 0.25);
  border-color: rgba(76, 175, 80, 0.6);
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
