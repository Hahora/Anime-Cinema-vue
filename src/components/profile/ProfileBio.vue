<template>
  <div class="profile-bio">
    <div class="bio-header">
      <h2 class="bio-title">
        <IconInfo :size="28" class="section-icon" />
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
          <IconCalendar :size="20" class="meta-icon" />
          <span>Присоединился {{ formatDate(profile.created_at) }}</span>
        </div>

        <div v-if="profile.last_seen" class="meta-item">
          <IconClock :size="20" class="meta-icon" />
          <span>Был в сети {{ formatLastSeen(profile.last_seen) }}</span>
        </div>

        <div class="meta-item">
          <IconTv :size="20" class="meta-icon" />
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
}
</style>
