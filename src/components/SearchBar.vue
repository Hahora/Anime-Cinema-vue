<template>
  <div class="search-bar">
    <div class="search-container">
      <input
        v-model="query"
        @keyup.enter="handleSearch"
        @input="onInput"
        placeholder="Поиск аниме... (Наруто, Атака титанов)"
        class="search-input"
      />
      <button @click="handleSearch" :disabled="loading || !query.trim()" class="search-btn">
        <span v-if="!loading">🔍 Найти</span>
        <span v-else class="loader-small"></span>
      </button>
    </div>
    <div v-if="showSuggestions" class="suggestions">
      <div class="suggestion-item" v-for="s in suggestions" :key="s" @click="selectSuggestion(s)">
        {{ s }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    loading: Boolean,
  },
  data() {
    return {
      query: '',
      showSuggestions: false,
      suggestions: [
        'Наруто',
        'Атака титанов',
        'Блич',
        'Ван Пис',
        'Магическая битва',
        'Моя геройская академия',
      ],
    }
  },
  methods: {
    handleSearch() {
      if (this.query.trim()) {
        this.$emit('search', this.query)
        this.showSuggestions = false
      }
    },
    onInput() {
      this.showSuggestions = this.query.length > 0
    },
    selectSuggestion(s) {
      this.query = s
      this.handleSearch()
    },
  },
}
</script>

<style scoped>
.search-bar {
  position: relative;
  max-width: 700px;
  margin: 0 auto 50px;
}

.search-container {
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  padding: 8px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  box-shadow: 0 0 20px rgba(255, 65, 108, 0.3);
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
}

.search-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 65, 108, 0.4);
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loader-small {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background: rgba(20, 20, 20, 0.95);
  border-radius: 12px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  z-index: 100;
}

.suggestion-item {
  padding: 14px 20px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background: rgba(255, 65, 108, 0.1);
  padding-left: 25px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
