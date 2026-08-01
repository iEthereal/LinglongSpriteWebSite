const allowedEventNames = new Set(['landing_view', 'agent_landing_view', 'apk_download_clicked'])
const shareKeyHashPattern = /^[a-f0-9]{64}$/

export async function trackWebsiteEvent({baseUrl, eventName, shareKeyHash, fetchImpl = fetch, eventId = crypto.randomUUID()}) {
  if (!baseUrl || !allowedEventNames.has(eventName)) return
  try {
    await fetchImpl(baseUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        action: 'website-events',
        events: [{
          eventId,
          eventName,
          ...(typeof shareKeyHash === 'string' && shareKeyHashPattern.test(shareKeyHash) ? {shareKeyHash} : {}),
        }],
      }),
      keepalive: true,
    })
  } catch {}
}

export async function hashShareKey(shareKey) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(shareKey))
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
}
