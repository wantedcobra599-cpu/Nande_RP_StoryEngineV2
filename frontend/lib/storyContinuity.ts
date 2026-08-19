import type { Edge, Node } from 'reactflow'
import type { Character } from './characterSystem'

export type ContinuityIssue = {
  severity: 'error' | 'warning'
  message: string
  nodeId?: string
}

export function checkContinuity(nodes: Node[], edges: Edge[], characters: Character[] = []): ContinuityIssue[] {
  const issues: ContinuityIssue[] = []
  const characterIds = new Set(characters.map((c) => c.id))

  nodes.forEach((node) => {
    const data = node.data || {}
    const title = String(data.title || 'Untitled scene')
    const characterId = data.characterId

    if (characterId && characters.length && !characterIds.has(characterId)) {
      issues.push({ severity: 'error', message: `${title} references a character that no longer exists.`, nodeId: node.id })
    }

    if (data.character && characters.length) {
      const character = characters.find((c) => c.name.toLowerCase() === String(data.character).toLowerCase())
      if (character?.status === 'dead') {
        issues.push({ severity: 'error', message: `${title} uses ${character.name}, who is marked dead.`, nodeId: node.id })
      }
    }

    const outgoing = edges.filter((edge) => edge.source === node.id)
    if (node.type === 'characterScene' && outgoing.length === 0) {
      issues.push({ severity: 'warning', message: `${title} is an ending scene with no next scene.`, nodeId: node.id })
    }
  })

  return issues
}
