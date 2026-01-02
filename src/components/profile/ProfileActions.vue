<template>
  <div class="profile-actions">
    <div class="actions-header">
      <h2 class="actions-title">
        <IconStar :size="20" class="section-icon" />
        Активность
      </h2>
    </div>

    <div class="actions-list">
      <router-link to="/reviews" class="action-item reviews">
        <div class="action-icon">
          <IconMessageSquare :size="20" />
        </div>
        <div class="action-content">
          <h3 class="action-name">{{ isOwnProfile ? 'Мои отзывы' : 'Отзывы' }}</h3>
          <div class="action-count">{{ reviewsCount }}</div>
        </div>
      </router-link>

      <router-link to="/comments" class="action-item comments">
        <div class="action-icon">
          <IconMessagesSquare :size="20" />
        </div>
        <div class="action-content">
          <h3 class="action-name">{{ isOwnProfile ? 'Мои комментарии' : 'Комментарии' }}</h3>
          <div class="action-count">{{ commentsCount }}</div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { animeApi } from '@/api/animeApi'

export default {
  name: 'ProfileActions',
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
      reviewsCount: 0,
      commentsCount: 0,
    }
  },
  mounted() {
    this.loadCounts()
  },
  watch: {
    userId() {
      this.loadCounts()
    },
  },
  methods: {
    async loadCounts() {
      try {
        // Загружаем количество отзывов и комментариев
        const [reviews, comments] = await Promise.all([
          this.loadReviewsCount(),
          this.loadCommentsCount(),
        ])

        this.reviewsCount = reviews
        this.commentsCount = comments
      } catch (err) {
        console.error('Ошибка загрузки счетчиков:', err)
      }
    },

    async loadReviewsCount() {
      try {
        if (this.isOwnProfile) {
          const reviews = await animeApi.getUserReviews()
          return reviews.length
        } else {
          const reviews = await animeApi.getUserReviews(this.userId)
          return reviews.length
        }
      } catch (err) {
        console.error('Ошибка загрузки отзывов:', err)
        return 0
      }
    },

    async loadCommentsCount() {
      try {
        if (this.isOwnProfile) {
          const comments = await animeApi.getUserComments()
          return comments.length
        } else {
          const comments = await animeApi.getUserComments(this.userId)
          return comments.length
        }
      } catch (err) {
        console.error('Ошибка загрузки комментариев:', err)
        return 0
      }
    },
  },
}
</script>

<style scoped>
.profile-actions {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
}

.actions-header {
  margin-bottom: 20px;
}

.actions-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.section-icon {
  color: #ff416c;
}

.actions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
}

.action-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 65, 108, 0.3);
  transform: translateY(-2px);
}

.action-item.reviews:hover {
  border-color: rgba(76, 175, 80, 0.5);
}

.action-item.comments:hover {
  border-color: rgba(33, 150, 243, 0.5);
}

.action-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 65, 108, 0.1);
  border-radius: 10px;
  flex-shrink: 0;
}

.action-item.reviews .action-icon {
  background: rgba(76, 175, 80, 0.1);
}

.action-item.comments .action-icon {
  background: rgba(33, 150, 243, 0.1);
}

.action-item.reviews .action-icon svg {
  color: #4caf50;
}

.action-item.comments .action-icon svg {
  color: #2196f3;
}

.action-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-name {
  font-size: 15px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.action-count {
  font-size: 14px;
  font-weight: 700;
  color: #ff416c;
  padding: 4px 8px;
  background: rgba(255, 65, 108, 0.1);
  border-radius: 8px;
}

.action-item.reviews .action-count {
  color: #4caf50;
  background: rgba(76, 175, 80, 0.1);
}

.action-item.comments .action-count {
  color: #2196f3;
  background: rgba(33, 150, 243, 0.1);
}

@media (max-width: 1200px) {
  .actions-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .actions-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
