import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import test from 'node:test'
import {readReferralCode, referralPayload} from './referral.js'

test('trims a referral code from the URL query', () => {
  assert.equal(readReferralCode('?ref=%20FRIEND-7%20'), 'FRIEND-7')
  assert.equal(readReferralCode('?ref=%20%20'), '')
  assert.equal(readReferralCode(''), '')
})

test('formats the APK handoff payload', () => {
  assert.equal(referralPayload(' FRIEND-7 '), 'LL_REF:FRIEND-7')
  assert.equal(referralPayload(' '), '')
})

test('ships current product screenshots and production download copy', () => {
  const source = readFileSync(new URL('./main.jsx', import.meta.url), 'utf8')

  for (const asset of [
    '语音通话.png',
    '文本聊天.png',
    '发现智能体.png',
    '列表对话.png',
    '会员与邀请.png',
  ]) {
    assert.match(source, new RegExp(asset))
  }

  assert.doesNotMatch(
    source,
    /linglong-(idle|speaking|searching|listening)\.png|app-glass-ui\.png/,
  )
  assert.match(source, /Android 正式版 APK/)
  assert.match(
    source,
    /github\.com\/iEthereal\/LinglongSpriteWebSite\/releases\/latest\/download\/linglong-mas\.apk/,
  )
  assert.doesNotMatch(source, /downloads\/linglong-mas\.apk/)
})
