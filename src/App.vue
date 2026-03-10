<template>
  <div class="app-layout">
    <Header :siteName="siteConfig.name" />
    <div class="main-body">
      
      <Aside v-model="activeTab" />
      
      <Main>
        <div class="saas-content">
          
          <div v-if="activeTab === 'overview'">
            <h1>👋 欢迎回来，这是【{{ siteConfig.name }}】</h1>
            <p>当前分发域名: <strong style="color: #20a0ff;">{{ currentHost }}</strong></p>
            <p>空间标识ID: {{ siteConfig.id }}</p>
            <hr />
            <div style="display: flex; gap: 20px; margin-top: 20px;">
              <div class="data-card">总访问量<br/><h3>1,024</h3></div>
              <div class="data-card">已发布内容<br/><h3>42</h3></div>
              <div class="data-card">云端存储<br/><h3>1.5 GB</h3></div>
            </div>
          </div>

          <div v-if="activeTab === 'content'">
            <h1>内容管理</h1>
            <hr />
            <p style="color: #666;">在这里管理当前域名下的图片、文章或分发资源。</p>
            <button class="mock-btn" @click="showAlert('准备打开文件上传器...')">上传新内容</button>
            <button class="mock-btn" style="background: #67c23a; margin-left: 10px;" @click="showAlert('准备写新文章...')">新建图文</button>
          </div>

          <div v-if="activeTab === 'settings'">
            <h1>站点设置</h1>
            <hr />
            <p style="color: #666;">配置当前个人专属站点的基础参数。</p>
            
            <div style="margin-top: 20px;">
              <label>站点名称：</label>
              <input 
                type="text" 
                v-model="siteConfig.name" 
                style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 250px;" 
              />
            </div>

            <div style="margin-top: 15px;">
              <label>主题色调：</label>
              <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 100px;">
                <option>浅色模式</option>
                <option>深色模式</option>
              </select>
            </div>
            
            <div style="margin-top: 25px;">
              <button class="mock-btn" @click="saveSettings">保存配置</button>
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

// 变量名从 tenant 改为 siteConfig (站点配置)
const siteConfig = ref({ name: '系统加载中...' });
const currentHost = ref(window.location.hostname);
const activeTab = ref('overview');

onMounted(async () => {
  try {
    // 请求新的接口地址
    const res = await fetch('/api/site-info');
    siteConfig.value = await res.json();
    document.title = siteConfig.value.name;
  } catch(e) {
    console.error(e);
  }
});

const showAlert = (msg) => {
  alert(msg);
};

const saveSettings = () => {
  const newName = siteConfig.value.name;
  alert(`保存成功！\n当前空间名称已更新为：【${newName}】\n\n(注意：前端展示已生效，但写入 KV 数据库的接口待后续开发)`);
  document.title = newName;
};
</script>

<style scoped>
.app-layout { display: flex; flex-direction: column; height: 100vh; }
.main-body { display: flex; flex: 1; overflow: hidden; }
.saas-content { padding: 20px; background: white; border-radius: 8px; margin: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); width: 100%; overflow-y: auto; }
.mock-btn { padding: 10px 15px; background: #20a0ff; color: white; border: none; border-radius: 4px; cursor: pointer; transition: 0.3s; }
.mock-btn:hover { opacity: 0.8; }
.data-card { background: #f4f4f5; padding: 20px; border-radius: 6px; width: 150px; text-align: center; color: #606266; }
.data-card h3 { color: #303133; margin: 10px 0 0 0; font-size: 24px;}
</style>
