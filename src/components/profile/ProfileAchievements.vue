<template>
  <div class="sidebar-section">
    <div class="section-header">
      <h3 class="sidebar-title">
        <svg viewBox="0 0 24 24" class="section-icon">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            fill="currentColor"
          />
        </svg>
        Достижения
      </h3>
    </div>

    <div class="achievements-grid">
      <div
        v-for="achievement in achievements"
        :key="achievement.id"
        :class="['achievement-item', { unlocked: achievement.unlocked }]"
        :title="achievement.description"
      >
        <div class="achievement-icon">{{ achievement.icon }}</div>
        <span class="achievement-name">{{ achievement.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileAchievements',
  props: {
    totalAnime: Number,
    totalEpisodes: Number,
    favoritesCount: Number,
  },
  computed: {
    achievements() {
      return [
        {
          id: 1,
          icon: '🎬',
          name: 'Первое аниме',
          unlocked: this.totalAnime > 0,
          description: 'Посмотрели первое аниме',
        },
        {
          id: 2,
          icon: '💯',
          name: '100 серий',
          unlocked: this.totalEpisodes >= 100,
          description: 'Просмотрено 100 серий',
        },
        {
          id: 3,
          icon: '🔥',
          name: 'Марафон',
          unlocked: this.totalEpisodes >= 50,
          description: 'Активный просмотр',
        },
        {
          id: 4,
          icon: '⭐',
          name: '1000 серий',
          unlocked: this.totalEpisodes >= 1000,
          description: '1000 серий просмотрено',
        },
        {
          id: 5,
          icon: '👑',
          name: 'Легенда',
          unlocked: this.totalAnime >= 500,
          description: 'Просмотрено 500 аниме',
        },
        {
          id: 6,
          icon: '💝',
          name: 'Коллекционер',
          unlocked: this.favoritesCount >= 50,
          description: '50 аниме в избранном',
        },
      ]
    },
  },
}
</script>

<style scoped>
.sidebar-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 24px;
}

.section-header {
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

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.achievement-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  opacity: 0.4;
}

.achievement-item.unlocked {
  opacity: 1;
}

.achievement-item:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-4px);
}

.achievement-icon {
  font-size: 32px;
  line-height: 1;
}

.achievement-name {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
}

@media (max-width: 768px) {
  .achievements-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
