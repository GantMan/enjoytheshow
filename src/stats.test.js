import { describe, expect, test } from 'vitest'
import { toRoomSlug } from './RoomForm'
import { getFaceStats } from './WatchRoom'

describe('toRoomSlug', () => {
  test('makes URL-safe room names', () => {
    expect(toRoomSlug('JSConf Keynote!')).toBe('jsconf-keynote')
    expect(toRoomSlug('   ')).toBe('')
  })
})

describe('getFaceStats', () => {
  test('counts every detected face in the room', () => {
    const { chart, total } = getFaceStats([
      { emotion: 'happy,neutral' },
      { emotion: 'happy' },
      { emotion: 'unknown' },
    ])
    expect(total).toBe(4)
    expect(chart.find((c) => c.x === 'Happy').y).toBe(2)
    expect(chart.find((c) => c.x === 'Neutral').y).toBe(1)
  })
})
