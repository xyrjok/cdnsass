<template>
  <div class="app-layout">
    <Header :siteName="tenant.name" />
    <div class="main-body">
      <Aside />
      <Main>
        <div class="saas-content">
          <h1>欢迎来到 {{ tenant.name }}</h1>
          <p>当前访问域名: <strong>{{ currentHost }}</strong></p>
          <p>租户编号: {{ tenant.id }}</p>
          <hr />
          <p>这里可以根据不同的租户，展示不同的业务数据（商品、文章、图片等）。</p>
        </div>
      </Main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from './layout/header/index.vue';
import Aside from './layout/aside/index.vue';
import Main from './layout/main/index.vue';

const tenant = ref({ name: '加载中...' });
const currentHost = ref(window.location.hostname);

onMounted(async () => {
  // 网页加载时，向我们刚才写的 _worker.js 请求当前域名的租户信息
  const res = await fetch('/api/tenant');
  tenant.value = await res.json();
  document.title = tenant.value.name;
});
</script>

<style scoped>
.app-layout { display: flex; flex-direction: column; height: 100vh; }
.main-body { display: flex; flex: 1; overflow: hidden; }
.saas-content { padding: 20px; background: white; border-radius: 8px; margin: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); width: 100%; }
</style>
