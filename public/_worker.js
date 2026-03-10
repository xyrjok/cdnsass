export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname;

    // 1. 拦截前端发起的 /api/tenant 请求，根据当前访问的域名返回不同的租户数据
    if (url.pathname === '/api/tenant') {
      // 真实场景下，你应该从 env.DB (Cloudflare D1 数据库) 读取
      // 这里我们在代码里写死几个模拟的客户域名作为演示
      const mockDatabase = {
        "app.customer1.com": { id: "T-001", name: "客户1的发卡站", theme: "dark" },
        "shop.customer2.net": { id: "T-002", name: "客户2的素材网", theme: "light" }
      };

      // 如果匹配不到，就返回一个默认的主站信息
      const tenant = mockDatabase[hostname] || { id: "000", name: "SaaS 平台主站", theme: "light" };

      return new Response(JSON.stringify(tenant), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. 其他请求（如访问网页 html, css, js），直接放行给 Cloudflare Pages
    return env.ASSETS.fetch(request);
  }
};
