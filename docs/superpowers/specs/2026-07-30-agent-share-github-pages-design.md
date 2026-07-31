# P2 作品落地页 GitHub Pages 设计

**日期：** 2026-07-30  
**状态：** 已确认，待实施前书面复核  
**范围：** `LinglongSpriteWebSite` 的静态官网作品页与 GitHub Pages 部署

## 目标

将官网作为纯静态 Vite/React 站点部署到 GitHub Pages。访问 `/agent/:shareKey` 时，页面读取已发布的公开作品，交接 App 所需的邀请码和作品标识，并提供现有 Android APK 下载入口。

## 架构

- GitHub Pages 仅托管构建产物 HTML、CSS 和 JavaScript；不部署服务端代码，也不保存 Supabase 密钥。
- 浏览器从构建时公开变量 `VITE_SHARE_API_URL` 读取作品接口地址：
  `https://zjmprvpmzxlxtotroixt.supabase.co/functions/v1/share-api`。
- 页面只请求 `GET /share-api?shareKey=<validated-shareKey>`，只渲染接口返回的公开白名单字段。
- 下载按钮必须在用户点击事件内写入 `LL_SHARE:<shareKey>|<referralCode>`，随后跳转既有 GitHub Release APK 下载地址。
- Supabase Edge Function 必须允许 GitHub Pages 站点 Origin 的跨域公开 GET 请求；不允许官网使用 `service_role`、`anon key` 或任何用户会话凭据。

## 页面与路由

- 首页继续使用现有截图和 APK 下载能力，主表达调整为“创建一个真正能开口、能看、能使用工具的专属 AI”。
- `/agent/:shareKey` 作品页展示：头像、名称、创作者、人设、最多 3 个从公开模板派生的能力标签、邀请福利、安装说明和下载按钮。
- 加载中显示明确等待状态；未配置接口、网络失败、404 或无效 `shareKey` 显示可恢复错误和普通 APK 下载入口，不伪造作品内容。
- GitHub Pages 项目站点需要将未知深链接回退至应用入口（`404.html` 回退方案），确保直接打开 `/agent/:shareKey` 不落入 GitHub 默认 404。

## 数据与安全边界

- `shareKey` 仅接受 12–64 位字母、数字、下划线和连字符；邀请码与活动参数同样先校验再进入剪贴板或统计属性。
- 不渲染、不缓存、不记录 token、Cookie、MCP endpoint、知识库 ID、聊天记录、支付资料或完整邀请码/`shareKey`。
- 官网不判定 ¥69 资格、不创建订单、不记录敏感增长事件；资格和归因以 App/Supabase 服务端为准。

## 验收

1. GitHub Pages 构建产物可访问首页及直接作品深链接。
2. 有效公开作品能从 `share-api` 加载并只显示允许字段。
3. 无效或下线作品显示可恢复错误，不展示伪造数据。
4. 下载操作写入精确的 `LL_SHARE:` 剪贴板载荷后跳转 APK。
5. 未配置 API 地址、接口失败和 CORS 失败不会阻塞普通 APK 下载。
6. 站点构建、路由/载荷单元测试均通过。
