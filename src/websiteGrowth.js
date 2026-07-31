const allowedEventNames = new Set(['agent_landing_view', 'apk_download_clicked'])

export async function trackWebsiteEvent({baseUrl, eventName, fetchImpl = fetch, eventId = crypto.randomUUID()}) {
  if (!baseUrl || !allowedEventNames.has(eventName)) return
  try {
    await fetchImpl(baseUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({action: 'website-events', events: [{eventId, eventName}]}),
      keepalive: true,
    })
  } catch {}
}
