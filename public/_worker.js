export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname;

    // 将 API 名字改为 site-info，更符合个人站点的语义
    if (url.pathname === '/api/site-info') {
      try {
        if (!env.kv) {
           return new Response(JSON.stringify({ 
             id: "ERROR", 
             name: "系统错误：数据库未绑定", 
           }), { headers: { 'Content-Type': 'application/json' } });
        }

        let siteDataStr = await env.kv.get(hostname);
        
        let siteConfig;
        if (siteDataStr) {
          siteConfig = JSON.parse(siteDataStr);
        } else {
          // 找不到当前域名的配置时，显示的默认个人主站信息
          siteConfig = { id: "MAIN-00", name: "个人主控台 - 等待域名接入" };
        }

        return new Response(JSON.stringify(siteConfig), {
          headers: { 'Content-Type': 'application/json' }
        });

      } catch (err) {
        return new Response(JSON.stringify({ 
          id: "ERROR", 
          name: "环境异常: " + err.message, 
        }), { headers: { 'Content-Type': 'application/json' } });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
