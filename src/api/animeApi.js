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
    const response = await fetch(`${API_URL}/profile/me`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error('Не удалось загрузить профиль')
    }

    return response.json()
  }

  async updateProfile(data) {
    console.log('📤 Отправка данных профиля:', data)

    const response = await fetch(`${API_URL}/profile/me`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Не удалось обновить профиль')
    }

    const updatedProfile = await response.json()
    console.log('✅ Профиль обновлён:', updatedProfile)

    return updatedProfile
  }

  async getUserProfile(userId) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/profile/${userId}`, {
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

  // МЕТОДЫ для онлайн статусов

  async getOnlineUsers() {
    const token = this.getToken()
    if (!token) return { online_user_ids: [], count: 0 }

    const res = await fetch(`${API_URL}/users/online`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) return { online_user_ids: [], count: 0 }
    return await res.json()
  }

  async getOnlineFriends() {
    const token = this.getToken()
    if (!token) return { online_friend_ids: [], total_friends: 0, online_count: 0 }

    const res = await fetch(`${API_URL}/friends/online`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) return { online_friend_ids: [], total_friends: 0, online_count: 0 }
    return await res.json()
  }

  async checkUserOnline(userId) {
    const token = this.getToken()
    if (!token) return { is_online: false }

    const res = await fetch(`${API_URL}/users/${userId}/online`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) return { is_online: false }
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

  async checkCanMessage(userId) {
    const response = await fetch(`${API_URL}/users/${userId}/can-message`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
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

  async getFriendshipStatus(userId) {
    const token = this.getToken()
    if (!token) return { status: 'none' }

    const res = await fetch(`${API_URL}/friends/status/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) return { status: 'none' }
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
  // ЧАТЫ И СООБЩЕНИЯ
  // ═══════════════════════════════════════════

  async getChats() {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/chats`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Ошибка загрузки чатов')
    return await res.json()
  }

  async createChat(friendId) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/chats`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ friend_id: friendId }),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.detail || 'Ошибка создания чата')
    }
    return await res.json()
  }

  async getChatMessages(chatId, limit = 50, beforeId = null) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    let url = `${API_URL}/chats/${chatId}/messages?limit=${limit}`
    if (beforeId) {
      url += `&before_id=${beforeId}`
    }

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Ошибка загрузки сообщений')
    return await res.json()
  }

  async sendMessage(chatId, content) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.detail || 'Ошибка отправки сообщения')
    }
    return await res.json()
  }

  async markChatRead(chatId) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/chats/${chatId}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Ошибка отметки прочитанного')
    return await res.json()
  }

  async editMessage(chatId, messageId, content) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/chats/${chatId}/messages/${messageId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })

    if (!res.ok) {
      const error = await res.json()
      throw error
    }
    return await res.json()
  }

  async deleteMessage(chatId, messageId) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/chats/${chatId}/messages/${messageId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      const error = await res.json()
      throw error
    }
  }

  async deleteChat(chatId) {
    const token = this.getToken()
    if (!token) throw new Error('Не авторизован')

    const res = await fetch(`${API_URL}/chats/${chatId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      const error = await res.json()
      throw error
    }
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
