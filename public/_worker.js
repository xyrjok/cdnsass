export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname;

    // 1. 拦截前端发起的 /api/tenant 请求
    if (url.pathname === '/api/tenant') {
      
      // 使用 env.kv 调用我们在 wrangler.toml 里绑定的数据库
      // 尝试用当前访问的域名 (hostname) 去 KV 里找对应的数据
      let tenantDataStr = await env.kv.get(hostname);
      
      let tenant;
      if (tenantDataStr) {
        // 如果在 KV 里找到了这个域名，解析 JSON
        tenant = JSON.parse(tenantDataStr);
      } else {
        // 如果找不到，就返回你自己的 SaaS 平台主站默认信息
        tenant = { id: "000", name: "SaaS 平台主站 - 请先绑定域名", theme: "light" };
      }

      return new Response(JSON.stringify(tenant), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. 其他请求（如访问网页 html, css, js），直接放行给 Vue 处理
    return env.ASSETS.fetch(request);
  }
};
