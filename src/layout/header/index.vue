<template>
  <header class="header">
    <div class="logo">SaaS {{ siteName }}</div>
    <div class="user-info">admin</div>
  </header>
</template>
<script setup>
defineProps(['siteName']);
</script>
<style scoped>
.header { height: 60px; background: #242f42; color: white; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; }
.logo { font-size: 20px; font-weight: bold; }
</style>
