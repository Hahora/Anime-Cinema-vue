import { io } from 'socket.io-client'

class WebSocketService {
  constructor() {
    this.socket = null
    this.connected = false
    this.listeners = new Map()
    this.onlineUsers = new Set()
  }

  /**
   * Подключение к WebSocket серверу
   * @param {number} userId - ID текущего пользователя
   */
  connect(userId) {
    if (this.socket && this.connected) {
      console.log('🔌 WebSocket already connected')
      return
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    const wsUrl = apiUrl.replace('/api', '')

    console.log(`🔌 Connecting to WebSocket: ${wsUrl}`)

    this.socket = io(wsUrl, {
      path: '/ws/socket.io',
      auth: {
        user_id: userId,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    })

    // Обработка событий подключения
    this.socket.on('connect', () => {
      this.connected = true
      console.log('✅ WebSocket connected', this.socket.id)
    })

    this.socket.on('disconnect', (reason) => {
      this.connected = false
      console.log('❌ WebSocket disconnected:', reason)
      // Очищаем онлайн статусы при отключении
      this.onlineUsers.clear()
    })

    this.socket.on('connect_error', (error) => {
      console.error('🔴 WebSocket connection error:', error)
    })

    // Обработка уведомлений
    this.socket.on('notification', (data) => {
      console.log('🔔 Notification received:', data)
      this.triggerListeners('notification', data)
    })

    // Онлайн статусы
    this.socket.on('user_online_status', (data) => {
      console.log('🟢 Online status update:', data)

      if (data.is_online) {
        this.onlineUsers.add(data.user_id)
        console.log(`✅ User ${data.user_id} is now ONLINE`)
      } else {
        this.onlineUsers.delete(data.user_id)
        console.log(`⚪ User ${data.user_id} is now OFFLINE`)
      }

      // Вызываем колбэки для онлайн статусов
      this.triggerListeners('online_status_changed', data)
    })
  }

  /**
   * Отключение от WebSocket
   */
  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket')
      this.socket.disconnect()
      this.socket = null
      this.connected = false
      this.listeners.clear()
      this.onlineUsers.clear()
    }
  }

  /**
   * Проверка онлайн статуса пользователя
   * @param {number} userId - ID пользователя
   * @returns {boolean}
   */
  isUserOnline(userId) {
    return this.onlineUsers.has(userId)
  }

  /**
   * Получить массив всех онлайн пользователей
   * @returns {number[]}
   */
  getOnlineUsers() {
    return Array.from(this.onlineUsers)
  }

  /**
   * Добавить пользователя в онлайн (для инициализации)
   * @param {number} userId - ID пользователя
   */
  setUserOnline(userId) {
    this.onlineUsers.add(userId)
    console.log(`✅ Manually set user ${userId} as ONLINE`)
  }

  /**
   * Удалить пользователя из онлайна
   * @param {number} userId - ID пользователя
   */
  setUserOffline(userId) {
    this.onlineUsers.delete(userId)
    console.log(`⚪ Manually set user ${userId} as OFFLINE`)
  }

  /**
   * Инициализировать онлайн статусы (загрузка с сервера)
   * @param {number[]} userIds - Массив ID онлайн пользователей
   */
  initializeOnlineUsers(userIds) {
    this.onlineUsers.clear()
    userIds.forEach((id) => this.onlineUsers.add(id))
    console.log(`📊 Initialized ${userIds.length} online users`)
  }

  /**
   * Подписка на событие
   * @param {string} event - Название события
   * @param {function} callback - Функция обратного вызова
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
    console.log(`📡 Subscribed to event: ${event}`)
  }

  /**
   * Отписка от события
   * @param {string} event - Название события
   * @param {function} callback - Функция обратного вызова
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
      console.log(`📡 Unsubscribed from event: ${event}`)
    }
  }

  /**
   * Вызов всех слушателей события
   * @param {string} event - Название события
   * @param {any} data - Данные события
   */
  triggerListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in ${event} listener:`, error)
        }
      })
    }
  }

  /**
   * Проверка подключения
   */
  isConnected() {
    return this.connected
  }

  /**
   * Получить количество онлайн пользователей
   * @returns {number}
   */
  getOnlineCount() {
    return this.onlineUsers.size
  }
}

// Экспортируем единственный экземпляр (singleton)
export const wsService = new WebSocketService()
