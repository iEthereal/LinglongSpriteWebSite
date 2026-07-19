import assert from 'node:assert/strict'
import test from 'node:test'
import {shortestStageDistance, stageSlotForItem} from './productStage.js'

test('places the active item in the center and mirrors adjacent slots', () => {
  assert.equal(stageSlotForItem(2, 2, 5), 2)
  assert.equal(stageSlotForItem(1, 2, 5), 1)
  assert.equal(stageSlotForItem(3, 2, 5), 3)
  assert.equal(stageSlotForItem(0, 2, 5), 0)
  assert.equal(stageSlotForItem(4, 2, 5), 4)
})

test('chooses opposite one-step rotations for matching left and right targets', () => {
  assert.equal(shortestStageDistance(2, 3, 5), 1)
  assert.equal(shortestStageDistance(2, 1, 5), -1)
})
