function modulo(value, base) {
  return ((value % base) + base) % base
}

export function stageSlotForItem(itemIndex, activeIndex, count) {
  const centerSlot = Math.floor(count / 2)
  let relative = modulo(itemIndex - activeIndex, count)
  if (relative > centerSlot) relative -= count
  return centerSlot + relative
}

export function shortestStageDistance(activeIndex, targetIndex, count) {
  const forward = modulo(targetIndex - activeIndex, count)
  const backward = forward - count
  return Math.abs(forward) <= Math.abs(backward) ? forward : backward
}
