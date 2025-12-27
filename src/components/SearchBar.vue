<template>
  <div class="search-bar">
    <div class="search-container">
      <input
        v-model="query"
        @keyup.enter="handleSearch"
        @input="onInput"
        @focus="showSuggestions = query.length > 0"
        @blur="hideSuggestions"
        placeholder="Поиск аниме... (Наруто, Атака титанов)"
        class="search-input"
      />
      <button @click="handleSearch" :disabled="!query.trim()" class="search-btn">🔍 Найти</button>
    </div>

    <!-- ✅ Умные подсказки с фильтрацией -->
    <div v-if="showSuggestions && filteredSuggestions.length" class="suggestions">
      <div
        class="suggestion-item"
        v-for="s in filteredSuggestions"
        :key="s"
        @mousedown.prevent="selectSuggestion(s)"
      >
        <svg viewBox="0 0 24 24" class="suggestion-icon">
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
            fill="currentColor"
          />
        </svg>
        <span class="suggestion-text">{{ s }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  data() {
    return {
      query: '',
      showSuggestions: false,
      // ✅ Расширенный список популярных аниме
      allSuggestions: [
        'Наруто',
        'Наруто: Ураганные хроники',
        'Атака титанов',
        'Блич',
        'Ван Пис',
        'Магическая битва',
        'Моя геройская академия',
        'Токийский гуль',
        'Стальной алхимик',
        'Код Гиас',
        'Тетрадь смерти',
        'Клинок, рассекающий демонов',
        'Хантер × Хантер',
        'Врата Штейна',
        'Покемон',
        'Сага о Винланде',
        'Мобильный воин Гандам',
        'Ковбой Бибоп',
        'Евангелион',
        'Созданный в Бездне',
        'Волейбол',
        'Баскетбол Куроко',
        'Реинкарнация безработного',
        'Этот замечательный мир',
        'Семь смертных грехов',
        'Sword Art Online',
        'Повелитель',
        'Goblin Slayer',
        'Re:Zero',
        'Боруто',
        'Черный клевер',
        'Чёрный клевер',
        'Моб Психо 100',
        'Ванпанчмен',
        'Наездница драконов',
        'Фейри Тейл',
        'Доктор Стоун',
        'Обещанный Неверленд',
        'Паразит',
        'Монстр',
        'Ягодки',
        'Психопаспорт',
        'Дьявольские возлюбленные',
        'Синий экзорцист',
      ],
    }
  },
  computed: {
    // ✅ Умная фильтрация подсказок
    filteredSuggestions() {
      if (!this.query.trim()) {
        return this.allSuggestions.slice(0, 8) // Топ-8 популярных
      }

      const searchLower = this.query.toLowerCase().trim()

      // Нормализация текста (ё -> е)
      const normalize = (text) => text.replace(/ё/gi, 'е').toLowerCase()

      const normalizedSearch = normalize(searchLower)

      // Фильтруем и сортируем по релевантности
      return this.allSuggestions
        .filter((s) => {
          const normalizedSuggestion = normalize(s)
          return normalizedSuggestion.includes(normalizedSearch)
        })
        .sort((a, b) => {
          const aNorm = normalize(a)
          const bNorm = normalize(b)

          // Приоритет: совпадение с начала строки
          const aStarts = aNorm.startsWith(normalizedSearch)
          const bStarts = bNorm.startsWith(normalizedSearch)

          if (aStarts && !bStarts) return -1
          if (!aStarts && bStarts) return 1

          // Затем по длине (короче = релевантнее)
          return a.length - b.length
        })
        .slice(0, 6) // Показываем максимум 6 подсказок
    },
  },
  methods: {
    handleSearch() {
      const trimmed = this.query.trim()
      if (trimmed) {
        // ✅ Редирект на страницу поиска
        this.$router.push({ path: '/search', query: { q: trimmed } })
        this.showSuggestions = false
      }
    },

    onInput() {
      this.showSuggestions = true
    },

    selectSuggestion(s) {
      this.query = s
      this.showSuggestions = false
      this.handleSearch()
    },

    hideSuggestions() {
      // Задержка чтобы клик по подсказке успел сработать
      setTimeout(() => {
        this.showSuggestions = false
      }, 200)
    },
  },
}
</script>

<style scoped>
.search-bar {
  position: relative;
  max-width: 700px;
  margin: 0 auto 50px;
  z-index: 100;
}

.search-container {
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  padding: 8px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.search-container:focus-within {
  border-color: rgba(255, 65, 108, 0.5);
  box-shadow: 0 0 30px rgba(255, 65, 108, 0.2);
}

.search-input {
  flex: 1;
  padding: 16px 20px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  border: none;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;
}

.search-input:focus {
  background: rgba(0, 0, 0, 0.6);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-btn {
  padding: 16px 32px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: none;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 16px;
  white-space: nowrap;
}

.search-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 65, 108, 0.4);
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ═══════════════════════════════════════════ */
/* ПОДСКАЗКИ */
/* ═══════════════════════════════════════════ */
.suggestions {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(20, 20, 20, 0.98);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background: rgba(255, 65, 108, 0.15);
  padding-left: 28px;
  color: white;
}

.suggestion-icon {
  width: 18px;
  height: 18px;
  color: #ff416c;
  flex-shrink: 0;
}

.suggestion-text {
  font-size: 15px;
  font-weight: 500;
}

/* ═══════════════════════════════════════════ */
/* АДАПТИВ */
/* ═══════════════════════════════════════════ */
@media (max-width: 768px) {
  .search-container {
    padding: 6px;
  }

  .search-input {
    padding: 14px 16px;
    font-size: 15px;
  }

  .search-btn {
    padding: 14px 24px;
    font-size: 15px;
  }

  .suggestion-item {
    padding: 12px 16px;
  }
}
</style>
