import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowDownToLine,
  Bot,
  Camera,
  ChevronRight,
  FileText,
  Globe2,
  Mic2,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  TextCursorInput,
  Video,
  Image as ImageIcon,
  Settings,
  Box,
  Phone,
  Plus,
  Wifi,
  Battery,
  Signal,
  Play,
} from 'lucide-react'
import './styles.css'

const base = '/LinglongSpriteWebSite'
const apkUrl = `${base}/downloads/linglong-mas-debug.apk`
const qrUrl = `${base}/downloads/qr-download.svg`

const capabilities = [
  { icon: Mic2, title: '小智语音对话', text: '实测 v2 协议链路，按住说话、连续通话、TTS 播放与用户打断流程完整可用。' },
  { icon: TextCursorInput, title: '文本 MCP', text: '不方便开口时，把输入文字作为 MCP 上下文交给小智总结回答，而不是回退本机模型。' },
  { icon: Camera, title: '视觉识别', text: '服务端下发 vision endpoint 后，支持拍照与选图上传，让画面自然进入对话。' },
  { icon: Globe2, title: 'Web 搜索', text: '客户端搜索结果回传给小智，由小智整合为自然语言语音或文本回复。' },
]

const avatars = [
  { src: `${base}/assets/linglong-idle.png`, label: 'Idle' },
  { src: `${base}/assets/linglong-speaking.png`, label: 'Speaking' },
  { src: `${base}/assets/linglong-searching.png`, label: 'Searching' },
]

function Header() {
  return (
    <header className="site-header">
      <div className="header-inner shell">
        <a className="brand" href="#top" aria-label="玲珑 MAS 首页">
          <span className="brand-mark">玲</span>
          <span>玲珑 MAS</span>
        </a>
        <nav className="site-nav" aria-label="主导航">
          <a href="#features">能力</a>
          <a href="#design">设计</a>
          <a href="#download">下载</a>
          <a className="nav-cta" href="https://github.com/iEthereal/LinglongSpriteWebSite" target="_blank" rel="noreferrer">GitHub ↗</a>
        </nav>
      </div>
    </header>
  )
}

function AppPhonePreview({ compact = false }) {
  return (
    <div className={compact ? 'device device-compact' : 'device'} aria-label="玲珑 MAS 安卓界面预览">
      <div className="device-metal" />
      <div className="device-screen">
        <div className="statusbar">
          <span>12:07</span>
          <div className="status-icons"><Signal size={18} /><Wifi size={17} /><Battery size={21} /></div>
        </div>
        <div className="app-top">
          <span className="app-logo">◇</span>
          <div><b>玲珑 MAS</b><small>手机 AI 语音助手</small></div>
        </div>
        <div className="connect-pill"><i /> 小智未连接 <span>文本</span><b>语音</b></div>
        <div className="quick-row">
          <span><Plus size={15} />新对话</span><span>hello he</span><span>我回来啦。对。</span><span>没。</span>
        </div>
        <div className="chat-card">
          <div className="msg user"><small>12:05 <em>语音</em></small>hello hello,你都会什么呀？做个自我介绍吧。</div>
          <div className="msg ai">
            <small><em>语音</em><time>12:05</time></small>
            <p>😆哈啰哈啰！我是小智啦，你的专属玲珑MAS小助手～我可以陪你聊天、讲笑话、放音乐，还能帮你查天气、搜新闻，甚至能看懂你的照片喔！</p>
            <span className="audio-chip"><Play size={13} />22s · 66KB</span>
          </div>
        </div>
        <div className="tool-strip">
          <span><FileText size={18}/>文本</span><span><Mic2 size={19}/>语音</span><span><ImageIcon size={18}/>选图</span><span><Camera size={18}/>拍照</span><span><ShieldCheck size={18}/>视觉</span><span><Search size={19}/>搜索</span><span><Video size={18}/>视频</span>
        </div>
        <div className="voice-panel">
          <div className="voice-tabs"><span><Phone size={16}/>连续通话</span><b><Mic2 size={17}/>按住说话</b><small>TX 140帧/23KB · RX 359帧/66KB</small></div>
          <div className="mic-orb"><Mic2 size={44}/></div>
          <strong>未连接：请先连接小智</strong>
          <footer><span>未连接</span><button>连接</button></footer>
        </div>
        <div className="tabbar"><b><MessageCircle size={22}/>对话</b><span><Bot size={22}/>模型</span><span><Settings size={22}/>设置</span></div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section id="top" className="hero shell">
      <div className="hero-copy">
        <div className="hero-badge fade-up"><Sparkles size={15} /> Android-first AI Assistant</div>
        <h1 className="fade-up delay-1">智掌全局，<br />玲珑入微。</h1>
        <p className="hero-lead fade-up delay-2">一款为手机场景重新构建的小智语音助手，把语音、文本、视觉与 MCP 工具连接成自然的一问一答。</p>
        <div className="hero-actions fade-up delay-3">
          <a className="btn-primary" href={apkUrl} download><ArrowDownToLine size={18} />下载 Android 测试版 APK</a>
          <a className="btn-ghost" href="#features">了解能力<ChevronRight size={17} /></a>
        </div>
        <p className="release-note fade-up delay-4">当前为公开测试包，安装时 Android 可能提示“未知来源”，请仅在可信设备上测试。</p>
      </div>
      <div className="hero-visual fade-up delay-2">
        <div className="halo halo-a" /><div className="halo halo-b" />
        <AppPhonePreview compact />
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className="section shell">
      <div className="section-head fade-up">
        <span className="eyebrow"><Box size={15} /> Core Capabilities</span>
        <h2>不是一个入口，<br />而是一套会说话的工具系统。</h2>
      </div>
      <div className="feature-grid">
        {capabilities.map(({ icon: Icon, title, text }, index) => (
          <article className={`feature-card fade-up delay-${Math.min(index + 1, 4)}`} key={title}>
            <div className="feature-icon"><Icon size={22} /></div>
            <h3>{title}</h3><p>{text}</p>
          </article>
        ))}
      </div>
      <div className="flow-line fade-up delay-4">
        {['Android-first 全屏体验', '小智云端语音与 TTS', 'MCP 工具扩展', '视觉 / 搜索 / 文本统一对话'].map((item) => <span key={item}>{item}</span>)}
      </div>
    </section>
  )
}

function DesignShowcase() {
  return (
    <section id="design" className="section shell design-section">
      <div className="section-head center fade-up">
        <span className="eyebrow">Designed for Mobile</span>
        <h2>从桌面实验，到真正的<br />手机 App 体验。</h2>
        <p>官网展示不再使用抽象占位界面，而是复刻当前 Android 端真实聊天、工具栏与语音面板的产品结构。</p>
      </div>
      <div className="showcase-wrap">
        <div className="showcase-phone fade-up delay-1"><AppPhonePreview /></div>
        <div className="sprite-col">
          {avatars.map((item, index) => (
            <div className={`sprite-tile fade-up delay-${index + 1}`} key={item.label}>
              <i /><img src={item.src} alt={`玲珑 ${item.label} 状态`} loading="lazy" /><span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Download() {
  return (
    <section id="download" className="section shell">
      <div className="download-panel fade-up">
        <div>
          <span className="download-badge"><ShieldCheck size={15} /> Public Test Build</span>
          <h2>现在开始，<br />在 Android 上测试玲珑 MAS。</h2>
          <p>下载 APK 或用手机扫描二维码。当前版本用于功能验收与朋友内测，后续会替换为正式签名包。</p>
          <a className="btn-primary" href={apkUrl} download><ArrowDownToLine size={18} />下载 Android 测试版 APK</a>
        </div>
        <div className="qr-card"><img src={qrUrl} alt="玲珑 MAS APK 下载二维码" /><span>扫码下载 APK</span></div>
      </div>
    </section>
  )
}

function App() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    document.querySelectorAll('.fade-up').forEach((node) => observer.observe(node))
    document.querySelectorAll('.hero .fade-up').forEach((node) => setTimeout(() => node.classList.add('visible'), 50))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Header />
      <main><Hero /><hr className="divider" /><Features /><hr className="divider" /><DesignShowcase /><hr className="divider" /><Download /></main>
      <footer className="footer shell">
        <div><b>玲珑 MAS</b><span>Linglong Master Agent System</span></div>
        <p>测试版仅用于体验验证。隐私保护、授权码机制、正式发布渠道将在后续版本完善。</p>
      </footer>
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
