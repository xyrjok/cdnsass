<template>
  <aside class="aside">
    <ul>
      <li :class="{ active: currentTab === 'overview' }" @click="switchTab('overview')">数据概览</li>
      <li :class="{ active: currentTab === 'content' }" @click="switchTab('content')">内容管理</li>
      <li :class="{ active: currentTab === 'settings' }" @click="switchTab('settings')">站点设置</li>
    </ul>
  </aside>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

// 默认选中 overview
const currentTab = ref(props.modelValue || 'overview');

const switchTab = (tab) => {
  currentTab.value = tab;
  emit('update:modelValue', tab);
};
</script>

<style scoped>
.aside { width: 200px; background: #324157; color: #bfcbd9; }
.aside ul { list-style: none; padding: 0; margin: 0; }
.aside li { padding: 15px 20px; cursor: pointer; border-bottom: 1px solid #283446; transition: all 0.3s; }
.aside li:hover, .aside li.active { background: #242f42; color: #20a0ff; }
</style>
