<template>
  <div class="anime-card" @click="openAnime">
    <div class="card-image">
      <img :src="anime.poster || '/placeholder.jpg'" :alt="anime.title" />
      <div class="card-overlay">
        <div class="rating" v-if="anime.rating">⭐ {{ anime.rating }}</div>
        <div class="status" :class="statusClass">
          {{ statusText }}
        </div>
      </div>
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ anime.title }}</h3>
      <div class="card-meta">
        <span v-if="anime.year">{{ anime.year }}</span>
        <span v-if="anime.type">{{ anime.type }}</span>
      </div>
      <div class="card-genres" v-if="anime.genres && anime.genres.length">
        <span v-for="g in anime.genres.slice(0, 3)" :key="g" class="genre-tag">
          {{ g }}
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
      if (status.includes('онгоинг') || status.includes('ongoing')) return 'Выходит'
      if (status.includes('анонс') || status.includes('announced')) return 'Анонс'
      return 'Вышло'
    },
  },
  methods: {
    // ✅ Добавили метод роутинга
    openAnime() {
      this.$router.push(`/anime/${this.anime.id}`)
    },
  },
}
</script>

<style scoped>
.anime-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.anime-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(255, 65, 108, 0.2);
  border-color: rgba(255, 65, 108, 0.3);
}

.card-image {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.anime-card:hover .card-image img {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent 60%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
  opacity: 0;
  transition: opacity 0.3s;
}

.anime-card:hover .card-overlay {
  opacity: 1;
}

.rating {
  align-self: flex-end;
  background: rgba(255, 193, 7, 0.9);
  color: #000;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
}

.status {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  align-self: flex-start;
}

.status-ongoing {
  background: rgba(76, 175, 80, 0.9);
  color: white;
}

.status-announced {
  background: rgba(33, 150, 243, 0.9);
  color: white;
}

.status-released {
  background: rgba(158, 158, 158, 0.9);
  color: white;
}

.card-content {
  padding: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
  color: white;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: 10px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 10px;
}

.card-meta span {
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 10px;
  border-radius: 6px;
}

.card-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.genre-tag {
  font-size: 11px;
  padding: 4px 10px;
  background: rgba(255, 65, 108, 0.15);
  color: #ff416c;
  border-radius: 6px;
  border: 1px solid rgba(255, 65, 108, 0.3);
}
</style>
