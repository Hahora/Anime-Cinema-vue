<template>
  <div class="messages-page">
    <div :class="['messages-container', { 'chat-selected': selectedChatId }]">
      <!-- Левая панель - список чатов -->
      <div class="chats-sidebar">
        <div class="sidebar-header">
          <h2 class="sidebar-title">
            <svg viewBox="0 0 24 24" class="title-icon">
              <path
                d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
                fill="currentColor"
              />
            </svg>
            Сообщения
          </h2>
          <button class="new-chat-btn" @click="showNewChatDialog = true" title="Новый чат">
            <svg viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
            </svg>
          </button>
        </div>

        <div class="chats-list">
          <div
            v-for="chat in chats"
            :key="chat.id"
            :class="['chat-item', { active: selectedChatId === chat.id }]"
            @click="selectChat(chat.id)"
          >
            <div class="chat-avatar">
              <img :src="chat.other_user_avatar" :alt="chat.other_user_name" />
              <div
                v-if="isUserOnline(chat.other_user_id)"
                :class="['online-indicator', { online: true }]"
              >
                <span class="status-dot"></span>
              </div>
            </div>

            <div class="chat-info">
              <div class="chat-top">
                <h3 class="chat-name">{{ chat.other_user_name }}</h3>
                <span v-if="chat.last_message_time" class="chat-time">
                  {{ formatTime(chat.last_message_time) }}
                </span>
              </div>
              <div class="chat-bottom">
                <p class="chat-last-message">
                  <span v-if="chat.last_message_sender_id === currentUserId">Вы: </span>
                  {{ chat.last_message || 'Нет сообщений' }}
                </p>
                <span v-if="chat.unread_count > 0" class="unread-badge">
                  {{ chat.unread_count }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="chats.length === 0" class="no-chats">
            <div class="no-chats-icon">💬</div>
            <h3>Нет чатов</h3>
            <p>Начните общаться с друзьями!</p>
          </div>
        </div>
      </div>

      <!-- Правая панель - сообщения -->
      <div class="chat-window">
        <div v-if="selectedChatId" class="chat-content">
          <!-- Шапка чата -->
          <div class="chat-header">
            <button class="back-btn" @click="selectedChatId = null">
              <svg viewBox="0 0 24 24">
                <path
                  d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <router-link :to="`/profile/${selectedChat.other_user_id}`" class="chat-user-info">
              <div class="chat-user-avatar">
                <img :src="selectedChat.other_user_avatar" :alt="selectedChat.other_user_name" />
                <div
                  v-if="isUserOnline(selectedChat.other_user_id)"
                  :class="['online-indicator', { online: true }]"
                >
                  <span class="status-dot"></span>
                </div>
              </div>
              <div>
                <h3 class="chat-user-name">{{ selectedChat.other_user_name }}</h3>
                <p class="chat-user-status">
                  {{ isUserOnline(selectedChat.other_user_id) ? '🟢 Онлайн' : '⚪ Не в сети' }}
                </p>
              </div>
            </router-link>
          </div>

          <!-- Сообщения -->
          <div ref="messagesContainer" class="messages-list" @scroll="handleScroll">
            <div
              v-for="message in messages"
              :key="message.id"
              :class="['message', { own: message.sender_id === currentUserId }]"
            >
              <img
                v-if="message.sender_id !== currentUserId"
                :src="message.sender_avatar"
                :alt="message.sender_name"
                class="message-avatar"
              />
              <div class="message-bubble">
                <p class="message-text">{{ message.content }}</p>
                <span class="message-time">{{ formatMessageTime(message.created_at) }}</span>
              </div>
            </div>

            <div v-if="isTyping" class="typing-indicator">
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          <!-- Поле ввода -->
          <div class="message-input-container">
            <textarea
              v-model="messageText"
              @keydown.enter.exact.prevent="sendMessage"
              @input="handleTyping"
              placeholder="Напишите сообщение..."
              class="message-input"
              rows="1"
            ></textarea>
            <button
              @click="sendMessage"
              :disabled="!messageText.trim() || sending"
              class="send-btn"
            >
              <svg viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>

        <div v-else class="no-chat-selected">
          <div class="no-chat-icon">💬</div>
          <h3>Выберите чат</h3>
          <p>Выберите чат из списка слева, чтобы начать общение</p>
        </div>
      </div>
    </div>

    <!-- Диалог создания нового чата -->
    <transition name="modal-fade">
      <div v-if="showNewChatDialog" class="modal-overlay" @click="showNewChatDialog = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Новый чат</h3>
            <button class="modal-close" @click="showNewChatDialog = false">
              <svg viewBox="0 0 24 24">
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          <p class="modal-description">Выберите друга для начала общения</p>

          <div class="friends-list">
            <div
              v-for="friend in friendsWithoutChat"
              :key="friend.id"
              class="friend-item"
              @click="createNewChat(friend.id)"
            >
              <img :src="friend.avatar_url" :alt="friend.name" class="friend-avatar" />
              <span class="friend-name">{{ friend.name }}</span>
              <svg viewBox="0 0 24 24" class="friend-arrow">
                <path
                  d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div v-if="friendsWithoutChat.length === 0" class="no-friends">
              <p>У вас нет друзей без активных чатов</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { animeApi } from '@/api/animeApi'
import { wsService } from '@/services/websocket'

export default {
  name: 'MessagesView',
  data() {
    return {
      chats: [],
      messages: [],
      selectedChatId: null,
      currentUserId: null,
      messageText: '',
      isTyping: false,
      typingTimeout: null,
      showNewChatDialog: false,
      friends: [],
      sending: false,
      onlineUserIds: new Set(),
    }
  },
  computed: {
    selectedChat() {
      return this.chats.find((c) => c.id === this.selectedChatId) || null
    },
    friendsWithoutChat() {
      const chatUserIds = new Set(this.chats.map((c) => c.other_user_id))
      return this.friends.filter((f) => !chatUserIds.has(f.id))
    },
  },
  async mounted() {
    await this.loadCurrentUser()
    await this.loadChats()
    await this.loadFriends()
    await this.loadOnlineUsers() //Загружаем онлайн статусы

    // Подписываемся на новые сообщения
    this.newMessageHandler = (data) => {
      if (data.chat_id === this.selectedChatId) {
        this.messages.push(data)
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }

      // Обновляем список чатов
      this.loadChats()
    }

    this.typingHandler = (data) => {
      if (data.chat_id === this.selectedChatId && data.user_id !== this.currentUserId) {
        this.isTyping = true
        setTimeout(() => {
          this.isTyping = false
        }, 3000)
      }
    }

    // Обработчик изменения онлайн статуса
    this.onlineStatusHandler = (data) => {
      if (data.is_online) {
        this.onlineUserIds.add(data.user_id)
      } else {
        this.onlineUserIds.delete(data.user_id)
      }
      // Форсируем обновление
      this.$forceUpdate()
    }

    wsService.on('new_message', this.newMessageHandler)
    wsService.on('user_typing', this.typingHandler)
    wsService.on('online_status_changed', this.onlineStatusHandler)
  },
  beforeUnmount() {
    if (this.newMessageHandler) {
      wsService.off('new_message', this.newMessageHandler)
    }
    if (this.typingHandler) {
      wsService.off('user_typing', this.typingHandler)
    }
    if (this.onlineStatusHandler) {
      wsService.off('online_status_changed', this.onlineStatusHandler)
    }
  },
  methods: {
    async loadCurrentUser() {
      try {
        const profile = await animeApi.getProfile()
        this.currentUserId = profile.id
      } catch (err) {
        console.error('Ошибка загрузки пользователя:', err)
      }
    },

    //  Загрузка онлайн пользователей
    async loadOnlineUsers() {
      try {
        const data = await animeApi.getOnlineUsers()
        this.onlineUserIds = new Set(data.online_user_ids)
        console.log(`🟢 Loaded ${this.onlineUserIds.size} online users`)
      } catch (err) {
        console.error('Ошибка загрузки онлайн пользователей:', err)
      }
    },

    async loadChats() {
      try {
        this.chats = await animeApi.getChats()
      } catch (err) {
        console.error('Ошибка загрузки чатов:', err)
      }
    },

    async loadFriends() {
      try {
        const friendships = await animeApi.getFriends()
        this.friends = friendships.map((fs) => {
          return fs.user.id === this.currentUserId ? fs.friend : fs.user
        })
      } catch (err) {
        console.error('Ошибка загрузки друзей:', err)
      }
    },

    async selectChat(chatId) {
      this.selectedChatId = chatId
      await this.loadMessages()
      await animeApi.markChatRead(chatId)
      this.loadChats()
    },

    async loadMessages() {
      try {
        this.messages = await animeApi.getChatMessages(this.selectedChatId)
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      } catch (err) {
        console.error('Ошибка загрузки сообщений:', err)
      }
    },

    async sendMessage() {
      if (!this.messageText.trim() || this.sending) return

      try {
        this.sending = true
        const message = await animeApi.sendMessage(this.selectedChatId, this.messageText.trim())
        this.messages.push(message)
        this.messageText = ''
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      } catch (err) {
        console.error('Ошибка отправки сообщения:', err)
        alert('Не удалось отправить сообщение')
      } finally {
        this.sending = false
      }
    },

    handleTyping() {
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout)
      }

      wsService.sendTyping(this.selectedChatId)

      this.typingTimeout = setTimeout(() => {
        // Прекращаем отправлять typing после 3 секунд
      }, 3000)
    },

    async createNewChat(friendId) {
      try {
        const chat = await animeApi.createChat(friendId)
        this.showNewChatDialog = false
        await this.loadChats()
        this.selectChat(chat.id)
      } catch (err) {
        console.error('Ошибка создания чата:', err)
        alert('Не удалось создать чат')
      }
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },

    handleScroll() {
      // TODO: Загрузка старых сообщений при скролле вверх
    },

    isUserOnline(userId) {
      return wsService.isUserOnline(userId) || this.onlineUserIds.has(userId)
    },

    formatTime(dateString) {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now - date

      if (diff < 86400000) {
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      } else if (diff < 172800000) {
        return 'Вчера'
      } else {
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
      }
    },

    formatMessageTime(dateString) {
      const date = new Date(dateString)
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    },
  },
}
</script>

<style scoped>
.messages-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #0a0a0a, #000);
  padding: 25px 0 60px;
}

.messages-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 24px;
  height: calc(100vh - 110px);
}

/* ═══════════════════════════════════════════ */
/* ЛЕВАЯ ПАНЕЛЬ - СПИСОК ЧАТОВ */
/* ═══════════════════════════════════════════ */
.chats-sidebar {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 900;
  margin: 0;
  color: white;
}

.title-icon {
  width: 28px;
  height: 28px;
  color: #ff416c;
}

.new-chat-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.new-chat-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 65, 108, 0.4);
}

.new-chat-btn svg {
  width: 20px;
  height: 20px;
  color: white;
}

.chats-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 8px;
}

.chat-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.chat-item.active {
  background: linear-gradient(135deg, rgba(255, 65, 108, 0.15), rgba(255, 75, 43, 0.15));
  border: 1px solid rgba(255, 65, 108, 0.3);
}

.chat-avatar {
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}

.chat-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.online-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(0, 0, 0, 0.8);
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6b7280, #9ca3af);
}

.online-indicator.online .status-dot {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  box-shadow:
    0 0 0 2px rgba(76, 175, 80, 0.2),
    0 0 8px rgba(76, 175, 80, 0.6);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%,
  100% {
    box-shadow:
      0 0 0 2px rgba(76, 175, 80, 0.2),
      0 0 8px rgba(76, 175, 80, 0.6);
  }
  50% {
    box-shadow:
      0 0 0 3px rgba(76, 175, 80, 0.3),
      0 0 12px rgba(76, 175, 80, 0.8);
  }
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.chat-name {
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
}

.chat-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.chat-last-message {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.unread-badge {
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border-radius: 11px;
  font-size: 11px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.no-chats {
  text-align: center;
  padding: 60px 20px;
}

.no-chats-icon {
  font-size: 60px;
  margin-bottom: 16px;
}

.no-chats h3 {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px;
}

.no-chats p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.back-btn {
  display: none;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  margin-right: 12px;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.back-btn svg {
  width: 20px;
  height: 20px;
  color: white;
}

@media (max-width: 1024px) {
  .back-btn {
    display: flex;
  }

  .chat-header {
    display: flex;
    align-items: center;
  }
}

/* ═══════════════════════════════════════════ */
/* ПРАВАЯ ПАНЕЛЬ - ОКНО ЧАТА */
/* ═══════════════════════════════════════════ */
.chat-window {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.chat-user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
}

.chat-user-info:hover {
  opacity: 0.8;
}

.chat-user-avatar {
  position: relative;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
}

.chat-user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.chat-user-name {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0 0 4px;
}

.chat-user-status {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.messages-list {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  max-width: 70%;
}

.message.own {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.message-bubble {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 12px 16px;
  max-width: 100%;
}

.message.own .message-bubble {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border-color: rgba(255, 65, 108, 0.5);
}

.message-text {
  font-size: 15px;
  line-height: 1.5;
  color: white;
  margin: 0 0 6px;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message-time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.message.own .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 70px;
}

.typing-dots {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: typing-bounce 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-8px);
  }
}

.message-input-container {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.message-input {
  flex: 1;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  color: white;
  font-size: 15px;
  font-family: inherit;
  resize: none;
  max-height: 150px;
  transition: all 0.3s;
}

.message-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 65, 108, 0.5);
}

.message-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.send-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 65, 108, 0.4);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-btn svg {
  width: 22px;
  height: 22px;
  color: white;
}

.no-chat-selected {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
}

.no-chat-icon {
  font-size: 80px;
  margin-bottom: 24px;
}

.no-chat-selected h3 {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0 0 12px;
}

.no-chat-selected p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  text-align: center;
}

/* ═══════════════════════════════════════════ */
/* МОДАЛЬНОЕ ОКНО */
/* ═══════════════════════════════════════════ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.modal-content {
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.modal-close {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.modal-close:hover {
  background: rgba(255, 65, 108, 0.2);
  transform: rotate(90deg);
}

.modal-close svg {
  width: 18px;
  height: 18px;
  color: white;
}

.modal-description {
  padding: 16px 24px 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.friends-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.friend-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 8px;
}

.friend-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 65, 108, 0.3);
}

.friend-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.friend-name {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.friend-arrow {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
}

.no-friends {
  text-align: center;
  padding: 40px 20px;
}

.no-friends p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.9);
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */
@media (max-width: 1024px) {
  .messages-container {
    grid-template-columns: 1fr;
    padding: 0 20px;
  }

  .chats-sidebar {
    display: block;
  }

  .chat-window {
    display: none;
  }

  .messages-container.chat-selected .chats-sidebar {
    display: none;
  }

  .messages-container.chat-selected .chat-window {
    display: flex;
  }

  .message {
    max-width: 85%;
  }
}

@media (max-width: 768px) {
  .messages-page {
    padding: 15px 0 60px;
  }

  .messages-container {
    padding: 0 15px;
    height: calc(100vh - 90px);
  }

  .sidebar-header {
    padding: 16px;
  }

  .sidebar-title {
    font-size: 20px;
  }

  .chats-list {
    padding: 8px;
  }

  .chat-item {
    padding: 12px;
  }

  .chat-header {
    padding: 16px;
  }

  .messages-list {
    padding: 16px;
  }

  .message-input-container {
    padding: 16px;
  }
}
</style>
