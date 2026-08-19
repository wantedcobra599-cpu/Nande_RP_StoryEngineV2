export type CharacterStatus = 'active' | 'missing' | 'dead' | 'inactive'

export type Character = {
  id: string
  name: string
  role?: string
  age?: number
  personality?: string
  bio?: string
  status: CharacterStatus
  tags: string[]
  relationships: Relationship[]
  memories: Memory[]
}

export type RelationshipType = 'friend' | 'enemy' | 'family' | 'partner' | 'rival' | 'neutral' | 'unknown'

export type Relationship = {
  characterId: string
  type: RelationshipType
  strength: number
  note?: string
}

export type Memory = {
  id: string
  event: string
  episodeId?: string
  importance: 'low' | 'medium' | 'high'
  timestamp: number
}

export function createCharacter(name = 'New Character'): Character {
  return {
    id: `char-${crypto.randomUUID()}`,
    name,
    role: '',
    personality: '',
    bio: '',
    status: 'active',
    tags: [],
    relationships: [],
    memories: [],
  }
}

export function addMemory(character: Character, event: string, importance: Memory['importance'] = 'medium', episodeId?: string): Character {
  if (!event.trim()) return character
  return {
    ...character,
    memories: [...character.memories, {
      id: `memory-${crypto.randomUUID()}`,
      event: event.trim(),
      importance,
      episodeId,
      timestamp: Date.now(),
    }],
  }
}

export function relationshipLabel(type: RelationshipType): string {
  return type.charAt(0).toUpperCase() + type.slice(1)
}
