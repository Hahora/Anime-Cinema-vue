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

        <!-- Поиск чатов -->
        <div class="search-container">
          <div class="search-bar">
            <svg viewBox="0 0 24 24" class="search-icon">
              <path
                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                fill="currentColor"
              />
            </svg>
            <input
              v-model="searchQuery"
              @input="handleSearchInput"
              type="text"
              placeholder="Поиск чатов..."
              class="search-input"
            />
            <button v-if="searchQuery" @click="clearSearch" class="clear-search-btn">
              <svg viewBox="0 0 24 24">
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="chats-list">
          <div
            v-for="chat in filteredChats"
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

          <div v-if="chats.length > 0 && filteredChats.length === 0" class="no-results">
            <div class="no-results-icon">🔍</div>
            <h3>Ничего не найдено</h3>
            <p>Попробуйте изменить запрос</p>
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
                  {{ isUserOnline(selectedChat.other_user_id) ? 'Онлайн' : 'Не в сети' }}
                </p>
              </div>
            </router-link>

            <!-- Меню действий -->
            <div class="chat-actions">
              <button class="action-menu-btn" @click="toggleChatMenu">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                    fill="currentColor"
                  />
                </svg>
              </button>

              <!-- Выпадающее меню -->
              <transition name="menu-fade">
                <div v-if="chatMenuOpen" class="action-menu" @click.stop>
                  <button class="menu-action-item" @click="handleProposeExchange">
                    <svg viewBox="0 0 24 24" class="menu-action-icon">
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>Предложить обмен</span>
                  </button>

                  <div class="menu-divider"></div>

                  <button class="menu-action-item danger" @click="handleDeleteChat">
                    <svg viewBox="0 0 24 24" class="menu-action-icon">
                      <path
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>Удалить чат у себя</span>
                  </button>
                </div>
              </transition>
            </div>
          </div>

          <!-- Сообщения -->
          <div ref="messagesContainer" class="messages-list" @scroll="handleScroll">
            <!-- Группы сообщений по датам -->
            <div v-for="group in groupedMessages" :key="group.date" class="message-group">
              <!-- Разделитель с датой -->
              <div class="date-divider">
                <span class="date-label">{{ group.date }}</span>
              </div>

              <!-- Сообщения в группе -->
              <div
                v-for="message in group.messages"
                :key="message.id"
                :class="['message', { own: message.sender_id === currentUserId }]"
              >
                <img
                  v-if="message.sender_id !== currentUserId"
                  :src="message.sender_avatar"
                  :alt="message.sender_name"
                  class="message-avatar"
                />
                <div class="message-content">
                  <div
                    class="message-bubble"
                    @click="
                      message.sender_id === currentUserId ? toggleMessageMenu(message.id) : null
                    "
                    :class="{ clickable: message.sender_id === currentUserId }"
                  >
                    <p class="message-text">{{ message.content }}</p>
                    <div class="message-footer">
                      <span class="message-time">
                        {{ formatMessageTime(message.created_at) }}
                        <span v-if="message.is_edited" class="edited-label">изменено</span>
                      </span>
                      <!-- Статус для своих сообщений -->
                      <div v-if="message.sender_id === currentUserId" class="message-status">
                        <!-- Две галочки (прочитано) -->
                        <svg v-if="message.is_read" viewBox="0 0 24 24" class="status-icon read">
                          <path
                            d="M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z"
                            fill="currentColor"
                          />
                        </svg>
                        <!-- Одна галочка (доставлено) -->
                        <svg v-else viewBox="0 0 24 24" class="status-icon delivered">
                          <path
                            d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <!-- Меню действий под сообщением -->
                  <transition name="slide-up">
                    <div
                      v-if="message.sender_id === currentUserId && activeMessageMenu === message.id"
                      class="message-menu"
                    >
                      <button @click="startEditMessage(message)" class="message-menu-btn edit">
                        <svg viewBox="0 0 24 24">
                          <path
                            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                            fill="currentColor"
                          />
                        </svg>
                        <span>Редактировать</span>
                      </button>
                      <button @click="deleteMessage(message.id)" class="message-menu-btn delete">
                        <svg viewBox="0 0 24 24">
                          <path
                            d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                            fill="currentColor"
                          />
                        </svg>
                        <span>Удалить</span>
                      </button>
                    </div>
                  </transition>
                </div>
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
          <div v-if="canSendMessages" class="message-input-container">
            <!-- Индикатор редактирования -->
            <transition name="slide-down">
              <div v-if="editingMessageId" class="editing-indicator">
                <svg viewBox="0 0 24 24" class="editing-icon">
                  <path
                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                    fill="currentColor"
                  />
                </svg>
                <span>Редактирование сообщения</span>
                <button @click="cancelEdit" class="cancel-edit-btn">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </transition>

            <div class="input-wrapper">
              <textarea
                v-model="messageText"
                @keydown.enter.exact.prevent="editingMessageId ? saveEdit() : sendMessage()"
                @keydown.esc="cancelEdit"
                @input="handleTyping"
                :placeholder="
                  editingMessageId ? 'Редактировать сообщение...' : 'Напишите сообщение...'
                "
                class="message-input"
                rows="1"
              ></textarea>

              <!-- Emoji Picker -->
              <EmojiPicker @select="insertEmoji" />

              <button
                @click="editingMessageId ? saveEdit() : sendMessage()"
                :disabled="!messageText.trim() || sending"
                class="send-btn"
                :title="editingMessageId ? 'Сохранить' : 'Отправить'"
              >
                <svg v-if="!editingMessageId" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor" />
                </svg>
                <svg v-else viewBox="0 0 24 24">
                  <path
                    d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Предупреждение если не друзья -->
          <div v-else class="chat-blocked-notice">
            <div class="blocked-icon">
              <svg viewBox="0 0 24 24">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h4>Переписка недоступна</h4>
            <p>
              Вы больше не друзья с {{ selectedChat.other_user_name }}. Добавьте пользователя в
              друзья, чтобы продолжить общение.
            </p>
            <router-link :to="`/profile/${selectedChat.other_user_id}`" class="view-profile-btn">
              Перейти в профиль
            </router-link>
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
import EmojiPicker from '@/components/emoji/EmojiPicker.vue'

export default {
  name: 'MessagesView',
  components: {
    EmojiPicker,
  },
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
      searchQuery: '',
      chatMenuOpen: false,
      activeMessageMenu: null,
      editingMessageId: null,
      editingMessageText: '',
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
    filteredChats() {
      if (!this.searchQuery.trim()) {
        return this.chats
      }

      const query = this.searchQuery.toLowerCase().trim()
      return this.chats.filter((chat) => chat.other_user_name.toLowerCase().includes(query))
    },
    groupedMessages() {
      const groups = []
      let currentDate = null
      let currentGroup = []

      this.messages.forEach((message) => {
        const messageDate = this.getDateLabel(message.created_at)

        if (messageDate !== currentDate) {
          if (currentGroup.length > 0) {
            groups.push({ date: currentDate, messages: currentGroup })
          }
          currentDate = messageDate
          currentGroup = [message]
        } else {
          currentGroup.push(message)
        }
      })

      if (currentGroup.length > 0) {
        groups.push({ date: currentDate, messages: currentGroup })
      }

      return groups
    },
    // Проверяем, в друзьях ли собеседник
    canSendMessages() {
      if (!this.selectedChat) return false

      // Проверяем, есть ли собеседник в списке друзей
      const isFriend = this.friends.some((f) => f.id === this.selectedChat.other_user_id)
      return isFriend
    },
  },
  async mounted() {
    await this.loadCurrentUser()
    await this.loadChats()
    await this.loadFriends()
    await this.loadOnlineUsers()

    const chatId = this.$route.query.chat
    if (chatId) {
      await this.selectChat(parseInt(chatId))
      this.$router.replace({ query: {} })
    }

    this.newMessageHandler = (data) => {
      if (data.chat_id === this.selectedChatId) {
        const exists = this.messages.find((m) => m.id === data.id)
        if (!exists) {
          // Убеждаемся что is_read есть
          if (!('is_read' in data)) {
            data.is_read = false
          }

          this.messages.push(data)
          this.$nextTick(() => {
            this.scrollToBottom()
          })
        }

        // Если сообщение не от текущего пользователя и чат открыт - отмечаем как прочитанное
        if (data.sender_id !== this.currentUserId) {
          this.markChatAsRead(data.chat_id)
        }
      }

      this.updateChatInList(data)
    }
    this.typingHandler = (data) => {
      if (data.chat_id === this.selectedChatId && data.user_id !== this.currentUserId) {
        this.isTyping = true
        setTimeout(() => {
          this.isTyping = false
        }, 3000)
      }
    }
    this.onlineStatusHandler = (data) => {
      if (data.is_online) {
        this.onlineUserIds.add(data.user_id)
      } else {
        this.onlineUserIds.delete(data.user_id)
      }
      this.$forceUpdate()
    }

    // Обработчик прочтения сообщений
    this.readReceiptHandler = (data) => {
      console.log('📬 Получено событие message_read:', data)

      // data = { chat_id, user_id, read_at }
      if (data.chat_id === this.selectedChatId) {
        console.log('✅ Обновляем галочки в открытом чате', data.chat_id)

        // Пересоздаем массив сообщений чтобы Vue заметил изменения
        this.messages = this.messages.map((msg) => {
          if (msg.sender_id === this.currentUserId && !msg.is_read) {
            console.log(`✓✓ Сообщение ${msg.id} отмечено как прочитанное`)
            return { ...msg, is_read: true }
          }
          return msg
        })
      } else {
        console.log('ℹ️ Событие для другого чата:', data.chat_id)
      }
    }

    wsService.on('new_message', this.newMessageHandler)
    wsService.on('user_typing', this.typingHandler)
    wsService.on('online_status_changed', this.onlineStatusHandler)
    wsService.on('message_read', this.readReceiptHandler)

    // ✅ Обработчики редактирования и удаления
    this.messageEditedHandler = (data) => {
      console.log('✏️ Получено событие message_edited:', data)

      if (data.chat_id === this.selectedChatId) {
        // Находим и обновляем сообщение
        const msgIndex = this.messages.findIndex((m) => m.id === data.id)
        if (msgIndex !== -1) {
          this.messages[msgIndex] = data
          console.log(`✏️ Сообщение ${data.id} обновлено`)
        }
      }
    }

    this.messageDeletedHandler = (data) => {
      console.log('🗑️ Получено событие message_deleted:', data)

      if (data.chat_id === this.selectedChatId) {
        // Удаляем сообщение из списка
        this.messages = this.messages.filter((m) => m.id !== data.message_id)
        console.log(`🗑️ Сообщение ${data.message_id} удалено`)
      }
    }

    wsService.on('message_edited', this.messageEditedHandler)
    wsService.on('message_deleted', this.messageDeletedHandler)

    // ✅ Дублируем подписку напрямую через socket
    if (wsService.socket) {
      wsService.socket.on('message_read', this.readReceiptHandler)
      wsService.socket.on('message_edited', this.messageEditedHandler)
      wsService.socket.on('message_deleted', this.messageDeletedHandler)

      // ✅ ОТЛАДКА: Логируем ВСЕ события WebSocket
      wsService.socket.onAny((eventName, ...args) => {
        console.log('🔌 WebSocket событие:', eventName, args)
      })
    }

    // Закрытие меню при клике вне его
    this.closeMenuHandler = (e) => {
      if (this.chatMenuOpen && !e.target.closest('.chat-actions')) {
        this.chatMenuOpen = false
      }
      if (this.activeMessageMenu && !e.target.closest('.message-content')) {
        this.activeMessageMenu = null
      }
    }
    document.addEventListener('click', this.closeMenuHandler)
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
    if (this.readReceiptHandler) {
      wsService.off('message_read', this.readReceiptHandler)
    }
    if (this.messageEditedHandler) {
      wsService.off('message_edited', this.messageEditedHandler)
    }
    if (this.messageDeletedHandler) {
      wsService.off('message_deleted', this.messageDeletedHandler)
    }
    if (this.closeMenuHandler) {
      document.removeEventListener('click', this.closeMenuHandler)
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

    updateChatInList(messageData) {
      const chatIndex = this.chats.findIndex((c) => c.id === messageData.chat_id)

      if (chatIndex !== -1) {
        const chat = this.chats[chatIndex]
        chat.last_message = messageData.content
        chat.last_message_time = messageData.created_at
        chat.last_message_sender_id = messageData.sender_id

        if (
          messageData.sender_id !== this.currentUserId &&
          this.selectedChatId !== messageData.chat_id
        ) {
          chat.unread_count = (chat.unread_count || 0) + 1
        }

        this.chats.splice(chatIndex, 1)
        this.chats.unshift(chat)
      } else {
        this.loadChats()
      }
    },

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

      await this.markChatAsRead(chatId)
    },

    async markChatAsRead(chatId) {
      try {
        await animeApi.markChatRead(chatId)

        const chat = this.chats.find((c) => c.id === chatId)
        if (chat) {
          chat.unread_count = 0
        }

        // Обновляем статус is_read для всех сообщений в текущем чате
        if (this.selectedChatId === chatId) {
          this.messages.forEach((msg) => {
            if (msg.sender_id !== this.currentUserId) {
              msg.is_read = true
            }
          })
        }
      } catch (err) {
        console.error('Ошибка отметки чата как прочитанного:', err)
      }
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

        this.updateChatInList(message)

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

      this.typingTimeout = setTimeout(() => {}, 3000)
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
      const container = this.$refs.messagesContainer
      if (container) {
        // Проверяем, прокручено ли до конца
        const isAtBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight < 100

        // Если прокручено до конца и есть непрочитанные - отмечаем как прочитанное
        if (isAtBottom && this.selectedChatId) {
          const chat = this.chats.find((c) => c.id === this.selectedChatId)
          if (chat && chat.unread_count > 0) {
            this.markChatAsRead(this.selectedChatId)
          }
        }
      }
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

    getDateLabel(dateString) {
      const date = new Date(dateString)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      // Сбрасываем время для корректного сравнения дат
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const yesterdayOnly = new Date(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate(),
      )

      if (dateOnly.getTime() === todayOnly.getTime()) {
        return 'Сегодня'
      } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
        return 'Вчера'
      } else {
        // Форматируем дату: "12 декабря 2024"
        return date.toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
        })
      }
    },

    handleSearchInput() {
      // Поиск происходит через computed filteredChats
    },

    clearSearch() {
      this.searchQuery = ''
    },

    toggleChatMenu() {
      this.chatMenuOpen = !this.chatMenuOpen
    },

    toggleMessageMenu(messageId) {
      if (this.editingMessageId) return // Не открываем меню во время редактирования

      // Проверяем 24 часа
      const message = this.messages.find((m) => m.id === messageId)
      if (!this.canEditMessage(message)) {
        alert('Прошло больше 24 часов. Редактирование и удаление недоступны.')
        return
      }

      this.activeMessageMenu = this.activeMessageMenu === messageId ? null : messageId
    },

    handleProposeExchange() {
      this.chatMenuOpen = false
      // TODO: Реализовать предложение обмена
      alert('Функция "Предложить обмен" будет реализована позже')
    },

    async handleDeleteChat() {
      if (!confirm('Вы уверены, что хотите удалить этот чат? Это действие нельзя отменить.')) {
        return
      }

      try {
        this.chatMenuOpen = false

        // Вызываем API для удаления чата
        await animeApi.deleteChat(this.selectedChatId)

        // Удаляем локально
        this.chats = this.chats.filter((c) => c.id !== this.selectedChatId)
        this.selectedChatId = null
        this.messages = []

        console.log('Чат успешно удален')
      } catch (err) {
        console.error('Ошибка удаления чата:', err)
        alert(err.response?.data?.detail || 'Не удалось удалить чат')
      }
    },

    startEditMessage(message) {
      this.activeMessageMenu = null // Закрываем меню
      this.editingMessageId = message.id
      this.editingMessageText = message.content
      this.messageText = message.content
      // Фокусируемся на input
      this.$nextTick(() => {
        const input = this.$el.querySelector('.message-input')
        if (input) {
          input.focus()
          input.setSelectionRange(input.value.length, input.value.length)
        }
      })
    },

    cancelEdit() {
      this.editingMessageId = null
      this.editingMessageText = ''
      this.messageText = ''
    },

    async saveEdit() {
      if (!this.messageText.trim() || this.sending) return

      // Проверяем 24 часа перед сохранением
      const message = this.messages.find((m) => m.id === this.editingMessageId)
      if (!this.canEditMessage(message)) {
        alert('Прошло больше 24 часов. Редактирование недоступно.')
        this.cancelEdit()
        return
      }

      try {
        this.sending = true

        // Вызываем API для редактирования
        const updatedMessage = await animeApi.editMessage(
          this.selectedChatId,
          this.editingMessageId,
          this.messageText.trim(),
        )

        // Обновляем сообщение локально
        const msgIndex = this.messages.findIndex((m) => m.id === this.editingMessageId)
        if (msgIndex !== -1) {
          this.messages[msgIndex] = updatedMessage
        }

        this.cancelEdit()
      } catch (err) {
        console.error('Ошибка редактирования сообщения:', err)
        alert(err.response?.data?.detail || 'Не удалось отредактировать сообщение')
      } finally {
        this.sending = false
      }
    },

    async deleteMessage(messageId) {
      this.activeMessageMenu = null // Закрываем меню

      // Проверяем 24 часа
      const message = this.messages.find((m) => m.id === messageId)
      if (!this.canEditMessage(message)) {
        alert('Прошло больше 24 часов. Удаление недоступно.')
        return
      }

      if (!confirm('Вы уверены, что хотите удалить это сообщение?')) {
        return
      }

      try {
        // Вызываем API для удаления
        await animeApi.deleteMessage(this.selectedChatId, messageId)

        // Удаляем локально
        this.messages = this.messages.filter((m) => m.id !== messageId)

        console.log('Сообщение удалено')
      } catch (err) {
        console.error('Ошибка удаления сообщения:', err)
        alert(err.response?.data?.detail || 'Не удалось удалить сообщение')
      }
    },

    canEditMessage(message) {
      if (!message || message.sender_id !== this.currentUserId) return false

      const messageTime = new Date(message.created_at).getTime()
      const now = new Date().getTime()
      const hoursPassed = (now - messageTime) / (1000 * 60 * 60)

      return hoursPassed < 24
    },

    insertEmoji(emoji) {
      // Вставляем эмодзи в позицию курсора
      const input = this.$el.querySelector('.message-input')
      if (input) {
        const start = input.selectionStart
        const end = input.selectionEnd
        const text = this.messageText

        this.messageText = text.substring(0, start) + emoji + text.substring(end)

        // Возвращаем фокус и устанавливаем курсор после эмодзи
        this.$nextTick(() => {
          input.focus()
          const newPosition = start + emoji.length
          input.setSelectionRange(newPosition, newPosition)
        })
      } else {
        // Если input не найден, просто добавляем в конец
        this.messageText += emoji
      }
    },
  },
}
</script>

<style scoped>
.messages-page {
  position: fixed;
  inset: 0;
  top: 70px;
  overflow: hidden;
}

.messages-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 30px;
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 24px;
  height: 100%;
}

/* ═══════════════════════════════════════════ */
/* ЛЕВАЯ ПАНЕЛЬ - СПИСОК ЧАТОВ */
/* ═══════════════════════════════════════════ */
.chats-sidebar {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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

/* Поиск чатов */
.search-container {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s;
}

.search-bar:focus-within {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 65, 108, 0.3);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.clear-search-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
}

.clear-search-btn:hover {
  background: rgba(255, 65, 108, 0.2);
  transform: rotate(90deg);
}

.clear-search-btn svg {
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.6);
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

.no-results {
  text-align: center;
  padding: 40px 20px;
}

.no-results-icon {
  font-size: 50px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-results h3 {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px;
}

.no-results p {
  font-size: 13px;
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
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.chat-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 16px;
}

.chat-user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
  flex: 1;
}

.chat-user-info:hover {
  opacity: 0.8;
}

/* Меню действий */
.chat-actions {
  position: relative;
}

.action-menu-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s;
}

.action-menu-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.action-menu-btn svg {
  width: 20px;
  height: 20px;
}

.action-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: rgba(20, 20, 20, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px;
  min-width: 220px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.menu-action-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: none;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-action-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.menu-action-item.danger {
  color: #ff4b2b;
}

.menu-action-item.danger:hover {
  background: rgba(255, 75, 43, 0.15);
}

.menu-action-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 8px 0;
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

/* Группа сообщений */
.message-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Разделитель с датой */
.date-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 16px 0;
}

.date-divider::before,
.date-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
}

.date-label {
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: capitalize;
  backdrop-filter: blur(10px);
  white-space: nowrap;
}

.message {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  max-width: 70%;
  position: relative;
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

.message-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  flex: 1;
}

.message.own .message-content {
  align-items: flex-end;
}

.message-bubble {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 12px 16px;
  max-width: 100%;
  min-width: 0;
  overflow-wrap: break-word;
  transition: all 0.3s;
}

.message-bubble.clickable {
  cursor: pointer;
}

.message-bubble.clickable:active {
  transform: scale(0.98);
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
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  max-width: 100%;
}

.message-footer {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: flex-end;
}

.message-time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

.message.own .message-time {
  color: rgba(255, 255, 255, 0.7);
}

/* ✅ Метка "изменено" */
.edited-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
  margin-left: 4px;
}

.message.own .edited-label {
  color: rgba(255, 255, 255, 0.6);
}

.message-status {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.status-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.status-icon.delivered {
  color: rgba(255, 255, 255, 0.5);
}

.status-icon.read {
  color: #4299e1;
}

/* Меню действий под сообщением */
.message-menu {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  padding: 8px;
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.message-menu-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.message-menu-btn svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.message-menu-btn.edit:hover {
  background: rgba(66, 153, 225, 0.2);
  border-color: rgba(66, 153, 225, 0.4);
  color: #4299e1;
  transform: translateY(-2px);
}

.message-menu-btn.delete:hover {
  background: rgba(255, 75, 43, 0.2);
  border-color: rgba(255, 75, 43, 0.4);
  color: #ff4b2b;
  transform: translateY(-2px);
}

/* Предупреждение о блокировке */
.chat-blocked-notice {
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.blocked-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 75, 43, 0.1);
  border: 2px solid rgba(255, 75, 43, 0.3);
  border-radius: 50%;
  color: #ff4b2b;
}

.blocked-icon svg {
  width: 32px;
  height: 32px;
}

.chat-blocked-notice h4 {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.chat-blocked-notice p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  max-width: 400px;
  line-height: 1.5;
}

.view-profile-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
}

.view-profile-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 65, 108, 0.4);
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
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  flex-direction: column;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

/* Индикатор редактирования */
.editing-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 65, 108, 0.1);
  border: 1px solid rgba(255, 65, 108, 0.3);
  border-radius: 12px;
  color: #ff416c;
  font-size: 14px;
  font-weight: 600;
}

.editing-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.editing-indicator span {
  flex: 1;
}

.cancel-edit-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
}

.cancel-edit-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.cancel-edit-btn svg {
  width: 16px;
  height: 16px;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.message-input {
  flex: 1;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  background: rgba(26, 26, 26, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(20px);
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
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
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

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.9);
}

/* Анимации меню и редактирования */
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: all 0.2s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */
@media (max-width: 1024px) {
  .messages-container {
    grid-template-columns: 1fr;
    padding: 20px;
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
    top: 60px;
  }

  .messages-container {
    padding: 15px 20px;
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
