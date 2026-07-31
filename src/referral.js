const referralPattern = /^[A-Z0-9_-]{5,12}$/

export function isReferralCode(value) {
  return typeof value === 'string' && referralPattern.test(value)
}

export function readReferralCode(search) {
  const code = new URLSearchParams(search).get('ref')?.trim() ?? ''
  return isReferralCode(code) ? code : ''
}

export function referralPayload(code) {
  const normalized = code.trim()
  return isReferralCode(normalized) ? `LL_REF:${normalized}` : ''
}
