import React from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowDownToLine, Bot, Camera, ChevronRight, Globe2, Mic2, ShieldCheck, Sparkles, TextCursorInput, Waves } from 'lucide-react'
import './styles.css'

const apkUrl = '/LinglongSpriteWebSite/downloads/linglong-mas-debug.apk'
const qrUrl = '/LinglongSpriteWebSite/downloads/qr-download.svg'

const capabilities = [
  { icon: Mic2, title: '小智语音对话', text: '实测 v2 协议链路，按住说话、连续通话、TTS 播放与打断体验。' },
  { icon: TextCursorInput, title: '文本 MCP', text: '不方便开口时，把输入文字作为 MCP 上下文交给小智总结回答。' },
  { icon: Camera, title: '视觉识别', text: '支持服务端下发 vision endpoint 后拍照/选图上传，让画面进入对话。' },
  { icon: Globe2, title: 'Web 搜索', text: '客户端搜索结果回传给小智，由小智整合为自然语言回复。' },
]

const flow = [
  'Android-first 全屏体验',
  '小智云端语音与 TTS',
  'MCP 工具扩展',
  '视觉/搜索/文本统一对话',
]

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="玲珑 MAS 首页">
        <span className="brand-orb">玲</span>
        <span>玲珑 MAS</span>
      </a>
      <nav>
        <a href="#features">能力</a>
        <a href="#design">设计</a>
        <a href="#download">下载</a>
        <a href="https://github.com/iEthereal/LinglongSpriteWebSite" target="_blank" rel="noreferrer">GitHub</a>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="hero section-shell">
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={16} /> Android-first AI Assistant</div>
        <h1>智掌全局，<br />玲珑入微。</h1>
        <p className="hero-lead">一款为手机场景重新构建的小智语音助手，把语音、文本、视觉与 MCP 工具连接成自然的一问一答。</p>
        <div className="hero-actions">
          <a className="primary-cta" href={apkUrl} download><ArrowDownToLine size={18} />下载 Android 测试版 APK</a>
          <a className="ghost-cta" href="#features">了解能力<ChevronRight size={17} /></a>
        </div>
        <p className="release-note">当前为公开测试包。安装时 Android 可能提示“未知来源”，请仅在可信设备上测试。</p>
      </div>
      <div className="hero-stage" aria-label="玲珑 MAS 产品展示">
        <div className="halo halo-one" />
        <div className="halo halo-two" />
        <div className="phone-frame">
          <div className="phone-screen">
            <div className="phone-top"><span />玲珑 MAS</div>
            <div className="assistant-card">
              <img src="/LinglongSpriteWebSite/assets/linglong-listening.png" alt="玲珑形象" />
              <div>
                <b>正在听你说</b>
                <span>Protocol v2 · MCP ready</span>
              </div>
            </div>
            <div className="bubble bubble-user">帮我看看这张图里有什么</div>
            <div className="bubble bubble-ai">已读取视觉结果，正在为你总结。</div>
            <div className="wave"><i /><i /><i /><i /><i /><i /></div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className="features section-shell">
      <div className="section-heading">
        <span>Core capabilities</span>
        <h2>不是一个入口，<br />而是一套会说话的工具系统。</h2>
      </div>
      <div className="cap-grid">
        {capabilities.map((item) => {
          const Icon = item.icon
          return <article className="cap-card" key={item.title}><Icon size={24} /><h3>{item.title}</h3><p>{item.text}</p></article>
        })}
      </div>
      <div className="flow-strip">
        {flow.map((item, index) => <React.Fragment key={item}><span>{item}</span>{index < flow.length - 1 && <ChevronRight size={16} />}</React.Fragment>)}
      </div>
    </section>
  )
}

function DesignShowcase() {
  return (
    <section id="design" className="design section-shell">
      <div className="section-heading section-heading--center">
        <span>Designed for mobile</span>
        <h2>从桌面实验，到真正的手机 App 体验。</h2>
        <p>保留玲珑的轻奢玻璃视觉，同时让安卓端拥有更接近原生 App 的层级、设置、权限和多模态操作。</p>
      </div>
      <div className="showcase-grid">
        <div className="showcase-large">
          <img src="/LinglongSpriteWebSite/assets/app-glass-ui.png" alt="玲珑 MAS UI 设计稿" />
        </div>
        <div className="avatar-column">
          <div className="avatar-tile"><img src="/LinglongSpriteWebSite/assets/linglong-idle.png" alt="玲珑待机状态" /><span>Idle</span></div>
          <div className="avatar-tile"><img src="/LinglongSpriteWebSite/assets/linglong-speaking.png" alt="玲珑说话状态" /><span>Speaking</span></div>
          <div className="avatar-tile"><img src="/LinglongSpriteWebSite/assets/linglong-searching.png" alt="玲珑搜索状态" /><span>Searching</span></div>
        </div>
      </div>
    </section>
  )
}

function Download() {
  return (
    <section id="download" className="download section-shell">
      <div className="download-panel">
        <div className="download-copy">
          <div className="eyebrow"><ShieldCheck size={16} /> Public test build</div>
          <h2>现在开始，在 Android 上测试玲珑 MAS。</h2>
          <p>下载 APK 或用手机扫描二维码。当前版本用于功能验收与朋友内测，后续会替换为正式签名包。</p>
          <a className="primary-cta" href={apkUrl} download><ArrowDownToLine size={18} />下载 Android 测试版 APK</a>
        </div>
        <div className="qr-card">
          <img src={qrUrl} alt="玲珑 MAS APK 下载二维码" />
          <span>扫码下载 APK</span>
        </div>
      </div>
    </section>
  )
}

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <DesignShowcase />
        <Download />
      </main>
      <footer>
        <div><b>玲珑 MAS</b><span>Linglong Master Agent System</span></div>
        <p>测试版仅用于体验验证。隐私、授权码、正式发布渠道将在后续版本完善。</p>
      </footer>
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
