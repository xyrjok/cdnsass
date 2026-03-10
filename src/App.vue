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
            </div>
          </div>

          <div v-if="activeTab === 'content'">
            <h1>内容管理</h1>
            <hr />
            <p>在这里管理当前域名下的内容。</p>
          </div>

          <div v-if="activeTab === 'settings'">
            <h1>系统设置与空间管理</h1>
            <hr />
            
            <div class="admin-section">
              <h3>🎨 当前空间设置</h3>
              <p style="color: #666; font-size: 14px;">修改当前访问域名的显示名称。</p>
              <div style="margin-top: 10px;">
                <input type="text" v-model="siteConfig.name" class="input-box" />
                <button class="mock-btn" style="margin-left: 10px;" @click="updateCurrentSite">保存修改</button>
              </div>
            </div>

            <div class="admin-section" style="margin-top: 30px; border-top: 1px dashed #ccc; padding-top: 20px;">
              <h3>🚀 开通全新的分发空间 (写入数据库)</h3>
              <p style="color: #666; font-size: 14px;">在这里添加你的新域名，数据将直接持久化到 Cloudflare KV 数据库中。</p>
              
              <div style="margin-top: 15px; display: flex; flex-direction: column; gap: 10px; max-width: 400px;">
                <div>
                  <label>要接入的子域名：</label><br/>
                  <input type="text" v-model="newSite.domain" placeholder="例如: img.yourdomain.com" class="input-box" style="width: 100%;" />
                </div>
                <div>
                  <label>空间名称：</label><br/>
                  <input type="text" v-model="newSite.siteName" placeholder="例如: 我的云端图床" class="input-box" style="width: 100%;" />
                </div>
                <div>
                  <label>空间 ID：</label><br/>
                  <input type="text" v-model="newSite.siteId" placeholder="例如: IMG-001" class="input-box" style="width: 100%;" />
                </div>
                
                <button class="mock-btn" style="background: #67c23a; margin-top: 10px;" @click="createNewSite" :disabled="isSaving">
                  {{ isSaving ? '正在写入数据库...' : '确认开通新空间' }}
                </button>
              </div>
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

const siteConfig = ref({ name: '系统加载中...' });
const currentHost = ref(window.location.hostname);
const activeTab = ref('overview');

// 绑定开通新空间表单的数据
const newSite = ref({ domain: '', siteName: '', siteId: '' });
const isSaving = ref(false);

onMounted(async () => {
  try {
    const res = await fetch('/api/site-info');
    siteConfig.value = await res.json();
    document.title = siteConfig.value.name;
  } catch(e) {
    console.error(e);
  }
});

// 修改当前站点 (复用新增接口)
const updateCurrentSite = async () => {
  await submitToKV(currentHost.value, siteConfig.value.name, siteConfig.value.id);
  document.title = siteConfig.value.name;
};

// 开通新站点
const createNewSite = async () => {
  if(!newSite.value.domain || !newSite.value.siteName) {
    alert("请填写域名和空间名称！");
    return;
  }
  await submitToKV(newSite.value.domain, newSite.value.siteName, newSite.value.siteId);
  // 清空表单
  newSite.value = { domain: '', siteName: '', siteId: '' };
};

// 核心封装：发起 POST 请求给 Worker
const submitToKV = async (domain, siteName, siteId) => {
  isSaving.value = true;
  try {
    const response = await fetch('/api/add-site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain, siteName, siteId })
    });
    const result = await response.json();
    if(result.success) {
      alert("✅ " + result.msg + "\n数据已永久写入 Cloudflare KV 节点。");
    } else {
      alert("❌ 写入失败：" + result.msg);
    }
  } catch(e) {
    alert("网络请求失败：" + e.message);
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.app-layout { display: flex; flex-direction: column; height: 100vh; }
.main-body { display: flex; flex: 1; overflow: hidden; }
.saas-content { padding: 20px; background: white; border-radius: 8px; margin: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); width: 100%; overflow-y: auto; }
.mock-btn { padding: 10px 15px; background: #20a0ff; color: white; border: none; border-radius: 4px; cursor: pointer; transition: 0.3s; }
.mock-btn:hover { opacity: 0.8; }
.mock-btn:disabled { background: #909399; cursor: not-allowed; }
.data-card { background: #f4f4f5; padding: 20px; border-radius: 6px; width: 150px; text-align: center; color: #606266; }
.input-box { padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; outline: none; transition: 0.2s;}
.input-box:focus { border-color: #20a0ff; }
</style>
