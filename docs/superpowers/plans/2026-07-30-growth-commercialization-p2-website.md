# P2 作品落地页与 GitHub Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 GitHub Pages 上交付安全的 `/agent/:shareKey` 静态作品页，将公开作品、安全剪贴板归因与 APK 下载连接为可直接访问的闭环。

**Architecture:** Vite/React 根据 `window.location.pathname` 渲染首页或作品页。浏览器只使用构建时公开的 `VITE_SHARE_API_URL` 请求 Supabase `share-api`；所有作品字段在 `src/agentShare.js` 验证后才传给页面。GitHub Pages 工作流构建 `dist`，并用静态 `404.html` 将项目子路径下的深链接重定向回 Vite 应用入口。

**Tech Stack:** Vite 6、React 19、Node built-in test runner、GitHub Actions / GitHub Pages。

## Global Constraints

- `VITE_SHARE_API_URL` 的生产值必须是 `https://zjmprvpmzxlxtotroixt.supabase.co/functions/v1/share-api`；它是公开 URL，不得添加 Supabase key、服务端凭据或用户会话。
- 作品页只接受并渲染 `shareKey`、`creatorName`、`referralCode` 与白名单化 `template`；不得渲染、存储或上报 token、Cookie、MCP endpoint、知识库 ID、聊天或支付资料。
- `shareKey` 仅允许 12–64 位 `[A-Za-z0-9_-]`；邀请码仅允许 5–12 位大写字母、数字、下划线或连字符，以兼容现有 `ABCDE` 与 `FRIEND-7` 归因码。
- APK 下载必须在同一用户点击事件内先写入 `LL_SHARE:<shareKey>|<referralCode>`，再跳转既有 GitHub Release URL；任何剪贴板错误都不能阻断下载。
- 无效路径、未配置 API、非 2xx、非法响应和 CORS/网络失败必须显示可恢复错误与普通 APK 下载；不得使用伪造作品数据。
- GitHub Pages 的 Pages Source 使用 GitHub Actions，且 Supabase Edge Function 的 CORS 必须允许最终 `https://iEthereal.github.io` Origin。

---

### Task 1: 安全作品路由、响应校验与剪贴板载荷

**Files:**
- Create: `src/agentShare.js`
- Create: `src/agentShare.test.js`
- Modify: `src/referral.js`
- Modify: `src/referral.test.js`

**Interfaces:**
- Produces: `isShareKey(value): boolean`、`readAgentShareRoute(pathname): string`、`buildAgentSharePayload(shareKey, referralCode): string`、`loadPublicAgentShare({baseUrl, shareKey, fetchImpl}): Promise<PublicAgentShare>`。
- `PublicAgentShare` has only `{shareKey, creatorName, referralCode, template}`; `template` is a string-only record containing only `name`, `character`, `voice`, `language`, `assistantName`, `icon`, `model`, and `themeColor`.

- [ ] **Step 1: Write the failing route, payload and response-boundary tests**

```js
test('accepts a valid work route and creates the exact App handoff', () => {
  assert.equal(readAgentShareRoute('/agent/abc_DEF-1234'), 'abc_DEF-1234')
  assert.equal(buildAgentSharePayload('abc_DEF-1234', 'FRIEND7'), 'LL_SHARE:abc_DEF-1234|FRIEND7')
  assert.equal(readAgentShareRoute('/agent/../../secret'), '')
})

test('drops unapproved public response fields', async () => {
  const share = await loadPublicAgentShare({
    baseUrl: 'https://project.supabase.co/functions/v1/share-api',
    shareKey: 'abc_DEF-1234',
    fetchImpl: async () => new Response(JSON.stringify({share: {
      shareKey: 'abc_DEF-1234', creatorName: '阿玲', referralCode: 'FRIEND7',
      template: {name: '睡前故事', token: 'must-not-pass'}, mcpEndpoint: 'must-not-pass',
    }})),
  })
  assert.deepEqual(share.template, {name: '睡前故事'})
  assert.equal('mcpEndpoint' in share, false)
})
```

- [ ] **Step 2: Run the focused tests and verify they fail because the module does not exist**

Run: `node --test src/agentShare.test.js src/referral.test.js`
Expected: `ERR_MODULE_NOT_FOUND` for `src/agentShare.js`.

- [ ] **Step 3: Implement minimal strict helpers**

```js
const shareKeyPattern = /^[A-Za-z0-9_-]{12,64}$/
const referralPattern = /^[A-Z0-9_-]{5,12}$/

export function buildAgentSharePayload(shareKey, referralCode) {
  return isShareKey(shareKey) && referralPattern.test(referralCode)
    ? `LL_SHARE:${shareKey}|${referralCode}`
    : ''
}
```

`loadPublicAgentShare` must construct the URL with `new URL(baseUrl)`, use `searchParams.set('shareKey', shareKey)`, throw on absent base URL/non-OK/invalid body, and return a newly built allowlisted object rather than spreading API data.

- [ ] **Step 4: Run focused tests and confirm the new behavior passes**

Run: `node --test src/agentShare.test.js src/referral.test.js`
Expected: all tests pass.

- [ ] **Step 5: Commit the independently testable boundary**

```bash
git add src/agentShare.js src/agentShare.test.js src/referral.js src/referral.test.js
git commit -m "feat: add safe agent share route helpers"
```

### Task 2: 作品页、主页定位与安全下载交接

**Files:**
- Modify: `src/main.jsx`
- Modify: `src/styles.css`
- Modify: `src/referral.test.js`
- Test: `src/agentShare.test.js`
- Test: `src/referral.test.js`

**Interfaces:**
- Consumes: Task 1 `readAgentShareRoute`、`loadPublicAgentShare` and `buildAgentSharePayload`.
- Produces: `AgentLandingPage`, `copyThenDownload`, loading/error/success page states, and homepage headline `创建一个真正能开口、能看、能使用工具的专属 AI`.

- [ ] **Step 1: Write failing structural tests for the P2 rendering contract**

```js
test('ships the P2 landing page, public API configuration, and safe handoff', () => {
  const source = readFileSync(new URL('./main.jsx', import.meta.url), 'utf8')
  assert.match(source, /function AgentLandingPage/)
  assert.match(source, /VITE_SHARE_API_URL/)
  assert.match(source, /创建一个真正能开口、能看、能使用工具的专属 AI/)
  assert.match(source, /LL_SHARE:/)
  assert.match(source, /loadPublicAgentShare/)
})
```

- [ ] **Step 2: Run the tests and verify they fail because the component is absent**

Run: `node --test src/agentShare.test.js src/referral.test.js`
Expected: assertion failure for `function AgentLandingPage`.

- [ ] **Step 3: Implement only the designed page states and download path**

```jsx
const shareKey = readAgentShareRoute(window.location.pathname)
if (shareKey) return <AgentLandingPage shareKey={shareKey} />
```

`AgentLandingPage` loads with `loadPublicAgentShare({baseUrl: import.meta.env.VITE_SHARE_API_URL, shareKey, fetchImpl: window.fetch})`; success renders icon/name/creator/persona and three derived constant labels, while failure renders an explanation plus `<DownloadButton />`. `copyThenDownload` calls `navigator.clipboard.writeText(payload).catch(() => {})` before the browser follows the existing anchor. Keep the existing product screenshots and GitHub Release APK URL.

- [ ] **Step 4: Add page styles without new external dependencies**

Add scoped `.agent-landing`, `.agent-card`, `.agent-tags`, `.agent-error`, and responsive mobile rules to `src/styles.css`. Use React text nodes for API values; do not introduce `dangerouslySetInnerHTML`.

- [ ] **Step 5: Run regression tests and production build**

Run: `node --test src/agentShare.test.js src/referral.test.js src/productStage.test.js && npm run build`
Expected: all Node tests pass and Vite writes `dist/`.

- [ ] **Step 6: Commit the visual and handoff behavior**

```bash
git add src/main.jsx src/styles.css src/referral.test.js
git commit -m "feat: add public agent work landing page"
```

### Task 3: GitHub Pages Actions deployment and deep-link fallback

**Files:**
- Create: `404.html`
- Create: `.github/workflows/deploy-pages.yml`
- Modify: `vite.config.js`
- Modify: `README.md`
- Test: `src/referral.test.js`

**Interfaces:**
- Consumes: Vite `base: '/LinglongSpriteWebSite/'` and the public environment variable.
- Produces: GitHub Actions deployment to Pages and an unknown-route redirect preserving the `/agent/:shareKey` pathname.

- [ ] **Step 1: Write failing checks for the fallback and deployment configuration**

```js
test('ships Pages fallback and public share API deployment configuration', () => {
  assert.match(readFileSync(new URL('../404.html', import.meta.url), 'utf8'), /sessionStorage/)
  const workflow = readFileSync(new URL('../.github/workflows/deploy-pages.yml', import.meta.url), 'utf8')
  assert.match(workflow, /actions\/deploy-pages/)
  assert.match(workflow, /VITE_SHARE_API_URL/)
})
```

- [ ] **Step 2: Run the tests and verify failure because the Pages files are absent**

Run: `node --test src/referral.test.js`
Expected: `ENOENT` for `404.html`.

- [ ] **Step 3: Add static Pages fallback and deployment workflow**

`404.html` must save `location.pathname + location.search + location.hash` in `sessionStorage` and use `location.replace('/LinglongSpriteWebSite/')`. Application startup must consume and clear that stored path before route selection. The workflow must use `actions/checkout`, `actions/setup-node`, `npm ci`, `npm run build`, `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`; set `VITE_SHARE_API_URL: ${{ vars.VITE_SHARE_API_URL }}` only for the build step.

- [ ] **Step 4: Document exact one-time repository settings**

Add to `README.md`: Pages Source = GitHub Actions; repository Actions variable `VITE_SHARE_API_URL=https://zjmprvpmzxlxtotroixt.supabase.co/functions/v1/share-api`; Supabase CORS allow origin `https://iEthereal.github.io`; no Supabase key is required or permitted in the repository.

- [ ] **Step 5: Verify artifacts and build**

Run: `node --test src/agentShare.test.js src/referral.test.js src/productStage.test.js && npm run build`
Expected: tests pass, build succeeds, and `dist/404.html` exists after adding it to the Vite public asset flow.

- [ ] **Step 6: Commit the deployable static site configuration**

```bash
git add 404.html .github/workflows/deploy-pages.yml vite.config.js README.md src/main.jsx src/referral.test.js
git commit -m "ci: deploy agent landing pages to GitHub Pages"
```

## Plan self-review

- Spec coverage: Task 1 enforces all public data and clipboard boundaries; Task 2 supplies the homepage/works page states and non-blocking APK fallback; Task 3 makes direct project-site deep links deployable via GitHub Pages and documents CORS/environment configuration.
- Placeholder scan: no unspecified implementation or testing steps remain.
- Interface consistency: Task 2 consumes the four explicitly named Task 1 helpers; Task 3 changes startup routing only after Task 2 introduces route selection.
