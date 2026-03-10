<template>
  <aside class="aside">
    <ul>
      <li :class="{ active: currentTab === 'dashboard' }" @click="switchTab('dashboard')">仪表盘</li>
      <li :class="{ active: currentTab === 'business' }" @click="switchTab('business')">业务管理</li>
      <li :class="{ active: currentTab === 'settings' }" @click="switchTab('settings')">系统设置</li>
    </ul>
  </aside>
</template>

<script setup>
import { ref } from 'vue';

// 接收外部传进来的当前菜单状态
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const currentTab = ref(props.modelValue || 'dashboard');

// 菜单点击事件
const switchTab = (tab) => {
  currentTab.value = tab;
  emit('update:modelValue', tab); // 把点击的菜单英文名传给 App.vue
};
</script>

<style scoped>
.aside { width: 200px; background: #324157; color: #bfcbd9; }
.aside ul { list-style: none; padding: 0; margin: 0; }
/* 增加了 transition 让颜色渐变更顺滑 */
.aside li { padding: 15px 20px; cursor: pointer; border-bottom: 1px solid #283446; transition: all 0.3s; }
/* 鼠标悬浮和当前选中时，变成深色背景和蓝色字体 */
.aside li:hover, .aside li.active { background: #242f42; color: #20a0ff; }
</style>
