# 作品落地页与下载承接（官网）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** 让 /agent/:shareKey 成为可展示、可下载并携带邀请/作品归因的官网落地页，同时将首页表达调整为创建并分享专属 AI。

**Architecture:** Vite 在运行时根据 path 判定首页或作品页；作品页只读取 App/Supabase 的 share-api 公开、已白名单化数据，并将 shareKey 与邀请码编码为 App 可识别的 LL_SHARE: 剪贴板载荷。官网不持有 Supabase 服务凭据，也不自行决定邀请或价格资格。

**Tech Stack:** Vite 6、React 19、Node built-in test runner。

## Global Constraints

- 作品页 API 基地址只从 VITE_SHARE_API_URL 读取；未配置或请求失败时必须显示可恢复错误，不得使用伪造作品数据。
- 作品页仅渲染 shareKey、creatorName、referralCode、template；绝不渲染、记录或缓存角色 token、MCP endpoint、知识库、聊天记录或支付信息。
- 下载按钮必须先在用户手势内写入 LL_SHARE:shareKey|referralCode，再跳转既有 GitHub Release APK 链接。
- shareKey、ref 和 campaign 必须经格式校验后才进入 URL、剪贴板或统计属性；不信任的查询参数不能插入 HTML。

---

### Task 1: 作品路由、公共 API 客户端与剪贴板载荷

**Files:**
- Create: src/agentShare.js, src/agentShare.test.js
- Modify: src/referral.js, src/referral.test.js

**Interfaces:** Produces readAgentShareRoute, isShareKey, buildAgentSharePayload, loadPublicAgentShare.

- [ ] **Step 1: Write the failing tests**

Test a valid /agent/abc_DEF-1234 path, exact LL_SHARE:abc_DEF-1234|FRIEND7 payload, and rejection of a path separator key.

- [ ] **Step 2: Run tests and verify failure**

Run: node --test src/agentShare.test.js src/referral.test.js

- [ ] **Step 3: Implement strict helpers**

The route accepts only 12-64 alphanumeric, underscore or dash characters. The loader URL-encodes the key, rejects non-OK response, and validates the returned key.

- [ ] **Step 4: Run tests and verify pass**

Run: node --test src/agentShare.test.js src/referral.test.js

- [ ] **Step 5: Commit**

Commit message: feat: add public agent share route helpers

### Task 2: 作品落地页与以作品为中心的首页文案

**Files:**
- Modify: src/main.jsx, src/styles.css, src/referral.test.js
- Test: src/agentShare.test.js, src/referral.test.js

**Interfaces:** Consumes Task 1 route/API/payload helpers and existing APK URL. Produces loading/error/success AgentLandingPage and homepage hero whose primary promise is creating and sharing an AI agent.

- [ ] **Step 1: Write the failing structural test**

Require AgentLandingPage, the P2 headline 创建一个真正能开口、能看、能使用工具的专属 AI, LL_SHARE:, and VITE_SHARE_API_URL.

- [ ] **Step 2: Run tests and verify failure**

Run: node --test src/agentShare.test.js src/referral.test.js

- [ ] **Step 3: Implement landing page and homepage positioning**

The success view shows icon, name, creator, short persona, three derived capability tags, invited-user benefit, install steps and a download action. The error view keeps a normal APK fallback. Update headline and primary CTA without removing current screenshots.

- [ ] **Step 4: Verify the site**

Run: node --test src/agentShare.test.js src/referral.test.js && npm run build

- [ ] **Step 5: Commit**

Commit message: feat: add agent work landing pages

## Plan self-review

- Task 1 locks shared path, API and clipboard formats before rendering.
- Task 2 delivers public landing, safe download handoff and P2 positioning shift.

