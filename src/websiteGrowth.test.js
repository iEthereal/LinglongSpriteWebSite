import assert from 'node:assert/strict'
import test from 'node:test'
import {trackWebsiteEvent} from './websiteGrowth.js'

test('sends only a fixed anonymous website event envelope', async () => {
  let request
  await trackWebsiteEvent({
    baseUrl: 'https://project.supabase.co/functions/v1/growth-api',
    eventName: 'agent_landing_view',
    fetchImpl: async (_url, init) => {
      request = {url: _url, init}
      return new Response('{}', {status: 200})
    },
    eventId: 'website-event-1234',
  })
  assert.equal(request.url, 'https://project.supabase.co/functions/v1/growth-api')
  assert.deepEqual(JSON.parse(request.init.body), {
    action: 'website-events',
    events: [{eventId: 'website-event-1234', eventName: 'agent_landing_view'}],
  })
})

test('allows homepage views and sends only a precomputed share-key hash', async () => {
  let request
  await trackWebsiteEvent({
    baseUrl: 'https://project.supabase.co/functions/v1/growth-api',
    eventName: 'landing_view',
    shareKeyHash: 'a'.repeat(64),
    fetchImpl: async (_url, init) => {
      request = {url: _url, init}
      return new Response('{}', {status: 200})
    },
    eventId: 'website-event-5678',
  })
  assert.deepEqual(JSON.parse(request.init.body), {
    action: 'website-events',
    events: [{eventId: 'website-event-5678', eventName: 'landing_view', shareKeyHash: 'a'.repeat(64)}],
  })
})

test('does nothing when the public growth endpoint is not configured', async () => {
  let called = false
  await trackWebsiteEvent({eventName: 'apk_download_clicked', fetchImpl: async () => { called = true }})
  assert.equal(called, false)
})
