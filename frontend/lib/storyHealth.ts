import type { Edge, Node } from 'reactflow'

export type StoryHealthIssue = {
  severity: 'error' | 'warning' | 'info'
  message: string
}

export type StoryHealth = {
  nodes: number
  edges: number
  scenes: number
  choices: number
  connectedNodes: number
  issues: StoryHealthIssue[]
}

export function analyzeStory(nodes: Node[], edges: Edge[]): StoryHealth {
  const scenes = nodes.filter((node) => node.type === 'characterScene' || node.type === 'scene').length
  const choices = nodes.filter((node) => node.type === 'choice').length
  const connectedIds = new Set<string>()

  edges.forEach((edge) => {
    connectedIds.add(edge.source)
    connectedIds.add(edge.target)
  })

  const issues: StoryHealthIssue[] = []

  nodes.forEach((node) => {
    const title = String(node.data?.title || '').trim()
    const description = String(node.data?.description || '').trim()
    const hasOutgoing = edges.some((edge) => edge.source === node.id)

    if (!title) issues.push({ severity: 'warning', message: `Node ${node.id} has no title.` })
    if ((node.type === 'characterScene' || node.type === 'scene') && !description) {
      issues.push({ severity: 'warning', message: `${title || 'Scene'} has no description.` })
    }
    if (node.type === 'choice') {
      const options = Array.isArray(node.data?.options) ? node.data.options : []
      if (options.length < 2) issues.push({ severity: 'error', message: `${title || 'Choice'} needs at least two options.` })
      if (!hasOutgoing) issues.push({ severity: 'warning', message: `${title || 'Choice'} has no connected outcome.` })
    }
  })

  if (nodes.length > 0 && edges.length === 0) {
    issues.push({ severity: 'warning', message: 'Your story has nodes but no connections yet.' })
  }

  return { nodes: nodes.length, edges: edges.length, scenes, choices, connectedNodes: connectedIds.size, issues }
}
