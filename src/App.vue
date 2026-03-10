<template>
  <el-container class="app-layout">
    <el-aside width="260px" style="height: 100vh;">
      <Aside v-model="activeTab" :siteName="siteConfig.name" />
    </el-aside>
    
    <el-container style="background: var(--base-fill);">
      <el-header class="custom-header">
        <div class="header-left">
          <span style="font-weight: bold; font-size: 16px;">{{ currentHost }} 分发节点</span>
        </div>
        <div class="header-right">
          <div class="icon-item" @click="toggleDark">
            <Icon :icon="isDark ? 'mingcute:sun-fill' : 'solar:moon-linear'" width="22" height="22" />
          </div>
          <div class="avatar">
            <div class="avatar-text">Admin</div>
          </div>
        </div>
      </el-header>
      
      <el-main>
        <div class="content-card">
          <div v-if="activeTab === 'overview'">
             <h2 style="margin-bottom: 20px;">欢迎回到数据中心</h2>
             <el-row :gutter="20">
               <el-col :span="8"><el-card shadow="hover"><h3>节点 ID</h3><p style="color: #1890ff; font-size: 20px; margin-top: 10px;">{{ siteConfig.id }}</p></el-card></el-col>
               <el-col :span="8"><el-card shadow="hover"><h3>总访问量</h3><p style="font-size: 20px; margin-top: 10px;">1,024</p></el-card></el-col>
             </el-row>
          </div>
          <div v-if="activeTab === 'content'">
             <h2 style="margin-bottom: 20px;">分发资源管理</h2>
             <el-empty description="暂无资源，点击上传" />
          </div>
          <div v-if="activeTab === 'settings'">
             <h2 style="margin-bottom: 20px;">空间设置 (直连 KV)</h2>
             <el-form label-width="100px" style="max-width: 400px;">
               <el-form-item label="当前空间名">
                 <el-input v-model="siteConfig.name" />
               </el-form-item>
               <el-form-item>
                 <el-button type="primary" @click="updateCurrentSite">保存修改</el-button>
               </el-form-item>
             </el-form>
             <el-divider border-style="dashed" />
             <h3 style="margin: 20px 0;">🚀 开通新子域名</h3>
             <el-form label-width="100px" style="max-width: 400px;">
                <el-form-item label="子域名"><el-input v-model="newSite.domain" placeholder="img.yourdomain.com" /></el-form-item>
                <el-form-item label="空间名称"><el-input v-model="newSite.siteName" /></el-form-item>
                <el-form-item label="空间 ID"><el-input v-model="newSite.siteId" /></el-form-item>
                <el-form-item>
                  <el-button type="success" :loading="isSaving" @click="createNewSite">立即开通</el-button>
                </el-form-item>
             </el-form>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import Aside from './layout/aside/index.vue';
import { ElMessage } from 'element-plus';

const siteConfig = ref({ name: '加载中...', id: '' });
const currentHost = ref(window.location.hostname);
const activeTab = ref('overview');
const newSite = ref({ domain: '', siteName: '', siteId: '' });
const isSaving = ref(false);
const isDark = ref(false);

onMounted(async () => {
  try {
    const res = await fetch('/api/site-info');
    siteConfig.value = await res.json();
    document.title = siteConfig.value.name;
  } catch(e) { console.error(e); }
});

// 原版极其酷炫的日夜切换动画逻辑
const toggleDark = (e) => {
  const nextIsDark = !isDark.value;
  const root = document.documentElement;
  
  if (!document.startViewTransition) {
    root.classList.toggle('dark', nextIsDark);
    isDark.value = nextIsDark;
    return;
  }

  const x = e.clientX; const y = e.clientY;
  const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  
  root.setAttribute('data-theme-to', nextIsDark ? 'dark' : 'light');
  root.style.setProperty('--vt-x', `${x}px`);
  root.style.setProperty('--vt-y', `${y}px`);
  root.style.setProperty('--vt-end-radius', `${endRadius + 10}px`);

  const transition = document.startViewTransition(() => {
    root.classList.toggle('dark', nextIsDark);
    isDark.value = nextIsDark;
  });
  transition.finished.finally(() => { root.removeAttribute('data-theme-to'); });
};

const updateCurrentSite = async () => { await submitToKV(currentHost.value, siteConfig.value.name, siteConfig.value.id); };
const createNewSite = async () => {
  if(!newSite.value.domain || !newSite.value.siteName) return ElMessage.warning("请填写完整信息");
  await submitToKV(newSite.value.domain, newSite.value.siteName, newSite.value.siteId);
  newSite.value = { domain: '', siteName: '', siteId: '' };
};

const submitToKV = async (domain, siteName, siteId) => {
  isSaving.value = true;
  try {
    const response = await fetch('/api/add-site', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain, siteName, siteId })
    });
    const result = await response.json();
    if(result.success) ElMessage.success(result.msg);
    else ElMessage.error(result.msg);
  } catch(e) { ElMessage.error("请求失败"); } 
  finally { isSaving.value = false; }
};
</script>

<style scoped>
.app-layout { height: 100vh; }
.custom-header { background: var(--el-bg-color); border-bottom: 1px solid var(--light-border-color); display: flex; justify-content: space-between; align-items: center; padding: 0 20px; height: 60px;}
.header-right { display: flex; align-items: center; gap: 20px; }
.icon-item { cursor: pointer; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 6px; transition: 0.2s;}
.icon-item:hover { background: var(--base-fill); }
.avatar-text { background: var(--base-fill); padding: 5px 12px; border-radius: 8px; border: 1px solid var(--dark-border); font-weight: bold; font-size: 13px; cursor: pointer;}
.content-card { background: var(--el-bg-color); border-radius: 8px; padding: 24px; min-height: calc(100vh - 100px); box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
</style>
