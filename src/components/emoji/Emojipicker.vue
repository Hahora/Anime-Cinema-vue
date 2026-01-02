<template>
  <div class="emoji-picker-wrapper">
    <!-- Кнопка открытия -->
    <button @click="togglePicker" class="emoji-btn" type="button" title="Добавить эмодзи">
      <IconSmile :size="22" />
    </button>

    <!-- Picker -->
    <transition name="fade-scale">
      <div v-if="isOpen" class="emoji-picker-container" @click.stop>
        <div class="emoji-picker-header">
          <span>Выберите эмодзи</span>
          <button @click="closePicker" class="close-picker-btn">
            <IconX :size="16" />
          </button>
        </div>
        <div ref="pickerContainer" class="picker-content"></div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'EmojiPicker',
  emits: ['select'],
  data() {
    return {
      isOpen: false,
      picker: null,
    }
  },
  mounted() {
    this.initPicker()

    // Закрытие при клике вне
    this.closeHandler = (e) => {
      if (this.isOpen && !e.target.closest('.emoji-picker-wrapper')) {
        this.closePicker()
      }
    }
    document.addEventListener('click', this.closeHandler)
  },
  beforeUnmount() {
    if (this.closeHandler) {
      document.removeEventListener('click', this.closeHandler)
    }
  },
  methods: {
    async initPicker() {
      try {
        // Динамический импорт для уменьшения размера бандла
        const { Picker } = await import('emoji-picker-element')

        this.picker = new Picker({
          locale: 'ru',
          dataSource: 'https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/ru/cldr/data.json',
          i18n: {
            searchLabel: 'Найти',
            searchDescription: 'Поиск эмодзи',
            skinToneDescription: 'Выбрать тон кожи',
            skinToneLabel: 'Выберите тон кожи (текущий: {skinTone})',
            skinTonesLabel: 'Тона кожи',
            skinTones: [
              'По умолчанию',
              'Светлый',
              'Средне-светлый',
              'Средний',
              'Средне-темный',
              'Темный',
            ],
            categories: {
              custom: 'Пользовательские',
              'smileys-emotion': 'Смайлики и эмоции',
              'people-body': 'Люди и тело',
              'animals-nature': 'Животные и природа',
              'food-drink': 'Еда и напитки',
              'travel-places': 'Путешествия и места',
              activities: 'Активности',
              objects: 'Объекты',
              symbols: 'Символы',
              flags: 'Флаги',
            },
            categoriesLabel: 'Категории',
            emojiUnsupportedMessage: 'Ваш браузер не поддерживает цветные эмодзи.',
          },
        })

        // Обработчик выбора эмодзи
        this.picker.addEventListener('emoji-click', (event) => {
          this.$emit('select', event.detail.unicode)
          this.closePicker()
        })

        // Кастомные стили
        this.picker.classList.add('custom-emoji-picker')
      } catch (err) {
        console.error('Ошибка загрузки emoji picker:', err)
      }
    },

    togglePicker() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.$nextTick(() => {
          const container = this.$refs.pickerContainer
          if (container && this.picker && !container.contains(this.picker)) {
            container.appendChild(this.picker)
          }
        })
      }
    },

    closePicker() {
      this.isOpen = false
    },
  },
}
</script>

<style scoped>
.emoji-picker-wrapper {
  position: relative;
}

.emoji-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
}

.emoji-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.emoji-picker-container {
  position: absolute;
  bottom: calc(100% + 12px);
  right: 0;
  background: rgba(20, 20, 20, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.emoji-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.emoji-picker-header span {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.close-picker-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s;
}

.close-picker-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.picker-content {
  max-height: 400px;
  overflow: hidden;
}

/* Кастомизация emoji-picker-element */
.picker-content :deep(emoji-picker) {
  --background: transparent;
  --border-color: transparent;
  --button-hover-background: rgba(255, 255, 255, 0.1);
  --button-active-background: rgba(255, 65, 108, 0.2);
  --indicator-color: #ff416c;
  --input-border-color: rgba(255, 255, 255, 0.1);
  --input-font-color: white;
  --input-placeholder-color: rgba(255, 255, 255, 0.4);
  --outline-color: rgba(255, 65, 108, 0.5);
  --category-font-color: rgba(255, 255, 255, 0.8);
  --emoji-size: 1.5rem;

  width: 350px;
  height: 400px;
  border: none;
}

/* Скрываем иконку поиска */
.picker-content :deep(emoji-picker .search-wrapper .search-icon) {
  display: none;
}

.picker-content :deep(emoji-picker input.search) {
  padding-left: 12px;
}

/* Скрываем кнопку выбора тона кожи */
.picker-content :deep(emoji-picker .skintone-button-wrapper) {
  display: none;
}

.picker-content :deep(emoji-picker .search-row) {
  padding-right: 12px;
}

/* Анимация */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(5px) scale(0.98);
}

/* Адаптив */
@media (max-width: 768px) {
  .emoji-picker-container {
    position: fixed;
    inset: 0;
    bottom: 0;
    right: 0;
    left: 0;
    border-radius: 0;
    display: flex;
    flex-direction: column;
    z-index: 10000;
  }

  .emoji-picker-header {
    padding: 16px;
    flex-shrink: 0;
  }

  .picker-content {
    flex: 1;
    max-height: none;
    display: flex;
  }

  .picker-content :deep(emoji-picker) {
    width: 100%;
    height: 100%;
    flex: 1;
  }
}
</style>
