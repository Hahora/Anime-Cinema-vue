<template>
  <div class="section wall-section">
    <div class="section-header">
      <h2 class="section-title">
        <IconMessageSquare :size="28" class="section-icon" />
        Стена
      </h2>
    </div>

    <!-- Форма создания поста -->
    <div class="create-post">
      <img :src="avatar" alt="" class="post-avatar" />
      <div class="post-input-wrapper">
        <textarea
          v-model="newPost"
          placeholder="Что нового?"
          class="post-input"
          rows="3"
        ></textarea>
        <div class="post-actions">
          <button class="post-action-btn">
            <IconImage :size="20" />
          </button>
          <button class="btn-post" :disabled="!newPost.trim()" @click="addPost">
            Опубликовать
          </button>
        </div>
      </div>
    </div>

    <!-- Посты -->
    <div class="posts-list">
      <div v-for="post in posts" :key="post.id" class="post-item">
        <img :src="avatar" alt="" class="post-avatar" />
        <div class="post-content">
          <div class="post-header">
            <div class="post-author">
              <span class="author-name">{{ userName }}</span>
              <span class="post-date">{{ post.date }}</span>
            </div>
          </div>
          <p class="post-text">{{ post.text }}</p>
          <div class="post-footer">
            <button class="post-react-btn">
              <IconHeart :size="18" />
              {{ post.likes }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileWall',
  props: {
    avatar: String,
    userName: String,
  },
  data() {
    return {
      newPost: '',
      posts: [
        {
          id: 1,
          text: 'Только что закончил смотреть "Стальной алхимик". Невероятное аниме! 🔥',
          date: '2 часа назад',
          likes: 24,
        },
        {
          id: 2,
          text: 'Кто-нибудь смотрел новый сезон? Что думаете?',
          date: 'вчера',
          likes: 12,
        },
      ],
    }
  },
  methods: {
    addPost() {
      if (!this.newPost.trim()) return

      this.posts.unshift({
        id: Date.now(),
        text: this.newPost,
        date: 'только что',
        likes: 0,
      })

      this.newPost = ''
    },
  },
}
</script>

<style scoped>
.section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.section-icon {
  color: #ff416c;
}

.create-post {
  display: flex;
  gap: 16px;
  margin-bottom: 30px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
}

.post-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.post-input-wrapper {
  flex: 1;
}

.post-input {
  width: 100%;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 15px;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 12px;
  transition: all 0.3s;
}

.post-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 65, 108, 0.5);
}

.post-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.post-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.post-action-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.post-action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.post-action-btn {
  color: rgba(255, 255, 255, 0.7); /* Цвет для иконки */
}

.btn-post {
  margin-left: auto;
  padding: 10px 24px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-post:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 65, 108, 0.3);
}

.btn-post:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-item {
  display: flex;
  gap: 16px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  transition: all 0.3s;
}

.post-item:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
}

.post-content {
  flex: 1;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.post-author {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name {
  font-size: 16px;
  font-weight: 700;
  color: white;
}

.post-date {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.post-text {
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 16px;
}

.post-footer {
  display: flex;
  gap: 20px;
}

.post-react-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.post-react-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}
</style>
