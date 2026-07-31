import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildAgentSharePayload,
  loadPublicAgentShare,
  readAgentShareRoute,
} from './agentShare.js'

test('accepts a valid work route and rejects path traversal', () => {
  assert.equal(readAgentShareRoute('/agent/abc_DEF-1234'), 'abc_DEF-1234')
  assert.equal(readAgentShareRoute('/agent/../../secret'), '')
  assert.equal(readAgentShareRoute('/agent/short'), '')
})

test('builds an exact App handoff only for valid public identifiers', () => {
  assert.equal(
    buildAgentSharePayload('abc_DEF-1234', 'FRIEND7'),
    'LL_SHARE:abc_DEF-1234|FRIEND7',
  )
  assert.equal(buildAgentSharePayload('abc_DEF-1234', 'friend7'), '')
  assert.equal(buildAgentSharePayload('../secret', 'FRIEND7'), '')
})

test('allows only the documented public share response fields', async () => {
  let requestedUrl = ''
  const share = await loadPublicAgentShare({
    baseUrl: 'https://project.supabase.co/functions/v1/share-api',
    shareKey: 'abc_DEF-1234',
    fetchImpl: async url => {
      requestedUrl = String(url)
      return new Response(JSON.stringify({
        share: {
          shareKey: 'abc_DEF-1234',
          creatorName: '阿玲',
          referralCode: 'FRIEND7',
          template: {
            name: '睡前故事',
            character: '温柔陪伴',
            token: 'must-not-pass',
          },
          mcpEndpoint: 'must-not-pass',
        },
      }))
    },
  })

  assert.equal(
    requestedUrl,
    'https://project.supabase.co/functions/v1/share-api?shareKey=abc_DEF-1234',
  )
  assert.deepEqual(share, {
    shareKey: 'abc_DEF-1234',
    creatorName: '阿玲',
    referralCode: 'FRIEND7',
    template: {name: '睡前故事', character: '温柔陪伴'},
  })
})
