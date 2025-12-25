<template>
  <div class="profile-page">
    <ProfileHeader
      v-if="profile"
      :profile="profile"
      @open-settings="showSettings = true"
      @edit-avatar="showSettings = true"
    />

    <div class="profile-content">
      <div class="content-main">
        <ProfileWall v-if="profile" :avatar="profile.avatar_url" :userName="profile.name" />
      </div>

      <div class="content-sidebar">
        <ProfileFavorites />
        <ProfileAchievements
          v-if="profile"
          :totalAnime="profile.total_anime"
          :totalEpisodes="profile.total_episodes"
          :favoritesCount="profile.favorites_count"
        />
      </div>
    </div>

    <ProfileSettings
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
import ProfileFavorites from '@/components/profile/ProfileFavorites.vue'
import ProfileAchievements from '@/components/profile/ProfileAchievements.vue'
import ProfileSettings from '@/components/profile/ProfileSettings.vue'

export default {
  name: 'ProfileView',
  components: {
    ProfileHeader,
    ProfileWall,
    ProfileFavorites,
    ProfileAchievements,
    ProfileSettings,
  },
  data() {
    return {
      profile: null,
      showSettings: false,
    }
  },
  mounted() {
    this.loadProfile()
  },
  methods: {
    async loadProfile() {
      try {
        this.profile = await animeApi.getProfile()
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err)
        this.$router.push('/login')
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

.content-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
