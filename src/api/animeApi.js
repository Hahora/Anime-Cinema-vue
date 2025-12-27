const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

class AnimeAPI {
  // ═══════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════

  getHeaders() {
    const token = this.getToken()
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  // ═══════════════════════════════════════════
  // AUTH
  // ═══════════════════════════════════════════

  async login(username, password) {
    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)

    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.detail || 'Ошибка входа')
    }

    const data = await res.json()

    // Сохраняем токен
    localStorage.setItem('token', data.access_token)

    return data
  }

  logout() {
    localStorage.removeItem('token')
  }

  getToken() {
    return localStorage.getItem('token')
  }

  isAuthenticated() {
    return !!this.getToken()
  }

  // ═══════════════════════════════════════════
  // PROFILE
  // ═══════════════════════════════════════════

  async getProfile() {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Ошибка загрузки профиля')
    return await res.json()
  }

  async getProfileById(userId) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Ошибка загрузки профиля')
    return await res.json()
  }

  async getCurrentUserId() {
    try {
      const profile = await this.getProfile()
      return profile.id
    } catch (err) {
      return null
    }
  }

  async updateProfile(data) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/profile/me`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) throw new Error('Ошибка обновления профиля')
    return await res.json()
  }

  // ═══════════════════════════════════════════
  // PROFILE (OTHER USERS)
  // ═══════════════════════════════════════════

  async getUserFavorites(userId, limit = 50) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/profile/${userId}/favorites?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Ошибка загрузки избранного')
    return await res.json()
  }

  async getUserHistory(userId, limit = 50) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/profile/${userId}/history?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Ошибка загрузки истории')
    return await res.json()
  }

  // ═══════════════════════════════════════════
  // USERS (ПОИСК И СПИСОК)
  // ═══════════════════════════════════════════

  async searchUsers(query, limit = 20) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(
      `${API_URL}/users/search?query=${encodeURIComponent(query)}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    if (!res.ok) throw new Error('Ошибка поиска пользователей')
    return await res.json()
  }

  async getAllUsers(limit = 50, offset = 0) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/users?limit=${limit}&offset=${offset}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Ошибка загрузки пользователей')
    return await res.json()
  }

  // ═══════════════════════════════════════════
  // FRIENDS
  // ═══════════════════════════════════════════

  async getFriends() {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/friends`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Ошибка загрузки друзей')
    return await res.json()
  }

  async getFriendRequests() {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/friends/requests`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Ошибка загрузки заявок')
    return await res.json()
  }

  async addFriend(userId) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/friends/add`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ friend_id: userId }),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.detail || 'Ошибка добавления в друзья')
    }
    return await res.json()
  }

  async acceptFriendRequest(friendshipId) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/friends/accept/${friendshipId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Ошибка принятия заявки')
    return await res.json()
  }

  async rejectFriendRequest(friendshipId) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/friends/reject/${friendshipId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Ошибка отклонения заявки')
  }

  async removeFriend(friendshipId) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/friends/${friendshipId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Ошибка удаления из друзей')
  }

  async checkFriendship(userId) {
    const token = this.getToken()
    if (!token) return { is_friend: false, status: null, friendship_id: null, is_sender: false }

    const res = await fetch(`${API_URL}/friends/check/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) return { is_friend: false, status: null, friendship_id: null, is_sender: false }
    return await res.json()
  }

  // ═══════════════════════════════════════════
  // FAVORITES
  // ═══════════════════════════════════════════

  async getFavorites() {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Ошибка загрузки избранного')
    return await res.json()
  }

  async addToFavorites(anime) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/favorites`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(anime),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.detail || 'Ошибка добавления')
    }
    return await res.json()
  }

  async removeFromFavorites(animeId) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/favorites/${animeId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Ошибка удаления')
  }

  async checkFavorite(animeId) {
    const token = this.getToken()
    if (!token) return { is_favorite: false }

    const res = await fetch(`${API_URL}/favorites/check/${animeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) return { is_favorite: false }
    return await res.json()
  }

  // ═══════════════════════════════════════════
  // WATCHED ANIME
  // ═══════════════════════════════════════════

  async checkWatched(animeId) {
    const token = this.getToken()
    if (!token) return { is_watched: false, episodes_watched: 0, is_completed: false }

    const res = await fetch(`${API_URL}/watched/check/${animeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) return { is_watched: false, episodes_watched: 0, is_completed: false }
    return await res.json()
  }

  async updateWatched(data) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/watched`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.detail || 'Ошибка обновления')
    }
    return await res.json()
  }

  async getWatched(limit = 100) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/watched?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Ошибка загрузки отмеченных аниме')
    return await res.json()
  }

  // ═══════════════════════════════════════════
  // WATCH HISTORY
  // ═══════════════════════════════════════════

  async getWatchHistory(limit = 50) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/history?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Ошибка загрузки истории')
    return await res.json()
  }

  async addToHistory(data) {
    const token = this.getToken()
    if (!token) return // Тихо пропускаем для неавторизованных

    await fetch(`${API_URL}/history`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }

  // ═══════════════════════════════════════════
  // NOTIFICATIONS
  // ═══════════════════════════════════════════

  async getNotifications(limit = 20) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/notifications?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Ошибка загрузки уведомлений')
    return await res.json()
  }

  async getUnreadNotificationsCount() {
    const token = this.getToken()
    if (!token) return { count: 0 }

    const res = await fetch(`${API_URL}/notifications/unread/count`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) return { count: 0 }
    return await res.json()
  }

  async markNotificationRead(notificationId) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Ошибка')
    return await res.json()
  }

  async markAllNotificationsRead() {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Ошибка')
    return await res.json()
  }

  // ═══════════════════════════════════════════
  // ANIME (публичные методы)
  // ═══════════════════════════════════════════

  async getGenres() {
    const res = await fetch(`${API_URL}/genres`)
    if (!res.ok) throw new Error('Ошибка загрузки жанров')
    return await res.json()
  }

  async getAnimeByGenre(genre, page = 1, limit = 10) {
    const res = await fetch(
      `${API_URL}/genres/${encodeURIComponent(genre)}/anime?page=${page}&limit=${limit}`,
    )
    if (!res.ok) throw new Error('Ошибка загрузки аниме по жанру')
    return await res.json()
  }

  async search(title, limit = 12) {
    const res = await fetch(`${API_URL}/search?title=${encodeURIComponent(title)}&limit=${limit}`)
    if (!res.ok) throw new Error('Ошибка поиска')
    const data = await res.json()
    return data.results
  }

  async getTrending(limit = 12) {
    const res = await fetch(`${API_URL}/trending?limit=${limit}`)
    if (!res.ok) throw new Error('Ошибка загрузки')
    const data = await res.json()
    return data.results
  }

  async getAnimeDetails(id) {
    const res = await fetch(`${API_URL}/anime/${id}`)
    if (!res.ok) throw new Error('Аниме не найдено')
    return await res.json()
  }

  async getVideoM3u8(id, episode, translationId, quality = 720) {
    const res = await fetch(`${API_URL}/video/${id}/${episode}/${translationId}?quality=${quality}`)
    if (!res.ok) throw new Error('Видео недоступно')
    const data = await res.json()
    return data.m3u8_url
  }
}

export const animeApi = new AnimeAPI()
