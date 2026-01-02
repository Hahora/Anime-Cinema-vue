<template>
  <div class="anime-details">
    <!-- Заголовок и рейтинг -->
    <div class="details-header">
      <div class="header-titles">
        <h1 class="anime-title">{{ anime.title }}</h1>
        <p class="anime-title-orig" v-if="anime.title_orig">{{ anime.title_orig }}</p>
      </div>
      <div class="anime-rating" v-if="anime.rating">
        <div class="rating-star">⭐</div>
        <div class="rating-info">
          <span class="rating-value">{{ anime.rating }}</span>
          <span class="rating-label">Shikimori</span>
        </div>
      </div>
    </div>

    <!-- Мета-информация -->
    <div class="anime-meta">
      <div class="meta-item">
        <div class="meta-icon">
          <IconFilm :size="20" />
        </div>
        <div class="meta-content">
          <span class="meta-label">Тип</span>
          <span class="meta-value">{{ anime.type }}</span>
        </div>
      </div>

      <div class="meta-item" v-if="anime.year">
        <div class="meta-icon">
          <IconCalendar :size="20" />
        </div>
        <div class="meta-content">
          <span class="meta-label">Год</span>
          <span class="meta-value">{{ anime.year }}</span>
        </div>
      </div>

      <div class="meta-item" v-if="anime.status">
        <div class="meta-icon">
          <IconCheckCircle :size="20" />
        </div>
        <div class="meta-content">
          <span class="meta-label">Статус</span>
          <span class="meta-value">{{ anime.status }}</span>
        </div>
      </div>

      <div class="meta-item" v-if="anime.episodes_count">
        <div class="meta-icon">
          <IconList :size="20" />
        </div>
        <div class="meta-content">
          <span class="meta-label">Эпизодов</span>
          <span class="meta-value">
            {{ anime.episodes_aired || anime.episodes_count }}
            <span class="meta-total">/ {{ anime.episodes_count }}</span>
          </span>
        </div>
      </div>

      <div class="meta-item" v-if="anime.duration">
        <div class="meta-icon">
          <IconClock :size="20" />
        </div>
        <div class="meta-content">
          <span class="meta-label">Длительность</span>
          <span class="meta-value">{{ anime.duration }} мин</span>
        </div>
      </div>
    </div>

    <!-- Разделитель -->
    <div class="divider"></div>

    <!-- Основная информация -->
    <div class="details-sections">
      <!-- Описание -->
      <div class="details-section">
        <h3 class="section-header">
          <IconFileText :size="20" class="section-icon" />
          Описание
        </h3>
        <p class="description-text" v-if="anime.description">{{ anime.description }}</p>
        <p class="no-data" v-else>Описание отсутствует</p>
      </div>

      <!-- Жанры -->
      <div class="details-section" v-if="anime.genres && anime.genres.length">
        <h3 class="section-header">
          <IconTags :size="20" class="section-icon" />
          Жанры
        </h3>
        <div class="genres-list">
          <span v-for="genre in anime.genres" :key="genre" class="genre-badge">
            {{ genre }}
          </span>
        </div>
      </div>

      <!-- Студия и производство -->
      <div class="details-section" v-if="anime.studios">
        <h3 class="section-header">
          <IconBuilding :size="20" class="section-icon" />
          Студия
        </h3>
        <p class="info-text">{{ anime.studios }}</p>
      </div>

      <!-- Следующий эпизод -->
      <div class="next-episode-card" v-if="anime.next_episode_at">
        <div class="next-episode-icon">📅</div>
        <div class="next-episode-content">
          <h4>Следующий эпизод</h4>
          <p>{{ formatDate(anime.next_episode_at) }}</p>
        </div>
      </div>
    </div>

    <!-- Дополнительная информация -->
    <div class="additional-info" v-if="anime.age_rating || anime.source || anime.season">
      <h3 class="section-header">
        <IconInfo :size="20" class="section-icon" />
        Дополнительная информация
      </h3>
      <div class="info-grid">
        <div class="info-item" v-if="anime.age_rating">
          <span class="info-label">Возрастной рейтинг:</span>
          <span class="info-value">{{ anime.age_rating }}</span>
        </div>
        <div class="info-item" v-if="anime.source">
          <span class="info-label">Источник:</span>
          <span class="info-value">{{ anime.source }}</span>
        </div>
        <div class="info-item" v-if="anime.season">
          <span class="info-label">Сезон:</span>
          <span class="info-value">{{ anime.season }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnimeDetails',
  props: {
    anime: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
      return date.toLocaleDateString('ru-RU', options)
    },
  },
}
</script>

<style scoped>
.anime-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Заголовок и рейтинг */
.details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 8px;
}

.header-titles {
  flex: 1;
  min-width: 0;
}

.anime-title {
  font-size: clamp(24px, 5vw, 32px);
  font-weight: 800;
  margin: 0 0 8px;
  color: white;
  line-height: 1.2;
  word-break: break-word;
}

.anime-title-orig {
  font-size: clamp(14px, 3vw, 16px);
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-weight: 500;
}

.anime-rating {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: rgba(255, 193, 7, 0.1);
  border: 2px solid rgba(255, 193, 7, 0.3);
  border-radius: 16px;
  flex-shrink: 0;
}

.rating-star {
  font-size: 32px;
  line-height: 1;
}

.rating-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rating-value {
  font-size: 22px;
  font-weight: 800;
  color: #ffc107;
  line-height: 1;
}

.rating-label {
  font-size: 11px;
  color: rgba(255, 193, 7, 0.8);
  text-transform: uppercase;
  font-weight: 600;
}

/* Мета-информация */
.anime-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s;
  min-width: 0;
}

.meta-item:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
}

.meta-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 65, 108, 0.1);
  border-radius: 10px;
  flex-shrink: 0;
}

.meta-icon {
  color: #ff416c; /* Цвет для всех иконок внутри */
}

.meta-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.meta-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.meta-value {
  font-size: 15px;
  font-weight: 700;
  color: white;
  word-break: break-word;
}

.meta-total {
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
}

/* Разделитель */
.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.05);
  margin: 8px 0;
}

/* Секции с описанием */
.details-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.details-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 16px;
  color: white;
}

.section-icon {
  color: #ff416c;
  flex-shrink: 0;
}

.description-text {
  font-size: 15px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.no-data {
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
  margin: 0;
}

.genres-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.genre-badge {
  padding: 8px 16px;
  background: rgba(255, 65, 108, 0.1);
  border: 1px solid rgba(255, 65, 108, 0.3);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #ff416c;
  transition: all 0.3s;
}

.genre-badge:hover {
  background: rgba(255, 65, 108, 0.2);
  border-color: rgba(255, 65, 108, 0.5);
  transform: translateY(-2px);
}

.info-text {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.next-episode-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(56, 142, 60, 0.15));
  border: 2px solid rgba(76, 175, 80, 0.3);
  border-radius: 16px;
  padding: 20px;
}

.next-episode-icon {
  font-size: 32px;
  line-height: 1;
  flex-shrink: 0;
}

.next-episode-content h4 {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 6px;
  color: #4caf50;
}

.next-episode-content p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.additional-info {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
}

.info-grid {
  display: grid;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: white;
  font-weight: 600;
}

/* Адаптив */
@media (max-width: 768px) {
  .anime-details {
    gap: 16px;
  }

  .details-header {
    flex-direction: column;
    gap: 16px;
  }

  .anime-rating {
    align-self: flex-start;
    padding: 12px 16px;
  }

  .rating-star {
    font-size: 28px;
  }

  .rating-value {
    font-size: 20px;
  }

  .anime-meta {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .details-sections {
    gap: 16px;
  }

  .details-section {
    padding: 16px;
    border-radius: 14px;
  }

  .section-header {
    font-size: 16px;
    margin-bottom: 12px;
  }

  .description-text {
    font-size: 14px;
    line-height: 1.6;
  }

  .genres-list {
    gap: 6px;
  }

  .genre-badge {
    padding: 6px 12px;
    font-size: 12px;
  }

  .next-episode-icon {
    font-size: 28px;
  }

  .additional-info {
    padding: 16px;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 10px 0;
  }
}

@media (max-width: 480px) {
  .anime-title {
    font-size: 20px;
  }

  .anime-title-orig {
    font-size: 13px;
  }

  .anime-rating {
    padding: 10px 14px;
  }

  .rating-star {
    font-size: 24px;
  }

  .rating-value {
    font-size: 18px;
  }

  .anime-meta {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .meta-item {
    padding: 10px;
  }

  .meta-icon {
    width: 32px;
    height: 32px;
  }

  .details-section {
    padding: 12px;
  }

  .section-header {
    font-size: 15px;
    margin-bottom: 10px;
  }

  .description-text {
    font-size: 13px;
  }

  .genre-badge {
    padding: 5px 10px;
    font-size: 11px;
  }

  .next-episode-icon {
    font-size: 24px;
  }

  .next-episode-content h4 {
    font-size: 14px;
  }

  .next-episode-content p {
    font-size: 12px;
  }

  .additional-info {
    padding: 12px;
  }
}
</style>
