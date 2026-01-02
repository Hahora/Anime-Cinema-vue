<template>
  <div class="cards-collection">
    <div class="collection-header">
      <h2 class="collection-title">
        <svg viewBox="0 0 24 24" class="section-icon">
          <path
            d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
            fill="currentColor"
          />
        </svg>
        {{ isOwnProfile ? 'Моя коллекция карт' : 'Коллекция карт пользователя' }}
        <span v-if="cards.length > 0" class="cards-count">{{ cards.length }}</span>
      </h2>
      <router-link v-if="isOwnProfile" to="/cards" class="view-all-btn">
        Показать все →
      </router-link>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Загрузка коллекции карт...</p>
    </div>

    <div v-else-if="cards.length" class="cards-grid">
      <div
        v-for="card in cards.slice(0, 12)"
        :key="card.id"
        class="card-item"
        @click="openCardDetails(card)"
      >
        <div class="card-image">
          <img :src="card.image_url" :alt="card.name" />
          <div class="card-rank" :class="`rank-${card.rank.toLowerCase()}`">
            {{ card.rank }}
          </div>
          <div v-if="card.is_upgradeable" class="upgrade-indicator">
            <svg viewBox="0 0 24 24" class="upgrade-arrow">
              <path d="M7 14l5-5 5 5z" fill="currentColor" />
            </svg>
          </div>
        </div>
        <div class="card-info">
          <h3 class="card-name">{{ card.name }}</h3>
          <p class="card-anime">{{ card.anime_title }}</p>
          <div class="card-stats">
            <div class="stat-item">
              <span class="stat-label">Уровень</span>
              <span class="stat-value">{{ card.level }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Опыт</span>
              <span class="stat-value">{{ card.experience }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">🃏</div>
      <h3>{{ isOwnProfile ? 'Коллекция карт пуста' : 'У пользователя нет карт' }}</h3>
      <p>
        {{
          isOwnProfile
            ? 'Начните собирать карты, просматривая аниме'
            : 'Здесь будут отображаться карты пользователя'
        }}
      </p>
    </div>
  </div>
</template>

<script>
import { animeApi } from '@/api/animeApi'

export default {
  name: 'ProfileCardsCollection',
  props: {
    userId: {
      type: Number,
      required: true,
    },
    isOwnProfile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      cards: [],
      loading: false,
    }
  },
  mounted() {
    this.loadCards()
  },
  watch: {
    userId() {
      this.loadCards()
    },
  },
  methods: {
    async loadCards() {
      this.loading = true
      try {
        if (this.isOwnProfile) {
          this.cards = await animeApi.getUserCards()
        } else {
          this.cards = await animeApi.getUserCards(this.userId)
        }
      } catch (err) {
        console.error('Ошибка загрузки карт:', err)
      } finally {
        this.loading = false
      }
    },

    openCardDetails(card) {
      // Открываем детали карты
      this.$router.push(`/cards/${card.id}`)
    },
  },
}
</script>

<style scoped>
.cards-collection {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
}

.collection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.collection-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.section-icon {
  width: 28px;
  height: 28px;
  color: #ff416c;
}

.cards-count {
  padding: 4px 12px;
  background: rgba(255, 65, 108, 0.2);
  border-radius: 20px;
  font-size: 16px;
  font-weight: 700;
  color: #ff416c;
}

.view-all-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.view-all-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.6);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 65, 108, 0.3);
  border-top: 3px solid #ff416c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.card-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.card-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 65, 108, 0.3);
  transform: translateY(-4px);
}

.card-image {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-rank {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.card-rank.rank-e {
  color: #9e9e9e;
}
.card-rank.rank-d {
  color: #8d6e63;
}
.card-rank.rank-c {
  color: #7cb342;
}
.card-rank.rank-b {
  color: #29b6f6;
}
.card-rank.rank-a {
  color: #ab47bc;
}
.card-rank.rank-s {
  color: #ffa726;
}
.card-rank.rank-ss {
  color: #ff7043;
}
.card-rank.rank-sss {
  color: #f44336;
}

.upgrade-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: rgba(76, 175, 80, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse-upgrade 2s ease-in-out infinite;
}

@keyframes pulse-upgrade {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(76, 175, 80, 0);
  }
}

.upgrade-arrow {
  width: 14px;
  height: 14px;
  color: white;
}

.card-info {
  padding: 16px;
}

.card-name {
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-anime {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-stats {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  font-weight: 600;
}

.stat-value {
  font-size: 14px;
  font-weight: 700;
  color: #ff416c;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px;
  color: white;
}

.empty-state p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }

  .collection-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
