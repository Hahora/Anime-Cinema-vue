<template>
  <div class="anime-reviews">
    <div class="reviews-header">
      <h3 class="reviews-title">Отзывы зрителей</h3>
      <button class="add-review-btn" @click="showAddReview = true">
        <svg viewBox="0 0 24 24" class="btn-icon">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
        </svg>
        Написать отзыв
      </button>
    </div>

    <!-- Список отзывов -->
    <div class="reviews-list" v-if="reviews && reviews.length">
      <div v-for="review in reviews" :key="review.id" class="review-card">
        <div class="review-header">
          <div class="user-info">
            <div class="user-avatar">
              {{ review.userName ? review.userName[0].toUpperCase() : 'A' }}
            </div>
            <div class="user-details">
              <h4 class="user-name">{{ review.userName || 'Аноним' }}</h4>
              <span class="review-date">{{ formatDate(review.date) }}</span>
            </div>
          </div>
          <div class="review-rating">
            <div class="stars">
              <svg
                v-for="i in 5"
                :key="i"
                viewBox="0 0 24 24"
                class="star"
                :class="{ filled: i <= review.rating }"
              >
                <path
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span class="rating-value">{{ review.rating }}/5</span>
          </div>
        </div>
        <p class="review-text">{{ review.text }}</p>
        <div class="review-actions">
          <button class="action-btn">
            <svg viewBox="0 0 24 24" class="action-icon">
              <path
                d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
                fill="currentColor"
              />
            </svg>
            <span>{{ review.likes || 0 }}</span>
          </button>
          <button class="action-btn">
            <svg viewBox="0 0 24 24" class="action-icon">
              <path
                d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"
                fill="currentColor"
              />
            </svg>
            <span>Ответить</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div class="empty-state" v-else>
      <div class="empty-icon">💬</div>
      <h3>Отзывов пока нет</h3>
      <p>Станьте первым, кто оставит отзыв об этом аниме!</p>
      <button class="add-review-btn" @click="showAddReview = true">Написать отзыв</button>
    </div>

    <!-- Форма добавления отзыва (модальное окно) -->
    <transition name="modal-fade">
      <div v-if="showAddReview" class="modal-overlay" @click="showAddReview = false">
        <div class="modal-content" @click.stop>
          <h3>Написать отзыв</h3>
          <p class="modal-subtitle">Поделитесь своим мнением об этом аниме</p>
          <!-- Форма будет добавлена позже -->
          <button @click="showAddReview = false" class="close-btn">Закрыть</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AnimeReviews',
  props: {
    animeId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      reviews: [
        // Пример данных
        {
          id: 1,
          userName: 'Александр',
          rating: 5,
          text: 'Потрясающее аниме! Сюжет держит в напряжении до последней серии. Анимация на высшем уровне, а персонажи очень проработаны.',
          date: new Date(),
          likes: 12,
        },
        {
          id: 2,
          userName: 'Мария',
          rating: 4,
          text: 'Очень понравилось, но концовка немного разочаровала. В целом рекомендую к просмотру!',
          date: new Date(Date.now() - 86400000),
          likes: 8,
        },
      ],
      showAddReview: false,
    }
  },
  methods: {
    formatDate(date) {
      const now = new Date()
      const diff = now - date
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))

      if (days === 0) return 'Сегодня'
      if (days === 1) return 'Вчера'
      if (days < 7) return `${days} дн. назад`

      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    },
  },
}
</script>

<style scoped>
.anime-reviews {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.reviews-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.add-review-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.add-review-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 65, 108, 0.4);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s;
}

.review-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  color: white;
}

.review-date {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  width: 16px;
  height: 16px;
  color: rgba(255, 193, 7, 0.3);
  transition: all 0.2s;
}

.star.filled {
  color: #ffc107;
}

.rating-value {
  font-size: 14px;
  font-weight: 600;
  color: #ffc107;
}

.review-text {
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 16px;
}

.review-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.action-icon {
  width: 16px;
  height: 16px;
}

/* Пустое состояние */
.empty-state {
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

.empty-state h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px;
  color: white;
}

.empty-state p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 24px;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.modal-content {
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px;
  max-width: 600px;
  width: 100%;
}

.modal-content h3 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px;
  color: white;
}

.modal-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 24px;
}

.close-btn {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Адаптив */
@media (max-width: 768px) {
  .reviews-header {
    flex-direction: column;
    align-items: stretch;
  }

  .reviews-title {
    font-size: 20px;
  }

  .add-review-btn {
    width: 100%;
    justify-content: center;
  }

  .review-card {
    padding: 16px;
  }

  .review-header {
    flex-direction: column;
    gap: 12px;
  }

  .review-rating {
    align-self: flex-start;
  }

  .empty-state {
    padding: 40px 16px;
  }

  .modal-content {
    padding: 24px;
  }
}

@media (max-width: 480px) {
  .reviews-title {
    font-size: 18px;
  }

  .add-review-btn {
    padding: 10px 16px;
    font-size: 13px;
  }

  .review-card {
    padding: 12px;
  }

  .user-avatar {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .user-name {
    font-size: 14px;
  }

  .review-text {
    font-size: 14px;
  }

  .empty-icon {
    font-size: 48px;
  }

  .empty-state h3 {
    font-size: 18px;
  }

  .modal-content {
    padding: 20px;
  }

  .modal-content h3 {
    font-size: 20px;
  }
}
</style>
