<template>
  <div class="anime-cards">
    <div class="cards-header">
      <h3 class="cards-title">Персонажи</h3>
      <div class="cards-filter">
        <button
          v-for="filter in filters"
          :key="filter.id"
          @click="currentFilter = filter.id"
          :class="['filter-btn', { active: currentFilter === filter.id }]"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Сетка карточек -->
    <div class="cards-grid" v-if="filteredCards.length">
      <div v-for="card in filteredCards" :key="card.id" class="character-card">
        <div class="card-image">
          <img :src="card.image" :alt="card.name" />
          <div class="card-overlay">
            <div class="card-role">{{ card.role }}</div>
          </div>
        </div>
        <div class="card-content">
          <h4 class="card-name">{{ card.name }}</h4>
          <p class="card-name-jp" v-if="card.nameJp">{{ card.nameJp }}</p>
          <div class="card-rating">
            <div class="stars">
              <svg
                v-for="i in 5"
                :key="i"
                viewBox="0 0 24 24"
                class="star"
                :class="{ filled: i <= Math.round(card.rating) }"
              >
                <path
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span class="rating-text">{{ card.rating }}/5</span>
          </div>
          <div class="card-stats">
            <div class="stat-item">
              <svg viewBox="0 0 24 24" class="stat-icon">
                <path
                  d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                  fill="currentColor"
                />
              </svg>
              <span>{{ card.fans }} фанатов</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div class="empty-cards" v-else>
      <div class="empty-icon">👤</div>
      <h3>Персонажи не найдены</h3>
      <p>Попробуйте изменить фильтр</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnimeCards',
  props: {
    animeId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      currentFilter: 'all',
      filters: [
        { id: 'all', label: 'Все' },
        { id: 'main', label: 'Главные' },
        { id: 'supporting', label: 'Второстепенные' },
      ],
      cards: [
        // Пример данных
        {
          id: 1,
          name: 'Момо Аясэ',
          nameJp: '綾瀬 桃',
          role: 'Главная героиня',
          image:
            'https://desu.shikimori.one/uploads/poster/characters/238966/main_alt-57a4acfe0f0fd0dd83bca0d8fe4dbeff.webp',
          rating: 4.8,
          fans: 1520,
          type: 'main',
        },
        {
          id: 2,
          name: 'Кэн Такакура',
          nameJp: '高倉 健',
          role: 'Главный герой',
          image:
            'https://desu.shikimori.one/uploads/poster/characters/238967/main_alt-3485a3c2c5d4ad7f28fa8652303dbd41.webp',
          rating: 4.9,
          fans: 1680,
          type: 'main',
        },
        {
          id: 3,
          name: 'Аира Сиратори',
          nameJp: '白鳥 愛羅',
          role: 'Второстепенный персонаж',
          image:
            'https://desu.shikimori.one/uploads/poster/characters/238968/main_alt-9c8d71cef1d4775d3e5ca3293d5e56f8.webp',
          rating: 4.5,
          fans: 890,
          type: 'supporting',
        },
        {
          id: 4,
          name: 'Дзин Эндзодзи',
          nameJp: '円城寺 仁',
          role: 'Второстепенный персонаж',
          image:
            'https://desu.shikimori.one/uploads/poster/characters/238969/main_alt-f062f8c78a92ec36a20ef6ca98f5b68b.webp',
          rating: 4.3,
          fans: 750,
          type: 'supporting',
        },
        {
          id: 5,
          name: 'Сэйко Аясэ',
          nameJp: '綾瀬 聖子',
          role: 'Второстепенный персонаж',
          image:
            'https://desu.shikimori.one/uploads/poster/characters/238970/main_alt-8aae69be5bdff1e4fcc9d2bcc95cb4c9.webp',
          rating: 4.7,
          fans: 1120,
          type: 'supporting',
        },
        {
          id: 6,
          name: 'Кинта Сакарука',
          nameJp: '鮫皮 金太',
          role: 'Второстепенный персонаж',
          image:
            'https://desu.shikimori.one/uploads/poster/characters/238971/main_alt-6e6d9aa8b4a39efe69c2aecb94c54aab.webp',
          rating: 4.2,
          fans: 680,
          type: 'supporting',
        },
        {
          id: 7,
          name: 'Вамоно Кондзё',
          nameJp: '金城 ワモノ',
          role: 'Второстепенный персонаж',
          image:
            'https://desu.shikimori.one/uploads/poster/characters/238972/main_alt-90d2e4ee6d45f3dc3e906c41fca35f2e.webp',
          rating: 4.4,
          fans: 820,
          type: 'supporting',
        },
        {
          id: 8,
          name: 'Манба-сан',
          nameJp: 'マンバさん',
          role: 'Второстепенный персонаж',
          image:
            'https://desu.shikimori.one/uploads/poster/characters/238973/main_alt-9ee52deba71ae5fd4ef13aa2f2a3c89b.webp',
          rating: 4.1,
          fans: 590,
          type: 'supporting',
        },
      ],
    }
  },
  computed: {
    filteredCards() {
      if (this.currentFilter === 'all') {
        return this.cards
      }
      return this.cards.filter((card) => card.type === this.currentFilter)
    },
  },
}
</script>

<style scoped>
.anime-cards {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.cards-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.cards-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.cards-filter {
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px;
  border-radius: 12px;
}

.filter-btn {
  padding: 8px 16px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.filter-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}

.filter-btn.active {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.character-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
}

.character-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 30px rgba(255, 65, 108, 0.2);
}

.card-image {
  position: relative;
  width: 100%;
  padding-bottom: 140%;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255, 65, 108, 0.1), rgba(76, 39, 94, 0.1));
}

.card-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s;
}

.character-card:hover .card-image img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  display: flex;
  align-items: flex-end;
  padding: 12px;
  opacity: 0;
  transition: all 0.3s;
}

.character-card:hover .card-overlay {
  opacity: 1;
}

.card-role {
  font-size: 12px;
  font-weight: 600;
  color: white;
  background: rgba(255, 65, 108, 0.8);
  padding: 4px 10px;
  border-radius: 6px;
}

.card-content {
  padding: 16px;
}

.card-name {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px;
  color: white;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-name-jp {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 12px;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  width: 14px;
  height: 14px;
  color: rgba(255, 193, 7, 0.3);
}

.star.filled {
  color: #ffc107;
}

.rating-text {
  font-size: 12px;
  font-weight: 600;
  color: #ffc107;
}

.card-stats {
  display: flex;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.stat-icon {
  width: 16px;
  height: 16px;
  color: rgba(255, 65, 108, 0.8);
}

.empty-cards {
  text-align: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 16px;
}

.empty-cards h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px;
  color: white;
}

.empty-cards p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

/* Адаптив */
@media (max-width: 968px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .cards-header {
    flex-direction: column;
    align-items: stretch;
  }

  .cards-title {
    font-size: 20px;
  }

  .cards-filter {
    width: 100%;
    justify-content: center;
  }

  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }

  .card-content {
    padding: 12px;
  }

  .card-name {
    font-size: 14px;
  }

  .card-name-jp {
    font-size: 11px;
  }

  .empty-cards {
    padding: 40px 16px;
  }
}

@media (max-width: 480px) {
  .cards-title {
    font-size: 18px;
  }

  .filter-btn {
    padding: 6px 12px;
    font-size: 13px;
  }

  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .card-content {
    padding: 10px;
  }

  .card-name {
    font-size: 13px;
  }

  .card-rating {
    margin-bottom: 8px;
  }

  .stars {
    gap: 1px;
  }

  .star {
    width: 12px;
    height: 12px;
  }

  .rating-text {
    font-size: 11px;
  }

  .stat-item {
    font-size: 11px;
  }

  .stat-icon {
    width: 14px;
    height: 14px;
  }

  .empty-icon {
    font-size: 48px;
  }

  .empty-cards h3 {
    font-size: 18px;
  }
}
</style>
