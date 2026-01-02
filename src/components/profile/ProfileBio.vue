<template>
  <div class="profile-bio">
    <div class="bio-header">
      <h2 class="bio-title">
        <svg viewBox="0 0 24 24" class="section-icon">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            fill="currentColor"
          />
        </svg>
        О {{ isOwnProfile ? 'себе' : 'пользователе' }}
      </h2>
    </div>

    <div class="bio-content">
      <div v-if="profile.bio && profile.bio.trim()" class="bio-text">
        <p>{{ profile.bio }}</p>
      </div>
      <div v-else class="bio-empty">
        <div class="empty-icon">📝</div>
        <p>
          {{
            isOwnProfile
              ? 'Расскажите о себе в настройках профиля'
              : 'Пользователь пока ничего не рассказал о себе'
          }}
        </p>
      </div>

      <div class="bio-meta">
        <div class="meta-item">
          <svg viewBox="0 0 24 24" class="meta-icon">
            <path
              d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
              fill="currentColor"
            />
          </svg>
          <span>Присоединился {{ formatDate(profile.created_at) }}</span>
        </div>

        <div v-if="profile.last_seen" class="meta-item">
          <svg viewBox="0 0 24 24" class="meta-icon">
            <path
              d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
              fill="currentColor"
            />
          </svg>
          <span>Был в сети {{ formatLastSeen(profile.last_seen) }}</span>
        </div>

        <div class="meta-item">
          <svg viewBox="0 0 24 24" class="meta-icon">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill="currentColor"
            />
          </svg>
          <span>{{ profile.total_anime || 0 }} аниме просмотрено</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileBio',
  props: {
    profile: {
      type: Object,
      required: true,
    },
    isOwnProfile: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },

    formatLastSeen(dateString) {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now - date
      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))

      if (minutes < 5) return 'только что'
      if (minutes < 60) return `${minutes} мин назад`
      if (hours < 24) return `${hours} ч назад`
      if (days < 7) return `${days} дн назад`

      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
      })
    },
  },
}
</script>

<style scoped>
.profile-bio {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
}

.bio-header {
  margin-bottom: 24px;
}

.bio-title {
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

.bio-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.bio-text p {
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  white-space: pre-wrap;
}

.bio-empty {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.bio-empty p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.bio-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.meta-icon {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .profile-bio {
    padding: 24px;
  }

  .bio-title {
    font-size: 20px;
  }

  .section-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
