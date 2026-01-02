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
        <!-- 1. Блок "О себе" -->
        <ProfileBio v-if="profile" :profile="profile" :isOwnProfile="isOwnProfile" />

        <!-- 2. Коллекция карт -->
        <ProfileCardsCollection v-if="profile" :userId="profile.id" :isOwnProfile="isOwnProfile" />

        <!-- 3. Блок друзей -->
        <ProfileFriendsBlock v-if="profile" :userId="profile.id" :isOwnProfile="isOwnProfile" />

        <!-- 4. Стена (внизу, только для своего профиля) -->
        <ProfileWall
          v-if="profile && isOwnProfile"
          :avatar="profile.avatar_url"
          :userName="profile.name"
        />
      </div>

      <div class="content-sidebar">
        <!-- 1. История просмотров -->
        <ProfileHistory v-if="profile" :userId="profile.id" :isOwnProfile="isOwnProfile" />

        <!-- 2. Избранное -->
        <ProfileFavorites v-if="profile" :userId="profile.id" :isOwnProfile="isOwnProfile" />

        <!-- 3. Блок активности (под избранным) -->
        <ProfileActions v-if="profile" :userId="profile.id" :isOwnProfile="isOwnProfile" />

        <!-- 4. Достижения -->
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
import ProfileBio from '@/components/profile/ProfileBio.vue'
import ProfileCardsCollection from '@/components/profile/ProfileCardsCollection.vue'
import ProfileFriendsBlock from '@/components/profile/ProfileFriendsBlock.vue'
import ProfileActions from '@/components/profile/ProfileActions.vue'
import ProfileWall from '@/components/profile/ProfileWall.vue'
import ProfileHistory from '@/components/profile/ProfileHistory.vue'
import ProfileFavorites from '@/components/profile/ProfileFavorites.vue'
import ProfileAchievements from '@/components/profile/ProfileAchievements.vue'
import ProfileSettings from '@/components/profile/ProfileSettings.vue'

export default {
  name: 'ProfileView',
  components: {
    ProfileHeader,
    ProfileBio,
    ProfileCardsCollection,
    ProfileFriendsBlock,
    ProfileActions,
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

    async saveSettings(formData) {
      try {
        console.log('💾 Сохранение настроек профиля:', formData)

        // ✅ Отправляем данные на сервер
        const updatedProfile = await animeApi.updateProfile(formData)

        console.log('✅ Профиль обновлён:', updatedProfile)

        // ✅ Обновляем локальный профиль
        this.profile = updatedProfile

        // ✅ Закрываем модальное окно
        this.showSettings = false

        // ✅ Показываем уведомление
        alert('Настройки успешно сохранены!')
      } catch (err) {
        console.error('❌ Ошибка сохранения профиля:', err)
        alert('Ошибка сохранения: ' + (err.message || 'Неизвестная ошибка'))
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
  /* ✅ КРИТИЧНО */
  overflow-x: hidden;
  width: 100%;
}

.profile-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;

  /* ✅ КРИТИЧНО */
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.content-main {
  display: flex;
  flex-direction: column;
  gap: 0;

  /* ✅ КРИТИЧНО */
  min-width: 0;
  overflow: hidden;
}

.content-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;

  /* ✅ КРИТИЧНО */
  min-width: 0;
  overflow: hidden;
}

@media (max-width: 1200px) {
  .profile-content {
    grid-template-columns: 1fr;
  }

  .content-sidebar {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .profile-content {
    /* ✅ УМЕНЬШАЕМ PADDING */
    padding: 0 20px;

    /* ✅ ЖЁСТКО ОГРАНИЧИВАЕМ */
    max-width: 100vw;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }

  .content-main,
  .content-sidebar {
    /* ✅ ЖЁСТКО */
    max-width: 100%;
    overflow: hidden;
  }

  .content-sidebar {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .profile-content {
    /* ✅ ЕЩЁ МЕНЬШЕ */
    padding: 0 16px;
  }
}
</style>
