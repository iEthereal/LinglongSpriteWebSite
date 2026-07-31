import {isReferralCode} from './referral.js'

const shareKeyPattern = /^[A-Za-z0-9_-]{12,64}$/
const templateFields = new Set([
  'name',
  'character',
  'voice',
  'language',
  'assistantName',
  'icon',
  'model',
  'themeColor',
])

export function isShareKey(value) {
  return typeof value === 'string' && shareKeyPattern.test(value)
}

export function readAgentShareRoute(pathname) {
  const match = /^\/agent\/([A-Za-z0-9_-]{12,64})$/.exec(pathname)
  return match && isShareKey(match[1]) ? match[1] : ''
}

export function buildAgentSharePayload(shareKey, referralCode) {
  return isShareKey(shareKey) && isReferralCode(referralCode)
    ? `LL_SHARE:${shareKey}|${referralCode}`
    : ''
}

function sanitizeTemplate(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, field]) =>
      templateFields.has(key) && typeof field === 'string' ? [[key, field]] : [],
    ),
  )
}

export async function loadPublicAgentShare({baseUrl, shareKey, fetchImpl = fetch}) {
  if (!baseUrl || !isShareKey(shareKey)) throw new Error('作品链接无效')
  const url = new URL(baseUrl)
  url.searchParams.set('shareKey', shareKey)
  const response = await fetchImpl(url)
  if (!response.ok) throw new Error('作品暂时无法加载')

  const payload = await response.json()
  const raw = payload?.share
  if (!raw || !isShareKey(raw.shareKey) || !isReferralCode(raw.referralCode)) {
    throw new Error('作品数据无效')
  }

  return {
    shareKey: raw.shareKey,
    creatorName: typeof raw.creatorName === 'string' ? raw.creatorName : '',
    referralCode: raw.referralCode,
    template: sanitizeTemplate(raw.template),
  }
}
