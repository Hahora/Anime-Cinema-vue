<template>
  <div class="anime-card" @click="openAnime">
    <div class="card-image">
      <div class="image-wrapper">
        <img :src="anime.poster || '/placeholder.jpg'" :alt="anime.title" loading="lazy" />
        <div class="image-gradient"></div>
      </div>

      <!-- Бейдж рейтинга -->
      <div class="rating-badge" v-if="anime.rating">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
        <span>{{ anime.rating }}</span>
      </div>

      <!-- Бейдж статуса -->
      <div class="status-badge" :class="statusClass">
        <span class="status-dot"></span>
        {{ statusText }}
      </div>

      <!-- Hover оверлей -->
      <div class="card-hover-overlay">
        <div class="play-button">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div class="hover-info">
          <p class="hover-title">{{ anime.title }}</p>
          <div class="hover-meta" v-if="anime.episodes || anime.year">
            <span v-if="anime.episodes">{{ anime.episodes }} эп.</span>
            <span v-if="anime.year">{{ anime.year }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card-content">
      <h3 class="card-title" :title="anime.title">{{ anime.title }}</h3>

      <div class="card-meta">
        <span v-if="anime.year" class="meta-item">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"
            />
          </svg>
          {{ anime.year }}
        </span>
        <span v-if="anime.type" class="meta-item">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z"
            />
          </svg>
          {{ anime.type }}
        </span>
      </div>

      <div class="card-genres" v-if="anime.genres && anime.genres.length">
        <span v-for="g in anime.genres.slice(0, 2)" :key="g" class="genre-tag">
          {{ g }}
        </span>
        <span v-if="anime.genres.length > 2" class="genre-more">
          +{{ anime.genres.length - 2 }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnimeCard',
  props: {
    anime: {
      type: Object,
      required: true,
    },
  },
  computed: {
    statusClass() {
      const status = this.anime.status?.toLowerCase()
      if (status?.includes('онгоинг') || status?.includes('ongoing')) return 'status-ongoing'
      if (status?.includes('анонс') || status?.includes('announced')) return 'status-announced'
      return 'status-released'
    },
    statusText() {
      const status = this.anime.status
      if (!status) return ''
      if (status.includes('онгоинг') || status.includes('ongoing')) return 'Онгоинг'
      if (status.includes('анонс') || status.includes('announced')) return 'Анонс'
      return 'Завершён'
    },
  },
  methods: {
    openAnime() {
      this.$router.push(`/anime/${this.anime.id}`)
    },
  },
}
</script>

<style scoped>
/* ═══════════════════════════════════════════ */
/* ОПТИМИЗАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ */
/* ═══════════════════════════════════════════ */

.anime-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);

  /* КРИТИЧЕСКИ ВАЖНО ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ */
  contain: layout style paint; /* Изолирует карточку от остальной страницы */
  will-change: transform; /* GPU acceleration */
  transform: translateZ(0); /* Force GPU layer */
  backface-visibility: hidden; /* Prevent flickering */
}

/* Убрали backdrop-filter — он очень тяжелый! */

/* Упростили hover эффект */
.anime-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 65, 108, 0.2), rgba(255, 75, 43, 0.2));
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.anime-card:hover::before {
  opacity: 1;
}

.anime-card:hover {
  transform: translateY(-4px) translateZ(0); /* Уменьшили смещение */
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

/* ═══════════════════════════════════════════ */
/* ИЗОБРАЖЕНИЕ */
/* ═══════════════════════════════════════════ */
.card-image {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: #0a0a0a; /* Простой цвет вместо градиента */
  contain: strict; /* Максимальная изоляция */
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  will-change: transform;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
  will-change: transform;
  transform: translateZ(0);
}

.anime-card:hover .card-image img {
  transform: scale(1.05) translateZ(0); /* Уменьшили scale */
}

.image-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.3) 40%,
    transparent 70%
  );
  pointer-events: none;
}

/* ═══════════════════════════════════════════ */
/* БЕЙДЖИ */
/* ═══════════════════════════════════════════ */
.rating-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: rgba(255, 193, 7, 0.95);
  color: #000;
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
  z-index: 2;
  will-change: transform;
  transform: translateZ(0);
}

.rating-badge svg {
  width: 14px;
  height: 14px;
}

.status-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  will-change: transform;
  transform: translateZ(0);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  /* Убрали анимацию — она лагает при скролле */
}

.status-ongoing {
  background: rgba(76, 175, 80, 0.95);
  color: white;
}

.status-ongoing .status-dot {
  background: #c8e6c9;
}

.status-announced {
  background: rgba(33, 150, 243, 0.95);
  color: white;
}

.status-announced .status-dot {
  background: #bbdefb;
}

.status-released {
  background: rgba(158, 158, 158, 0.95);
  color: white;
}

.status-released .status-dot {
  background: #e0e0e0;
}

/* ═══════════════════════════════════════════ */
/* HOVER ОВЕРЛЕЙ */
/* ═══════════════════════════════════════════ */
.card-hover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.6) 50%,
    rgba(0, 0, 0, 0.3) 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.25s ease;
  z-index: 1;
  will-change: opacity;
  pointer-events: none;
}

.anime-card:hover .card-hover-overlay {
  opacity: 1;
  pointer-events: auto;
}

.play-button {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(255, 65, 108, 0.4);
  transform: scale(0.95) translateZ(0);
  transition: transform 0.25s ease;
  will-change: transform;
}

.anime-card:hover .play-button {
  transform: scale(1) translateZ(0);
}

.play-button svg {
  width: 28px;
  height: 28px;
  color: white;
  margin-left: 3px;
}

.hover-info {
  text-align: center;
  padding: 0 16px;
  max-width: 100%;
}

.hover-title {
  font-size: 15px;
  font-weight: 600;
  color: white;
  margin: 0 0 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hover-meta {
  display: flex;
  justify-content: center;
  gap: 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.hover-meta span {
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 6px;
}

/* ═══════════════════════════════════════════ */
/* КОНТЕНТ */
/* ═══════════════════════════════════════════ */
.card-content {
  padding: 16px;
  contain: layout style;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 10px;
  color: white;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;
}

.card-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
}

.meta-item svg {
  width: 14px;
  height: 14px;
  opacity: 0.7;
}

.card-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.genre-tag {
  font-size: 11px;
  padding: 4px 10px;
  background: rgba(255, 65, 108, 0.12);
  color: #ff6b9d;
  border-radius: 6px;
  border: 1px solid rgba(255, 65, 108, 0.25);
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.genre-tag:hover {
  background: rgba(255, 65, 108, 0.2);
}

.genre-more {
  font-size: 11px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
  font-weight: 600;
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */

@media (max-width: 768px) {
  .card-image {
    height: 240px;
  }

  .card-title {
    font-size: 14px;
    min-height: 40px;
  }

  .play-button {
    width: 56px;
    height: 56px;
  }

  .play-button svg {
    width: 24px;
    height: 24px;
  }

  .hover-title {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .card-image {
    height: 220px;
  }

  .rating-badge,
  .status-badge {
    top: 10px;
    padding: 5px 8px;
    font-size: 11px;
  }

  .rating-badge {
    right: 10px;
  }

  .status-badge {
    left: 10px;
  }

  .rating-badge svg {
    width: 12px;
    height: 12px;
  }

  .card-content {
    padding: 14px;
  }

  .card-title {
    font-size: 13px;
    min-height: 38px;
  }

  .meta-item {
    font-size: 11px;
    padding: 3px 7px;
  }

  .meta-item svg {
    width: 12px;
    height: 12px;
  }

  .genre-tag {
    font-size: 10px;
    padding: 3px 8px;
  }

  .genre-more {
    font-size: 10px;
    padding: 3px 6px;
  }

  .play-button {
    width: 48px;
    height: 48px;
  }

  .play-button svg {
    width: 20px;
    height: 20px;
  }

  .hover-title {
    font-size: 13px;
  }

  .hover-meta {
    font-size: 11px;
  }
}

@media (max-width: 360px) {
  .card-image {
    height: 200px;
  }

  .card-title {
    font-size: 12px;
  }
}
</style>
