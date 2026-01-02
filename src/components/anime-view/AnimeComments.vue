<template>
  <div class="anime-comments">
    <div class="comments-header">
      <h2 class="comments-title">
        <IconMessageSquare :size="26" class="title-icon" />
        Комментарии
        <span class="comments-count" v-if="comments.length">{{ comments.length }}</span>
      </h2>
    </div>

    <!-- Форма добавления комментария -->
    <div class="add-comment-form">
      <div class="user-avatar-small">
        <IconUser :size="24" class="avatar-icon" />
      </div>
      <div class="form-wrapper">
        <textarea
          v-model="newComment"
          placeholder="Напишите свой комментарий..."
          class="comment-input"
          rows="3"
        ></textarea>
        <div class="form-actions">
          <button @click="addComment" :disabled="!newComment.trim()" class="submit-btn">
            <IconSend :size="18" class="submit-icon" />
            Отправить
          </button>
        </div>
      </div>
    </div>

    <!-- Список комментариев -->
    <div class="comments-list" v-if="comments.length">
      <div v-for="comment in sortedComments" :key="comment.id" class="comment-item">
        <div class="comment-avatar">
          {{ comment.userName ? comment.userName[0].toUpperCase() : 'A' }}
        </div>
        <div class="comment-content">
          <div class="comment-header">
            <h4 class="comment-author">{{ comment.userName || 'Аноним' }}</h4>
            <span class="comment-time">{{ formatTime(comment.date) }}</span>
          </div>
          <p class="comment-text">{{ comment.text }}</p>
          <div class="comment-actions">
            <button class="comment-action-btn" @click="likeComment(comment.id)">
              <IconThumbsUp :size="14" class="action-icon" />
              <span>{{ comment.likes || 0 }}</span>
            </button>
            <button class="comment-action-btn" @click="replyToComment(comment.id)">
              <IconCornerUpLeft :size="14" class="action-icon" />
              <span>Ответить</span>
            </button>
          </div>

          <!-- Ответы на комментарий -->
          <div v-if="comment.replies && comment.replies.length" class="replies">
            <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
              <div class="comment-avatar small">
                {{ reply.userName ? reply.userName[0].toUpperCase() : 'A' }}
              </div>
              <div class="comment-content">
                <div class="comment-header">
                  <h4 class="comment-author">{{ reply.userName || 'Аноним' }}</h4>
                  <span class="comment-time">{{ formatTime(reply.date) }}</span>
                </div>
                <p class="comment-text">{{ reply.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div class="empty-comments" v-else>
      <div class="empty-icon">💭</div>
      <h3>Комментариев пока нет</h3>
      <p>Станьте первым, кто оставит комментарий!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnimeComments',
  props: {
    animeId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      newComment: '',
      comments: [
        {
          id: 1,
          userName: 'Дмитрий',
          text: 'Отличное аниме! Жду продолжения 🔥',
          date: new Date(),
          likes: 5,
          replies: [
            {
              id: 11,
              userName: 'Елена',
              text: 'Согласна! Особенно понравилась главная героиня',
              date: new Date(Date.now() - 3600000),
            },
          ],
        },
        {
          id: 2,
          userName: 'Анна',
          text: 'Кто-нибудь знает, когда выйдет следующая серия?',
          date: new Date(Date.now() - 7200000),
          likes: 2,
          replies: [],
        },
      ],
    }
  },
  computed: {
    sortedComments() {
      return [...this.comments].sort((a, b) => b.date - a.date)
    },
  },
  methods: {
    addComment() {
      if (!this.newComment.trim()) return

      const comment = {
        id: Date.now(),
        userName: 'Вы',
        text: this.newComment,
        date: new Date(),
        likes: 0,
        replies: [],
      }

      this.comments.unshift(comment)
      this.newComment = ''
    },

    likeComment(commentId) {
      const comment = this.comments.find((c) => c.id === commentId)
      if (comment) {
        comment.likes = (comment.likes || 0) + 1
      }
    },

    replyToComment(commentId) {
      console.log('Reply to comment:', commentId)
      // Логика ответа на комментарий
    },

    formatTime(date) {
      const now = new Date()
      const diff = now - date
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)

      if (minutes < 1) return 'только что'
      if (minutes < 60) return `${minutes} мин. назад`
      if (hours < 24) return `${hours} ч. назад`
      if (days < 7) return `${days} дн. назад`

      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
      })
    },
  },
}
</script>

<style scoped>
.anime-comments {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 30px;
  margin-top: 40px;
}

.comments-header {
  margin-bottom: 24px;
}

.comments-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.title-icon {
  color: #ff416c;
}

.comments-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  background: rgba(255, 65, 108, 0.2);
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  color: #ff416c;
}

.add-comment-form {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px;
}

.user-avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-icon {
  color: rgba(255, 255, 255, 0.6);
}

.form-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: all 0.3s;
}

.comment-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 65, 108, 0.5);
}

.comment-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.submit-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 65, 108, 0.4);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 12px;
}

.comment-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.comment-avatar.small {
  width: 36px;
  height: 36px;
  font-size: 16px;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-author {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  color: white;
}

.comment-time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.comment-text {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 12px;
  word-break: break-word;
}

.comment-actions {
  display: flex;
  gap: 12px;
}

.comment-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.comment-action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.replies {
  margin-top: 16px;
  padding-left: 20px;
  border-left: 2px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reply-item {
  display: flex;
  gap: 10px;
}

.empty-comments {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 16px;
}

.empty-comments h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px;
  color: white;
}

.empty-comments p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

/* Адаптив */
@media (max-width: 768px) {
  .anime-comments {
    padding: 24px;
    margin-top: 32px;
  }

  .comments-title {
    font-size: 20px;
  }

  .add-comment-form {
    padding: 12px;
  }

  .comment-item {
    gap: 10px;
  }

  .comment-avatar {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .replies {
    padding-left: 16px;
  }
}

@media (max-width: 480px) {
  .anime-comments {
    padding: 16px;
    border-radius: 16px;
    margin-top: 24px;
  }

  .comments-title {
    font-size: 18px;
    flex-wrap: wrap;
  }

  .add-comment-form {
    flex-direction: column;
    padding: 12px;
  }

  .user-avatar-small {
    align-self: flex-start;
  }

  .comment-input {
    min-height: 100px;
    font-size: 14px;
  }

  .submit-btn {
    width: 100%;
    justify-content: center;
  }

  .comment-avatar {
    width: 36px;
    height: 36px;
    font-size: 15px;
  }

  .comment-avatar.small {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .comment-author {
    font-size: 14px;
  }

  .comment-text {
    font-size: 13px;
  }

  .replies {
    padding-left: 12px;
  }

  .empty-icon {
    font-size: 48px;
  }

  .empty-comments h3 {
    font-size: 18px;
  }
}
</style>
