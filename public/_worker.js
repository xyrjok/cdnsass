export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname;

    // 接口 1: 读取当前站点信息 (GET)
    if (url.pathname === '/api/site-info' && request.method === 'GET') {
      try {
        if (!env.kv) return new Response(JSON.stringify({ id: "ERROR", name: "数据库未绑定" }));
        let siteDataStr = await env.kv.get(hostname);
        let siteConfig = siteDataStr ? JSON.parse(siteDataStr) : { id: "MAIN-00", name: "个人主控台" };
        return new Response(JSON.stringify(siteConfig), { headers: { 'Content-Type': 'application/json' } });
      } catch (err) {
        return new Response(JSON.stringify({ id: "ERROR", name: "异常: " + err.message }));
      }
    }

    // 接口 2: 新增/修改子站点配置并写入 KV 数据库 (POST)
    if (url.pathname === '/api/add-site' && request.method === 'POST') {
      try {
        // 解析前端传过来的 JSON 数据
        const body = await request.json(); 
        const { domain, siteId, siteName } = body;

        // 校验数据格式
        if (!domain || !siteName) {
           return new Response(JSON.stringify({ success: false, msg: "域名和名称不能为空" }));
        }

        // 核心：使用 put() 方法，直接通过代码把数据写入你的 KV 数据库！
        const configToSave = { id: siteId || "AUTO-ID", name: siteName };
        await env.kv.put(domain, JSON.stringify(configToSave));

        return new Response(JSON.stringify({ success: true, msg: `成功为 ${domain} 开通空间！` }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
         return new Response(JSON.stringify({ success: false, msg: err.message }));
      }
    }

    return env.ASSETS.fetch(request);
  }
};
