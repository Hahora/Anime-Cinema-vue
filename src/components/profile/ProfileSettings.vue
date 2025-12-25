<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
      <div class="modal-content settings-modal" @click.stop>
        <div class="modal-header">
          <h2>Настройки профиля</h2>
          <button class="modal-close" @click="$emit('close')">
            <svg viewBox="0 0 24 24">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="settings-group">
            <label>Имя</label>
            <input type="text" v-model="formData.name" class="settings-input" />
          </div>

          <div class="settings-group">
            <label>Биография</label>
            <textarea v-model="formData.bio" class="settings-input" rows="3"></textarea>
          </div>

          <div class="settings-group">
            <label>Аватар URL</label>
            <input type="text" v-model="formData.avatar_url" class="settings-input" />
          </div>

          <div class="settings-group">
            <label>Обложка URL</label>
            <input type="text" v-model="formData.cover_url" class="settings-input" />
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" @click="$emit('close')">Отмена</button>
          <button class="btn-primary" @click="save" :disabled="saving">
            {{ saving ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ProfileSettings',
  props: {
    show: Boolean,
    profile: Object,
  },
  data() {
    return {
      saving: false,
      formData: {
        name: '',
        bio: '',
        avatar_url: '',
        cover_url: '',
      },
    }
  },
  watch: {
    profile: {
      immediate: true,
      handler(newProfile) {
        if (newProfile) {
          this.formData = {
            name: newProfile.name,
            bio: newProfile.bio,
            avatar_url: newProfile.avatar_url,
            cover_url: newProfile.cover_url,
          }
        }
      },
    },
  },
  methods: {
    async save() {
      this.saving = true
      try {
        await this.$emit('save', this.formData)
      } finally {
        this.saving = false
      }
    },
  },
}
</script>

<style scoped>
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
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.modal-close {
  width: 40px;
  height: 40px;
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
}

.modal-close svg {
  width: 20px;
  height: 20px;
  color: white;
}

.modal-body {
  padding: 30px;
}

.settings-group {
  margin-bottom: 24px;
}

.settings-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.settings-input {
  width: 100%;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.3s;
}

.settings-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 65, 108, 0.5);
}

textarea.settings-input {
  resize: vertical;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 65, 108, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
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
</style>
