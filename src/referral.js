export function readReferralCode(search) {
  return new URLSearchParams(search).get('ref')?.trim() ?? ''
}

export function referralPayload(code) {
  const normalized = code.trim()
  return normalized ? `LL_REF:${normalized}` : ''
}
