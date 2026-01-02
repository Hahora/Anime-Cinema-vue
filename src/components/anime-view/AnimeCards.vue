<template>
  <div class="anime-cards">
    <!-- Шапка с поиском -->
    <div class="cards-header">
      <div class="search-box">
        <IconSearch :size="20" class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск персонажа..."
          class="search-input"
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="clear-btn">
          <IconX :size="14" />
        </button>
      </div>
    </div>

    <!-- Фильтры по рангам -->
    <div class="rank-filters">
      <!-- Чекбокс "Можно улучшить" -->
      <div class="upgrade-filter">
        <label class="upgrade-checkbox">
          <input type="checkbox" v-model="showUpgradeable" />
          <span class="checkbox-custom"></span>
          <span class="checkbox-label">
            <IconArrowUp :size="18" class="upgrade-icon" />
            Можно улучшить
            <span class="upgrade-count">({{ upgradeableCount }})</span>
          </span>
        </label>
      </div>

      <div class="filter-section">
        <h4 class="filter-title">Базовые ранги</h4>
        <div class="filter-buttons">
          <button
            v-for="rank in basicRanks"
            :key="rank"
            @click="toggleRank(rank)"
            :class="[
              'rank-btn',
              `rank-${rank.toLowerCase()}`,
              { active: selectedRanks.includes(rank) },
            ]"
          >
            {{ rank }}
          </button>
        </div>
      </div>

      <div class="filter-section">
        <h4 class="filter-title">Анимированные ранги</h4>
        <div class="filter-buttons">
          <button
            v-for="rank in animatedRanks"
            :key="rank"
            @click="toggleRank(rank)"
            :class="[
              'rank-btn',
              `rank-${rank.toLowerCase().replace('+', 'plus')}`,
              'animated',
              { active: selectedRanks.includes(rank) },
            ]"
          >
            {{ rank }}
          </button>
        </div>
      </div>

      <div class="filter-actions">
        <button @click="selectAll" class="action-btn">
          <IconCheck :size="16" class="btn-icon" />
          Все
        </button>
        <button @click="clearAll" class="action-btn">
          <IconX :size="16" class="btn-icon" />
          Сбросить
        </button>
      </div>
    </div>

    <!-- Счетчик -->
    <div class="results-info" v-if="filteredCards.length || searchQuery">
      <span class="results-count">
        Найдено: <strong>{{ filteredCards.length }}</strong> из {{ cards.length }}
      </span>
    </div>

    <!-- Сетка карточек -->
    <div class="cards-grid" v-if="filteredCards.length">
      <div v-for="card in filteredCards" :key="card.id" class="character-card">
        <div class="card-image">
          <img :src="card.image" :alt="card.name" />
          <div
            class="card-rank"
            :class="[
              `rank-${card.rank.toLowerCase().replace('+', 'plus')}`,
              { upgradeable: card.canUpgrade },
            ]"
          >
            {{ card.rank }}
            <IconArrowUp :size="14" class="upgrade-arrow" />
          </div>
        </div>
        <div class="card-content">
          <h4 class="card-name">{{ card.name }}</h4>
          <p class="card-name-jp" v-if="card.nameJp">{{ card.nameJp }}</p>
          <div class="card-stats">
            <div class="stat-item">
              <IconStar :size="14" class="stat-icon" />
              <span>{{ card.rating }}</span>
            </div>
            <div class="stat-item">
              <IconUsers :size="14" class="stat-icon" />
              <span>{{ card.fans }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div class="empty-cards" v-else>
      <div class="empty-icon">🔍</div>
      <h3>{{ searchQuery ? 'Персонажи не найдены' : 'Выберите ранг' }}</h3>
      <p>
        {{
          searchQuery
            ? 'Попробуйте изменить запрос'
            : 'Выберите один или несколько рангов для отображения карточек'
        }}
      </p>
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
      searchQuery: '',
      selectedRanks: [],
      showUpgradeable: false,
      basicRanks: ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'],
      animatedRanks: ['E+', 'D+', 'C+', 'B+', 'A+', 'S+', 'SS+', 'SSS+'],
      cards: [
        // Пример данных с разными рангами
        {
          id: 1,
          name: 'Момо Аясэ',
          nameJp: '綾瀬 桃',
          rank: 'SSS',
          canUpgrade: true,
          image:
            'https://desu.shikimori.one/uploads/poster/characters/238966/main_alt-57a4acfe0f0fd0dd83bca0d8fe4dbeff.webp',
          rating: 9.8,
          fans: 15200,
        },
        {
          id: 2,
          name: 'Кэн Такакура',
          nameJp: '高倉 健',
          rank: 'SSS',
          canUpgrade: false,
          image:
            'https://desu.shikimori.one/uploads/poster/characters/238967/main_alt-3485a3c2c5d4ad7f28fa8652303dbd41.webp',
          rating: 9.9,
          fans: 16800,
        },
        {
          id: 3,
          name: 'Аира Сиратори',
          nameJp: '白鳥 愛羅',
          rank: 'SS',
          canUpgrade: true,
          image:
            'https://desu.shikimori.one/uploads/poster/characters/238968/main_alt-9c8d71cef1d4775d3e5ca3293d5e56f8.webp',
          rating: 8.5,
          fans: 8900,
        },
        {
          id: 4,
          name: 'Дзин Эндзодзи',
          nameJp: '円城寺 仁',
          rank: 'S',
          canUpgrade: true,
          image:
            'https://desu.shikimori.one/uploads/poster/characters/238969/main_alt-f062f8c78a92ec36a20ef6ca98f5b68b.webp',
          rating: 7.3,
          fans: 7500,
        },
        {
          id: 5,
          name: 'Сэйко Аясэ',
          nameJp: '綾瀬 聖子',
          rank: 'A+',
          canUpgrade: false,
          image:
            'https://desu.shikimori.one/uploads/poster/characters/238970/main_alt-8aae69be5bdff1e4fcc9d2bcc95cb4c9.webp',
          rating: 8.7,
          fans: 11200,
        },
        {
          id: 6,
          name: 'Кинта Сакарука',
          nameJp: '鮫皮 金太',
          rank: 'A',
          canUpgrade: true,
          image:
            'https://desu.shikimori.one/uploads/poster/characters/238971/main_alt-6e6d9aa8b4a39efe69c2aecb94c54aab.webp',
          rating: 7.2,
          fans: 6800,
        },
        {
          id: 7,
          name: 'Вамоно Кондзё',
          nameJp: '金城 ワモノ',
          rank: 'B+',
          canUpgrade: false,
          image:
            'https://desu.shikimori.one/uploads/poster/characters/238972/main_alt-90d2e4ee6d45f3dc3e906c41fca35f2e.webp',
          rating: 6.4,
          fans: 5200,
        },
        {
          id: 8,
          name: 'Манба-сан',
          nameJp: 'マンバさん',
          rank: 'B',
          canUpgrade: false,
          image:
            'https://desu.shikimori.one/uploads/poster/characters/238973/main_alt-9ee52deba71ae5fd4ef13aa2f2a3c89b.webp',
          rating: 6.1,
          fans: 4900,
        },
        {
          id: 9,
          name: 'Турбо-Бабка',
          nameJp: 'ターボ・ババア',
          rank: 'SS+',
          canUpgrade: false,
          image:
            'https://desu.shikimori.one/uploads/poster/characters/238974/main_alt-8c3d71cef1d4775d3e5ca3293d5e56f8.webp',
          rating: 9.2,
          fans: 13500,
        },
        {
          id: 10,
          name: 'Акробатическая Сильфа',
          nameJp: 'アクロバティックサラサラ',
          rank: 'S+',
          canUpgrade: false,
          image:
            'https://desu.shikimori.one/uploads/poster/characters/238975/main_alt-7c3d71cef1d4775d3e5ca3293d5e56f8.webp',
          rating: 8.3,
          fans: 9200,
        },
        {
          id: 11,
          name: 'Персонаж C',
          nameJp: 'キャラクター C',
          rank: 'C',
          canUpgrade: true,
          image:
            'https://desu.shikimori.one/uploads/poster/characters/238976/main_alt-6c3d71cef1d4775d3e5ca3293d5e56f8.webp',
          rating: 5.5,
          fans: 3200,
        },
        {
          id: 12,
          name: 'Персонаж D+',
          nameJp: 'キャラクター D+',
          rank: 'D+',
          canUpgrade: false,
          image:
            'https://desu.shikimori.one/uploads/poster/characters/238977/main_alt-5c3d71cef1d4775d3e5ca3293d5e56f8.webp',
          rating: 4.8,
          fans: 2100,
        },
      ],
    }
  },
  computed: {
    filteredCards() {
      let result = this.cards

      // Фильтр по рангам
      if (this.selectedRanks.length > 0) {
        result = result.filter((card) => this.selectedRanks.includes(card.rank))
      }

      // Фильтр "Можно улучшить"
      if (this.showUpgradeable) {
        result = result.filter((card) => card.canUpgrade)
      }

      // Поиск
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(
          (card) =>
            card.name.toLowerCase().includes(query) ||
            (card.nameJp && card.nameJp.toLowerCase().includes(query)),
        )
      }

      return result
    },
    upgradeableCount() {
      return this.cards.filter((card) => card.canUpgrade).length
    },
  },
  methods: {
    toggleRank(rank) {
      const index = this.selectedRanks.indexOf(rank)
      if (index > -1) {
        this.selectedRanks.splice(index, 1)
      } else {
        this.selectedRanks.push(rank)
      }
    },
    selectAll() {
      this.selectedRanks = [...this.basicRanks, ...this.animatedRanks]
    },
    clearAll() {
      this.selectedRanks = []
    },
  },
}
</script>

<style scoped>
.anime-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Шапка с поиском */
.cards-header {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.4);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 46px 12px 46px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 65, 108, 0.5);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.clear-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  padding: 0;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.clear-btn:hover {
  background: rgba(255, 65, 108, 0.2);
  color: white;
}

/* Фильтры */
.rank-filters {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Чекбокс "Можно улучшить" */
.upgrade-filter {
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.upgrade-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.upgrade-checkbox input[type='checkbox'] {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  flex-shrink: 0;
  position: relative;
}

.checkbox-custom::after {
  content: '';
  width: 10px;
  height: 6px;
  border-left: 2px solid white;
  border-bottom: 2px solid white;
  transform: rotate(-45deg) scale(0);
  transition: all 0.3s;
}

.upgrade-checkbox input:checked + .checkbox-custom {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  border-color: #4caf50;
}

.upgrade-checkbox input:checked + .checkbox-custom::after {
  transform: rotate(-45deg) scale(1);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.upgrade-icon {
  color: #4caf50;
}

.upgrade-count {
  color: #4caf50;
  font-weight: 700;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-title {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.rank-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 48px;
}

.rank-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-2px);
}

.rank-btn.active {
  border-color: currentColor;
  color: white;
  transform: translateY(-2px);
}

/* Цвета рангов */
.rank-btn.rank-e {
  color: #9e9e9e;
}
.rank-btn.rank-d {
  color: #8d6e63;
}
.rank-btn.rank-c {
  color: #7cb342;
}
.rank-btn.rank-b {
  color: #29b6f6;
}
.rank-btn.rank-a {
  color: #ab47bc;
}
.rank-btn.rank-s {
  color: #ffa726;
}
.rank-btn.rank-ss {
  color: #ff7043;
}
.rank-btn.rank-sss {
  color: #f44336;
}

.rank-btn.rank-eplus {
  color: #9e9e9e;
  background: linear-gradient(135deg, rgba(158, 158, 158, 0.15), rgba(158, 158, 158, 0.05));
}
.rank-btn.rank-dplus {
  color: #8d6e63;
  background: linear-gradient(135deg, rgba(141, 110, 99, 0.15), rgba(141, 110, 99, 0.05));
}
.rank-btn.rank-cplus {
  color: #7cb342;
  background: linear-gradient(135deg, rgba(124, 179, 66, 0.15), rgba(124, 179, 66, 0.05));
}
.rank-btn.rank-bplus {
  color: #29b6f6;
  background: linear-gradient(135deg, rgba(41, 182, 246, 0.15), rgba(41, 182, 246, 0.05));
}
.rank-btn.rank-aplus {
  color: #ab47bc;
  background: linear-gradient(135deg, rgba(171, 71, 188, 0.15), rgba(171, 71, 188, 0.05));
}
.rank-btn.rank-splus {
  color: #ffa726;
  background: linear-gradient(135deg, rgba(255, 167, 38, 0.15), rgba(255, 167, 38, 0.05));
}
.rank-btn.rank-ssplus {
  color: #ff7043;
  background: linear-gradient(135deg, rgba(255, 112, 67, 0.15), rgba(255, 112, 67, 0.05));
}
.rank-btn.rank-sssplus {
  color: #f44336;
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.15), rgba(244, 67, 54, 0.05));
}

.rank-btn.active.rank-e,
.rank-btn.active.rank-eplus {
  background: rgba(158, 158, 158, 0.2);
  box-shadow: 0 4px 12px rgba(158, 158, 158, 0.3);
}
.rank-btn.active.rank-d,
.rank-btn.active.rank-dplus {
  background: rgba(141, 110, 99, 0.2);
  box-shadow: 0 4px 12px rgba(141, 110, 99, 0.3);
}
.rank-btn.active.rank-c,
.rank-btn.active.rank-cplus {
  background: rgba(124, 179, 66, 0.2);
  box-shadow: 0 4px 12px rgba(124, 179, 66, 0.3);
}
.rank-btn.active.rank-b,
.rank-btn.active.rank-bplus {
  background: rgba(41, 182, 246, 0.2);
  box-shadow: 0 4px 12px rgba(41, 182, 246, 0.3);
}
.rank-btn.active.rank-a,
.rank-btn.active.rank-aplus {
  background: rgba(171, 71, 188, 0.2);
  box-shadow: 0 4px 12px rgba(171, 71, 188, 0.3);
}
.rank-btn.active.rank-s,
.rank-btn.active.rank-splus {
  background: rgba(255, 167, 38, 0.2);
  box-shadow: 0 4px 12px rgba(255, 167, 38, 0.3);
}
.rank-btn.active.rank-ss,
.rank-btn.active.rank-ssplus {
  background: rgba(255, 112, 67, 0.2);
  box-shadow: 0 4px 12px rgba(255, 112, 67, 0.3);
}
.rank-btn.active.rank-sss,
.rank-btn.active.rank-sssplus {
  background: rgba(244, 67, 54, 0.2);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

/* Действия с фильтрами */
.filter-actions {
  display: flex;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

/* Счетчик результатов */
.results-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.results-count {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.results-count strong {
  color: #ff416c;
  font-weight: 700;
}

/* Сетка карточек */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.character-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
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

.card-rank {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s;
}

.card-rank.upgradeable {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.3), rgba(0, 0, 0, 0.8));
  border: 1px solid rgba(76, 175, 80, 0.5);
  animation: pulse-upgrade 2s ease-in-out infinite;
}

@keyframes pulse-upgrade {
  0%,
  100% {
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(76, 175, 80, 0.6);
  }
}

.upgrade-arrow {
  color: #4caf50;
  animation: bounce-arrow 1.5s ease-in-out infinite;
}

@keyframes bounce-arrow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
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
.card-rank.rank-eplus {
  color: #9e9e9e;
}
.card-rank.rank-dplus {
  color: #8d6e63;
}
.card-rank.rank-cplus {
  color: #7cb342;
}
.card-rank.rank-bplus {
  color: #29b6f6;
}
.card-rank.rank-aplus {
  color: #ab47bc;
}
.card-rank.rank-splus {
  color: #ffa726;
}
.card-rank.rank-ssplus {
  color: #ff7043;
}
.card-rank.rank-sssplus {
  color: #f44336;
}

.card-content {
  padding: 14px;
}

.card-name {
  font-size: 15px;
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
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 10px;
}

.card-stats {
  display: flex;
  gap: 12px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
}

.stat-icon {
  color: #ffc107;
}

.stat-item:last-child .stat-icon {
  color: #ff416c;
}

/* Пустое состояние */
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
    gap: 14px;
  }
}

@media (max-width: 768px) {
  .anime-cards {
    gap: 16px;
  }

  .rank-filters {
    padding: 16px;
  }

  .checkbox-label {
    font-size: 14px;
  }

  .filter-buttons {
    gap: 6px;
  }

  .rank-btn {
    padding: 6px 12px;
    font-size: 13px;
    min-width: 42px;
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

  .empty-cards {
    padding: 40px 16px;
  }
}

@media (max-width: 480px) {
  .search-input {
    padding: 10px 40px 10px 40px;
    font-size: 14px;
  }

  .rank-filters {
    padding: 12px;
  }

  .upgrade-filter {
    padding-bottom: 10px;
  }

  .checkbox-custom {
    width: 18px;
    height: 18px;
  }

  .checkbox-label {
    font-size: 13px;
  }

  .upgrade-icon {
    width: 14px;
    height: 14px;
  }

  .filter-title {
    font-size: 12px;
  }

  .rank-btn {
    padding: 5px 10px;
    font-size: 12px;
    min-width: 38px;
  }

  .action-btn {
    padding: 6px 10px;
    font-size: 12px;
  }

  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .card-rank {
    padding: 4px 8px;
    font-size: 12px;
  }

  .card-content {
    padding: 10px;
  }

  .card-name {
    font-size: 13px;
  }

  .card-name-jp {
    font-size: 10px;
  }

  .stat-item {
    font-size: 11px;
  }

  .empty-icon {
    font-size: 48px;
  }

  .empty-cards h3 {
    font-size: 18px;
  }

  .empty-cards p {
    font-size: 14px;
  }
}
</style>
