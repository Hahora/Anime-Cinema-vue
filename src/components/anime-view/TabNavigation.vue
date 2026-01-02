<template>
  <div class="tab-navigation">
    <div class="tab-buttons">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="$emit('change-tab', tab.id)"
        :class="['tab-btn', { active: currentTab === tab.id }]"
      >
        <!-- Иконки -->
        <IconFileText v-if="tab.icon === 'description'" :size="20" class="tab-icon" />
        <IconSquareStack v-else-if="tab.icon === 'cards'" :size="20" class="tab-icon" />
        <IconStar v-else-if="tab.icon === 'reviews'" :size="20" class="tab-icon" />

        <span class="tab-label">{{ tab.label }}</span>
        <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabNavigation',
  props: {
    currentTab: {
      type: String,
      required: true,
    },
    tabs: {
      type: Array,
      required: true,
    },
  },
  emits: ['change-tab'],
}
</script>

<style scoped>
.tab-navigation {
  margin-bottom: 24px;
}

.tab-buttons {
  display: flex;
  gap: 8px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.05);
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tab-buttons::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  position: relative;
  margin-bottom: -2px;
}

.tab-btn:hover {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.03);
}

.tab-btn.active {
  color: #ff416c;
  border-bottom-color: #ff416c;
}

.tab-icon {
  flex-shrink: 0;
}

.tab-label {
  flex-shrink: 0;
}

.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: rgba(255, 65, 108, 0.2);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  color: #ff416c;
}

.tab-btn.active .tab-count {
  background: rgba(255, 65, 108, 0.3);
}

/* Мобильная версия */
@media (max-width: 768px) {
  .tab-navigation {
    margin-bottom: 16px;
  }

  .tab-buttons {
    gap: 6px;
  }

  .tab-btn {
    padding: 10px 16px;
    font-size: 14px;
  }

  .tab-count {
    font-size: 11px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
  }
}

@media (max-width: 480px) {
  .tab-btn {
    padding: 8px 12px;
    font-size: 13px;
    gap: 6px;
  }

  .tab-count {
    font-size: 10px;
    min-width: 16px;
    height: 16px;
  }
}
</style>
