import { io } from 'socket.io-client'

class WebSocketService {
  constructor() {
    this.socket = null
    this.connected = false
    this.listeners = new Map()
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
    })

    this.socket.on('connect_error', (error) => {
      console.error('🔴 WebSocket connection error:', error)
    })

    // Обработка уведомлений
    this.socket.on('notification', (data) => {
      console.log('🔔 Notification received:', data)
      this.triggerListeners('notification', data)
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
    }
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
}

// Экспортируем единственный экземпляр (singleton)
export const wsService = new WebSocketService()
