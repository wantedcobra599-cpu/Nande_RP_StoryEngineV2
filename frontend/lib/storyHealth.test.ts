import { describe, expect, it } from 'vitest'
import { analyzeStory } from './storyHealth'

describe('analyzeStory', () => {
  it('reports an empty story as healthy', () => {
    const result = analyzeStory([], [])
    expect(result.nodes).toBe(0)
    expect(result.issues).toHaveLength(0)
  })

  it('finds missing scene descriptions and disconnected choices', () => {
    const result = analyzeStory([
      { id: 'scene-1', type: 'characterScene', position: { x: 0, y: 0 }, data: { title: 'Intro', description: '' } },
      { id: 'choice-1', type: 'choice', position: { x: 200, y: 0 }, data: { title: 'Decision', options: ['A'] } },
    ], [])

    expect(result.issues.some((issue) => issue.message.includes('Intro'))).toBe(true)
    expect(result.issues.some((issue) => issue.message.includes('Decision needs at least two options'))).toBe(true)
  })

  it('counts connected nodes', () => {
    const result = analyzeStory([
      { id: 'a', type: 'characterScene', position: { x: 0, y: 0 }, data: { title: 'A', description: 'Start' } },
      { id: 'b', type: 'characterScene', position: { x: 200, y: 0 }, data: { title: 'B', description: 'End' } },
    ], [{ id: 'e1', source: 'a', target: 'b' }])

    expect(result.connectedNodes).toBe(2)
    expect(result.issues).toHaveLength(0)
  })
})
