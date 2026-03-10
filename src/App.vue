<template>
  <div class="app-layout">
    <Header :siteName="tenant.name" />
    <div class="main-body">
      
      <Aside v-model="activeTab" />
      
      <Main>
        <div class="saas-content">
          
          <div v-if="activeTab === 'dashboard'">
            <h1>欢迎来到 {{ tenant.name }}</h1>
            <p>当前访问域名: <strong>{{ currentHost }}</strong></p>
            <p>租户编号: {{ tenant.id }}</p>
            <hr />
            <p style="color: #666; margin-top: 20px;">这里是仪表盘：可以展示今日订单量、访问量等统计数据。</p>
          </div>

          <div v-if="activeTab === 'business'">
            <h1>业务管理</h1>
            <hr />
            <p style="color: #666;">这里是业务管理页面。你可以放一个商品列表，或者分类管理的表格。</p>
            <button class="mock-btn">添加新商品 / 业务</button>
          </div>

          <div v-if="activeTab === 'settings'">
            <h1>系统设置</h1>
            <hr />
            <p style="color: #666;">这里是系统设置。租户可以在这里修改他们的店铺参数。</p>
            <div style="margin-top: 20px;">
              <label>店铺名称：</label>
              <input type="text" :value="tenant.name" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 250px;" />
            </div>
            <div style="margin-top: 15px;">
              <button class="mock-btn">保存设置</button>
            </div>
          </div>

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

// 定义一个变量记录当前选中的页面，默认显示 'dashboard' (仪表盘)
const activeTab = ref('dashboard');

onMounted(async () => {
  try {
    const res = await fetch('/api/tenant');
    tenant.value = await res.json();
    document.title = tenant.value.name;
  } catch(e) {
    console.error(e);
  }
});
</script>

<style scoped>
.app-layout { display: flex; flex-direction: column; height: 100vh; }
.main-body { display: flex; flex: 1; overflow: hidden; }
.saas-content { padding: 20px; background: white; border-radius: 8px; margin: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); width: 100%; overflow-y: auto; }
/* 模拟按钮的简单样式 */
.mock-btn { padding: 10px 15px; background: #20a0ff; color: white; border: none; border-radius: 4px; cursor: pointer; transition: 0.3s; }
.mock-btn:hover { background: #1c8ce0; }
</style>
