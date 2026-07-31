# 正式版截图官网 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将官网改为基于真实 Android 截图的正式版产品展示，并可靠地把 `?ref=` 推荐码交接给 APK 首启邀请归因。

**Architecture:** `src/main.jsx` 维护截图数据、页面组件和推荐码 React 状态；`src/styles.css` 提供截图画廊和首屏主视觉的响应式布局。推荐码仅被规范化、显示、复制为 `LL_REF:<code>`，不在网页中持久化或创建邀请关系。

**Tech Stack:** React 19、Vite 6、CSS、lucide-react。

## Global Constraints

- 所有下载入口必须指向 `/LinglongSpriteWebSite/downloads/linglong-mas.apk`，文案为“Android 正式版 APK”。
- 必须只使用 `public/assets` 的五张新 PNG：`语音通话.png`、`文本聊天.png`、`发现智能体.png`、`列表对话.png`、`会员与邀请.png`。
- 不得引用已删除的 `linglong-*.png` 或 `app-glass-ui.png`，也不得恢复手绘手机模拟界面。
- `ref` 为空白时视为无推荐码；带码时写入的互操作格式固定为 `LL_REF:<推荐码>`。
- 网站不得保存推荐码、不得创建会员或邀请关系；归因由 Android App 的已有逻辑完成。

---

### Task 1: 抽出推荐码解析与剪贴板交接

**Files:**
- Create: `src/referral.js`
- Create: `src/referral.test.js`
- Modify: `src/main.jsx:1-240`

**Interfaces:**
- Produces: `readReferralCode(search: string): string`，空白或没有 `ref` 时返回空字符串。
- Produces: `referralPayload(code: string): string`，返回 `LL_REF:<trimmed code>` 或空字符串。
- Consumes: `navigator.clipboard.writeText`，只能由用户点击或页面首次加载的尽力尝试调用。

- [ ] **Step 1: 写失败测试**

```js
import assert from 'node:assert/strict'
import test from 'node:test'
import {readReferralCode, referralPayload} from './referral'

test('trims a referral code from the URL query', () => {
  assert.equal(readReferralCode('?ref=%20FRIEND-7%20'), 'FRIEND-7')
  assert.equal(readReferralCode('?ref=%20%20'), '')
  assert.equal(readReferralCode(''), '')
})

test('formats the APK handoff payload', () => {
  assert.equal(referralPayload(' FRIEND-7 '), 'LL_REF:FRIEND-7')
  assert.equal(referralPayload(' '), '')
})
```

- [ ] **Step 2: 确认测试失败**

Run: `node --test src/referral.test.js`

Expected: FAIL，提示 `ERR_MODULE_NOT_FOUND` 或 `readReferralCode is not a function`，因为实现尚不存在。

- [ ] **Step 3: 实现纯函数并由 React 使用它**

```js
// src/referral.js
export function readReferralCode(search) {
  return new URLSearchParams(search).get('ref')?.trim() ?? ''
}

export function referralPayload(code) {
  const normalized = code.trim()
  return normalized ? `LL_REF:${normalized}` : ''
}
```

在 `App` 中用 `readReferralCode(window.location.search)` 初始化 `referralCode`；删除 `main.jsx` 尾部直接操作 DOM 的 IIFE。将 `copyReferralCode` 作为回调传给首屏组件：当 `referralPayload(referralCode)` 非空且 `navigator.clipboard?.writeText` 可用时写入该 payload，并把按钮文案暂时更新为“已复制”。

- [ ] **Step 4: 确认测试通过**

Run: `node --test src/referral.test.js`

Expected: PASS，2 个测试通过。

- [ ] **Step 5: 提交任务**

```bash
git add src/referral.js src/referral.test.js src/main.jsx
git commit -m "feat: hand off website referral codes to app"
```

### Task 2: 用真实截图重建首屏和产品展示区

**Files:**
- Modify: `src/main.jsx:28-190`
- Modify: `src/styles.css:1-260`

**Interfaces:**
- Consumes: 截图对象 `{src, title, description, featured?: boolean}`。
- Produces: `ProductGallery()`，为全部五张截图输出带标题和说明的语义化 `figure`。
- Consumes: `Hero({referralCode, onCopyReferral})`，在有推荐码时显示推荐横幅和复制按钮。

- [ ] **Step 1: 写失败的静态展示断言**

```js
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'

test('ships all five current product screenshots and no removed artwork', () => {
  const source = readFileSync(new URL('./main.jsx', import.meta.url), 'utf8')
  for (const asset of ['语音通话.png', '文本聊天.png', '发现智能体.png', '列表对话.png', '会员与邀请.png']) {
    assert.match(source, new RegExp(asset))
  }
  assert.doesNotMatch(source, /linglong-(idle|speaking|searching|listening)\.png|app-glass-ui\.png/)
  assert.match(source, /Android 正式版 APK/)
})
```

将该测试追加到 `src/referral.test.js`，与 Task 1 的 Node 内置测试共用 `test` 和 `assert` 导入。

- [ ] **Step 2: 确认测试失败**

Run: `node --test src/referral.test.js`

Expected: FAIL，因为 `main.jsx` 仍含旧的 `linglong-*.png` 引用和“测试版”文案。

- [ ] **Step 3: 写最小的页面实现**

在 `main.jsx` 定义：

```jsx
const productScreens = [
  {src: `${base}/assets/语音通话.png`, title: '语音通话', description: '自然连续对话与实时语音反馈。', featured: true},
  {src: `${base}/assets/文本聊天.png`, title: '文本聊天', description: '语音之外，也能在同一智能体上下文中继续交流。', featured: true},
  {src: `${base}/assets/发现智能体.png`, title: '发现智能体', description: '按场景选择适合你的专属智能体。'},
  {src: `${base}/assets/列表对话.png`, title: '列表对话', description: '按智能体和会话快速回到上下文。'},
  {src: `${base}/assets/会员与邀请.png`, title: '会员与邀请', description: '推荐加入后，在 App 中完成邀请关系关联。'},
]
```

移除 `avatars`、`AppPhonePreview` 和旧 `DesignShowcase`；新增 `ProductGallery`，以 `<figure className={featured ? 'product-shot product-shot-featured' : 'product-shot'}>` 渲染图片、标题与描述。`Hero` 直接渲染“语音通话”主图，并且所有下载按钮统一使用“下载 Android 正式版 APK”。

在 `styles.css` 移除 `.device*`、`.sprite-*` 和旧展示区规则；新增 `.hero-shot`、`.product-gallery`、`.product-shot`、`.product-shot-featured`、`.product-shot img` 与移动端断点。桌面端使用 12 列 CSS grid，让两张 featured 截图各占 6 列、其余三张各占 4 列；窄屏下改为单列，图片 `width: 100%; height: auto; object-fit: contain`。

- [ ] **Step 4: 确认测试通过**

Run: `node --test src/referral.test.js`

Expected: PASS，推荐码纯函数与静态素材/发布文案断言均通过。

- [ ] **Step 5: 提交任务**

```bash
git add src/main.jsx src/styles.css src/referral.test.js
git commit -m "feat: showcase released app with current screenshots"
```

### Task 3: 构建并人工验证发布体验

**Files:**
- Modify: `README.md`（若仍写有测试版 APK，更新为正式版下载说明）

**Interfaces:**
- Consumes: 已构建的 Vite 静态站点。
- Produces: 不含旧素材引用、带正式版 APK 路径的 `dist`。

- [ ] **Step 1: 构建生产站点**

Run: `npm run build`

Expected: exit code 0，并产生 `dist`。

- [ ] **Step 2: 检查构建产物没有旧资源路径**

Run: `rg -n "linglong-(idle|speaking|searching|listening)\\.png|app-glass-ui\\.png|测试版" dist README.md`

Expected: 没有命中；若 README 保留历史说明，先在该文件将“测试版”替换为“正式版”后再运行。

- [ ] **Step 3: 运行本地预览并验证两种推荐码状态**

Run: `npm run dev -- --host 127.0.0.1`

Expected: 浏览器检查 `/LinglongSpriteWebSite/` 没有推荐横幅；`/LinglongSpriteWebSite/?ref=FRIEND-7` 显示代码和“复制推荐码”按钮。确认复制内容为 `LL_REF:FRIEND-7`，下载按钮和二维码均指向 `downloads/linglong-mas.apk`。

- [ ] **Step 4: 在 375px 与 1440px 宽度检查布局**

Expected: 五张图均加载且不裁切；移动端卡片单列、桌面端 featured 图与普通图层级清晰；所有下载 CTA 显示“Android 正式版 APK”。

- [ ] **Step 5: 提交任务**

```bash
git add README.md
git commit -m "docs: mark website download as production release"
```
