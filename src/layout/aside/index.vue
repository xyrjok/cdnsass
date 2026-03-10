<template>
  <div class="aside-wrapper">
    <div class="title">
      <Icon icon="mdi:email-outline" width="24" height="24" />
      <div>{{ siteName || '控制台' }}</div>
    </div>
    <el-menu :default-active="modelValue" :collapse="false" text-color="#fff" active-text-color="#fff" style="margin-top: 10px; border-right: none;">
      <el-menu-item index="overview" @click="switchTab('overview')" :class="modelValue === 'overview' ? 'choose-item' : ''">
        <Icon icon="hugeicons:mailbox-01" width="20" height="20" />
        <span class="menu-name" style="margin-left: 21px">数据概览</span>
      </el-menu-item>
      
      <div class="manage-title"><span>内容管理</span></div>
      
      <el-menu-item index="content" @click="switchTab('content')" :class="modelValue === 'content' ? 'choose-item' : ''">
        <Icon icon="fluent:data-pie-20-regular" width="22" height="22" />
        <span class="menu-name" style="margin-left: 19px">分发资源</span>
      </el-menu-item>
      <el-menu-item index="settings" @click="switchTab('settings')" :class="modelValue === 'settings' ? 'choose-item' : ''">
        <Icon icon="fluent:settings-48-regular" width="20" height="20" />
        <span class="menu-name" style="margin-left: 21px">站点设置</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
defineProps(['modelValue', 'siteName']);
const emit = defineEmits(['update:modelValue']);
const switchTab = (tab) => { emit('update:modelValue', tab); };
</script>

<style scoped>
.aside-wrapper { height: 100%; background: var(--aside-backgound); width: 260px; overflow-y: auto; }
.title {
  margin: 15px 10px; height: 45px; border-radius: 6px; display: flex; font-size: 16px; font-weight: bold;
  align-items: center; justify-content: center; gap: 5px; color: #ffffff;
  background: linear-gradient(135deg, #1890ff, #3a80dd); /* 原版的标志性渐变蓝 */
  padding: 0 10px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
}
.manage-title { margin-top: 15px; padding-left: 20px; color: #8D9095; font-size: 13px; margin-bottom: 5px;}
.el-menu { background: transparent; }
.el-menu-item { margin: 5px 10px !important; border-radius: 6px; height: 40px; padding: 10px !important; }
.el-menu-item:hover { background: rgba(255, 255, 255, 0.04) !important; }
/* 原版毛玻璃选中效果 */
.choose-item { font-weight: bold; background: rgba(255, 255, 255, 0.08) !important; backdrop-filter: blur(4px); }
</style>
