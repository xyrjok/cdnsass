export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname;

    if (url.pathname === '/api/tenant') {
      try {
        // 1. 检查 KV 是否成功绑定！
        if (!env.kv) {
           // 如果没有绑定，返回一段 JSON 提示，而不是让系统崩溃
           return new Response(JSON.stringify({ 
             id: "ERROR", 
             name: "系统错误：未能连接到数据库 (kv 未绑定)", 
             theme: "light" 
           }), { headers: { 'Content-Type': 'application/json' } });
        }

        // 2. 正常查询数据库
        let tenantDataStr = await env.kv.get(hostname);
        
        let tenant;
        if (tenantDataStr) {
          tenant = JSON.parse(tenantDataStr);
        } else {
          tenant = { id: "000", name: "SaaS 平台主站 - 查无此域名", theme: "light" };
        }

        return new Response(JSON.stringify(tenant), {
          headers: { 'Content-Type': 'application/json' }
        });

      } catch (err) {
        // 3. 捕获任何其他代码错误
        return new Response(JSON.stringify({ 
          id: "ERROR", 
          name: "后端抛出异常: " + err.message, 
          theme: "light" 
        }), { headers: { 'Content-Type': 'application/json' } });
      }
    }

    // 其他静态资源请求放行
    return env.ASSETS.fetch(request);
  }
};
