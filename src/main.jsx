import React, {useCallback, useEffect, useRef, useState} from 'react'
import {createRoot} from 'react-dom/client'
import {
  ArrowDownToLine,
  Box,
  Camera,
  ChevronRight,
  Check,
  Copy,
  Globe2,
  Mic2,
  ShieldCheck,
  Sparkles,
  TextCursorInput,
} from 'lucide-react'
import {readReferralCode, referralPayload} from './referral.js'
import {shortestStageDistance, stageSlotForItem} from './productStage.js'
import './styles.css'

const base = '/LinglongSpriteWebSite'
const apkUrl = 'https://github.com/iEthereal/LinglongSpriteWebSite/releases/latest/download/linglong-mas.apk'
const qrUrl = `${base}/downloads/qr-website.png`

const capabilities = [
  {icon: Mic2, title: '小智语音对话', text: '连续通话、按住说话、TTS 播放与用户打断，在一条自然对话链路中完成。'},
  {icon: TextCursorInput, title: '文本 MCP', text: '不方便开口时，把文字作为上下文交给小智继续回答。'},
  {icon: Camera, title: '视觉识别', text: '拍照或选图后，让画面自然进入当前对话。'},
  {icon: Globe2, title: 'Web 搜索', text: '将搜索结果回传给小智，整合成语音或文字回复。'},
]

const productScreens = [
  {id: 'voice', src: `${base}/assets/语音通话.png`, title: '语音通话', description: '自然连续对话与实时语音反馈。'},
  {id: 'text', src: `${base}/assets/文本聊天.png`, title: '文本聊天', description: '语音之外，也能在同一智能体上下文中继续交流。'},
  {id: 'agents', src: `${base}/assets/发现智能体.png`, title: '发现智能体', description: '按场景选择适合你的专属智能体。'},
  {id: 'list', src: `${base}/assets/列表对话.png`, title: '列表对话', description: '按智能体和会话快速回到上下文。'},
  {id: 'invite', src: `${base}/assets/会员与邀请.png`, title: '会员与邀请', description: '推荐加入后，在 App 中完成邀请关系关联。'},
]

const STAGE_TRANSITION_MS = 680

function Header() {
  return <header className="site-header"><div className="header-inner shell">
    <a className="brand" href="#top" aria-label="玲珑 MAS 首页"><img class="brand-mark" src="/LinglongSpriteWebSite/assets/brand_icon.png" alt="玲"/><span>玲珑 MAS</span></a>
    <nav className="site-nav" aria-label="主导航">
      <a href="#features">能力</a><a href="#design">产品截图</a><a href="#download">下载</a>
    </nav>
  </div></header>
}

function DownloadButton({onDownload, className = 'btn-primary'}) {
  return <a className={className} href={apkUrl} download onClick={onDownload}><ArrowDownToLine size={18} />下载 Android 正式版 APK</a>
}

function ReferralBanner({referralCode, copied, onCopy}) {
  if (!referralCode) return null
  return <div className="referral-banner fade-up delay-4">
    <div><span>受邀加入玲珑 MAS</span><strong>邀请码：{referralCode}</strong><small>下载后在 App 首启时完成邀请关联</small></div>
    <button type="button" onClick={onCopy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? '已复制' : '复制推荐码'}</button>
  </div>
}

function Hero({referralCode, copied, onCopy}) {
  return <section id="top" className="hero shell">
    <div className="hero-copy">
      <div className="hero-badge fade-up"><Sparkles size={15} /> Android AI Assistant</div>
      <h1 className="fade-up delay-1">智掌全局，<br />玲珑入微。</h1>
      <p className="hero-lead fade-up delay-2">一款为手机场景重新构建的小智语音助手，把语音、文本、视觉与 MCP 工具连接成自然的一问一答。</p>
      <div className="hero-actions fade-up delay-3"><DownloadButton onDownload={onCopy} /></div>
      <ReferralBanner referralCode={referralCode} copied={copied} onCopy={onCopy} />
    </div>
    <div className="hero-visual fade-up delay-2"><div className="halo halo-a" /><div className="halo halo-b" />
      <figure className="hero-shot"><img src={productScreens[0].src} alt="玲珑 MAS 语音通话界面" /><figcaption><span>LIVE VOICE</span><b>随时开口，自然对话</b></figcaption></figure>
    </div>
  </section>
}

function Features() {
  return <section id="features" className="section shell"><div className="section-head fade-up"><span className="eyebrow"><Box size={15} /> Core Capabilities</span><h2>不是一个入口，<br />而是一套会说话的工具系统。</h2></div>
    <div className="feature-grid">{capabilities.map(({icon: Icon, title, text}, index) => <article className={`feature-card fade-up delay-${Math.min(index + 1, 4)}`} key={title}><div className="feature-icon"><Icon size={22} /></div><h3>{title}</h3><p>{text}</p></article>)}</div>
  </section>
}

function ProductGallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [moveQueue, setMoveQueue] = useState([])
  const touchStartX = useRef(null)
  const requestMove = targetIndex => {
    if (moveQueue.length || targetIndex === activeIndex) return
    const distance = shortestStageDistance(activeIndex, targetIndex, productScreens.length)
    setMoveQueue(Array.from({length: Math.abs(distance)}, () => Math.sign(distance)))
  }
  useEffect(() => {
    if (!moveQueue.length) return undefined
    const [step, ...remainingSteps] = moveQueue
    setActiveIndex(currentIndex => (currentIndex + step + productScreens.length) % productScreens.length)
    const timer = window.setTimeout(() => setMoveQueue(remainingSteps), STAGE_TRANSITION_MS)
    return () => window.clearTimeout(timer)
  }, [moveQueue])
  const handleTouchEnd = event => {
    const startX = touchStartX.current
    touchStartX.current = null
    if (startX === null) return
    const deltaX = event.changedTouches[0].clientX - startX
    if (Math.abs(deltaX) < 36) return
    requestMove((activeIndex + (deltaX < 0 ? 1 : -1) + productScreens.length) % productScreens.length)
  }
  return <section id="design" className="section shell design-section"><div className="section-head center fade-up"><span className="eyebrow">Designed for mobile</span><h2>真实的产品界面，<br />完整的使用路径。</h2><p>从对话到智能体发现，再到会员与邀请，所有体验都在 Android 正式版中呈现。</p></div>
    <div className="product-gallery" aria-label="玲珑 MAS 产品截图，左右滑动或点击样机可环形切换中间展示项" onTouchStart={event => { touchStartX.current = event.touches[0].clientX }} onTouchEnd={handleTouchEnd}>{productScreens.map(({id, src, title, description}, index) => { const slot = stageSlotForItem(index, activeIndex, productScreens.length); return <button className={`product-shot product-shot-${slot} ${index === activeIndex ? 'is-front' : ''}`} type="button" onClick={() => requestMove(index)} aria-pressed={index === activeIndex} key={id}><img src={src} alt={`玲珑 MAS ${title}界面`} loading={index < 2 ? 'eager' : 'lazy'} /><span className="product-shot-caption"><i>0{index + 1}</i><span><b>{title}</b><small>{description}</small></span></span></button> })}</div>
  </section>
}

function Download({onDownload}) {
  return <section id="download" className="section shell"><div className="download-panel fade-up"><div><span className="download-badge"><ShieldCheck size={15} /> Android Production Release</span><h2>现在开始，<br />在 Android 上使用玲珑 MAS。</h2><p>下载正式版 APK 或扫描二维码。</p><div className="download-actions"><DownloadButton onDownload={onDownload} /></div></div><div className="qr-card"><img src={qrUrl} alt="玲珑 MAS 正式版 APK 下载二维码" /><span>扫码下载正式版 APK</span></div></div></section>
}

function App() {
  const [referralCode] = useState(() => readReferralCode(window.location.search))
  const [copied, setCopied] = useState(false)
  const copyReferral = useCallback(() => {
    const payload = referralPayload(referralCode)
    if (!payload || !navigator.clipboard?.writeText) return
    navigator.clipboard.writeText(payload).then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 1800) }).catch(() => {})
  }, [referralCode])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible')), {threshold: 0.12, rootMargin: '0px 0px -40px 0px'})
    document.querySelectorAll('.fade-up').forEach(node => observer.observe(node))
    document.querySelectorAll('.hero .fade-up').forEach(node => window.setTimeout(() => node.classList.add('visible'), 50))
    return () => observer.disconnect()
  }, [])

  return <><Header /><main><Hero referralCode={referralCode} copied={copied} onCopy={copyReferral} /><hr className="divider" /><Features /><hr className="divider" /><ProductGallery /><hr className="divider" /><Download onDownload={copyReferral} /></main><footer className="footer shell"><div><b>玲珑 MAS</b><span>Linglong Master Agent System</span></div><p>Android 正式版已发布。</p></footer></>
}

createRoot(document.getElementById('root')).render(<App />)
