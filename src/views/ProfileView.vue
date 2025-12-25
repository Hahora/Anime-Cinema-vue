<template>
  <div class="profile-page">
    <ProfileHeader
      v-if="profile"
      :profile="profile"
      :isOwnProfile="isOwnProfile"
      @open-settings="showSettings = true"
      @edit-avatar="showSettings = true"
    />

    <div class="profile-content">
      <div class="content-main">
        <!-- Стена только для своего профиля -->
        <ProfileWall
          v-if="profile && isOwnProfile"
          :avatar="profile.avatar_url"
          :userName="profile.name"
        />

        <!-- Для чужого профиля -->
        <div v-else-if="profile && !isOwnProfile" class="public-info">
          <div class="info-card">
            <h2>О пользователе</h2>
            <p>{{ profile.bio }}</p>
            <div class="joined-date">Присоединился {{ formatDate(profile.created_at) }}</div>
          </div>
        </div>
      </div>

      <div class="content-sidebar">
        <ProfileHistory v-if="profile" :userId="profile.id" :isOwnProfile="isOwnProfile" />
        <ProfileFavorites v-if="profile" :userId="profile.id" :isOwnProfile="isOwnProfile" />
        <ProfileAchievements
          v-if="profile"
          :totalAnime="profile.total_anime"
          :totalEpisodes="profile.total_episodes"
          :favoritesCount="profile.favorites_count"
        />
      </div>
    </div>

    <ProfileSettings
      v-if="isOwnProfile"
      :show="showSettings"
      :profile="profile"
      @close="showSettings = false"
      @save="saveSettings"
    />
  </div>
</template>

<script>
import { animeApi } from '@/api/animeApi'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import ProfileWall from '@/components/profile/ProfileWall.vue'
import ProfileHistory from '@/components/profile/ProfileHistory.vue'
import ProfileFavorites from '@/components/profile/ProfileFavorites.vue'
import ProfileAchievements from '@/components/profile/ProfileAchievements.vue'
import ProfileSettings from '@/components/profile/ProfileSettings.vue'

export default {
  name: 'ProfileView',
  components: {
    ProfileHeader,
    ProfileWall,
    ProfileHistory,
    ProfileFavorites,
    ProfileAchievements,
    ProfileSettings,
  },
  data() {
    return {
      profile: null,
      showSettings: false,
      currentUserId: null,
    }
  },
  computed: {
    profileId() {
      // Если есть ID в URL - используем его, иначе - свой профиль
      return this.$route.params.id ? parseInt(this.$route.params.id) : null
    },
    isOwnProfile() {
      // Свой профиль если нет ID в URL или ID совпадает с текущим
      return !this.profileId || this.profileId === this.currentUserId
    },
  },
  watch: {
    '$route.params.id'() {
      this.loadProfile()
    },
  },
  async mounted() {
    // Получаем ID текущего пользователя
    this.currentUserId = await animeApi.getCurrentUserId()
    this.loadProfile()
  },
  methods: {
    async loadProfile() {
      try {
        if (this.isOwnProfile) {
          // Загружаем свой профиль
          this.profile = await animeApi.getProfile()
          this.currentUserId = this.profile.id
        } else {
          // Загружаем чужой профиль
          this.profile = await animeApi.getProfileById(this.profileId)
        }
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err)
        if (err.message.includes('404')) {
          alert('Пользователь не найден')
          this.$router.push('/profile')
        }
      }
    },

    async saveSettings(data) {
      try {
        this.profile = await animeApi.updateProfile(data)
        this.showSettings = false
      } catch (err) {
        console.error('Ошибка сохранения:', err)
        alert('Ошибка сохранения профиля')
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
      })
    },
  },
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #0a0a0a, #000);
  padding-bottom: 60px;
}

.profile-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
}

.content-main {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.content-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Публичная информация для чужого профиля */
.public-info {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.info-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 30px;
}

.info-card h2 {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0 0 16px;
}

.info-card p {
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 20px;
}

.joined-date {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

@media (max-width: 1200px) {
  .profile-content {
    grid-template-columns: 1fr;
  }

  .content-sidebar {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .profile-content {
    padding: 0 20px;
  }

  .content-sidebar {
    grid-template-columns: 1fr;
  }
}
</style>
